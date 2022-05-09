import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import WeekCalendar from 'react-week-calendar';
import 'react-week-calendar/dist/style.css';
import { useEffect, useState } from 'react';
import { getMachines, getPermissions, getUsers, updatePermissions } from 'API';
import React from 'react';
import moment from 'moment';

export default class PermissionPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lastUid: 1,
            selectedIntervals: [],
        };
    }

    handleEventRemove = (event) => {
        const { selectedIntervals } = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals.splice(index, 1);
            this.setState({ selectedIntervals });
        }
    };

    handleEventUpdate = (event) => {
        const { selectedIntervals } = this.state;
        const index = selectedIntervals.findIndex((interval) => interval.uid === event.uid);
        if (index > -1) {
            selectedIntervals[index] = event;
            this.setState({ selectedIntervals });
        }
    };

    handleSelect = (newIntervals) => {
        const { lastUid, selectedIntervals } = this.state;
        const intervals = newIntervals.map((interval, index) => {
            return {
                ...interval,
                uid: lastUid + index,
            };
        });

        this.setState({
            selectedIntervals: selectedIntervals.concat(intervals),
            lastUid: lastUid + newIntervals.length,
        });
    };

    render() {
        return (
            <div id='timetable'>
                <WeekCalendar
					startTime = {moment({h: 7, m: 0})}
					endTime = {moment({h: 22, m: 0})}
                    scaleUnit={60}
                    scaleHeaderTitle='Time'
                    cellHeight={50}
					numberOfDays={5}
                    selectedIntervals={this.state.selectedIntervals}
                    onIntervalSelect={this.handleSelect}
                    onIntervalUpdate={this.handleEventUpdate} 	
                    onIntervalRemove={this.handleEventRemove}
                ></WeekCalendar>
            </div>
        );
    }
}
