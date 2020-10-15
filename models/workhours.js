const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const WorkhoursSchema = Schema(
    {
        checkIn = String,
        checOut = String
    }
);

module.exports = mongoose.model("Workhours", WorkhoursSchema);