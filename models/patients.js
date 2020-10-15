var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// var Task = require("../models/tasks");
// var Archive = require("../models/archives");
// var Patienthistory = require("../models/patienthistory");
var Test = require("../models/test");
var Patienttreatment = require("../models/patienttreatment");

var PatientSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
    dob : String,
    age : String,
    address : String,
    gender : String,
    bloodgroup : String,
    phone : Number,
    weight : Number,
    insuranceno : String,
    emergencycontact : {
        name:String,
        phone:Number
    },
    allergies : String,
    history : String,
    treatment : {
        admitdate : {
            type : String,
            default : null
        },
        bedNo : Number,
        dischargedate : {
            type : String,
            default : null
        },
        treatedby : {
            type : String,
            default : null
        },
        covidpositive : {
            type : String,
            default : false
        },
        tests : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Test"
            }
        ],
        medicinerecord : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "Patienttreatment"
            }
        ]
    }
});

PatientSchema.plugin(passportLocalMongoose);
 
module.exports = mongoose.model("Patient", PatientSchema);