"use client"
import React, { useEffect, useState } from 'react';
import CustomTable from '../components/DataTable';
import Layout from '../components/Layout/Layout';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  type IDropdownOption,
} from '@fluentui/react';
import { Trash2, Edit2, Eye, RefreshCcw, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddTaskPanel from '../components/AddTaskPanel';
import apiService from '../api/apiService';
import { useRefresh } from '../context/RefreshContext';
import { max } from 'date-fns';
import EditTaskPanel from '../components/EditTaskPanel';
import { toast } from 'react-toastify';

const cellStyle: React.CSSProperties = {
  color: '#333',
  fontSize: 14,
};

const ClientPage: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const { refresh } = useRefresh()
  const [editPanelOpen, setEditPanelOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<any>(null);
  const {toggleRefresh} = useRefresh()
  const handleEdit = (task: any) => {
    setSelectedTaskId(task.id);  
    setEditPanelOpen(true);
  };
  const handleDelete = (item: any) => {
    setSelectedToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async() => {
    try {
      await apiService.post(`/Task/delete-task/${selectedToDelete.id}`,{})
    } catch (error) {
      toast.error("Something went wrong !")
    }
    toggleRefresh()
    console.log('Deleting:', selectedToDelete);
    setIsDeleteDialogOpen(false);
    setSelectedToDelete(null);
  };


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
        businessDetails: t.businessDetails,
        title: t.title,
        startDate: t.startdate,
        dueDate: t.duedate,
        deadline: t.deadline,
        priority: t.priority,
        description: t.description,
        assignee: t.assignee,
        file: t.attachment,
        createdBy: t.createdBy
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
      minWidth: 100,
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
      minWidth: 200,
      maxWidth: 200,
      onRender: (item: any) => (
        <span
          style={{
            color: '#0078d4',
            cursor: 'pointer',
            
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
      minWidth: 150,
      maxWidth: 300,
      onRender: (item: any) => <span style={cellStyle}>{item.type}</span>,
    },
    {
      key: 'businessName',
      name: 'Business Name',
      fieldName: 'businessName',
      minWidth: 180,
      maxWidth: 200,
      onRender: (item: any) => <span style={cellStyle}>{item.businessDetails?.name}</span>,
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      minWidth: 120,
      maxWidth: 100,
      onRender: (item: any) => (
        <span style={cellStyle}>{new Date(item.startDate).toLocaleDateString('en-GB')}</span>
      ),
    },
    {
      key: 'dueDate',
      name: 'Due Date',
      fieldName: 'dueDate',
      minWidth: 120,
      maxWidth: 100,
      onRender: (item: any) => (
        <span style={cellStyle}>{new Date(item.dueDate).toLocaleDateString('en-GB')}</span>
      ),
    },
    {
      key: 'deadline',
      name: 'Deadline',
      fieldName: 'deadline',
      minWidth: 120,
      maxWidth: 100,
      onRender: (item: any) => (
        <span style={cellStyle}>{new Date(item.deadline).toLocaleDateString('en-GB')}</span>
      ),
    },
    {
      key: 'priority',
      name: 'Priority',
      fieldName: 'priority',
      minWidth: 80,
      maxWidth: 80,
      onRender: (item: any) => (
        <span style={cellStyle}>{['High', 'Medium', 'Low'][item.priority] ?? item.priority}</span>
      ),
    },
    // {
    //   key: 'description',
    //   name: 'Description',
    //   fieldName: 'description',
    //   minWidth: 200,
    //   maxWidth: 300,
    //   onRender: (item: any) => <span style={cellStyle}>{item.description}</span>,
    // },
    {
      key: 'assignee',
      name: 'Assignee',
      fieldName: 'assignee',
      minWidth: 120,
      maxWidth: 100,
      onRender: (item: any) => <span style={cellStyle}>{item.assignee?.name}</span>,
    },
    {
      key: 'createdAt',
      name: 'Created At',
      fieldName: 'createdAt',
      minWidth: 110,
      maxWidth: 170,
      onRender: (item: any) => {
        const dateStr = item.createdBy?.date;
        const formattedDate = dateStr ? new Date(dateStr).toLocaleDateString('en-GB') : 'N/A';
        return <span style={cellStyle}>{formattedDate}</span>;
      },
    },
    {
      key: 'file',
      name: 'Attachment',
      fieldName: 'file',
      minWidth: 80,
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
    // {
    //   key: 'actions',
    //   name: 'Actions',
    //   fieldName: 'actions',
    //   minWidth: 120,
    //   onRender: (item: any) => (
    //     <div style={{ display: 'flex', gap: 12, alignItems: 'center',}}>
    //       <Edit
    //         size={18}
    //         color="#0078d4"
    //         style={{ cursor: 'pointer',  }}
    //         onClick={() => handleEdit(item)}
    //       />
    //     </div>
    //   ),
    // },
  ];
  const criteria: IDropdownOption[] = [
    { key: 'Type', text: 'Task Type' },
  ];
  const value: Record<string, IDropdownOption[]> = {
    Type: [
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
      {selectedTaskId && (
        <EditTaskPanel
          isOpen={editPanelOpen}
          onDismiss={() => setEditPanelOpen(false)}
          taskId={selectedTaskId}
          onSuccess={() => {
            setEditPanelOpen(false);
            toggleRefresh(); 
          }}
        />
      )}
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        dialogContentProps={{
          title: 'Confirm Deletion',
          subText: `Are you sure you want to delete Task: "${selectedToDelete?.title}"? This action cannot be undone.`,
        }}
      >
        <DialogFooter>
          <DefaultButton onClick={confirmDelete} text="Confirm" />
          <DefaultButton onClick={() => setIsDeleteDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
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
