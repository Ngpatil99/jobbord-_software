import { Grid, Radio } from "@mui/material";
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import down_icon from "../../assets/icon/down-icon.svg";
import eastIcon from "../../assets/icon/easy-icon.svg";
import hardIcon from "../../assets/icon/hard-icon.svg";
import info_white from "../../assets/icon/info-white.svg";
import list_icon from "../../assets/icon/list-icon.svg";
import scrore_icon from "../../assets/icon/scrore-icon.svg";
import skill from "../../assets/icon/QueSkill.svg";
import mediumIcon from "../../assets/icon/medium-icon.svg";
import CreateTestContext from "../../store/CreateTestContext";
import "./index.css";
const names = [
    'Manage Skillset',
    'Choose From Library',
    'Create New Question',
];
function SelectedQuestions() {
    const state = useLocation();
    const navigate = useNavigate();
    const createTestContext = useContext(CreateTestContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMenuItemClick = (name) => {
        setSelectedItem(name);
    };
    return (
        <div className="test-2-content">
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={6} md={3}>
                    <div className="left-icon-with-text">
                        <img
                            style={{ cursor: "pointer" }}
                            src={skill}
                            alt="Left Icon"
                        />
                        <span>Javascript Skillset (35)</span>
                    </div>
                </Grid>
                <Grid item xs={6} md={2}>
                    <div className="left-icon-with-text">
                        <span>(Random - 35)</span>
                    </div>
                </Grid>
                <Grid item xs={6} md={7} container alignItems="center" justifyContent="flex-end">
                    <div className="left-icon-with-text-score">
                        <img
                            style={{ cursor: "pointer" }}
                            src={scrore_icon}
                            alt="Left Icon"
                        />
                        <span>Total Score: 50</span>
                    </div>
                    <div className="outer-container">
                        <div className="button-container">
                            <div className="all-icon-lebel" style={{ padding: 4 }} onClick={handleClick}>
                                <span className="all-icon-lebel">All</span>
                                <img
                                    style={{ cursor: "pointer", marginLeft: 1 }}
                                    src={down_icon}
                                    alt="Down Icon"
                                />
                            </div>
                            <Menu
                                id="fade-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'fade-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                TransitionComponent={Fade}
                              
                            >
                                {names.map((name) => (
                                    <MenuItem  key={name} value={name} selected={name === selectedItem}
                                        onClick={() => handleMenuItemClick(name)} style={{ backgroundColor: name === selectedItem ? '#384455' : 'transparent' }}>
                                        <Radio size='2' checked={true} style={{ color: name === selectedItem ? "#FFFF" : '#384455' }} />
                                        <ListItemText primary={name} style={{ color: name === selectedItem ? '#FFFF' : '#384455' }} />
                                    </MenuItem>
                                ))}
                            </Menu>
                        </div>

                        <div className="icon-container">
                            <img
                                style={{ cursor: "pointer" }}
                                src={list_icon}
                                alt="List Icon"
                            />
                        </div>
                    </div>
                </Grid>
                <Grid border={1} borderColor={'#DDD'} padding={2} width={'100%'}>
                <Grid container spacing={0}>
                    <Grid item xs={6} md={2}>
                        <div className="info-container-left">
                            <div className="info">
                                <img src={eastIcon} alt="" />
                                <span>{"Easy (10)"}</span>
                            </div>
                        </div>
                    </Grid>

                    <Grid item xs={6} md={10}>
                        <div className="info-container-success">
                            <div className="info">
                                <img
                                    style={{ cursor: "pointer", backgroundColor: '#00C49A', padding: '11px', marginRight: '2px' }}
                                    src={info_white}
                                    alt=""
                                />
                                <span>{"10 Easy questions from this skillset are randomly selected & displayed in the test"}</span>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={6} md={2}>
                        <div className="info-container-left">
                            <div className="info">
                                <img src={mediumIcon} alt="" />
                                <span>{"Medium (10)"}</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={10}>
                        <div className="info-container-warning">
                            <div className="info">
                                <img
                                    style={{ cursor: "pointer", backgroundColor: '#FF9736', padding: '11px', marginRight: '2px' }}
                                    src={info_white}
                                    alt=""
                                />
                                <span>{"10 Medium questions from this skillset are randomly selected & displayed in the test"}</span>
                            </div>
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={0}>
                    <Grid item xs={6} md={2}>
                        <div className="info-container-left">
                            <div className="info">
                                <img src={hardIcon} alt="" />
                                <span>{"Hard (15)"}</span>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={6} md={10}>
                        <div className="info-container-danger">
                            <div className="info">
                                <img
                                    style={{ cursor: "pointer", backgroundColor: '#FF6812', padding: '11px', marginRight: '2px' }}
                                    src={info_white}
                                    alt=""
                                />
                                <span>{"15 Hard questions from this skillset are randomly selected & displayed in the test"}</span>
                            </div>
                        </div>
                    </Grid>
                </Grid>

            </Grid>
            </Grid>
          
        </div>

    );
}

export default SelectedQuestions;
