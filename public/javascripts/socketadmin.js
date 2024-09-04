console.log("gggggjgjjjjgjgjgj");
document.addEventListener("DOMContentLoaded", (event) => {
  const socket = io("https://qrrestaux.onrender.com");

//const num = document.getElementById("dedy").textContent;
 // console.log("mon numm hoo",num)
  socket.on("connect", () => {
    console.log("socket coonected");

    socket.on("notification", (data) => {
      console.log("monstocket", data);
      const audio = document.getElementById("notificationSound");
      
      const synth = window.speechSynthesis;
    //const text = `cher Admin commande effectuer sur la table ${num}`
      if(data.type ==="commande"){
        // if (text) {
            const   utterance = new SpeechSynthesisUtterance(data.message);
             synth.speak(utterance);
               //audio.play().catch(function(error) {
              //console.error('Erreur lors de la lecture :', error);
             //});
               setTimeout(() => {
                window.location.reload()
             }, 6000);
       
    //  }
      }
      
    });
  });
});
