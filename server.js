// const express = require('express');
// const serverless = require('serverless-http');

import { paConvInit } from "./paconvllm.js"

import serverless from 'serverless-http';

import express from 'express';
import res from "express/lib/response.js";

const app = express();
const router = express.Router();

let records = [];

app.use(express.json())

//Get all students
app.get('/', (req, res) => {
  res.send('App is running..');
});
  
// app.get("/async", (req, res) => {
//   (async () => {
//       var getData = await main()
//       res.send(getData);
//   })()
// })

//Create new record
app.post('/add', (req, res) => {
  (async () => {    
    const { file_url, question } = req.body;
    
    const retData = await paConvInit(file_url, question)
    
    res.send(retData);
  })()
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

const port = 5000

app.listen(port, () => {
  console.log(`Server is working on port ${port}`);
})