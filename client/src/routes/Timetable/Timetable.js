import React, { Component } from 'react';
import 'styles/timetable.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'styles/timetable.css';
import { useEffect, useState } from 'react';
import { getClasses } from 'API';
import EventCard from 'routes/Timetable/EventCard';

const localizer = momentLocalizer(moment);

export default function Timetable() {
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
                    newClass.ID = _class.class_id;
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
        console.log(event);
        setEvent(event);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
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
