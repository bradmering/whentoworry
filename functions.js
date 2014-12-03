// functions.js/
var bcrypt = require('bcryptjs'),
    Q = require('q'); //config.db holds Orchestrate token

//used in local-signup strategy
exports.localReg = function (username, password) {
    var deferred = Q.defer();
    var hash = bcrypt.hashSync(password, 8);
    var user = {
        "username": username,
        "password": hash,
        "avatar": "http://placepuppy.it/images/homepage/Beagle_puppy_6_weeks.JPG"
    }
    var users = db.get('users');
    
    //check if username is already assigned in our database
    users.findOne({ username: username }).on('success', function (doc) {
        console.log('username already exists');
        deferred.resolve(false); //username already exists
    }).on('error',function (result) {//case in which user does not already exist in db
        console.log(result.body);
        if (result.body.message == 'The requested items could not be found.'){
            console.log('Username is free for use');
            users.insert(user).on('success', function (doc) {
                    console.log("USER: " + user);
                    deferred.resolve(user);
            })
            .on('error',function (err) {
                console.log("PUT FAIL:" + err.body);
                deferred.reject(new Error(err.body));
            });
        } else {
            deferred.reject(new Error(result.body));
        }
    });
    return deferred.promise;
};

//check if user exists
//if user exists check if passwords match (use bcrypt.compareSync(password, hash); // true where 'hash' is password in DB)
//if password matches take into website
//if user doesn't exist or password doesn't match tell them it failed
exports.localAuth = function (username, password) {
    var deferred = Q.defer();

    db.get('local-users', username)
        .then(function (result){
            console.log("FOUND USER");
            var hash = result.body.password;
            console.log(hash);
            console.log(bcrypt.compareSync(password, hash));
            if (bcrypt.compareSync(password, hash)) {
                deferred.resolve(result.body);
            } else {
                console.log("PASSWORDS NOT MATCH");
                deferred.resolve(false);
            }
    }).fail(function (err){
        if (err.body.message == 'The requested items could not be found.'){
            console.log("COULD NOT FIND USER IN DB FOR SIGNIN");
            deferred.resolve(false);
        } else {
            deferred.reject(new Error(err));
        }
    });
    return deferred.promise;
}