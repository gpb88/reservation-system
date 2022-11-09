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
import 'styles/add-class.css';
import { getClasses, addClass, getPermissions } from 'API';
import { useSnackbar } from 'notistack';

export default function AddClass(props) {
    const [title, setTitle] = React.useState('My Event');
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [classes, setClasses] = React.useState([]);
    const [machine, setMachine] = React.useState('');
    const [machines, setMachines] = React.useState([]);
    const [eventStartTimes, setEventStartTimes] = React.useState([]);
    const [eventEndTimes, setEventEndTimes] = React.useState([]);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getClasses()
            .then((response) => {
                let newClasses = [];

                response.forEach((_class) => {
                    let newClass = {};
                    newClass.start = new Date(_class.start_time);
                    newClass.end = new Date(_class.end_time);

                    newClasses.push(newClass);
                });

                setClasses(newClasses);
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

    const handleAddClass = async () => {
        // ? Data validation
        if (new Date(startTime).getTime() >= new Date(endTime).getTime()) {
            return enqueueSnackbar("End time can't precede start time!", {
                variant: 'warning',
            });
        }

        addClass(
            props.user.id,
            machine,
            title,
            new Date(startTime),
            new Date(endTime)
        )
            .then(() => {
                return enqueueSnackbar('Class successfully added', {
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
        // classes.forEach((_class) => {
        //     const classStartDate = new Date(_class.start);
        //     const classEndDate = new Date(_class.end);

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
        <Container className='add-class'>
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
                        Add class
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
                            className='add-class-datepicker'
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
                            className='add-class-datepicker'
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
                        onClick={handleAddClass}
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </Container>
    );
}
