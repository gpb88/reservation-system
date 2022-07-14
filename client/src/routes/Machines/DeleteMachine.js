import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deleteMachine } from 'API';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function DeleteMachine(props) {
    const handleDelete = async () => {
        await deleteMachine(props.deleteTarget);
        props.refreshData();
        props.handleClose();
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle sx={{ fontSize: 40, textAlign: 'center' }}>
                    <p>
                        Delete{' '}
                        <span style={{ fontWeight: 'bold' }}>
                            {props.deleteTarget}
                        </span>
                        ?
                    </p>
                </DialogTitle>
                <DialogActions
                    sx={{
                        display: 'grid',
                        justifyContent: 'center',
                        gridTemplate: 'repeat(2, 1fr)',
                        gridAutoFlow: 'column',
                    }}
                >
                    <Button sx={{ fontSize: 30 }} onClick={handleDelete}>
                        Yes
                    </Button>
                    <Button
                        sx={{ fontSize: 30 }}
                        onClick={props.handleClose}
                        autoFocus
                    >
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
