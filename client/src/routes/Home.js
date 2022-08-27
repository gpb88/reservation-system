import * as React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import Users from 'routes/Users/Users';
import Timetable from 'routes/Timetable/Timetable';
import AddClass from 'routes/AddClass/AddClass';
import Machines from 'routes/Machines/Machines';
import Permissions from 'routes/Permissions/Permissions';
import { useNavigate } from 'react-router-dom';
import { clearStorage, getToken } from 'services/token';
import { getUserByName } from 'API';
import { BiLogOut } from 'react-icons/bi';

export default function Home() {
    let [pages, setPages] = React.useState([]);
    let [user, setUser] = React.useState('');

    let [pageComponent, setPageComponent] = React.useState(<Timetable />);

    let navigate = useNavigate();

    React.useEffect(async () => {
        let token = getToken();
        if (token) {
            let username = getUsername();
            let user = await getUserByName(username);
            setUser(user);

            user.role == 'admin'
                ? setPages([
                      'Timetable',
                      'Add class',
                      'Users',
                      'Machines',
                      'Permissions',
                  ])
                : setPages(['Timetable', 'Add class']);
        } else logout();
    }, []);

    const getUsername = () => {
        let username = localStorage.getItem('user');
        if (username == null) username = sessionStorage.getItem('user');

        return username;
    };

    const logout = () => {
        clearStorage();
        navigate('/');
    };

    const switchPage = (page) => {
        switch (page) {
            case 'Users':
                setPageComponent(<Users user={user} logout={logout} />);
                break;
            case 'Permissions':
                setPageComponent(<Permissions />);
                break;
            case 'Timetable':
                setPageComponent(<Timetable />);
                break;
            case 'Add class':
                setPageComponent(<AddClass user={user} />);
                break;
            case 'Machines':
                setPageComponent(<Machines />);
                break;
            default:
                setPageComponent(<Timetable />);
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
                                width='64'
                                src='/images/logo_agh.png'
                                alt='logo'
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
                        <Button
                            onClick={() => logout()}
                            sx={{
                                color: 'white',
                                display: 'flex',
                                textTransform: 'none',
                                backgroundColor: '#fff',
                                color: '#000',
                                '&:hover': {
                                    backgroundColor: '#fff',
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            <BiLogOut size='1.2em' />
                            <Typography
                                sx={{
                                    pl: 1,
                                }}
                            >
                                Log out
                            </Typography>
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>
            {pageComponent}
        </Container>
    );
}
