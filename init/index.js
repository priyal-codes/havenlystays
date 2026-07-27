const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const path = require("path");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

const MONGO_URL = process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/havenly_stays";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const User = require("../models/user.js");

const initDB = async() => {
    await Listing.deleteMany({});

    let adminUser = await User.findOne({ username: "havenly_admin" });
    if (!adminUser) {
        adminUser = await User.register(
            new User({ email: "admin@havenlystays.com", username: "havenly_admin" }),
            "admin123"
        );
    }

    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: adminUser._id
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized with valid owner ID");
};

initDB();