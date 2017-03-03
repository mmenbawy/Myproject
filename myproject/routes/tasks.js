var express = require('express');
var router = express.Router();
//router.use(expressValidator())
var student = require('../model/user');
var multer = require('multer');
var upload = multer({ dest: 'client/' });


// Register
router.get('/register', function(req, res) {
    res.render('index', {

        errorsR: null,
        errorR: null,
        errorL: null
    });
});

// Login
router.get('/login', function(req, res) {
    res.render('index', {

        errorL: null,
        errorR: null,
        errorsR: null
    });
});

//view portfolio
router.get('/profile', function(req, res) {

    var id = req.cookies.ID;
    student.getStudentById(id, function(err, student) {

        res.render('profile', { user: student, error: null });
        console.log(student);

    });
});


router.post('/profile/addwork', upload.any(), function(req, res) {

    var workpic = '';
    if (req.files[0]) {
        workpic = req.files[0].filename;
        console.log(req.files[0]);
    }


    var id = req.cookies.ID;



    student.getStudentById(id, function(err, student) {

        req.checkBody('link', 'A proof of work must be provided').notEmpty();
        req.checkBody('repolink', 'A proof of work must be provided').notEmpty();
        var errors = req.validationErrors();



        if (errors.length > 1 && workpic == '') {
            res.render('profile', { user: student, error: errors[0] });
        } else {
            student.portfolio.push({
                name: req.body.workname,
                link: req.body.link,
                repolink: req.body.repolink,
                workpic: workpic
            });
            // console.log(student.portfolio[0].name);
            console.log(student);
            student.save(function(err) {
                //if (err) return handleError(err)
                console.log('Success!');
            });
            res.redirect('/users/profile');
        }
    });
});




router.get('/logout', function(req, res) {
    //clear cookie
    req.logout();
    res.redirect('/');
})

// Register User
router.post('/register', upload.any(), function(req, res) {

    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;
    var faculty = req.body.faculty;
    var dateofbirth = req.body.dateofbirth;

    var profilepic = '';
    if (req.files[0]) {
        profilepic = req.files[0].filename;
        console.log(req.files[0]);
    }


    // validation
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirm', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors);
        res.render('index', { errorsR: errors, errorR: null, errorL: null });
    } else {
        var newStudent = new student({
            name: name,
            email: email,
            username: username,
            password: password,
            faculty: faculty,
            dateofbirth: dateofbirth,
            profilepic: profilepic
        });
        console.log(newStudent);
        student.createStudent(newStudent, function(err, user) {
            if (err) {
                var error = new Error("Already used username");
                console.log(err);
                res.render('index', { errorsR: null, errorR: error, errorL: null });

            } else {
                console.log(user);
                res.cookie('ID', user._id);
                res.redirect('/users/profile');
            }
        });
    }
});

//login
router.post('/login', function(req, res) {
    var username = req.body.inputusername;
    var password = req.body.inputPassword;
    console.log(username);

    student.getStudentByUsername(username, function(err, user) {
        if (err) throw err;
        if (!user) {
            res.render('index', { errorL: 'Unknown User', errorR: null, errorsR: null });
        } else {
            student.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (!isMatch) {
                    res.render('index', { errorL: 'Invalid password', errorR: null, errorsR: null });
                } else {
                    res.cookie('ID', user._id);
                    res.redirect('/users/profile');
                    //{ messages: req.flash('info', 'success') }
                }
            });
        }
    });

});






// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
//router.get('/profile', isLoggedIn, function(req, res) {
//  res.render('profile.ejs', {
//       user: req.user // get the user out of session and pass to template
//   });
//});
module.exports = router;