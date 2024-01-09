import "./index.css";
import { Grid, Typography } from "@mui/material";
import TextField from '@mui/material/TextField';
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import discard_icon from "../../assets/icon/fill-cross.svg";
import question from "../../assets/icon/questions.svg";
import same_icon from "../../assets/icon/fill-right-tick.svg";
import easy_icon from "../../assets/icon/easy-icon.svg";
import medium_icon from "../../assets/icon/medium-icon.svg";
import hard_icon from "../../assets/icon/hard-icon.svg";
import SkillSelection from "./SkillSelection";
import ProblemSolution from "./ProblemSolution";
import TestCase from "./TestCase";
import AllowedQue from "./AllowedQue";
import UploadIdeal from "./UploadIdeal";
const deficulty = [
    { name: 'Easy', icon: easy_icon, color: '#00C49A' },
    { name: 'Medium', icon: medium_icon, color: '#FF9736' },
    { name: 'Hard', icon: hard_icon, color: '#FF5D00' },
];
const Layout = () => {
    const state = useLocation();
    const navigate = useNavigate();
    const [selectedDifficulty, setDificulty] = useState('');
    const [isOpen,setOpenModal]=useState(false);
    const handleDifficulty = (name) => {
        setDificulty(name)
    }
    const closeModal =()=>{
        setOpenModal(false);
    }
    return (
        <Grid pb={20}>
            <Grid container spacing={1} p={2}>
                <Grid item md={4}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            style={{ cursor: 'pointer', marginRight: '8px' }}
                            src={question}
                            alt=""
                        />
                        <Typography className="title">Create Question</Typography>
                    </div>
                </Grid>
                <Grid item md={8}>
                    <div className="layout-button-container">
                        <div
                            className="back-button"
                            onClick={() => navigate("/questionsoverview")}
                        >
                            <img
                                style={{ cursor: "pointer" }}
                                src={discard_icon}
                                alt=""
                            />
                            <span>Discard</span>
                        </div>
                        <div
                            className="next-button"
                            onClick={() => navigate("/questionsoverview")}
                        >
                            <img
                                style={{ cursor: "pointer" }}
                                src={same_icon}
                                alt=""
                            />
                            <span>Save</span>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <Grid p={2}>
            <Grid container p={1}>
                <Grid md={4}>
                    <Typography className="que-type-tile">Question Title</Typography>
                    <TextField
                        id={`textField-1`}
                        type="text"
                        size="small"
                        // placeholder="Javascript Question"
                        style={{ width: '100%', marginTop: '10px' }}
                        InputProps={{
                            style: { color: 'black' }, // Set the placeholder color to black
                        }}
                    />
                </Grid>
                <Grid md={2} pl={3}>
                    <Typography className="que-type-tile">Score</Typography>
                    <TextField
                        id={`textField-1`}
                        type="text"
                        size="small"
                        placeholder="Enter Maximum Score"
                        style={{ width: '100%', marginTop: '10px' }}
                        InputProps={{
                            inputProps: {
                                type: 'number',
                                pattern: '[0-9]*'
                            },
                        }}
                    />
                </Grid>
                <Grid item md={6} pl={3}>
                    <Typography className="que-type-tile" ml={2}>Difficulty</Typography>
                    <Grid container spacing={2} justifyContent={'end'} mt={1} display={'flex'}>
                        {deficulty.map((item, index) => ( 
                            <div key={index} style={{ margin: '0 5px' }}>
                                <Grid item md={2} onClick={() => handleDifficulty(item.name)}>
                                    <div className="dificulty-tile" style={{
                                        borderColor: selectedDifficulty === item.name ? item.color : '#DDD',
                                    }}>
                                        <img
                                            style={{ cursor: 'pointer', marginRight: '8px' }}
                                            src={item.icon}
                                            alt=""
                                        />
                                        <span>{item.name}</span>
                                    </div>
                                </Grid>
                            </div>
                        ))}
                    </Grid>

                </Grid>
            </Grid>

            <SkillSelection />
            <ProblemSolution />
            <TestCase />
            <AllowedQue />
            </Grid>
        </Grid>
    );
}

export default Layout;
