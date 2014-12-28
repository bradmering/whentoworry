var mongoose            = require('mongoose');
var Schema              = mongoose.Schema;
var crypto              = require('crypto');

function validatePresenceOf(value) {
    return value && value.length;
  }

// app/models/node.js
var UserSchema   = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    encrypted_password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    email: {
        type: String,
        validate: [validatePresenceOf, 'an email is required'],
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    mobile: {
        type: Number,
        unique: true
    },
    bio: {
        type: String
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date
    },
    trips: [{type: Schema.Types.ObjectId, ref: 'Trip'}]
}, { collection: 'users' });

UserSchema.virtual('id')
    .get(function() {
        return this._id.toHexString();
    });

UserSchema.virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function() { return this._password; });

UserSchema.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
});

UserSchema.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
});

UserSchema.method('encryptPassword', function(password) {
    return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
});

UserSchema.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
        next(new Error('Invalid password'));
    } else {
        next();
    }
});

module.exports = mongoose.model('User', UserSchema);