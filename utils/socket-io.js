let io;

const connectSockerServer = (server) => {
  const socketIo = require("socket.io");
  // io = socketIo(server);
  io = socketIo(server, {
    cors: {
      origin: ['http://localhost:4200', 'https://qrrestaux.onrender.com','http://localhost:7000','https://qr-dashbord.vercel.app','http://localhost:8100'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Configurez Socket.io ici
  io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté : ", socket.id);

    socket.on("disconnect", () => {
      console.log("Un utilisateur est déconnecté");
    });
  });

  return server;
};

const sendNotification = (message) => {
  console.log("sending message : ", message);
  io.emit("notification", message);
};


module.exports = { connectSockerServer, sendNotification };
