import { Checkbox, FormControlLabel, FormGroup, Grid, Typography } from '@mui/material';
import React, { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { IOSSwitch } from './Switch';
import TestCaseModal from "./AddTestCase";
const rows = [
    { input: 'input', output: "output", score: 30, candidate: 'New York', explanation: 'Lorem ipsum dolor sit amet lorem ipsum' },
    { input: 'input', output: "output", score: 30, candidate: 'New York', explanation: 'Lorem ipsum dolor sit amet lorem ipsum' },

];
const TestCase = () => {
    const [isLibrary, setLibrary] = useState(false);

    const handleChangeA = (event) => {
        setLibrary(event.target.checked);
    };
    const [expandedRows, setExpandedRows] = useState([]);
    const [isOpen,setOpenModal]=useState(false);

    const handleReadMoreClick = (rowId) => {
        setExpandedRows((prevExpandedRows) => {
            return prevExpandedRows.includes(rowId)
                ? prevExpandedRows.filter((id) => id !== rowId)
                : [...prevExpandedRows, rowId];
        });
    };
    const closeModal =()=>{
        setOpenModal(false);
    }
    return (
        <>

            <Grid container spacing={2} alignItems="center" justifyContent={'space-between'} mt={1} pr={2}>
                <Grid item md={4} >
                    <Grid container spacing={2} alignItems="center" pl={3}>
                        <Grid item>
                            <span className='test-case-label'>Test Cases</span>
                        </Grid>
                        <Grid item>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={isLibrary}
                                            onChange={handleChangeA}
                                            name="checkedA"
                                            sx={{
                                                color: '#252424',
                                                '&.Mui-checked': {
                                                    color: '#FF6812',
                                                },
                                            }}
                                        />
                                    }
                                    label={
                                        <Typography className='partial-score'>
                                            Partial Score
                                        </Typography>
                                    }
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>

                </Grid>

                <Grid item xs={6} textAlign="right" onClick={()=>setOpenModal(true)} cursor={'pointer'}>
                    <span className='add-test-case'>+ Add Test Cases</span>
                </Grid>

            </Grid>
            <Grid item md={12} alignItems={'center'} flex={1} pl={3} mt={2}>
                <TableContainer component="div" style={{ border: '1px solid #ddd' }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: '#F1F5F7', color: 'white', border: '1px solid #ddd' }}>
                                <TableCell style={{ border: '1px solid #ddd' }}>Input</TableCell>
                                <TableCell style={{ border: '1px solid #ddd' }}>Output</TableCell>
                                <TableCell style={{ border: '1px solid #ddd' }}>Score</TableCell>
                                <TableCell style={{ border: '1px solid #ddd' }}>Candidate Visibility</TableCell>
                                <TableCell style={{ border: '1px solid #ddd' }}>Explanation</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id} style={{ border: '1px solid #ddd' }}>
                                    <TableCell style={{ border: '1px solid #ddd', textAlign: 'center' }}>{row.input}</TableCell>
                                    <TableCell style={{ border: '1px solid #ddd', textAlign: 'center' }}>{row.output}</TableCell>
                                    <TableCell style={{ border: '1px solid #ddd', textAlign: 'center' }}>{row.score}</TableCell>
                                    <TableCell style={{ textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<IOSSwitch sx={{ m: 1 }} />}
                                            />
                                        </FormGroup>
                                    </TableCell>
                                    <TableCell style={{ border: '1px solid #ddd' }}>
                                        {expandedRows.includes(row.id) ? (
                                            <span>{row.explanation}</span>
                                        ) : (
                                            <>
                                                {row.explanation.length > 50 ? `${row.explanation.slice(0, 50)}... ` : row.explanation}
                                                {row.explanation.length > 30 && (
                                                    <Button size="small" style={{ color: '#FF6812', textTransform: 'none' }} onClick={() => handleReadMoreClick(row.id)}>
                                                        Read More ...
                                                    </Button>
                                                )}
                                            </>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
            <TestCaseModal isOpen={isOpen} closeModal={closeModal}/>
        </>
    );
};

export default TestCase;
