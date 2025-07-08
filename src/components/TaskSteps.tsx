import React from 'react';
import { Stack, Text, Dropdown } from '@fluentui/react';

const TaskSteps = () => {
  return (
    <Stack tokens={{ childrenGap: 16 }}>
      <Text variant="large">Task Steps</Text>

      <Stack horizontal horizontalAlign="space-between">
        <Text><b>Default step</b></Text>
        <Dropdown
          placeholder="Waiting"
          options={[
            { key: 'waiting', text: 'Waiting' },
            { key: 'inprogress', text: 'In Progress' },
            { key: 'completed', text: 'Completed' }
          ]}
          defaultSelectedKey="waiting"
        />
      </Stack>

      <Text style={{ background: '#fff5f5', padding: '8px', borderRadius: 6, color: '#c50f1f' }}>
        ⚠️ Company is active for strike off.
      </Text>
    </Stack>
  );
};

export default TaskSteps;
