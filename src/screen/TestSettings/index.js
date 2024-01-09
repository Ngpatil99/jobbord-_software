import React, {
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import CreateTest4Sidebar from "../../component/CreateTest4Sidebar";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import "./index.css";
import { useNavigate } from "react-router-dom";
import AddTestAdmin from "../../component/AddAdminModel";
import CustomInput from "../../component/AddCustomInputModel";
import DeleteSkillSetModel from "../../component/DeleteSkillSetModel";
import { toast } from "react-toastify";
import { Editor, RichUtils, getDefaultKeyBinding } from "draft-js";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import jwtDecode from "jwt-decode";
import CreateTestContext from "../../store/CreateTestContext";
import "./rich-editor.css";
import DatePicker from "react-datepicker";
import {
  registerLocale,
  setDefaultLocale,
  getDefaultLocale,
} from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";
import CreateTest2Sidebar from "../../component/CreateTest2Sidebar";
import TestCreationDataLossPopup from "../../component/TestCreationDataLossPopup";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import moment from "moment";

registerLocale("enGB", enGB);
setDefaultLocale("enGB");
getDefaultLocale("enGB");

const TestSetting = () => {
  const createTestContext = useContext(CreateTestContext);

  const navigate = useNavigate();
  const [addAdminPopup, setAddAdminPopup] = useState(false);
  const [deleteSkillSetModel, setDeleteSkillSetModel] = useState(false);
  const [instructionData, setInstructionData] = useState("");
  const [isInstructionBlank, setisInstructionBlank] = useState(false);
  let className = "RichEditor-editor";
  const editor = useRef(null);
  const startDate = useRef(null);
  const endDate = useRef(null);
  const [selectedInstruction, setSelectedInstruction] = useState(0);
  const [refreshPage, setrefreshPage] = useState({});
  const [loading, setloading] = useState(false);
  const [draftLoading, setdraftLoading] = useState(false);
  const [isTestHeading, setisTestHeading] = useState(false);
  const [isTestDescription, setisTestDescription] = useState(false);
  const [isTestType, setisTestType] = useState(false);
  const [isTestTime, setisTestTime] = useState(false);
  const [isTestScore, setisTestScore] = useState(false);
  const [isTestCutOff, setisTestCutOff] = useState(false);
  const [isTestLink, setisTestLink] = useState(false);
  const [isTestCandidateData, setisTestCandidateData] = useState(false);
  const [isTestInstruction, setisTestInstruction] = useState(false);
  const [isTestProctoringSetting, setisTestProctoringSetting] = useState(false);
  const [isNavItem, setisNavItem] = useState(false);
  const [selectedNavItem, setselectedNavItem] = useState("");
  const [selectedAdmin, setselectedAdmin] = useState("");
  const [questionEditorFocused, setQuestionEditorFocused] = useState(false);
  const [customInput, setCustomInput] = useState(false);
  const [selectedCanidateSetting, setselectedCanidateSetting] = useState("");

  const closeAddAdminPopup = () => {
    setAddAdminPopup(false);
  };

  const uploadImageToS3 = async (files) => {
    try {
      const token = getCookie("Xh7ERL0G");

      const uploadURL = await axios.get(`${backend_url}S3Url`, {
        headers: { token: token },
      });
      await axios.request({
        method: "PUT",
        headers: {
          "Content-Type": files[0].type,
        },
        url: uploadURL.data.uploadURL,
        data: files[0],
      });
      const imageURL = uploadURL.data.uploadURL.split("?")[0];
      return imageURL;
    } catch (error) {
      console.log(error);
    }
  };

  function onImageUploadBefore(files, info, uploadHandler) {
    const handleImageUpload = async () => {
      try {
        const imageURL = await uploadImageToS3(files);

        const response = {
          result: [
            {
              url: imageURL,
              name: files[0].name,
              size: files[0].size,
            },
          ],
        };

        uploadHandler(response);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    };

    handleImageUpload();
  }

  const closeButton = () => {
    setDeleteSkillSetModel(false);
  };

  const closeCustomInputPopup = () => {
    setCustomInput(false);
  };

  const getTotalTestDuration = () => {
    const totalTestDuration = createTestContext.question.reduce(
      (testDuration, question) => {
        testDuration +=
          question.questions.type === "MCQ"
            ? question.questions.difficultyLevelId.mcqTime
            : question.questions.difficultyLevelId.programmingTime;
        return testDuration;
      },
      0
    );

    return (totalTestDuration / 60).toFixed(0);
  };
  const getTotalQuestionScore = () => {
    const skills = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);

    let toalMCQQuestionScore = createTestContext.question.reduce(
      (totalScore, question) => {
        if (!skills.includes(question.skillId)) {
          totalScore += question.questions.score;
        }

        return totalScore;
      },
      0
    );
    if (skills.length) {
      createTestContext.addedSkills.forEach((data) => {
        toalMCQQuestionScore =
          toalMCQQuestionScore +
          (data.random
            ? isNaN(data.score)
              ? parseInt(
                  data.score?.split(",")[0]?.replace(/\D/g, "") *
                    data.level?.split(",")[0].replace(/\D/g, "")
                ) +
                parseInt(
                  data.score?.split(",")[1]?.replace(/\D/g, "") *
                    data.level?.split(",")[1].replace(/\D/g, "")
                ) +
                parseInt(
                  data.score?.split(",")[2]?.replace(/\D/g, "") *
                    data.level?.split(",")[2].replace(/\D/g, "")
                )
              : 0
            : 0);
      });
    }
    return toalMCQQuestionScore;
  };

  useEffect(() => {
    window.history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function (event) {
      navigate("/questionsoverview");
    });
    //createTestContext.settestTime(getTotalTestDuration())
    createTestContext.settestScore(getTotalQuestionScore());
    const token = getCookie("Xh7ERL0G");
    const decode = jwtDecode(token);
    createTestContext.setTestLink(
      `https://assessment.theeliteqa.com/${
        decode?.client?._id
      }/${createTestContext.testHeading.replace(/ /g, "-")}-${
        createTestContext.testId
      }`
    );
  }, []);

  useEffect(() => {
    const token = getCookie("Xh7ERL0G");
    const decode = jwtDecode(token);
    createTestContext.setTestLink(
      `https://assessment.theeliteqa.com/${
        decode?.client?._id
      }/${createTestContext.testHeading.replace(/ /g, "-")}-${
        createTestContext.testId
      }`
    );
  }, [createTestContext.testDescription, createTestContext.testHeading]);

  const removeInstruction = (val) => {
    createTestContext.setdeletedtestInstruction(
      createTestContext.testInstructions.filter((data, index) => {
        return index !== val;
      })
    );
  };

  const removeDetails = (val) => {
    if (val !== "Name" && val !== "Email") {
      createTestContext.setdeletedCandidateData(
        createTestContext.testCandidateData.filter((data, index) => {
          return data !== val;
        })
      );
    } else {
      toast.error("Name and email are compulsory fields");
    }
  };

  const focus = () => {
    if (editor.current) editor.current.focus();
  };

  const handleKeyCommand = useCallback(
    (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        createTestContext.setTestDescription(newState);
        return "handled";
      }
      return "not-handled";
    },
    [createTestContext.testDescription, createTestContext.setTestDescription]
  );

  const mapKeyToEditorCommand = useCallback(
    (e) => {
      switch (e.keyCode) {
        case 9: // TAB
          const newEditorState = RichUtils.onTab(
            e,
            createTestContext.testDescription,
            4 /* maxDepth */
          );
          if (newEditorState !== createTestContext.testDescription) {
            createTestContext.setTestDescription(newEditorState);
          }
          return null;
      }
      return getDefaultKeyBinding(e);
    },
    [createTestContext.testDescription, createTestContext.setTestDescription]
  );

  const styleMap = {
    CODE: {
      backgroundColor: "rgba(0, 0, 0, 0.05)",
      fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
      fontSize: 16,
      padding: 2,
    },
  };

  function getBlockStyle(block) {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return null;
    }
  }

  const INLINE_STYLES = [
    { label: "Bold", style: "BOLD" },
    { label: "Italic", style: "ITALIC" },
    { label: "Underline", style: "UNDERLINE" },
    { label: "Monospace", style: "CODE" },
  ];

  function InlineStyleControls({ editorState, onToggle }) {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
      <div className="RichEditor-controls">
        {INLINE_STYLES.map((type) => (
          <StyleButton
            key={type.label}
            active={currentStyle.has(type.style)}
            label={type.label}
            onToggle={onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  }

  function StyleButton({ onToggle, active, label, style }) {
    let className = "RichEditor-styleButton";
    if (active) {
      className += " RichEditor-activeButton";
    }

    return (
      <span
        className={className}
        onMouseDown={(e) => {
          e.preventDefault();
          onToggle(style);
        }}
      >
        {label}
      </span>
    );
  }

  const BLOCK_TYPES = [
    { label: "H1", style: "header-one" },
    { label: "H2", style: "header-two" },
    { label: "H3", style: "header-three" },
    { label: "H4", style: "header-four" },
    { label: "H5", style: "header-five" },
    { label: "H6", style: "header-six" },
    { label: "Blockquote", style: "blockquote" },
    { label: "UL", style: "unordered-list-item" },
    { label: "OL", style: "ordered-list-item" },
    { label: "Code Block", style: "code-block" },
  ];

  function BlockStyleControls({ editorState, onToggle }) {
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return (
      <div className="RichEditor-controls">
        {BLOCK_TYPES.map((type) => (
          <StyleButton
            key={type.label}
            active={type.style === blockType}
            label={type.label}
            onToggle={onToggle}
            style={type.style}
          />
        ))}
      </div>
    );
  }

  const addTestInstruction = () => {
    if (instructionData.trim() !== "") {
      setisInstructionBlank(false);
      createTestContext.settestInstructions({ instruction: instructionData });
      setInstructionData("");
    } else {
      setisInstructionBlank(true);
    }
  };

  const addTestCandidateData = (value) => {
    setselectedCanidateSetting(value);
    if (value === "") {
      return;
    }
    if (createTestContext.testCandidateData.includes(value)) {
      toast.error("Already Selected");
    } else {
      createTestContext.settestCandidateData(value);
      setselectedCanidateSetting("");
    }
  };

  const changeProctoringSettingStatus = (proctoringSetting, state) => {
    createTestContext.proctoringSetting.forEach((data) => {
      if (data.setting === proctoringSetting) {
        data.active = state;
      }
    });

    createTestContext.setStatusUpdateProctoringSetting(
      createTestContext.proctoringSetting
    );
    setrefreshPage({});
    setisTestProctoringSetting(false);
  };

  const saveAsDraft = async () => {
    setdraftLoading(true);
    try {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      let testAdminData = [];
      createTestContext.testAdmins.forEach((data) => {
        if (data._id !== null || data._id !== undefined) {
          const obj = { admin: data._id, access: "All Access" };
          testAdminData.push(obj);
        }
      });
      const testName = createTestContext.jobRoleData.filter((data) => {
        return data._id === createTestContext.jobRole;
      });
      await axios.put(
        `${backend_url}test/update/${createTestContext.testId}`,
        {
          name: createTestContext.testHeading,
          description: extractPlainText(createTestContext.testDescription),
          jobRole: testName[0]._id,
          createdBy: decode.user_id,
          creationDateTime: new Date(),
          experience: createTestContext.experience,
          startDate: createTestContext.startDate || moment().toDate(),
          endDate: createTestContext.endDate,
          testCreationType: createTestContext.testCreationType,
          testCreationTypeDetails: createTestContext.testCreationTypeDetails,
          cutOff: createTestContext.testCutOff,
          totalTiming: createTestContext.testTime,
          totalScore: createTestContext.testScore,
          totalNoOfQuestions: createTestContext.question.length,
          link: createTestContext.testLink,
          instruction: createTestContext.testInstructions,
          testType: createTestContext.testType,
          proctoringSettings: createTestContext.proctoringSetting,
          candiateSettings: createTestContext.testCandidateData,
          isActive: false,
          status: "draft",
          testAdmins: testAdminData,
          testInviteOnly:
            createTestContext.testInviteType === "Yes" ? true : false,
          html: createTestContext.testDescription,
          image: "",
        },
        { headers: { token: token } }
      );
      setdraftLoading(false);
      toast.success("assessment is saved as draft");
      createTestContext.clearState();
      navigate("/assessment");
    } catch (error) {
      toast.error(`${error}`);
      setdraftLoading(false);
    }
  };

  const checkIsTestInstruction = () => {
    let cnt = 0;
    createTestContext.testInstructions.forEach((data) => {
      if (data.instruction !== null) {
        cnt = cnt + 1;
      }
    });
    return cnt === 0 ? true : false;
  };

  const checkIsTestCandidateData = () => {
    let cnt = 0;
    createTestContext.testCandidateData.forEach((data) => {
      if (data !== null) {
        cnt = cnt + 1;
      }
    });
    return cnt === 0 ? true : false;
  };

  const checkIsTestProctoringSetting = () => {
    let cnt = 0;
    createTestContext.proctoringSetting.forEach((data) => {
      if (data.active === true) {
        cnt = cnt + 1;
      }
    });
    return cnt === 0 ? true : false;
  };

  const extractPlainText = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  const updateTest = async () => {
    try {
      if (createTestContext.testHeading === "") {
        setisTestHeading(true);
      } else {
        setisTestHeading(false);
      }
      if (extractPlainText(createTestContext.testDescription) === "") {
        setisTestDescription(true);
      } else {
        setisTestDescription(false);
      }
      if (
        createTestContext.testScore === "" ||
        createTestContext.testScore === "0" ||
        parseInt(createTestContext.testScore) < 0
      ) {
        setisTestScore(true);
      } else {
        setisTestScore(false);
      }
      if (
        createTestContext.testTime === "" ||
        createTestContext.testTime === "0" ||
        parseInt(createTestContext.testTime) < 0
      ) {
        setisTestTime(true);
      } else {
        setisTestTime(false);
      }
      if (
        createTestContext.testCutOff === "" ||
        createTestContext.testCutOff === "0" ||
        (createTestContext.question.length
          ? parseInt(createTestContext.testCutOff) < 0
          : false) ||
        (createTestContext.question.length
          ? createTestContext.testCutOff > createTestContext.testScore
          : false) ||
        /^0+$|^0*-0+$/.test(createTestContext.testCutOff)
      ) {
        setisTestCutOff(true);
      } else {
        setisTestCutOff(false);
      }
      if (createTestContext.testCandidateData.length === 0) {
        setisTestCandidateData(true);
      } else {
        setisTestCandidateData(false);
      }
      if (createTestContext.testLink === "") {
        setisTestLink(true);
      } else {
        setisTestLink(false);
      }
      if (checkIsTestInstruction()) {
        setisTestInstruction(true);
      } else {
        setisTestInstruction(false);
      }
      if (checkIsTestCandidateData()) {
        setisTestCandidateData(true);
      } else {
        setisTestCandidateData(false);
      }
      if (checkIsTestProctoringSetting()) {
        setisTestProctoringSetting(true);
      } else {
        setisTestProctoringSetting(false);
      }
      if (createTestContext.testType === "") {
        setisTestType(true);
      } else {
        setisTestType(false);
      }
      if (
        createTestContext.testHeading !== "" &&
        extractPlainText(createTestContext.testDescription) !== "" &&
        createTestContext.testScore !== "" &&
        !(
          createTestContext.testTime === "" ||
          createTestContext.testTime === "0" ||
          parseInt(createTestContext.testTime) < 0 ||
          /^0+$|^0*-0+$/.test(createTestContext.testTime)
        ) &&
        !(createTestContext.question.length
          ? createTestContext.testCutOff === "" ||
            createTestContext.testCutOff === "0" ||
            parseInt(createTestContext.testCutOff) < 0 ||
            createTestContext.testCutOff > createTestContext.testScore ||
            /^0+$|^0*-0+$/.test(createTestContext.testCutOff)
          : false) &&
        createTestContext.testCandidateData.length !== 0 &&
        createTestContext.testLink !== "" &&
        !checkIsTestInstruction() &&
        !checkIsTestCandidateData() &&
        !checkIsTestProctoringSetting()
      ) {
        setloading(true);
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);
        let testAdminData = [];
        createTestContext.testAdmins.forEach((data) => {
          if (data._id !== null || data._id !== undefined) {
            const obj = { admin: data._id, access: "All Access" };
            testAdminData.push(obj);
          }
        });
        const testName = createTestContext.jobRoleData.filter((data) => {
          return data._id === createTestContext.jobRole;
        });
        await axios.put(
          `${backend_url}test/update/${createTestContext.testId}`,
          {
            name: createTestContext.testHeading,
            description: extractPlainText(createTestContext.testDescription),
            jobRole: testName[0]._id,
            createdBy: decode.user_id,
            creationDateTime: new Date(),
            experience: createTestContext.experience,
            startDate: createTestContext.startDate || moment().toDate(),
            endDate: createTestContext.endDate,
            testCreationType: createTestContext.testCreationType,
            testCreationTypeDetails: createTestContext.testCreationTypeDetails,
            cutOff: createTestContext.testCutOff,
            totalTiming: createTestContext.testTime,
            totalScore: createTestContext.testScore,
            totalNoOfQuestions: createTestContext.question.length,
            link: createTestContext.testLink,
            instruction: createTestContext.testInstructions,
            testType: createTestContext.testType,
            testAdmins: testAdminData,
            proctoringSettings: createTestContext.proctoringSetting,
            candiateSettings: createTestContext.testCandidateData,
            isActive: false,
            status: "draft",
            testInviteOnly:
              createTestContext.testInviteType === "Yes" ? true : false,
            html: createTestContext.testDescription,
            image: "",
          },
          { headers: { token: token } }
        );
        setloading(false);
        navigate("/theTest");
      }
    } catch (error) {
      setloading(false);
      toast.error(error);
    }
  };

  const navigatePage = (page) => {
    navigate(page);
    createTestContext.clearState();
  };

  const handleChange = (newEditorState) => {
    if (newEditorState.getCurrentContent().getPlainText().length <= 500) {
      createTestContext.setTestDescription(newEditorState);
    } else {
      toast.error("Problem statement should be less than 500");
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {}, 500);
    return () => clearTimeout(debounce);
  }, [createTestContext.testTime, createTestContext.testCutOff]);

  const onChangeTestDuration = (e) => {
    createTestContext.settestTime(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value)
    ) {
      setisTestTime(true);
    } else {
      setisTestTime(false);
    }
  };

  const onChangeTestCutOffScore = (e) => {
    createTestContext.settestCutOff(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseInt(e.target.value) < 0 ||
      (createTestContext.question.length
        ? createTestContext.testCutOff > createTestContext.testScore
        : false) ||
      /^0+$|^0*-0+$/.test(e.target.value)
    ) {
      setisTestCutOff(true);
    } else {
      setisTestCutOff(false);
    }
  };

  const deleteAdmin = (data) => {
    const removedAdmins = createTestContext.testAdmins.filter(
      (admin) => admin._id !== data._id
    );
    createTestContext.settestAdmins(removedAdmins);
    toast.success("Admin removed successfully.");
    setDeleteSkillSetModel(false);
  };

  const handleChangeEditor = (content) => {
    createTestContext.setTestDescription(content);
  };

  const handleEditorFocus = () => {
    setQuestionEditorFocused(true);
  };

  const handleEditorBlur = (editorContents) => {
    setQuestionEditorFocused(false);
  };

  return (
    <div className="test-setting-container">
      <NavigationBar
        onClickNavItem={(page) => {
          setselectedNavItem(page);
          setisNavItem(true);
        }}
        onClickSaveAsDraft={() => saveAsDraft()}
        loadingDraft={draftLoading}
        saveAsDraft={true}
        assessment2={false}
      />
      {addAdminPopup ? (
        <AddTestAdmin
          close={closeAddAdminPopup}
          testId={createTestContext.testId}
          admins={createTestContext.testAdmins}
        />
      ) : null}
      {customInput ? <CustomInput close={closeCustomInputPopup} /> : null}
      {deleteSkillSetModel && (
        <DeleteSkillSetModel
          admin={true}
          onClickNo={closeButton}
          onClickYes={() => deleteAdmin(selectedAdmin)}
          closeButton={closeButton}
        />
      )}
      {isNavItem ? (
        <TestCreationDataLossPopup
          closeButton={() => setisNavItem(false)}
          onClickNo={() => setisNavItem(false)}
          onClickYes={() => navigatePage(selectedNavItem)}
        />
      ) : (
        <></>
      )}
      <div className="test-setting">
        <div className="test-setting-sidebar">
          <CreateTest4Sidebar />
        </div>

        <div className="test-setting-content">
          <div className="content">
            <div className="col">
              <div className="header">
                <div className="title">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="24"
                      fill="#00C49A"
                      fill-opacity="0.1"
                    />
                    <g clip-path="url(#clip0_1897_1286)">
                      <path
                        d="M33.444 16.833H15.5551C15.2162 16.833 14.8912 16.9676 14.6516 17.2073C14.412 17.4469 14.2773 17.7719 14.2773 18.1108V30.8886C14.2773 31.2275 14.412 31.5525 14.6516 31.7921C14.8912 32.0317 15.2162 32.1663 15.5551 32.1663H33.444C33.7829 32.1663 34.1079 32.0317 34.3475 31.7921C34.5872 31.5525 34.7218 31.2275 34.7218 30.8886V18.1108C34.7218 17.7719 34.5872 17.4469 34.3475 17.2073C34.1079 16.9676 33.7829 16.833 33.444 16.833ZM33.444 30.8886H15.5551V18.1108H33.444V30.8886Z"
                        fill="#00C49A"
                      />
                      <path
                        d="M18.7502 21.9448H30.2502C30.4197 21.9448 30.5822 21.8775 30.702 21.7576C30.8218 21.6378 30.8891 21.4753 30.8891 21.3059C30.8891 21.1364 30.8218 20.9739 30.702 20.8541C30.5822 20.7343 30.4197 20.667 30.2502 20.667H18.7502C18.5808 20.667 18.4183 20.7343 18.2985 20.8541C18.1786 20.9739 18.1113 21.1364 18.1113 21.3059C18.1113 21.4753 18.1786 21.6378 18.2985 21.7576C18.4183 21.8775 18.5808 21.9448 18.7502 21.9448Z"
                        fill="#00C49A"
                      />
                      <path
                        d="M18.7502 24.5004H30.2502C30.4197 24.5004 30.5822 24.4331 30.702 24.3133C30.8218 24.1935 30.8891 24.031 30.8891 23.8615C30.8891 23.6921 30.8218 23.5296 30.702 23.4098C30.5822 23.29 30.4197 23.2227 30.2502 23.2227H18.7502C18.5808 23.2227 18.4183 23.29 18.2985 23.4098C18.1786 23.5296 18.1113 23.6921 18.1113 23.8615C18.1113 24.031 18.1786 24.1935 18.2985 24.3133C18.4183 24.4331 18.5808 24.5004 18.7502 24.5004Z"
                        fill="#00C49A"
                      />
                      <path
                        d="M18.7502 27.0551H25.1391C25.3085 27.0551 25.4711 26.9878 25.5909 26.868C25.7107 26.7482 25.778 26.5857 25.778 26.4162C25.778 26.2468 25.7107 26.0843 25.5909 25.9645C25.4711 25.8447 25.3085 25.7773 25.1391 25.7773H18.7502C18.5808 25.7773 18.4183 25.8447 18.2985 25.9645C18.1786 26.0843 18.1113 26.2468 18.1113 26.4162C18.1113 26.5857 18.1786 26.7482 18.2985 26.868C18.4183 26.9878 18.5808 27.0551 18.7502 27.0551Z"
                        fill="#00C49A"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1897_1286">
                        <rect
                          width="23"
                          height="23"
                          fill="white"
                          transform="translate(13 13)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="group">
                    <span>Test Settings</span>
                    <p>Select important settings for students and recruiters</p>
                  </div>
                </div>

                <div className="button-container">
                  <div
                    className="back-button"
                    onClick={() => navigate("/questionsoverview")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="white" />
                      <path
                        d="M13 4.9595L7 9.61256L13 14.2656"
                        stroke="#827C7C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <span>Back</span>
                  </div>
                  <div
                    className="next-button"
                    onClick={() => {
                      updateTest();
                    }}
                  >
                    {loading ? (
                      <div className="loader"></div>
                    ) : (
                      <>
                        <span>Next</span>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="white" />
                          <path
                            d="M8 15.2661L14 10.613L8 5.95996"
                            stroke="#00C49A"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="header-bar"></div>
            </div>

            <div className="input-container">
              <div className="editor">
                <div className="test-heading">
                  <div className="test-input">
                    <span>
                      Test Heading <label style={{ color: "red" }}>*</label>
                    </span>
                    <input
                      value={createTestContext.testHeading}
                      onChange={(e) =>
                        createTestContext.setTestHeading(
                          e.target.value.slice(0, 100)
                        )
                      }
                      type="text"
                      placeholder="Enter test heading..."
                    />
                    {isTestHeading && createTestContext.testHeading === "" ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Please enter test heading
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="test-description">
                  <p>
                    Test Description <label style={{ color: "red" }}>*</label>
                  </p>
                  <div
                    className="RichEditor-root-2"
                    style={{ width: "100%", minHeight: "267px" }}
                  >
                    <div className={className} onClick={focus}>
                      <SunEditor
                        setContents={createTestContext.testDescription}
                        onChange={handleChangeEditor}
                        onImageUploadBefore={onImageUploadBefore}
                        height="100"
                        setOptions={{
                          buttonList: [
                            [
                              "undo",
                              "redo",
                              "formatBlock",
                              "paragraphStyle",
                              "blockquote",
                              "bold",
                              "underline",
                              "italic",
                              "strike",
                              "subscript",
                              "superscript",
                              "fontColor",
                              "hiliteColor",
                              "textStyle",
                              "removeFormat",
                              "outdent",
                              "indent",
                              "align",
                              "horizontalRule",
                              "list",
                              "lineHeight",
                              "table",
                              "image",
                              "fullScreen",
                              "showBlocks",
                              "codeView",
                              "preview",
                            ],
                          ],
                          iframe: false,
                          tagsBlacklist:
                            "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                          pasteTagsBlacklist:
                            "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                          pasteTagsWhitelist: "p",
                          resizeEnable: false,
                        }}
                        onFocus={handleEditorFocus}
                        onBlur={handleEditorBlur}
                      />
                    </div>
                  </div>
                  {isTestDescription &&
                  extractPlainText(createTestContext.testDescription) === "" ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Please enter test description
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="old-input-container">
                <div className="date-time">
                  <div className="start-date">
                    <span>Starts On</span>
                    <div className="box">
                      <svg
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const startDatePicker = startDate.current;
                          startDatePicker.setFocus(true);
                        }}
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.099 3.33301H4.43229C3.51182 3.33301 2.76562 4.0792 2.76562 4.99967V16.6663C2.76562 17.5868 3.51182 18.333 4.43229 18.333H16.099C17.0194 18.333 17.7656 17.5868 17.7656 16.6663V4.99967C17.7656 4.0792 17.0194 3.33301 16.099 3.33301Z"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M13.5977 1.66699V5.00033"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.93359 1.66699V5.00033"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.76562 8.33301H17.7656"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <DatePicker
                        minDate={new Date()}
                        className="start-date-picker"
                        ref={startDate}
                        placeholderText={"Select date"}
                        locale={enGB}
                        selected={createTestContext.startDate}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) =>
                          createTestContext.setStartDate(date)
                        }
                      ></DatePicker>
                    </div>
                  </div>
                  <div className="start-date">
                    <span>Ends On</span>
                    <div className="box">
                      <svg
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          const startDatePicker = endDate.current;
                          startDatePicker.setFocus(true);
                        }}
                        width="21"
                        height="20"
                        viewBox="0 0 21 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.099 3.33301H4.43229C3.51182 3.33301 2.76562 4.0792 2.76562 4.99967V16.6663C2.76562 17.5868 3.51182 18.333 4.43229 18.333H16.099C17.0194 18.333 17.7656 17.5868 17.7656 16.6663V4.99967C17.7656 4.0792 17.0194 3.33301 16.099 3.33301Z"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M13.5977 1.66699V5.00033"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.93359 1.66699V5.00033"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M2.76562 8.33301H17.7656"
                          stroke="#00C49A"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>

                      <DatePicker
                        minDate={createTestContext.startDate || new Date()}
                        className="start-date-picker"
                        ref={endDate}
                        placeholderText={"Select date"}
                        locale={enGB}
                        selected={createTestContext.endDate}
                        dateFormat="dd/MM/yyyy"
                        type="date"
                        onChange={(date) => createTestContext.setEndDate(date)}
                      />
                    </div>
                  </div>
                </div>
                <div className="test-type-main-container">
                  <div className="test-type">
                    <span>
                      Test Type <label style={{ color: "red" }}>*</label>{" "}
                    </span>
                    <div className="button-container">
                      <div
                        className={
                          createTestContext.testType === "public"
                            ? "active"
                            : "not-active"
                        }
                        onClick={() => {
                          createTestContext.settestType("public");
                        }}
                      >
                        {createTestContext.testType === "public" ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#00C49A"
                              stroke-width="2"
                            />
                            <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#AAAAAA"
                              stroke-width="2"
                            />
                          </svg>
                        )}
                        <span>Public</span>
                      </div>
                      <div
                        className={
                          createTestContext.testType === "private"
                            ? "active"
                            : "not-active"
                        }
                        onClick={() => {
                          createTestContext.settestType("private");
                        }}
                      >
                        {createTestContext.testType === "private" ? (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#00C49A"
                              stroke-width="2"
                            />
                            <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#AAAAAA"
                              stroke-width="2"
                            />
                          </svg>
                        )}
                        <span>Private</span>
                      </div>
                    </div>
                    {isTestType ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Please enter test type
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="test-type">
                    <span>
                      Invite Only <label style={{ color: "red" }}>*</label>
                    </span>
                    {/* <div onClick={() => createTestContext.settestInviteType(!createTestContext.testInviteType)} className="button-container">
                                            <div style={createTestContext.testInviteType ? { gap: "20px", borderColor: '#FF6812' } : { gap: "20px" }} className={createTestContext.testInviteType ? "active" : "not-active"}  >
                                                <span>Yes</span>
                                                {createTestContext.testInviteType ? <svg onClick={() => createTestContext.settestInviteType(false)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.498047" width="20" height="20" rx="2" fill="#FF6812" />
                                                    <path d="M14 8.49805L8.5 13.998L6 11.498" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg> : <svg onClick={() => createTestContext.settestInviteType(true)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.498047" width="20" height="20" rx="2" fill="#999999" />
                                                    <path d="M14 8.49805L8.5 13.998L6 11.498" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>}

                                            </div>
                                            
                                        </div> */}
                    <div className="invite-only-container">
                      <span className="yes-checkbox-container">
                        {createTestContext.testInviteType === "Yes" ? (
                          <svg
                            onClick={() =>
                              createTestContext.settestInviteType("Yes")
                            }
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#00C49A"
                              stroke-width="2"
                            />
                            <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                          </svg>
                        ) : (
                          <svg
                            onClick={() =>
                              createTestContext.settestInviteType("Yes")
                            }
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#AAAAAA"
                              stroke-width="2"
                            />
                          </svg>
                        )}
                        <label>Yes</label>
                      </span>
                      <span className="no-checkbox-container">
                        {createTestContext.testInviteType === "No" ? (
                          <svg
                            onClick={() =>
                              createTestContext.settestInviteType("No")
                            }
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#00C49A"
                              stroke-width="2"
                            />
                            <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                          </svg>
                        ) : (
                          <svg
                            onClick={() =>
                              createTestContext.settestInviteType("No")
                            }
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="9"
                              cy="9"
                              r="8"
                              fill="white"
                              stroke="#AAAAAA"
                              stroke-width="2"
                            />
                          </svg>
                        )}
                        <label>No</label>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="test-details-fields">
                  <div className="test-time">
                    <span>
                      Duration <label style={{ color: "red" }}>*</label>
                    </span>
                    <div className="input-box">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_3187_2225)">
                          <path
                            d="M10.0013 18.3337C14.6037 18.3337 18.3346 14.6027 18.3346 10.0003C18.3346 5.39795 14.6037 1.66699 10.0013 1.66699C5.39893 1.66699 1.66797 5.39795 1.66797 10.0003C1.66797 14.6027 5.39893 18.3337 10.0013 18.3337Z"
                            stroke="#333333"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10 5V10L13.3333 11.6667"
                            stroke="#333333"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_3187_2225">
                            <rect width="20" height="20" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                      <input
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.keyCode === 190 ||
                            evt.keyCode === 110) &&
                          evt.preventDefault()
                        }
                        min={0}
                        max={100}
                        onChange={onChangeTestDuration}
                        value={createTestContext.testTime}
                        placeholder="Duration"
                      />
                      <span>mins</span>
                    </div>

                    {isTestTime && createTestContext.testTime === "" ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Please enter test time
                      </p>
                    ) : (
                      <></>
                    )}
                    {createTestContext.testTime === "0" ||
                    parseInt(createTestContext.testTime) < 0 ||
                    /^0+$|^0*-0+$/.test(createTestContext.testTime) ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Test duration should be greater than zero.
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="test-score">
                    <span>
                      Score <label style={{ color: "red" }}>*</label>
                    </span>
                    <div className="input-box">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.0013 12.4997C13.223 12.4997 15.8346 9.888 15.8346 6.66634C15.8346 3.44468 13.223 0.833008 10.0013 0.833008C6.77964 0.833008 4.16797 3.44468 4.16797 6.66634C4.16797 9.888 6.77964 12.4997 10.0013 12.4997Z"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.84036 11.5747L5.83203 19.1664L9.9987 16.6664L14.1654 19.1664L13.157 11.5664"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <input
                        disabled={true}
                        value={createTestContext.testScore}
                        type="number"
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(evt) =>
                          evt.key === "e" && evt.preventDefault()
                        }
                        min={0}
                        max={100}
                        onChange={(e) => {
                          createTestContext.settestScore(e.target.value);
                        }}
                        placeholder={"Score"}
                      />
                    </div>
                    {isTestScore ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Please enter test score
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                  <div className="cutoff-score">
                    <span>
                      Cutoff <label style={{ color: "red" }}>*</label>
                    </span>
                    <div className="input-box">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.83333 12.6667C13.055 12.6667 15.6667 10.055 15.6667 6.83333C15.6667 3.61167 13.055 1 9.83333 1C6.61167 1 4 3.61167 4 6.83333C4 10.055 6.61167 12.6667 9.83333 12.6667Z"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M6.84036 11.5747L5.83203 19.1664L9.9987 16.6664L14.1654 19.1664L13.157 11.5664"
                          stroke="black"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <line x1="7" y1="6.5" x2="13" y2="6.5" stroke="black" />
                      </svg>
                      <input
                        value={createTestContext.testCutOff}
                        onWheel={(e) => e.target.blur()}
                        onKeyDown={(evt) =>
                          (evt.key === "e" ||
                            evt.keyCode === 190 ||
                            evt.keyCode === 110) &&
                          evt.preventDefault()
                        }
                        min={0}
                        max={100}
                        onChange={onChangeTestCutOffScore}
                        type="number"
                        placeholder={"Cutoff score"}
                      />
                    </div>
                    {createTestContext.question.length ? (
                      <div style={{ fontSize: 12, marginTop: 5 }}>
                        Suggested score:{" "}
                        {(createTestContext.testScore * (35 / 100)).toFixed(0)}
                      </div>
                    ) : (
                      <></>
                    )}
                    {isTestCutOff && createTestContext.testCutOff === "" ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Please enter cut off score
                      </p>
                    ) : (
                      <></>
                    )}
                    {createTestContext.testCutOff === "0" ||
                    (createTestContext.question.length
                      ? parseInt(createTestContext.testCutOff) < 0
                      : false) ||
                    /^0+$|^0*-0+$/.test(createTestContext.testCutOff) ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Test cut off score should be greater than zero.
                      </p>
                    ) : (
                      <></>
                    )}
                    {createTestContext.testCutOff >
                    createTestContext.testScore ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Test cut off score should be less than test score.
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>

                <div className="test-link">
                  <span>
                    Test Link <label style={{ color: "red" }}>*</label>
                  </span>
                  <div className="input-box">
                    <input
                      type="text"
                      onChange={(e) => {
                        createTestContext.settestLink(e.target.value);
                      }}
                      value={createTestContext.testLink}
                      placeholder="https://theeliteqa.com/"
                    />
                    <svg
                      onClick={() => {
                        navigator.clipboard.writeText(
                          createTestContext.testLink
                        );
                        toast.success(`Test Link Copied To ClipBoard`);
                      }}
                      style={{ cursor: "pointer" }}
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.6667 8.13574H9.16667C8.24619 8.13574 7.5 8.88193 7.5 9.80241V17.3024C7.5 18.2229 8.24619 18.9691 9.16667 18.9691H16.6667C17.5871 18.9691 18.3333 18.2229 18.3333 17.3024V9.80241C18.3333 8.88193 17.5871 8.13574 16.6667 8.13574Z"
                        stroke="#2D2D2D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.16797 13.1361H3.33464C2.89261 13.1361 2.46868 12.9605 2.15612 12.6479C1.84356 12.3354 1.66797 11.9114 1.66797 11.4694V3.9694C1.66797 3.52737 1.84356 3.10345 2.15612 2.79089C2.46868 2.47833 2.89261 2.30273 3.33464 2.30273H10.8346C11.2767 2.30273 11.7006 2.47833 12.0131 2.79089C12.3257 3.10345 12.5013 3.52737 12.5013 3.9694V4.80273"
                        stroke="#2D2D2D"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  {isTestLink && createTestContext.testLink === "" ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Please enter test link
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            </div>

            <div className="add-admin-container">
              <div className="admin-heading">
                <span>Test Admins</span>
                <div className="add-admin-button">
                  <span
                    onClick={() => {
                      setAddAdminPopup(true);
                    }}
                  >
                    + Add Admin
                  </span>
                </div>
              </div>

              <div className="admin-data-table">
                <table cellSpacing="0" className="admin-table">
                  <tr className="admin-table-header">
                    <th>Name</th>
                    <th>Email ID</th>
                    <th></th>
                    <th>Access</th>
                    <th>Delete</th>
                  </tr>
                  {createTestContext.testAdmins
                    .filter(
                      (v, i, a) =>
                        a.findIndex((v2) => v2.fullName === v.fullName) === i
                    )
                    .map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{data.fullName}</td>
                          <td>{data.email}</td>
                          <td></td>
                          <td>
                            All Access
                            <svg
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{
                                marginLeft: "10px",
                              }}
                            >
                              <path
                                d="M0.998804 1.13574L4.87636 6.13574L8.75391 1.13574"
                                stroke="black"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </td>
                          <td>
                            <svg
                              onClick={() => {
                                setDeleteSkillSetModel(true);
                                setselectedAdmin(data);
                              }}
                              width="16"
                              height="17"
                              viewBox="0 0 16 17"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g clip-path="url(#clip0_3140_2467)">
                                <path
                                  d="M2 4.63574H3.33333H14"
                                  stroke="#999999"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M12.6654 4.63542V13.9688C12.6654 14.3224 12.5249 14.6615 12.2748 14.9116C12.0248 15.1616 11.6857 15.3021 11.332 15.3021H4.66536C4.31174 15.3021 3.9726 15.1616 3.72256 14.9116C3.47251 14.6615 3.33203 14.3224 3.33203 13.9688V4.63542M5.33203 4.63542V3.30208C5.33203 2.94846 5.47251 2.60932 5.72256 2.35927C5.9726 2.10923 6.31174 1.96875 6.66536 1.96875H9.33203C9.68565 1.96875 10.0248 2.10923 10.2748 2.35927C10.5249 2.60932 10.6654 2.94846 10.6654 3.30208V4.63542"
                                  stroke="#999999"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M6.66797 7.96875V11.9688"
                                  stroke="#999999"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M9.33203 7.96875V11.9688"
                                  stroke="#999999"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_3140_2467">
                                  <rect
                                    width="16"
                                    height="16"
                                    fill="white"
                                    transform="translate(0 0.635742)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </div>
            </div>

            <div className="bottom-container">
              <div className="left-container">
                <div className="custom-input-box">
                  <span>
                    Candidate Data To Be Collected{" "}
                    <label style={{ color: "red" }}>*</label>
                  </span>
                  <div className="select-box-container">
                    <div className="select-box">
                      <select
                        value={selectedCanidateSetting}
                        name=""
                        id=""
                        onChange={(e) => addTestCandidateData(e.target.value)}
                      >
                        <option value="">Select</option>
                        {!createTestContext.testCandidateData.includes(
                          "Name"
                        ) && <option value="">Select</option>}
                        {!createTestContext.testCandidateData.includes(
                          "Name"
                        ) && <option value="Name">Name</option>}
                        {!createTestContext.testCandidateData.includes(
                          "Email"
                        ) && <option value="Email">Email</option>}
                        {!createTestContext.testCandidateData.includes(
                          "Phone No."
                        ) && <option value="Phone No.">Phone No.</option>}
                        {!createTestContext.testCandidateData.includes(
                          "College"
                        ) && <option value="College">College</option>}
                        {/* <option value="Name">Name</option>
                        <option value="Email">Email</option>
                        <option value="Phone No.">Phone No.</option>
                        <option value="College">College</option> */}
                      </select>
                      <svg
                        className="vector-svg"
                        width="14"
                        height="8"
                        viewBox="0 0 14 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 1L7 7L13 1"
                          stroke="black"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                    {/* <button onClick={() => {
                                            setCustomInput(true);
                                        }}>
                                            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="10" cy="10.6357" r="10" fill="white" />
                                                <path d="M10 6.55273V14.7194" stroke="#384455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M5.91797 10.6357H14.0846" stroke="#384455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            Custom
                                        </button> */}
                  </div>
                  {isTestCandidateData &&
                  createTestContext.testCandidateData.length === 0 ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Please add alteast one candidate data
                    </p>
                  ) : (
                    <div></div>
                  )}
                  <div
                    style={
                      !createTestContext.testCandidateData.length
                        ? { marginTop: "0px" }
                        : {}
                    }
                    className="candidate-list-item-container"
                  >
                    {createTestContext.testCandidateData?.map((data, index) => {
                      console.log(data);
                      return (
                        <button>
                          <span>{data}</span>
                          <svg
                            onClick={() => {
                              removeDetails(data);
                            }}
                            width="20"
                            height="21"
                            viewBox="0 0 20 21"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="10" cy="10.5" r="10" fill="#00C49A" />
                            <path
                              d="M13 7.5L7 13.5"
                              stroke="white"
                              stroke-linecap="round"
                            />
                            <path
                              d="M13 13.5L7.00019 7.50019"
                              stroke="white"
                              stroke-linecap="round"
                            />
                          </svg>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="proctoring-settings-container">
                  <div className="proctoring-settings">
                    <span>
                      Proctoring Settings{" "}
                      <label style={{ color: "red" }}>*</label>
                    </span>
                    {createTestContext.proctoringSetting.map((data) => {
                      return (
                        <div className="setting">
                          <label className="switch">
                            <input
                              onChange={(e) =>
                                changeProctoringSettingStatus(
                                  data.setting,
                                  e.target.checked
                                )
                              }
                              type="checkbox"
                              checked={data.active}
                            />
                            <span className="slider round"></span>
                          </label>
                          <span>{data.setting}</span>
                        </div>
                      );
                    })}
                    {isTestProctoringSetting && checkIsTestProctoringSetting ? (
                      <p
                        style={{
                          color: "red",
                          fontSize: 12,
                          fontWeight: "normal",
                        }}
                      >
                        Please add atleast one proctoring setting
                      </p>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </div>
              <div className="right-container">
                <div className="test-instructions">
                  <span>
                    Test Instructions <label style={{ color: "red" }}>*</label>
                  </span>
                  <div className="input-container">
                    <div className="input-box">
                      <input
                        value={instructionData}
                        onChange={(e) => {
                          setInstructionData(e.target.value);
                        }}
                        type="text"
                        placeholder="Test instruction here"
                      />
                    </div>
                    <button onClick={addTestInstruction}>
                      <svg
                        width="20"
                        height="21"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10" cy="10.6357" r="10" fill="white" />
                        <path
                          d="M10 6.55273V14.7194"
                          stroke="#384455"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5.91797 10.6357H14.0846"
                          stroke="#384455"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  {isInstructionBlank ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Please enter instruction
                    </p>
                  ) : (
                    <></>
                  )}
                  {isTestInstruction &&
                  createTestContext.testInstructions.length === 0 ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Please add atleast one instruction
                    </p>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="test-instruction-container">
                  {createTestContext.testInstructions.map((data, index) => {
                    return (
                      <div
                        className={
                          selectedInstruction === index
                            ? "active-instruction"
                            : "instruction"
                        }
                        onClick={() => {
                          setSelectedInstruction(index);
                        }}
                      >
                        <ul>
                          <li>{data.instruction}</li>
                        </ul>

                        {selectedInstruction === index ? (
                          <svg
                            onClick={() => {
                              removeInstruction(index);
                            }}
                            width="17"
                            height="17"
                            viewBox="0 0 17 17"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.5 4.63574L4.5 12.6357"
                              stroke="#00C49A"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.5 4.63574L12.5 12.6357"
                              stroke="#00C49A"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSetting;
