import {
  DefaultButton,
  Panel,
  TextField,
  DatePicker,
  Dropdown,
  PrimaryButton,
  type IDropdownOption,
  type ITextFieldStyles,
  type IStyleFunctionOrObject,
  type IDatePickerStyleProps,
  type IDatePickerStyles,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useFormik } from 'formik';
import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useRefresh } from '../context/RefreshContext';

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

function AddTaskPanel() {
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
  const [businessOptions, setBusinessOptions] = useState<IDropdownOption[]>([]);
  const [assigneeOptions, setAssigneeOptions] = useState<IDropdownOption[]>([]);
  const {toggleRefresh} = useRefresh()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessRes = await apiService.get('/Business/get-all-businesses');
        const businessOpts = businessRes.businesses.map((b: any) => ({
          key: b.id,
          text: b.name,
        }));
        setBusinessOptions(businessOpts);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      }

      try {
        const userRes = await apiService.get('/User/get-all-users');
        const userOpts = userRes.users.result.map((u: any) => ({
          key: u.id,
          text: u.name,
        }));
        setAssigneeOptions(userOpts);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchData();
  }, []);

  const formik = useFormik({
    initialValues: {
      type: '',
      businessId: '',
      title: '',
      startDate: new Date(),
      dueDate: new Date(),
      deadline: new Date(),
      priority: '',
      description: '',
      assignee: '',
      file: null as File | null,
    },
    validate: values => {
      const errors: any = {};
      if (!values.type) errors.type = 'Type is required';
      if (!values.businessId) errors.businessId = 'Business selection is required';
      if (!values.title) errors.title = 'Title is required';
      if (!values.priority) errors.priority = 'Priority is required';
      if (values.startDate > values.dueDate) errors.startDate = 'Start must be before Due';
      if (values.dueDate > values.deadline) errors.dueDate = 'Due must be before Deadline';
      return errors;
    },
    onSubmit: async values => {
      const selectedBusiness = businessOptions.find(opt => opt.key === values.businessId);
    const businessName = selectedBusiness?.text || '';
      try {
        const formData = new FormData();
        formData.append('type', values.type);
        formData.append('businessName', businessName);
        formData.append('title', values.title);
        formData.append('startDate', values.startDate.toISOString());
        formData.append('dueDate', values.dueDate.toISOString());
        formData.append('deadline', values.deadline.toISOString());
        formData.append('priority', values.priority);
        formData.append('description', values.description);
        formData.append('assignee', values.assignee || '');
        formData.append('businessId', values.businessId);
        if (values.file) {
          formData.append('file', values.file);
        }

        const res = await apiService.post('/Task/create-task', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Task created successfully!');
        toggleRefresh()
        dismissPanel();
      } catch (err) {
        console.error('Task creation failed:', err);
      }
    }

  });

  const onRenderFooterContent = (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
      <PrimaryButton type="submit" onClick={formik.handleSubmit} disabled={!formik.isValid}>
        Save
      </PrimaryButton>
      <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
    </div>
  );

  return (
    <>
      <DefaultButton
        onClick={openPanel}
        text="Add"
        onRenderIcon={() => <Plus size={19} />}
        styles={{ root: { border: 'none', fontSize: '15px' } }}
      />
      <Panel
        isOpen={isOpen}
        onDismiss={dismissPanel}
        headerText="Add Task"
        onRenderFooterContent={() => onRenderFooterContent}
        isFooterAtBottom
        styles={{ main: { minWidth: '700px' } }}
      >
        <form
          onSubmit={formik.handleSubmit}
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
            value={formik.values.type}
            onChange={(_, val) => formik.setFieldValue('type', val)}
            onBlur={formik.handleBlur}
             errorMessage={formik.touched.businessId ? formik.errors.businessId : undefined}
            required
            styles={{ ...softFieldStyles, root: { gridColumn: 'span 2' } }}
          />

          <Dropdown
            label="Business"
            options={businessOptions}
            selectedKey={formik.values.businessId}
            onChange={(_, opt) => formik.setFieldValue('businessId', opt?.key)}
            onBlur={() => formik.setFieldTouched('businessId', true)}
            errorMessage={formik.touched.businessId ? formik.errors.businessId : undefined}
            required
            styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6, gridColumn: 'span 2' } }}  
          />

          <TextField
            label="Title"
            value={formik.values.title}
            onChange={(_, val) => formik.setFieldValue('title', val)}
            onBlur={formik.handleBlur}
            errorMessage={formik.touched.priority ? formik.errors.priority : undefined}
            required
            styles={{ ...softFieldStyles, root: { gridColumn: 'span 2' } }}
          />

          <DatePicker
            label="Start Date"
            value={formik.values.startDate}
            onSelectDate={date => formik.setFieldValue('startDate', date!)}
            isRequired
            styles={softDatePickerStyles}
          />
          <DatePicker
            label="Due Date"
            value={formik.values.dueDate}
            onSelectDate={date => formik.setFieldValue('dueDate', date!)}
            isRequired
            styles={softDatePickerStyles}
          />
          <DatePicker
            label="Deadline"
            value={formik.values.deadline}
            onSelectDate={date => formik.setFieldValue('deadline', date!)}
            isRequired
            styles={{ ...softDatePickerStyles, root: { gridColumn: 'span 2' } }}
          />

          <Dropdown
            label="Priority"
            options={priorityOptions}
            selectedKey={formik.values.priority}
            onChange={(_, opt) => formik.setFieldValue('priority', opt?.key)}
            onBlur={() => formik.setFieldTouched('priority', true)}
            errorMessage={formik.touched.priority ? formik.errors.priority : undefined}
            required
            styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6 } }}

          />
          <Dropdown
            label="Assignee"
            options={assigneeOptions}
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

          <input
            type="file"
            onChange={e => {
              const f = e.currentTarget.files?.[0] || null;
              formik.setFieldValue('file', f);
            }}
            style={{ gridColumn: 'span 2' }}
          />
        </form>
      </Panel>
    </>
  );
}

export default AddTaskPanel;
