const Qrcode = require('../model/modelqrcode');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const nettoyerQRCodes = async () => {
  const maintenant = new Date();

  const delaiEnCours = 60 * 60 * 1000; // 1h sans commande → libère la table

  // QR en cours depuis trop longtemps → libérer
  const qrEnCours = await Qrcode.find({
    etat: 'en_cours',
    lastChange: { $lt: new Date(maintenant - delaiEnCours) }
  });

  for (let qr of qrEnCours) {
    await libererQr(qr, 'inactivité (pas de commande)');
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
