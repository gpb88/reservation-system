import React from 'react';
import 'styles/timetable.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getClasses, sendGoogleAuthCode, getGoogleAuthURL } from 'API';
import { Button, Typography, Box } from '@mui/material';
import EventCard from 'routes/Timetable/EventCard';

const localizer = momentLocalizer(moment);

export default function Timetable() {
    const [classes, setClasses] = useState([]);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = useState('');

    useEffect(() => {
        handleRedirect();

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

    const handleRedirect = async () => {
        const url = window.location.href;
        if (url.includes('code')) {
            const accessCode = new URL(url).searchParams.get('code');

            window.history.pushState({}, document.title, '/home');

            await sendGoogleAuthCode(accessCode).then(() => {});
        }
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
                class='google-btn'
                onClick={() => {
                    handleGoogleAuth();
                }}
            >
                <Box class='google-icon-wrapper'>
                    <img
                        class='google-icon'
                        src='https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg'
                    />
                </Box>
                <Typography class='btn-text'>Enable google calendar</Typography>
            </Button>
            <Calendar
                localizer={localizer}
                culture='en-gb'
                events={classes}
                startAccessor='start'
                endAccessor='end'
                style={{ height: '80vh' }}
                onSelectEvent={handleSelectEvent}
            />
        </div>
    );
}
