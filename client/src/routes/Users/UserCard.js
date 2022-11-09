import * as React from 'react';
import {
    TextField,
    Grid,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { getRoles, deleteUser, updateUser } from 'API';
import { useSnackbar } from 'notistack';

export default function UserCard(props) {
    const [username, setUsername] = React.useState(props.selectedUser.username);
    const [role, setRole] = React.useState(props.selectedUser.role);
    const [roles, setRoles] = React.useState(props.roles);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    const handleUpdateUser = () => {
        updateUser(props.selectedUser.id, username, role)
            .then((response) => {
                // ? Check if the user is currenly logged in, if so logout
                if (props.currentUser.id == props.selectedUser.id) {
                    enqueueSnackbar(
                        'Since you updated your user, you have been logged out',
                        {
                            variant: 'warning',
                        }
                    );
                    props.logout();
                } else {
                    enqueueSnackbar('User has been updated!', {
                        variant: 'success',
                    });
                    props.refreshData();
                    props.handleClose();
                }
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    const handleDeleteUser = () => {
        deleteUser(props.selectedUser.id)
            .then((response) => {
                // ? Check if the user is currenly logged in, if so logout
                if (props.currentUser.id == props.selectedUser.id) {
                    enqueueSnackbar(
                        'Since you deleted your user, you have been logged out',
                        {
                            variant: 'warning',
                        }
                    );
                    props.logout();
                } else {
                    enqueueSnackbar('User has been deleted!', {
                        variant: 'success',
                    });
                    props.refreshData();
                    props.handleClose();
                }
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle sx={{ mt: 2, pb: 2 }} align='center' variant='h4'>
                Edit user
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        px: 6,
                        pt: 2,
                    }}
                    spacing={2}
                >
                    <Grid item xs={6}>
                        <Typography variant='h5'>Username:</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            variant='outlined'
                            label='Enter username'
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Role:</Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <FormControl sx={{ width: '100%' }}>
                            <InputLabel>Select role</InputLabel>
                            <Select
                                label='Select role'
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                }}
                            >
                                {roles.map((role) => (
                                    <MenuItem key={role.name} value={role.name}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                }}
            >
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleUpdateUser}
                >
                    Submit
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleDeleteUser}
                    color='error'
                    sx={{
                        '&:hover': {
                            backgroundColor: '#9a0007 !important',
                        },
                    }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
