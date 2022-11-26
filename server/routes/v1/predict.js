const express = require('express');
const router = express.Router();
const {
    getEventsForUserWithLimit,
    getMachineByName,
} = require('database/methods');

function createTimeFrame(startTime, endTime) {
    return (
        startTime.getDay() +
        ':' +
        startTime.getHours() +
        ':' +
        startTime.getMinutes() +
        '-' +
        endTime.getDay() +
        ':' +
        endTime.getHours() +
        ':' +
        endTime.getMinutes()
    );
}

// https://codereview.stackexchange.com/questions/33527/find-next-occurring-friday-or-any-dayofweek
function getNextDayOfWeek(date, dayOfWeek) {
	var resultDate = new Date(date.getTime());

	resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

	return resultDate;
}

function createDates(timeFrame) {
    let workday = new Date();
    workday.setDate(workday.getDate() + 1);
		console.log(timeFrame)

    // ? Skip weekends
    if (workday.getDay() == 0) workday.setDate(workday.getDate() + 1);
    else if (workday.getDay() == 6) workday.setDate(workday.getDate() + 2);

    let startTime = new Date(workday.getTime());
		startTime = getNextDayOfWeek(startTime, timeFrame.split('-')[0].split(':')[0])
    startTime.setHours(timeFrame.split('-')[0].split(':')[1]);
    startTime.setMinutes(timeFrame.split('-')[0].split(':')[2]);
    startTime.setSeconds(0);

    let endTime = new Date(workday.getTime());
		endTime = getNextDayOfWeek(endTime, timeFrame.split('-')[0].split(':')[0])
    endTime.setHours(timeFrame.split('-')[1].split(':')[1]);
    endTime.setMinutes(timeFrame.split('-')[1].split(':')[2]);
    endTime.setSeconds(0);

		console.log({ startTime: startTime, endTime: endTime })
    return { startTime: startTime.getTime(), endTime: endTime.getTime() };
}

router.get('/dates', async function (req, res) {
    const { userID } = req.query;
    const limit = 10;

    if (!userID) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        const events = await getEventsForUserWithLimit(userID, limit);
        if (events.length > 0) {
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

            if (result) {
                // ? Create new dates
                let dates = createDates(result);
                console.log(dates);

                res.status(200).send({ dates: dates });
            } else {
                const now = new Date();

                res.status(200).send({
                    dates: {
                        startTime: now.getTime(),
                        endTime: now.getTime(),
                    },
                });
            }
        } else {
            const now = new Date();

            res.status(200).send({
                dates: {
                    startTime: now.getTime(),
                    endTime: now.getTime(),
                },
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

router.get('/machine', async function (req, res) {
    const { userID } = req.query;
    const limit = 10;

    if (!userID) {
        console.log('Incomplete data');
        return res.status(402).send();
    }

    try {
        const events = await getEventsForUserWithLimit(userID, limit);
        if (events.length > 0) {
            const lastEntry = events[events.length - 1].dataValues;
            const lastSelectedMachine = lastEntry.Machine.dataValues.name;

            // ? Generate Markov chain
            const markovChain = {};
            for (let i = 0; i < events.length; i++) {
                const currentMachine =
                    events[i].dataValues.Machine.dataValues.name;
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
        } else res.status(200).send({ machine: '' });
    } catch (error) {
        console.log(error);
        res.status(500).send();
    }
});

module.exports = router;
