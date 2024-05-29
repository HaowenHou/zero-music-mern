const { createServer } = require('http');
// const { parse } = require('url');
const next = require('next');
const { Server } = require("socket.io");
const Message = require('./models/Message');

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on('privateMessage', async ({ senderId, receiverId, message }) => {
      await sendMessage(senderId, receiverId, message);
      socket.to(receiverId).emit('newMessage', { senderId, message });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});

async function sendMessage(senderId, receiverId, text) {
  try {
    const newMessage = new Message({
      senderId,
      receiverId,
      message: text
    });

    await newMessage.save();
    console.log('Message saved successfully!');
  } catch (error) {
    console.error('Error saving the message:', error);
  }
}