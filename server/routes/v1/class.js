const express = require('express');
const router = express.Router();
const {
    getClasses,
    getClassesForUser,
    addClass,
    deleteClass,
} = require('services/dbController');

router.get('/all', async function (req, res) {
    try {
        const classes = await getClasses();

        res.status(200).send({ message: 'Success', classes: classes });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.post('/', async function (req, res) {
    try {
        let { userID, title, startTime, endTime, machineID } = req.body;

        try {
            // function dateRangeOverlaps(a_start, a_end, b_start, b_end) {
            //     if (a_start <= b_start && b_start <= a_end) return true;
            //     if (a_start <= b_end && b_end <= a_end) return true;
            //     if (b_start < a_start && a_end < b_end) return true;
            //     return false;
            // }

            // const classes = await getClassesForUser(userID);
            // let i = 0;
            // let len = classes.length;
            // let datesOverlap = false;
            // while (i < len) {
            //     let a_start = new Date(startTime).getTime();
            //     let a_end = new Date(endTime).getTime();
            //     let b_start = new Date(classes[i].start_time).getTime();
            //     let b_end = new Date(classes[i].end_time).getTime();

            //     if (dateRangeOverlaps(a_start, a_end, b_start, b_end)) {
            //         datesOverlap = true;
            //         break;
            //     }
            //     i++;
            // }

            // if (datesOverlap) {
            //     return res
            //         .status(200)
            //         .send({ message: 'Class exists', overlaps: true });
            // } else {
            await addClass(userID, title, startTime, endTime, machineID);
            return res
                .status(200)
                .send({ message: 'Class added' });
            // }
        } catch (error) {
            console.log(error);
            return res.status(200).send({ message: 'Something went wrong' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Unknown error occured' });
    }
});

router.delete('/', async function (req, res) {
    try {
        const { classID } = req.body;

        console.log(classID);

        // * Validate user input
        if (!classID) {
            console.log('Incomplete data');
            return res.status(200).send({ message: 'Incomplete data' });
        }

        await deleteClass(classID);

        return res.status(200).send({ message: 'Success' });
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: 'Unknown error occured' });
    }
});

module.exports = router;
