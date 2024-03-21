import React, { useState } from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

interface ImageGalleryProps {
  thumbnailImages: string[];
  fullSizeImages: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ thumbnailImages, fullSizeImages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', gap: '10px' }}>
        {thumbnailImages.map((thumbnail, index) => (
          <img
            key={index}
            src={thumbnail}
            alt={`Thumbnail ${index}`}
            style={{ width: '100px', height: 'auto', cursor: 'pointer' }}
            onClick={() => {
              setPhotoIndex(index);
              setIsOpen(true);
            }}
          />
        ))}
      </div>

      {isOpen && (
        <Lightbox
          mainSrc={fullSizeImages[photoIndex]}
          nextSrc={fullSizeImages[(photoIndex + 1) % fullSizeImages.length]}
          prevSrc={fullSizeImages[(photoIndex + fullSizeImages.length - 1) % fullSizeImages.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() => setPhotoIndex((photoIndex + fullSizeImages.length - 1) % fullSizeImages.length)}
          onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % fullSizeImages.length)}
        />
      )}
    </div>
  );
};

export default ImageGallery;
