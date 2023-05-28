const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DB_URI = process.env.DB_URI;

mongoose.connect(DB_URI);
const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("[+] DB connected");
});

connection.on("disconnected", () => {
    console.log("[-] DB disconnected");
});

connection.on("error", (err) => {
    console.log("[-] DB error occured\n", err);
});

module.exports = mongoose;

