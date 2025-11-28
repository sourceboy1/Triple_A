export const getProductDetailsPath = (product) => { 
  if (!product) return "/";

  return product.slug
    ? `/product/${product.slug}`
    : `/product/${product.product_id}`;
};
