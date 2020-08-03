const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator/check');

const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: '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'
        }
    })
)

exports.getPatientLogin = (req, res, next) => {
    let errorMessage = req.flash('error');
    let successMessage = req.flash('success');
    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    if(successMessage.length > 0) {
        successMessage = successMessage[0];
    } else {
        successMessage = null;
    }
    res.render('auth/patient/login', {
        pageTitle: 'Patient Login',
        isAuthenticated: false,
        errorMessage: errorMessage,
        successMessage: successMessage,
        validationErrors: []
    })
}

exports.postPatientLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/patient/login', {
            pageTitle: 'Patient Login',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
 
    Patient.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login/patient');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    res.redirect('/dashboard/patient');
                })
            }
            req.flash('error', 'Invalid email or password');
            res.redirect('/login/patient');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login/patient');
        })
    }) 
    .catch(err => {
        console.log(err);
    })
}

exports.getDoctorLogin = (req, res, next) => {
    let errorMessage = req.flash('error');
    let successMessage = req.flash('success');
    if(errorMessage.length > 0) {
        errorMessage = errorMessage[0];
    } else {
        errorMessage = null;
    }
    if(successMessage.length > 0) {
        successMessage = successMessage[0];
    } else {
        successMessage = null;
    }
    res.render('auth/doctor/login', {
        pageTitle: 'Doctor Login',
        isAuthenticated: false,
        errorMessage: errorMessage,
        successMessage: successMessage,
        validationErrors: []
    })
}

exports.postDoctorLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/doctor/login', {
            pageTitle: 'Patient Login',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Doctor.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login/doctor');
        }
        bcrypt.compare(password, user.password)
        .then(doMatch => {
            if(doMatch) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(err => {
                    res.redirect('/dashboard/doctor');
                })
            }
            req.flash('error', 'Invalid email or password');
            res.redirect('/login/doctor');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login/doctor');
        })
    }) 
    .catch(err => {
        console.log(err);
    })
}

exports.getPatientRegister = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/patient/register', {
        pageTitle: 'Patient Register',
        errorMessage: message,
        validationErrors: []
    })
}

exports.postPatientRegister = (req, res, next) => {
    const name = req.body.name;
    const dob = req.body.dob;
    const gender = req.body.gender;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/patient/register', {
            pageTitle: 'Patient Login',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }
    
    Patient.findOne({email: email})
    .then(userDoc => {
        if(userDoc) {
            req.flash('error', 'Email exists already, please pick a different one.');
            return res.redirect('/register/patient');
        }
        return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new Patient({
                name: name,
                dob: dob,
                gender: gender,
                phone: phone,
                email: email,
                password: hashedPassword
            })
            return user.save();
        })
        .then(result => {
            res.redirect('/login/patient');
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getDoctorRegister = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/doctor/register', {
        pageTitle: 'Doctor Register',
        errorMessage: message,
        validationErrors: []
    })
}

exports.postDoctorRegister = (req, res, next) => {
    const name = req.body.name;
    const experience = req.body.experience;
    const gender = req.body.gender;
    const worksIn = req.body.worksIn;
    const state = req.body.state;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).render('auth/doctor/register', {
            pageTitle: 'Patient Login',
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    Doctor.findOne({email: email})
    .then(userDoc => {
        if(userDoc) {
            req.flash('error', 'Email exists already, please pick a different one.');
            return res.redirect('/register/doctor');
        }
        return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new Doctor({
                name: name,
                experience: experience,
                worksIn: worksIn,
                state: state,
                gender: gender,
                phone: phone,
                email: email,
                password: hashedPassword
            })
            return user.save();
        })
        .then(result => {
            res.redirect('/login/doctor');
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        res.redirect('/');
    })
}

exports.getPatientReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset/patient', {
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}

exports.getDoctorReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/reset/doctor', {
        pageTitle: 'Reset Password',
        errorMessage: message
    })
}

exports.postPatientReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset/patient');
        }
        const token = buffer.toString('hex');
        Patient.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset/patient');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
            .then(result => {
                req.flash('success', 'Link to reset password is send to your email address.');
                res.redirect('/login/patient');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'geetaj1978@rediffmail.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:8000/reset/${token}">link</a> to set a new password.</p>
                    `
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
}

exports.postDoctorReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if(err) {
            console.log(err);
            return res.redirect('/reset/doctor');
        }
        const token = buffer.toString('hex');
        Doctor.findOne({email: req.body.email})
        .then(user => {
            if(!user) {
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset/doctor');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save()
            .then(result => {
                req.flash('success', 'Link to reset password is send to your email address.');
                res.redirect('/login/doctor');
                transporter.sendMail({
                    to: req.body.email,
                    from: 'geetaj1978@rediffmail.com',
                    subject: 'Password Reset',
                    html: `
                        <p>You requested a password reset</p>
                        <p>Click this <a href="http://localhost:8000/reset/${token}">link</a> to set a new password.</p>
                    `
                })
            })
            .catch(err => {
                console.log(err);
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
}