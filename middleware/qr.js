const QRCode = require('qrcode');
const QRCodeModel = require('../model/modelqrcode'); // Assurez-vous que le chemin est correct

// Fonction pour générer et sauvegarder les QR codes pour un tableau de nombres
const generateAndSaveQRCodes = async (numbers) => {
  try {
    // Vérifiez que nous avons un tableau de nombres
    if (!Array.isArray(numbers) || numbers.length === 0) {
      throw new Error('Le tableau de nombres est requis');
    }
    
    // Tableau pour stocker les résultats des QR codes générés
    const results = [];

    // Pour chaque nombre dans le tableau, générer un QR code
    for (const number of numbers) {
      // Créer l'URL spécifique pour le nombre
      const url = `https://qrrestaux.onrender.com/acceuil?numtable=${number}`;
      
      // Générer le QR code en tant que Data URL
      const qrCodeData = await QRCode.toDataURL(url);

      // Préparer le document à insérer dans MongoDB
      const qrCodeDocument = {
        number: number, // Stocker directement le numéro
        qrCodeData: qrCodeData,
        date: new Date()
      };

      // Insérer ou mettre à jour le document dans MongoDB
      const result = await QRCodeModel.findOneAndUpdate(
        { number: number },
        qrCodeDocument,
        { upsert: true, new: true } // Crée le document s'il n'existe pas, retourne le document mis à jour
      );

      // Ajouter le résultat au tableau
      results.push(result);
    }

    return results;
  } catch (err) {
    throw new Error(`Erreur lors de la génération ou de l'enregistrement des QR codes: ${err.message}`);
  }
};

module.exports = generateAndSaveQRCodes;
