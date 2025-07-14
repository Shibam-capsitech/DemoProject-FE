import React, { useEffect, useState } from 'react';
import CustomTable from '../components/DataTable';
import Layout from '../components/Layout/Layout';
import {
  DefaultButton,
  type IDropdownOption,
} from '@fluentui/react';
import { Trash2, Edit2, Eye, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddTaskPanel from '../components/AddTaskPanel';
import apiService from '../api/apiService';
import { useRefresh } from '../context/RefreshContext';
import { max } from 'date-fns';

const cellStyle: React.CSSProperties = {
  fontSize: 14,
  padding: '4px 8px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  width: "max-content",
};

const ClientPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const { refresh } = useRefresh()

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const fetchTasks = async () => {
    try {
      const res = await apiService.get('/Task/get-all-task');
      const data = res.tasks.map((t: any) => ({
        id: t.id,
        tid: t.tid,
        type: t.type,
        businessName: t.businessdetails?.name || '',
        title: t.title,
        startDate: t.startdate,
        dueDate: t.duedate,
        deadline: t.deadline,
        priority: ['High', 'Medium', 'Low'][t.priority] ?? t.priority,
        description: t.description,
        assignee: t.assignee,
        businessId: t.businessId,
        file: t.attachment,
        createdAt: t.createdby?.date
      }));
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const columns = [
    {
      key: 'tid',
      name: 'Task ID',
      fieldName: 'tid',
      maxWidth: 100,
      onRender: (item: any) => (
        <span
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#d4f4dd',
            color: '#1b5e20',
            padding: '2px 6px',
            borderRadius: 4,
            display: 'inline-block',
          }}
        >
          {item.tid}
        </span>
      ),
    },
    {
      key: 'title',
      name: 'Title',
      fieldName: 'title',
      maxWidth: 200,
      onRender: (item: any) => (
        <span
          style={{
            color: '#0078d4',
            textDecoration: 'underline',
            cursor: 'pointer',
            ...cellStyle,
          }}
          onClick={() => navigate(`/admin/tasks/${item.id}`)}
        >
          {item.title}
        </span>
      ),
    },
    {
      key: 'type',
      name: 'Type',
      fieldName: 'type',
      maxWidth: 300,
      onRender: (item: any) => <span style={cellStyle}>{item.type}</span>,
    },
    {
      key: 'businessName',
      name: 'Business Name',
      fieldName: 'businessName',
      maxWidth: 200,
      onRender: (item: any) => <span style={cellStyle}>{item.businessName}</span>,
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      maxWidth: 100,
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
      maxWidth: 100,
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
      maxWidth: 100,
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
      maxWidth: 100,
      onRender: (item: any) => <span style={cellStyle}>{item.priority}</span>,
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
       maxWidth: 400,
      onRender: (item: any) => <span style={cellStyle}>{item.description}</span>,
    },
        {
      key: 'assignee',
      name: 'Assignee',
      fieldName: 'assignee',
      maxWidth: 100,
      onRender: (item: any) => <span style={cellStyle}>{item.assignee?.name}</span>,
    },
            {
      key: 'createdAt',
      name: 'Created At',
      fieldName: 'createdAt',
      maxWidth: 100,
      onRender: (item: any) => <span style={cellStyle}>{item.createdAt}</span>,
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
  ];
  const criteria: IDropdownOption[] = [
    { key: 'type', text: 'Task Type' },
  ];
  const value: Record<string, IDropdownOption[]> = {
    type:[
          { key: 'Send Printed Incorporation Document', text: 'Send Printed Incorporation Document' },
    { key: 'Confirmation Statement', text: 'Confirmation Statement' },
    { key: 'VAT Return', text: 'VAT Return' },
    { key: 'Dormant Company Accounts', text: 'Dormant Company Accounts' },
    { key: 'HMRC Authorisation process', text: 'HMRC Authorisation process' },
    { key: 'Weekly Payroll', text: 'Weekly Payroll' },
    { key: 'Annual Payroll', text: 'Annual Payroll' },
    { key: 'Monthly Bookkeeping', text: 'Monthly Bookkeeping' },
    { key: 'VAT Registration', text: 'VAT Registration' },
    ]
  };
  return (
    <Layout>
      <CustomTable
        items={tasks}
        columns={columns}
        pageSize={10}
        onRowClick={(item) => console.log('Row clicked:', item)}
        filterCriteria={criteria}
        filterValue={value}
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
