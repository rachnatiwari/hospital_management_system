const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkhourSchema = Schema(
    {
        checkIn = String,
        checOut = String
    }
);

module.exports = mongoose.model("Workhour", WorkhourSchema);