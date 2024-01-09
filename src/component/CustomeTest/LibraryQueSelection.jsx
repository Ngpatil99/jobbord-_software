import { Box, Checkbox, FormControlLabel, FormGroup, Grid, Modal, Radio, RadioGroup, Typography } from '@mui/material';

const LibraryQuestionSelection = (props) => {
    const { selectedValue, handleChange, isLibrary, handleChangeA, isManuallyAdd, handleChangeB } = props;
    const lib_checked = selectedValue === "from_library" ? "#00C49A" : "";
    const manual_checked = selectedValue === "manually_added" ? "#00C49A" : "";
    return (
        <>
            <Grid mt={4}>
                <span className='label'>Question Selection</span>
                <RadioGroup row value={selectedValue} onChange={handleChange} style={{ marginTop: '10px' }}>
                    <FormControlLabel
                        value="from_library"
                        control={<Radio size='2' style={{ color: lib_checked }} />}
                        label={
                            <Typography variant="body2" style={{ fontSize: '14px', color: '#252424' }}>
                                <span className='radio-label'> From Library</span>
                            </Typography>
                        }
                    />
                    <FormControlLabel
                        value="manually_added"
                        control={<Radio size='2' style={{ color: manual_checked }} />}
                        label={
                            <Typography variant="body2" style={{ fontSize: '14px', color: '#252424' }}>
                                <span className='radio-label'> Manually-added questions</span>
                            </Typography>
                        }
                    />
                </RadioGroup>
            </Grid>
            {selectedValue === "from_library" && <Grid mt={2}>
                <span className='label'>Library Selection</span>
                <FormGroup row style={{ marginTop: '10px' }}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                size='2'
                                checked={isLibrary}
                                onChange={handleChangeA}
                                name="checkedA"
                                sx={{
                                    color: isLibrary ? '#00C49A' : '#252424', // Change color for unchecked state
                                    '&.Mui-checked': {
                                        color: '#00C49A',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        borderWidth: '2px', // Decrease the border width for the checkbox
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography style={{ fontSize: '14px', color: '#252424' }}>
                                <span className='radio-label'>EliteQA Library</span>
                            </Typography>
                        }
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                size='2'
                                checked={isManuallyAdd}
                                onChange={handleChangeB}
                                name="checkedB"
                                sx={{
                                    color: isManuallyAdd ? '#00C49A' : '#252424', // Change color for unchecked state
                                    '&.Mui-checked': {
                                        color: '#00C49A',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        borderWidth: '2px', // Decrease the border width for the checkbox
                                    },
                                }}
                            />
                        }
                        label={
                            <Typography style={{ fontSize: '14px', color: '#252424' }}>
                                <span className='radio-label'>My Library</span>
                            </Typography>
                        }
                    />
                </FormGroup>
            </Grid>}
        </>
    );
};

export default LibraryQuestionSelection;
