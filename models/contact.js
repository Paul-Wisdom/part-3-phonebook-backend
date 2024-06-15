const mongoose = require('mongoose'); //install
require('dotenv').config() // install

const url = process.env.MONGODB_URL;
mongoose.set('strictQuery', false);
console.log("connecting to", url);
mongoose.connect(url).then(result => {
    console.log('connected to MongoDB')
}).catch(err => {
    console.log("error connecting to MongoDB",err.message)
});
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(num){
                return num.indexOf('-') == 3 || num.indexOf('-') == 2;
            },
            message:"number must be of the format xxx-xxxxxx or xx-xxxxxx"
        }
    }
});

contactSchema.set('toJSON', {
    transform:(document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject._v;

    }
})
module.exports = mongoose.model('Contact', contactSchema);