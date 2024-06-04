const express = require('express');
const {format} = require('date-fns');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
morgan.token('data', (req, res) => {
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

let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (req, res, next) => {
    res.json(data);
});

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    const contact = data.find(d => d.id == id);
    console.log("contact", contact);
    if(!contact)
        {
            return res.status(404).json({error: "contact not found"});
        }
    return res.json(contact);
});

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;
    const contact = data.find(d => d.id == id);

    if(!contact)
        {
            return res.status(404).json({error: "contact not found"});
        }

    data = data.filter(d => d.id != id)
    return res.json(data);
});

app.post('/api/persons', (req, res, next) => {
    const id = Math.random() * 100;
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
    const sameName = data.filter(d => d.name === name);
    if(sameName.length !== 0)
        {
            return res.status(400).json({error: "name must be unique"})
        }
    data.push({id: id, name: name, number: num});
    return res.json({id: id, name: name, number: num});
});

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id;

    const index = data.findIndex(c => c.id == id);
    data[index].number = req.body.number;
    res.json(data[index]);
})
app.get('/info', (req, res, next) => {
    const now = new Date();
    
    const formattedDate = format(now, 'EEEE MMMM do yyyy h:mm:ss:a');
    res.send(`<p>Phonebook has info for ${data.length} people</p><p>${formattedDate}<p/>`)
})

app.listen(3001, () => {
    console.log("Server is running on port 3001")
})