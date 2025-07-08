import React from 'react';
import {
  Stack,
  Text,
  IconButton,
  type IIconProps,
} from '@fluentui/react';
import { Search, Bell, Settings, HelpCircle } from 'lucide-react';

function Header() {
  const iconButtonStyle = {
    root: { color: 'white' },
    rootHovered: { backgroundColor: '#106EBE' },
  };

  return (
    <Stack
      horizontal
      verticalAlign="center"
      horizontalAlign="space-between"
      styles={{
        root: {
          padding: '9px',
          backgroundColor: '#0078D4',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          zIndex: 1,
        },
      }}
    >

      <Text
        variant="large"
        styles={{ root: { fontWeight: 600, color: 'white' } }}
      >
        Acting Office - Dev
      </Text>

      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <Stack
          horizontal
          verticalAlign="center"
          styles={{
            root: {
              background: 'white',
              borderRadius: 4,
              padding: '4px 6px',
              height: 32,
              width: 250,
            },
          }}
        >
          <Search size={18} style={{ color: '#666', marginRight: 8 }} />
          <input
            type="text"
            placeholder="Search..."
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              fontSize: 14,
            }}
          />
        </Stack>
        <IconButton
          title="Notifications"
          ariaLabel="Notifications"
          styles={iconButtonStyle}
        >
          <Bell size={18} />
        </IconButton>
        <IconButton
          title="Settings"
          ariaLabel="Settings"
          styles={iconButtonStyle}
        >
          <Settings size={18} />
        </IconButton>
        <IconButton
          title="Help"
          ariaLabel="Help"
          styles={iconButtonStyle}
        >
          <HelpCircle size={18} />
        </IconButton>
      </Stack>
    </Stack>
  );
}

export default Header;
