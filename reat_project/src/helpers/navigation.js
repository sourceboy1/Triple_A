export const getProductDetailsPath = (product) => {
  if (!product) return "/";

  return product.slug
    ? `/product-details/${product.slug}`
    : `/product-details/${product.product_id}`;
};
