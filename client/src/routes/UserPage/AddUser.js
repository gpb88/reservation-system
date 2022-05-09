import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { getRoles, addUser } from 'API';
import { hashPass } from 'services/password';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function AddUser(props) {
    const [roles, setRoles] = useState([]);
    const [username, setUsername] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');

    useEffect(() => {
        getRoles().then((response) => {
            console.log(response);
            setRoles(response);
        });
    }, []);

    async function handleAddUser() {
        if (!username || !role || !password || !passwordConf) console.log('Set all boxes');
        else if (password != passwordConf) console.log('Passwords dont match');
        else {
            const passHash = await hashPass(password);
            console.log(passHash);
            addUser(username, role, passHash).then(() => {
                props.refreshUsers();
                props.handleClose();
            });
        }
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={props.open}
                onClick={props.handleClose}
            >
                <Paper
                    elevation={12}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    sx={{ width: '30%', padding: '20px 0' }}
                >
                    <Grid
                        container
                        sx={{
                            display: 'flex',
                            justifyItems: 'center',
                            alignItems: 'center',
                            p: 2,
                        }}
                        spacing={2}
                    >
                        <Grid item xs={12} sx={{ pb: 2 }}>
                            <Typography variant='h4' component='div' align='center'>
                                Add new user
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h5' component='div' align='center'>
                                Username
                            </Typography>
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
                            <Typography variant='h5' component='div' align='center'>
                                Role
                            </Typography>
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
                            <FormControl sx={{ width: '60%' }}>
                                <InputLabel id='select-role-label'>Select role</InputLabel>
                                <Select
                                    labelId='select-role-label'
                                    label='Select role'
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                    }}
                                >
                                    {roles.map((role) => (
                                        <MenuItem key={role.role_id} value={role.role_id}>
                                            {role.role}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h5' component='div' align='center'>
                                Password
                            </Typography>
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
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h5' component='div' align='center'>
                                Verify password
                            </Typography>
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
                                onChange={(e) => {
                                    setPasswordConf(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid
                            item
                            xs={12}
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                mt: 4,
                            }}
                        >
                            <Button
                                variant='contained'
                                size='large'
                                onClick={() => {
                                    handleAddUser();
                                }}
                            >
                                Add user
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Backdrop>
        </ThemeProvider>
    );
}
