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
import { addMachine } from 'API';
import { useSnackbar } from 'notistack';

export default function AddMachine(props) {
    const [name, setName] = React.useState([]);
    const [description, setDescription] = React.useState('');
    const [location, setLocation] = React.useState('');

    const { enqueueSnackbar} = useSnackbar();

    React.useEffect(() => {
        resetVariables();
    }, []);

    const resetVariables = () => {
        setName('');
        setDescription('');
        setLocation('');
    };

    async function handleAdd() {
        if (!name)
            enqueueSnackbar('Fill name field!', {
                variant: 'error',
            });
        else {
            addMachine(name, description, location).then(() => {
                enqueueSnackbar('Machine has been added!', {
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
                Add new machine
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
														inputProps={{ spellCheck: 'false' }}
                        />
                    </Grid>
										<Grid item xs={6}>
                        <Typography variant='h5'>Location:</Typography>
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
                            label='Enter location'
                            value={location}
                            onChange={(e) => {
                                setLocation(e.target.value);
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
