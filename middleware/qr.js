const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const QRCodeModel = require('../model/modelqrcode'); // Assurez-vous que le chemin est correct

// Fonction pour générer et sauvegarder les QR codes pour un tableau de nombres
// const generateAndSaveQRCodes = async (numbers) => {
//   try {
//     // Vérifiez que nous avons un tableau de nombres
//     if (!Array.isArray(numbers) || numbers.length === 0) {
//       throw new Error('Le tableau de nombres est requis');
//     }
    
//     // Tableau pour stocker les résultats des QR codes générés
//     const results = [];

//     // Pour chaque nombre dans le tableau, générer un QR code
//     for (const number of numbers) {
//       // Créer l'URL spécifique pour le nombre
//       // const url = `https://qrrestaux.onrender.com/acceuil?numtable=${number}`;
//       const url = `https://restaux-mmds.vercel.app/client/cath/${number}`;

      
//       // Générer le QR code en tant que Data URL
//       const qrCodeData = await QRCode.toDataURL(url);

//       // Préparer le document à insérer dans MongoDB
//       const qrCodeDocument = {
//         number: number, // Stocker directement le numéro
//         qrCodeData: qrCodeData,
//         date: new Date()
//       };

//       // Insérer ou mettre à jour le document dans MongoDB
//       const result = await QRCodeModel.findOneAndUpdate(
//         { number: number },
//         qrCodeDocument,
//         { upsert: true, new: true } // Crée le document s'il n'existe pas, retourne le document mis à jour
//       );

//       // Ajouter le résultat au tableau
//       results.push(result);
//     }

//     return results;
//   } catch (err) {
//     throw new Error(`Erreur lors de la génération ou de l'enregistrement des QR codes: ${err.message}`);
//   }
// };

const generateAndSaveQRCodes = async (numbers) => {
  try {
    const results = [];

    for (const number of numbers) {
      // Génère un token sécurisé (UUID)
      const secureToken = uuidv4();

      // Génère l'URL avec le token sécurisé
      const url = `https://restaux-mmds.vercel.app/client/cath/${secureToken}`;

      // Génère l’image du QR code à partir de l’URL
      const qrCodeData = await QRCode.toDataURL(url);

      // Crée et enregistre dans MongoDB
      const qrCodeDocument = {
        number: number,
        token: secureToken,
        qrCodeData: qrCodeData,
        date: new Date()
      };

      const result = await QRCodeModel.findOneAndUpdate(
        { number },
        qrCodeDocument,
        { upsert: true, new: true }
      );

      results.push(result);
    }

    return results;
  } catch (err) {
    throw new Error(`Erreur QR Code: ${err.message}`);
  }
};
module.exports = generateAndSaveQRCodes;
