const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');

const Patient = require('./models/patient');
const Doctor = require('./models/doctor');

const MONGODB_URI = 'mongodb+srv://Yash:Yash@project-1.nfcro.mongodb.net/covid19?retryWrites=true';

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const homeRoutes = require('./routes/home');
const authRoutes = require('./routes/auth');
const dashboardRoutes = require('./routes/dashboard');

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})

const csrfProtection = csrf();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'My super secret',
    resave: false,
    saveUninitialized: false,
    store: store
}))

app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    Patient.findById(req.session.user._id)
    .then(patient => {
        if(!patient) {
            return next();
        }
        req.user = patient;
        next();
    }) 
    .catch(err => {
        console.log(err);
    })
})

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    Doctor.findById(req.session.user._id)
    .then(doctor => {
        if(!doctor) {
            return next();
        }
        req.user = doctor;
        next();
    }) 
    .catch(err => {
        console.log(err);
    })
})

app.use((req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
})

app.use(homeRoutes);
app.use(authRoutes);
app.use('/dashboard', dashboardRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(8000);
})
.catch(err => {
    console.log(err);
})