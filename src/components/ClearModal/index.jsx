import React from "react";
import Modal from '@mui/material/Modal';
import { Box, Button } from "@mui/material";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#D3D3D3', // Light gray background color
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)', // Subtle shadow
  borderRadius: '8px', // Rounded corners
  p: 4,
  textAlign: 'center', // Center align text
};

const buttonStyle = {
  margin: '0 1vmax',
  fontSize: '1vmax',
};

function ClearModal({ open, handleClose, clearPanel }) {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      style={{ fontSize: '1vmax' }}
    >
      <Box sx={style}>
        <ErrorOutlineOutlinedIcon style={{ color: 'red', fontSize: '2em', marginBottom: '1vmax' }} />
        <div>
          <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Do you really want to remove the Comic Panel?</p>
          <Button variant="contained" color="error" onClick={clearPanel} style={buttonStyle}>Yes</Button>
          <Button variant="contained" color="success" onClick={handleClose} style={buttonStyle}>No</Button>
        </div>
      </Box>
    </Modal>
  );
}

export default ClearModal;
