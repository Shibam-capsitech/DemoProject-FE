import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  Link,
  DefaultButton,
  Pivot,
  PivotItem,
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import { Edit, Info, Plus } from 'lucide-react';
import apiService from '../api/apiService';
import { useRefresh } from '../context/RefreshContext';

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
  const { businessId } = useParams<{ businessId: string }>();
  const [history, setHistory] = useState<TaskHistoryData[]>([]);
  const { refresh } = useRefresh();

  const fetchTaskHistory = async (businessId: string) => {
    try {
      const response = await apiService.get(`/TaskHistory/get-task-history-by-business-id/${businessId}`);
      setHistory(response.taskHistories || []);
    } catch (error) {
      console.error('Failed to fetch task history:', error);
    }
  };

  useEffect(() => {
    if (businessId) {
      fetchTaskHistory(businessId);
    }
  }, [businessId, refresh]);

  return (
    <div style={{ width: "100%", margin: '0 auto' }}>
      <Stack tokens={{ childrenGap: 0 }}>
        <Stack tokens={{ childrenGap: 12 }}>
          <Stack horizontal tokens={{ childrenGap: 12 }}>
            <DefaultButton
              text="Refresh"
              onClick={() => businessId && fetchTaskHistory(businessId)}
              styles={{ root: { marginTop: 15 } }}
            />
          </Stack>

          {history.length > 0 ? (
            history.map((entry) => (
              <Stack
                key={entry.id}
                tokens={{ childrenGap: 8 }}
                styles={{
                  root: {
                    padding: '12px',
                    border: '1px solid #eaeaea',
                    borderRadius: 6,
                    backgroundColor: '#f9f9f9',
                  },
                }}
              >
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
                  {entry.changes.some(change => change.field.toLowerCase() === 'task created') ? (
                    <Plus size={20} color="green" />
                  ) : (
                    <Edit size={20} color="#0078d4" />
                  )}
                  <Text variant="medium">
                    {entry.changes.some(change => change.field.toLowerCase() === 'task created') ? (
                      <><b>{entry.userdetails.name}</b> created task at{' '}</>
                    ) : (
                      <> <b>{entry.userdetails.name}</b> updated task at{' '}</>
                    )}

                    <b>{new Date(entry.timestamp).toLocaleString('en-GB')}</b>
                  </Text>
                </Stack>

                {entry.changes.some(change => change.field.toLowerCase() === 'task created') ? (
                  <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>
                    Task created with new details:
                  </Text>
                ) : (
                  <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>
                    Task updated with new details:
                  </Text>
                )}


                <Stack tokens={{ childrenGap: 4 }} styles={{ root: { paddingLeft: 28 } }}>
                  {entry.changes.map((change, index) => (
                    <Text key={index} variant="medium">
                      <b>{change.field.charAt(0).toUpperCase() + change.field.slice(1)}:</b>{' '}
                      {change.previous} → {change.newval}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            ))
          ) : (

            <Stack
              horizontalAlign="center"
              verticalAlign="center"
              styles={{
                root: {
                  padding: 32,
                  border: '1px dashed #c8c6c4',
                  borderRadius: 8,
                  backgroundColor: '#f9f9f9',
                  color: '#605e5c',
                  textAlign: 'center',
                  width:"max-content",
                  margin: '0 auto',
                },
              }}
              tokens={{ childrenGap: 12 }}
            >
              <Info size={24} color="#605e5c" />
              <Text variant="large" styles={{ root: { fontWeight: 500 } }}>
                No history found
              </Text>
              <Text variant="small">We couldn’t find any task history for this item.</Text>
            </Stack> 

          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default TaskHistory;
