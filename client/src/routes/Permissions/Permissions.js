import * as React from 'react';
import {
    Typography,
    Button,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    Checkbox,
    FormControl,
    Container,
} from '@mui/material';
import { FaSave } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { getMachines, getPermissions, getUsers, setPermissions } from 'API';

export default function PermissionPage() {
    const [machines, setMachines] = React.useState([]);
    const [users, setUsers] = React.useState([]);
    const [userID, setUserID] = React.useState('');

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getMachines()
            .then((response) => {
                resetPermissions(response);
                setMachines(response);
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });

        getUsers()
            .then((response) => {
                setUsers(response);
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });
    }, []);

    const resetPermissions = (arr = machines) => {
        arr.forEach((machine) => {
            machine.hasPermission = false;
        });
    };

    const handleUserChange = (event) => {
        setUserID(event.target.value);

        getPermissions(event.target.value)
            .then((permitedMachines) => {
                updatePermissions(permitedMachines);
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    const updatePermissions = (permitedMachines) => {
        let newMachines = machines;
        resetPermissions();

        newMachines.forEach((machine) => {
            permitedMachines.forEach((permitedMachine) => {
                if (machine.id === permitedMachine.id)
                    machine.hasPermission = true;
            });
        });
        setMachines([...newMachines]);
    };

    const updatePermission = (machineToUpdate, permission) => {
        let newMachines = machines;
        let targetMachine = newMachines.find(
            (machine) => machine.id === machineToUpdate.id
        );

        targetMachine.hasPermission = permission;
        setMachines([...newMachines]);
    };

    const handlePermissionChange = (e, machineToUpdate) => {
        const permission = e.target.checked;
        updatePermission(machineToUpdate, permission);
    };

    const handlePermissionSave = () => {
        setPermissions(userID, machines)
            .then(() => {
                enqueueSnackbar('Permissions have been updated!', {
                    variant: 'success',
                });
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    return (
        <Container
            id='permissions-page'
            maxWidth='sm'
            disableGutters
            sx={{ display: 'grid', justifyItems: 'center' }}
        >
            <Typography variant='h4' component='h1' sx={{ mt: 6, mb: 4 }}>
                Permissions
            </Typography>
            <Container
                sx={{
                    display: 'flex',

                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                <FormControl sx={{ width: '50%' }}>
                    <InputLabel id='select-user-label'>Select user</InputLabel>
                    <Select
                        labelId='select-user-label'
                        label='Select user'
                        onChange={handleUserChange}
                        value={userID}
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.id}>
                                {user.username}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button
                    variant='contained'
                    sx={{
                        position: 'absolute !important',
                        right: '0',
                    }}
                    onClick={handlePermissionSave}
                >
                    <FaSave size='2em' />
                </Button>
            </Container>
            <Container disableGutters sx={{ mx: 6, mt: 6 }}>
                <Grid container rowSpacing={2} direction='column'>
                    {userID
                        ? machines.map((machine) => (
                              <Grid
                                  key={machine.id}
                                  container
                                  sx={{
                                      p: 2,
                                      borderBottom: '1px solid #c4c4c4',
                                      width: '100%',
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
                                          variant='h5'
                                          sx={{
                                              width: '100%',
                                          }}
                                          align='center'
                                      >
                                          {machine.name}
                                      </Typography>
                                  </Grid>
                                  <Grid
                                      item
                                      xs={6}
                                      sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          transform: 'scale(1.5)',
                                          justifyContent: 'center',
                                      }}
                                  >
                                      <Checkbox
                                          checked={machine.hasPermission}
                                          onChange={(e) =>
                                              handlePermissionChange(e, machine)
                                          }
                                      />
                                  </Grid>
                              </Grid>
                          ))
                        : null}
                </Grid>
            </Container>
        </Container>
    );
}
