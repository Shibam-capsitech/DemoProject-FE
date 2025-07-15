// src/pages/ClientPage.tsx
import React, { useEffect, useState } from 'react';
import CustomTable from '../components/DataTable';
import Layout from '../components/Layout/Layout';
import { DefaultButton, type IDropdownOption } from '@fluentui/react';
import { Trash2, Edit2, Eye, RefreshCcw } from 'lucide-react';
import AddBusinessPanel from '../components/AddBusinessPanel';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useRefresh } from '../context/RefreshContext';
import { useNavigate } from 'react-router-dom';


const ClientPage: React.FC = () => {
  const [clientData, setClientData] = useState<any[]>([]);
  const { refresh } = useRefresh()
  const navigate = useNavigate()
  const columns = [
    {
      key: 'bid',
      name: 'Client ID',
      fieldName: 'bid',
      maxWidth: 100,
      isResizable: true,
      onRender: (item: any) => (
        <span
          style={{
            fontFamily: 'monospace',
            backgroundColor: '#d4f4dd',
            color: '#1b5e20',
            padding: '2px 6px',
            borderRadius: 4,
            display: 'inline-block',
          }}
        >
          {item.bId}
        </span>
      ),
    },
    {
      key: 'type',
      name: 'Type',
      fieldName: 'type',
      maxWidth: 150,
      isResizable: true,
      onRender: (item: any) => <span style={{ color: '#555' }}>{item.type}</span>,
    },
    {
      key: 'name',
      name: 'Business Name',
      fieldName: 'name',
      maxWidth: 260,
      isResizable: true,
      onRender: (item: any) => <span style={{ color: '#0078d4', cursor: "pointer" }} onClick={(e: any) => navigate(`/admin/clients/${item.id}`)}>{item.name}</span>,
    },
    {
      key: 'building',
      name: 'Building',
      fieldName: 'building',
      maxWidth: 200,
      isResizable: true,
      onRender: (item: any) => <span style={{ color: '#444' }}>{item.address.building}</span>,
    },
    {
      key: 'city',
      name: 'City',
      fieldName: 'city',
      maxWidth: 200,
      onRender: (item: any) => <span style={{ textTransform: 'capitalize' }}>{item.address.city}</span>,
    },
    {
      key: 'state',
      name: 'State',
      fieldName: 'state',
      minWidth: 200,
      onRender: (item: any) => <span style={{ textTransform: 'capitalize' }}>{item.address.state}</span>,
    },
    {
      key: 'country',
      name: 'Country',
      fieldName: 'country',
      minWidth: 200,
      onRender: (item: any) => <span>{item.address.country}</span>,
    },
    {
      key: 'postcode',
      name: 'Postcode',
      fieldName: 'postcode',
      minWidth: 100,
      onRender: (item: any) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{item.address.postcode}</span>,
    },
    {
      key: 'username',
      name: 'Username',
      fieldName: 'username',
      minWidth: 200,
      onRender: (item: any) => <span style={{ fontWeight: 500 }}>{item.createdBy?.name}</span>,
    },
    {
      key: 'email',
      name: 'Email',
      fieldName: 'email',
      minWidth: 180,
      isResizable: true,
      onRender: (item: any) => <span style={{ fontStyle: 'italic', color: '#444' }}>{item.createdBy?.email}</span>,
    },
    {
      key: 'createdAt',
      name: 'Created At',
      fieldName: 'createdAt',
      minWidth: 140,
      onRender: (item: any) => (
        <span style={{ color: '#888' }}>
          {new Date(item.createdBy?.date).toLocaleDateString('en-GB')}
        </span>
      ),
    },
  ];

  const criteria: IDropdownOption[] = [
    { key: 'Type', text: 'Business Type' },
    // { key: 'state', text: 'State' },
  ];

  const valueMap: Record<string, IDropdownOption[]> = {
    Type: [
      { key: 'Individual', text: 'Individual' },
      { key: 'Partnership', text: 'Partnership' },
      { key: 'Limited Partnership', text: 'Limited Partnership' },
    ],
    // state: [
    //   { key: 'active', text: 'Active' },
    //   { key: 'In Active', text: 'In Active' },
    // ],
  };

  const fetchClientData = async () => {
    try {
      const response = await apiService.get('/Business/get-all-businesses');
      console.log('Formatted Client Data:', response);
      const formatted = response.businesses?.map((b: any) => ({
        id: b.id,
        bId: b.bId,
        type: b.type,
        name: b.name,
        // building: b.address.building,
        // city: b.address.city,
        // state: b.address.state,
        // country: b.address.country,
        // postcode: b.address.postcode,
        // username: b.createdby?.name || 'N/A',
        // email: b.createdby?.email || 'N/A',
        // createdAt: b.createdby.date,
        address: b.address,
        createdBy : b.createdBy
      }));

      setClientData(formatted);
      console.log('Formatted Client Data:', formatted);

    } catch (error) {
      toast.error('Failed to fetch client data');
      console.error('Error fetching client data:', error);
    }
  };

  useEffect(() => {
    fetchClientData();
  }, [refresh]);

  return (
    <Layout>
      <CustomTable
        items={clientData}
        columns={columns}
        pageSize={10}
        filterCriteria={criteria}
        filterValue={valueMap}
        onRowClick={(item) => console.log('Row clicked:', item)}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <AddBusinessPanel />
            <DefaultButton
              text="Refresh"
              styles={{ root: { border: 'none' } }}
              onClick={fetchClientData}
              onRenderIcon={() => <RefreshCcw size={20} />}
            />
          </div>
        }
      />
    </Layout>
  );
};

export default ClientPage;
