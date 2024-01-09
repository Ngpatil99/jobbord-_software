import { Checkbox, FormControlLabel, Grid, Radio, Tab, Tabs, TextField } from "@mui/material";
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import React, { useContext, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import queskill from "../../assets/icon/QueSkill.svg";
import down_icon from "../../assets/icon/down-icon.svg";
import plus from "../../assets/icon/plus-icon.svg";
import file from "../../assets/icon/file.svg";
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

]
function SelectedQuestions() {
    const state = useLocation();
    const navigate = useNavigate();
    const createTestContext = useContext(CreateTestContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isAllChecked, setAllQue] = useState([]);
    const [isQueRemoved, setRemovedQue] = useState(false);
    const [queData, setQueData] = useState([{ que: 'Q1.What are Java Clusters?', score: '10', que_type: 'MCQ', id: 1 },
    { que: 'Q1.What are Java Clusters?', score: '10', que_type: 'Programming', id: 2 },
    { que: 'Q3.Aenean sit amet interdum nisl, porta vehicula enim?', score: '10', que_type: 'MCQ', id: 3 }])
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
    const handleAllCheck = (event) => {
        if (event.target.checked) {
            setAllQue([1, 2, 3]);
        } else {
            setAllQue([]);
        }
    };
    const handleSingleCheck = (event, id) => {
        if (event.target.checked) {
            setAllQue((prevCheckedIds) => [...prevCheckedIds, id]);
        } else {
            setAllQue((prevCheckedIds) =>
                prevCheckedIds.filter((checkedId) => checkedId !== id)
            );
        }
    }
    const handleRemoveQue = useCallback(() => {
        setRemovedQue(true);
        setQueData([]);
    }, [])
    return (
        <div className="test-2-content">
            <Grid>
            <Grid container>
                <Grid item xs={6} md={3}>
                    <div className="left-icon-with-text">
                        <img
                            style={{ cursor: "pointer" }}
                            src={queskill}
                            alt="Left Icon"

                        />
                        <span>Angular JS Skillset (40) </span>
                    </div>
                </Grid>
                <Grid item xs={6} md={3}>
                    <div className="left-icon-with-text">
                        <span>(Random - 35 & Fixed - 5)</span>
                    </div>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="space-between" mt={2}>
                <Grid item xs={6} md={6} className="p-tabs">
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        indicatorColor="transparent"
                        style={{ border: '1px solid #ddd' }}
                    >
                        <Tab
                            label={<span className="tab-lebel" style={{ textTransform: 'none' }}>
                                {tabValue === 0 && <FormControlLabel
                                    control={<Checkbox style={{ color: '#FFF' }}
                                        onChange={handleAllCheck}
                                        name="easy" />} />} Easy (1) {tabValue === 0 ? <img style={{ verticalAlign: 'middle' }} src={que_type_icon} alt="" /> : <img style={{ verticalAlign: 'middle' }} src={eastIcon} alt="" />}</span>}
                            style={{
                                backgroundColor: tabValue === 0 ? '#00C49A' : 'transparent',
                                color: tabValue === 0 ? '#fff' : '#333333',
                            }}
                        />
                        <Tab
                            label={<span className="tab-lebel" style={{ textTransform: 'none' }}>
                                {tabValue === 1 && <FormControlLabel
                                    control={<Checkbox onChange={handleAllCheck} style={{ color: '#FFF' }} />} />}Medium (3) {tabValue === 1 ? <img style={{ verticalAlign: 'middle' }} src={que_type_icon} alt="" /> : <img style={{ verticalAlign: 'middle' }} src={mediumIcon} alt="" />}</span>}
                            style={{
                                backgroundColor: tabValue === 1 ? '#FF9736' : 'transparent',
                                color: tabValue === 1 ? '#fff' : '#333333',
                            }}
                        />
                        <Tab
                            label={<span className="tab-lebel" style={{ textTransform: 'none' }}>
                                {tabValue === 2 && <FormControlLabel
                                    control={<Checkbox onChange={handleAllCheck} style={{ color: '#FFF' }} />} />}Hard (1) {tabValue === 2 ? <img style={{ verticalAlign: 'middle' }} src={que_type_icon} alt="" /> : <img style={{ verticalAlign: 'middle' }} src={hardIcon} alt="" />}</span>}
                            style={{
                                backgroundColor: tabValue === 2 ? '#FF6812' : 'transparent',
                                color: tabValue === 2 ? '#fff' : '#333333',
                            }}
                        />
                    </Tabs>
                </Grid>
                <Grid item xs={6} md={6} container alignItems="center" justifyContent="flex-end">
                    {!isQueRemoved && <div className="left-icon-with-text-score" onClick={handleRemoveQue}>
                        <img
                            style={{ cursor: "pointer" }}
                            src={trach_icon}
                            alt="Left Icon"
                        />
                        <span style={{ color: '#F23E3E', marginRight: 5 }}>Remove Questions</span>
                    </div>}
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
                <Grid border={1.5} borderColor={tabValue === 0 ? '#00C49A' : tabValue === 1 ? '#FF9736' : '#FF6812'} padding={2} width={'100%'}>
                    {queData.length < 1 &&
                        <Grid md={10}>
                            <div className="buttons-container">
                                <Grid container spacing={1} direction={'row'} justifyContent={'center'} p={3}>
                                    <Grid item xs={4} md={3}>
                                        <div
                                            className="Choose-From-Library"
                                        >
                                            <img
                                                style={{ cursor: "pointer" }}
                                                src={file}
                                                alt=""
                                            />
                                            <span>Choose From Library</span>
                                        </div>
                                    </Grid>
                                    <Grid item xs={4} md={3}>
                                        <div
                                            className="Create-New-Question"
                                            onClick={() => {
                                            }}
                                        >
                                            <img
                                                style={{ cursor: "pointer" }}
                                                src={plus}
                                                alt=""
                                            />

                                            <span>Create New Question</span>
                                        </div>
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    }
                    {queData.map((item) => (
                        <div className={'que-container'}>
                            <FormControlLabel
                                control={<Checkbox value={item.id} checked={isAllChecked.includes(item.id)}
                                    onChange={(event) => handleSingleCheck(event, item.id)}
                                    sx={{
                                        '&.Mui-checked': {
                                            color:tabValue === 0 ? '#00C49A' : tabValue === 1 ? '#FF9736' : '#FF6812' ,
                                        }
                                    }} />}
                                label={<Typography variant="body2" color="#696767" >{item.que}</Typography>}
                            />
                            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography color="#696767" className="score-label" style={{ display: 'flex', alignItems: 'center' }}>
                                    Score:
                                    <TextField
                                        value={10}
                                        id={`textField-1`}
                                        type="text"
                                        size="small"
                                        style={{ width: '50px', marginLeft: '8px' }}
                                    />
                                </Typography>
                                <Typography color="#696767" ml={3} className="mcq-label">
                                    {item.que_type}
                                </Typography>
                                <IconButton color="primary" aria-label="edit">
                                    <img
                                        style={{ cursor: "pointer" }}
                                        src={pencile}
                                        alt="List Icon"
                                    />
                                </IconButton>
                                {/* <IconButton color="secondary" aria-label="delete">
                              <img
                                  style={{ cursor: "pointer" }}
                                  src={trashIcon}
                                  alt="List Icon"
                              />
                              </IconButton> */}
                            </div>
                        </div>
                    ))}
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
            </Grid>
        </div>
    );
}

export default SelectedQuestions;
