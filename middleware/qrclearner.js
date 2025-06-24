const Qrcode = require('../model/modelqrcode');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const nettoyerQRCodes = async () => {
  const maintenant = new Date();

  // 🧼 Cas 1 : QR en_cours depuis +10 min → libération
  const qrEnCours = await Qrcode.find({
    etat: 'en_cours',
    lastChange: { $lt: new Date(maintenant - 10 * 60 * 1000) }
  });

  for (let qr of qrEnCours) {
    await libererQr(qr, 'inactivité (pas de commande)');
  }

  // 🧼 Cas 2 : QR utilisé depuis +2 min → libération
  const qrUtilises = await Qrcode.find({
    etat: 'utilisé',
    lastChange: { $lt: new Date(maintenant - 2 * 60 * 1000) }
  });

  for (let qr of qrUtilises) {
    await libererQr(qr, 'commande terminée');
  }
};

// 🔄 Fonction commune de libération
const libererQr = async (qr, raison) => {
  const newToken = uuidv4();
  const newURL = `https://restaux-mmds.vercel.app/client/cath/${newToken}?from=scan`;
  const newQRCode = await QRCode.toDataURL(newURL);

  qr.token = newToken;
  qr.qrCodeData = newQRCode;
  qr.etat = 'libre';
  qr.lastChange = null;
  await qr.save();

  console.log(`♻️ Table ${qr.number} libérée (${raison}).`);
};
module.exports = nettoyerQRCodes;
