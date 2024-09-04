console.log("gggggjgjjjjgjgjgj");
document.addEventListener("DOMContentLoaded", (event) => {
  const socket = io("https://qrrestaux.onrender.com");

  socket.on("connect", () => {
    console.log("socket coonected");

    socket.on("notification", (data) => {
      console.log("monstocket", data);
      const audio = document.getElementById("notificationSound");
      const synth = window.speechSynthesis;
      const text = " commande effectuer HOOOOOOOOOOOOOOOOO"
      
      const   utterance = new SpeechSynthesisUtterance(text);
        synth.speak(utterance);
   
    //   if (audio) {
    //     audio.play().catch(function(error) {
    //         console.error('Erreur lors de la lecture :', error);
    //     });
    //     setTimeout(() => {
    //         window.location.reload()
    //     }, 2000);
       
    //   }
    //   alert(data.message);
    });
  });
});
