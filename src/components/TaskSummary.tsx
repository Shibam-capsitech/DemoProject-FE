import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  Link,
  type IDropdownOption,
  IconButton,
} from '@fluentui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';
import apiService from '../api/apiService';
import { initializeIcons } from '@fluentui/react';
import { useRefresh } from '../context/RefreshContext';
import { Edit, Trash2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import EditTaskPanel from './EditTaskPanel';
import { toast } from 'react-toastify';
import {
  DefaultButton,
  Dialog,
  DialogFooter,
} from '@fluentui/react';
initializeIcons();


const labelStyle = { fontWeight: '600', color: '#666', fontSize: 14 };
const valueStyle = { fontSize: 16, fontWeight: '500' };

const TaskSummary: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<any>(null);
  const [isPanelOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [businessOptions, setBusinessOptions] = useState<IDropdownOption[]>([]);
  const [hasAccessToDelete, setHasAccessToDelete] = useState(false)
  const [hasAccessToEdit, setHasAccessToEdit] = useState(false)
  const [userOptions, setUserOptions] = useState<IDropdownOption[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<any>(null);
  const { toggleRefresh } = useRefresh();
  const navigate = useNavigate()
  const { role, id } = useUser()


  const fetchTask = async () => {
    try {
      const res = await apiService.get(`/Task/get-task-by-id/${taskId}`);
      setTask(res.task);
      if (role === "Admin" || (task.createdBy.id === id)) {
        setHasAccessToDelete(true)
        setHasAccessToEdit(true)
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  useEffect(() => {
    if (taskId) fetchTask();

    const fetchBusinesses = async () => {
      try {
        const businessRes = await apiService.get('/Business/get-all-businesses');
        setBusinessOptions(
          businessRes.businesses.map((b: any) => ({
            key: b.id,
            text: b.name,
          }))
        );
      } catch (e) {
        console.error('Failed to load businesses', e);
      }
    };

    const fetchUsers = async () => {
      try {
        const userRes = await apiService.get('/User/get-all-users');
        setUserOptions(
          userRes.users.result.map((u: any) => ({
            key: u.id,
            text: u.name,
          }))
        );
      } catch (e) {
        console.error('Failed to load users', e);
      }
    };

    fetchBusinesses();
    fetchUsers();
  }, [taskId, role, id]);


  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.post(`/Task/delete-task/${taskId}`, {})
      navigate("/admin/tasks")
    } catch (error) {
      toast.error("Something went wrong !")
    }
    toggleRefresh()
    console.log('Deleting:', selectedToDelete);
    setIsDeleteDialogOpen(false);
    setSelectedToDelete(null);
  };
  const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('en-GB');

  if (!task) return <Text>Loading task summary...</Text>;

  return (
    <>
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
      <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 5, Width: 300, } }}>
        <Stack horizontal horizontalAlign="space-between">
          <Text styles={{ root: { fontSize: "16px", fontWeight: "500" } }}>
            Task Details
          </Text>
          <Stack horizontal tokens={{ childrenGap: 0 }} verticalAlign="center">
            {hasAccessToEdit && (
              <IconButton
                onClick={openPanel}
                title="Edit Task"
                styles={{
                  root: {
                    border: "none",
                    padding: 0,
                    height: 32,
                    width: 32,
                    color: "#0078d4",
                  },
                  icon: { fontSize: 18 },
                  
                }}
              >
                <Edit size={18} />
              </IconButton>
            )}

            {hasAccessToDelete &&
              <IconButton
                onClick={handleDelete}
                title="Delete Task"
                styles={{
                  root: {
                    border: "none",
                    padding: 0,
                    height: 32,
                    width: 32,
                    color: "#d32f2f",
                  },
                  icon: { fontSize: 18 },
                }}
              >
                <Trash2 size={18} />
              </IconButton>}
          </Stack>

        </Stack>
        <Stack horizontal horizontalAlign="space-between" >
          <Stack>
            <Text styles={{ root: labelStyle }}>Business name</Text>
            <Link
              href={`/admin/clients/${task.businessDetails?.id}`}
              styles={{
                root: {
                  ...valueStyle,
                  fontSize: 12,
                  padding: '4px 8px',
                  backgroundColor: '#fffecd',
                  color: '#504e00ff',
                  borderRadius: 6,
                  fontWeight: 600,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  width: "max-content",
                  whiteSpace: "wrap"
                }
              }}
            >
              {task.businessDetails?.name || 'N/A'}
            </Link>
          </Stack>


        </Stack>

        <Stack >

          <Stack>
            <Text styles={{ root: labelStyle }}>Task name</Text>
            <Link styles={{ root: { ...valueStyle, color: '#0078d4', fontSize: 14 } }}>{task.title || 'N/A'}</Link>
          </Stack>

        </Stack>

        <Stack tokens={{ childrenGap: 6 }}>
          <Text styles={{ root: labelStyle }}>Priority</Text>
          <span
            style={{
              backgroundColor: '#dcefff',
              color: '#0078d4',
              fontSize: 12,
              padding: '4px 10px',
              borderRadius: 10,
              display: 'inline-block',
              width: 'fit-content',
            }}
          >
            {task.priority}
          </span>
        </Stack>

        <Stack tokens={{ childrenGap: 8 }}>
          <Text styles={{ root: labelStyle }}>Action date</Text>
          <Text styles={{ root: { ...valueStyle, color: 'green' } }}>{formatDate(task.createdBy?.date)}</Text>

          <Text styles={{ root: labelStyle }}>Start date</Text>
          <Text styles={{ root: valueStyle }}>{formatDate(task.startdate)}</Text>

          <Text styles={{ root: labelStyle }}>Due date</Text>
          <Text styles={{ root: valueStyle }}>{formatDate(task.duedate)}</Text>

          <Text styles={{ root: labelStyle }}>Deadline</Text>
          <Text styles={{ root: { ...valueStyle, color: 'red' } }}>{formatDate(task.deadline)}</Text>

          <Text styles={{ root: labelStyle }}>Description</Text>
          <Text styles={{ root: valueStyle }}>{task.description}</Text>

          <Text styles={{ root: labelStyle }}>Assignee</Text>
          <Link styles={{ root: { ...valueStyle, color: '#0078d4' } }}> {userOptions.find(u => u.key === task.assignee.name)?.text || 'N/A'}</Link>
        </Stack>

        <EditTaskPanel
          isOpen={isPanelOpen}
          onDismiss={dismissPanel}
          taskId={taskId}
          onSuccess={() => {
            fetchTask();
            toggleRefresh();
          }}
        />

      </Stack >
    </>

  );
};

export default TaskSummary;