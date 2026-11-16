import { useState } from "react";

function ProductGallery({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="d-flex flex-column-reverse flex-md-row gap-3">
      {images.length > 1 && (
        <div className="ss-thumbs d-flex flex-md-column gap-2">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`ss-thumb ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={index === activeIndex}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}

      <div className="ss-gallery-main flex-grow-1">
        <img src={images[activeIndex]} alt={title} />
      </div>
    </div>
  );
}

export default ProductGallery;