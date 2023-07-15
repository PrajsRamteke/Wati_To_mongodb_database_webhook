const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const port = 3000;


// Configure body-parser middleware to parse request bodies
// app.use(bodyParser.json());

// Connect to MongoDB
// "mongodb://127.0.0.1:27017/webhookdatabase"

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Failed to connect to the database", error);
  });

const Message = mongoose.model("Message", {
  id: String,
  created: Date,
  whatsappMessageId: String,
  conversationId: String,
  ticketId: String,
  text: String,
  type: String,
  data: mongoose.Schema.Types.Mixed,
  timestamp: Date,
  owner: Boolean,
  eventType: String,
  statusString: String,
  avatarUrl: String,
  assignedId: String,
  operatorName: String,
  operatorEmail: String,
  waId: String,
  messageContact: mongoose.Schema.Types.Mixed,
  senderName: String,
  listReply: mongoose.Schema.Types.Mixed,
  replyContextId: mongoose.Schema.Types.Mixed,
});

// Define the webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    // Extract the message from the request body
    const webhookData = req.body;
    
    const newMessage = new Message(webhookData);

    await newMessage.save();

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


// http://localhost:3000/webhook

// {
//     "id": "1a2b3b4d5e6f7g8h9i10j",
//     "created": "2022-10-14T05:53:01.3833674Z",
//     "whatsappMessageId": "abcdefghi_jklmnop",
//     "conversationId": "a1b2c3d4e5f6g7h8i9j10",
//     "ticketId": "m1n2o3p4q5r6s7t8u9v10",
//     "text": "Hello there",
//     "type": "text",
//     "data": null,
//     "timestamp": "1665726781",
//     "owner": false,
//     "eventType": "message",
//     "statusString": "SENT",
//     "avatarUrl": null,
//     "assignedId": "6343c17682538bf08459f5ed",
//     "operatorName": "Wati User",
//     "operatorEmail": "hello@wati.io",
//     "waId": "911234567890",
//     "messageContact": null,
//     "senderName": "wati user",
//     "listReply": null,
//     "replyContextId": null
//   }
  