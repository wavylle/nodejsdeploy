import express from 'express';

const app = express();
const port = 3000;

// Parse JSON bodies for POST requests
app.use(express.json());

// Define a POST endpoint
app.post('/api/posts', (req, res) => {
  // Extract data from the request body
  const { title, content } = req.body;

  // Perform any necessary operations with the data
  // For this example, we simply log the received data
  console.log('Received new post:', { title, content });

  // Send a response
  res.status(201).json({ message: 'Post created successfully!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
