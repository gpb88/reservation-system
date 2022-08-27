import * as React from 'react';
import {
    TextField,
    Grid,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { deleteMachine, updateMachine } from 'API';
import { useSnackbar } from 'notistack';

export default function MachineCard(props) {
    const [name, setName] = React.useState(props.machine.machine_name);
    const [description, setDescription] = React.useState(
        props.machine.description
    );

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleUpdateMachine = () => {
        updateMachine(props.machine.machine_id, name, description)
            .then((response) => {
                enqueueSnackbar('Machine has been updated!', {
                    variant: 'success',
                });
                props.refreshData();
                props.handleClose();
            })
            .catch((err) => {
                enqueueSnackbar('Error occurred!', {
                    variant: 'error',
                });
                console.error(err);
            });
    };

    const handleDeleteMachine = () => {
        deleteMachine(props.machine.machine_id)
            .then((response) => {
                enqueueSnackbar('Machine has been deleted!', {
                    variant: 'success',
                });
                props.refreshData();
                props.handleClose();
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
                Edit machine
            </DialogTitle>
            <DialogContent>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        pl: 6,
                        pr: 6,
                        pt: 2,
                    }}
                    spacing={2}
                >
                    <Grid item xs={6}>
                        <Typography variant='h5'>Name:</Typography>
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
                            label='Enter name'
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant='h5'>Description:</Typography>
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
                            label='Enter description'
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                            }}
                            multiline
                            rows={6}
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
                    onClick={handleUpdateMachine}
                >
                    Submit
                </Button>
                <Button
                    variant='contained'
                    size='large'
                    onClick={handleDeleteMachine}
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
