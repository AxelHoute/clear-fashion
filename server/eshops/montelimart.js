const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require('fs');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = (data) => {
    const $ = cheerio.load(data);
    const brandName = 'Montlimart';
    return $('.products-list* .products-list__block*')
      .map((i, element) => {
        const name = $(element)
          .find('.text-reset')
          .text()
          .trim()
          .replace(/\s/g, ' ');
        const color = $(element)
          .find('.product-miniature__color')
          .text()
          .trim()
          .replace(/\s/g, ' ');
        const price = parseInt(
          $(element)
            .find('.price')
            .text()
        );
        const link = $(element)
          .find('.product-miniature__thumb-link')
          .attr('href');
  
        const img = $(element)
          .find('.product-miniature__thumb-link')
          .children("img")
          .attr("data-src");
        let date = new Date().toISOString().slice(0, 10);
        return {name, color,price,link,img,date,brandName};
      })
      .get();
  };
  
/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */

module.exports.scrapeAndSave = async url  => {
    try {
        const response = await fetch(url);

        if (response.ok) {
            const body = await response.text();
            const parsedData=parse(body);
            const toJson=JSON.stringify(parsedData,null,2);
            fs.writeFileSync('montelimart.json', toJson, (err)=>{
                if(err) throw err;
            })
            return parse(body);
        }

        console.error(response);

        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
};