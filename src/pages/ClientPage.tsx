// src/pages/ClientPage.tsx
import React, { useEffect, useState } from 'react';
import CustomTable from '../components/DataTable';
import Layout from '../components/Layout/Layout';
import { DefaultButton, type IDropdownOption } from '@fluentui/react';
import { Trash2, RefreshCcw, Edit, Download, DownloadCloud } from 'lucide-react';
import AddBusinessPanel from '../components/AddBusinessPanel';
import apiService from '../api/apiService';
import { toast } from 'react-toastify';
import { useRefresh } from '../context/RefreshContext';
import { useNavigate } from 'react-router-dom';
import EditBusinessPanel from '../components/EditBusinessPanel';
import { Dialog, DialogFooter, } from '@fluentui/react';


const ClientPage: React.FC = () => {
  const [clientData, setClientData] = useState<any[]>([]);
  const { refresh } = useRefresh()
  const navigate = useNavigate()
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedToDelete, setSelectedToDelete] = useState<any>(null);


  const handleEdit = (item: any) => {
    setSelectedBusiness(item);
    setIsEditPanelOpen(true);
  };

const downloadCSV = async () => {
  try {
    const res = await apiService.get("Business/download-business-list", {
      responseType: "blob", 
    });

    const blob = new Blob([res.data], { type: "text/csv" });

    const fileName = "businesses.csv";

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);

    toast.success("CSV download started");
  } catch (error) {
    toast.error("Something went wrong!");
    console.error("CSV download error:", error);
  }
};



  const columns = [
    {
      key: 'bid',
      name: 'Client ID',
      fieldName: 'bid',
      minWidth: 100,
      maxWidth: 100,
      onRender: (item: any) => (
        <span style={{
          fontFamily: 'monospace',
          backgroundColor: '#d4f4dd',
          color: '#1b5e20',
          padding: '2px 6px',
          borderRadius: 4,
          display: 'inline-block',
        }}>
          {item.bId}
        </span>
      ),
    },
    {
      key: 'type',
      name: 'Type',
      fieldName: 'type',
      minWidth: 100,
      maxWidth: 150,
      onRender: (item: any) => <span style={{ color: '#555' }}>{item.type}</span>,
    },
    {
      key: 'name',
      name: 'Business Name',
      fieldName: 'name',
      minWidth: 150,
      onRender: (item: any) => (
        <span style={{ color: '#0078d4', cursor: "pointer" }} onClick={() => navigate(`/clients/${item.id}`)}>
          {item.name}
        </span>
      ),
    },
    {
      key: 'building',
      name: 'Building',
      fieldName: 'building',
      minWidth: 150,
      onRender: (item: any) => <span style={{ color: '#444' }}>{item.address.building}</span>,
    },
    {
      key: 'city',
      name: 'City',
      fieldName: 'city',
      minWidth: 100,
      onRender: (item: any) => <span style={{ textTransform: 'capitalize' }}>{item.address.city}</span>,
    },
    {
      key: 'state',
      name: 'State',
      fieldName: 'state',
      minWidth: 100,
      onRender: (item: any) => <span style={{ textTransform: 'capitalize' }}>{item.address.state}</span>,
    },
    {
      key: 'country',
      name: 'Country',
      fieldName: 'country',
      minWidth: 100,
      onRender: (item: any) => <span>{item.address.country}</span>,
    },
    {
      key: 'postcode',
      name: 'Postcode',
      fieldName: 'postcode',
      minWidth: 100,
      onRender: (item: any) => <span style={{ fontVariantNumeric: 'tabular-nums' }}>{item.address.postcode}</span>,
    },
    // {
    //   key: 'username',
    //   name: 'Username',
    //   fieldName: 'username',
    //   minWidth: 150,
    //   onRender: (item: any) => <span style={{ fontWeight: 500 }}>{item.createdBy?.name}</span>,
    // },
    {
      key: 'email',
      name: 'Email',
      fieldName: 'email',
      minWidth: 200,
      onRender: (item: any) => <span style={{ fontStyle: 'italic', color: '#444' }}>{item.createdBy?.email}</span>,
    },
    {
      key: 'createdAt',
      name: 'Created At',
      fieldName: 'createdAt',
      minWidth: 120,
      onRender: (item: any) => (
        <span style={{ color: '#888' }}>
          {new Date(item.createdBy?.date).toLocaleDateString('en-GB')}
        </span>
      ),
    },
    // {
    //   key: 'actions',
    //   name: 'Actions',
    //   fieldName: 'actions',
    //   minWidth: 120,
    //   onRender: (item: any) => (
    //     <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
    //       <Edit size={18} color="#0078d4" style={{ cursor: 'pointer' }} onClick={() => handleEdit(item)} />
    //       <Trash2 size={18} color="#d32f2f" style={{ cursor: 'pointer' }} onClick={() => handleDelete(item)} />
    //     </div>
    //   ),
    // },
  ];


  const criteria: IDropdownOption[] = [
    { key: 'Type', text: 'Business Type' },
    { key: 'IsActive', text: 'State' },
  ];

  const valueMap: Record<string, IDropdownOption[]> = {
    Type: [
      { key: 'Individual', text: 'Individual' },
      { key: 'Partnership', text: 'Partnership' },
      { key: 'Limited Partnership', text: 'Limited Partnership' },
    ],
    IsActive: [
      { key: 'true', text: 'Active' },
      { key: 'false', text: 'In Active' },
    ],
  };

  const [currPage, setCurrPage] = useState(0)
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
        createdBy: b.createdBy
      }));

      setClientData(formatted);
      setCurrPage(response.pagination.currentPage)
      console.log('Formatted Client Data:', formatted);

    } catch (error) {
      toast.error('Failed to fetch client data');
      console.error('Error fetching client data:', error);
    }
  };
  const handleDelete = (item: any) => {
    setSelectedToDelete(item);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log('Deleting:', selectedToDelete);
    setIsDeleteDialogOpen(false);
    setSelectedToDelete(null);
  };

  useEffect(() => {
    fetchClientData();
  }, [refresh]);

  return (
    <Layout>
      {isEditPanelOpen && (
        <EditBusinessPanel
          isOpen={isEditPanelOpen}
          onDismiss={() => setIsEditPanelOpen(false)}
          businessId={selectedBusiness.id}
        />
      )}
      <Dialog
        hidden={!isDeleteDialogOpen}
        onDismiss={() => setIsDeleteDialogOpen(false)}
        dialogContentProps={{
          title: 'Confirm Deletion',
          subText: `Are you sure you want to delete client: "${selectedToDelete?.name}"? This action cannot be undone.`,
        }}
      >
        <DialogFooter>
          <DefaultButton onClick={confirmDelete} text="Confirm" />
          <DefaultButton onClick={() => setIsDeleteDialogOpen(false)} text="Cancel" />
        </DialogFooter>
      </Dialog>
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
              onRenderIcon={() => <RefreshCcw size={17} />}
            />
            <DefaultButton
              onRenderIcon={() => <DownloadCloud size={17} />}
              text="Download CSV"
              styles={{ root: { border: 'none' } }}
              onClick={downloadCSV}
            />
          </div>
        }
      />
    </Layout>
  );
};

export default ClientPage;
