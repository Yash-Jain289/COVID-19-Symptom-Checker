const express = require('express');
const {check, body} = require('express-validator/check');

const Patient = require('../models/patient');
const Doctor = require('../models/doctor');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login/patient', authController.getPatientLogin);

router.post('/login/patient', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({min: 8})
        .trim(),    
], authController.postPatientLogin);

router.get('/register/patient', authController.getPatientRegister);

router.post('/register/patient', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .custom((value, {req}) => {
            return Patient.findOne({email: value})
            .then(userDoc => {
                if(userDoc) {
                    return Promise.reject('Email exists already, please pick a different one.')
                }
            })
        })
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({min: 8})
        .trim(),    
    body('confirmPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
    body('phone', 'Phone number has to be valid')
        .isMobilePhone()
        .trim(),
    body('dob', 'Please choose your date of birth')
        .not()
        .isEmpty(),
    body('name', 'Please fill all the details')
        .not()
        .isEmpty()
], authController.postPatientRegister);

router.get('/login/doctor', authController.getDoctorLogin);

router.post('/login/doctor', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({min: 8})
        .trim(),    
], authController.postDoctorLogin);

router.get('/register/doctor', authController.getDoctorRegister);

router.post('/register/doctor', [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .custom((value, {req}) => {
            return Patient.findOne({email: value})
            .then(userDoc => {
                if(userDoc) {
                    return Promise.reject('Email exists already, please pick a different one.')
                }
            })
        })
        .normalizeEmail(),
    body('password', 'Password has to be valid.')
        .isLength({min: 8})
        .trim(),    
    body('confirmPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password) {
                throw new Error('Passwords have to match');
            }
            return true;
        }),
    body('phone', 'Phone number has to be valid')
        .isMobilePhone()
        .trim(),
    body('experience', 'Please enter a valid experience')
        .isNumeric(),
    body('worksIn', 'Please fill all the fields') 
        .not()
        .isEmpty(),
    body('state', 'Please fill all the fields')
        .not()
        .isEmpty(),
    body('name', 'Please enter all the fields')
        .not()
        .isEmpty()
], authController.postDoctorRegister);

router.post('/logout', authController.postLogout);

router.get('/reset/patient', authController.getPatientReset);

router.post('/reset/patient', authController.postPatientReset);

router.get('/reset/doctor', authController.getDoctorReset);

router.post('/reset/doctor', authController.postDoctorReset);

module.exports = router;