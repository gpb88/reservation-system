import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { addMachine } from 'API';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function AddMachine(props) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        setName('');
        setDescription('');
    }, [props.open]);

    async function handleAdd() {
        addMachine(name, description).then(() => {
            props.refreshData();
            props.handleClose();
        });
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
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
                            <Typography
                                variant='h4'
                                component='div'
                                align='center'
                            >
                                Add new machine
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                variant='h5'
                                component='div'
                                align='center'
                            >
                                Name
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
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Typography
                                variant='h5'
                                component='div'
                                align='center'
                            >
                                Description
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
                                label='Enter description'
                                multiline
                                rows={5}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value);
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
                                    handleAdd();
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
