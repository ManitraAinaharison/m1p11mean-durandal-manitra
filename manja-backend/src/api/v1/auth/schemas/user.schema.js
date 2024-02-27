const util = require("../../../../util/datatype.util");
const ROLES = util.createEnum(["CUSTOMER", "MANAGER", "EMPLOYEE"]);
const securityUtil = require("../../../../util/security.util");
const apiUtil = require("../../../../util/api.util");

const mongoose = require("mongoose");

const options = { discriminatorKey: 'role' };

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true, min: 1, max: 30 },
    lastname: { type: String, required: true, min: 1, max: 30 },
    username: { type: String, required: true, min: 1, max: 20 },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true }
}, options);

const customerSchema = new mongoose.Schema({

});

const employeeSchema = new mongoose.Schema({
    subServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'SubService' }],
    workSchedule: [
        {
            day: Number,
            schedule: [
                {
                    start: { type: Date, required: true },
                    end: { type: Date, required: true }
                }
            ]
        }
    ]
});

const managerSchema = new mongoose.Schema({

});

userSchema.pre("save", async function (next) {
    try {
        this.email = this.email.toLowerCase();
        this.password = securityUtil.hash(this.password);
    } catch (e) {
        console.log(e.statusCode, e.message);
        throw new Error("An error occurred on the user password hash:", e.message);
    }
    next();
});


userSchema.post('save', function(error, doc, next) {
    console.log(error.name);
    if (error.name === 'MongoServerError' && error.code === 11000) {
        let errorMessage = "";
        if (error.keyValue.email) {
            errorMessage = `L'email «${error.keyValue.email}» est déjà pris par un autre utilisateur.`;
        }
        throw apiUtil.ErrorWithStatusCode(errorMessage, 500);
    } else {

    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports.User = User;
module.exports.Customer = User.discriminator('Customer', customerSchema, ROLES.CUSTOMER);
module.exports.Employee = User.discriminator('Employee', employeeSchema, ROLES.EMPLOYEE);
module.exports.Manager = User.discriminator('Manager', managerSchema, ROLES.MANAGER);

module.exports.ROLES = ROLES;
