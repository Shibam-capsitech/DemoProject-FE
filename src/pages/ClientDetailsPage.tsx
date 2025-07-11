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
} from '@fluentui/react';
import { Plus, Edit, Mail, RefreshCw, Edit2, } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import TaskHistory from '../components/TaskHistoryForBusinessesProfile';
import apiService from '../api/apiService';
import { useParams } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';
import EditBusinessPanel from '../components/EditBusinessPanel';
import { useRefresh } from '../context/RefreshContext';


const ClientDetailsPage: React.FC = () => {
    const [taskView, setTaskView] = useState<'upcoming' | 'completed'>('upcoming');
    const [businessData, setBusinessData] = useState<any>(null);
    const { businessId } = useParams<{ businessId: string }>();
    const { refresh } = useRefresh()
    // const filteredTasks = useMemo(
    //     () => tasks.filter(t => taskView === 'upcoming' ? t.status !== 'Completed' : t.status === 'Completed'),
    //     [taskView]
    // );

    const taskColumns: IColumn[] = [
        { key: 'title', name: 'Task', fieldName: 'title', minWidth: 180, },
        { key: 'dueDate', name: 'Due Date', fieldName: 'dueDate', minWidth: 100, onRender: (item) => item?.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A' },
        {
            key: 'status',
            name: 'Status',
            minWidth: 120,
            onRender: (item) => {
                const allCompleted =
                    item?.subTask?.length > 0 &&
                    item.subTask.every((sub: any) => sub.status === 'Completed');

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
    useEffect(() => {
        if (businessId) {
            fetchTasks(businessId)
            fetchBusinessDetails(businessId)
        }

    }, [businessId, refresh])
    const [isEditOpen, { setTrue: openEditPanel, setFalse: dismissEditPanel }] = useBoolean(false);

    return (
        <Layout>
            <Stack horizontal styles={{ root: { width: '100%', borderTop: "1px solid #f4f4f4" } }} tokens={{ childrenGap: 16 }}>
                <Stack styles={{ root: { flex: 3, borderRight: "1px solid #f4f4f4", paddingRight: 12, marginTop: 12, height: "100vh" } }} tokens={{ childrenGap: 16 }}>
                    <Stack styles={{ root: { display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 8 } }}>
                        <img
                            src="/image.png"
                            alt="Profile"
                            style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover' }}
                        />

                        <Stack tokens={{ childrenGap: 8 }}>
                            <Text variant="xxLarge">{businessData?.name}</Text>
                            <Stack horizontal>
                                <Text variant="large" styles={{ root: { background: '#e6f4ff', padding: '4px 8px', borderRadius: 4 } }}>
                                    {businessData?.bId}
                                </Text>
                                <IconButton onClick={() => { }} title="Add"><Plus size={16} /></IconButton>
                                <IconButton onClick={() => { }} title="Edit"><Edit size={16} /></IconButton>
                                <IconButton onClick={() => { }} title="Mail"><Mail size={16} /></IconButton>
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
                                    <Stack grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Type</Text>
                                        <Text>{businessData?.type}</Text>
                                    </Stack>
                                    <Stack grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Building</Text>
                                        <Text>{businessData?.building}</Text>
                                    </Stack>
                                    <Stack grow tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">City</Text>
                                        <Text>{businessData?.city}</Text>
                                    </Stack>
                                </Stack>

                                <Stack horizontal wrap tokens={{ childrenGap: 16 }}>
                                    <Stack grow styles={{ root: { minWidth: 200 } }} tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">State</Text>
                                        <Text>{businessData?.state}</Text>
                                    </Stack>
                                    <Stack grow styles={{ root: { minWidth: 200 } }} tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Country</Text>
                                        <Text>{businessData?.country}</Text>
                                    </Stack>
                                    <Stack grow styles={{ root: { minWidth: 200 } }} tokens={{ childrenGap: 4 }}>
                                        <Text variant="mediumPlus">Postcode</Text>
                                        <Text>{businessData?.postcode}</Text>
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
                                            <Text>{businessData?.userDetails?.name}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Building</Text>
                                            <Text>{businessData?.userDetails?.building}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">City</Text>
                                            <Text>{businessData?.userDetails?.city}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">State</Text>
                                            <Text>{businessData?.userDetails?.state}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Country</Text>
                                            <Text>{businessData?.userDetails?.country}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Postcode</Text>
                                            <Text>{businessData?.userDetails?.postcode}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Email</Text>
                                            <Text>{businessData?.userDetails?.email}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Username</Text>
                                            <Text>{businessData?.userDetails?.username}</Text>
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

                <Stack styles={{ root: { flex: 1, } }} tokens={{ childrenGap: 12 }}>
                    <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                        <Text variant="large">Tasks</Text>
                        <Stack horizontal tokens={{ childrenGap: 8 }} verticalAlign="center">
                            <Dropdown
                                selectedKey={taskView}
                                onChange={(_, option) => setTaskView(option?.key as any)}
                                options={[
                                    { key: 'upcoming', text: 'Upcoming', itemType: DropdownMenuItemType.Normal },
                                    { key: 'completed', text: 'Completed', itemType: DropdownMenuItemType.Normal },
                                ]}
                                styles={{ root: { width: 120 } }}
                            />
                            <IconButton onClick={() => { }}><RefreshCw size={16} /></IconButton>
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
