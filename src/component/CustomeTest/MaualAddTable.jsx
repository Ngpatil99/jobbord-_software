import { Grid, TextField } from '@mui/material';
import React from "react";
import eastIcon from "../../assets/icon/easy-icon.svg";
import hardIcon from "../../assets/icon/hard-icon.svg";
import mediumIcon from "../../assets/icon/medium-icon.svg";

import "./index.css";
function SkillSetTable(props) {
    return (
        <Grid xs={12} md={8} mt={2}>
            <div className="skill-table">
                <table className="skillset" cellSpacing="0px">
                    <thead>
                        <tr>
                            <th>Difficulty</th>
                            <th>required Questions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ height: "42px" }}>
                                <img
                                    style={{ cursor: "pointer" }}
                                    src={eastIcon}
                                    alt=""
                                />
                                Easy
                            </td>
                            <td style={{ height: "42px" }}>
                                <TextField
                                    id={`textField-1`}
                                    type="text"
                                    size="small"
                                    style={{ width: '40px' }}
                                    InputProps={{
                                        inputProps: {
                                          type: 'number',
                                          pattern: '[0-9]*'
                                        },
                                      }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ height: "42px" }}>
                                <img
                                    onClick={props.closeSkillSetModel}
                                    style={{ cursor: "pointer" }}
                                    src={mediumIcon}
                                    alt=""
                                />
                                Medium
                            </td>
                            <td style={{ height: "42px" }}>
                                <TextField
                                    id={`textField-1`}
                                    type="text"
                                    size="small"
                                    style={{ width: '40px' }}
                                    InputProps={{
                                        inputProps: {
                                          type: 'number',
                                          pattern: '[0-9]*'
                                        },
                                      }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td style={{ height: "42px" }}>
                                <img
                                    onClick={props.closeSkillSetModel}
                                    style={{ cursor: "pointer" }}
                                    src={hardIcon}
                                    alt=""
                                />
                                Hard
                            </td>
                            <td style={{ height: "42px" }}>
                                <TextField
                                    id={`textField-1`}
                                    type="text"
                                    size="small"
                                    style={{ width: '40px' }}
                                    InputProps={{
                                        inputProps: {
                                          type: 'number',
                                          pattern: '[0-9]*'
                                        },
                                      }}
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Total Questions (35)</th>
                            <th>35</th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Grid>
    );
}

export default SkillSetTable;
