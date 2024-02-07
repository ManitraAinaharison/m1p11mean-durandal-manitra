const util = require('../../../../util/datatype.util')
const ROLES = util.createEnum(["USER" , "ADMIN" , "EMPLOYEE"]);

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
            required: true
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
userSchema.pre('save', async function(next) {
  // const salt = await bcrypt.genSalt();
  // this.password = await bcrypt.hash(this.password, salt);
  // next();
});

module.exports.User = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;