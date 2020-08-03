const express = require('express');

const dashboardController = require('../controllers/dashboard');

const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/patient', isAuth.isAuthPatient, dashboardController.getPatientDashboard);

router.get('/doctor', isAuth.isAuthDoctor, dashboardController.getDoctorDashboard);

router.post('/comments', isAuth.isAuthPatient, dashboardController.postComments);

router.get('/symptom-checker', isAuth.isAuthPatient, dashboardController.getChecker);

module.exports = router;