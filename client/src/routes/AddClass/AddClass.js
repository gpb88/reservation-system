import * as React from 'react';
import {
    TextField,
    Grid,
    Typography,
    Button,
    MenuItem,
    Container,
    Select,
    Box,
} from '@mui/material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'styles/add-class.css';
import { getClasses, addClass, getPermissions, getEventColors } from 'API';
import { useSnackbar } from 'notistack';
import { CirclePicker } from 'react-color';

export default function AddClass(props) {
    const [title, setTitle] = React.useState('My Event');
    const [startTime, setStartTime] = React.useState(new Date());
    const [endTime, setEndTime] = React.useState(new Date());
    const [classes, setClasses] = React.useState([]);
    const [machine, setMachine] = React.useState('');
    const [machines, setMachines] = React.useState([]);
    const [colorID, setColorID] = React.useState('');
    const [colors, setColors] = React.useState([]);

    const { enqueueSnackbar } = useSnackbar();

    React.useEffect(() => {
        getClasses().then((response) => {
            let newClasses = [];

            response.forEach((_class) => {
                let newClass = {};
                newClass.start = new Date(_class.start_time);
                newClass.end = new Date(_class.end_time);

                newClasses.push(newClass);
            });

            setClasses(newClasses);
        });

        getPermissions(props.user.user_id).then((response) => {
            setMachines(response);
        });

        getEventColors().then((response) => {
            let objArr = Object.values(response);
            let colorArr = [];
            objArr.forEach((obj) => {
                colorArr.push(obj.background);
            });

            setColors(colorArr);
            setColorID(0);
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
            props.user.user_id,
            title,
            new Date(startTime),
            new Date(endTime),
            machine
        )
            .then((response) => {
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
        let isAvailable = true;
        // const dateFromPicker = new Date(time);

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

        // // ? Exclude time already passed in current day
        // const today = new Date();

        // if (
        //     dateFromPicker.getDay() == today.getDay() &&
        //     dateFromPicker.getMonth() == today.getMonth() &&
        //     dateFromPicker.getYear() == today.getYear() &&
        //     dateFromPicker.getTime() <= today.getTime()
        // )
        //     isAvailable = false;

        return isAvailable;
    };

    const filterEndTimes = (time) => {
        let isAvailable = true;
        // const dateFromPicker = new Date(time);

        // // ? Check if dates are already reseved
        // classes.forEach((_class) => {
        //     const classStart = new Date(_class.start);
        //     const classEnd = new Date(_class.end);

        //     if (
        //         classStart.getTime() <= dateFromPicker.getTime() &&
        //         classEnd.getTime() >= dateFromPicker.getTime()
        //     ) {
        //         isAvailable = false;
        //     }
        // });

        return isAvailable;
    };

    const handleColorChange = (color) => {
        setColorID(colors.indexOf(color.hex));
    };

    const times = [];
    for (let i = 7; i <= 22; i++) {
        for (let j = 0; j < 4; j++) {
            times.push(i + ':' + (j === 0 ? '00' : 15 * j));
        }
    }

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
                    <Box
                        disableGutters
                        sx={{
                            width: '1.4em',
                            height: '1.4em',
                            backgroundColor: colors[colorID],
                            mx: 2,
                            borderRadius: '50%',
                        }}
                    />
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
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        sx={{ width: '60%', textAlign: 'left' }}
                        variant='h6'
                        align='center'
                    >
                        Color
                    </Typography>
                </Grid>

                <Grid
                    item
                    xs={12}
                    sx={{
                        justifySelf: 'center',
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    <Container
                        sx={{
                            width: '60%',
                        }}
                        disableGutters
                    >
                        <CirclePicker
                            onChange={handleColorChange}
                            className='circle-picker'
                            colors={colors}
                            width='60%'
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
                                <MenuItem
                                    key={index}
                                    value={machine.machine_id}
                                >
                                    {machine.machine_name}
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
                            fontSize: '25px',
                            margin: '20px',
                            width: '300px',
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
