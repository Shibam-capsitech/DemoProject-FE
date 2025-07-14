import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  Link,
  DefaultButton,
  Panel,
  TextField,
  Dropdown,
  DatePicker,
  PrimaryButton,
  type IDropdownOption,
  type ITextFieldStyles,
  type IDatePickerStyles,
  type IStyleFunctionOrObject,
  type IDatePickerStyleProps,
  IconButton,
} from '@fluentui/react';
import { useParams } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';
import { useFormik } from 'formik';
import apiService from '../api/apiService';
import { initializeIcons } from '@fluentui/react';
import { useRefresh } from '../context/RefreshContext';
import { Edit } from 'lucide-react';
import { useUser } from '../context/UserContext';

initializeIcons();

const priorityOptions: IDropdownOption[] = [
  { key: 'High', text: 'High' },
  { key: 'Medium', text: 'Medium' },
  { key: 'Low', text: 'Low' },
];

const softFieldStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {
    borderRadius: 6,
    border: '1px solid #d0d0d0',
    selectors: {
      ':hover': { borderColor: '#bfbfbf' },
      ':focus-within': { borderColor: '#999' },
    },
  },
  field: { borderRadius: 6 },
};

const softDatePickerStyles: IStyleFunctionOrObject<IDatePickerStyleProps, IDatePickerStyles> = {
  textField: {
    selectors: {
      '.ms-TextField-fieldGroup': {
        border: '1px solid #d0d0d0',
        borderRadius: 6,
        ':hover': { borderColor: '#bfbfbf' },
        ':focus-within': { borderColor: '#999' },
      },
    },
  },
};

const labelStyle = { fontWeight: '600', color: '#666', fontSize: 14 };
const valueStyle = { fontSize: 16, fontWeight: '500' };

const TaskSummary: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [task, setTask] = useState<any>(null);
  const [isPanelOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [businessOptions, setBusinessOptions] = useState<IDropdownOption[]>([]);
  const [userOptions, setUserOptions] = useState<IDropdownOption[]>([]);
  const { toggleRefresh } = useRefresh();
  const { role } = useUser()


  const fetchTask = async () => {
    try {
      const res = await apiService.get(`/Task/get-task-by-id/${taskId}`);
      setTask(res.task);
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      type: task?.type || '',
      businessId: task?.businessDetails.id || '',
      title: task?.title || '',
      startDate: task?.startdate ? new Date(task.startdate) : new Date(),
      dueDate: task?.duedate ? new Date(task.duedate) : new Date(),
      deadline: task?.deadline ? new Date(task.deadline) : new Date(),
      priority: task?.priority || '',
      description: task?.description || '',
      assignee: task?.assignee.id || '',
    },
    onSubmit: async (values) => {
      const businessIdForTask = task.businessDetails.id;
      const assigneeUser = userOptions.find((u) => u.key === values.assignee);

      const payload = {
        ...values,
        startdate: values.startDate,
        duedate: values.dueDate,
        deadline: values.deadline,
        assignee: {
          id: values.assignee,
          name: assigneeUser?.text || '',
        },
      };

      try {
        const res = await apiService.post(
          `/Task/update-task/?taskId=${taskId}&businessId=${businessIdForTask}`,
          payload
        );
        console.log('Task updated:', res);
        dismissPanel();
        fetchTask();
        toggleRefresh();
      } catch (err) {
        console.error('Edit failed:', err);
      }
    }

  });

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
  }, [taskId]);


  const formatDate = (date: string | Date) => new Date(date).toLocaleDateString('en-GB');

  if (!task) return <Text>Loading task summary...</Text>;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 5, Width: 300, } }}>
      <Stack horizontal horizontalAlign="space-between" >
        <Stack>
          <Text styles={{ root: labelStyle }}>Task name</Text>
          <Link styles={{ root: { ...valueStyle, color: '#0078d4', fontSize: 16 } }}>{task.title || 'N/A'}</Link>
        </Stack>
        {role !== "Staff" && <IconButton onClick={openPanel} styles={{ root: { border: "none", padding: 0, color: "black" } }} > <Edit size={20} />  </IconButton>}
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
        <Link styles={{ root: { ...valueStyle, color: '#0078d4' } }}> {userOptions.find(u => u.key === task.assignee)?.text || 'N/A'}</Link>
      </Stack>

      <Panel
        isOpen={isPanelOpen}
        onDismiss={dismissPanel}
        headerText="Edit Task"
        isFooterAtBottom
        onRenderFooterContent={() => (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <PrimaryButton onClick={() => formik.handleSubmit()}>Update</PrimaryButton>
            <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
          </div>
        )}
        styles={{ main: { minWidth: '700px' } }}
      >
        <form
          style={{
            borderTop: '1px solid #ccc',
            paddingTop: 20,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}
        >
          <TextField
            label="Type"
            disabled value={formik.values.type}
            onChange={(_, val) => formik.setFieldValue('type', val)}
            styles={{ ...softFieldStyles, root: { gridColumn: 'span 2' } }}
          />
          <Dropdown
            label="Business"
            disabled
            options={businessOptions}
            selectedKey={formik.values.businessId}
            onChange={(_, opt) => formik.setFieldValue('businessId', opt?.key)}
            styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6, gridColumn: 'span 2' } }}
          />
          <TextField
            label="Title"
            value={formik.values.title}
            onChange={(_, val) => formik.setFieldValue('title', val)}
            styles={{ ...softFieldStyles, root: { gridColumn: 'span 2' } }}
          />
          <DatePicker
            label="Start Date"
            value={formik.values.startDate}
            onSelectDate={date => formik.setFieldValue('startDate', date!)}
            styles={softDatePickerStyles}
          />
          <DatePicker
            label="Due Date"
            value={formik.values.dueDate}
            onSelectDate={date => formik.setFieldValue('dueDate', date!)}
            styles={softDatePickerStyles}
          />
          <DatePicker
            label="Deadline"
            value={formik.values.deadline}
            onSelectDate={date => formik.setFieldValue('deadline', date!)}
            styles={{ ...softDatePickerStyles, root: { gridColumn: 'span 2' } }}
          />
          <Dropdown
            label="Priority"
            options={priorityOptions}
            selectedKey={formik.values.priority}
            onChange={(_, opt) => formik.setFieldValue('priority', opt?.key)}
            styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6 } }}
          />
          <Dropdown
            label="Assignee"
            options={userOptions}
            selectedKey={formik.values.assignee}
            onChange={(_, opt) => formik.setFieldValue('assignee', opt?.key)}
            styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6 } }}
          />
          <TextField
            label="Description"
            multiline
            rows={3}
            value={formik.values.description}
            onChange={(_, val) => formik.setFieldValue('description', val)}
            styles={{ ...softFieldStyles, root: { gridColumn: 'span 2' } }}
          />
        </form>
      </Panel>
    </Stack>
  );
};

export default TaskSummary;