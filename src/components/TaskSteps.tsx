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
  type IDropdownOption,
  type IColumn,
} from '@fluentui/react';
import { Delete, Plus, Trash } from 'lucide-react';
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
;

const TaskSteps = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [subTask, setSubTask] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [selection, setSelection] = useState<Selection | null>(null);
  const {toggleRefresh} = useRefresh()

  const fetchTask = async () => {
    try {
      const res = await apiService.get(`/Task/get-task-by-id/${taskId}`);
      setSubTask(res.task.subTask || []);
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
      setSubTask((prev) =>
        prev.map((task) =>
          task.id === itemId ? { ...task, status: key } : task
        )
      );
      const formData = new FormData();
      formData.append('status', key as string);

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
      await apiService.post(`/Task/delete-subtask/${item.id}?taskId=${taskId}`,{});
      setSubTask((prev) => prev.filter((task) => task.id !== item.id));
      toast.success("Subtask deleted successfully");
    } catch (error) {
      toast.error("Failed to delete subtask");
      console.error('Error deleting subtask:', error);
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
      onRender: (item: any) => (
        <IconButton onClick={()=>handleSubTaskDelete(item)} title="Delete"><Trash size={20} /></IconButton>
      ),
    },
  ];
  const [isSubtaskPanelOpen, setIsSubtaskPanelOpen] = useState(false);


  return (
    <Stack tokens={{ childrenGap: 16 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
          <Text styles={{ root: { fontSize: "18px", fontWeight: "500" } }}>Task Steps</Text>
          <IconButton onClick={() => setIsSubtaskPanelOpen(true)} title="Add"><Plus size={20} /></IconButton>
        </Stack>
        <AddSubtaskPanel
          isOpen={isSubtaskPanelOpen}
          onDismiss={() => {
            setIsSubtaskPanelOpen(false);
            fetchTask();
          }}
        />

        <Dropdown
          disabled={selectedKeys.size === 0}
          placeholder="Bulk Change Status"
          options={statusOptions}
          onChange={(_, option) => handleStatusChange(option!.key)}
        />
      </Stack>

      {subTask?.length > 0 ? (
        <DetailsList
          items={subTask}
          columns={columns}
          selectionMode={SelectionMode.multiple}
          selection={selection!}
          checkboxVisibility={CheckboxVisibility.always}
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
    </Stack>
  );
};

export default TaskSteps;
