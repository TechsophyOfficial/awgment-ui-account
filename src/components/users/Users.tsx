import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form } from 'react-formio';
import UserContext from '../../contexts/userContext/user-context';
import {
    UserData,
    EditUserDataResponse,
    FormioSubmissionData,
    getAllUsers,
    getUserDetails,
    addOrEditOrDeleteUser,
} from '../../services/UserService';
import { generateUserForm } from '../../services/CommonService';
import Popup from 'tsf_popup/dist/components/popup';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { ACTION_DELETE, ACTION_EDIT, USER_TABLE_HEADERS } from '../../constants/common';
import NotificationContext from '../../contexts/notificationContext/notification-context';
import ConfirmationContext from '../../contexts/confirmationContext/confirmation-context';
import SpinnerContext from '../../contexts/spinnerContext/spinner-context';
import DataList from 'tsf_datalist/dist/components/dataList';
import MfeDataContext from '../../contexts/mfeDataContext copy/mfeData-context';
import AppConfig from '../../appConfig';

const actions = [
    {
        actionId: ACTION_EDIT,
        actionName: 'Edit',
        actionIcon: EditOutlined,
    },
    {
        actionId: ACTION_DELETE,
        actionName: 'Delete',
        actionIcon: DeleteOutlined,
    },
];

