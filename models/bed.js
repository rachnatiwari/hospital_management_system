const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BedSchema = Schema(
    {
        occupied : {
            covid : 0,
            noncovid : 0,
            icu : 0
        },
        available : {
            covid : 50,
            noncovid : 30,
            icu : 20 
        }
    }
);

module.exports = mongoose.model("Bed", BedSchema);