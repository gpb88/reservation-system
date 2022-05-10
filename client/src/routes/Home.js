import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import UserPage from 'routes/UserPage/UserPage';
import Timetable from 'routes/Timetable/Timetable';
import PermissionPage from 'routes/PermissionPage/PermissionPage';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { deleteToken } from 'services/handleLogin';

export default function Home() {
    let navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const { state } = useLocation();
    const defaultPage =
        state.userRole == 'admin' ? <UserPage /> : <Timetable />;
    let [pageComponent, setPageComponent] = React.useState(defaultPage);
    const pages =
        state.userRole == 'admin' ? ['Users', 'Permissions'] : ['Timetable'];

    useEffect(() => {
        console.log(state);
    }, []);

    const logout = () => {
        deleteToken();
        navigate('/');
    };

    const switchPage = (page) => {
        switch (page) {
            case 'Users':
                setPageComponent(<UserPage />);
                break;
            case 'Permissions':
                setPageComponent(<PermissionPage />);
                break;
            case 'Timetable':
                setPageComponent(<Timetable />);
                break;
            default:
                const defaultPage =
                    state.userRole == 'admin' ? <UserPage /> : <Timetable />;
                setPageComponent(defaultPage);
                break;
        }
    };

    return (
        <div id='home'>
            <AppBar position='static'>
                <Container maxWidth='xl'>
                    <Toolbar disableGutters>
                        <Typography
                            variant='h5'
                            noWrap
                            component='div'
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            LOGO
                        </Typography>
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: { xs: 'none', md: 'flex' },
                            }}
                        >
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => switchPage(page)}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>
                        <Button
                            onClick={() => logout()}
                            sx={{
                                my: 2,
                                color: 'white',
                                display: 'block',
                            }}
                        >
                            LOGOUT
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
            {pageComponent}
        </div>
    );
}
