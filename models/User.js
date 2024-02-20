const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email : {
        type: String,
        required: [true,'Please enter the Email'],
        unique: true,
        lowercase: true,
        validate:[isEmail, 'Please enter a valid Email']
    },
    password : {
        type: String,
        required: [true,'Please enter the Password'],
        minlength: [6,'Password must be of atleast 6 chars long']
    },
});


userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email: email});
    if(user){
        const auth = await bcrypt.compare(password, user.password);
        if(auth){
            return user;
        }
        throw Error('Incorrect Password');
    }
    throw Error('Incorrect Email');
}

const User = mongoose.model('user',userSchema);

module.exports = User;