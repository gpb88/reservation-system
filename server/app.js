if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// * Rootpath detection
require('rootpath')();

const morgan = require('morgan');
const express = require('express');
const cookieparser = require('cookie-parser');
const PORT = 8080 || process.env.PORT;
const cors = require('cors');
const app = express();

// * Database connection and app start
const { connectToDB } = require('database/controller');
const { syncDB } = require('database/methods');

// * Middleware
app.use(
    cors({
        credentials: true,
        origin: 'http://localhost:3000',
        exposedHeaders: ['Set-Cookie'],
    })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieparser());

// * Routes
require('routes/routes')(app);

connectToDB()
    .then(() => {
        console.log('Connected to db');
        syncDB();

        app.listen(PORT, function () {
            console.log(`Server listening on port ${PORT}`);
        });
    })
    .catch(() => {
        console.log('Could not connect to database');
    });
