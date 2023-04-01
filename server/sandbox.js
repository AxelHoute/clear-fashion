/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./eshops/dedicatedbrand');
const monterlimart = require('./eshops/montelimart');
const circlesportswear = require('./eshops/circlesportwear');


async function sandbox (eshop) {
  try {
    
    console.log(`🕵️‍♀️  browsing ${eshop} eshop`);
    if (eshop=="dedicatesdbrand"){
    const products = await dedicatedbrand.scrapeAndSave("https://www.dedicatedbrand.com/en/men/t-shirts",'server/dedicatedproducts.json');

    console.log(products);
    console.log('done');
    process.exit(0);
  }

  if (eshop=="montelimart"){
    const products = await monterlimart.scrapeAndSave(['https://www.montlimart.com/99-vetements','https://www.montlimart.com/14-chaussures','https://www.montlimart.com/15-accessoires'],'server/montelimart.json');

    console.log(products);
    console.log('done');
    process.exit(0);
  }
  if (eshop=="circlesportwear"){
    const products = await circlesportswear.scrapeAndSave('https://shop.circlesportswear.com/collections/all','server/circlesportswear.json');

    console.log(products);
    console.log('done');
    process.exit(0);
  }
  } catch (e) {
    console.error(e);
    process.exit(1);

  }
}

const [,, eshop] = process.argv;

sandbox("dedicatesdbrand");
sandbox("montelimart");
sandbox("circlesportwear");
