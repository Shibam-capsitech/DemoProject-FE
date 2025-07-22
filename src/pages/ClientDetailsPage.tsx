import React, { useEffect, useMemo, useState } from 'react';
import {
    Stack,
    Text,
    Pivot,
    PivotItem,
    Dropdown,
    DropdownMenuItemType,
    DetailsList,
    DetailsListLayoutMode,
    SelectionMode,
    IconButton,
    type IColumn,
    DefaultButton,
    Dialog,
    DialogFooter,
} from '@fluentui/react';
import { Plus, Edit, Mail, RefreshCw, Edit2, Trash2, } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import TaskHistory from '../components/TaskHistoryForBusinessesProfile';
import apiService from '../api/apiService';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';
import EditBusinessPanel from '../components/EditBusinessPanel';
import { useRefresh } from '../context/RefreshContext';
import { useUser } from '../context/UserContext';
import { toast } from 'react-toastify';
import AddTaskPanel from '../components/AddTaskPanel';


const ClientDetailsPage: React.FC = () => {
    const [taskView, setTaskView] = useState<'upcoming' | 'completed'>('upcoming');
    const [businessData, setBusinessData] = useState<any>(null);
    const { businessId } = useParams<{ businessId: string }>();
    const { refresh, toggleRefresh } = useRefresh()
    const { role, id } = useUser()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedToDelete, setSelectedToDelete] = useState<any>(null);
    const navigate = useNavigate()
    // const filteredTasks = useMemo(
    //     () => tasks.filter(t => taskView === 'upcoming' ? t.status !== 'Completed' : t.status === 'Completed'),
    //     [taskView]
    // );

    const taskColumns: IColumn[] = [
        {
            key: 'title',
            name: 'Task',
            fieldName: 'title',
            minWidth: 180,
            onRender: (item: any) => (
                <span
                    style={{ color: '', cursor: 'pointer', textDecoration: 'none' }}
                    onClick={() => navigate(`/tasks/${item.id}`)}
                >
                    {item.title}
                </span>
            ),
        },
        { key: 'duedate', name: 'Due Date', fieldName: 'duedate', minWidth: 100, onRender: (item) => item?.duedate ? new Date(item.duedate).toLocaleDateString() : 'N/A' },
        {
            key: 'status',
            name: 'Status',
            minWidth: 120,
            onRender: (item) => {
                const allCompleted =
                    item?.subtask?.length > 0 &&
                    item.subtask.every((sub: any) => sub.status === 'Completed');

                return (
                    <Text
                        styles={{
                            root: {
                                padding: '4px 8px',
                                borderRadius: 4,
                                backgroundColor: allCompleted ? '#dff0d8' : '#f8d7da',
                                color: allCompleted ? '#3c763d' : '#721c24',
                                display: 'inline-block',
                            },
                        }}
                    >
                        {allCompleted ? 'Completed' : 'Not Completed'}
                    </Text>
                );
            },
        }
    ];

    const fetchBusinessDetails = async (businessId: string) => {
        try {
            const response = await apiService.get(`/Business/get-business-by-id/${businessId}`);
            setBusinessData(response.business);
        } catch (error) {
            console.error('Failed to fetch business details:', error);
        }
    }

    const [tasksData, setTasksData] = useState<any[]>([]);
    const fetchTasks = async (businessId: string) => {
        try {
            const response = await apiService.get(`/Task/get-tasks-by-business-id/${businessId}`);
            setTasksData(response.tasks || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            return [];
        }
    }

    const handleDelete = (item: any) => {
        setSelectedToDelete(item);
        setIsDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await apiService.post(`/Business/delete-business-by-id/${businessId}`, {})
            navigate("/clients")
        } catch (error) {
            toast.error("Something went wrong !")
        }
        toggleRefresh()
        console.log('Deleting:', selectedToDelete);
        setIsDeleteDialogOpen(false);
        setSelectedToDelete(null);
    };


    useEffect(() => {
        if (businessId) {
            fetchTasks(businessId)
            fetchBusinessDetails(businessId)
        }

    }, [businessId, refresh])
    const [isEditOpen, { setTrue: openEditPanel, setFalse: dismissEditPanel }] = useBoolean(false);

    return (
        <Layout>
            <Dialog
                hidden={!isDeleteDialogOpen}
                onDismiss={() => setIsDeleteDialogOpen(false)}
                dialogContentProps={{
                    title: 'Confirm Deletion',
                    subText: `Are you sure you want to delete client: "${businessData?.name}"? This action cannot be undone.`,
                }}
            >
                <DialogFooter>
                    <DefaultButton onClick={confirmDelete} text="Confirm" />
                    <DefaultButton onClick={() => setIsDeleteDialogOpen(false)} text="Cancel" />
                </DialogFooter>
            </Dialog>
            <Stack horizontal styles={{ root: { width: '100%', borderTop: "1px solid #f4f4f4" } }} tokens={{ childrenGap: 16 }}>
                <Stack styles={{ root: { flex: 3, borderRight: "1px solid #f4f4f4", paddingRight: 12, marginTop: 12, height: "100vh" } }} tokens={{ childrenGap: 16 }}>
                    <Stack styles={{ root: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 8 } }}>
                        <img
                            src="/image.png"
                            alt="Profile"
                            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                        />

                        <Stack tokens={{ childrenGap: 8 }}>
                            <Text variant="xLarge">{businessData?.name}</Text>
                            <Stack horizontal>
                                <Text variant="large" styles={{ root: { background: '#e6f4ff', padding: '4px 8px', borderRadius: 4 } }}>
                                    {businessData?.bId}
                                </Text>
                                {(role === "Admin" || (businessData?.createdBy?.id == id)) &&
                                    <IconButton onClick={handleDelete} title="Add" styles={{ root: { color: "red" } }}><Trash2 size={18} /></IconButton>
                                }
                            </Stack>
                        </Stack>
                    </Stack>

                    <Pivot>
                        <PivotItem headerText="Profile" >
                            <Stack
                                styles={{
                                    root: {
                                        background: '#fafafa',
                                        border: '1px solid #e1dfdd',
                                        padding: 20,
                                        borderRadius: 8,
                                        marginTop: 16,
                                    },
                                }}
                                tokens={{ childrenGap: 20 }}
                            >
                                <Stack horizontal horizontalAlign="space-between">
                                    <Text variant="large" styles={{ root: { fontWeight: 600, marginBottom: 8 } }}>
                                        Business details
                                    </Text>
                                    <DefaultButton
                                        onClick={openEditPanel}
                                        styles={{ root: { border: "none", backgroundColor: "transparent" } }}
                                    >
                                        <Edit />
                                    </DefaultButton>
                                </Stack>
                                <EditBusinessPanel businessId={businessId ?? ''} isOpen={isEditOpen} onDismiss={dismissEditPanel} />

                                <Stack horizontal horizontalAlign='space-between' wrap tokens={{ childrenGap: 16 }}>
                                    <Stack styles={{ root: { width: '20%' } }} grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Type</Text>
                                        <Text>{businessData?.type}</Text>
                                    </Stack>
                                    <Stack styles={{ root: { width: '20%' } }} grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Building</Text>
                                        <Text>{businessData?.address.building}</Text>
                                    </Stack>
                                    <Stack styles={{ root: { width: '20%' } }} grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">City</Text>
                                        <Text>{businessData?.address.city}</Text>
                                    </Stack>
                                </Stack>

                                <Stack horizontal horizontalAlign='space-between' wrap tokens={{ childrenGap: 16 }}>
                                    <Stack styles={{ root: { width: '20%' } }} grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">State</Text>
                                        <Text>{businessData?.address.state}</Text>
                                    </Stack>
                                    <Stack styles={{ root: { width: '20%' } }} grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Country</Text>
                                        <Text>{businessData?.address.country}</Text>
                                    </Stack>
                                    <Stack styles={{ root: { width: '20%' } }} grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Postcode</Text>
                                        <Text>{businessData?.address.postcode}</Text>
                                    </Stack>
                                </Stack>
                            </Stack>


                            <Stack
                                styles={{
                                    root: {
                                        background: '#fafafa',
                                        border: '1px solid #e1dfdd',
                                        padding: 20,
                                        borderRadius: 8,
                                        marginTop: 16,
                                    },
                                }}
                                tokens={{ childrenGap: 20 }}
                            >
                                <Text variant="large" styles={{ root: { fontWeight: 600, marginBottom: 8 } }}>
                                    Contact details
                                </Text>

                                <Stack horizontal tokens={{ childrenGap: 16 }}>
                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Name</Text>
                                            <Text>{businessData?.createdBy?.name}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Building</Text>
                                            <Text>{businessData?.createdBy?.address.building}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">City</Text>
                                            <Text>{businessData?.createdBy?.address.city}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">State</Text>
                                            <Text>{businessData?.createdBy?.address.state}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Country</Text>
                                            <Text>{businessData?.createdBy?.address.country}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Postcode</Text>
                                            <Text>{businessData?.createdBy?.address.postcode}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Email</Text>
                                            <Text>{businessData?.createdBy?.email}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Username</Text>
                                            <Text>{businessData?.createdBy?.name}</Text>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Stack>
                        </PivotItem>

                        <PivotItem headerText="History">
                            <TaskHistory />
                        </PivotItem>

                    </Pivot>
                </Stack>

                <Stack styles={{ root: { flex: 1, paddingTop: "10px" } }} tokens={{ childrenGap: 12 }}>
                    <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large">Tasks</Text>
                        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                            {/* <Dropdown
                                selectedKey={taskView}
                                onChange={(_, option) => setTaskView(option?.key as any)}
                                options={[
                                    { key: 'upcoming', text: 'Upcoming', itemType: DropdownMenuItemType.Normal },
                                    { key: 'completed', text: 'Completed', itemType: DropdownMenuItemType.Normal },
                                ]}
                                styles={{ root: { width: 120 } }}
                            /> */}
                            <IconButton onClick={() => { }}><RefreshCw size={16} /></IconButton>
                            <AddTaskPanel businessName={businessData?.name} />
                        </Stack>
                    </Stack>
                    <DetailsList
                        items={tasksData}
                        columns={taskColumns}
                        layoutMode={DetailsListLayoutMode.justified}
                        selectionMode={SelectionMode.none}
                        styles={{ root: { overflowY: 'auto', maxHeight: 500 } }}
                    />
                </Stack>
            </Stack>
        </Layout>
    );
};

export default ClientDetailsPage;
