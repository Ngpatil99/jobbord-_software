import axios from "axios";
import React, { useContext, useState } from "react";
import eastIcon from "../../assets/icon/easy-icon.svg";
import hardIcon from "../../assets/icon/hard-icon.svg";
import mediumIcon from "../../assets/icon/medium-icon.svg";
import CreateTestContext from "../../store/CreateTestContext";
import { Grid,TextField } from '@mui/material';
import "./index.css";
function SkillSetTable(props) {
  const { queType } = props;
  return (
    <Grid xs={12} md={10}>
      <div className="skill-table">
        <table className="skillset" cellSpacing="0px">
          <thead>
            <tr>
              <th>Difficulty</th>
              <th>Random Questions</th>
              <th>Fixed Questions</th>
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
                Easy {queType == "from_library" && `(100)`}
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
                Medium {queType == "from_library" && `(50)`}
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
                Hard {queType == "from_library" && `(100)`}
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
              <th>0</th>
            </tr>
          </tbody>
        </table>
      </div>
    </Grid>
  );
}

export default SkillSetTable;
