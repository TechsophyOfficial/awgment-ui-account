import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form } from 'react-formio';
import GroupContext, { GroupTable } from '../../contexts/groupContext/group-context';
import {
    FormioSubmissionData,
    GroupData,
    getGroups,
    getGroupById,
    handleGroupAction,
} from '../../services/GroupService';
import { generateGroupForm } from '../../services/CommonService';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import { ACTION_DELETE, ACTION_EDIT, GROUP_TABLE_HEADERS } from '../../constants/common';
import NotificationContext from '../../contexts/notificationContext/notification-context';
import ConfirmationContext from '../../contexts/confirmationContext/confirmation-context';
import SpinnerContext from '../../contexts/spinnerContext/spinner-context';
import DataList from 'tsf_datalist/dist/components/dataList';
import Popup from 'tsf_popup/dist/components/popup';
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

const Groups = () => {
    const { pushNotification } = useContext(NotificationContext);
    const { confirmation, showConfirmation } = useContext(ConfirmationContext);
    const { openSpinner, closeSpinner } = useContext(SpinnerContext);
    const { groupTableData, updateGroupTableData } = useContext(GroupContext);

    const { rowsPerPage, page, sortBy, sortDirection, searchBy } = groupTableData;

    const [addGroupForm, setAddGroupForm] = useState<unknown>({});
    const [editGroupForm, setEditGroupForm] = useState<unknown>({});
    const [editGroupData, setEditGroupData] = useState<GroupData | null>(null);
    const [isAddGroupModal, setIsAddGroupModal] = useState<boolean>(false);
    const [isEditGroupModal, setIsEditGroupModal] = useState<boolean>(false);
    const appData = useContext<any>(AppConfig);

    useEffect(() => {
        const fetchGroupForm = async () => {
            const { addGroupForm, editGroupForm } = await generateGroupForm(appData?.apiGatewayUrl);
            setAddGroupForm(addGroupForm);
            setEditGroupForm(editGroupForm);
        };

        fetchGroupForm();
    }, []);

    const fetchAllGroups = useCallback(
        async (noOfRows, pageNo, orderBy = sortBy, orderDirection = sortDirection) => {
            openSpinner();
            const {
                success,
                data,
                message = '',
            } = await getGroups(noOfRows, pageNo, appData?.apiGatewayUrl, orderBy, orderDirection, searchBy);
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

                updateGroupTableData({
                    ...groupTableData,
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
            groupTableData,
            updateGroupTableData,
            pushNotification,
            openSpinner,
            closeSpinner,
        ],
    );

    useEffect(() => {
        fetchAllGroups(rowsPerPage, page);
        // eslint-disable-next-line
    }, []);

    const handlePagingAndSorting = async (
        noOfRows = rowsPerPage,
        pageNo,
        orderBy = sortBy,
        orderDirection = sortDirection,
    ) => {
        const {
            success,
            data,
            message = '',
        } = await getGroups(noOfRows, pageNo, appData?.apiGatewayUrl, orderBy, orderDirection, searchBy);
        if (success && data) {
            const { totalElements, size, page, content } = data;
            const updateData = { recordsCount: totalElements, page: page, rowsPerPage: size, records: content };
            updateGroupTableData({ ...groupTableData, ...updateData });

            if (orderBy && orderDirection) {
                updateGroupTableData({
                    ...groupTableData,
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

    const handleSearch = async (searchTerm: string): Promise<void> => {
        const { success, data } = await getGroups(
            rowsPerPage,
            1,
            appData?.apiGatewayUrl,
            sortBy,
            sortDirection,
            searchTerm,
        );
        if (success && data) {
            const { totalElements, page, size, content } = data;
            updateGroupTableData({
                ...groupTableData,
                searchBy: searchTerm,
                recordsCount: totalElements,
                page: page,
                rowsPerPage: size,
                records: content,
            });
        }
    };

    const handleEditGroupAction = async ({ id }: GroupData) => {
        openSpinner();
        const { success, data } = await getGroupById(id, appData?.apiGatewayUrl);
        closeSpinner();
        if (success && data) {
            setEditGroupData(data);
        } else {
            setEditGroupData(null);
        }
        setIsEditGroupModal(true);
    };

    const closePopup = useCallback(() => {
        setIsAddGroupModal(false);
        setIsEditGroupModal(false);
        showConfirmation({
            ...confirmation,
            isOpen: false,
        });
    }, [confirmation, showConfirmation]);

    const getGroupName = (id) => {
        const result = groupTableData?.records?.find((x) => x.id === id);
        return result;
    };

    const callAddOrEditOrDeleteAPI = useCallback(
        async (action, id = null, userData = null) => {
            if (!userData) {
                const entry = getGroupName(id);
                userData = { name: entry?.name, groupId: entry?.groupId, description: entry?.description };
            }
            openSpinner();
            const { success, message = '' } = await handleGroupAction(action, appData?.apiGatewayUrl, id, userData);
            if (success) {
                closePopup();
                await fetchAllGroups(rowsPerPage, page);
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
        [closePopup, fetchAllGroups, pushNotification, openSpinner, closeSpinner],
    );

    const handleSubmit = async (submissionData: FormioSubmissionData) => {
        if (isAddGroupModal) {
            await callAddOrEditOrDeleteAPI('add', null, submissionData);
        } else {
            if (editGroupData) {
                await callAddOrEditOrDeleteAPI('update', editGroupData.id, submissionData);
            }
        }
    };

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
        if (e === ACTION_EDIT) {
            handleEditGroupAction({ id: id } as GroupData);
        } else if (e === ACTION_DELETE) {
            showConfirmation({
                isOpen: true,
                title: `Are you sure you want to delete group ?`,
                showIcon: false,
                onConfirm: () => {
                    callAddOrEditOrDeleteAPI('delete', id);
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

    return (
        <>
            <DataList
                title={'Groups'}
                data={groupTableData}
                columns={GROUP_TABLE_HEADERS}
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
                    setIsAddGroupModal(true);
                    setEditGroupData(null);
                }}
            />

            <Popup
                title={isAddGroupModal ? 'Add Group' : 'Edit Group'}
                onShow={isAddGroupModal || isEditGroupModal}
                size="sm"
                onClose={closePopup}>
                <Form
                    form={isAddGroupModal ? addGroupForm : editGroupForm}
                    submission={isEditGroupModal && { data: editGroupData }}
                    onSubmit={(submission) => handleSubmit(submission.data)}
                />
            </Popup>
        </>
    );
};

export default Groups;
