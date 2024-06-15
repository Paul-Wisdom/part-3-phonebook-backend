const mongoose = require('mongoose'); //install
require('dotenv').config() // install

if(process.argv.length < 3)
    {
        process.exit(1);
    }
const password = process.argv[2];
const url = `mongodb+srv://wisdomp837:${password}@fullstack.dn0bltt.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=fullstack`; //add url
mongoose.set('strictQuery', false);
mongoose.connect(url);
const contactSchema = new mongoose.Schema({
    name: String,
    number: String
});
const Contact = mongoose.model('Contact', contactSchema);
if(process.argv.length == 3)
    {
        console.log("Phonebook:");
        Contact.find({}).then(contacts => {
            if(contact.length == 0){
                console.log("No content")
            }
            else{
                contacts.forEach(contact => {
                console.log(`${contact.name} ${contact.number}`);        
            });
            }
        mongoose.connection.close();
        }).catch(err => {
            console.log(err);
        })
    }
else if(process.argv.length == 5)
    {
        const name = String(process.argv[3]);
        const number = String(process.argv[4]);

        const contact = new Contact({name: name, number: number});
        contact.save().then(result => {
            console.log(`added ${result.name} number ${result.number} to phonebook`);
            mongoose.connection.close();
        }).catch(err => {
            console.log(err);
        })
    }
    else{
        console.log("InvalidFormat");
        mongoose.connection.close();
    }

