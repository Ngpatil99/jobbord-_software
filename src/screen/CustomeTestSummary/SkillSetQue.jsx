import { Checkbox, FormControlLabel, Grid, Radio, Tab, Tabs, TextField } from "@mui/material";
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queskill from "../../assets/icon/QueSkill.svg";
import down_icon from "../../assets/icon/down-icon.svg";
import eastIcon from "../../assets/icon/easy-icon.svg";
import hardIcon from "../../assets/icon/hard-icon.svg";
import info_white from "../../assets/icon/info-white.svg";
import list_icon from "../../assets/icon/list-icon.svg";
import mediumIcon from "../../assets/icon/medium-icon.svg";
import pencile from "../../assets/icon/pencile.svg";
import scrore_icon from "../../assets/icon/scrore-icon.svg";
import CreateTestContext from "../../store/CreateTestContext";
import que_type_icon from "../../assets/icon/QueType-White.svg";
import trach_icon from "../../assets/icon/remove.svg";
import "./index.css";
const names = [
    'Manage Skillset',
    'Choose From Library',
    'Create New Question',
];
const queData = [
    { que: 'Q1.What are Java Clusters?', score: '10', que_type: 'MCQ' },
    { que: 'Q1.What are Java Clusters?', score: '10', que_type: 'Programming' },
    { que: 'Q3.Aenean sit amet interdum nisl, porta vehicula enim?', score: '10', que_type: 'MCQ' }
]
const tabData = [
    { label: 'Inheritance', count: 30, icon: eastIcon, backgroundColor: '#00C49A' },
    { label: 'OOPs Concepts', count: 20, icon: mediumIcon, backgroundColor: '#FF9736' },
    { label: 'Array', count: 20, icon: hardIcon, backgroundColor: '#FF6812' },
];
function SkillSetQuestions() {
    const state = useLocation();
    const navigate = useNavigate();
    const createTestContext = useContext(CreateTestContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const open = Boolean(anchorEl);

    const [tabValue, setTabValue] = useState(1);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMenuItemClick = (name) => {
        setSelectedItem(name);
    };
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };
    const MyTabs = ({ tabData, tabValue, handleTabChange }) => {
        return (
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="fullWidth"
                indicatorColor="transparent"
                style={{ border: '1px solid #ddd' }}
            >
                {tabData.map((tab, index) => (
                    <Tab
                        key={index}
                        label={
                            <span className="tab-lebel" style={{ textTransform: 'none' }}>
                                {`${tab.label} (${tab.count}) `}
                                {tabValue === index ? (
                                    <img style={{ verticalAlign: 'middle' }} src={que_type_icon} alt="" />
                                ) : (
                                    <img style={{ verticalAlign: 'middle' }} src={tab.icon} alt="" />
                                )}
                            </span>
                        }
                        style={{
                            backgroundColor: tabValue === index ? tab.backgroundColor : 'transparent',
                            color: tabValue === index ? '#fff' : '#333333',
                        }}
                    />
                ))}
            </Tabs>
        );
    };
 
   return (
        <div className="test-2-content">
            <Grid container>
                <Grid item xs={6} md={3}>
                    <div className="left-icon-with-text">
                        <img
                            style={{ cursor: "pointer" }}
                            src={queskill}
                            alt="Left Icon"

                        />
                        <span>Java Skillset (70)  </span>
                    </div>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="space-between">
                <Grid item xs={6} md={8}>
                    <MyTabs tabData={tabData} tabValue={tabValue} handleTabChange={handleTabChange} />
                </Grid>
                <Grid item xs={6} md={4} container alignItems="center" justifyContent="flex-end">
                    <div className="left-icon-with-text-score">
                        <img
                            style={{ cursor: "pointer" }}
                            src={scrore_icon}
                            alt="Left Icon"
                        />
                        <span>Total Score: 70</span>
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
                                    <MenuItem key={name} value={name} selected={name === selectedItem}
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
                <Grid container alignItems="center" justifyContent="space-between">
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
            </Grid>
        </div>
    );
}

export default SkillSetQuestions;
