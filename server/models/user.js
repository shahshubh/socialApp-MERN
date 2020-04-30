const mongoose = require('mongoose');
const { v1: uuidv1 } = require('uuid');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    hashed_password: {
        type: String,
        required: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date
});

//virtual field
userSchema.virtual('password')
.set(function(password){
    //create temp var _password
    this._password = password;
    //generate a timestamp
    this.salt = uuidv1();
    // encrypt password
    this.hashed_password = this.encryptPassword(password);
})
.get(function(){
    return this._password;
})


//methods
userSchema.methods = {
    encryptPassword: function(password){
        if(!password) return "";
        try{
            return crypto.createHmac('sha1',this.salt)
                    .update(password)
                    .digest('hex')
        } catch(err){
            return ""
        }
    }
}



module.exports = mongoose.model("User", userSchema);