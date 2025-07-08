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
import { Edit } from 'lucide-react';
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
  const { id } = useParams<{ id: string }>();
  const [history, setHistory] = useState<TaskHistoryData[]>([]);
  const {refresh} = useRefresh();

  const fetchTaskHistory = async (taskId: string) => {
    try {
      const response = await apiService.get(`/TaskHistory/get-task-history/${taskId}`);
      setHistory(response.taskHistories || []);
    } catch (error) {
      console.error('Failed to fetch task history:', error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTaskHistory(id);
    }
  }, [id,refresh]);

  return (
    <div style={{ width: "90%", margin: '0 auto' }}>
      <Stack tokens={{ childrenGap: 0 }}>
        <Pivot>
          <PivotItem headerText="History">
            <Stack tokens={{ childrenGap: 12 }}>
              <Stack horizontal tokens={{ childrenGap: 12 }}>
                <DefaultButton
                  text="Refresh"
                  onClick={() => id && fetchTaskHistory(id)}
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
                      <Edit size={20} color="#0078d4" />
                      <Text variant="medium">
                        <b>{entry.userdetails.name}</b> updated task at{' '}
                        <b>{new Date(entry.timestamp).toLocaleString('en-GB')}</b>
                      </Text>
                    </Stack>

                    <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>
                      Task updated with new details:
                    </Text>

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
                <Text>Loading or no history found...</Text>
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
    </div>
  );
};

export default TaskHistory;
