console.log("gggggjgjjjjgjgjgj");
document.addEventListener("DOMContentLoaded", (event) => {
  const socket = io("https://qrrestaux.onrender.com");
   //http://localhost:7000
   // https://qrrestaux.onrender.com
  //const num = document.getElementById("dedy").textContent;
  //console;log("mon numm des",num)
  socket.on("connect", () => {
    console.log("socket coonected");

    socket.on("notification", (data) => {
      console.log("monstocket", data);
      const audio = document.getElementById("notificationSound");
     
      const synth = window.speechSynthesis;
      //const text = `cher Admin la commande effectuer a la table ${num} a été annuler`
      if (data.type === "annuler" ){
        // if (text) {
          const   utterance = new SpeechSynthesisUtterance(data.message);
           synth.speak(utterance);
             //audio.play().catch(function(error) {
            //console.error('Erreur lors de la lecture :', error);
           //});
            setTimeout(() => {
           window.location.reload()
          }, 6000);
     
    // }

      }
      
      
   
     
   
    });
  });
});
