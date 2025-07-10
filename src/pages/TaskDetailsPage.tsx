import React from 'react';
import { Stack } from '@fluentui/react';
import TaskSummary from '../components/TaskSummary';
import TaskHistory from '../components/TaskHistory';
import TaskSteps from '../components/TaskSteps';
import Layout from '../components/Layout/Layout';

const TaskDetailsPage: React.FC = () => {
  return (
    <Layout>
    <Stack horizontal styles={{ root: { height: '100vh', borderTop:"1px solid #f4f4f4" } }}>
      <Stack.Item grow={1} styles={{ root: { borderRight: '1px solid #eee', padding: 16, width: '15%' } }}>
        <TaskSummary />
      </Stack.Item>

      <Stack.Item grow={1} styles={{ root: { borderRight: '1px solid #eee', padding: 0,width: '55%' } }}>
        <TaskHistory />
      </Stack.Item>

      <Stack.Item grow={1} styles={{ root: { padding: 16,width: '30%' } }}>
        <TaskSteps />
      </Stack.Item>

    </Stack>
    </Layout>
  );
};

export default TaskDetailsPage;
