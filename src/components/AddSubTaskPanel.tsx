import React, { useEffect, useState } from 'react';
import {
    Panel,
    TextField,
    PrimaryButton,
    DefaultButton,
    Dropdown,
    Stack,
    IconButton,
    Text,
    PanelType,
    type IDropdownOption
} from '@fluentui/react';
import { useParams } from 'react-router';
import { Plus, Trash2 } from 'lucide-react';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useRefresh } from '../context/RefreshContext';


const AddSubtaskPanel = ({ isOpen, onDismiss }: { isOpen: boolean; onDismiss: () => void }) => {
    const { taskId } = useParams<{ taskId: string }>();
    const [task, setTask] = useState<any>(null);
    const [subTasks, setSubTasks] = useState([{ title: '', status: 'Waiting' }]);
    const [alreadyExistedSubTasks, setAlreadyExistedSubTasks] = useState([]);
    const { toggleRefresh } = useRefresh()

    const fetchTask = async () => {
        try {
            const res = await apiService.get(`/Task/get-task-by-id/${taskId}`);
            setTask(res.task);
            const activeSubtasks = (res.task.subtask || []).filter(
                (sub) => sub.isActive === true
            );

            setAlreadyExistedSubTasks(activeSubtasks);
        } catch (error) {
            console.error('Error fetching task details:', error);
        }
    };


    const handleSubtaskChange = (index: number, field: string, value: string) => {
        setSubTasks((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const handleAddSteps = () => {
        setSubTasks((prev) => [...prev, { title: '', status: 'Waiting' }]);
    };

    const handleRemoveSubtask = (index: number) => {
        setSubTasks((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        try {
            for (const sub of subTasks) {
                await apiService.post(`/Task/add-subtask/${taskId}`, sub);
                toggleRefresh()
            }
            onDismiss();
        } catch (error) {
            console.error('Error submitting subtasks:', error);
        }
    };


    const onRenderFooterContent = () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <PrimaryButton type="submit" onClick={handleSubmit} >
                {/* {submitting ? 'Saving...' : 'Save'} */} Save
            </PrimaryButton>
            <DefaultButton onClick={onDismiss}>Cancel</DefaultButton>
        </div>
    );

    const handleSubTaskDelete = async (id: string) => {
        try {
            await apiService.post(`/Task/delete-subtask/${id}?taskId=${taskId}`, {});
            toast.success("Subtask deleted successfully");
            setAlreadyExistedSubTasks((prev) => prev.filter((subtask) => subtask.id !== id));
            toggleRefresh()
        } catch (error) {
            toast.error("Failed to delete subtask");
            console.error('Error deleting subtask:', error);
        }
    };

    useEffect(() => {
        if (isOpen) fetchTask();
    }, [isOpen]);
    return (
        <Panel
            isOpen={isOpen}
            onDismiss={onDismiss}
            headerText="Add Subtasks"
            type={PanelType.medium}
            closeButtonAriaLabel="Close"
            isFooterAtBottom={true}
            onRenderFooterContent={onRenderFooterContent}
        >
            <Stack tokens={{ childrenGap: 16 }}>
                <TextField label="Business Name" value={task?.businessName || ''} disabled />
                <TextField label="Task Name" value={task?.type || ''} disabled />
                <TextField label="Task Title" value={task?.title || ''} disabled />

                <Stack tokens={{ childrenGap: 12 }}>
                    <Text variant="mediumPlus">Previously added steps</Text>
                    {alreadyExistedSubTasks.length > 0 && (
                        <Stack tokens={{ childrenGap: 8 }}>
                            {alreadyExistedSubTasks.map((subtask) => (
                                <Stack
                                    key={subtask.id}
                                    horizontal
                                    tokens={{ childrenGap: 8 }}
                                    verticalAlign="center"
                                    styles={{
                                        root: {
                                            padding: 0,
                                            borderRadius: 6,
                                        }
                                    }}
                                >
                                    <TextField
                                        placeholder="Step title"
                                        value={subtask.title}
                                        disabled
                                        styles={{ root: { width: '50%' } }}
                                    />
                                    <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => handleSubTaskDelete(subtask.id)} />
                                </Stack>
                            ))}
                        </Stack>
                    )}
                    <Text variant="mediumPlus">Add new steps</Text>
                    {subTasks.map((subtask, index) => (
                        <Stack
                            key={index}
                            horizontal
                            tokens={{ childrenGap: 8 }}
                            verticalAlign="center"
                            styles={{
                                root: {
                                    padding: 0,
                                    borderRadius: 6
                                }
                            }}
                        >
                            <TextField
                                placeholder="Step title"
                                value={subtask.title}
                                onChange={(e, v) => handleSubtaskChange(index, 'title', v || '')}
                                styles={{ root: { width: '50%' } }}
                            />
                            <IconButton iconProps={{ iconName: 'Delete' }} onClick={() => handleRemoveSubtask(index)} />
                        </Stack>
                    ))}

                    <PrimaryButton text="Steps" onClick={handleAddSteps} iconProps={{ iconName: 'Add' }}
                        styles={{ root: { width: 'fit-content' } }}
                    />
                </Stack>
            </Stack>
        </Panel>
    );
};

export default AddSubtaskPanel;
