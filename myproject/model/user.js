var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var query = require('mongo-query');


var work = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    link: {
        type: String,
    },
    repolink: {
        type: String,
    },
    workpic: String

});

// student schema
var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    faculty: {
        type: String
    },
    dateofbirth: {
        type: String
    },
    portfolio: [work],

    profilepic: String

});


//the schema is useless untill 
//creating a model using it
var student = module.exports = mongoose.model('student', userSchema);



module.exports.createStudent = function(newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    })
}

module.exports.getStudentByUsername = function(username, callback) {
    student.findOne({ username: username }, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
        // isMatch=true;
    });
}

module.exports.getStudentById = function(id, callback) {
    student.findById(id, callback);
}