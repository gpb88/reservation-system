import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Button from '@mui/material/Button';
import { useState } from 'react';
import 'styles/add-class.css';
import { addClass, getUser } from 'API';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const toastDuration = 6000;

export default function AddClass(props) {
    const [title, setTitle] = useState('My Event');
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
    const [openErrorAlert, setOpenErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Error occurred');

    const setDefaultErrorMessage = () => {
        setErrorMessage('Error occurred');
    };

    const handleAddClass = async () => {
        let userID = await getUser(props.user);

        console.log(userID.user_id, title, startTime, endTime);
        // ? Data validation
        if (new Date(startTime) > new Date(endTime)) {
            setErrorMessage("End date can't precede start date!");
            setOpenErrorAlert(true);
            setTimeout(() => {
                setDefaultErrorMessage();
                setOpenErrorAlert(false);
            }, toastDuration);
        } else if (new Date(startTime) == new Date(endTime)) {
            setErrorMessage("End date can't be same as start date!");
            setOpenErrorAlert(true);
            setTimeout(() => {
                setDefaultErrorMessage();
                setOpenErrorAlert(false);
            }, toastDuration);
        } else {
            addClass(userID.user_id, title, startTime, endTime)
                .then(() => {
                    setOpenSuccessAlert(true);
                    setTimeout(() => setOpenSuccessAlert(false), toastDuration);
                })
                .catch(() => {
                    setOpenErrorAlert(true);
                    setTimeout(() => setOpenErrorAlert(false), toastDuration);
                });
        }
    };

    const filterPassedTime = (time) => {
        const selectedDate = new Date(startTime);
        const currentDate = new Date(time);

        return currentDate.getTime() > selectedDate.getTime();
    };

    const times = [];
    for (let i = 7; i <= 22; i++) {
        for (let j = 0; j < 4; j++) {
            times.push(i + ':' + (j === 0 ? '00' : 15 * j));
        }
    }

    return (
        <div className='add-class'>
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyItems: 'center',
                    alignItems: 'center',
                    p: 2,
                }}
                spacing={2}
            >
                <Grid item xs={12} sx={{ pb: 4 }}>
                    <Typography variant='h3' component='div' align='center'>
                        Add class
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography variant='h5' component='div' align='center'>
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
                    xs={9}
                >
                    <TextField
                        variant='outlined'
                        label='Enter title'
                        value={title}
                        multiline
                        rows={5}
                        sx={{ width: '300px' }}
                        onChange={(e) => {
                            setTitle(e.target.value);
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography variant='h5' component='div' align='center'>
                        Start time
                    </Typography>
                </Grid>
                <Grid
                    item
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                    xs={9}
                >
                    <Grid
                        sx={{
                            display: 'flex',
                            justifyItems: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <DatePicker
                            disabled
                            selected={startTime}
                            dateFormat='MM/dd/yyyy h:mm aa'
                        />
                    </Grid>
                    <DatePicker
                        showTimeSelect
                        selected={startTime}
                        onChange={(date) => setStartTime(date)}
                        inline
                    />
                </Grid>
                <Grid item xs={3}>
                    <Typography variant='h5' component='div' align='center'>
                        End time
                    </Typography>
                </Grid>
                <Grid
                    item
                    sx={{
                        display: 'flex',
                        justifyItems: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                    }}
                    xs={9}
                >
                    <Grid
                        sx={{
                            display: 'flex',
                            justifyItems: 'center',
                            alignItems: 'center',
                            marginBottom: '20px',
                        }}
                    >
                        <DatePicker
                            disabled
                            selected={endTime}
                            dateFormat='MM/dd/yyyy h:mm aa'
                        />
                    </Grid>
                    <DatePicker
                        showTimeSelect
                        selected={endTime}
                        onChange={(date) => setEndTime(date)}
                        inline
                        excludeDateIntervals={[
                            {
                                start: new Date('1970-01-01'),
                                end: new Date().setTime(
                                    new Date(startTime).getTime() -
                                        24 * 60 * 60 * 1000
                                ),
                            },
                        ]}
                        filterTime={filterPassedTime}
                    />
                </Grid>
                <Grid
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
                        Add
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={openSuccessAlert} autoHideDuration={1000}>
                <Alert severity='success' sx={{ width: '100%' }}>
                    Entry has been added!
                </Alert>
            </Snackbar>
            <Snackbar open={openErrorAlert} autoHideDuration={1000}>
                <Alert severity='error' sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}
