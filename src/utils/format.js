const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function formatPrice(value) {
  return currencyFormatter.format(value);
}

export function getDiscount(product) {
  return Math.round(product.discountPercentage || 0);
}

export function getFinalPrice(product) {
  return product.price * (1 - (product.discountPercentage || 0) / 100);
}