import "./index.css";
import { Grid } from "@mui/material";
import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import back_icon from "../../assets/icon/back.svg";
import file from "../../assets/icon/file.svg";
import next_icon from "../../assets/icon/forword.svg";
import plus from "../../assets/icon/plus-icon.svg";
import question from "../../assets/icon/questions.svg";
import reading from "../../assets/icon/reading.svg";
import skill from "../../assets/icon/skill.svg";
import CreateTest2Sidebar from "../../component/CreateTest2Sidebar";
import AddSkillSet from "../../component/CustomeTest/SkillTestModal";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import TestCreationDataLossPopup from "../../component/TestCreationDataLossPopup";
import CreateTestContext from "../../store/CreateTestContext";
import SelectedQuestions from "./SelectedQuestions";
import info_icon from "../../assets/icon/info.svg";
import QuestionsDetails from "./QuestionsDetails";
import SkillSetQue from "./SkillSetQue";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const names = [
  'Manage Skillset',
  'Choose From Library',
  'Create New Question',
];
function CustomTestSummary() {
  const state = useLocation();
  const navigate = useNavigate();
  const createTestContext = useContext(CreateTestContext);
  const [loading, setloading] = useState(false);
  const [isNavItem, setisNavItem] = useState(false);
  const [selectedNavItem, setselectedNavItem] = useState("");
  const [finishStatus, setfinishStatus] = useState(false);
  const [addSkillSetModel, setAddSkillSetModel] = useState(false);
  const [saveData, setSaveData] = useState(false);
  const saveAsDraft = async () => {
    setloading(true);

  };
  const navigatePage = (page) => {
    navigate(page);
    createTestContext.clearState();
  };
  const closeSkillSetModel = () => {
    setAddSkillSetModel(false);
  };
  const saveQueData = () => {
    setSaveData(true);
    setAddSkillSetModel(false);
  }
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };
  return (
    <div className="create-test-2-container">
      <NavigationBar
        onClickNavItem={(page) => {
          setselectedNavItem(page);
          setisNavItem(true);
        }}
        onClickSaveAsDraft={() => saveAsDraft()}
        loadingDraft={loading}
        saveAsDraft={true}
        assessment2={false}
      />
      {isNavItem && 
        <TestCreationDataLossPopup
          closeButton={() => {
            setisNavItem(false);
            setfinishStatus(false);
          }}
          onClickNo={() => {
            setisNavItem(false);
            setfinishStatus(false);
          }}
          onClickYes={() => {
            navigatePage("/assessment");
            setfinishStatus(true);
          }}
        />}
      

      <AddSkillSet
        addData={""}
        closeSkillSetModel={closeSkillSetModel}
        addSkill={addSkillSetModel}
        saveData={saveQueData}
      />

      <div className="create-test-2">
        <div className="create-test-2-sidebar">
          <CreateTest2Sidebar active="Questions" pageNo="2" />
        </div>

        <div className="create-test-2-content">
          <div className="test-2-content">
            <div className="col">
              <div className="header">
                <div className="title">
                  <img
                    style={{ cursor: "pointer" }}
                    src={question}
                    alt=""
                  />
                  <div className="group">
                    <span>Questions</span>
                    <p>
                      Overview of all questions from skillset
                    </p>
                  </div>
                </div>

                <div className="button-container">
                  <div
                    className="back-button"
                    onClick={() => navigate("/questionsoverview")}
                  >
                    <img
                      style={{ cursor: "pointer" }}
                      src={back_icon}
                      alt=""
                    />
                    <span>Back</span>
                  </div>
                  <div
                    className="next-button"
                    onClick={() => navigate("/questionsoverview")}
                  >
                    <span>Next</span>
                    <img
                      style={{ cursor: "pointer" }}
                      src={next_icon}
                      alt=""
                    />
                  </div>
                </div>
              </div>

              <div className="header-bar"></div>
            </div>
            {saveData ? <>
            <div className="heading-1">
            <Grid container spacing={1}>
                <Grid md={2}><span>Test Score: 100</span></Grid>
                <Grid md={10} justifyContent={'end'}>
                  <div className="buttons-container">
                    <Grid container spacing={1} direction={'row'} justifyContent={'end'}>
                      <Grid item xs={4} md={2.5}>
                        <div
                          className="add-skill-set"
                          onClick={() => {
                            setAddSkillSetModel(true);
                          }}
                        >
                          <img
                            style={{ cursor: "pointer" }}
                            src={skill}
                            alt=""
                          />
                          <span>Add New Skillset</span>
                        </div>
                      </Grid>
                      <Grid item xs={4} md={3}>
                        <div
                          className="Choose-From-Library"
                          // onClick={() => {
                          //   navigate("/choosefromlibrary?isOverview=true");
                          // }}
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
                            //navigate("/newquestion");
                            // setisCreateQuestion(true);
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
              </Grid>
            </div>
              
              <QuestionsDetails />
              <SelectedQuestions />
              <SkillSetQue/>
              </> :
              <>
                <Grid container>
                  <Grid item md={0.5}></Grid>
                  <Grid item md={11} width={'90%'}>
                    <div className="info-container">
                      <div className="buttons-group">
                        <div className="info">
                          <img
                            style={{ cursor: "pointer" }}
                            src={info_icon}
                            alt=""
                          />
                          <span>No questions are added to this test.</span>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>

                <div className="reading-img">
                  <img
                    style={{ cursor: "pointer" }}
                    src={reading}
                    alt=""
                  />
                </div>
                <div className="buttons-container">
                  <Grid container spacing={1} direction={'row'} justifyContent={'center'} alignItems={'center'}>

                    <Grid item xs={4} md={2.5}>
                      <div
                        className="Choose-From-Library"
                        onClick={() => {
                          navigate("/choosefromlibrary?isOverview=true");
                        }}
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={file}
                          alt=""
                        />
                        <span>Choose From Library</span>
                      </div>
                    </Grid>
                    <Grid item xs={4} md={2.5}>
                      <div
                        className="Create-New-Question"
                        onClick={() => {
                          //navigate("/newquestion");
                          // setisCreateQuestion(true);
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
                    <Grid item xs={4} md={2}>
                      <div
                        className="add-skill-set"
                        onClick={() => {
                          setAddSkillSetModel(true);
                        }}
                      >
                        <img
                          style={{ cursor: "pointer" }}
                          src={skill}
                          alt=""
                        />
                        <span>Add New Skillset</span>
                      </div>
                    </Grid>

                  </Grid>
                </div></>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomTestSummary;
