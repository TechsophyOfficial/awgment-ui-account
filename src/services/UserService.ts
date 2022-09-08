import { request, ResponseProps } from '../request';
import { START_PROCESS, USERS } from '../constants/endpoints';
import { USER_PROCESS_DEFINITION_KEY } from '../constants/common';

interface Id {
    id: string;
}
interface EditUserData {
    userName: string;
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailId: string;
    department: string;
    // groups: string[];
    // roles: string[];
}

export interface UserData extends Id, EditUserData {}

export interface UserInfo {
    totalElements: number;
    page: number;
    size: number;
    content: UserData[] | [];
}

export interface EditUserDataResponse extends Id {
    userId: string;
    userData: EditUserData;
}

export interface FormioSubmissionData extends UserData {
    submit?: boolean;
}

type Actions = 'add' | 'update' | 'delete';
interface AddOrEditOrDeleteUserReqObjProps {
    processDefinitionKey: string;
    businessKey: string;
    variables: {
        action: Actions;
        userId?: string;
        userData?: string;
    };
}

// export const GET_USERS_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${USERS}`;
// export const START_PROCESS_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${START_PROCESS}`;

export const getAllUsers = async (
    rowsPerPage = 5,
    page = 1,
    apiUrl: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc',
    searchTerm?: string,
): Promise<{ success: boolean; message?: string; data?: UserInfo }> => {
    const sort = sortBy && sortDirection ? `&sort-by=${sortBy}:${sortDirection}` : '';
    const search = searchTerm ? `&q=${searchTerm}` : '';
    const r: ResponseProps = (await request.get(
        `${apiUrl}${USERS}?only-mandatory-fields=true&size=${rowsPerPage}&page=${page}${sort}${search}`,
    )) as ResponseProps;
    if (r && r.success) {
        const data: UserInfo = r.data as UserInfo;
        return { success: true, message: r.message, data: data };
    }
    return { success: false, message: 'Unable to fetch users' };
};

export const getUserDetails = async (
    id: string,
    apiUrl: string,
): Promise<{ success: boolean; message?: string; data?: EditUserDataResponse }> => {
    const r: ResponseProps = (await request.get(`${apiUrl}${USERS}/${id}`)) as ResponseProps;
    if (r && r.success) {
        const data: EditUserDataResponse = r.data as EditUserDataResponse;
        return { success: true, message: r.message, data: data };
    }
    return { success: false };
};

export const addOrEditOrDeleteUser = async (
    action: 'add' | 'update' | 'delete',
    apiUrl: string,
    id?: string | null,
    userData?: FormioSubmissionData | null,
    userName?: string | null,
): Promise<{ success: boolean; message?: string }> => {
    let reqObj = {};
    let successMessage = '';
    const generateReqObj = (
        username: string,
        userid: string | null,
        userdata: EditUserData | null,
    ): AddOrEditOrDeleteUserReqObjProps => {
        const data: { action: 'add' | 'update' | 'delete'; userId?: string; userData?: string } = { action };
        if (userid) {
            data.userId = userid;
        }
        if (userdata) {
            data.userData = JSON.stringify(userdata);
        }

        return {
            processDefinitionKey: USER_PROCESS_DEFINITION_KEY,
            businessKey: username,
            variables: {
                ...data,
            },
        };
    };
    if (action === 'add' && userData) {
        delete userData.submit;
        reqObj = generateReqObj(userData.userName, null, userData);
        successMessage = 'User added successfully';
    }
    if (action === 'update' && id && userData) {
        delete userData.submit;
        successMessage = 'User updated successfully';
        reqObj = generateReqObj(userData.userName, id, userData);
    }
    if (action === 'delete' && id && userName) {
        successMessage = 'User deleted successfully';
        reqObj = generateReqObj(userName, id, null);
    }

    const START_PROCESS_ENDPOINT = `${apiUrl}${START_PROCESS}`;
    const res: ResponseProps = (await request.post(START_PROCESS_ENDPOINT, reqObj)) as ResponseProps;
    debugger;
    if (res.success) {
        return { success: true, message: successMessage };
    }
    return { success: false, message: res.message };
};
