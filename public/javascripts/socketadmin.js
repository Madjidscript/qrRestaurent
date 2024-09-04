console.log("gggggjgjjjjgjgjgj");
document.addEventListener("DOMContentLoaded", (event) => {
  const socket = io("https://qrrestaux.onrender.com");

  socket.on("connect", () => {
    console.log("socket coonected");

    socket.on("notification", (data) => {
      console.log("monstocket", data);
      const audio = document.getElementById("notificationSound");
      if (audio) {
        audio.play().catch(function(error) {
            console.error('Erreur lors de la lecture :', error);
        });
      }
    //   alert(data.message);
    });
  });
});
