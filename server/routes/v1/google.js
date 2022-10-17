const express = require('express');
const router = express.Router();
const { getSetting } = require('database/methods');
const { google } = require('googleapis');

let calendarName = 'AGH Calendar';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL
);

const scopes = ['https://www.googleapis.com/auth/calendar'];

// const { tokens } = async () => await oauth2Client.getToken(code);
// oauth2Client.setCredentials(tokens);
// oauth2Client.on('tokens', (tokens) => {
//     if (tokens.refresh_token) {
//         // store the refresh_token in my database!
//         console.log(tokens.refresh_token);
//     }
//     console.log(tokens.access_token);
// });

const googleCalendar = google.calendar({ version: 'v3', auth: oauth2Client });

router.get('/authorize', function (req, res) {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes,
    });

    res.status(200).send({ url: url });
});

router.get('/calendar/colors', function (req, res) {
    googleCalendar.colors
        .get()
        .then((colors) => {
            res.status(200).send({ colors: colors.data.calendar });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.get('/event/colors', function (req, res) {
    googleCalendar.colors
        .get()
        .then((colors) => {
            res.status(200).send({ colors: colors.data.event });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/event', async function (req, res) {
    let { userID, summary, start, end } = req.body;

    const colorID = await getSetting(userID, 'google_event_color');
    const addEventsToSeparateCalendar = await getSetting(
        userID,
        'add_events_to_separate_calendar'
    );
    const timeZone = 'Europe/Warsaw';

    console.log(colorID);

    const event = {
        summary: summary,
        // description: 'Test description',
        start: {
            dateTime: start,
            timeZone: timeZone,
        },
        end: {
            dateTime: end,
            timeZone: timeZone,
        },
        colorId: Number(colorID) + 1,
    };

    // events.forEach(async (event) => {
    //     // ? Freebusy query - not sure if needed?
    //     // let eventsArr = await calendar.freebusy
    //     //     .query({
    //     //         resource: {
    //     //             timeMin: event.start.dateTime,
    //     //             timeMax: event.end.dateTime,
    //     //             timeZone: 'Europe/Warsaw',
    //     //             items: [{ id: 'primary' }],
    //     //         },
    //     //     })
    //     //     .then((response) => {
    //     //         return response.data.calendars.primary.busy;
    //     //     })
    //     //     .catch((err) => {
    //     //         console.log(err);
    //     //     });

    //     // if (eventsArr.length === 0)
    googleCalendar.events
        .insert({ calendarId: 'primary', resource: event })
        .then(() => {
            console.log('Event added');
        })
        .catch((err) => {
            console.log(err);
        });
    // });

    res.status(200).send();
});

router.get('/calendar', function (req, res) {
    googleCalendar.calendarList
        .list()
        .then((response) => {
            console.log(response);
            res.status(200).send({ calendars: response.data.items });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/calendar', function (req, res) {
    const calendar = {
        summary: calendarName,
    };
    googleCalendar.calendars
        .insert({ resource: calendar })
        .then(() => {
            return res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
        });
});

module.exports = router;
