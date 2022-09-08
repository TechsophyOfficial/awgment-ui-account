import {
    getGroups,
    getGroupById,
    handleGroupAction,
} from '../GroupService';
import { request, ResponseProps } from '../../request';
import { GROUP_PROCESS_DEFINITION_KEY } from '../../constants/common';

jest.mock('../../request');

const mockedRequest = request as jest.Mocked<typeof request>;

const successResponse = (data) => {
    const res: ResponseProps = {
        success: true,
        message: 'Success Response',
    };
    if (data) {
        res.data = data;
    }
    return res;
};

const errorResponse = () => {
    return {
        success: false,
        message: 'Error Response',
    };
};

describe('getGroups', () => {
    afterEach(jest.clearAllMocks);
    const data = {
        totalElements: 0,
        page: 1,
        size: 5,
        content: [],
    };
    test('fetches successfully data from an API', async () => {
        mockedRequest.get.mockResolvedValue(successResponse(data));
        const result = await getGroups(10, 2, 'api', 'groupName', 'desc', 'xyz');
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(result).toEqual(successResponse(data));
    });

    test('getGroups() should call wilth proper Request URL', async () => {
        await getGroups(10, 2, 'api', 'groupName', 'desc', 'xyz');
        expect(mockedRequest.get).toHaveBeenCalledWith(
            `api/accounts/v1/groups?size=10&page=2&sort-by=groupName:desc&q=xyz`,
        );
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.get.mockResolvedValue(errorResponse());
        const result = await getGroups(10, 2, 'api', 'groupName', 'desc', 'xyz');
        expect(result).toEqual(errorResponse());
    });
});

describe('getGroupById', () => {
    afterEach(jest.clearAllMocks);
    const data = {
        id: '123',
        name: 'Group 1',
        roles: ['2343', '2324'],
    };
    test('fetches successfully data from an API', async () => {
        mockedRequest.get.mockResolvedValue(successResponse(data));
        const result = await getGroupById('123', 'api');
        expect(mockedRequest.get).toHaveBeenCalledTimes(1);
        expect(mockedRequest.get).toHaveBeenCalledWith('api/accounts/v1/groups/123');
        expect(result).toEqual(successResponse(data));
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.get.mockResolvedValue(errorResponse());
        const result = await getGroupById('123', 'api');
        expect(result).toEqual(errorResponse());
    });
});

describe('Add Group testing', () => {
    afterEach(jest.clearAllMocks);
    const groupData = {
        submit: true,
        id: '123',
        groupId: '123',
        name: 'testOne',
        description: 'Sample Description',
        roles: ['2342454', '32456'],
    };

    const { submit, ...others } = groupData;

    const reqObj = {
        processDefinitionKey: GROUP_PROCESS_DEFINITION_KEY,
        businessKey: groupData.name,
        variables: {
            action: 'add',
            groupData: JSON.stringify({ ...others }),
        },
    };

    test('fetches successfully data from an API', async () => {
        mockedRequest.post.mockResolvedValue(successResponse(groupData));
        const result = await handleGroupAction('add', 'api', null, groupData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(mockedRequest.post).toHaveBeenCalledWith('api/workflow/v1/process/start', reqObj);
        expect(result).toEqual({ success: true, message: 'Group details submitted successfully' });
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.post.mockResolvedValue(errorResponse());
        const result = await handleGroupAction('add', 'api', null, groupData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(errorResponse());
    });
});

describe('Edit Group testing', () => {
    afterEach(jest.clearAllMocks);
    const groupData = {
        submit: true,
        id: '456',
        groupId: '123',
        name: 'testOne',
        description: 'Sample Description',
        roles: ['2342454', '32456'],
    };

    const reqObj = {
        processDefinitionKey: GROUP_PROCESS_DEFINITION_KEY,
        businessKey: groupData.id,
        variables: {
            action: 'update',
            groupData: JSON.stringify({
                groupId: '123',
                name: 'testOne',
                description: 'Sample Description',
                roles: ['2342454', '32456'],
                id: '456',
            }),
        },
    };

    test('fetches successfully data from an API', async () => {
        mockedRequest.post.mockResolvedValue(successResponse(groupData));
        const result = await handleGroupAction('update', 'api', '456', groupData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(mockedRequest.post).toHaveBeenCalledWith('api/workflow/v1/process/start', reqObj);
        expect(result).toEqual({ success: true, message: 'Group updated successfully' });
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.post.mockResolvedValue(errorResponse());
        const result = await handleGroupAction('update', 'api', null, groupData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(errorResponse());
    });
});

describe('Delete Group testing', () => {
    afterEach(jest.clearAllMocks);

    const groupData = {
        submit: true,
        id: '456',
        groupId: '123',
        name: 'testOne',
        description: 'Sample Description',
        roles: ['2342454', '32456'],
    };
    const reqObj = {
        processDefinitionKey: GROUP_PROCESS_DEFINITION_KEY,
        businessKey: '456',
        variables: {
            action: 'delete',
            groupData: JSON.stringify({
                groupId: '123',
                name: 'testOne',
                description: 'Sample Description',
                id: '456',
            }),
        },
    };

    test('fetches successfully data from an API', async () => {
        mockedRequest.post.mockResolvedValue(successResponse({}));
        const result = await handleGroupAction('delete', 'api', '456', groupData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(mockedRequest.post).toHaveBeenCalledWith('api/workflow/v1/process/start', reqObj);
        expect(result).toEqual({ success: true, message: 'Group deleted successfully' });
    });

    test('fetches erroneously data from an API', async () => {
        mockedRequest.post.mockResolvedValue(errorResponse());
        const result = await handleGroupAction('delete', 'api', '456', groupData);
        expect(mockedRequest.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(errorResponse());
    });
});
