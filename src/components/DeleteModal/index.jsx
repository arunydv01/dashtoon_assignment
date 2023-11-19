import React from "react";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'fit-content',
    bgcolor: '#D3D3D3', // Background color
    borderRadius: '10px',
    border: '2px solid #e74c3c', // Border color
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    p: 4,
    textAlign: 'center',
};

const iconStyle = {
    color: '#e74c3c', // Icon color
    fontSize: '2rem',
    marginBottom: '1rem',
};

const buttonStyle = {
    marginRight: '1vmax',
    fontSize: '1vmax',
    textTransform: 'none',
};

function DeleteModal({ open, handleClose, deleteImage }) {
    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <ErrorOutlineOutlinedIcon sx={iconStyle} />
                <div>
                    <p style={{ color: '#333', fontSize: '1.2rem', fontWeight: 'bold' }}>Confirm Deletion</p>
                    <p style={{ color: '#555', marginBottom: '1.5rem' }}>Are you sure you want to remove this Comic?</p>
                    <Button onClick={deleteImage} variant="contained" color="error" sx={buttonStyle}>Yes</Button>
                    <Button onClick={handleClose} variant="contained" color="success" sx={buttonStyle}>No</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default DeleteModal;