const Users = () => {
    const { pushNotification } = useContext(NotificationContext);
    const { confirmation, showConfirmation } = useContext(ConfirmationContext);
    const { openSpinner, closeSpinner } = useContext(SpinnerContext);
    const { userTableData, updateUserTableData } = useContext(UserContext);
    const {
        mfeData: { addFormId, editFormId, tableHeaders },
    } = useContext(MfeDataContext);

    // const { rowsPerPage, page, sortBy, sortDirection, searchBy } = userTableData as UserTable;
    const { rowsPerPage, page, sortBy, sortDirection, records, searchBy } = userTableData;

    const [addUserForm, setAddUserForm] = useState<unknown>({});
    const [editUserForm, setEditUserForm] = useState<unknown>({});
    const [editUserData, setEditUserData] = useState<EditUserDataResponse | null>(null);
    const [isAddUserModal, setIsAddUserModal] = useState<boolean>(false);
    const [isEditUserModal, setIsEditUserModal] = useState<boolean>(false);
    const appData = useContext<any>(AppConfig);

    useEffect(() => {
        const fetchUserForm = async () => {
            const { addUserFormioForm, editUserFormioForm } = await generateUserForm(
                addFormId,
                editFormId,
                appData?.apiGatewayUrl,
            );
            setAddUserForm(addUserFormioForm);
            setEditUserForm(editUserFormioForm);
        };

        fetchUserForm();
    }, [addFormId, editFormId]);

    const fetchAllUsers = useCallback(
        async (noOfRows, pageNo, orderBy = sortBy, orderDirection = sortDirection) => {
            openSpinner();
            const {
                success,
                data,
                message = '',
            } = await getAllUsers(noOfRows, pageNo, appData?.apiGatewayUrl, orderBy, orderDirection, searchBy);
            closeSpinner();
            if (success && data) {
                const { totalElements, page: currentPage, size, content } = data;

                const updateData = {
                    recordsCount: totalElements,
                    page: currentPage,
                    rowsPerPage: size,
                    records: content,
                    sortBy: orderBy,
                    sortDirection: orderDirection,
                };

                updateUserTableData({
                    ...userTableData,
                    ...updateData,
                });
            } else {
                pushNotification({
                    isOpen: true,
                    message: message,
                    type: 'error',
                });
            }
        },
        [
            rowsPerPage,
            searchBy,
            page,
            sortBy,
            sortDirection,
            userTableData,
            updateUserTableData,
            pushNotification,
            openSpinner,
            closeSpinner,
        ],
    );

    useEffect(() => {
        fetchAllUsers(rowsPerPage, page);
        // eslint-disable-next-line
    }, []);

    const handlePagingAndSorting = async (noOfRows, pageNo, orderBy = sortBy, orderDirection = sortDirection) => {
        const {
            success,
            data,
            message = '',
        } = await getAllUsers(noOfRows, pageNo, appData?.apiGatewayUrl, orderBy, orderDirection, searchBy);
        if (success && data) {
            const { totalElements, size, page: currentPage, content } = data;
            const updateData = { recordsCount: totalElements, page: currentPage, rowsPerPage: size, records: content };
            updateUserTableData({ ...userTableData, ...updateData });

            if (orderBy && orderDirection) {
                updateUserTableData({
                    ...userTableData,
                    ...updateData,
                    sortBy: orderBy,
                    sortDirection: orderDirection,
                });
            }
        } else {
            pushNotification({
                isOpen: true,
                message: message,
                type: 'error',
            });
        }
    };

    // const { TblContainer, TblHead, TblPagination } = useTable(
    //     userTableData,
    //     USER_TABLE_HEADERS,
    //     handlePagingAndSorting,
    // );

    const handleSearch = async (searchTerm: string): Promise<void> => {
        const { success, data } = await getAllUsers(
            rowsPerPage,
            1,
            appData?.apiGatewayUrl,
            sortBy,
            sortDirection,
            searchTerm,
        );
        if (success && data) {
            const { totalElements, page: currentPage, size, content } = data;
            updateUserTableData({
                ...userTableData,
                searchBy: searchTerm,
                recordsCount: totalElements,
                page: currentPage,
                rowsPerPage: size,
                records: content,
            });
        }
    };

    const handleEditUserAction = async ({ id }: UserData) => {
        openSpinner();
        const { success, data } = await getUserDetails(id, appData?.apiGatewayUrl);
        closeSpinner();
        if (success && data) {
            setEditUserData(data);
        } else {
            setEditUserData(null);
        }
        setIsEditUserModal(true);
    };

    const closePopup = useCallback(() => {
        setIsAddUserModal(false);
        setIsEditUserModal(false);
        showConfirmation({
            ...confirmation,
            isOpen: false,
        });
    }, [confirmation, showConfirmation]);

    const callAddOrEditOrDeleteAPI = useCallback(
        async (action, id = null, userData = null, userName = null) => {
            openSpinner();
            const { success, message = '' } = await addOrEditOrDeleteUser(
                action,
                appData?.apiGatewayUrl,
                id,
                userData,
                userName,
            );
            if (success) {
                closePopup();
                await fetchAllUsers(rowsPerPage, page);
                pushNotification({
                    isOpen: true,
                    message: message,
                    type: 'success',
                });
            } else {
                closeSpinner();
                pushNotification({
                    isOpen: true,
                    message: message,
                    type: 'error',
                });
            }
        },
        [closePopup, fetchAllUsers, pushNotification, openSpinner, closeSpinner],
    );

    const handleSubmit = async (submissionData: FormioSubmissionData) => {
        if (isAddUserModal) {
            await callAddOrEditOrDeleteAPI('add', null, submissionData);
        } else {
            if (editUserData) {
                await callAddOrEditOrDeleteAPI('update', editUserData.userId, submissionData);
            }
        }
    };

    // const onActivateOrDeactivate = async (item) => {
    //     showConfirmation({
    //         ...confirmation,
    //         isOpen: false,
    //     });
    //     // employeeService.deleteEmployee(id);
    //     await fetchAllUsers();
    //     pushNotification({
    //         isOpen: true,
    //         message: `User ${item.id} ${item.status ? 'Deactivated' : 'Activated'} Successfully`,
    //         type: `${item.status ? 'error' : 'success'}`,
    //     });
    // };

    // const onToggleSwitch = (item) => {
    //     showConfirmation({
    //         isOpen: true,
    //         title: `Are you sure you want to ${item.status ? 'Deactivate' : 'Activate'} user ${item.id}?`,
    //         showIcon: false,
    //         buttonTheme: `${item.status ? 'error' : 'success'}`,
    //         onConfirm: () => {
    //             onActivateOrDeactivate(item);
    //         },
    //     });
    // };

    const handleChangePage = (e, newPage) => {
        handlePagingAndSorting(rowsPerPage, newPage + 1);
    };

    const handleChangeRowsPerPage = async (event) => {
        const selectedRowPerPage = parseInt(event.target.value, 10);
        await handlePagingAndSorting(selectedRowPerPage, 1);
    };

    const handleSortRequest = async (cellId) => {
        const isAsc = sortBy === cellId && sortDirection === 'asc' ? 'desc' : 'asc';
        await handlePagingAndSorting(rowsPerPage, 1, cellId, isAsc);
    };
    const actionClicked = (e: string, id: string) => {
        const userName = getUserName(id);
        if (e === ACTION_EDIT) {
            handleEditUserAction({ id: id } as UserData);
        } else if (e === ACTION_DELETE) {
            showConfirmation({
                isOpen: true,
                title: `Are you sure you want to delete User ?`,
                showIcon: false,
                onConfirm: () => {
                    callAddOrEditOrDeleteAPI('delete', id, null, userName);
                },
            });

            // showConfirmation({
            //     ...confirmation,
            //     isOpen: true,
            //     title: "Are you sure,Do you want to delete?",
            //     subTitle: "Please confirm if you want to delete this particular workflow",
            //     confirmButtonLabel: "Delete",
            //     onConfirm: () => deleteWorfklow(id)
            // })
        }
    };

    const getUserName = (id) => {
        const result = userTableData?.records?.find((x) => x.id == id);
        return result?.userName;
    };
    return (
        <>
            <DataList
                title={'Users'}
                data={userTableData}
                columns={USER_TABLE_HEADERS}
                maxView={true}
                showCreateNewButton={true}
                showSearchFeild={true}
                actions={actions}
                actionClicked={(e, id) => actionClicked(e, id)}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleSortRequest={handleSortRequest}
                handleSearch={(event) => handleSearch(event?.target?.value)}
                handleCreateNew={() => {
                    setIsAddUserModal(true);
                    setEditUserData(null);
                }}
            />

            <Popup
                title={isAddUserModal ? 'Add User' : 'Edit User'}
                onShow={isAddUserModal || isEditUserModal}
                size="sm"
                onClose={closePopup}>
                <Form
                    form={isAddUserModal ? addUserForm : editUserForm}
                    submission={isEditUserModal && { data: editUserData?.userData }}
                    onSubmit={(submission) => handleSubmit(submission.data)}
                />
            </Popup>
        </>
    );
};

export default Users;
