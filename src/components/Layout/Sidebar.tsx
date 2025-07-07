import React from 'react';
import { Stack, IconButton, Text } from '@fluentui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlignJustify,
  LayoutDashboard,
  ClipboardList,
  LogOut,
  Users,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleCollapse }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const dashboardLink = {
    key: 'dashboard',
    name: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    route: '/admin',
  };

    const logoutPath = {
    key: 'logout',
    name: 'Logout',
    icon: <LogOut size={18} />,
    route: '/login',
  };

  const operationLinks = [
    { key: 'clients', name: 'Client', icon: <Users size={18} />, route: '/admin/clients' },
    { key: 'tasks', name: 'Tasks', icon: <ClipboardList size={18} />, route: '/admin/tasks' },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };
  const dashboardActive = isActive(dashboardLink.route);

  return (
    <Stack
      verticalAlign="start"
      styles={{
        root: {
          width: collapsed ? 60 : 230,
          backgroundColor: '#ffffff',
          height: '100vh',
          transition: 'width 0.3s ease',
          borderRight: '1px solid #ccc',
        },
      }}
    >

      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="space-between"
        styles={{ root: { padding: 0, paddingLeft: 12, paddingTop:10 } }}
      >
        <IconButton
          onClick={toggleCollapse}
          styles={{
            root: {
              color: 'black',
              padding: 4,
              selectors: {
                ':hover': { backgroundColor: '#f3f2f1' },
              },
            },
          }}
        >
          <AlignJustify size={20} />
        </IconButton>
      </Stack>

      <Stack
        horizontal
        verticalAlign="center"
        onClick={() => navigate(dashboardLink.route)}
        styles={{
          root: {
            marginTop: '10px',
            paddingTop: 4,
            paddingBottom: 4,
            paddingLeft: collapsed ? 0 :10,
            marginLeft: collapsed?0:6,
            borderRadius: dashboardActive ? '0 15px 15px 0' : 4,
            borderLeft: dashboardActive ? '2px solid #0078d4' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            color: '#000',
            selectors: { ':hover': { background: '#f3f2f1' } },
            justifyContent: collapsed ? 'center' : 'flex-start',
          },
        }}
      >
        {dashboardLink.icon}
        {!collapsed && (
          <Text variant="medium" styles={{ root: { marginLeft: 10, fontSize: 18, } }}>
            {dashboardLink.name}
          </Text>
        )}
      </Stack>

      {!collapsed && (
        <Text
          variant="medium"
          styles={{ root: { margin: '26px 18px 8px', fontWeight: 600 } }}
        >
          Operations
        </Text>
      )}

      <Stack tokens={{ childrenGap: 4 }} styles={{ root: { padding: '10px 10px' } }}>
        {operationLinks.map(link => {
          const active = isActive(link.route);
          return (
            <Stack
              key={link.key}
              horizontal
              verticalAlign="center"
              onClick={() => navigate(link.route)}
              styles={{
                root: {
                  marginBottom: '10px',
                  paddingTop: 4,
                  paddingBottom: 4,
                  paddingLeft: collapsed ? 0 : 5,
                  borderLeft: active ? '2px solid #0078d4' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#000',
                  selectors: { ':hover': { background: '#f3f2f1' } },
                  justifyContent: collapsed ? 'center' : 'flex-start',
                },
              }}

            >
              {link.icon}
              {!collapsed && (
                <Text variant="medium" styles={{ root: { marginLeft: 10, fontSize: 18, paddingRight: "10px" } }}>
                  {link.name}
                </Text>
              )}
            </Stack>
          );
        })}
      </Stack>
            <Stack >
            <Stack
              key={logoutPath.key}
              horizontal
              verticalAlign="center"
              onClick={() => navigate(logoutPath.route)}
              styles={{
                root: {
                  marginBottom: '10px',
                  paddingBottom: 4,
                  paddingLeft: collapsed ? 0 : 5,
                  borderLeft: '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  color: '#000',
                  selectors: { ':hover': { background: '#f3f2f1' } },
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  marginLeft: collapsed ? 0 : 11,
                },
              }}

            >
              {logoutPath.icon}
              {!collapsed && (
                <Text variant="medium" styles={{ root: { marginLeft: 10, fontSize: 18, paddingRight: "10px" } }}>
                  {logoutPath.name}
                </Text>
              )}
            </Stack>
      </Stack>
    </Stack>
  );
};

export default Sidebar;
