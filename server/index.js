// Import the required modules
const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
require('dotenv').config(); // Optional: to use environment variables

// Create an instance of an Express application
const app = express();
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define a port to run the server on
const port = process.env.PORT || 3000;

// MongoDB connection string
const uri = "mongodb://localhost:27017/";

// Create a MongoClient instance
const client = new MongoClient(uri);

// Function to connect to the database and perform operations
async function main() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();
        console.log("Connected to MongoDB");

        // Get a reference to the database and collection
        const database = client.db("ENTRY02");
        const collection = database.collection("names");

        // Serve the HTML form
        app.get('/', (req, res) => {
            res.sendFile(__dirname + '/index.html');
        });

        // Handle POST requests to insert a new document
        app.post('/add-student', async (req, res) => {
            try {
                const newStudent = { name: req.body.name };
                await collection.insertOne(newStudent);
                res.send("Student added successfully!");
            } catch (error) {
                res.status(500).send("Error adding student to MongoDB");
            }
        });

        // Start the server and listen on the specified port
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

// Call the main function to connect to the database and start the server
main().catch(console.error);
