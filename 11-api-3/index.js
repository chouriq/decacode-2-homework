// index.js
const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const db = require('./db.js');

const pathToJSON = path.resolve(__dirname, 'index.json');

const middleWareJson = (request, response, next) => {
    console.log('Path: ' + request.path);
    response.setHeader('Content-Type', 'application/json');
    next();
};

// Body parser
app.use(bodyParser.json());

// Path logger
app.use(middleWareJson);

// Методы Rest

app.get('/', (req, res) => {
    res.send('WELCOME to the FRIDGE!\nPlease, use REST API');
});

app.get('/items', (req, res) => {
    db.get((json) => res.send(JSON.stringify(json)));
});

app.post('/items', (req, res) => {
    db.save(req.body, (json) => res.send(JSON.stringify(json)));
});

app.delete('/items/:id', (req, res) => {
    db.delete(req.params.id, () => res.send(JSON.stringify({
        result: 'OK'
    })));
});

app.put('/items/:id', (req, res) => {
    db.update(req.params.id, req.body, (json) => res.send(JSON.stringify(json,'',2)));
})

app.listen(port, () => {
    console.log(`App listening on port ${port}!`)
});