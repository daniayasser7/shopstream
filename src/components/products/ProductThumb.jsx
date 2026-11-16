import { BoxSeam } from "react-bootstrap-icons";

function ProductThumb({ src, size = 48 }) {
  return (
    <div className="ss-thumb-box" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} alt="" />
      ) : (
        <BoxSeam size={size / 2.5} aria-hidden="true" />
      )}
    </div>
  );
}

export default ProductThumb;