import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import { updatePinecone } from "./updatePinecone.js";

import { Document } from "langchain/document";

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { loadQAStuffChain } from "langchain/chains";
import express from 'express';
import res from "express/lib/response.js";
import serverless from 'serverless-http';

dotenv.config();

const indexName = "nodejs-index";

const client = new PineconeClient();
await client.init({
  apiKey: process.env.PINECONE_API_KEY,
  environment: process.env.PINECONE_ENVIRONMENT,
});

async function fetchTextData(file_url) {
  console.log("Fetching text data...");
 await fetch(file_url)
  .then(response => response.text())
  .then(data => {
      // Here, 'data' variable contains the contents of the text file
    console.log("DATA: ", data);
    return data
  })
}


export async function paConvInit(file_url, question) {
    console.log("GOT HERE");
    const loader = new DirectoryLoader(`./documents/datafolder`, {
        ".txt": (path) => new TextLoader(path),
        ".pdf": (path) => new PDFLoader(path),
    });
  
    const docs = await loader.load();
  
  // var docs = ''
  //     await fetch(file_url)
  //     .then(response => response.text())
  //       .then(data => {
  //       docs = data
  //       // Here, 'data' variable contains the contents of the text file
  //       console.log("DATA 2: ", data);
  //     })

      // const docs = await fetchTextData(file_url)
    console.log("Docs: ", docs);

    await updatePinecone(client, indexName, docs, file_url);
    var myData = await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);

    return myData
}

const queryPineconeVectorStoreAndQueryLLM = async (
    client,
    indexName,
    question
  ) => {
  // 3. Start query process
    console.log("Querying Pinecone vector store...");
  // 4. Retrieve the Pinecone index
    const index = client.Index(indexName);
  // 5. Create query embedding
    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(question);
  // 6. Query Pinecone index and return top 10 matches
    let queryResponse = await index.query({
      queryRequest: {
        topK: 10,
        vector: queryEmbedding,
        includeMetadata: true,
        includeValues: true,
      },
    });
  // 7. Log the number of matches 
    console.log(`Found ${queryResponse.matches.length} matches...`);
  // 8. Log the question being asked
    console.log(`Asking question: ${question}...`);
    if (queryResponse.matches.length) {
  // 9. Create an OpenAI instance and load the QAStuffChain
      const llm = new OpenAI({});
      const chain = loadQAStuffChain(llm);
  // 10. Extract and concatenate page content from matched documents
      const concatenatedPageContent = queryResponse.matches
        .map((match) => match.metadata.pageContent)
        .join(" ");
  // 11. Execute the chain with input documents and question
      const result = await chain.call({
        input_documents: [new Document({ pageContent: concatenatedPageContent })],
        question: question,
      });
  // 12. Log the answer
      return `${result.text}`;
    } else {
  // 13. Log that there are no matches, so GPT-3 will not be queried
        return `There was an error from our end. We will get on it ASAP! :(`
    }
  };