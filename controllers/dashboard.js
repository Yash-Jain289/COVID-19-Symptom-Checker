const Comment = require('../models/comments');
const Report = require('../models/reports');

const cor_data = require('novelcovid');
const fetch = require('node-fetch');
const AbortController = require('abort-controller');

const controller = new AbortController();
const signal = controller.signal;

cor_data.settings({
    baseUrl: 'https://disease.sh'
})

const evidence = [];
const ITEMS_PER_PAGE = 3;
let COUNT = 1;
let showToggle = false;

exports.getPatientDashboard = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;
    cor_data.all()
    .then(data => {
        const activeCases = data.active;
        const totalCases = data.cases;
        const recoveredCases = data.recovered;
        const totalDeath = data.deaths;
        Comment.find()
        .countDocuments()
        .then(num => {
            totalItems =  num;
            return Comment.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .sort({_id: -1})
            .limit(ITEMS_PER_PAGE)
            .populate('userId')
        })
        .then(comments => {
            res.render('dashboard/patient', {
                pageTitle: 'Patient Dashboard',
                data: {
                    activeCases: activeCases,
                    totalCases: totalCases,
                    recoveredCases: recoveredCases,
                    totalDeath: totalDeath
                },
                comments: comments,
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            })
        })
        .catch(err => {
            console.log(err);
        })
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getDoctorDashboard = (req, res, next) => {
    res.render('dashboard/doctor', {
        pageTitle: 'Doctor Dashboard'
    })
}

exports.postComments = (req, res, next) => {
    const commentBody = req.body.comment;
    const userId = req.user._id;
    let today = new Date();
    const date = today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate();
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    const comment = new Comment({
        comment: commentBody,
        userId: userId,
        date: date,
        time: time
    });
    comment.save()
    .then(result => {
        res.redirect('/dashboard/patient');
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getChecker = (req, res, next) => {
    const choiceId = req.query.choiceId;
    let count = COUNT;
    if(count != 1) {
        count = req.query.count;
    }
    COUNT = 2;
    let qId;
    let cId;
    if(choiceId) {
        if(!Array.isArray(choiceId)) {
           new_choiceId = [];
           new_choiceId.push(choiceId);
           for(var i = 0; i < new_choiceId.length; i++) {
                var temp = new_choiceId[i].split(',');
                qId = temp[0];
                cId = temp[1];
                evidence.push({
                    "id": cId,
                    "choice_id": qId
                })
            }
        } else {
            for(var i = 0; i < choiceId.length; i++) {
                var temp = choiceId[i].split(',');
                qId = temp[0];
                cId = temp[1];
                evidence.push({
                    "id": cId,
                    "choice_id": qId
                })
            }
        }
    }
    const headers = {
        'App-Id': '11f8d6db',
        'App-Key': '611f70474d01dfc2ab5241ea5e3ed983',
        'Content-Type': 'application/json'
    }
    fetch('https://api.infermedica.com/covid19/diagnosis', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
            "sex": "male",
            "age": 30,
            "evidence": evidence
        })
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        if(data.should_stop.toString() === 'true') {
            let finalResult;
            fetch('https://api.infermedica.com/covid19/triage', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    "sex": "male",
                    "age": 30,
                    "evidence": evidence
                }),
                signal
            })
            .then(response => {
                return response.json();
            })
            .then(result => {
                finalResult = result;
                let today = new Date();
                const date = today.getFullYear() + '/' + today.getMonth() + '/' + today.getDate();
                const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
                const reportResult = result.description;
                const action = result.label;
                const userId = req.user._id;
                const report = new Report({
                    reportResult: reportResult,
                    action: action,
                    date: date,
                    time: time,
                    userId: userId
                });
                report.save()
                .then(info => {
                    Report.find({userId: req.user._id})
                    .then(reports => {
                        res.render('check/check', {
                            pageTitle: 'Symptom Checker',
                            data: finalResult,
                            nextQues: 'true',
                            count: count,
                            reports: reports,
                            showToggle: true,
                        })
                        controller.abort();
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
            })
            .catch(err => {
                res.redirect('/dashboard/patient');
            })
        } else {
            res.render('check/check', {
                pageTitle: 'Symptom Checker',
                data: data,
                nextQues: data.should_stop.toString(),
                count: count,
                reports: [],
                showToggle: showToggle
            })
        }
    })
    .catch(err => {
        console.log(err);
    })
}