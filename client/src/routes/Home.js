import * as React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Button,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    Divider,
    Box,
} from '@mui/material';
import { Settings, Logout } from '@mui/icons-material';
import Users from 'routes/Users/Users';
import Timetable from 'routes/Timetable/Timetable';
import AddEvent from 'routes/AddEvent/AddEvent';
import Machines from 'routes/Machines/Machines';
import Permissions from 'routes/Permissions/Permissions';
import MyAccount from 'routes/MyAccount/MyAccount';
import UserSettings from 'routes/UserSettings/UserSettings';
import { useNavigate } from 'react-router-dom';
import { clearStorage, checkToken, getUserID } from 'services/token';
import { useSnackbar } from 'notistack';
import { getUserByID, sendGoogleAuthCode } from 'API';

export default function Home(props) {
    const [user, setUser] = React.useState('');
    const [pages, setPages] = React.useState([]);
    const [pageComponent, setPageComponent] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const isMenuOpen = Boolean(anchorEl);

    const checkInterval = 60;
    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const logout = () => {
        clearStorage();
        navigate('/');
    };

    React.useEffect(async () => {
        const logOut = await checkToken(props.rememberMe);
        if (logOut) logout();

        const checkTokenInterval = setInterval(async () => {
            const logOut = await checkToken(props.rememberMe);

            if (logOut) {
                clearInterval(checkTokenInterval);
                logout();
            }
        }, checkInterval * 1000);
    }, []);

    React.useEffect(async () => {
        const userID = getUserID();

        getUserByID(userID)
            .then((response) => {
                setUser(response);

                response.role == 'admin'
                    ? setPages([
                          'Timetable',
                          'Add event',
                          'Users',
                          'Machines',
                          'Permissions',
                      ])
                    : setPages(['Timetable', 'Add event']);

                setPageComponent(<Timetable userID={response.id} />);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    React.useEffect(async () => {
        handleRedirect();
    }, []);

    const handleRedirect = async () => {
        const url = window.location.href;
        if (url.includes('code')) {
            const accessCode = new URL(url).searchParams.get('code');

            window.history.pushState({}, document.title, '/home');

            await sendGoogleAuthCode(accessCode).then(() => {});
        }
    };

    const switchPage = (page) => {
        console.log(user);
        switch (page) {
            case 'Users':
                setPageComponent(<Users user={user} logout={logout} />);
                break;
            case 'Permissions':
                setPageComponent(<Permissions />);
                break;
            case 'Timetable':
                setPageComponent(<Timetable userID={user.id} />);
                break;
            case 'Add event':
                setPageComponent(<AddEvent user={user} />);
                break;
            case 'Machines':
                setPageComponent(<Machines />);
                break;
            case 'My Account':
                setPageComponent(<MyAccount user={user} />);
                break;
            case 'User Settings':
                setPageComponent(<UserSettings user={user} />);
                break;
            default:
                setPageComponent(<Timetable userID={user.id} />);
                break;
        }
    };

    return (
        <Container
            className='home'
            maxWidth={false}
            sx={{ padding: '0 !important' }}
        >
            <AppBar position='static'>
                <Container maxWidth='xl'>
                    <Toolbar disableGutters variant='dense'>
                        <Typography
                            variant='h5'
                            noWrap
                            component='div'
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                            }}
                        >
                            <img
                                className='logo'
                                width='64'
                                src='/images/logo_agh.png'
                                alt='logo'
                                onClick={() => {
                                    switchPage('Timetable');
                                }}
                            />
                        </Typography>
                        <Container
                            sx={{
                                ml: 4,
                            }}
                        >
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => switchPage(page)}
                                    sx={{
                                        color: 'white',
                                        textTransform: 'none !important',
                                        fontSize: '1.2em',
                                        ml: 2,
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Container>
                        <Box
                            onClick={(event) => {
                                anchorEl === null
                                    ? setAnchorEl(event.currentTarget)
                                    : setAnchorEl(null);
                            }}
                            sx={{
                                '&:hover': {
                                    cursor: 'pointer',
                                },
                            }}
                        >
                            <Avatar
                                sx={{
                                    '&:hover': {
                                        boxShadow:
                                            'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                    },
                                }}
                            />
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            open={isMenuOpen}
                            onClose={() => {
                                setAnchorEl(null);
                            }}
                            PaperProps={{
                                elevation: 0,
                                sx: {
                                    overflow: 'visible',
                                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                    mt: 1.5,
                                    '& .MuiAvatar-root': {
                                        width: 32,
                                        height: 32,
                                        ml: -0.5,
                                        mr: 1,
                                    },
                                    // ? Arrow pointing upwards
                                    '&:before': {
                                        content: '""',
                                        display: 'block',
                                        position: 'absolute',
                                        top: 0,
                                        right: 14,
                                        width: 10,
                                        height: 10,
                                        bgcolor: 'background.paper',
                                        transform:
                                            'translateY(-50%) rotate(45deg)',
                                        zIndex: 0,
                                    },
                                },
                            }}
                            transformOrigin={{
                                horizontal: 'right',
                                vertical: 'top',
                            }}
                            anchorOrigin={{
                                horizontal: 'right',
                                vertical: 'bottom',
                            }}
                            disableAutoFocusItem
                        >
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    switchPage('My Account');
                                }}
                            >
                                <Avatar /> My account
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    switchPage('User Settings');
                                }}
                            >
                                <ListItemIcon>
                                    <Settings fontSize='small' />
                                </ListItemIcon>
                                Settings
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    logout();
                                }}
                            >
                                <ListItemIcon>
                                    <Logout fontSize='small' />
                                </ListItemIcon>
                                Logout
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>
            {pageComponent}
        </Container>
    );
}
