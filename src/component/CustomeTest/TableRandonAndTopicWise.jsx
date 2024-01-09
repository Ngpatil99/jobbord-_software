import axios from "axios";
import React, { useContext, useState } from "react";
import eastIcon from "../../assets/icon/easy-icon.svg";
import hardIcon from "../../assets/icon/hard-icon.svg";
import mediumIcon from "../../assets/icon/medium-icon.svg";
import CreateTestContext from "../../store/CreateTestContext";
import topic_icon from "../../assets/icon/topic-icon.svg";
import { Grid, TextField } from '@mui/material';
import "./index.css";
function SkillSetTable(props) {
    const { selectedTopics } = props;
    return (
        <Grid xs={12} md={12}>
            {selectedTopics.length > 0 && <div className="skill-table table-colum-auto-width">
                <table className="skillset" cellSpacing="0px">
                    <thead>
                        <tr>
                            <th>Topics</th>
                            <th>
                                <div className="centered-info">
                                    <img
                                        style={{ cursor: "pointer" }}
                                        src={eastIcon}
                                        alt=""
                                    />
                                    <p style={{ marginLeft: '6px' }}>Easy</p>
                                </div></th>
                            <th>
                                <div className="centered-info">
                                    <img
                                        onClick={props.closeSkillSetModel}
                                        style={{ cursor: "pointer" }}
                                        src={mediumIcon}
                                        alt=""
                                    />
                                    <p style={{ marginLeft: '6px' }}>Medium</p>

                                </div>
                            </th>
                            <th style={{ width: '600px !important' }}>
                                <div className="centered-info">
                                    <img
                                        onClick={props.closeSkillSetModel}
                                        style={{ cursor: "pointer" }}
                                        src={hardIcon}
                                        alt=""
                                    />
                                    <p style={{ marginLeft: '6px' }}>Hard</p>

                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedTopics?.map((item) => (
                            <tr key={item}>
                                <td style={{ height: "42px", verticalAlign: "middle", textAlign: "center" }}>
                                    <img
                                        style={{ cursor: "pointer" }}
                                        src={topic_icon}
                                        alt=""
                                    />
                                    {item} [30] (100)
                                </td>
                                <td style={{ height: "42px", verticalAlign: "middle", textAlign: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <TextField
                                            id={`textField-1`}
                                            type="text"
                                            size="small"
                                            style={{ width: '40px', marginRight: '5px' }}
                                            InputProps={{
                                                inputProps: {
                                                    type: 'number',
                                                    pattern: '[0-9]*'
                                                },
                                            }}
                                        />
                                        <span>(40)</span>
                                    </div>
                                </td>
                                <td style={{ height: "42px", verticalAlign: "middle", textAlign: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <TextField
                                            id={`textField-2`}
                                            type="text"
                                            size="small"
                                            style={{ width: '40px', marginRight: '5px' }}
                                            InputProps={{
                                                inputProps: {
                                                    type: 'number',
                                                    pattern: '[0-9]*'
                                                },
                                            }}
                                        />
                                        <span>(40)</span>
                                    </div>
                                </td>
                                <td style={{ height: "42px", verticalAlign: "middle", textAlign: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <TextField
                                            id={`textField-3`}
                                            type="text"
                                            size="small"
                                            style={{ width: '40px', marginRight: '5px' }}
                                            InputProps={{
                                                inputProps: {
                                                    type: 'number',
                                                    pattern: '[0-9]*'
                                                },
                                            }}
                                        />
                                        <span>(40)</span>
                                    </div>
                                </td>
                            </tr>
                        ))}



                        <tr>
                            <th>Total Questions (35)</th>
                            <th>35</th>
                            <th>0</th>
                            <th>10</th>
                        </tr>
                    </tbody>
                </table>
            </div>}
        </Grid>
    );
}

export default SkillSetTable;
