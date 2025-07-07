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
import { Plus } from 'lucide-react';
import React from 'react';
import { toast } from 'react-toastify';
import apiService from '../api/apiService';
import { useUser } from '../context/UserContext';

const typeOptions: IDropdownOption[] = [
    { key: 'Individual', text: 'Individual' },
    { key: 'Partnership', text: 'Partnership' },
    { key: 'Limited Partnership', text: 'Limited Partnership' },
];

function AddBusinessPanel({ onSuccess }: { onSuccess?: () => void }) {
    const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false);
    const { id } = useUser();

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
        onSubmit: async (values) => {

            try {
                const formData = new FormData();
                formData.append("type", values.type);
                formData.append("name", values.name);
                formData.append("building", values.building);
                formData.append("city", values.city);
                formData.append("state", values.state);
                formData.append("country", values.country);
                formData.append("postcode", values.postcode);
                formData.append("UserId", id);

                const response = await apiService.post('/Business/create-business', formData);
                console.log('Create Business Response:', response);
                if (response === "Business Created Successfully") {
                    toast.success('Business created successfully!');
                    dismissPanel();
                    if (onSuccess) onSuccess(); 
                } else {
                    toast.error('Failed to create business');
                }
            } catch (error: any) {
                toast.error('Error creating business');
                console.error('Create Business Error:', error?.response?.data || error);
            }
        },
    });

    const onRenderFooterContent = React.useCallback(
        () => (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <PrimaryButton onClick={() => formik.handleSubmit()}>Save</PrimaryButton>
                <DefaultButton onClick={dismissPanel}>Cancel</DefaultButton>
            </div>
        ),
        [formik, dismissPanel]
    );

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
                    <Dropdown
                        label="Type"
                        placeholder="Select type"
                        options={typeOptions}
                        selectedKey={formik.values.type}
                        onChange={(_, opt) => formik.setFieldValue('type', opt?.key)}
                        required
                        styles={{ dropdown: { border: '1px solid #d0d0d0', borderRadius: 6 } }}
                    />
                    <TextField
                        label="Business Name"
                        value={formik.values.name}
                        onChange={(_, val) => formik.setFieldValue('name', val)}
                        required
                        styles={textFieldStyles}
                    />
                    <TextField
                        label="Building"
                        value={formik.values.building}
                        onChange={(_, val) => formik.setFieldValue('building', val)}
                        required
                        styles={textFieldStyles}
                    />
                    <TextField
                        label="City"
                        value={formik.values.city}
                        onChange={(_, val) => formik.setFieldValue('city', val)}
                        required
                        styles={textFieldStyles}
                    />
                    <TextField
                        label="Postcode"
                        value={formik.values.postcode}
                        onChange={(_, val) => formik.setFieldValue('postcode', val)}
                        required
                        styles={textFieldStyles}
                    />
                    <TextField
                        label="Country"
                        value={formik.values.country}
                        onChange={(_, val) => formik.setFieldValue('country', val)}
                        required
                        styles={textFieldStyles}
                    />
                    <TextField
                        label="State"
                        value={formik.values.state}
                        onChange={(_, val) => formik.setFieldValue('state', val)}
                        required
                        styles={textFieldStyles}
                    />
                </form>
            </Panel>
        </>
    );
}

export default AddBusinessPanel;
