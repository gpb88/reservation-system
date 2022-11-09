import React from 'react';
import 'styles/timetable.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getClasses, getGoogleAuthURL } from 'API';
import { Button, Typography, Box } from '@mui/material';
import EventCard from 'routes/Timetable/EventCard';

const localizer = momentLocalizer(moment);

export default function Timetable(props) {
    const [classes, setClasses] = useState([]);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState('');

    useEffect(() => {
        refreshClasses();
    }, []);

    const refreshClasses = () => {
        getClasses()
            .then((response) => {
                let newClasses = [];
                response.forEach((_class) => {
                    let newClass = {};
                    newClass.ID = _class.id;
                    newClass.userID = _class.user_id;
                    newClass.machineID = _class.machine_id;
                    newClass.title = _class.title;
                    newClass.start = new Date(_class.start_time);
                    newClass.end = new Date(_class.end_time);

                    newClasses.push(newClass);
                });

                setClasses(newClasses);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleSelectEvent = (event) => {
        setEvent(event);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleGoogleAuth = async () => {
        const authURL = await getGoogleAuthURL().then((response) => {
            return response;
        });

        window.location.href = authURL;
    };

    return (
        <div className='appointment-table'>
            {open ? (
                <EventCard
                    open={open}
                    event={event}
                    handleClose={handleClose}
                    refreshClasses={refreshClasses}
                />
            ) : null}
            <Button
                onClick={() => {
                    handleGoogleAuth();
                }}
                sx={{
                    width: '184px',
                    height: '42px',
                    backgroundColor: '#4285f4',
                    borderRadius: '4px',
                    boxShadow: '0 3px 4px 0 rgba(0, 0, 0, .25) !important',
                    display: 'flex',
                    marginBottom: '10px',
                    padding: 0,
                    '&:hover': {
                        boxShadow: '0 0 6px #4285f4',
                        cursor: 'pointer',
                    },
                }}
            >
                <Box
                    sx={{
                        height: '42px',
                        width: '42px',
                        backgroundColor: '#fff',
                        borderRadius: '4px 0 0 4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <img className='google-icon' src='/images/google.png' />
                </Box>
                <Typography
                    sx={{
                        color: '#fff',
                        fontSize: '12px',
                        fontFamily: 'Roboto !important',
                        margin: 0,
                        display: 'flex',
                        alignSelf: 'center',
                    }}
                >
                    Enable google calendar
                </Typography>
            </Button>
            <Calendar
                localizer={localizer}
                culture='en-gb'
                events={classes}
                startAccessor='start'
                endAccessor='end'
                style={{ height: '70vh' }}
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
}
