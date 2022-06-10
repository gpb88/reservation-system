import React, { Component } from 'react';
import { AppointmentPicker } from 'react-appointment-picker';
import 'styles/timetable.css';

class Timetable extends Component {
    state = {
        loading: false,
    };

    addAppointmentCallback = (appointment) => {
        let { day, number, time, id } = appointment.addedAppointment;
        let addCb = appointment.addCb;

        this.setState(
            {
                loading: true,
            },
            async () => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                console.log(
                    `Added appointment ${number}, day ${day}, time ${time}, id ${id}`
                );
                addCb(day, number, time, id);
                this.setState({ loading: false });
            }
        );
    };

    removeAppointmentCallback = ({ day, number, time, id }, removeCb) => {
        this.setState(
            {
                loading: true,
            },
            async () => {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                console.log(
                    `Removed appointment ${number}, day ${day}, time ${time}, id ${id}`
                );
                removeCb(day, number);
                this.setState({ loading: false });
            }
        );
    };

    render() {
        const days = [
            [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
                {
                    id: 2,
                    number: 2,
                    isReserved: false,
                    isSelected: false,
                    periods: 3,
                },
            ],
            [
                null,
                null,
                null,
                { id: 2, number: 2 },
                { id: 3, number: 3, isReserved: true },
                { id: 4, number: 4 },
                { id: 5, number: 5 },
                { id: 6, number: 6 },
                { id: 7, number: 7 },
                { id: 8, number: 8 },
                { id: 9, number: 9 },
                { id: 10, number: 10 },
                { id: 11, number: 11 },
            ],
            [
                null,
                null,
                null,
                { id: 2, number: 2 },
                { id: 3, number: 3, isReserved: true },
                { id: 4, number: 4 },
                { id: 5, number: 5 },
                { id: 6, number: 6 },
                { id: 7, number: 7 },
                { id: 8, number: 8 },
                { id: 9, number: 9 },
                { id: 10, number: 10 },
                { id: 11, number: 11 },
            ],
            [
                null,
                null,
                null,
                { id: 2, number: 2 },
                { id: 3, number: 3, isReserved: true },
                { id: 4, number: 4 },
                { id: 5, number: 5 },
                { id: 6, number: 6 },
                { id: 7, number: 7 },
                { id: 8, number: 8 },
                { id: 9, number: 9 },
                { id: 10, number: 10 },
                { id: 11, number: 11 },
            ],
            [
                null,
                null,
                null,
                { id: 2, number: 2 },
                { id: 3, number: 3, isReserved: true },
                { id: 4, number: 4 },
                { id: 5, number: 5 },
                { id: 6, number: 6 },
                { id: 7, number: 7 },
                { id: 8, number: 8 },
                { id: 9, number: 9 },
                { id: 10, number: 10 },
                { id: 11, number: 11 },
            ],
        ];
        const { loading } = this.state;
        return (
            <div className='appointment-table'>
                <AppointmentPicker
                    addAppointmentCallback={this.addAppointmentCallback}
                    removeAppointmentCallback={this.removeAppointmentCallback}
                    initialDay={new Date('2022-06-13')}
                    days={days}
                    maxReservableAppointments={3}
                    alpha
                    visible
                    selectedByDefault
                    loading={loading}
                    unitTime={30 * 60 * 1000}
                />
            </div>
        );
    }
}

export default Timetable;
