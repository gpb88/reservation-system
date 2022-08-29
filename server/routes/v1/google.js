const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
    access_token: process.env.OAUTH_ACCESS_TOKEN,
});

let calendarName = 'AGH Calendar';

const googleCalendar = google.calendar({ version: 'v3', auth: oAuth2Client });

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

router.post('/event/batch', function (req, res) {
    let { events } = req.body;

    events.forEach(async (event) => {
        // ? Freebusy query - not sure if needed?
        // let eventsArr = await calendar.freebusy
        //     .query({
        //         resource: {
        //             timeMin: event.start.dateTime,
        //             timeMax: event.end.dateTime,
        //             timeZone: 'Europe/Warsaw',
        //             items: [{ id: 'primary' }],
        //         },
        //     })
        //     .then((response) => {
        //         return response.data.calendars.primary.busy;
        //     })
        //     .catch((err) => {
        //         console.log(err);
        //     });

        // if (eventsArr.length === 0)
        googleCalendar.events
            .insert({ calendarId: 'primary', resource: event })
            .then(() => {
                console.log('Event added');
            })
            .catch((err) => {
                console.log(err);
            });
    });

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
