// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';

/*
Description of the available api
GET https://clear-fashion-api.vercel.app/

Search for specific products

This endpoint accepts the following optional query string parameters:

- `page` - page of products to return
- `size` - number of products to return

GET https://clear-fashion-api.vercel.app/brands

Search for available brands list
*/

// current products on the page
let currentProducts = [];
let currentPagination = {};

// instantiate the selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');
const spanNbProducts = document.querySelector('#nbProducts');
const selectBrand=document.querySelector("#brand-select");
const reasonablePrice = document.querySelector("#reasonable-price");
const recentlyReleased = document.querySelector("#recently-released");
const sortproduct = document.querySelector("#sort-select");
/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 * 
 */
const fetchProducts = async (page = 1, size = 12,brand="all",filtre_recent=false,filtre_prix=false,sort_type="price-asc") => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?&size=999`+ (brand !== "all" ? `&brand=${brand}` : "")
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }
    var result=body.data.result;
    console.log(Array.isArray(result));
    if (filtre_recent){
      result = result.filter(product => (new Date() - new Date(product.released)) / (1000 * 60 * 60 * 24) < 50);
    }
    if (filtre_prix){  
      result=result.filtre(product=>product.price<50);
    }
    var meta = {
      currentPage: page,
      pageCount: Math.ceil(result.length / size),
      pageSize: size,
      count: result.length
    };
    result=Sort(sort_type,result);
    return {result,meta};
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Les sort sous forme de fonctions.
 */
function Sort(sort_type,result){
  if(sort_type === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  }
  else if(sort_type === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  }
  else if(sort_type === "date-asc") {
    result.sort((a, b) => new Date(b.released) - new Date(a.released));
  }
  else if(sort_type === "date-desc") {
    result.sort((a, b) => new Date(a.released) - new Date(b.released));
  }
  return(result);
}


/**
 * fetch brand 
 * @return {Array} brands
 */
const fetchBrand = async ()=> {
  try {
    const response = await fetch(
      'https://clear-fashion-api.vercel.app/brands'
    );
    const body = await response.json();

    if (body.success !== true) {
      console.error(body);
    }
    else {
      var brands=body.data.result;
      brands.unshift("all")
      renderBrands(brands) 
    }
    return body.data;
  } catch (error) {
    console.error(error);
 
  }
};
/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');
  const template = products
    .map(product => {
      return `
      <div class="product" id=${product.uuid}>
        <span>${product.brand}</span>
        <a href="${product.link}">${product.name}</a>
        <span>${product.price}</span>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');

  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};



/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = pagination => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;
};

/**
 * Render brand selector
 * @param  {Array} brands
 
 */
const renderBrands = brands => {
  const options = brands.map(brand => `<option value="${brand}">${brand}</option>`).join('');

  selectBrand.innerHTML = options;
};
const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination);
  renderBrands(brand);
  
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 */
selectShow.addEventListener('change', async (event) => {
  const products = await fetchProducts(currentPagination.currentPage, parseInt(event.target.value),selectBrand.value);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts(currentPagination.currentPage,);

  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});


selectPage.addEventListener('change',async (event) =>{
  const products= await fetchProducts(parseInt(event.target.value),currentPagination.pageCount,selectBrand.value,recentlyReleased.checked,reasonablePrice.checked,sortproduct);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

selectBrand.addEventListener('change',async (event)=>{
  const products=await fetchProducts(currentPagination.currentPage,currentPagination.pageCount,event.target.value,recentlyReleased.checked,reasonablePrice.checked,sortproduct);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});

fetchBrand();

if (reasonablePrice){
  reasonablePrice.addEventListener('change',async (event)=>{
  const products=await fetchProducts(currentPagination.currentPage,currentPagination.pageCount,selectBrand.value,recentlyReleased.checked,event.target.checked,sortproduct);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});}
if (recentlyReleased){
  recentlyReleased.addEventListener('change',async (event)=>{
  const products=await fetchProducts(currentPagination.currentPage,currentPagination.pageCount,selectBrand.value,event.target.checked,reasonablePrice.checked,sortproduct);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});}

sortproduct.addEventListener('change',async (event)=>{
  const products=await fetchProducts(currentPagination.currentPage,currentPagination.pageCount,selectBrand.value,recentlyReleased.checked,reasonablePrice.checked,event.target.value);
  setCurrentProducts(products);
  render(currentProducts, currentPagination);
});