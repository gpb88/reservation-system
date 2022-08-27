import * as React from 'react';
import { Typography, Button, Container } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getMachines } from 'API';
import { FaPlus } from 'react-icons/fa';
import AddMachine from 'routes/Machines/AddMachine';
import MachineCard from 'routes/Machines/MachineCard';

const columns = [
    { field: 'machine_name', headerName: 'Name', flex: 1, minWidth: 150 },
    { field: 'description', headerName: 'Description', flex: 1, minWidth: 150 },
];

export default function Machines() {
    const [machines, setMachines] = React.useState([]);
    const [showAddMachineWindow, setShowAddMachineWindow] =
        React.useState(false);
    const [showMachineWindow, setShowMachineWindow] = React.useState(false);
    const [selectedMachine, setSelectedMachine] = React.useState('');

    React.useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        getMachines().then((response) => {
            setMachines(response);
        });
    };

    const handleRowClick = (machine) => {
        setSelectedMachine(machine);
        setShowMachineWindow(true);
    };

    return (
        <Container
            id='machine-page'
            maxWidth='sm'
            disableGutters={true}
            sx={{ display: 'grid', justifyItems: 'center' }}
        >
            <Typography variant='h4' component='h1' sx={{ mt: 6, mb: 4 }}>
                Machines
            </Typography>
            <Button
                variant='contained'
                sx={{ justifySelf: 'right', mb: 2 }}
                onClick={() => {
                    setShowAddMachineWindow(true);
                }}
            >
                <FaPlus size='2em' />
            </Button>
            <DataGrid
                getRowId={(row) => row.machine_id}
                rows={machines}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                sx={{
                    fontSize: '1.5em',
                    width: '100%',
                    userSelect: 'none !important',
                    padding: 'none !important',
                }}
                autoHeight={true}
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                onRowClick={(data) => {
                    handleRowClick(data.row);
                }}
            />

            {showAddMachineWindow ? (
                <AddMachine
                    open={showAddMachineWindow}
                    handleClose={() => {
                        setShowAddMachineWindow(false);
                    }}
                    refreshData={refreshData}
                />
            ) : null}
            {showMachineWindow ? (
                <MachineCard
                    open={showMachineWindow}
                    handleClose={() => {
                        setShowMachineWindow(false);
                    }}
                    refreshData={refreshData}
                    machine={selectedMachine}
                />
            ) : null}
        </Container>
    );
}
