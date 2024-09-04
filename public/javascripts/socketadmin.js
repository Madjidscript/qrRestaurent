console.log("gggggjgjjjjgjgjgj");
document.addEventListener("DOMContentLoaded", (event) => {
  const socket = io("http://localhost:7000");

  socket.on("connect", () => {
    console.log("socket coonected");

    socket.on("notification", (data) => {
      console.log("monstocket", data);
      const audio = document.getElementById("notificationSound");
      if (audio) {
        audio.play();
      }
    //   alert(data.message);
    });
  });
});
