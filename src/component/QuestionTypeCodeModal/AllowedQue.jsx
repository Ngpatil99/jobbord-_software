import { Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const skills = [
    { label: 'Javascript', value: 1 },
    { label: 'Python', value: 2 },
];
const lang=['Javascript','Node js','Sprignboot','Next js','Express js','Selenium','Java','Go Lang',"Flutter",'Kotlin']
const AllowedQue = () => {
    const [isLibrary, setLibrary] = useState(false);

    const handleChangeA = (event) => {
        setLibrary(event.target.checked);
    };
    const [expandedRows, setExpandedRows] = useState([]);


    const handleReadMoreClick = (rowId) => {
        setExpandedRows((prevExpandedRows) => {
            return prevExpandedRows.includes(rowId)
                ? prevExpandedRows.filter((id) => id !== rowId)
                : [...prevExpandedRows, rowId];
        });
    };
    return (
        <Grid border={1} ml={3} mt={2} borderColor={'#DDD'}>
            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'} mt={1} p={1}>
                <Grid item md={4} >
                    <Grid spacing={2} alignItems="center" pl={3}>
                        <Grid item>
                            <span className='test-case-label'>Allowed Languages</span>
                        </Grid>
                        <Grid mt={1}> <span className='lang-label'>Langauges in which candidate can code</span></Grid>
                    </Grid>
                </Grid>

                <Grid item xs={6} textAlign="right">
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={skills}
                        sx={{
                            width: 'auto',
                            marginTop: '10px',
                            "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                borderColor: "#00C49A",
                                borderWidth: '1.5px',
                            },
                            "& .MuiAutocomplete-hasPopupIcon.css-14u5gp8-MuiAutocomplete-root .MuiOutlinedInput-root": {
                                paddingRight: '16px !important',
                            },
                            "& .css-u44fxw-MuiAutocomplete-root .MuiOutlinedInput-root": {
                                padding: '4px !important',
                            },
                            "& .css-tnhsec-MuiAutocomplete-root .MuiOutlinedInput-root": {
                                padding: '6px !important',
                            },
                        }}
                        // onChange={(event, value) => {
                        //     setSkillSelected(value);
                        // }}
                        renderInput={(params) => (
                            <TextField
                                placeholder='Search Languages'
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>

                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                <path d="M8.25 15.1289C11.5637 15.1289 14.25 12.4426 14.25 9.12891C14.25 5.8152 11.5637 3.12891 8.25 3.12891C4.93629 3.12891 2.25 5.8152 2.25 9.12891C2.25 12.4426 4.93629 15.1289 8.25 15.1289Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M15.7508 16.6287L12.4883 13.3662" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>

                                        </>
                                    ),
                                    style: { borderColor: params.focused ? 'green' : 'initial' },
                                }}
                            />
                        )}
                    />

                </Grid>

            </Grid>
            <Grid container spacing={2} alignItems="center" ml={1} p={3}>
                {lang.map((item) => (
                    <Grid item key={item}>
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isLibrary}
                                        onChange={handleChangeA}
                                        name={`checked${item}`}
                                        sx={{
                                            // color: '#252424',
                                            '&.Mui-checked': {
                                                color: '#FF6812',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Typography className='partial-score'>
                                         {item}
                                    </Typography>
                                }
                            />
                        </FormGroup>
                    </Grid>
                ))}
            </Grid>

        </Grid>
    );
};

export default AllowedQue;
