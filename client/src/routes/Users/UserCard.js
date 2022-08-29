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
    const [roleID, setRoleID] = React.useState(props.selectedUser.role_id);
    const [roles, setRoles] = React.useState(props.roles);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    const handleUpdateUser = () => {
        updateUser(props.selectedUser.user_id, username, roleID)
            .then((response) => {
                // ? Check if the user is currenly logged in, if so logout
                if (props.currentUser.user_id == props.selectedUser.user_id) {
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
        deleteUser(props.selectedUser.user_id)
            .then((response) => {
                // ? Check if the user is currenly logged in, if so logout
                if (props.currentUser.user_id == props.selectedUser.user_id) {
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
                                value={roleID}
                                onChange={(e) => {
                                    setRoleID(e.target.value);
                                }}
                            >
                                {roles.map((role) => (
                                    <MenuItem
                                        key={role.role_id}
                                        value={role.role_id}
                                    >
                                        {role.role}
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
