const top5StocksInferieurs = (stocks)=> {
    if (!stocks || !Array.isArray(stocks)) {
      return []; // Gérer les entrées invalides
    }
  
    const stocksAvecPlat = [];
  
    for (const stock of stocks) {
      if (stock.id_Souscat && typeof stock.id_Souscat === 'object' && stock.nombre !== undefined) {
        stocksAvecPlat.push({
          plat: stock.id_Souscat.nom,
          stock: stock.nombre
        });
      }
    }
  
    stocksAvecPlat.sort((a, b) => a.nombre - b.nombre);
    return stocksAvecPlat.slice(0, 5);
  }

  module.exports = top5StocksInferieurs;