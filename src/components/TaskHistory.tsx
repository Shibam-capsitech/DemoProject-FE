import React, { useEffect, useState } from 'react';
import {
    Stack,
    TextField,
    DefaultButton,
    Text,
    Link,
    Pivot,
    PivotItem,
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import apiService from '../api/apiService';
import { Edit } from 'lucide-react';

interface TaskChange {
    field: string;
    previous: string;
    newval: string;
}

interface TaskHistoryData {
    id: string;
    timestamp: string;
    changes: TaskChange[];
    taskdetails: {
        title: string;
        description: string;
        type: string;
    };
    userdetails: {
        name: string;
        email: string;
        role: string;
    };
}

const TaskHistory: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [history, setHistory] = useState<TaskHistoryData | null>(null);

    const fetchTaskHistory = async (id: string) => {
        try {
            const response = await apiService.get(`/TaskHistory/get-task-history/${id}`);
            setHistory(response.taskHistories);
        } catch (error) {
            console.error('Failed to fetch task history:', error);
        }
    };
    useEffect(() => {
        if (id) {
            fetchTaskHistory(id);
        }
    }, [id]);

    return (
        <Stack tokens={{ childrenGap: 12 }}>
            <Pivot>
                <PivotItem headerText="History">
                    <Stack tokens={{ childrenGap: 12 }}>
                        <Stack horizontal tokens={{ childrenGap: 12 }}>
                            <DefaultButton text="Refresh" onClick={() => id && fetchTaskHistory(id)} styles={{root: {marginTop:"15px"}}} />
                            {/* <TextField placeholder="Search" styles={{ root: { width: 200 } }} />
                            <TextField placeholder="From date" styles={{ root: { width: 160 } }} />
                            <TextField placeholder="To date" styles={{ root: { width: 160 } }} />
                            <DefaultButton text="Add filter" /> */}
                        </Stack>

                        {history ? (
                            <Stack tokens={{ childrenGap: 8 }}>
                                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
                                    <Edit size={25} color="#0078d4"
                                    />
                                    <Text variant="medium">
                                        at <b>{new Date(history.timestamp).toLocaleString('en-GB')}</b> by{' '}
                                        <Link>{history.userdetails.name}</Link>
                                    </Text>
                                </Stack>

                                <Text variant="medium" styles={{ root: { paddingLeft: 18 } }}>
                                    Task updated with new details :
                                </Text>

                                {history.changes.map((change, index) => (
                                    <Text
                                        key={index}
                                        variant="medium"
                                        styles={{ root: { paddingLeft: 18, lineHeight: '20px' } }}
                                    >
                                        <b>{change.field.charAt(0).toUpperCase() + change.field.slice(1)}:</b>{' '}
                                        {change.previous} - {change.newval}
                                    </Text>
                                ))}
                            </Stack>
                        ) : (
                            <Text>Loading history...</Text>
                        )}

                    </Stack>
                </PivotItem>

                <PivotItem headerText="Files">
                    <Text variant="large" styles={{ root: { marginTop: 12 } }}>
                        No files uploaded yet.
                    </Text>
                </PivotItem>
            </Pivot>
        </Stack>
    );
};

export default TaskHistory;
