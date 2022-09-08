import {
    GET_USERS_ENDPOINT,
    START_PROCESS_ENDPOINT,
    getAllUsers,
    getUserDetails,
    addOrEditOrDeleteUser,
} from '../UserService';
import { request } from '../../request';
import { USER_PROCESS_DEFINITION_KEY } from '../../constants/common';

jest.mock('../../request');

const mockedRequest = request as jest.Mocked<typeof request>;

const successResponse = (data) => {
    return {
        success: true,
        message: 'Success Response',
        data: data,
    };
};

const errorResponse = () => {
    return {
        success: false,
        message: 'Error Response',
    };
};

describe('getAllUsers', () => {
    afterEach(jest.clearAllMocks);
    const data = {
        totalElements: 0,
        page: 1,
        size: 5,
        content: [],
    };
    test('fetches successfully data from an API', async () => {
        mockedRequest.get.mockResolvedValue(successResponse(data));
        const result = await getAllUsers();
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(successResponse(data));
    });

    test('getAllUsers() should call wilth proper Request URL', async () => {
        await getAllUsers(10, 2, 'userName', 'desc', 'xyz');
        expect(mockedRequest.get).toHaveBeenCalledWith(
            `${GET_USERS_ENDPOINT}?only-mandatory-fields=true&size=10&page=2&sort-by=userName:desc&q=xyz`,
        );
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.get.mockResolvedValue(errorResponse());
        const result = await getAllUsers();
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ success: false, message: 'Unable to fetch users' });
    });
});

describe('getUserDetails', () => {
    afterEach(jest.clearAllMocks);
    const data = {
        id: '123',
        userId: '123223',
        userData: {
            userName: 'testOne',
            firstName: 'Test',
            lastName: 'One',
            mobileNumber: '211435453',
            emailId: 'test@gmail.com',
            department: 'IT',
            roles: [],
        },
    };
    test('fetches successfully data from an API', async () => {
        mockedRequest.get.mockResolvedValue(successResponse(data));
        const result = await getUserDetails('123');
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(successResponse(data));
    });

    test('getUserDetails() should call wilth proper Request URL', async () => {
        await getUserDetails('123');
        expect(mockedRequest.get).toHaveBeenCalledWith(`${GET_USERS_ENDPOINT}/123`);
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.get.mockResolvedValue(errorResponse());
        const result = await getUserDetails('123');
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ success: false });
    });
});

describe('Add User testing', () => {
    afterEach(jest.clearAllMocks);
    const userData = {
        submit: true,
        id: '123',
        userName: 'testOne',
        firstName: 'Test',
        lastName: 'One',
        mobileNumber: '211435453',
        emailId: 'test@gmail.com',
        department: 'IT',
    };

    const { submit, ...others } = userData;

    const reqObj = {
        processDefinitionKey: USER_PROCESS_DEFINITION_KEY,
        businessKey: userData.userName,
        variables: {
            action: 'add',
            userData: JSON.stringify({ ...others }),
        },
    };

    test('fetches successfully data from an API', async () => {
        mockedRequest.post.mockResolvedValue(successResponse(userData));
        const result = await addOrEditOrDeleteUser('add', null, userData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(mockedRequest.post).toHaveBeenCalledWith(START_PROCESS_ENDPOINT, reqObj);
        expect(result).toEqual({ success: true, message: 'User added successfully' });
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.post.mockResolvedValue(errorResponse());
        const result = await addOrEditOrDeleteUser('add', null, userData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(errorResponse());
    });
});

describe('Edit User testing', () => {
    afterEach(jest.clearAllMocks);
    const userData = {
        submit: true,
        id: '123',
        userName: 'testOne',
        firstName: 'Test',
        lastName: 'One',
        mobileNumber: '211435453',
        emailId: 'test@gmail.com',
        department: 'IT',
    };

    const { submit, ...others } = userData;

    const reqObj = {
        processDefinitionKey: USER_PROCESS_DEFINITION_KEY,
        businessKey: userData.userName,
        variables: {
            action: 'update',
            userId: '123',
            userData: JSON.stringify({ ...others }),
        },
    };

    test('fetches successfully data from an API', async () => {
        mockedRequest.post.mockResolvedValue(successResponse(userData));
        const result = await addOrEditOrDeleteUser('update', '123', userData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(mockedRequest.post).toHaveBeenCalledWith(START_PROCESS_ENDPOINT, reqObj);
        expect(result).toEqual({ success: true, message: 'User updated successfully' });
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.post.mockResolvedValue(errorResponse());
        const result = await addOrEditOrDeleteUser('add', null, userData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(errorResponse());
    });
});

describe('Delete User testing', () => {
    afterEach(jest.clearAllMocks);

    const reqObj = {
        processDefinitionKey: USER_PROCESS_DEFINITION_KEY,
        businessKey: 'wasimK',
        variables: {
            action: 'delete',
            userId: '456',
        },
    };

    test('fetches successfully data from an API', async () => {
        mockedRequest.post.mockResolvedValue(successResponse({}));
        const result = await addOrEditOrDeleteUser('delete', '456', null, 'wasimK');
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(mockedRequest.post).toHaveBeenCalledWith(START_PROCESS_ENDPOINT, reqObj);
        expect(result).toEqual({ success: true, message: 'User deleted successfully' });
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.post.mockResolvedValue(errorResponse());
        const result = await addOrEditOrDeleteUser('delete', '456', null, 'wasimK');
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(errorResponse());
    });
});
