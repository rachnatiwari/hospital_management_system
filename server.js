var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Patient               = require("./models/patients"),
    Staff                 = require("./models/staff");

//SETTING UP DATABASE
var mongodburl = "mongodb+srv://covid_cluster_user:randomlygenerated@covidpatients.cf3et.mongodb.net/covidPatients?retryWrites=true&w=majority"
mongoose.connect(mongodburl, { useNewUrlParser: true, useUnifiedTopology: true });
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//AUTHENTICATION SETUP
app.use(require("express-session")({
    secret: "Some_random_key",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(Patient.authenticate()));
passport.serializeUser(Patient.serializeUser());
passport.deserializeUser(Patient.deserializeUser());

// Passing in the current user in every page
// app.use(function(req, res, next){
//     res.locals.currentPatient = req.patient;
//     next();
// });

var currentPatient_id;
// Routes setup
app.get("/", function(req,res){
    res.redirect("/login");
})

app.get("/login", function(req,res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/api/currentuser",
    failureRedirect: "/patients/login"
}) ,function(req, res){
});


app.get("/signup/patients", function(req,res){
    res.render("patient_signup");
})

app.post("/signup/patients",function(req,res){
    Patient.register(new Patient({
            username : req.body.username , 
            name : req.body.name,
            dob : req.body.dob,
            age : req.body.age,
            gender : req.body.gender,
            bloodgroup : req.body.blood,
            phone : req.body.mobile,
            weight : req.body.weight,
            insuranceno : req.body.insurance,
            emergencycontact : {
                name : req.body.emergencyname,
                phone : req.body.emergencynumber
            },
            allergies : req.body.allergy,
            history : req.body.patienthistory,
        }),req.body.password , function(err,patient){
        if(err){
            console.log(err);
            res.redirect('/signup/patients');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect("/api/currentuser");
        });
    });
});

app.get("/signup/staff", function(req,res){
    res.render("staff_signup");
});

app.post("/signup/staff",function(req,res){
    Staff.register(new Staff({
            username : req.body.username , 
            name : req.body.name,
            dob : req.body.dob,
            age : req.body.age,
            gender : req.body.gender,
            address : req.body.address,
            phone : req.body.mobile,
            joinedOn: req.body.joinedon,
            role : req.body.role,
            department : req.body.department,
        }),req.body.password , function(err,patient){
        if(err){
            console.log(err);
            res.redirect('/signup/staff');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect("/api/currentuser");
        });
    });
});

app.get("/api/currentuser", isLoggedIn, function(req,res){
    Patient.findById(req.user._id, function(err, patient){
        if(err){
            Staff.findById(req.user._id, function(err, staff){
                if(err){
                    res.redirect("/login");
                }else{
                    res.send(staff);
                }
            })
        } else{
            res.send(patient);
        }
    });
});

app.get("/logout" , function(req,res){
    req.logout();
    res.redirect("/");
});

//Middleware
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/");
}

app.listen(5000, () => console.log(`Server is running!!!`))