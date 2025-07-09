import {
    DefaultButton,
    Panel,
    Dropdown,
    TextField,
    PrimaryButton,
    type IDropdownOption,
    type ITextFieldStyles,
} from '@fluentui/react';
import { useBoolean } from '@fluentui/react-hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import apiService from '../api/apiService';
import { useUser } from '../context/UserContext';
import { useRefresh } from '../context/RefreshContext';

const typeOptions: IDropdownOption[] = [
    { key: 'Individual', text: 'Individual' },
    { key: 'Partnership', text: 'Partnership' },
    { key: 'Limited Partnership', text: 'Limited Partnership' },
];

const validationSchema = Yup.object({
    type: Yup.string().required('Business type is required'),
    name: Yup.string().required('Business name is required'),
    building: Yup.string().required('Building is required'),
    city: Yup.string().required('City is required'),
    postcode: Yup.string().required('Postcode is required'),
    country: Yup.string().required('Country is required'),
    state: Yup.string().required('State is required'),
});

function AddBusinessPanel({ onSuccess }: { onSuccess?: () => void }) {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const { id } = useUser();
    const { toggleRefresh } = useRefresh();
    const [submitting, setSubmitting] = useState(false);

    const formik = useFormik({
        initialValues: {
            type: '',
            name: '',
            building: '',
            city: '',
            postcode: '',
            country: '',
            state: '',
        },
        validate: values => {
            const errors: any = {};
            if (!values.type) errors.type = 'Type is required';
            if (!values.name) errors.title = 'Name is required';
            if (!values.city) errors.priority = 'City is required';
            if (!values.country) errors.startDate = 'Country is required';
            if (!values.postcode) errors.assignee = 'Postcode is required';
            if (!values.state) errors.description = 'State is required';
            if (!values.building) errors.file = 'Building is required';
            return errors;
        },
        onSubmit: async (values, { resetForm }) => {
            setSubmitting(true);
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, value]) =>
                    formData.append(key, value)
                );
                formData.append("UserId", id ?? "");

                const response = await apiService.post('/Business/create-business', formData);
                if (response === "Business Created Successfully") {
                    toast.success('Business created successfully!');
                    toggleRefresh();
                    dismissPanel();
                    onSuccess?.();
                } else {
                    toast.error('Failed to create business');
                }
            } catch (error: any) {
                toast.error('Error creating business');
                console.error('Create Business Error:', error?.response?.data || error);
            } finally {
                setSubmitting(false);
                resetForm();
            }
        },
    });

    const textFieldStyles: Partial<ITextFieldStyles> = {
        fieldGroup: {
            borderRadius: 6,
            border: '1px solid #d0d0d0',
            selectors: {
                ':hover': { borderColor: '#c0c0c0' },
                ':focus-within': { borderColor: '#ccc' },
            },
        },
        field: { borderRadius: 6 },
    };

    const onRenderFooterContent = () => (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <PrimaryButton type="submit" onClick={formik.handleSubmit} disabled={submitting}>
                {submitting ? 'Saving...' : 'Save'}
            </PrimaryButton>
            <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
        </div>
    );

    return (
        <>
            <DefaultButton
                onClick={openPanel}
                text="Add"
                styles={{ root: { border: 'none' } }}
                onRenderIcon={() => <Plus size={19} />}
            />
            <Panel
                isOpen={isOpen}
                onDismiss={dismissPanel}
                headerText="Add Business"
                closeButtonAriaLabel="Close"
                onRenderFooterContent={onRenderFooterContent}
                isFooterAtBottom={true}
                styles={{ main: { fontWeight: 400, minWidth: '700px' } }}
            >
                <form
                    onSubmit={formik.handleSubmit}
                    style={{
                        borderTop: '1px solid #ccc',
                        paddingTop: '20px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 16,
                    }}
                >
                    <div>
                        <Dropdown
                            label="Type"
                            placeholder="Select type"
                            options={typeOptions}
                            selectedKey={formik.values.type}
                            onChange={(_, opt) => formik.setFieldValue('type', opt?.key)}
                            styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6 } }}
                             errorMessage={formik.touched.type ? formik.errors.type : undefined}
                             required
                        />
                    </div>

                    <div>
                        <TextField
                            label="Business Name"
                            value={formik.values.name}
                            onChange={(_, val) => formik.setFieldValue('name', val)}
                            styles={textFieldStyles}
                            errorMessage={formik.touched.name ? formik.errors.name : undefined}
                            required
                        />

                    </div>

                    <div>
                        <TextField
                            label="Building"
                            value={formik.values.building}
                            onChange={(_, val) => formik.setFieldValue('building', val)}
                            styles={textFieldStyles}
                            errorMessage={formik.touched.building ? formik.errors.building : undefined}
                            required
                        />
                    </div>

                    <div>
                        <TextField
                            label="City"
                            value={formik.values.city}
                            onChange={(_, val) => formik.setFieldValue('city', val)}
                            styles={textFieldStyles}
                            errorMessage={formik.touched.city ? formik.errors.city : undefined}
                        />
                    </div>

                    <div>
                        <TextField
                            label="Postcode"
                            value={formik.values.postcode}
                            onChange={(_, val) => formik.setFieldValue('postcode', val)}
                            styles={textFieldStyles}
                            errorMessage={formik.touched.postcode ? formik.errors.postcode : undefined}
                        />
                    </div>

                    <div>
                        <TextField
                            label="Country"
                            value={formik.values.country}
                            onChange={(_, val) => formik.setFieldValue('country', val)}
                            styles={textFieldStyles}
                            errorMessage={formik.touched.country ? formik.errors.country : undefined}
                        />
                    </div>

                    <div>
                        <TextField
                            label="State"
                            value={formik.values.state}
                            onChange={(_, val) => formik.setFieldValue('state', val)}
                            styles={textFieldStyles}
                            errorMessage={formik.touched.state ? formik.errors.state : undefined}
                        />
                    </div>
                </form>
            </Panel>
        </>
    );
}

export default AddBusinessPanel;
