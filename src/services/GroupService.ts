import { request, ResponseProps } from '../request';
import { GROUPS, START_PROCESS } from '../constants/endpoints';
import { GROUP_PROCESS_DEFINITION_KEY } from '../constants/common';

interface Id {
    id: string;
}
interface Name {
    name: string;
}

interface IdName extends Id, Name {}

interface IdNameDescription extends IdName {
    description: string;
    groupId: string;
}

interface NameDescription extends Name {
    description: string;
    groupId: string;
}
export interface GroupData extends IdNameDescription {
    roles: string[];
}

interface UpdateGroupReq extends NameDescription {
    roles: string[];
}

export interface GroupTableData {
    totalElements: number;
    page: number;
    size: number;
    content: GroupData[] | [];
}

export interface FormioSubmissionData extends GroupData {
    submit?: boolean;
}

export type Action = 'add' | 'update' | 'delete';
interface GroupActionReqObjProps {
    processDefinitionKey: string;
    businessKey: string;
    variables: {
        action: Action;
        groupData?: string;
    };
}

export const GET_GROUPS_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${GROUPS}`;
export const START_PROCESS_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${START_PROCESS}`;

export const getGroups = async (
    rowsPerPage = 5,
    page = 1,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    searchTerm?: string,
): Promise<{ success: boolean; message?: string; data?: GroupTableData }> => {
    const sort = sortBy && sortDirection ? `&sort-by=${sortBy}:${sortDirection}` : '';
    const search = searchTerm ? `&q=${searchTerm}` : '';
    const r: ResponseProps = (await request.get(
        `${GET_GROUPS_ENDPOINT}?size=${rowsPerPage}&page=${page}${sort}${search}`,
    )) as ResponseProps;
    if (r && r.success) {
        const data: GroupTableData = r.data as GroupTableData;
        return { success: true, message: r.message, data: data };
    }
    return { success: false, message: r && r.message };
};

export const getGroupById = async (id: string): Promise<{ success: boolean; message?: string; data?: GroupData }> => {
    const r: ResponseProps = (await request.get(`${GET_GROUPS_ENDPOINT}/${id}`)) as ResponseProps;
    if (r.success) {
        const data: GroupData = r.data as GroupData;
        return { success: true, message: r.message, data: data };
    }
    return { success: false, message: r.message };
};

export const handleGroupAction = async (
    action: Action,
    id?: string | null,
    groupData?: FormioSubmissionData | null,
): Promise<{ success: boolean; message?: string }> => {
    let reqObj = {};
    let successMessage = '';
    const generateReqObj = (
        businessKey: string,
        groupId: string | null,
        groupReqData: UpdateGroupReq | NameDescription | null,
    ): GroupActionReqObjProps => {
        const data: { action: Action; groupId?: string; groupData?: string } = { action };
        const groupObj = groupReqData ? { ...groupReqData } : {};
        if (groupId) {
            groupObj['id'] = groupId;
        }

        data.groupData = JSON.stringify(groupObj);

        return {
            processDefinitionKey: GROUP_PROCESS_DEFINITION_KEY,
            businessKey: businessKey,
            variables: {
                ...data,
            },
        };
    };

    if (action === 'add' && groupData) {
        delete groupData.submit;
        reqObj = generateReqObj(groupData.name, null, groupData);
        successMessage = 'Group details submitted successfully';
    }
    if (action === 'update' && id && groupData) {
        const updateObj: UpdateGroupReq = {
            groupId: groupData.groupId,
            name: groupData.name,
            description: groupData.description,
            roles: groupData.roles,
        };
        successMessage = 'Group updated successfully';
        reqObj = generateReqObj(groupData.id, id, updateObj);
    }
    if (action === 'delete' && id && groupData) {
        const deleteObj: NameDescription = {
            groupId: groupData.groupId,
            name: groupData.name,
            description: groupData.description,
        };
        successMessage = 'Group deleted successfully';
        reqObj = generateReqObj(id, id, deleteObj);
    }

    const res: ResponseProps = (await request.post(START_PROCESS_ENDPOINT, reqObj)) as ResponseProps;
    if (res.success) {
        return { success: true, message: successMessage };
    }
    return { success: false, message: res.message };
};
