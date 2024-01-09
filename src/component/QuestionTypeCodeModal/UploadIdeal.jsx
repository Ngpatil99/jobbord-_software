import { Box, Grid, Modal, Typography, TextField, FormGroup, Checkbox, FormControlLabel } from '@mui/material';
import React, { useCallback } from "react";
import closeIcon from "../../assets/icon/close-icon.svg";
import line from "../../assets/icon/line.svg";
import upload from "../../assets/icon/fill-upload.svg";
import file_upload from "../../assets/icon/upload-with-btn.svg";
import { useDropzone } from 'react-dropzone';
import "./index.css";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    // boxShadow: 24,
    px: 4,
    pb: 0,
    overflowY: 'auto', // Enable vertical scrolling
    maxHeight: '100vh',
    width: '20%'
};

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};
function UploadIdeal(props) {
    const { isOpen, closeModal } = props;

    const onDrop = useCallback((acceptedFiles) => {
        // Do something with the accepted files
        console.log(acceptedFiles);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
    return (
        <Modal open={isOpen} onClose={closeModal}>
            <Box sx={{ ...style, width: '50%', border: 'none' }} >
                <Grid container spacing={0} mt={3}>
                    <Grid item xs={6} md={6}>
                        <span className='add-manage'>Upload Ideal Solution</span>
                    </Grid>
                    <Grid item xs={6} md={6} container justifyContent="flex-end">
                        <img
                            onClick={closeModal}
                            style={{ cursor: "pointer" }}
                            src={closeIcon}
                            alt=""
                        />
                    </Grid>
                    <Grid item xs={12} mt={3}>
                        <img src={line} alt="" className='line-width' />
                    </Grid>
                </Grid>

                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    height={120}
                    border={1}
                    borderColor="#DDD"
                    p={2}
                    mt={1}
                    style={dropzoneStyle}
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here</p>
                    ) : (
                        <div>
                            <img
                                style={{ cursor: 'pointer', marginTop: '10px' }}
                                src={upload}
                                alt=""
                            />
                            <p className='upload-text'>Upload File or drag and drop here</p>
                        </div>
                    )}
                </Grid>
                <Grid container p={2}>
                    <Grid item md={1}>Note:</Grid>
                    <Grid item md={10}><span className='note'>
                        File must be in .TXT Format. Lorem ipsum dolor sit amet, consectetur adipiscing elit
                        Lorem ipsum dolor sit amet, consectetur adipiscing eli</span></Grid>
                </Grid>
                <Grid pb={4} mt={2}>
                    <div className="layout-button-container" onClose={closeModal} style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <div className="next-button">
                            <span className='add-test-btn'>
                                <img
                                    style={{ cursor: 'pointer', marginRight: '10px' }}
                                    src={file_upload}
                                    alt=""
                                />
                                Upload
                            </span>
                        </div>
                    </div>
                </Grid>
            </Box>
        </Modal>
    );
}

export default UploadIdeal;
