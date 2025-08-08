// push.js
const webpush = require('web-push');
require('dotenv').config()

const PushNotif = require('../model/modelpush'); // modèle qu'on a créé

const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  'mailto:abdoul.latoundji@uvci.edu.ci',
  publicVapidKey,
  privateVapidKey
);

/**
 * Envoie une notification push + sauvegarde en BDD
 * @param {Object} subscription - L'abonnement Web Push du client
 * @param {Object} dataToSend - Les données de la notification (title, message, type, emon_id...)
 */
const sendPushNotification = async (subscription, dataToSend) => {
  try {
    // 1️⃣ Envoi Web Push
    await webpush.sendNotification(subscription, JSON.stringify(dataToSend));
    console.log("✅ Notification push envoyée");

    // 2️⃣ Sauvegarde en BDD
    const notif = new PushNotif({
      emon_id: dataToSend.emon_id, // identifiant de l'utilisateur
      title: dataToSend.title || "Nouvelle notification",
      message: dataToSend.message,
      type: dataToSend.type || "",
      statut: dataToSend.statut || "",
      data: dataToSend || {}
    });

    await notif.save();
    console.log("💾 Notification sauvegardée en BDD");

  } catch (err) {
    console.error("❌ Erreur d’envoi ou de sauvegarde", err);
  }
};

module.exports = {
  sendPushNotification,
  publicVapidKey
};
