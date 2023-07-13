/** @format */

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Configure body-parser middleware to parse request bodies
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/webhookdatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected.......Database....");
  })
  .catch((error) => {
    console.error("Not Connected..........", error);
  });

const Message = mongoose.model("Message", {
  id: String,
  text: String,
  data: String,
  timestamp: Date,
});

// Define the webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    // Extract the message from the request body
    const message = req.body;

    const newMessage = new Message({
      id: message.id,
      text: message.text,
      data: message.data,
      timestamp: new Date(message.timestamp),
    });

    await newMessage.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:3000 or ${port}`);
});

// http://localhost:3000/webhook
// {
//     "id": "1",
//     "text": "Hello, world!",
//     "data": "Some data",
//     "timestamp": "2023-07-12T12:00:00Z"
//   }
