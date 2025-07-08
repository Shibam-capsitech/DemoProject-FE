import React from 'react';
import {
  Stack,
  Text,
  FontIcon,
  Persona,
  PersonaSize
} from '@fluentui/react';
import Layout from '../components/Layout/Layout';

const cardData = [
  { title: 'Total Clients', value: 128, icon: 'Group' },
  { title: 'Open Tasks', value: 24, icon: 'TaskLogo' },
  { title: 'Completed Tasks', value: 76, icon: 'Completed' },
  { title: 'Pending Reimbursements', value: 5, icon: 'Money' },
];

const recentTasks = [
  { title: 'Fix Printer Issue', assignee: 'Ravi', status: 'Open' },
  { title: 'Install Antivirus', assignee: 'Meena', status: 'Completed' },
  { title: 'Update Payroll System', assignee: 'Amit', status: 'In Progress' },
];

const topTechnicians = [
  { name: 'Amit Roy', role: 'Staff', tasksDone: 42 },
  { name: 'Meena Das', role: 'Manager', tasksDone: 37 },
];

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <Stack tokens={{ childrenGap: 32 }} styles={{ root: { padding: 32, paddingTop: 20 } }}>

        <Stack>
          <Text variant="xLarge" styles={{ root: { marginBottom: 16 } }}>Overview</Text>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {cardData.map(card => (
              <div
                key={card.title}
                style={{
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <FontIcon iconName={card.icon} style={{ fontSize: 30, color: '#0078d4' }} />
                <Text variant="xxLarge" styles={{ root: { fontWeight: 600 } }}>{card.value}</Text>
                <Text variant="mediumPlus" styles={{ root: { color: '#666' } }}>{card.title}</Text>
              </div>
            ))}
          </div>
        </Stack>

        <Stack>
          <Text variant="xLarge" styles={{ root: { marginBottom: 16 } }}>Recent Tasks</Text>
          <Stack tokens={{ childrenGap: 12 }}>
            {recentTasks.map((task, index) => (
              <Stack
                key={index}
                horizontal
                horizontalAlign="space-between"
                verticalAlign="center"
                styles={{
                  root: {
                    background: '#f5f5f5',
                    padding: '12px 20px',
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Text variant="mediumPlus">{task.title}</Text>
                <Text variant="medium" styles={{ root: { color: '#555' } }}>
                  {task.assignee} – <strong>{task.status}</strong>
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>

        <Stack>
          <Text variant="xLarge" styles={{ root: { marginBottom: 16 } }}>Top Performers</Text>
          <Stack tokens={{ childrenGap: 12 }}>
            {topTechnicians.map((tech, index) => (
              <Stack
                key={index}
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 16 }}
                styles={{
                  root: {
                    background: '#ffffff',
                    padding: 16,
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Persona
                  text={tech.name}
                  secondaryText={tech.role}
                  size={PersonaSize.size40}
                  hidePersonaDetails={false}
                />
                <Text variant="mediumPlus" styles={{ root: { marginLeft: 'auto', fontWeight: 500 } }}>
                  Tasks Done: {tech.tasksDone}
                </Text>
              </Stack>
            ))}
          </Stack>
        </Stack>
        
      </Stack>
    </Layout>
  );
};

export default Dashboard;
