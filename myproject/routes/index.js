var express = require('express');
var router = express.Router();
var student = require('../model/user');


// Get Homepage
router.get('/', function(req, res) {



    student.find(function(err, students) {

        if (err)
            res.send(err.message);
        else
            res.render('index', {
                students: students,
                errorL: null,
                errorR: null,
                errorsR: null
            });
    })

});

router.get('/viewAll', function(req, res) {



    student.find(function(err, students) {

        if (err)
            res.send(err.message);
        else
            res.render('Allportfolio', { students });
    })


});


//router.post('/', function(req, res) {
//  res.redirect('/users/register');
//});

//router.post('/', function(req, res) {
//  res.redirect('/users/login');
//});



module.exports = router;