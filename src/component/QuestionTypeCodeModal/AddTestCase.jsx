import { Box, Grid, Modal, Typography, TextField, FormGroup, Checkbox, FormControlLabel } from '@mui/material';
import React, { useCallback } from "react";
import closeIcon from "../../assets/icon/close-icon.svg";
import line from "../../assets/icon/line.svg";
import upload from "../../assets/icon/uplod_test-case.svg";
import TextareaAutosize from '@mui/material/TextareaAutosize';
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


function AddTestCase(props) {
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
                        <span className='add-manage'>Add Test Case</span>
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
                <Grid container spacing={2} justifyContent={'space-between'} mt={2}>
                    <Grid item md={6}>
                        <Typography className="add-testcases-labels">Input</Typography>
                        <Grid container height={120} border={1} borderColor={'#DDD'} p={2} mt={1}>
                            <Grid item md={11}>
                                <span>1, 2, 3, 4, 5, 6, 7, 8, 9</span>
                            </Grid>
                            <Grid item md={1} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <img
                                    style={{ cursor: 'pointer' }}
                                    src={upload}
                                    alt=""
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item md={6}>
                        <Typography className="add-testcases-labels">Output</Typography>
                        <Grid container border={1} borderColor={'#DDD'} height={120} p={2} mt={1}>
                            <Grid item md={11}><span>Greatest number from array is 9</span></Grid>
                            <Grid item md={1} {...getRootProps()}>
                                <input {...getInputProps()} />
                                <img
                                    style={{ cursor: 'pointer' }}
                                    src={upload}
                                    alt=""
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container spacing={0} justifyContent={'space-between'} mt={2}>
                    <Typography className="add-testcases-labels">Explanation</Typography>
                    <TextareaAutosize
                        value={"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur pulvinar dolor quis risus placerat interdum. Aliquam augue ligula, consequat semper libero sed"}
                        minRows={4}
                        style={{
                            width: '110%',
                            borderColor: '#DDDDDD', // Set transparent border when focused
                            borderWidth: '1px',
                            padding: '8px',
                            resize: 'none',
                            height: '170px',
                            outline: 'none',
                            marginTop: 10,
                            color: '#333333',
                            fontFamily: 'Roboto',
                            padding: 20
                        }}
                    />
                </Grid>
                <Grid container mt={2}>
                    <Typography className="add-testcases-labels">Score</Typography>

                </Grid>
                <Grid container spacing={2} display={'flex'} alignItems={'center'} >
                    <Grid item md={2}>
                        <TextField
                            id={`textField-1`}
                            type="text"
                            size="small"
                            style={{ width: '100%', marginTop: '10px' }}
                            InputProps={{
                                inputProps: {
                                    type: 'number',
                                    pattern: '[0-9]*'
                                },
                            }}
                        />
                    </Grid>
                    <Grid item md={4} ml={2}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        // checked={isLibrary}
                                        // onChange={handleChangeA}
                                        // name={`checked${item}`}
                                        sx={{
                                            // color: '#252424',
                                            '&.Mui-checked': {
                                                color: '#00C49A',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography className='partial-score'>
                                        Visible To Candidate
                                    </Typography>
                                }
                            />
                        </FormGroup>
                    </Grid>
                </Grid>
                <Grid item md={8} pb={4}>
                    <div className="layout-button-container" onClose={closeModal}>
                        <div className="next-button">
                            <span className='add-test-btn'>+ Add Case</span>
                        </div>
                    </div>
                </Grid>
            </Box>
        </Modal>
    );
}

export default AddTestCase;
