import * as React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getUsers, getRoles } from 'API';
import { FaPlus } from 'react-icons/fa';
import 'styles/datagrid.css';
import AddUser from 'routes/Users/AddUser';
import UserCard from 'routes/Users/UserCard';

const columns = [
    { field: 'username', headerName: 'Username', flex: 1, minWidth: 150 },
    { field: 'role', headerName: 'Role', flex: 1, minWidth: 150 },
];

export default function UserPage(props) {
    const [users, setUsers] = React.useState([]);
    const [showUserWindow, setShowUserWindow] = React.useState(false);
    const [showUserAddWindow, setShowUserAddWindow] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState('');
    const [roles, setRoles] = React.useState([]);

    React.useEffect(() => {
        refreshData();
    }, []);

    const refreshData = () => {
        getUsers().then((response) => {
            setUsers(response);
        });
    };

    const handleRowClick = (user) => {
        console.log(user);
        getRoles()
            .then((response) => {
                setRoles(response);

                // ? Remove reference to original row object
                let userCopy = { ...user };
                setSelectedUser(userCopy);
                setShowUserWindow(true);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <Container
            id='user-page'
            maxWidth='sm'
            disableGutters
            sx={{ display: 'grid', justifyItems: 'center' }}
        >
            <Typography variant='h4' component='h1' sx={{ mt: 6, mb: 4 }}>
                Users
            </Typography>
            <Button
                variant='contained'
                sx={{ justifySelf: 'right', mb: 2 }}
                onClick={() => {
                    setShowUserAddWindow(true);
                }}
            >
                <FaPlus size='2em' />
            </Button>
            <DataGrid
                getRowId={(row) => row.user_id}
                rows={users}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                sx={{
                    fontSize: '1.5em',
                    width: '100%',
                    userSelect: 'none !important',
                    padding: 'none !important',
                }}
                autoHeight
                disableSelectionOnClick
                disableColumnFilter
                disableColumnMenu
                disableColumnSelector
                disableDensitySelector
                onRowClick={(data) => {
                    handleRowClick(data.row);
                }}
            />
            {showUserAddWindow ? (
                <AddUser
                    open={showUserAddWindow}
                    handleClose={() => {
                        setShowUserAddWindow(false);
                    }}
                    refreshData={refreshData}
                />
            ) : null}
            {showUserWindow ? (
                <UserCard
                    open={showUserWindow}
                    handleClose={() => {
                        setShowUserWindow(false);
                    }}
                    refreshData={refreshData}
                    selectedUser={selectedUser}
                    roles={roles}
                    logout={props.logout}
                    currentUser={props.user}
                />
            ) : null}
        </Container>
    );
}
