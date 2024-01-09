import { EditorState } from "draft-js";
import { createContext, useState } from "react";

const CreateTestContext = createContext({
  jobRoleData: "",
  exprienceData: "",
  testCreationType: "",
  testCreationTypeDetails: [],
  skills: [],
  jobRole: "",
  experience: "",
  name: "",
  testHeading: "",
  testDescription: "",
  startDate: "",
  endDate: "",
  testSummaryId: "",
  question: [],
  addedSkills: [],
  testId: "",
  testType: "",
  testInviteType: "",
  testTime: "",
  testScore: "",
  testCutOff: "",
  testLink: "",
  testAdmins: [],
  testCandidateData: [],
  testInstructions: "",
  proctoringSetting: [],
  questionOverview: [],
  isRandomAll: "",
  setquestionOverview: () => {},
  setFilterQuestionOverview: () => {},
  settestCreationType: () => {},
  settestCreationTypeDetails: () => {},
  setskills: () => {},
  setexperience: () => {},
  setjobRole: () => {},
  setname: () => {},
  setSkillsByJobRole: () => {},
  setTestHeading: () => {},
  setTestDescription: () => {},
  setStartDate: () => {},
  setEndDate: () => {},
  setTestSummaryId: () => {},
  setQuestions: () => {},
  setAddedSkills: () => {},
  clearState: () => {},
  addDeleteQuestionData: () => {},
  addDeletedSkillData: () => {},
  setTestId: () => {},
  settestType: () => {},
  settestTime: () => {},
  settestScore: () => {},
  settestCutOff: () => {},
  setTestLink: () => {},
  settestAdmins: () => {},
  settestCandidateData: () => {},
  settestInstructions: () => {},
  setdeletedtestInstruction: () => {},
  setProtoringSettings: () => {},
  setdeletedCandidateData: () => {},
  setStatusUpdateProctoringSetting: () => {},
  setJobRoleData: () => {},
  setexprienceData: () => {},
  settestInviteType: () => {},
  setisRandomAll: () => {},
});

