const express = require('express');
const router = express.Router();
const {
    getEventsForUserWithLimit,
    getMachineByName,
} = require('database/methods');

function createTimeFrame(startTime, endTime) {
    return (
        startTime.getHours() +
        ':' +
        startTime.getMinutes() +
        '-' +
        endTime.getHours() +
        ':' +
        endTime.getMinutes()
    );
}

function createDates(timeFrame) {
    let workday = new Date();
    workday.setDate(workday.getDate() + 1);

    // ? Skip weekends
    if (workday.getDay() == 0) workday.setDate(workday.getDate() + 1);
    else if (workday.getDay() == 6) workday.setDate(workday.getDate() + 2);

    let startTime = new Date(workday.getTime());
    startTime.setHours(timeFrame.split('-')[0].split(':')[0]);
    startTime.setMinutes(timeFrame.split('-')[0].split(':')[1]);
    startTime.setSeconds(0);

    let endTime = new Date(workday.getTime());
    endTime.setHours(timeFrame.split('-')[1].split(':')[0]);
    endTime.setMinutes(timeFrame.split('-')[1].split(':')[1]);
    endTime.setSeconds(0);

    return { startTime: startTime.getTime(), endTime: endTime.getTime() };
}

router.post('/time', async function (req, res) {
    const { userID } = req.body;
    const limit = 10;

    const events = await getEventsForUserWithLimit(userID, limit);
    const lastEntry = events[events.length - 1].dataValues;
    const lastSelectedTimeframe = createTimeFrame(
        lastEntry.start_time,
        lastEntry.end_time
    );

    // ? Generate Markov chain
    const markovChain = {};
    for (let i = 0; i < events.length; i++) {
        const currentTimeframe = createTimeFrame(
            events[i].dataValues.start_time,
            events[i].dataValues.end_time
        );
        const nextTimeframe = events[i + 1]
            ? createTimeFrame(
                  events[i + 1].dataValues.start_time,
                  events[i + 1].dataValues.end_time
              )
            : null;

        if (!markovChain[currentTimeframe]) {
            markovChain[currentTimeframe] = [];
        }
        if (nextTimeframe) {
            markovChain[currentTimeframe].push(nextTimeframe);
        }
    }

    const chainLength = markovChain[lastSelectedTimeframe].length;
    const result =
        markovChain[lastSelectedTimeframe][
            Math.floor(Math.random() * chainLength)
        ];

    // console.log(markovChain);
    // console.log(result);

    // ? Create new dates
    let dates = createDates(result);
    console.log(dates);

    res.status(200).send({ dates: dates });
});

router.post('/machine', async function (req, res) {
    const { userID } = req.body;
    const limit = 10;

    const events = await getEventsForUserWithLimit(userID, limit);
    const lastEntry = events[events.length - 1].dataValues;
    const lastSelectedMachine = lastEntry.Machine.dataValues.name;

    // ? Generate Markov chain
    const markovChain = {};
    for (let i = 0; i < events.length; i++) {
        const currentMachine = events[i].dataValues.Machine.dataValues.name;
        const nextMachine =
            events[i + 1]?.dataValues?.Machine?.dataValues?.name;

        if (!markovChain[currentMachine]) {
            markovChain[currentMachine] = [];
        }
        if (nextMachine) {
            markovChain[currentMachine].push(nextMachine);
        }
    }

    const chainLength = markovChain[lastSelectedMachine].length;
    const result =
        markovChain[lastSelectedMachine][
            Math.floor(Math.random() * chainLength)
        ];

    console.log(markovChain);

    if (result) {
        const machine = await getMachineByName(result);

        res.status(200).send({ machine: machine.dataValues.id });
    } else {
        res.status(200).send({ machine: '' });
    }
});

router.post('/title', async function (req, res) {
    const { userID } = req.body;
    const limit = 1;

    const events = await getEventsForUserWithLimit(userID, limit);
    const title = events[0]?.dataValues?.title;

    res.status(200).send({ title: title ? title : '' });
});

module.exports = router;
