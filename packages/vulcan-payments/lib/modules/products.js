export const Products = {};

export const addProduct = (productKey, product, productType = 'product') => {

  let productWithType; 

  // if product is a function, set it to a new function that returns the same thing except
  // with `type` set to `productType`
  if (typeof product === 'function') {
    productWithType = document => {
      const returnValue = product(document);
      returnValue.type = productType;
      return returnValue;
    };
  } else {
    productWithType = product;
    productWithType.type = productType;
  }

  Products[productKey] = productWithType;
};

export const addSubscriptionProduct = (productKey, product) => {
  addProduct(productKey, product, 'subscription');
};
