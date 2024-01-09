import { Grid, Typography } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import closeIcon from "../../assets/icon/close-icon.svg";
import easy_icon from "../../assets/icon/easy-icon.svg";
import hard_icon from "../../assets/icon/hard-icon.svg";
import medium_icon from "../../assets/icon/medium-icon.svg";
import "./index.css";
const deficulty = [
    { name: 'Easy', icon: easy_icon, color: '#00C49A' },
    { name: 'Medium', icon: medium_icon, color: '#FF9736' },
    { name: 'Hard', icon: hard_icon, color: '#FF5D00' },
];
const skills = [
    { label: 'Javascript', value: 1 },
    { label: 'Python', value: 2 },
];
const topic = [
    { label: 'React hooks', value: 1 },
    { label: 'React lifecycle', value: 2 },
];
const SkillSelection = () => {
    const state = useLocation();
    const navigate = useNavigate();
    const [selectedDifficulty, setDificulty] = useState('');
    const [selectedSkill, setSkillSelected] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [hoveredTopic, setHoveredTopic] = useState(null);
    const topics = ['Functions', 'OOPs Concepts', 'Array'];
    const skill = ['Javascript', 'Angular', 'React native'];
    const toggleTopic = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter((selected) => selected !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };
    const clearValue = () => {
        setSkillSelected("")
    }
    return (
        <>
            <Grid container mt={0} pl={2} pr={2}>
                <Grid item md={6} mt={2}>
                    <Typography className="que-type-tile">Skills</Typography>
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
                        onChange={(event, value) => {
                            setSkillSelected(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M4.375 4.375H4.38125" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {selectedSkill !== "" ? (
                                                <img
                                                    onClick={clearValue}
                                                    style={{ cursor: "pointer" }}
                                                    src={closeIcon}
                                                    alt=""
                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                    <path d="M8.25 15.1289C11.5637 15.1289 14.25 12.4426 14.25 9.12891C14.25 5.8152 11.5637 3.12891 8.25 3.12891C4.93629 3.12891 2.25 5.8152 2.25 9.12891C2.25 12.4426 4.93629 15.1289 8.25 15.1289Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15.7508 16.6287L12.4883 13.3662" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </>
                                    ),
                                    style: { borderColor: params.focused ? 'green' : 'initial' },
                                }}
                            />
                        )}
                    />
                     <Grid mt={1} ml={-1}>
                        {skill.map((topic) => (
                            <div
                                key={topic}
                                className={`${selectedTopics.includes(topic) ? 'choose-topic selected' : 'choose-topic-diselect'} ${hoveredTopic === topic ? 'hovered' : ''}`}
                                onClick={() => toggleTopic(topic)}
                                onMouseEnter={() => setHoveredTopic(topic)}
                                onMouseLeave={() => setHoveredTopic(null)}
                            >
                                <span className={`${selectedTopics.includes(topic) && hoveredTopic != topic ? 'choose-topic-name' : hoveredTopic === topic && selectedTopics.includes(topic) ? 'topic-name-hover' : 'diselect-topic-name'}`}>{topic}</span>
                                {selectedTopics.includes(topic) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <circle cx="10" cy="10.5" r="10" fill={hoveredTopic === topic ? '#F23E3B' : '#00C49A'} />
                                        {hoveredTopic === topic ? (
                                            <>
                                                <path d="M6.5 6.5L13.5 13.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.5 13.5L13.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                            </>
                                        ) : <><path d="M13 7.5L7 13.5" stroke="white" stroke-linecap="round" />
                                            <path d="M13 13.5L7.00019 7.50019" stroke="white" stroke-linecap="round" /></>}
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                        <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                        <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </Grid>
                </Grid>
                <Grid item md={6} pl={3} mt={2}>
                    <Typography className="que-type-tile">Topics</Typography>
                    <Autocomplete
                        disablePortal
                        id="combo-box-demo"
                        options={topic}
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
                        onChange={(event, value) => {
                            setSkillSelected(value);
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M4.375 4.375H4.38125" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </>
                                    ),
                                    endAdornment: (
                                        <>
                                            {selectedSkill !== "" ? (
                                                <img
                                                    onClick={clearValue}
                                                    style={{ cursor: "pointer" }}
                                                    src={closeIcon}
                                                    alt=""
                                                />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                    <path d="M8.25 15.1289C11.5637 15.1289 14.25 12.4426 14.25 9.12891C14.25 5.8152 11.5637 3.12891 8.25 3.12891C4.93629 3.12891 2.25 5.8152 2.25 9.12891C2.25 12.4426 4.93629 15.1289 8.25 15.1289Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M15.7508 16.6287L12.4883 13.3662" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </>
                                    ),
                                    style: { borderColor: params.focused ? 'green' : 'initial' },
                                }}
                            />
                        )}
                    />
                    <Grid mt={1} ml={-1}>
                        {topics.map((topic) => (
                            <div
                                key={topic}
                                className={`${selectedTopics.includes(topic) ? 'choose-topic selected' : 'choose-topic-diselect'} ${hoveredTopic === topic ? 'hovered' : ''}`}
                                onClick={() => toggleTopic(topic)}
                                onMouseEnter={() => setHoveredTopic(topic)}
                                onMouseLeave={() => setHoveredTopic(null)}
                            >
                                <span className={`${selectedTopics.includes(topic) && hoveredTopic != topic ? 'choose-topic-name' : hoveredTopic === topic && selectedTopics.includes(topic) ? 'topic-name-hover' : 'diselect-topic-name'}`}>{topic}</span>
                                {selectedTopics.includes(topic) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <circle cx="10" cy="10.5" r="10" fill={hoveredTopic === topic ? '#F23E3B' : '#00C49A'} />
                                        {hoveredTopic === topic ? (
                                            <>
                                                <path d="M6.5 6.5L13.5 13.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M6.5 13.5L13.5 6.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                                            </>
                                        ) : <><path d="M13 7.5L7 13.5" stroke="white" stroke-linecap="round" />
                                            <path d="M13 13.5L7.00019 7.50019" stroke="white" stroke-linecap="round" /></>}
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                        <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                        <path d="M13.5 7.75L8.6875 12.5625L6.5 10.375" stroke="#BDCCD3" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </Grid>
                </Grid>

            </Grid>
        </>
    );
}

export default SkillSelection;