export const CreateTestProvider = ({ children }) => {
  const [jobRoleData, setJobRoleData] = useState([]);
  const [exprienceData, setexprienceData] = useState([]);
  const [testCreationType, settestCreationType] = useState("Auto Test");
  const [testCreationTypeDetails, settestCreationTypeDetails] = useState([
    "EliteQA Library",
    "My Library",
  ]);
  const [skills, setskills] = useState([]);
  const [jobRole, setjobRole] = useState("");
  const [experience, setexperience] = useState("");
  const [questionOverview, setquestionOverview] = useState([]);
  const [name, setname] = useState("");
  const [testHeading, settestHeading] = useState("");
  const [testDescription, setTestDescription] = useState(
    EditorState.createEmpty()
  );
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [testSummaryId, settestSummaryId] = useState("");
  const [question, setquestion] = useState([]);
  const [userAddedSkills, setuserAddedSkills] = useState([]);
  const [testId, settestId] = useState("");
  const [testType, settestType] = useState("public");
  const [testInviteType, settestInviteType] = useState("No");
  const [testTime, settestTime] = useState("");
  const [testScore, settestScore] = useState("");
  const [testCutOff, settestCutOff] = useState("");
  const [testLink, settestLink] = useState("");
  const [testAdmins, settestAdmins] = useState([]);
  const [testCandidateData, settestCandidateData] = useState(["Name", "Email"]);
  const [testInstructions, settestInstructions] = useState([
    {
      instruction: "All Questions are compulsory",
    },
  ]);
  const [proctoringSetting, setProtoringSettings] = useState([
    {
      setting: "Shuffle Questions for each candidate",
      active: false,
    },
    {
      setting: "Take Snapshots via webcam every 30 second",
      active: false,
    },
    {
      setting: "Turn on fullscreen while test",
      active: true,
    },
    {
      setting: "Turn Off copy paste from external sources",
      active: true,
    },
    {
      setting: "Logout on leaving a test interface",
      active: false,
    },
  ]);
  const [isRandomAll, setisRandomAll] = useState(false);

  const addQuestionOverView = (data) => {
    setquestionOverview((prev) => [...prev, data]);
  };

  const changeQuestionOverView = (data) => {
    setquestionOverview(data);
  };

  const addExperienceData = (experienceData) => {
    setexprienceData(experienceData);
  };

  const addJobRoleData = (jobroleItem) => {
    setJobRoleData(jobroleItem);
  };

  const changeProctoringSettingStatus = (proctoringSetting) => {
    setProtoringSettings(proctoringSetting);
  };
  const changeProctoringSetting = (proctoringSetting) => {
    setProtoringSettings((prev) => [...prev, proctoringSetting]);
  };

  const changeTestInstruction = (instruction) => {
    settestInstructions((prev) => [...prev, instruction]);
  };

  const deletetestInstruction = (testInstruction) => {
    settestInstructions(testInstruction);
  };

  const deletetestCandidateData = (candidatedata) => {
    settestCandidateData(candidatedata);
  };

  const changeTestCandidateData = (candidateData) => {
    settestCandidateData((prev) => [...prev, candidateData]);
  };

  const changeTestAdmins = (adminsItem) => {
    settestAdmins(adminsItem);
  };

  const changeTestLink = (link) => {
    settestLink(link);
  };

  const changeTestCutOff = (cutoff) => {
    settestCutOff(cutoff);
  };

  const changeTestScore = (score) => {
    settestScore(score);
  };

  const changeTestTime = (time) => {
    settestTime(time);
  };

  const changeTestType = (type) => {
    settestType(type);
  };

  const changeTestInviteType = (type) => {
    settestInviteType(type);
  };

  const changeTestId = (id) => {
    settestId(id);
  };

  const userAddingSkill = (addskills) => {
    setuserAddedSkills((prev) => [...prev, addskills]);
  };
  const addQuestion = (questionID) => {
    setquestion((prev) => [...prev, questionID]);
  };

  const changeStartDate = (date) => {
    setStartDate(date);
  };

  const changeEndDate = (date) => {
    setEndDate(date);
  };

  const changeTestHeading = (header) => {
    settestHeading(header);
  };

  const changeTestDescription = (description) => {
    setTestDescription(description);
  };

  const changeTestCreationType = (type) => {
    settestCreationType(type);
  };

  const changeTestSummaryId = (id) => {
    settestSummaryId(id);
  };

  const clearState = () => {
    settestCreationType("Auto Test");
    settestCreationTypeDetails(["EliteQA Library", "My Library"]);
    setskills([]);
    setjobRole("");
    setexperience("");
    setname("");
    settestCreationType("Auto Test");
    settestCreationTypeDetails(["EliteQA Library", "My Library"]);
    setskills([]);
    setjobRole("");
    setexperience("");
    setquestionOverview([]);
    setname("");
    settestHeading("");
    setTestDescription(EditorState.createEmpty());
    setStartDate();
    setEndDate();
    settestSummaryId("");
    setquestion([]);
    setuserAddedSkills([]);
    settestId("");
    settestType("public");
    settestInviteType("No");
    settestTime("");
    settestScore("");
    settestCutOff("");
    settestAdmins([]);
    settestCandidateData(["Name", "Email"]);
    settestInstructions([
      {
        instruction: "All Questions are compulsory",
      },
    ]);
    setProtoringSettings([
      {
        setting: "Shuffle Questions for each candidate",
        active: false,
      },
      {
        setting: "Take Snapshots via webcam every 30 second",
        active: false,
      },
      {
        setting: "Turn on fullscreen while test",
        active: true,
      },
      {
        setting: "Turn Off copy paste from external sources",
        active: true,
      },
      {
        setting: "Logout on leaving a test interface",
        active: false,
      },
    ]);
    setisRandomAll(false);
  };

  const changeTestCreationTypeDetails = (details) => {
    if (testCreationTypeDetails.includes(details)) {
      const filtetTestCreationTypeDetails = testCreationTypeDetails.filter(
        (data) => data !== details
      );
      settestCreationTypeDetails(filtetTestCreationTypeDetails);
    } else {
      settestCreationTypeDetails((prev) => [...prev, details]);
    }
  };

  const changeSkills = (skillItem) => {
    setskills(skillItem);
  };

  const setSkillsByJobRole = (skills) => {
    setskills((prev) => [...prev, skills]);
  };

  const changeJobRole = (job) => {
    setjobRole(job);
  };

  const changeExperience = (experienceOfJobRole) => {
    setexperience(experienceOfJobRole);
  };

  const changeName = (testName) => {
    setname(testName);
  };

  const addDeleteQuestionData = (data) => {
    setquestion(data);
  };

  const addDeletedSkillData = (data) => {
    setuserAddedSkills(data);
  };

  const changeRandomAll = (data) => {
    setisRandomAll(data);
  };

  const context = {
    testCreationType: testCreationType,
    testCreationTypeDetails: testCreationTypeDetails,
    skills: skills,
    jobRole: jobRole,
    experience: experience,
    name: name,
    testHeading: testHeading,
    testDescription: testDescription,
    startDate: startDate,
    endDate: endDate,
    testSummaryId: testSummaryId,
    question: question,
    addedSkills: userAddedSkills,
    testId: testId,
    testType: testType,
    testInviteType: testInviteType,
    testTime: testTime,
    testScore: testScore,
    testCutOff: testCutOff,
    testLink: testLink,
    testAdmins: testAdmins,
    testCandidateData: testCandidateData,
    testInstructions: testInstructions,
    proctoringSetting: proctoringSetting,
    jobRoleData: jobRoleData,
    exprienceData: exprienceData,
    questionOverview: questionOverview,
    isRandomAll: isRandomAll,
    settestCreationType: changeTestCreationType,
    settestCreationTypeDetails: changeTestCreationTypeDetails,
    setskills: changeSkills,
    setexperience: changeExperience,
    setjobRole: changeJobRole,
    setname: changeName,
    setSkillsByJobRole: setSkillsByJobRole,
    setTestHeading: changeTestHeading,
    setTestDescription: changeTestDescription,
    setStartDate: changeStartDate,
    setEndDate: changeEndDate,
    setTestSummaryId: changeTestSummaryId,
    setQuestions: addQuestion,
    setAddedSkills: userAddingSkill,
    clearState: clearState,
    addDeleteQuestionData: addDeleteQuestionData,
    addDeletedSkillData: addDeletedSkillData,
    setTestId: changeTestId,
    settestType: changeTestType,
    settestTime: changeTestTime,
    settestScore: changeTestScore,
    settestCutOff: changeTestCutOff,
    setTestLink: changeTestLink,
    settestAdmins: changeTestAdmins,
    settestCandidateData: changeTestCandidateData,
    setdeletedCandidateData: deletetestCandidateData,
    settestInstructions: changeTestInstruction,
    setdeletedtestInstruction: deletetestInstruction,
    setProtoringSettings: changeProctoringSetting,
    setStatusUpdateProctoringSetting: changeProctoringSettingStatus,
    setJobRoleData: addJobRoleData,
    setexprienceData: addExperienceData,
    settestInviteType: changeTestInviteType,
    setquestionOverview: addQuestionOverView,
    setFilterQuestionOverview: changeQuestionOverView,
    setisRandomAll: changeRandomAll,
  };

  return (
    <CreateTestContext.Provider value={context}>
      {children}
    </CreateTestContext.Provider>
  );
};

export default CreateTestContext;
