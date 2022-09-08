import { request, ResponseProps } from '../request';
import { FORMS, GROUPS, ROLES } from '../constants/endpoints';
import { ADD_GROUP_FORM_ID, EDIT_GROUP_FORM_ID } from '../constants/common';
interface FormProps {
    components: any;
}

interface GetRolesProps {
    roleId: string;
    roleName: string;
}
interface FormioSelectFieldProps {
    label: string;
    value: string;
}

interface FormioField {
    key: string;
    label: string;
    data: {
        values: FormioSelectFieldProps[] | [];
    };
}
interface FormioSchema {
    display: string;
    components: FormioField[];
}

interface Groups {
    name: string;
    groupId: string;
}

interface UserForm {
    addUserFormioForm: FormioSchema;
    editUserFormioForm: FormioSchema;
}

interface GroupForm {
    addGroupForm: FormioSchema;
    editGroupForm: FormioSchema;
}

export const GET_ROLES_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${ROLES}`;
export const GET_GROUPS_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${GROUPS}`;
export const GET_FORM_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${FORMS}`;

export const getGroups = async (): Promise<FormioSelectFieldProps[] | []> => {
    const r: ResponseProps = (await request.get(GET_GROUPS_ENDPOINT)) as ResponseProps;
    if (r.success) {
        const data: Groups[] = r.data as Groups[];
        return data.map((group: Groups) => {
            return {
                label: group.name,
                value: group.name,
            };
        });
    }
    return [];
};

export const getRoles = async (): Promise<FormioSelectFieldProps[] | []> => {
    const r: ResponseProps = (await request.get(GET_ROLES_ENDPOINT)) as ResponseProps;
    if (r && r.success) {
        const data: GetRolesProps[] = r.data as GetRolesProps[];
        return data.map((role) => {
            return {
                label: role.roleName,
                value: role.roleName,
            };
        });
    }
    return [];
};

export const getFormById = async (formid: string) => {
    const res: ResponseProps = (await request.get(`${GET_FORM_ENDPOINT}/${formid}`)) as ResponseProps;

    if (res && res.success) {
        const { components } = res.data as FormProps;
        return components;
    }
    return {};
};

// USER FORMS
export const generateUserForm = async (addUerFormId: string, editUserFormId: string): Promise<UserForm> => {
    const groups: FormioSelectFieldProps[] | [] = await getGroups();
    const roles: FormioSelectFieldProps[] | [] = await getRoles();
    const addUserFormioForm: FormioSchema = await getFormById(addUerFormId);
    const editUserFormioForm: FormioSchema = await getFormById(editUserFormId);
    const modifyForm = (userForm: FormioSchema) => {
        userForm.components &&
            userForm.components.forEach((field) => {
                if (field.key === 'groups') {
                    field.data.values = groups;
                }
                if (field.key === 'roles') {
                    field.data.values = roles;
                }
            });
    };
    modifyForm(addUserFormioForm);
    modifyForm(editUserFormioForm);

    return { addUserFormioForm, editUserFormioForm };
};

// GROUP FORMS
export const generateGroupForm = async (): Promise<GroupForm> => {
    const roles: FormioSelectFieldProps[] | [] = await getRoles();
    const addGroupForm: FormioSchema = await getFormById(ADD_GROUP_FORM_ID);
    const editGroupForm: FormioSchema = await getFormById(EDIT_GROUP_FORM_ID);
    const modifyForm = (userForm: FormioSchema) => {
        userForm.components &&
            userForm.components.forEach((field) => {
                if (field.key === 'roles') {
                    field.data.values = roles;
                }
            });
    };
    modifyForm(addGroupForm);
    modifyForm(editGroupForm);

    return { addGroupForm, editGroupForm };
};
