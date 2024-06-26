const express = require('express');
const {format} = require('date-fns');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv').config()

const Contact = require('./models/contact');

const port = process.env.PORT || 3001;

morgan.token('data', (req) => {
    if(req.method === 'POST' || req.method === 'PUT')
        {
            return JSON.stringify(req.body);
        }
    return ' ';
})

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'));
app.use(express.json());

// let data = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ];

app.get('/api/persons', (req, res, next) => {
    // res.json(data);
    Contact.find({}).then(contacts => {
       return res.json(contacts);
    }).catch(err => {
        console.log(err);
        next(err);
    })
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    // const contact = data.find(d => d.id == id);
    // console.log("contact", contact);
    Contact.findById(id).then(contact => {
        if(!contact)
            {
                return res.status(404).json({error: "contact not found"});
            }
        return res.json(contact);
    }).catch(err => {
        console.log(err);
        next(err);
    })
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    // const contact = data.find(d => d.id == id);

    Contact.findByIdAndDelete(id).then(result => {
        console.log(result)
       return res.status(204).end();
    }).catch(err => {
        console.log(err);
        next(err);
    })
});

app.post('/api/persons', (req, res, next) => {
    // const id = Math.random() * 100;
    const name = req.body.name;
    const num = req.body.number;

    if(!name)
        {
            return res.status(400).json({error: "name is missing"})
        }
        
    if(!num)
        {
            return res.status(400).json({error: "number is missing"})
        }
    const contact = new Contact({name: name, number: num});
    contact.save().then(result => {
        return res.json(result);
    }).catch(err => {
        console.log(err);
        next(err);
    })
});

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const newNumber = req.body.number;
    Contact.findByIdAndUpdate(id, {number: newNumber}, {new: true, runValidators: true, context: 'query'}).then(result => {
        return res.json(result);
     }).catch(err => {
         console.log(err);
         next(err);
     })
})
app.get('/info', (req, res, next) => {
    const now = new Date();
    
    const formattedDate = format(now, 'EEEE MMMM do yyyy h:mm:ss:a');
    Contact.find({}).then(contacts => {
        const numOfContacts = contacts.length;
        return res.send(`<p>Phonebook has info for ${numOfContacts} people</p><p>${formattedDate}<p/>`)
     }).catch(err => {
         console.log(err);
         next(err);
     })
})
const unknownEndPoint = (req, res) => {
    res.status(404).send({error: "Unknown Endpoint"});
}
const errorHandler = (error, req, res, next) => {
    if(error.name === 'CastError'){
        return res.status(400).send({error: "malformed id"});
    }
    if(error.name === 'ValidationError'){
        return res.status(400).send({error: error.message});
    }
    next(error);
}
app.use(errorHandler);
app.use(unknownEndPoint);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})