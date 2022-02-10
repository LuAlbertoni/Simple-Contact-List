const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost/contact', { useNewUrlParser: true });

const contactSchema = new mongoose.Schema({
    name: String,
    number: Number
});

const Contact = mongoose.model('Contact', contactSchema)

mongoose.connection.on('connected', () => {
    console.log('Banco de dados conectado');
    app.listen(3000, () => {
        console.log('Servidor iniciado na porta 3000');
    });
});

app.use(express.static(path.join(__dirname, '/build')));

app.post('/add', (req, res) => {
    // Criar novo schema
    const { name, number } = req.body;

    console.log(name, number);

    const contact = Contact.create({
        name,
        number
    });

    res.send(contact);
});

app.get('/list', (req, res) => {
    // Listar todos os contatos
    Contact.find({}, (err, contacts) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(contacts);
        }
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/build', 'index.html'));
});