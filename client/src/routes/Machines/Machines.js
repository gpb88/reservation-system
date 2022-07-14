import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { getMachines } from 'API';
import AddMachine from './AddMachine';
import DeleteMachine from './DeleteMachine';

const columns = [
    { field: 'machine_name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 150 },
];

export default function Machines() {
    const [machines, setMachines] = useState([]);
    const [isAddWindowOpen, setIsAddWindowOpen] = useState(false);
    const [isDeletePromptOpen, setIsDeletePromptOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState('');

    const handleAddWindow = () => {
        setIsAddWindowOpen(!isAddWindowOpen);
    };

    const handleDeletePrompt = () => {
        setIsDeletePromptOpen(!isDeletePromptOpen);
    };

    const refreshData = () => {
        getMachines().then((response) => {
            console.log(response);
            setMachines(response);
        });
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <div id='user-page'>
            <Typography variant='h4' component='h1' sx={{ m: 6 }}>
                Machine management
            </Typography>
            <Button
                variant='contained'
                sx={{ ml: 6, mb: 6, fontSize: '1.3rem' }}
                onClick={handleAddWindow}
            >
                Add new machine
            </Button>
            <div style={{ width: '60%' }}>
                <DataGrid
                    getRowId={(row) => row.machine_id}
                    rows={machines}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    sx={{
                        fontSize: '1.5rem',
                        ml: 6,
                        width: '100%',
                        userSelect: 'none !important',
                    }}
                    autoHeight={true}
                    disableSelectionOnClick
                    disableColumnFilter
                    disableColumnMenu
                    disableColumnSelector
                    disableDensitySelector
                    onRowDoubleClick={(data) => {
                        setDeleteTarget(data.row.machine_name);
                        handleDeletePrompt();
                    }}
                />
            </div>
            <AddMachine
                open={isAddWindowOpen}
                handleClose={handleAddWindow}
                refreshData={refreshData}
            />
            <DeleteMachine
                open={isDeletePromptOpen}
                handleClose={handleDeletePrompt}
                deleteTarget={deleteTarget}
                refreshData={refreshData}
            />
        </div>
    );
}
