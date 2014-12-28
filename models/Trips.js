// app/models/node.js
var mongoose            = require('mongoose');
var Schema       = mongoose.Schema;
var TripSchema   = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    name: {
        type:       String,
        required:   true
    },
    description: {
        type:       String
    },
    created:{
        type:       Date,
        default:    Date.now
    },
    updated:{
        type:       Date
    },
    departure: {
        type:       Date
    },
    expected:{
        type:       Date
    },
    checkin:{
        type:       Boolean
    },
    checkinTime:{
        type:       Date
    },
    alertFirst:{
        type:       Boolean
    },
    alertFirstTime:{
        type:       Date
    },
    alertSecond:{
        type:       Boolean
    },
    alertSecondTime:{
        type:       Date
    },
    generalItinary:{
        type:       String,
        required:   true
    },
    waypoints:[
        {
            name:       { type: String },
            lon:        { type: String },
            lat:        { type: String },
            description:{ type: String },
            expected:   { type: Date }
        }
    ],
    contacts: [
        {
            name:       { type: String },
            phone:      { type: String },
            email:      { type: String },
            prefered:   { type: Boolean },
            canClear:   { type: Boolean }
        }
    ],
    emergancyContacts: {
        type: String
    }
}, { collection: 'trips' });

module.exports = mongoose.model('Trip', TripSchema);