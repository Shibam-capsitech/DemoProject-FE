
import React from 'react';
import { Stack, Text, DefaultButton } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Stack
      verticalAlign="center"
      horizontalAlign="center"
      styles={{
        root: {
          height: '100vh',
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          padding: 32,
        },
      }}
      tokens={{ childrenGap: 20 }}
    >
      <AlertCircle size={64} color="#0078d4" />
      <Text variant="xxLarge" styles={{ root: { fontWeight: 600 } }}>
        404 - Page Not Found
      </Text>
      <Text variant="large" styles={{ root: { maxWidth: 400, color: '#666' } }}>
        The page you are looking for might have been removed or doesn't exist.
      </Text>
      <DefaultButton text="Go to Dashboard" onClick={() => navigate('/admin')} />
    </Stack>
  );
};

export default NotFoundPage;
