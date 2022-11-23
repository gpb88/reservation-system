const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const calendarName = 'AGH Calendar';
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URL
);
const scopes = ['https://www.googleapis.com/auth/calendar'];
let googleCalendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
});

router.get('/authorize/check', function (req, res) {
    oauth2Client
        .getAccessToken()
        .then((response) => {
            console.log(response);

            res.status(200).send({ isAuthorized: true });
        })
        .catch((err) => {
            console.log(err);
            res.status(200).send({ isAuthorized: false });
        });
});

router.get('/authorize/url', function (req, res) {
    try {
        const url = oauth2Client.generateAuthUrl({
            // 'online' (default) or 'offline' (gets refresh_token)
            access_type: 'offline',

            // If you only need one scope you can pass it as a string
            scope: scopes,
        });

        res.status(200).send({ url: url });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/authorize/code', async function (req, res) {
    let { accessCode } = req.body;

    if (!accessCode) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        const { tokens } = await oauth2Client.getToken(accessCode);
        oauth2Client.setCredentials(tokens);

        res.status(200).send();
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.post('/event', async function (req, res) {
    let { summary, start, end } = req.body;

    if (!summary || !start || !end) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        const timeZone = 'Europe/Warsaw';
        const colorID = 1;
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
            colorID: colorID,
        };

        googleCalendar.events
            .insert({ calendarId: 'primary', resource: event })
            .then((response) => {
                console.log('Event added');
                res.status(200).send();
            })
            .catch((err) => {
                console.log(err);
                res.status(500).send();
            });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
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
