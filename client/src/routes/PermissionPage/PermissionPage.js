import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import { useEffect, useState } from 'react';
import { getMachines, getPermissions, getUsers, updatePermissions } from 'API';

export default function PermissionPage() {
    const [machines, setMachines] = useState([]);
    const [users, setUsers] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        getMachines()
            .then((response) => {
                response.forEach((machine) => {
                    machine.hasPermission = false;
                });
                setMachines(response);
            })
            .catch((err) => {
                console.error(err);
            });

        getUsers()
            .then((response) => {
                console.log(response);
                setUsers(response);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const handleUserChange = (event) => {
        let _user = event.target.value;
        setUser(_user);

        getPermissions(_user)
            .then((permitedMachines) => {
                console.log(permitedMachines);

                // ? Update permissions on machines
                let updatedMachines = machines;
                updatedMachines.forEach((machine) => {
                    machine.hasPermission = false;
                    permitedMachines.forEach((permitedMachine) => {
                        if (machine.machine_id === permitedMachine.machine_id)
                            machine.hasPermission = true;
                    });
                });
                console.log(updatedMachines);
                setMachines([...updatedMachines]);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handlePermissionChange = (e, targetMachine) => {
        const desiredState = e.target.checked;

        // ? Update permission
        let updatedMachines = machines;
        updatedMachines.forEach((machine) => {
            if (machine.machine_id === targetMachine.machine_id) {
                machine.hasPermission = desiredState;
                console.log(desiredState);
            }
        });
        console.log(updatedMachines);
        setMachines([...updatedMachines]);
    };

    const handlePermissionSave = () => {
        updatePermissions(user, machines);
    };

    return (
        <div id='user-page'>
            <Typography variant='h4' component='h1' sx={{ m: 6 }}>
                Permission table
            </Typography>
            <Grid container sx={{ width: '30%', ml: 6, mb: 6 }}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id='select-user-label'>
                            Select user
                        </InputLabel>
                        <Select
                            labelId='select-user-label'
                            label='Select user'
                            onChange={handleUserChange}
                            value={user}
                            sx={{ width: '80%' }}
                        >
                            {users.map((u) => (
                                <MenuItem key={u.user_id} value={u.user_id}>
                                    {u.username}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant='contained'
                        sx={{ fontSize: '1.3rem' }}
                        onClick={handlePermissionSave}
                    >
                        Save settings
                    </Button>
                </Grid>
            </Grid>
            <div style={{ width: '70%' }}>
                <Box sx={{ mx: 6 }}>
                    <Grid container rowSpacing={2} direction='column'>
                        <Grid
                            container
                            sx={{
                                pb: 3,
                                borderBottom: '1px solid rgba(0, 0, 0, 0.27)',
                            }}
                        >
                            <Grid
                                item
                                xs={6}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <Typography
                                    variant='h4'
                                    sx={{ width: '100%' }}
                                    align='center'
                                >
                                    Machine
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography
                                    variant='h4'
                                    sx={{ width: '100%' }}
                                    align='center'
                                >
                                    Permission
                                </Typography>
                            </Grid>
                        </Grid>
                        {user
                            ? machines.map((machine) => (
                                  <Grid
                                      key={machine.machine_id}
                                      container
                                      sx={{
                                          p: 2,
                                          borderBottom:
                                              '1px solid rgba(0, 0, 0, 0.27)',
                                      }}
                                  >
                                      <Grid
                                          item
                                          xs={6}
                                          sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyItems: 'center',
                                          }}
                                      >
                                          <Typography
                                              variant='h6'
                                              sx={{
                                                  width: '100%',
                                              }}
                                              align='center'
                                          >
                                              {machine.machine_name}
                                          </Typography>
                                      </Grid>
                                      <Grid
                                          item
                                          xs={6}
                                          sx={{
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                          }}
                                      >
                                          <Checkbox
                                              checked={machine.hasPermission}
                                              onChange={(e) =>
                                                  handlePermissionChange(
                                                      e,
                                                      machine
                                                  )
                                              }
                                          />
                                      </Grid>
                                  </Grid>
                              ))
                            : null}
                    </Grid>
                </Box>
            </div>
        </div>
    );
}
