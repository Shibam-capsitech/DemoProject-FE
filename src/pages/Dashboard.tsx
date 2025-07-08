import React from 'react';
import { Stack, Text, FontIcon, DefaultButton, Persona, PersonaSize } from '@fluentui/react';
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
  { name: 'Amit Roy', role: 'Technician', tasksDone: 42 },
  { name: 'Meena Das', role: 'Technician', tasksDone: 37 },
];

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <Stack tokens={{ childrenGap: 24 }} styles={{ root: { padding: 24 } }}>
        {/* Top Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 20,
          }}
        >
          {cardData.map(card => (
            <div
              key={card.title}
              style={{
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
              <FontIcon iconName={card.icon} style={{ fontSize: 32, marginBottom: 10, color: '#0078d4' }} />
              <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
                {card.value}
              </Text>
              <Text variant="mediumPlus" styles={{ root: { color: '#666666' } }}>
                {card.title}
              </Text>
            </div>
          ))}
        </div>

        {/* Recent Tasks */}
        <div>
          <Text variant="xLarge" styles={{ root: { marginBottom: 20 } }}>
            Recent Tasks
          </Text>
          <Stack tokens={{ childrenGap: 12 }}>
            {recentTasks.map((task, index) => (
              <Stack
                key={index}
                horizontal
                horizontalAlign="space-between"
                styles={{
                  root: {
                    background: '#f9f9f9',
                    padding: '12px 16px',
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Text>{task.title}</Text>
                <Text>{task.assignee} – {task.status}</Text>
              </Stack>
            ))}
          </Stack>
        </div>

        {/* Top Technicians */}
        <div>
          <Text variant="xLarge" styles={{ root: { marginBottom: 12 } }}>
            Top Performers
          </Text>
          <Stack tokens={{ childrenGap: 12 }}>
            {topTechnicians.map((tech, index) => (
              <Stack
                key={index}
                horizontal
                verticalAlign="center"
                tokens={{ childrenGap: 12 }}
                styles={{
                  root: {
                    background: '#ffffff',
                    padding: 12,
                    borderRadius: 8,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  },
                }}
              >
                <Persona
                  text={tech.name}
                  secondaryText={tech.role}
                  size={PersonaSize.size40}
                  hidePersonaDetails={false}
                />
                <Text variant="mediumPlus" styles={{ root: { marginLeft: 'auto' } }}>
                  Tasks Done: {tech.tasksDone}
                </Text>
              </Stack>
            ))}
          </Stack>
        </div>
      </Stack>
    </Layout>
  );
};

export default Dashboard;
