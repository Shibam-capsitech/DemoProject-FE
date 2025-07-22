import React, { useEffect, useState } from 'react';
import {
    Panel,
    PrimaryButton,
    DefaultButton,
    TextField,
    Dropdown,
    DatePicker,
    type IDropdownOption,
    Stack,
} from '@fluentui/react';
import { useFormik } from 'formik';
import apiService from '../api/apiService';

const softFieldStyles = {
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

const softDatePickerStyles = {
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

interface EditTaskPanelProps {
    isOpen: boolean;
    onDismiss: () => void;
    taskId: string;
    onSuccess: () => void;
}

const EditTaskPanel: React.FC<EditTaskPanelProps> = ({
    isOpen,
    onDismiss,
    taskId,
    onSuccess,
}) => {
    const [task, setTask] = useState<any>(null);
    const [businessOptions, setBusinessOptions] = useState<IDropdownOption[]>([]);
    const [userOptions, setUserOptions] = useState<IDropdownOption[]>([]);
    const fetchTask = async () => {
        try {
            const res = await apiService.get(`/Task/get-task-by-id/${taskId}`);
            setTask(res.task);
        } catch (error) {
            console.error('Error fetching task:', error);
        }
    };

    useEffect(() => {
        if (isOpen && taskId) fetchTask();
    }, [isOpen, taskId]);

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            type: task?.type || '',
            businessId: task?.businessDetails?.id || '',
            title: task?.title || '',
            startDate: task?.startdate ? new Date(task.startdate) : new Date(),
            dueDate: task?.duedate ? new Date(task.duedate) : new Date(),
            deadline: task?.deadline ? new Date(task.deadline) : new Date(),
            priority: task?.priority || '',
            description: task?.description || '',
            assignee: task?.assignee?.id || '',
        },
        onSubmit: async (values) => {
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
                await apiService.post(`/Task/update-task/?taskId=${taskId}&businessId=${task.businessDetails.id}`, payload);

                onSuccess();
                onDismiss();
            } catch (err) {
                console.error('Update failed:', err);
            }
        },
    });
    useEffect(() => {
        if (taskId) fetchTask();

        const fetchBusinesses = async () => {
            try {
                const businessRes = await apiService.get('/Business/get-all-businesses-name');
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
    return (
        <Panel
            isOpen={isOpen}
            onDismiss={onDismiss}
            headerText="Edit Task"
            isFooterAtBottom
            onRenderFooterContent={() => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <PrimaryButton onClick={() => formik.handleSubmit()}>Update</PrimaryButton>
                    <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
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
                    disabled
                    value={formik.values.type}
                    onChange={(_, val) => formik.setFieldValue('type', val)}
                    styles={{
                        ...softFieldStyles,
                        root: { flex: 1 }, 
                    }}
                />
                <TextField
                    label="Business"
                    disabled
                    value={task?.businessDetails?.name}
                    styles={{
                         ...softFieldStyles,
                        root: { flex: 1 }, 
                    }}
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
                    onSelectDate={(date) => formik.setFieldValue('startDate', date!)}
                    styles={softDatePickerStyles}
                />
                <DatePicker
                    label="Due Date"
                    value={formik.values.dueDate}
                    onSelectDate={(date) => formik.setFieldValue('dueDate', date!)}
                    styles={softDatePickerStyles}
                />
                <DatePicker
                    label="Deadline"
                    value={formik.values.deadline}
                    onSelectDate={(date) => formik.setFieldValue('deadline', date!)}
                    styles={{ ...softDatePickerStyles, root: { gridColumn: 'span 2' } }}
                />
                <Dropdown
                    label="Priority"
                    options={[
                        { key: 'High', text: 'High' },
                        { key: 'Medium', text: 'Medium' },
                        { key: 'Low', text: 'Low' },
                    ]}
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
    );
};

export default EditTaskPanel;
