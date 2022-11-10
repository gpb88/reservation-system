import React from 'react';
import 'styles/timetable.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getEvents, getGoogleAuthURL } from 'API';
import { Button, Typography, Box } from '@mui/material';
import EventCard from 'routes/Timetable/EventCard';

const localizer = momentLocalizer(moment);

export default function Timetable(props) {
    const [events, setEvents] = useState([]);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState('');

    useEffect(() => {
        refreshEvents();
    }, []);

    const refreshEvents = () => {
        getEvents()
            .then((response) => {
                let newEvents = [];
                response.forEach((event) => {
                    let newEvent = {};
                    newEvent.ID = event.id;
                    newEvent.userID = event.user_id;
                    newEvent.machineID = event.machine_id;
                    newEvent.title = event.title;
                    newEvent.start = new Date(event.start_time);
                    newEvent.end = new Date(event.end_time);

                    newEvents.push(newEvent);
                });

                setEvents(newEvents);
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
                    refreshEvents={refreshEvents}
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
                events={events}
                startAccessor='start'
                endAccessor='end'
                style={{ height: '70vh' }}
                onSelectEvent={handleSelectEvent}
                eventPropGetter={(event) => {
                    return {
                        style: {
                            backgroundColor:
                                event.userID == props.userID
                                    ? '#' + event.hexColor
                                    : '#9E9E9E',
                        },
                    };
                }}
            />
        </div>
    );
}
