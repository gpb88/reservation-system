import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { deleteUser } from 'API';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

export default function DeleteUser(props) {
    const handleDelete = async () => {
        await deleteUser(props.user);
        props.refreshUsers();
        props.handleClose();
    };

    return (
        <ThemeProvider theme={darkTheme}>
            <Dialog open={props.open} onClose={props.handleClose}>
                <DialogTitle
                    sx={{ fontSize: 40, textAlign: 'center' }}
                >{`Are you sure you want to delete user ${props.user}?`}</DialogTitle>
                <DialogActions
                    sx={{
                        display: 'grid',
                        justifyContent: 'center',
                        gridTemplate: 'repeat(2, 1fr)',
                        gridAutoFlow: 'column',
                    }}
                >
                    <Button sx={{ fontSize: 30 }} onClick={props.handleClose} autoFocus>
                        No
                    </Button>
                    <Button sx={{ fontSize: 30 }} onClick={handleDelete}>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    );
}
