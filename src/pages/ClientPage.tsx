// src/pages/ClientPage.tsx
import React, { useEffect, useState } from 'react';
import CustomTable from '../components/DataTable';
import Layout from '../components/Layout/Layout';
import { DefaultButton } from '@fluentui/react';
import { Trash2, Edit2, Eye, RefreshCcw } from 'lucide-react';
import AddBusinessPanel from '../components/AddBusinessPanel';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useRefresh } from '../context/RefreshContext';

const columns = [
  {
    key: 'bId',
    name: 'Client ID',
    fieldName: 'bId',
    minWidth: 100,
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
    minWidth: 100,
    isResizable: true,
    onRender: (item: any) => <span style={{ color: '#555' }}>{item.type}</span>,
  },
  {
    key: 'name',
    name: 'Business Name',
    fieldName: 'name',
    minWidth: 200,
    isResizable: true,
    onRender: (item: any) => <span style={{ color: '#0078d4' }}>{item.name}</span>,
  },
  {
    key: 'building',
    name: 'Building',
    fieldName: 'building',
    minWidth: 150,
    isResizable: true,
    onRender: (item: any) => <span style={{ color: '#444' }}>{item.building}</span>,
  },
  {
    key: 'city',
    name: 'City',
    fieldName: 'city',
    minWidth: 100,
    onRender: (item: any) => <span style={{ textTransform: 'capitalize' }}>{item.city}</span>,
  },
  {
    key: 'state',
    name: 'State',
    fieldName: 'state',
    minWidth: 120,
    onRender: (item: any) => <span style={{ textTransform: 'capitalize' }}>{item.state}</span>,
  },
  {
    key: 'country',
    name: 'Country',
    fieldName: 'country',
    minWidth: 120,
    onRender: (item: any) => <span>{item.country}</span>,
  },
  {
    key: 'postcode',
    name: 'Postcode',
    fieldName: 'postcode',
    minWidth: 100,
    onRender: (item: any) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{item.postcode}</span>,
  },
  {
    key: 'username',
    name: 'Username',
    fieldName: 'username',
    minWidth: 150,
    onRender: (item: any) => <span style={{ fontWeight: 500 }}>{item.username}</span>,
  },
  {
    key: 'email',
    name: 'Email',
    fieldName: 'email',
    minWidth: 180,
    isResizable: true,
    onRender: (item: any) => <span style={{ fontStyle: 'italic', color: '#444' }}>{item.email}</span>,
  },
  {
    key: 'createdAt',
    name: 'Created At',
    fieldName: 'createdAt',
    minWidth: 140,
    onRender: (item: any) => (
      <span style={{ color: '#888' }}>
        {new Date(item.createdAt).toLocaleDateString('en-GB')}
      </span>
    ),
  },
];

const ClientPage: React.FC = () => {
  const [clientData, setClientData] = useState<any[]>([]);
  const { refresh } = useRefresh()


  const fetchClientData = async () => {
    try {
      const response = await apiService.get('/Business/get-all-businesses');
      console.log('Formatted Client Data:', response);
      const formatted = response.businesses?.map((b: any) => ({
        id: b.id,
        bId: b.bId,
        type: b.type,
        name: b.name,
        building: b.building,
        city: b.city,
        state: b.state,
        country: b.country,
        postcode: b.postcode,
        username: b.userDetails?.username || 'N/A',
        email: b.userDetails?.email || 'N/A',
        createdAt: b.createdAt,
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
