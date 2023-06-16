// const express = require('express');
// const serverless = require('serverless-http');

import serverless from 'serverless-http';

import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as dotenv from "dotenv";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
// import { queryPineconeVectorStoreAndQueryLLM } from "./queryPineconeAndQueryGPT.js";
import express from 'express';
import res from "express/lib/response.js";

const app = express();
const router = express.Router();

// import { testRetFunc } from './apicopy.js'

let records = [];

//Get all students
app.get('/', (req, res) => {
  res.send('App is running..');
});

// Async test
async function fetchData() {
    // Simulating an asynchronous operation with a delay
    await new Promise((resolve) => setTimeout(resolve, 5000));
  
    // Returning a value
    return 'Data fetched!';
  }
  
  async function main() {
    try {
      const result = await fetchData();
      console.log("Here");
      return result;
    } catch (error) {
      return 'An error occurred:' + error;
    }
  }
  
app.get("/async", (req, res) => {
  (async () => {
      var getData = await main()
      res.send(getData);
  })()
})

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