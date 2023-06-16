// const express = require('express');
// const serverless = require('serverless-http');

import express from 'express';
import serverless from 'serverless-http';

const app = express();
const router = express.Router();

// import { testRetFunc } from './apicopy.js'

let records = [];

//Get all students
app.get('/', (req, res) => {
  res.send('App is running..');
});

//Create new record
app.post('/add', (req, res) => {
  res.send('New record added.');
});

//delete existing record
app.delete('/', (req, res) => {
  res.send('Deleted existing record');
});

//updating existing record
app.put('/', (req, res) => {
  res.send('Updating existing record');
});

//showing demo records
app.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
  ]);
});

// app.use('/.netlify/functions/api', router);
// export const handler = serverless(app);

const port = 8000

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
})