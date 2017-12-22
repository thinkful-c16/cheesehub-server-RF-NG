'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {PORT, CLIENT_ORIGIN} = require('./config');
// const {dbConnect} = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const CheeseSchema = new mongoose.Schema({
  cheese: {type: String, required: true}
});

let Cheese = mongoose.model('Cheese', CheeseSchema);

CheeseSchema.methods.apiRepr = function() {
  return {
    cheese: this.cheese
  };
};

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.get('/api/cheeses', (req, res)=>{
  return res.json(
    [
      'Bath Blue',
      'Barkham Blue',
      'Buxton Blue',
      'Cheshire Blue',
      'Devon Blue',
      'Dorset Blue Vinney',
      'Dovedale',
      'Exmoor Blue',
      'Harbourne Blue',
      'Lanark Blue',
      'Lymeswold',
      'Oxford Blue',
      'Shropshire Blue',
      'Stichelton',
      'Stilton',
      'Blue Wensleydale',
      'Yorkshire Blue'
    ]
  );
}
);

app.post('/api/cheeses', jsonParser, (req, res) => {
//   const requiredField = 'cheese';
//   if(!(requiredField in req.body)) {
//     const message = `Missing \`${requiredField}\` in request body`;
//     return res.status(400).send(message);
//   }

  Cheese
    .create({
      cheese: req.body.cheese
    })
    .then(newCheese =>{
      console.log(newCheese);
      res.status(201).json(newCheese.apiRepr());
    })
    .catch(err => {
      res.status(500).json({error: 'something went wrong'});
    });
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
//   dbConnect();
  runServer();
}

module.exports = {app};
