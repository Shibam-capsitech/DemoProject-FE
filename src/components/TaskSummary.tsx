import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  Link,
  DefaultButton,
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import apiService from '../api/apiService';

const labelStyle = { fontWeight: '600', color: '#666', fontSize: 13 };
const valueStyle = { fontSize: 15, fontWeight: '500' };

const TaskSummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<any>(null);

  const fetchTask = async () => {
    try {
      const res = await apiService.get(`/Task/get-task-by-id/${id}`);
      setTask(res.task);
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  if (!task) return <Text>Loading task summary...</Text>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-GB');

  return (
    <Stack tokens={{ childrenGap: 10 }} styles={{ root: { padding: '12px', maxWidth: 320 } }}>
      <Stack horizontal horizontalAlign="space-between">
        <Stack>
          <Text styles={{ root: labelStyle }}>Task name</Text>
          <Link styles={{ root: { ...valueStyle, color: '#0078d4' } }}>
            {task.title || 'N/A'}
          </Link>
        </Stack>
        <i className="ms-Icon ms-Icon--Delete" style={{ color: '#c43131', cursor: 'pointer' }} />
      </Stack>

      <Text styles={{ root: labelStyle }}>Priority</Text>
      <span
        style={{
          backgroundColor: '#dcefff',
          color: '#0078d4',
          fontSize: 12,
          padding: '2px 8px',
          borderRadius: 6,
          display: 'inline-block',
          width: 'fit-content',
        }}
      >
        {task.priority}
      </span>


      <Text styles={{ root: labelStyle }}>Action date</Text>
      <Text styles={{ root: { ...valueStyle, color: 'green' } }}>
        {formatDate(task.createdAt)}
      </Text>

      <Text styles={{ root: labelStyle }}>Start date</Text>
      <Text styles={{ root: valueStyle }}>{formatDate(task.startDate)}</Text>

      <Text styles={{ root: labelStyle }}>Due date</Text>
      <Text styles={{ root: valueStyle }}>{formatDate(task.dueDate)}</Text>

      <Text styles={{ root: labelStyle }}>Deadline</Text>
      <Text styles={{ root: valueStyle }}>{formatDate(task.deadline)}</Text>

      <Text styles={{ root: labelStyle }}>Description</Text>
      <Text styles={{ root: valueStyle }}>{task.description}</Text>

      <Text styles={{ root: labelStyle }}>Assignee</Text>
      <Link styles={{ root: { ...valueStyle, color: '#0078d4' } }}>
        {task.assignee}
      </Link>
    </Stack>
  );
};

export default TaskSummary;
