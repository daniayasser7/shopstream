function getStockInfo(stock) {
  if (stock <= 0) return { label: "Out of Stock", tone: "muted" };
  if (stock < 10) return { label: `Only ${stock} Left`, tone: "danger" };
  return { label: `${stock} In Stock`, tone: "success" };
}

function StockStatus({ stock }) {
  const { label, tone } = getStockInfo(stock);
  return <span className={`ss-stock ss-stock-${tone}`}>{label}</span>;
}

export default StockStatus;