const Qrcode = require('../model/modelqrcode');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const nettoyerQRCodes = async () => {
  const maintenant = new Date();

  // Durées en millisecondes
  const delaiEnCours = 60 * 60 * 1000; // 10 minutes (modifie à 90 * 60 * 1000 pour 1h30)
  const delaiUtilise = 2 * 60 * 1000;  // 2 minutes

  // QR en cours depuis trop longtemps → libérer
  const qrEnCours = await Qrcode.find({
    etat: 'en_cours',
    lastChange: { $lt: new Date(maintenant - delaiEnCours) }
  });

  for (let qr of qrEnCours) {
    await libererQr(qr, 'inactivité (pas de commande)');
  }

  // QR utilisé depuis trop longtemps → libérer
  const qrUtilises = await Qrcode.find({
    etat: 'utilisé',
    lastChange: { $lt: new Date(maintenant - delaiUtilise) }
  });

  for (let qr of qrUtilises) {
    await libererQr(qr, 'commande terminée');
  }
};

const libererQr = async (qr, raison) => {
  const newToken = uuidv4();
  const newURL = `https://restaux-mmds.vercel.app/client/cath/${newToken}?from=scan`;
  const newQRCode = await QRCode.toDataURL(newURL);

  qr.token = newToken;
  qr.qrCodeData = newQRCode;
  qr.etat = 'libre';
  qr.lastChange = null;
  qr.sessionId = null;  // penser à remettre à null la sessionId aussi
  await qr.save();

  console.log(`♻️ Table ${qr.number} libérée (${raison}).`);
};

module.exports = nettoyerQRCodes;
