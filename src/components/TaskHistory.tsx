import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  DefaultButton,
  Pivot,
  PivotItem,
  IconButton,
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import { ChevronsDown, ChevronsUp, Plus, Edit, Trash2 } from 'lucide-react';
import apiService from '../api/apiService';
import { useRefresh } from '../context/RefreshContext';

interface HistoryEntry {
  id: string;
  description: string;
  changeType: number; // 1 = add, 2 = edit, 3 = delete
  targetedtask: {
    id: string;
    name: string;
  };
  targetedbusiness: {
    id: string;
    name: string;
  };
  createdBy: {
    id: string;
    name: string;
    email?: string;
    address?: string;
    date: string;
  };
}

const TaskHistory: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const { refresh } = useRefresh();
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageSize = 6;

  const groupHistoryByTime = (entries: HistoryEntry[]): HistoryEntry[][] => {
    const sorted = [...entries].sort((a, b) =>
      new Date(a.createdBy.date).getTime() - new Date(b.createdBy.date).getTime()
    );

    const groups: HistoryEntry[][] = [];
    let currentGroup: HistoryEntry[] = [];

    for (let i = 0; i < sorted.length; i++) {
      const current = sorted[i];
      const prev = sorted[i - 1];

      if (
        i > 0 &&
        new Date(current.createdBy.date).getTime() - new Date(prev.createdBy.date).getTime() < 1000
      ) {
        currentGroup.push(current);
      } else {
        if (currentGroup.length) groups.push(currentGroup);
        currentGroup = [current];
      }
    }

    if (currentGroup.length) {
      groups.push(currentGroup);
    }

    return groups;
  };
  const groupedHistory = groupHistoryByTime(history);
  const paginated = groupedHistory.slice(currentIndex, currentIndex + pageSize);

  const fetchTaskHistory = async (id: string) => {
    try {
      const response = await apiService.get(`/TaskHistory/get-task-history/${id}`);
      const data: HistoryEntry[] = response.taskHistories || [];
      setHistory(data);
    } catch (err) {
      console.error("Error loading history", err);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskHistory(taskId);
    }
  }, [taskId, refresh]);

  const getIconByChangeType = (type: number) => {
    switch (type) {
      case 1: return <Plus size={20} color="#2E7D32" />;
      case 2: return <Edit size={20} color="#1565C0" />;
      case 3: return <Trash2 size={20} color="#C62828" />;
      default: return <Edit size={20} />;
    }
  };


  return (
    <div style={{ width: "90%", margin: "0 auto" }}>
      <Stack tokens={{ childrenGap: 0 }}>
        <Pivot>
          <PivotItem headerText="History">
            <Stack tokens={{ childrenGap: 12 }}>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <DefaultButton
                  text="Refresh"
                  onClick={() => taskId && fetchTaskHistory(taskId)}
                  styles={{ root: { marginTop: 15 } }}
                />
                <Stack horizontal tokens={{ childrenGap: 8 }} styles={{ root: { marginTop: 15 } }}>
                  <IconButton
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(prev => Math.max(prev - pageSize, 0))}
                  >
                    <ChevronsUp />
                  </IconButton>
                  <IconButton
                    disabled={currentIndex + pageSize >= history.length}
                    onClick={() =>
                      setCurrentIndex(prev => Math.min(prev + pageSize, history.length - pageSize))
                    }
                  >
                    <ChevronsDown />
                  </IconButton>
                </Stack>
              </Stack>

              {history.length > 0 ? (
                <Stack tokens={{ childrenGap: 8 }}>
                  {paginated.map((group, index) => (
                    <Stack
                      key={index}
                      tokens={{ childrenGap: 4 }}
                      styles={{
                        root: {
                          padding: '12px',
                          border: '1px solid #eaeaea',
                          borderRadius: 6,
                          backgroundColor: '#f9f9f9',
                        },
                      }}
                    >
                      {group.map((item, subIndex) => (
                        <Stack horizontal verticalAlign="start" tokens={{ childrenGap: 8 }} key={subIndex}>
                          {getIconByChangeType(item.changeType)}
                          <span
                            style={{ fontSize: 14, color: "#333", lineHeight: 1.4 }}
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        </Stack>
                      ))}
                      <Text variant="smallPlus" styles={{ root: { paddingLeft: 24, color: "#777" } }}>
                        Updated by {group[0].createdBy.name} •{' '}
                        {new Date(group[0].createdBy.date).toLocaleString('en-GB')}
                      </Text>
                    </Stack>
                  ))}

                </Stack>
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
