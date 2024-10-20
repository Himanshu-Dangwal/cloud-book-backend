if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors')

const authRoute = require('./routes/auth')
const notesRoute = require('./routes/notes')

// express init
const app = express()

// mongoose init
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017'
// async function main() {
//    mongoose.set("strictQuery", false);
//   await mongoose.connect(dbUrl);
//   console.log("Database connected");
// }
// main().catch(err => console.log("Error Connecting to the database"));

async function connectToMongo(){
   mongoose.set("strictQuery", false);
    mongoose.connect(dbUrl);
    console.log("Succesfully connected to mongoDB database")
}

connectToMongo().catch(err => console.log("Some error"));
app.use(cors())

// middleware
app.use(express.json())


// Routes
app.get('/', (req, res) => {
    res.send("Hello world")
})

app.use('/api/auth', authRoute)
app.use('/api/notes', notesRoute)


// error handling middleware
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Something went wrong'
    res.status(statusCode).json({success: false, message: err.message}); //For development
})

const port = process.env.PORT || 8080
app.listen(port, (req, res) => {
    console.log('Listening to the port 8080');
})


setInterval(() => {
    axios.get('https://cloudb.onrender.com/')
        .then(response => {
            console.log('Pinged backend to keep it alive.');
        })
        .catch(error => {
            console.error('Error pinging backend:', error);
        });
}, 2 * 60 * 1000);
