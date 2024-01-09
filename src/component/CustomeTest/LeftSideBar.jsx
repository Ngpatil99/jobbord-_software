import { Box, Grid } from '@mui/material';
import React, { useContext, useState } from "react";
import eye_icon from "../../assets/icon/eye-icon.svg";
import skill from "../../assets/icon/skill.svg";
import CreateTestContext from "../../store/CreateTestContext";
import "./index.css";
function LeftSideBar(props) {
    const { selectedSkill } = props;
    const createTestContext = useContext(CreateTestContext);
    const [type, setType] = useState("");
    const [checkedA, setCheckedA] = React.useState(false);
    const [checkedB, setCheckedB] = React.useState(false);

    const handleChangeA = (event) => {
        setCheckedA(event.target.checked);
    };

    const handleChangeB = (event) => {
        setCheckedB(event.target.checked);
    };
    const [selectedValue, setSelectedValue] = React.useState('optionA');

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const [switchA, setSwitchA] = React.useState(false);
    const [switchB, setSwitchB] = React.useState(false);

    const handleChangeA1 = (event) => {
        setSwitchA(event.target.checked);
    };

    const handleChangeB1 = (event) => {
        setSwitchB(event.target.checked);
    };
    return (
        <Grid item xs={4} md={2.5} className='left-side-bg'>
            <div>
                <span className='all-skill-set-text'>All Skillsets</span>
                {selectedSkill && <Box
                    display="flex"
                    alignItems="center"
                    borderLeft={6}
                    pl={2}
                    pr={2}
                    bgcolor="#F0F7FB"
                    borderColor="#00C49A"
                    mt={6}
                    mr={2}
                    ml={1}
                >
                    <span className='skill-label'>{selectedSkill.label}</span>
                    <Box marginLeft="auto" mt={0.5}>
                        <img
                            onClick={props.closeSkillSetModel}
                            style={{ cursor: "pointer" }}
                            src={eye_icon}
                            alt=""
                        />
                    </Box>
                </Box>}
                {/* <Box
                        display="flex"
                        alignItems="center"
                        pl={2}
                        pr={2}
                        mt={2}
                        mr={2}
                        ml={1}
                    >
                        <span className='skill-label'>Angular JS (40)</span>
                    </Box> */}
            </div>
            <div className="button button-skill-set" style={{ marginTop: "5px", display: 'flex', justifyContent: 'flex-end' }}>
                <div className="button" style={{ marginTop: "5px" }}>
                    <div className="add-skill-btn" onClick={props.closeSkillSetModel}>
                        <img
                            onClick={props.closeSkillSetModel}
                            style={{ cursor: "pointer" }}
                            src={skill}
                            alt=""
                        />
                        <button>Add Skillset</button>
                    </div>
                </div>
            </div>
        </Grid>
    );
}

export default LeftSideBar;
