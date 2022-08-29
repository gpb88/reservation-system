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
import { getRoles, addUser } from 'API';
import { hashPass } from 'services/password';
import { useSnackbar } from 'notistack';

export default function AddUser(props) {
    const [roles, setRoles] = React.useState([]);
    const [username, setUsername] = React.useState('');
    const [role, setRole] = React.useState('');
    const [password1, setPassword1] = React.useState('');
    const [password2, setPassword2] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        resetVariables();

        getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    const resetVariables = () => {
        setUsername('');
        setRole('');
        setPassword1('');
        setPassword2('');
    };

    async function handleAdd() {
        if (!username || !role || !password1 || !password2)
            enqueueSnackbar('Fill all fields!', {
                variant: 'error',
            });
        else if (password1 != password2)
            enqueueSnackbar('Passwords do not match!', {
                variant: 'error',
            });
        else {
            addUser(username, role, hashPass(password1)).then(() => {
                enqueueSnackbar('User has been added!', {
                    variant: 'success',
                });
                props.refreshData();
                props.handleClose();
            });
        }
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle sx={{ mt: 2, pb: 2 }} align='center' variant='h4'>
                Add new user
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
                            <InputLabel id='select-role-label'>
                                Select role
                            </InputLabel>
                            <Select
                                label='Select role'
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    console.log(e.target.value);
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
                    <Grid item xs={6}>
                        <Typography variant='h5'>Password:</Typography>
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
                            type='password'
                            label='Enter password'
                            value={password1}
                            onChange={(e) => {
                                setPassword1(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Confirm password:</Typography>
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
                            type='password'
                            label='Confirm password'
                            value={password2}
                            onChange={(e) => {
                                setPassword2(e.target.value);
                            }}
                        />
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
                    onClick={() => {
                        handleAdd();
                    }}
                >
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
}
