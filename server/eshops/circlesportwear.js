const fetch = require('node-fetch');
const cheerio = require('cheerio');
const fs = require("fs");

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
    const $ = cheerio.load(data);
    const brand = 'CircleSportsWear';
    return $('.product-grid .grid__item')
        .map((i, element) => {
            const name = $(element)
                .find('.full-unstyled-link')
                .text()
                .trim()
                .split("  ")[0]
                .replace(/\s/g, ' ');
            const price = parseInt(
                $(element)
                    .find('.money')
                    .text()
                    .split("€")[1]
            );
            const date = new Date()
            return {name, price, brand, date};
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
            fs.writeFileSync('server/circlesportswear.json', toJson, (err)=>{
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