const top5Plats = (commandes) => {
    const comptePlats = {};
  
    for (const commande of commandes) {
      if (commande.data && Array.isArray(commande.data)) {
        for (const item of commande.data) {
          comptePlats[item.nom] = (comptePlats[item.nom] || 0) + item.nbre; // Correction ici
        }
      }
    }
  
    const tableauPlats = Object.entries(comptePlats);
    tableauPlats.sort(([, quantiteA], [, quantiteB]) => quantiteB - quantiteA);
    return tableauPlats.slice(0, 5).map(([nom, nbre]) => ({ nom, nbre: Number(nbre) }));
  };
  
  module.exports = top5Plats;