import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  Dropdown,
  IconButton,
  DetailsList,
  DetailsListLayoutMode,
  CheckboxVisibility,
  Selection,
  SelectionMode,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  type IDropdownOption,
  type IColumn,
} from '@fluentui/react';
import { Plus, Trash } from 'lucide-react';
import { useParams } from 'react-router';
import apiService from '../api/apiService';
import AddSubtaskPanel from './AddSubTaskPanel';
import { toast } from 'react-toastify';
import { useRefresh } from '../context/RefreshContext';

const statusOptions: IDropdownOption[] = [
  { key: 'Waiting', text: 'Waiting' },
  { key: 'In Progress', text: 'In Progress' },
  { key: 'Completed', text: 'Completed' },
];

const TaskSteps = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [subTask, setSubTask] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<Selection | null>(null);
  const { toggleRefresh } = useRefresh();
  const [isSubtaskPanelOpen, setIsSubtaskPanelOpen] = useState(false);
  const [isTaskCompleted, setIsTaskCompleted] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ key: string | number; id: string } | null>(null);

  const [showPostDeleteDialog, setShowPostDeleteDialog] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await apiService.get(`/Task/get-task-by-id/${taskId}`);
      const activeSubtasks = (res.task.subtask || []).filter(st => st.isActive);
      setSubTask(activeSubtasks);
      setIsTaskCompleted(res.task.isCompleted);
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  useEffect(() => {
    const sel = new Selection({
      onSelectionChanged: () => {
        const selectedItems = sel.getSelection() as any[];
        setSelectedKeys(new Set(selectedItems.map((s) => s.id)));
      },
    });
    setSelection(sel);
  }, [subTask]);

  const handleStatusChange = async (key: string | number, itemId?: string) => {
    if (itemId) {
      const remainingIncomplete = subTask.filter(st => st.status !== 'Completed' && st.id !== itemId);

      if (key === 'Completed' && remainingIncomplete.length === 0) {
        setPendingStatusChange({ key, id: itemId });
        setShowConfirmDialog(true);
        return;
      }

      setSubTask((prev) =>
        prev.map((task) =>
          task.id === itemId ? { ...task, status: key } : task
        )
      );

      try {
        await apiService.post(`/Task/change-subtask-status/${itemId}?status=${key}&taskId=${taskId}`, {});
        toast.success("Subtask status updated");
        toggleRefresh();
      } catch (error) {
        toast.error("Failed to update subtask status");
        console.error(error);
      }

    } else {
      setSubTask((prev) =>
        prev.map((task) =>
          selectedKeys.has(task.id) ? { ...task, status: key } : task
        )
      );

      const updatePromises = Array.from(selectedKeys).map(async (id) => {
        try {
          await apiService.post(`/Task/change-subtask-status/${id}?status=${key}&taskId=${taskId}`, {});
          toggleRefresh();
        } catch (error) {
          console.error(`Failed to update subtask ${id}`, error);
        }
      });

      try {
        await Promise.all(updatePromises);
        toast.success("Selected subtasks updated");
      } catch {
        toast.error("Some subtasks failed to update");
      }
    }
  };

  const handleSubTaskDelete = async (item: any) => {
    try {
      await apiService.post(`/Task/delete-subtask/${item.id}?taskId=${taskId}`, {});
      const updated = subTask.filter((task) => task.id !== item.id);
      setSubTask(updated);
      toast.success("Subtask deleted successfully");

      const allCompleted = updated.every(st => st.status === 'Completed');
      if (updated.length > 0 && allCompleted && !isTaskCompleted) {
        setShowPostDeleteDialog(true);
      }

    } catch (error) {
      toast.error("Failed to delete subtask");
      console.error('Error deleting subtask:', error);
    }
  };

  const confirmCompleteTask = async () => {
    if (!pendingStatusChange) return;

    const { id, key } = pendingStatusChange;
    try {
      await apiService.post(`/Task/change-subtask-status/${id}?status=${key}&taskId=${taskId}`, {});
      await apiService.post(`/Task/complete-task/${taskId}`, {});
      toast.success("Task marked as completed");
      setShowConfirmDialog(false);
      setPendingStatusChange(null);
      await fetchTask();
      toggleRefresh();
    } catch (error) {
      toast.error("Failed to complete task");
      console.error(error);
    }
  };

  const confirmPostDeleteCompleteTask = async () => {
    try {
      await apiService.post(`/Task/complete-task/${taskId}`, {});
      toast.success("Task marked as completed");
      setShowPostDeleteDialog(false);
      await fetchTask();
      toggleRefresh();
    } catch (error) {
      toast.error("Failed to complete task");
      console.error(error);
    }
  };

  const columns: IColumn[] = [
    {
      key: 'title',
      name: 'Subtask Title',
      fieldName: 'title',
      minWidth: 200,
      isResizable: true,
    },
    {
      key: 'status',
      name: 'Status',
      fieldName: 'status',
      minWidth: 120,
      isResizable: true,
      onRender: (item: any) => (
        <Dropdown
          disabled={isTaskCompleted}
          selectedKey={item.status}
          options={statusOptions}
          onChange={(_, option) => handleStatusChange(option!.key, item.id)}
        />
      ),
    },
    {
      key: 'action',
      name: 'Action',
      fieldName: 'action',
      minWidth: 50,
      isResizable: true,
      onRender: (item: any) =>
        isTaskCompleted ? null : (
          <IconButton onClick={() => handleSubTaskDelete(item)} title="Delete"><Trash size={20} /></IconButton>
        ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Text styles={{ root: { fontSize: "16px", fontWeight: "500" } }}>Task Steps</Text>
          {!isTaskCompleted && (
            <IconButton onClick={() => setIsSubtaskPanelOpen(true)} title="Add">
              <Plus size={20} />
            </IconButton>
          )}
        </Stack>

        <AddSubtaskPanel
          isOpen={isSubtaskPanelOpen}
          onDismiss={() => {
            setIsSubtaskPanelOpen(false);
            fetchTask();
          }}
        />

        <Dropdown
          disabled={selectedKeys.size === 0 || isTaskCompleted}
          placeholder="Bulk Change Status"
          options={statusOptions}
          onChange={(_, option) => handleStatusChange(option!.key)}
        />
      </Stack>

      {subTask?.length > 0 ? (
        <DetailsList
          items={subTask}
          columns={columns}
          selectionMode={isTaskCompleted ? SelectionMode.none : SelectionMode.multiple}
          selection={selection!}
          checkboxVisibility={isTaskCompleted ? CheckboxVisibility.hidden : CheckboxVisibility.always}
          layoutMode={DetailsListLayoutMode.justified}
          styles={{ root: { borderRadius: 6 } }}
        />
      ) : (
        <Text
          style={{
            background: '#fff5f5',
            padding: '8px',
            borderRadius: 6,
            color: '#c50f1f',
          }}
        >
          ⚠️ No subtasks found for this task.
        </Text>
      )}

      {/* Modal: Completing Last Subtask */}
      <Dialog
        hidden={!showConfirmDialog}
        onDismiss={() => {
          setShowConfirmDialog(false);
          setPendingStatusChange(null);
        }}
        dialogContentProps={{
          title: 'Complete Task?',
          subText: 'Since this is your last subtask, completing it will mark the entire task as completed. You won’t be able to add or edit any further steps.',
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmCompleteTask} text="Confirm" />
          <DefaultButton
            onClick={() => {
              setShowConfirmDialog(false);
              setPendingStatusChange(null);
            }}
            text="Cancel"
          />
        </DialogFooter>
      </Dialog>

      {/* Modal: Post-Deletion Check */}
      <Dialog
        hidden={!showPostDeleteDialog}
        onDismiss={() => setShowPostDeleteDialog(false)}
        dialogContentProps={{
          title: 'Complete Task?',
          subText: 'After deletion, your remaining all subtasks are completed. Do you want to mark the task as completed?',
        }}
      >
        <DialogFooter>
          <PrimaryButton onClick={confirmPostDeleteCompleteTask} text="Yes, Complete Task" />
          <DefaultButton onClick={() => setShowPostDeleteDialog(false)} text="No" />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};

export default TaskSteps;
