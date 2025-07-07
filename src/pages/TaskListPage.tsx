import React, { useEffect, useState } from 'react';
import CustomTable from '../components/DataTable';
import Layout from '../components/Layout/Layout';
import {
  DefaultButton,
  PrimaryButton,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { Trash2, Edit2, Eye, Plus, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddTaskPanel from '../components/AddTaskPanel';
import apiService from '../api/apiService';

const cellStyle: React.CSSProperties = {
  fontSize: 14,
  padding: '4px 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const ClientPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await apiService.get('/Task/get-all-task');
      const data = res.tasks.map((t: any) => ({
        id: t._id,
        type: t.type,
        businessName: t.businessDetails?.name || '',
        title: t.title,
        startDate: t.startdate,
        dueDate: t.duedate,
        deadline: t.deadline,
        priority: ['High', 'Medium', 'Low'][t.priority] ?? t.priority,
        description: t.description,
        assignee: t.assignee,
        businessId: t.businessId,
        file: t.attachment,
      }));
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const columns = [
    {
      key: 'id',
      name: 'ID',
      fieldName: 'id',
      onRender: (item: any) => <span style={cellStyle}>{item.id}</span>,
    },
    {
      key: 'title',
      name: 'Title',
      fieldName: 'title',
      onRender: (item: any) => (
        <span style={cellStyle} onClick={() => navigate(`/admin/tasks/${item.id}`)}>
          {item.title}
        </span>
      ),
    },
    {
      key: 'type',
      name: 'Type',
      fieldName: 'type',
      onRender: (item: any) => <span style={cellStyle}>{item.type}</span>,
    },
    {
      key: 'businessName',
      name: 'Business Name',
      fieldName: 'businessName',
      onRender: (item: any) => <span style={cellStyle}>{item.businessName}</span>,
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      onRender: (item: any) => (
        <span style={cellStyle}>
          {new Date(item.startDate).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: 'dueDate',
      name: 'Due Date',
      fieldName: 'dueDate',
      onRender: (item: any) => (
        <span style={cellStyle}>
          {new Date(item.dueDate).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: 'deadline',
      name: 'Deadline',
      fieldName: 'deadline',
      onRender: (item: any) => (
        <span style={cellStyle}>
          {new Date(item.deadline).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    {
      key: 'priority',
      name: 'Priority',
      fieldName: 'priority',
      onRender: (item: any) => <span style={cellStyle}>{item.priority}</span>,
    },
    {
      key: 'assignee',
      name: 'Assignee',
      fieldName: 'assignee',
      onRender: (item: any) => <span style={cellStyle}>{item.assignee}</span>,
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      onRender: (item: any) => <span style={cellStyle}>{item.description}</span>,
    },
    {
      key: 'businessId',
      name: 'Business ID',
      fieldName: 'businessId',
      onRender: (item: any) => <span style={cellStyle}>{item.businessId}</span>,
    },
    {
      key: 'file',
      name: 'Attachment',
      fieldName: 'file',
      onRender: (item: any) => (
        <a
          href={item.file}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...cellStyle, color: '#0078d4', textDecoration: 'underline' }}
        >
          View
        </a>
      ),
    },
    {
      key: 'actions',
      name: 'Actions',
      fieldName: 'actions',
      onRender: (item: any) => (
        <div style={{ display: 'flex', gap: 8, ...cellStyle }}>
          <Eye size={16} style={{ cursor: 'pointer' }} />
          <Edit2 size={16} style={{ cursor: 'pointer' }} />
          <Trash2 size={16} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <CustomTable
        items={tasks}
        columns={columns}
        pageSize={10}
        onRowClick={(item) => console.log('Row clicked:', item)}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <AddTaskPanel />
            <DefaultButton
              onClick={fetchTasks}
              text="Refresh"
              styles={{ root: { border: 'none' } }}
              onRenderIcon={() => <RefreshCcw size={20} />}
            />
          </div>
        }
      />
    </Layout>
  );
};

export default ClientPage;
