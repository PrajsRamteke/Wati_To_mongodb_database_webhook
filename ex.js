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
  .connect("mongodb://127.0.0.1:27017/mydatabase", {
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
  eventType: String,
  id: String,
  whatsappMessageId: String,
  templateId: String,
  templateName: String,
  created: Date,
  conversationId: String,
  ticketId: String,
  text: String,
  operatorEmail: String,
  waId: String,
  type: String,
  statusString: String,
  sourceType: String,
  timestamp: String,
  assigneeId: String,
});

// Define the webhook endpoint
app.post("/webhook", async (req, res) => {
  try {
    const { eventType, id } = req.body;

    if (eventType === "templateMessageSent") {
      // Handle templateMessageSent event
      const {
        whatsappMessageId,
        templateId,
        templateName,
        created,
        conversationId,
        ticketId,
        text,
        operatorEmail,
        waId,
        type,
        statusString,
        sourceType,
      } = req.body;

      const newMessage = new Message({
        eventType,
        id,
        whatsappMessageId,
        templateId,
        templateName,
        created: new Date(created),
        conversationId,
        ticketId,
        text,
        operatorEmail,
        waId,
        type,
        statusString,
        sourceType,
      });

      await newMessage.save();
    } else if (
      eventType === "sentMessageDELIVERED" ||
      eventType === "sentMessageREAD" ||
      eventType === "sentMessageREPLIED"
    ) {
      // Handle sentMessageDELIVERED, sentMessageREAD, and sentMessageREPLIED events
      const {
        whatsappMessageId,
        conversationId,
        ticketId,
        text,
        type,
        timestamp,
        assigneeId,
        operatorEmail,
      } = req.body;

      const newMessage = new Message({
        eventType,
        id,
        whatsappMessageId,
        conversationId,
        ticketId,
        text,
        type,
        timestamp,
        assigneeId,
        operatorEmail,
      });

      await newMessage.save();
    }

    // Send a success response
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    // Send an error response
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:3000 or ${port}`);
});
