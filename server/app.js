if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// * Rootpath detection
require('rootpath')();

const morgan = require('morgan');
const express = require('express');
const PORT = 8080 || process.env.PORT;
const cors = require('cors');
const app = express();

// * Database connection and app start
const { initDbConn } = require('services/dbController');

// * Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// * Routes
require('routes/routes')(app);

initDbConn()
    .then(() => {
        console.log('Connected to db');

        app.listen(PORT, function () {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch(() => {
        console.log('Could not connect to database');
    });
