"use client";

import { useState } from "react";

export default function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const availableImages = images.filter(Boolean);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hasImages = availableImages.length > 0;
  const selectedImage = hasImages
    ? availableImages[Math.min(selectedIndex, availableImages.length - 1)]
    : "/assets/burning-star-emblem.svg";

  return (
    <div className="product-gallery">
      <div className={`product-gallery-main${hasImages ? "" : " is-placeholder"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={selectedImage}
          alt={hasImages ? productName : ""}
          aria-hidden={hasImages ? undefined : true}
        />
        <span className="product-gallery-code">BS® / VISUAL FILE</span>
        <span className="product-gallery-count">
          {String(selectedIndex + 1).padStart(2, "0")} /{" "}
          {String(Math.max(availableImages.length, 1)).padStart(2, "0")}
        </span>
        <span className="crop-frame" aria-hidden="true" />
      </div>

      {availableImages.length > 1 && (
        <div className="product-thumbnails" aria-label="Imágenes del producto">
          {availableImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              className={selectedIndex === index ? "is-active" : ""}
              type="button"
              aria-label={`Ver imagen ${index + 1} de ${availableImages.length}`}
              aria-pressed={selectedIndex === index}
              onClick={() => setSelectedIndex(index)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt="" aria-hidden="true" />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
