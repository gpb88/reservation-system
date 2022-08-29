const express = require('express');
const router = express.Router();
const {
    getClasses,
    getClassesForUser,
    addClass,
    deleteClass,
} = require('services/dbController');

router.get('/all', function (req, res) {
    getClasses()
        .then((classes) => {
            res.status(200).send({ classes: classes });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

router.post('/', function (req, res) {
    let { userID, title, startTime, endTime, machineID } = req.body;

    addClass(userID, title, startTime, endTime, machineID)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
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
    // }
});

router.delete('/', function (req, res) {
    const { classID } = req.body;

    if (!classID) {
        console.log('Incomplete data');
        return res.status(400).send();
    }

    deleteClass(classID)
        .then(() => {
            res.status(200).send();
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send();
        });
});

module.exports = router;
