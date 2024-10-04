const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/authtestapp`)
.then(()=> console.log('Mongo Connected')
)

const userSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String,
    age: Number
})

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
