const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");
var Workhours = require("../models/workhours");

const StaffSchema = Schema(
    {
        name : String,
        username : String,
        password : String,
        dob : String,
        age : Number,
        gender : String,
        address : String,
        phone : Number,
        relievedOn : {
            type : String,
            default : null
        },
        joinedOn : String,
        role: String, 
        isAdmin : {
            type : Boolean,
            default : false
        },
        department: String,
        workHours :[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Workhours"
            }
        ]
    }
);

PatientSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Staff", StaffSchema);