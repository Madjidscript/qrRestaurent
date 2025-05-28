let io;

const connectSockerServer = (server) => {
  const socketIo = require("socket.io");
  // io = socketIo(server);
  io = socketIo(server, {
    cors: {
      origin: ['http://localhost:4200', 'https://qrrestaux.onrender.com','http://localhost:7000','http://localhost:3000','https://qr-dashbord.vercel.app','http://localhost:8100','https://restaux-mmds.vercel.app','http://localhost:40489'],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Configurez Socket.io ici
  io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté : ", socket.id);

    // Écoute la demande d'un serveur
    socket.on("demande_serveur", (data) => {
      console.log("Demande de serveur reçue :", data);

      const msg = {
        type: "info",
        texte: "OK, vous recevrez un serveur dans un instant.",
        numeroTable: data?.numeroTable || "inconnue",
        timestamp: new Date()
      };

      // Répondre uniquement à l'utilisateur
      socket.emit("retourdemande", msg);

      // (Optionnel) Notifier tous les admins
      io.emit("notification", {
        type: "demande_serveur",
        clientId: socket.id,
        table: data?.numeroTable,
        message: `cher  admin demande de serveur a la table ${data?.numeroTable}`
      });
    });






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
