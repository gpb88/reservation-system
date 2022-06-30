import React, { Component } from 'react';
import 'styles/timetable.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'styles/timetable.css';
import { useEffect, useState } from 'react';
import { getClasses } from 'API';

const localizer = momentLocalizer(moment);

export default function Timetable() {
    const [classes, setClasses] = useState([]);
    const [user, setUser] = useState('');

    useEffect(() => {
        getClasses()
            .then((response) => {
                let newClasses = [];
                response.forEach((_class) => {
                    let newClass = {};
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
    }, []);

    return (
        <div className='appointment-table'>
            <Calendar
                localizer={localizer}
                events={classes}
                startAccessor='start'
                endAccessor='end'
                style={{ height: 500 }}
            />
        </div>
    );
}
