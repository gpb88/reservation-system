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
import {
    addEvent,
    getPermissions,
    predictMachine,
    predictDates,
} from 'API';
import { useSnackbar } from 'notistack';

export default function AddEvent(props) {
    const [title, setTitle] = React.useState('My Event');
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [machine, setMachine] = React.useState('');
    const [machines, setMachines] = React.useState([]);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(async () => {
        const predictedMachine = await predictMachine(props.user.id);
        setMachine(predictedMachine);

        const predictedTime = await predictDates(props.user.id);
        setStartTime(predictedTime.dates.startTime);
        setEndTime(predictedTime.dates.endTime);
    }, []);

    React.useEffect(() => {
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
            .then((response) => {
                if (response.reserved)
                    return enqueueSnackbar('Please select available timeframe', {
                        variant: 'warning',
                    });
                else
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
