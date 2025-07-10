import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  Pivot,
  PivotItem,
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import { Edit, Plus, Trash2 } from 'lucide-react';
import apiService from '../api/apiService';
import { useRefresh } from '../context/RefreshContext';
import { differenceInSeconds, parseISO } from 'date-fns';

interface TaskChange {
  field: string;
  previous: string;
  newval: string;
  isChangeRegardingSubTask: boolean;
  isChangeRegardingTask: boolean;
  subTaskId?: string;
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
  const { taskId } = useParams<{ taskId: string }>();
  const [history, setHistory] = useState<TaskHistoryData[]>([]);
  const { refresh } = useRefresh();


  const groupByTime = (histories: TaskHistoryData[]) => {
    if (!histories || histories.length === 0) return [];

    const grouped: TaskHistoryData[] = [];

    let currentGroup: TaskHistoryData = {
      ...histories[0],
      changes: [...histories[0].changes],
    };

    for (let i = 1; i < histories.length; i++) {
      const prevTime = parseISO(currentGroup.timestamp);
      const currTime = parseISO(histories[i].timestamp);

      const sameUser = histories[i].userdetails.name === currentGroup.userdetails.name;

      if (
        differenceInSeconds(currTime, prevTime) <= 1 &&
        sameUser
      ) {
        currentGroup.changes = [...currentGroup.changes, ...histories[i].changes];
      } else {
        grouped.push(currentGroup);
        currentGroup = {
          ...histories[i],
          changes: [...histories[i].changes],
        };
      }
    }

    grouped.push(currentGroup); // push last group
    return grouped;
  };

  const fetchTaskHistory = async (taskId: string) => {
    try {
      const response = await apiService.get(`/TaskHistory/get-task-history/${taskId}`);
      const originalHistory = response.taskHistories || [];
      const groupedHistory = groupByTime(originalHistory);
      setHistory(groupedHistory);
    } catch (error) {
      console.error('Failed to fetch task history:', error);
    }
  };


  useEffect(() => {
    if (taskId) {
      fetchTaskHistory(taskId);
    }
  }, [taskId, refresh]);

  return (
    <div style={{ width: "90%", margin: '0 auto' }}>
      <Stack tokens={{ childrenGap: 0 }}>
        <Pivot>
          <PivotItem headerText="History">
            <Stack tokens={{ childrenGap: 12 }}>
              <Stack horizontal tokens={{ childrenGap: 12 }}>
                <DefaultButton
                  text="Refresh"
                  onClick={() => taskId && fetchTaskHistory(taskId)}
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
                      {(() => {
                        const isTaskChange = entry.changes.every(c => !c.isChangeRegardingSubTask);
                        const isSubTaskChange = entry.changes.some(c => c.isChangeRegardingSubTask);
                        const isCreated = entry.changes.some(c => c.field.toLowerCase().includes('created'));
                        const isDeleted = entry.changes.some(c => c.field.toLowerCase().includes('deleted'));

                        let icon = <Edit size={20} color="#0078d4" />;
                        let message = `${entry.userdetails.name} updated task at `;
                        let color = "#0078d4";
                        if (isTaskChange && isCreated) {
                          icon = <Plus size={20} color="#2E7D32" />; // Green
                          message = `${entry.userdetails.name} created task at `;
                          color = "#4CAF50";
                        } else if (isSubTaskChange && isCreated) {
                          icon = <Plus size={20} color="#00897B" />; // Teal
                          message = `${entry.userdetails.name} added subtask at `;
                          color = "#26A69A";
                        } else if (isSubTaskChange && isDeleted) {
                          icon = <Trash2 size={20} color="#C62828" />; // Red
                          message = `${entry.userdetails.name} deleted subtask at `;
                          color = "#EF5350";
                        } else if (isSubTaskChange) {
                          icon = <Edit size={20} color="#EF6C00" />; // Orange
                          message = `${entry.userdetails.name} updated subtask at `;
                          color = "#FFB74D";
                        } else {
                          icon = <Edit size={20} color="#1565C0" />; // Blue
                          message = `${entry.userdetails.name} updated task at `;
                          color = "#42A5F5";
                        }


                        return (
                          <>
                            {icon}
                            <Text variant="medium" styles={{ root: { color } }}>
                              {message}
                              {new Date(entry.timestamp).toLocaleString('en-GB')}
                            </Text>
                          </>
                        );
                      })()}
                    </Stack>

                    {(() => {
                      const isTaskChange = entry.changes.every(c => !c.isChangeRegardingSubTask);
                      const isCreated = entry.changes.some(c => c.field.toLowerCase().includes('created'));

                      if (isTaskChange && isCreated)
                        return <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>Task created with details:</Text>;
                      if (isTaskChange)
                        return <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>Task updated with changes:</Text>;
                      if (!isTaskChange && isCreated)
                        return <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>Subtask created with details:</Text>;
                      if (!isTaskChange && entry.changes.some(c => c.field.toLowerCase().includes('deleted')))
                        return <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>Subtask was deleted:</Text>;
                      return <Text variant="medium" styles={{ root: { paddingLeft: 28 } }}>Subtask updated with changes:</Text>;
                    })()}

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
                      padding: 16,
                      border: '1px solid #ccc',
                      borderRadius: 6,
                      backgroundColor: '#f3f2f1',
                      textAlign: 'center',
                      color: '#605e5c',
                    },
                  }}
                >
                  <Text variant="mediumPlus" styles={{ root: { fontWeight: 500 } }}>
                    Loading or no history found...
                  </Text>
                </Stack>
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
