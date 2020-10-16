var express               = require("express"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    Patient               = require("./models/patients"),
    Staff                 = require("./models/staff"),
    Inventory             = require("./models/inventory"),
    Bed                   = require("./models/bed");

//SETTING UP DATABASE
// var localmongodburl = "mongodb://localhost:27017/hostipaldb"
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
    failureRedirect: "/login"
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
            username : req.body.username, 
            name : req.body.name,
            dob : req.body.dob,
            age : req.body.age,
            gender : req.body.gender,
            address : req.body.address,
            phone : req.body.mobile,
            joinedOn: req.body.joinedon,
            role : req.body.role,
            department : req.body.department,
        }),req.body.password , function(err,staff){
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
                    res.send("No current user");
                }else{
                    res.send(staff);
                }
            })
        } else{
            res.send(patient);
        }
    });
});
//-------------- Uncomment to create an instance of beds ------------------
// app.get("/createbeds", function(req,res){
//     Bed.create({}, function(err,bed){
//         if(err)
//             console.log(err)
//         else
//             res.redirect("/api/bedoccupancy");
//     })
// })

app.get("/api/bedoccupancy", function(req,res){
    Bed.find({},function(err,beds){
        if(err){
            res.send("cant show bed");
        }else{
            res.send(beds);
        }
    })
})

//-------------- Uncomment to create an instance of inventory ------------------
// app.get("/createinventory", function(req,res){
//     Inventory.create({}, function(err,items){
//         if(err)
//             console.log(err)
//         else
//             res.redirect("/api/inventory");
//     })
// })

app.get("/api/inventory", function(req,res){
    Inventory.find({},function(err,items){
        if(err){
            res.redirect("/login");
        }else{
            res.send(items);
        }
    })
});

app.get("/inventory/add", function(req,res){
    Inventory.find({},function(err,items){
        if(err){
            res.send("cant add to inventory");
        }else{
            res.render("edit_inven",{items:items, act:"add"});
        }
    })
})

app.post("/inventory/add", function(req,res){
    Inventory.find({},function(err,items){
        if(err){
            res.send("something wrong");
        }else{
    if(req.body.item=="gloves"){
        Inventory.findOneAndUpdate({} ,{ "gloves" : items[0].gloves+Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="testingkit"){
        Inventory.findOneAndUpdate({} ,{ "testingkit" : items[0].testingkit+Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="syringes"){
        Inventory.findOneAndUpdate({} ,{ "syringes" : items[0].syringes+Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="salinebottles"){
        Inventory.findOneAndUpdate({} ,{ "salinebottles" : items[0].salinebottles+Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="masks"){
        Inventory.findOneAndUpdate({} ,{ "masks" : items[0].masks+Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else{
        Inventory.findOneAndUpdate({} ,{ "ppekits" : items[0].ppekits+Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }
    }
    })
})

app.get("/inventory/remove", function(req,res){
    Inventory.find({},function(err,items){
        if(err){
            res.send("cant remove inventory");
        }else{
            res.render("edit_inven",{items:items, act:"delete"});
        }
    })
})

app.post("/inventory/remove", function(req,res){
    Inventory.find({},function(err,items){
        if(err){
            res.send("something wrong");
        }else{
    if(req.body.item=="gloves"){
        Inventory.findOneAndUpdate({} ,{ "gloves" : items[0].gloves-Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="testingkit"){
        Inventory.findOneAndUpdate({} ,{ "testingkit" : items[0].testingkit-Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="syringes"){
        Inventory.findOneAndUpdate({} ,{ "syringes" : items[0].syringes-Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="salinebottles"){
        Inventory.findOneAndUpdate({} ,{ "salinebottles" : items[0].salinebottles-Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else if(req.body.item=="masks"){
        Inventory.findOneAndUpdate({} ,{ "masks" : items[0].masks-Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }else{
        Inventory.findOneAndUpdate({} ,{ "ppekits" : items[0].ppekits-Number(req.body.value)},function(err,result){
            if(err){
                console.log(err)
            }else{
                res.redirect("/api/inventory");
        }
        })
    }
    }
    })
})

app.get("/inventory", function(req,res){
    Inventory.find({},function(err,items){
        if(err){
            res.redirect("/login");
        }else{
            res.render("invendisplay",{items:items});
        }
    })
})

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