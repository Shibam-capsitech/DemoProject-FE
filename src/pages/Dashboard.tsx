import React from 'react';
import { Stack, Text, FontIcon } from '@fluentui/react';
import Layout from '../components/Layout/Layout';

const cardData = [
  { title: 'Total Clients', value: 128, icon: 'Group' },
  { title: 'Open Tasks', value: 24, icon: 'TaskLogo' },
  { title: 'Completed Tasks', value: 76, icon: 'Completed' },
  { title: 'Pending Reimbursements', value: 5, icon: 'Money' },
];

const Dashboard: React.FC = () => {
  return (
    <Layout>
    <Stack tokens={{ childrenGap: 20 }} styles={{ root: { padding: 20 } }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
      }}>
        {cardData.map(card => (
          <div
            key={card.title}
            style={{
              background: '#ffffff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              borderRadius: 8,
              padding: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <FontIcon iconName={card.icon} style={{ fontSize: 32, marginBottom: 10, color: '#0078d4' }} />
            <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
              {card.value}
            </Text>
            <Text variant="mediumPlus" styles={{ root: { color: '#666666' } }}>
              {card.title}
            </Text>
          </div>
        ))}
      </div>
    </Stack>
    </Layout>
  );
};

export default Dashboard;
