// EditBusinessPanel.tsx
import {
    DefaultButton,
    Panel,
    Dropdown,
    TextField,
    PrimaryButton,
    type IDropdownOption,
    type ITextFieldStyles,
} from '@fluentui/react';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import apiService from '../api/apiService';
import { useRefresh } from '../context/RefreshContext';

const typeOptions: IDropdownOption[] = [
    { key: 'Individual', text: 'Individual' },
    { key: 'Partnership', text: 'Partnership' },
    { key: 'Limited Partnership', text: 'Limited Partnership' },
];

function EditBusinessPanel({
    businessId,
    isOpen,
    onDismiss,
}: {
    businessId: string;
    isOpen: boolean;
    onDismiss: () => void;
}) {
    const { toggleRefresh } = useRefresh();
    const [loading, setLoading] = useState(false);
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
        enableReinitialize: true,
        onSubmit: async (values) => {
            setSubmitting(true);
            try {
                const formData = new FormData();
                Object.entries(values).forEach(([key, val]) => {
                    formData.append(key, val);
                });

                const res = await apiService.post(`/Business/update-business-by-id/${businessId}`, formData);
                toast.success('Business updated successfully!');
                toggleRefresh();
                onDismiss();
            } catch (err: any) {
                toast.error(err?.response?.data || 'Error updating business');
            } finally {
                setSubmitting(false);
            }
        },
    });

    const fetchBusinessDetails = async () => {
        console.log('Fetching business details for ID:', businessId);
        setLoading(true);
        try {
            const response = await apiService.get(`/Business/get-business-by-id/${businessId}`);
            if (response.business) {
                formik.setValues({
                    type: response.business.type,
                    name: response.business.name,
                    building: response.business.building,
                    city: response.business.city,
                    postcode: response.business.postcode,
                    country: response.business.country,
                    state: response.business.state,
                });
            } else {
                toast.error('Business not found');
            }
        } catch (error) {
            console.error('Error fetching business details:', error);
            toast.error('Failed to fetch business details');
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        console.log('Fetching business details for ID:', businessId);
        if (businessId) {
            console.log('Fetching business details for ID:', businessId);
            fetchBusinessDetails()
        }
    }, [businessId, isOpen]);

    const textFieldStyles: Partial<ITextFieldStyles> = {
        fieldGroup: {
            borderRadius: 6,
            border: '1px solid #d0d0d0',
        },
        field: { borderRadius: 6 },
    };

    return (
        <Panel
            isOpen={isOpen}
            onDismiss={onDismiss}
            headerText="Edit Business"
            closeButtonAriaLabel="Close"
            isFooterAtBottom
            styles={{ main: { fontWeight: 400, minWidth: '700px' } }}
            onRenderFooterContent={() => (
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                    <PrimaryButton
                        text={submitting ? 'Saving...' : 'Save'}
                        onClick={() => formik.handleSubmit()}
                        disabled={submitting}
                    />
                    <DefaultButton text="Cancel" onClick={onDismiss} />
                </div>
            )}
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
    );
}

export default EditBusinessPanel;
