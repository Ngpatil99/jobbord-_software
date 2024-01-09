import { Grid } from '@mui/material';
import React from "react";
import info_icon from "../../assets/icon/info.svg";

import "./index.css";
const SkillValidation = (props) => {
    const { selectedSkill } = props;
    return (
    <>
        {selectedSkill&&<Grid container spacing={0} mt={1}>
        <Grid>
            <div className="skills-item-container">
                <span>{selectedSkill.label}</span>
                <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginLeft: "10px" }}
                >
                    <circle cx="10" cy="10.5" r="10" fill="#00C49A" />
                    <path
                        d="M13.5 7.75L8.6875 12.5625L6.5 10.375"
                        stroke="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
        </Grid>
        <Grid item xs={8} md={6} ml={2}>
            <div className="info-container">
                <div className="info">
                    <img
                        style={{ cursor: "pointer" }}
                        src={info_icon}
                        alt=""
                    />
                    <span>You can add only one skill at a time</span>
                </div>
            </div>
        </Grid>
    </Grid>}
    </>    
    
    )
}
export default SkillValidation;