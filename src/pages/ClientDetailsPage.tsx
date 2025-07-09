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

const clientData = {
    avatar: '/image.png',
    name: 'Chatterjee Private Limited',
    code: 'LA-209',
    email: 'sunil.jangid@capsitech.com',
    phone: '+447798654565',
    address: '8/2 Main Building, Rishra, West Bengal, 712248, India',
    tradingAddress: 'Rishra, West Bengal, India',
    defaultContact: 'Lousie Harrison',
    incorporationDate: null,
    authCode: '6BPPNX',
    utr: '9874022701',
    vatNo: '494825018',
    vatRegDate: '31/07/2016',
    vatStatus: 'Registered',
    vatScheme: 'Accrual Based',
    vatFrequency: 'Monthly',
    payeRef: '123/PA48946',
    type: 'Individual',
    building: '8/2 Main Building',
    city: 'Rishra',
    state: 'West Bengal',
    country: 'India',
    postcode: '712248'
};
const tasks = [
    { name: 'SA100 for All Directors', date: '30/06/2022', status: 'Overdue' },
    { name: 'Review employee details', date: '13/02/2023', status: 'Overdue' },
    { name: 'Company Accounts and CT600', date: '15/04/2023', status: 'Overdue' },
    { name: 'Review employee details', date: '06/05/2023', status: 'Overdue' },
    { name: 'Confirmation Statement', date: '24/08/2023', status: 'Overdue' },
    { name: 'Payment for invoice #INV-1201', date: '18/11/2023', status: 'Overdue' },
];

const ClientDetailsPage: React.FC = () => {
    const [taskView, setTaskView] = useState<'upcoming' | 'completed'>('upcoming');
    const [businessData, setBusinessData] = useState<any>(null);
    const { businessId } = useParams<{ businessId: string }>();
    const { refresh } = useRefresh()
    const filteredTasks = useMemo(
        () => tasks.filter(t => taskView === 'upcoming' ? t.status !== 'Completed' : t.status === 'Completed'),
        [taskView]
    );

    const taskColumns: IColumn[] = [
        { key: 'name', name: 'Task', fieldName: 'name', minWidth: 180 },
        { key: 'date', name: 'Due Date', fieldName: 'date', minWidth: 100 },
    ];

    const fetchBusinessDetails = async (businessId: string) => {
        try {
            const response = await apiService.get(`/Business/get-business-by-id/${businessId}`);
            setBusinessData(response.business);
        } catch (error) {
            console.error('Failed to fetch business details:', error);
        }
    }
    useEffect(() => {
        if (businessId)
            fetchBusinessDetails(businessId)
    }, [businessId, refresh])
    const [isEditOpen, { setTrue: openEditPanel, setFalse: dismissEditPanel }] = useBoolean(false);

    return (
        <Layout>
            <Stack horizontal styles={{ root: { width: '100%', padding: 0, borderTop: "1px solid #f4f4f4" } }} tokens={{ childrenGap: 16 }}>
                <Stack styles={{ root: { flex: 3, borderRight: "1px solid #f4f4f4", padding: 10, marginTop: 12, height: "100vh" } }} tokens={{ childrenGap: 16 }}>
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
                        <PivotItem headerText="Profile">
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
                                    <DefaultButton onClick={openEditPanel} styles={{ root: { border: "none", backgroundColor: "transparent", } }} ><Edit /></DefaultButton>
                                </Stack>
                                <EditBusinessPanel businessId={businessId ?? ''} isOpen={isEditOpen} onDismiss={dismissEditPanel} />


                                <Stack horizontal tokens={{ childrenGap: 16 }}>
                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Type</Text>
                                            <Text>{businessData?.type}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Building</Text>
                                            <Text>{businessData?.building}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">City</Text>
                                            <Text>{businessData?.city}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">State</Text>
                                            <Text>{businessData?.state}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Country</Text>
                                            <Text>{businessData?.country}</Text>
                                        </Stack>
                                    </Stack>

                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Postcode</Text>
                                            <Text>{businessData?.postcode}</Text>
                                        </Stack>
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
                                    Owner details
                                </Text>

                                <Stack horizontal tokens={{ childrenGap: 16 }}>
                                    <Stack grow={1} tokens={{ childrenGap: 12 }}>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Name</Text>
                                            <Text>{businessData?.userDetails?.name}</Text>
                                        </Stack>
                                        <Stack tokens={{ childrenGap: 4 }}>
                                            <Text variant="mediumPlus">Building</Text>
                                            <Text>{clientData.building}</Text>
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
                            <IconButton onClick={() => { }}><Plus size={16} /></IconButton>
                        </Stack>
                    </Stack>
                    <DetailsList
                        items={filteredTasks}
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
