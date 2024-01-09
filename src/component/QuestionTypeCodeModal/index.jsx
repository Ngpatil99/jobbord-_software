// RightToLeftModal.js
import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
const customStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
};

const QueCodeModal = ({ isOpen, handleClose, children }) => {
  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="right-to-left-modal"
      aria-describedby="right-to-left-modal-description"
      style={customStyles}
    >
      <Box sx={{ bgcolor: 'background.paper', width: '70%', p: 2 ,height:'100%',position:'relative',top:70,borderTopLeftRadius:20}}  overflow={'auto'}>
        {children}
      </Box>
    </Modal>
  );
};

export default QueCodeModal;
