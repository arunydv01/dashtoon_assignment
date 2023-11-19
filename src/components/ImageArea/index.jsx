import React, { useState } from 'react';
import "./ImageArea.css";
import DeleteModal from '../DeleteModal';

function ImageArea({ generatedImages, onDeleteImage }) {
  const [openDeleteModal, setOpenDeleteModal] = useState({
    isOpen: false,
    index: -1,
  });

  const handleOpenDeleteModal = (index) => {
    setOpenDeleteModal({
      isOpen: true,
      index: index,
    });
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal({
      isOpen: false,
      index: -1,
    });
  };

  const deleteImage = () => {
    if (!openDeleteModal.isOpen) return;
    onDeleteImage(openDeleteModal.index);
    handleCloseDeleteModal();
  }

  return (
    <div className="image-board">
      {generatedImages.map((image, index) => (
        <div key={index} className="image-container">
          <img src={image} alt={`Generated Image ${index + 1}`} className="generated-image" />
          <div className='delete-btn'>
            <button onClick={() => handleOpenDeleteModal(index)} className="delete-button">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} width="2rem" height="2rem" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
      <DeleteModal open={openDeleteModal.isOpen} handleClose={handleCloseDeleteModal} deleteImage={deleteImage} />
    </div>
  );
}

export default ImageArea;

