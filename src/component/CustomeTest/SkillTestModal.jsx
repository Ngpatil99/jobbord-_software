import { Box, FormControlLabel, FormGroup, Grid, Modal, Typography, makeStyles } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React, { useContext, useState } from "react";
import closeIcon from "../../assets/icon/close-icon.svg";
import info_black from "../../assets/icon/info-black.svg";
import line from "../../assets/icon/line.svg";
import CreateTestContext from "../../store/CreateTestContext";
import Buttons from "./Buttons";
import { IOSSwitch } from "./CustomeSwitch";
import LeftSideBar from './LeftSideBar';
import LibraryQuetionSelection from './LibraryQueSelection';
import SkillSetTable from "./SkillSetTable";
import SkillValidation from "./SkillValidation";
import Warning from "./Warning";
import LibraryTable from "./LibraryTable";
import TabelRandomAndTopicWise from "./TableRandonAndTopicWise";
import ManualAddTable from "./MaualAddTable";
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
const skills = [
    { label: 'Javascript', value: 1 },
    { label: 'Python', value: 2 },
];

const questionType = [
    { label: 'MCQ', value: 1 },
    { label: 'Programing', value: 2 },
]

function AddSkillSet(props) {
    const createTestContext = useContext(CreateTestContext);
    const [isLibrary, setLibrary] = React.useState(false);
    const [isManuallyAdd, setMaunal] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');
    const [randomQue, setRandomQue] = useState({
        name: "",
        value: false
    });
    const [selectedSkill, setSkillSelected] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [hoveredTopic, setHoveredTopic] = useState(null);
    const topics = ['Javascript', 'OOPs Concepts', 'Array'];
    const toggleTopic = (topic) => {
        if (selectedTopics.includes(topic)) {
            setSelectedTopics(selectedTopics.filter((selected) => selected !== topic));
        } else {
            setSelectedTopics([...selectedTopics, topic]);
        }
    };
    const handleSwitchChange = (name) => (event) => {
        let obj = {
            name: event.target.checked ? name : "",
            value: event.target.checked
        }
        setRandomQue(obj);
    };
    const handleChangeA = (event) => {
        setLibrary(event.target.checked);
    };

    const handleChangeB = (event) => {
        setMaunal(event.target.checked);
    };
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };
    const clearValue = () => {
        setSkillSelected("")
    }
    return (
        <div>
            <Modal
                open={props.addSkill}
                onClose={props.closeSkillSetModel}>

                <Box sx={{ ...style, width: '80%', border: 'none' }}>
                    <Grid container spacing={0}>
                        <LeftSideBar selectedSkill={selectedSkill} />
                        <Grid item xs={8} md={9.5}>
                            <div className='modal-heading-label'>
                                <span className='add-manage'>Add / Manage Skillset</span>
                                <img onClick={props.closeSkillSetModel}
                                    style={{ cursor: "pointer" }}
                                    src={closeIcon}
                                    alt=""
                                />
                            </div>
                            <img src={line} alt="" className='line-width' />
                            <Grid container spacing={2} mt={2}>
                                <Grid item xs={4} md={3.5}>
                                    <span className='label'>Choose Skill</span>
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={skills}
                                        sx={{
                                            width: 'auto', marginTop: '10px', height: '47px', "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                                            {
                                                borderColor: "#00C49A",
                                                borderWidth: '1.5px',
                                            },
                                            "& .MuiAutocomplete-hasPopupIcon.css-14ijsjj-MuiAutocomplete-root .MuiOutlinedInput-root": {
                                                paddingRight: '10px !important'
                                            }
                                        }}
                                        onChange={(event, value) => {
                                            setSkillSelected(value);
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                style={{ paddingRight: '9px' }}
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                                <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M4.375 4.375H4.38125" stroke="#333333" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        </>
                                                    ),
                                                    endAdornment: (
                                                        <>
                                                            {selectedSkill != "" ? <img onClick={clearValue}
                                                                style={{ cursor: "pointer" }}
                                                                src={closeIcon}
                                                                alt=""
                                                            /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                                <path d="M8.25 15.1289C11.5637 15.1289 14.25 12.4426 14.25 9.12891C14.25 5.8152 11.5637 3.12891 8.25 3.12891C4.93629 3.12891 2.25 5.8152 2.25 9.12891C2.25 12.4426 4.93629 15.1289 8.25 15.1289Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M15.7508 16.6287L12.4883 13.3662" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>}
                                                        </>
                                                    ),
                                                    style: { borderColor: params.focused ? 'green' : 'initial' },
                                                }}
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid item xs={4} md={3}>
                                    <FormControl sx={{ minWidth: 220, height: '47px' }}>
                                        <span className='label'>Question Type</span>
                                        <Select
                                            labelId="select-skill-2-label"
                                            id="select-skill-2"
                                            // label="Choose Skill 2"
                                            style={{ marginTop: '10px' }}
                                        >
                                            {questionType.map((question) => (
                                                <MenuItem key={question} value={question}>
                                                    {question.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                {selectedValue !== "manually_added" && <Grid item xs={4} md={3} ml={3}>
                                    <FormControl sx={{ minWidth: 150 }}>
                                        <span className='label'>Total Available Questions</span>
                                        <div className="bordered-container">
                                            <span className="centered-text">300</span>
                                        </div>
                                    </FormControl>
                                </Grid>}
                            </Grid>
                            <SkillValidation selectedSkill={selectedSkill} />
                            <LibraryQuetionSelection
                                handleChangeA={handleChangeA}
                                selectedValue={selectedValue}
                                isLibrary={isLibrary}
                                handleChange={handleChange}
                                isManuallyAdd={isManuallyAdd}
                                handleChangeB={handleChangeB}
                            />
                            <div>
                                <FormGroup row style={{ marginTop: '7px' }}>
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={randomQue.value && randomQue.name === "OnlyRandom"} onChange={handleSwitchChange('OnlyRandom')} />}
                                        label={
                                            <Typography variant="body2" style={{ display: "flex", alignItems: "center" }}>
                                                <span className="radio-label">Only Random </span>
                                                <Tooltip title="Only random" arrow placement="top">
                                                    <img
                                                        style={{ cursor: "pointer", marginLeft: '5px' }}
                                                        src={info_black}
                                                        alt=""
                                                    />
                                                </Tooltip>
                                            </Typography>
                                        }
                                    />

                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={randomQue.value && randomQue.name === "RandomTopicWise"} onChange={handleSwitchChange('RandomTopicWise')} />}
                                        label={
                                            <Typography variant="body2" style={{ display: "flex", alignItems: "center" }}>
                                                <span className="radio-label">Random & Topic wise </span>
                                                <Tooltip title="Tooltip for Random & Topic Wise" arrow placement="top">
                                                    <img
                                                        style={{
                                                            cursor: "pointer", marginLeft: '5px'
                                                        }}
                                                        src={info_black}
                                                        alt=""
                                                    />
                                                </Tooltip>
                                            </Typography>
                                        }
                                    />
                                    <FormControlLabel
                                        control={<IOSSwitch sx={{ m: 1 }} checked={randomQue.value && randomQue.name === "FixedTopicWise"} onChange={handleSwitchChange('FixedTopicWise')} />}
                                        label={
                                            <Typography variant="body2" style={{ display: "flex", alignItems: "center" }}>
                                                <span className="radio-label">Fixed & Topic wise </span>
                                                <Tooltip title="Tooltip for Fixed & Topic Wise" arrow placement="top">
                                                    <img
                                                        style={{
                                                            cursor: "pointer", marginLeft: '5px'
                                                        }}
                                                        src={info_black}
                                                        alt=""
                                                    />
                                                </Tooltip>
                                            </Typography>
                                        }
                                    />
                                </FormGroup>
                            </div>
                            {randomQue.name === 'OnlyRandom' && randomQue.value && <>
                                <Grid mt={3}>
                                    <SkillSetTable queType={selectedValue} />
                                </Grid>
                                <Warning msg={"Random questions should be less than no. of available questions"} />
                            </>}

                            {(randomQue.name === 'RandomTopicWise' || randomQue.name === 'FixedTopicWise') && randomQue.value && <>
                                <Grid mt={2}><span className='label'>Choose Topics</span>
                                    <Grid>
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
                                                        ) : <path d="M13.5 7.75L8.6875 12.5625L6.5 10.375" stroke="white" strokeLinecap="round" strokeLinejoin="round" />}
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
                                <Grid mt={2}>
                                    <TabelRandomAndTopicWise selectedTopics={selectedTopics} />
                                </Grid>
                                {selectedTopics.length > 0 && <Warning msg={"Error : Inheritance easy questions should always be less than 40"} />
                                }                            </>}
                                {selectedValue === "from_library" && randomQue.name != 'RandomTopicWise' && randomQue.name != 'OnlyRandom' && randomQue.name != 'FixedTopicWise' &&
                                <>
                                    <LibraryTable />
                                    <Warning msg={"Total no. of reuired question should be less than the total no. of available questions."} />
                                </>

                                 }
                                {selectedValue === "manually_added" && randomQue.name != 'RandomTopicWise' && randomQue.name != 'OnlyRandom' && randomQue.name != 'FixedTopicWise' &&
                                <>
                                    <ManualAddTable />
                                    <Warning msg={"Total no. of reuired question should be less than the total no. of available questions."} />
                                </>

                             }
                            <Buttons eventHandle={props} />
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}

export default AddSkillSet;
