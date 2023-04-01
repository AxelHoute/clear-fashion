const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');


module.exports.scrapeAndSave = async(url, filename) =>{

  try{ 
    const response = await fetch ("https://www.dedicatedbrand.com/en/loadfilter");
    if (response.ok){
      const body =await response.json();
      const products = body['products'].filter(
        data => Object.keys(data).length >0
      );
      data_json =products.map(
        function(data){
          const img= data['image'][0];
          const brandName = 'Dedicated';
          const link = "https://www.dedicatedbrand.com/en/"+ data['canonicalUri'];
          const name =data['name'];
          const price =data.price.priceAsNumber;
          let date = new Date().toISOString().slice(0, 10);
          return{name, link, img, price, date,brandName};
        }
      );
       fs.writeFileSync('server/dedicatedproducts.json', JSON.stringify(data_json,null , 2));

       return data_json;
    }
    console.error(response);
    return null;
  } catch(error){
    console.error(error);
    return null;
  }
}