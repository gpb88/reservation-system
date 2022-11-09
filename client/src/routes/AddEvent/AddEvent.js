import * as React from 'react';
import {
    TextField,
    Grid,
    Typography,
    Button,
    MenuItem,
    Container,
    Select,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'styles/add-event.css';
import { getEvents, addEvent, getPermissions } from 'API';
import { useSnackbar } from 'notistack';

export default function AddEvent(props) {
    const [title, setTitle] = React.useState('My Event');
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [events, setEvents] = React.useState([]);
    const [machine, setMachine] = React.useState('');
    const [machines, setMachines] = React.useState([]);
    const [eventStartTimes, setEventStartTimes] = React.useState([]);
    const [eventEndTimes, setEventEndTimes] = React.useState([]);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getEvents()
            .then((response) => {
                let newEvents = [];

                response.forEach((event) => {
                    let newEvent = {};
                    newEvent.start = new Date(event.start_time);
                    newEvent.end = new Date(event.end_time);

                    newEvents.push(newEvent);
                });

                setEvents(newEvents);
            })
            .catch((err) => {
                console.log(err);
            });

        getPermissions(props.user.id)
            .then((response) => {
                setMachines(response);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleChangeMachine = (event) => {
        setMachine(event.target.value);
    };

    const handleAddEvent = async () => {
        // ? Data validation
        if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
            return enqueueSnackbar("End time can't precede start time!", {
                variant: 'warning',
            });
        }

        addEvent(
            props.user.id,
            machine,
            title,
            new Date(startTime),
            new Date(endTime)
        )
            .then(() => {
                return enqueueSnackbar('Event has been added', {
                    variant: 'success',
                });
            })
            .catch(() => {
                return enqueueSnackbar('Error occured', {
                    variant: 'error',
                });
            });
    };

    const filterStartTimes = (time) => {
        const dateFromPicker = new Date(time);
        const today = new Date();
        let isAvailable = true;

        // // ? Check if dates are already reseved
        // events.forEach((event) => {
        //     const classStartDate = new Date(event.start);
        //     const classEndDate = new Date(event.end);

        //     if (
        //         classStartDate.getTime() <= dateFromPicker.getTime() &&
        //         classEndDate.getTime() >= dateFromPicker.getTime()
        //     ) {
        //         isAvailable = false;
        //     }
        // });

        // ? Exclude hours that already passed in current day
        if (
            dateFromPicker.getYear() == today.getYear() &&
            dateFromPicker.getMonth() == today.getMonth() &&
            dateFromPicker.getDay() == today.getDay() &&
            dateFromPicker.getTime() <= today.getTime()
        )
            isAvailable = false;

        return isAvailable;
    };

    const filterEndTimes = (time) => {
        const dateFromPicker = new Date(time);
        const today = new Date();
        let isAvailable = true;

        // ? Exclude hours that already passed in current day
        if (
            dateFromPicker.getYear() == today.getYear() &&
            dateFromPicker.getMonth() == today.getMonth() &&
            dateFromPicker.getDay() == today.getDay() &&
            dateFromPicker.getTime() <= today.getTime()
        )
            isAvailable = false;

        return isAvailable;
    };

    return (
        <Container className='add-event'>
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                }}
                spacing={2}
            >
                <Grid item xs={12} sx={{ mt: 6, mb: 4 }}>
                    <Typography variant='h4' align='center'>
                        Add event
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                        align='center'
                    >
                        Title
                    </Typography>
                </Grid>

                <Grid
                    item
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    xs={12}
                >
                    <TextField
                        variant='outlined'
                        label='Enter title'
                        value={title}
                        multiline
                        rows={5}
                        sx={{ width: '60%' }}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                    >
                        Start time
                    </Typography>
                </Grid>

                <Grid
                    item
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                    }}
                    xs={12}
                >
                    <Container
                        sx={{
                            width: '60%',
                        }}
                        disableGutters
                    >
                        <DatePicker
                            className='add-event-datepicker'
                            showTimeSelect
                            popperPlacement='right'
                            timeFormat='HH:mm'
                            dateFormat='MMMM d yyyy, HH:mm'
                            selected={startTime}
                            onChange={(date) => {
                                setStartTime(date);
                            }}
                            minTime={new Date().setHours(7, 0, 0)}
                            maxTime={new Date().setHours(21, 0, 0)}
                            excludeTimes={eventStartTimes}
                            excludeDateIntervals={[
                                // ? Exclude dates before today
                                {
                                    start: new Date('1970-01-01'),
                                    end: new Date().setTime(
                                        new Date().getTime() -
                                            24 * 60 * 60 * 1000
                                    ),
                                },
                            ]}
                            filterTime={filterStartTimes}
                        />
                    </Container>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                    >
                        End time
                    </Typography>
                </Grid>

                <Grid
                    item
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                    }}
                    xs={12}
                >
                    <Container
                        sx={{
                            width: '60%',
                        }}
                        disableGutters
                    >
                        <DatePicker
                            className='add-event-datepicker'
                            showTimeSelect
                            timeFormat='HH:mm'
                            popperPlacement='right'
                            dateFormat='MMMM d yyyy, HH:mm'
                            selected={endTime}
                            onChange={(date) => setEndTime(date)}
                            excludeDateIntervals={[
                                // ? Exclude dates before start date
                                {
                                    start: new Date('1970-01-01'),
                                    end: new Date().setTime(
                                        new Date(startTime).getTime() -
                                            24 * 60 * 60 * 1000
                                    ),
                                },
                            ]}
                            filterTime={filterEndTimes}
                        />
                    </Container>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                    >
                        Machine
                    </Typography>
                </Grid>

                <Grid
                    item
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                    xs={12}
                >
                    <Container
                        sx={{
                            width: '60%',
                        }}
                        disableGutters
                    >
                        <Select
                            value={machine}
                            label='Machine'
                            onChange={handleChangeMachine}
                            sx={{ width: '100%' }}
                        >
                            {machines.map((machine, index) => (
                                <MenuItem key={index} value={machine.id}>
                                    {machine.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </Container>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Button
                        variant='contained'
                        sx={{
                            fontSize: '18px',
                            my: 6,
                            width: '100px',
                        }}
                        onClick={handleAddEvent}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}
