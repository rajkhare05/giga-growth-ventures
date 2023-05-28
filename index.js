const express = require('express');
const session = require('express-session');
const cors = require('cors');
const mongoStore = require('connect-mongo');
const passport = require('./config/auth.js');
require('./config/db.js');

const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || '/auth/callback/google';
const SESSION_SECRET = process.env.SESSION_SECRET || 'SESSION_SECRET';
const SESSION_LIFETIME = process.env.SESSION_LIFETIME || 24 * 60 * 60 * 1000; // in milliseconds, default: 1 day
const SESSION_RENEW_LIFETIME = process.env.SESSION_RENEW_LIFETIME || 24 * 60 * 60; // in seconds, default: 1 day
const SESSION_STORE_DB_URI = process.env.SESSION_STORE_DB_URI;
const CLIENT_ORIGIN_URI = process.env.CLIENT_ORIGIN_URI || 'http://127.0.0.1:3000';
const API_KEY = process.env.API_KEY; // stock data fetching api key
let STOCK_URI = process.env.STOCK_URI + `apikey=${API_KEY}`;

const app = express();

app.use(express.json());

app.use(cors({
    origin: CLIENT_ORIGIN_URI,
    credentials: true,
}));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    maxAge: SESSION_LIFETIME,  
    store: mongoStore.create({
        mongoUrl: SESSION_STORE_DB_URI,
        autoRemove: 'native',
        ttl: SESSION_RENEW_LIFETIME,
    }),
}));

app.use(passport.authenticate('session'));

app.get('/login', (req, res) => {
    if (req.user && req.user.email) res.redirect(CLIENT_ORIGIN_URI);
    else res.redirect(GOOGLE_CALLBACK_URL);
});

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect(CLIENT_ORIGIN_URI);
    });
});

app.get('/session', (req, res) => {
    if (req.user)
        res.json(req.user);
    else res.json({});
});

app.get('/search', async (req, res) => {
    const { q } = req.query;
    const URI = `${STOCK_URI}&function=SYMBOL_SEARCH&keywords=${q}`;
    const response = await fetch(URI);
    const data = await response.json();
    res.json(data);
});

app.get('/stock/:symbol', async (req, res) => {
    const { symbol } = req.params;
    const URI = STOCK_URI + `&function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}`;
    const response = await fetch(URI);
    const data = await response.json();
    res.json(data);
});

app.get(GOOGLE_CALLBACK_URL, passport.authenticate('google', {
    successRedirect: CLIENT_ORIGIN_URI,
    failureRedirect: '/login'
}));

app.listen(4000, () => {
    console.log(`Listening on port: 4000`)
});

