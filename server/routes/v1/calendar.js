const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

const oAuth2Client = new google.auth.OAuth2(
    '482515397007-jkr3rou3f09b3dltvfkvohfv34emi67m.apps.googleusercontent.com',
    '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'
);

oAuth2Client.setCredentials({
    refresh_token:
        '1//04SsJxJffcjZwCgYIARAAGAQSNwF-L9IrF02_LFzGivUHqS7_HcuTDztc9EGecwTHdPGiqHipXCAq1tDEhRO3VRxNoWnhRCgPofs',
    access_token:
        'ya29.a0AVA9y1uYQKa4EID0YXpXAj8PCGV-KZDdWo9ACDh1PnbAWv8D8yVId3Kmgir1ndO7D6GQAqYjZ4WLS6DKOn4oOAyoLFDd4ln6BVb_SaWblfa2mSZhjK3wvFhZL_SE4URXZzmrWk-tA0J_BTSBMM0nPEl-hETqaCgYKATASATASFQE65dr8KNy0lNUF8CgwtDzMsREMhQ0163',
});

const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

router.post('/', async function (req, res) {
    try {
        let { events } = req.body;

        for (let i = 0; i < events.length; i++) {
            let event = events[i];

            calendar.freebusy.query(
                {
                    resource: {
                        timeMin: event.start.dateTime,
                        timeMax: event.end.dateTime,
                        timeZone: 'Europe/Warsaw',
                        items: [{ id: 'primary' }],
                    },
                },
                (error, response) => {
                    if (error)
                        return console.error('Free Busy query error: ', error);
                    const eventsArr = response.data.calendars.primary.busy;
                    console.log(eventsArr);
                    if (eventsArr.length === 0)
                        return calendar.events.insert(
                            { calendarId: 'primary', resource: event },
                            (error) => {
                                if (error)
                                    return console.error(
                                        'Event creation failed: ',
                                        error
                                    );
                                return console.log('Calendar event created');
                            }
                        );
                }
            );
        }

        res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
