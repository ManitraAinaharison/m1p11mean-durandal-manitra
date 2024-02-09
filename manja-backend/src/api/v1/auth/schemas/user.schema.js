const util = require("../../../../util/datatype.util");
const ROLES = util.createEnum(["CUSTOMER", "ADMIN", "EMPLOYEE"]);
const securityUtil = require("../../../../util/security.util");

const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true, min: 1, max: 30 },
  lastname: { type: String, required: true, min: 1, max: 30 },
  username: { type: String, required: true, min: 1, max: 20 },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    required: true,
    validate: {
      validator: (value) => ROLES.includes(value),
    },
  },
  services: [],
  workSchedule: [
    {
      day: Number, // 0 to 6
      schedule: [
        {
          start: { type: Date, required: true },
          end: {
            type: Date,
            required: true,
            // validate: {
            //   validator: function (value) {
            //     // `this` refers to the document being validated
            //     return this.date1 < value;
            //   },
            //   message: "Date2 must be later than Date1",
            // },
          },
        },
      ],
    },
  ],
});

// fire a function before doc saved to db
userSchema.pre("save", async function (next) {
  try {
    this.email = this.email.toLowerCase();
    this.password = securityUtil.hash(this.password);
  } catch (e) {
    console.log(e.message);
    throw new Error("An error occurred on the user password hash:", e.message);
  }
  next();
});

// userSchema.post('save', function (error, doc, next) { // if the email is not unique
//     if (error.name === 'MongoError' && error.code === 11000) {
//         // Duplicate key error (uniqueness constraint)
//         next(new Error('Email must be unique'));
//     } else {
//         // Other errors
//         next(error);
//     }
// });

module.exports.User = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
