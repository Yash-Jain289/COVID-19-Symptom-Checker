exports.isAuthPatient = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.redirect('/login/patient');
    }
    next();
}

exports.isAuthDoctor = (req, res, next) => {
    if(!req.session.isLoggedIn) {
        return res.redirect('/login/doctor');
    }
    next();
}