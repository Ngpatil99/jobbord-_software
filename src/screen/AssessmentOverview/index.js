import React, {
  useRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "./index.css";
import AssessmentPreviewSideBar from "../../component/AssessmentOverviewSidebar";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import EditTestInstruction from "../../component/EditTestInstruction";
import EditBannerInstruction from "../../component/EditBannerInstruction";
import AssessmentOverviewAdmin from "../../component/AssessmnetOverviewAdmin";
import ToggleButton from "../../component/ToggleButton";
import {
  Link,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
} from "react-router-dom";
import AssessmentToggleButton from "../../component/AssessmentToggleButton";
import "./rich-editor.css";
import {
  EditorState,
  AtomicBlockUtils,
  convertToRaw,
  Modifier,
  RichUtils,
  convertFromRaw,
  ContentState,
} from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import CreateTestContext from "../../store/CreateTestContext";
import DeleteSkillSetModel from "../../component/DeleteSkillSetModel";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import TestSummaryContext from "../../store/TestSummaryContext";
import EditTestDetailsModal from "../../component/EditTestDetailsModal";
import EditCandidateInvite from "../../component/EditCandidateInvite";
import EditTestCandidateDetails from "../../component/EditTestCandidateDetails";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

function AssessmentOverview() {
  const navigate = useNavigate();
  const createTestContext = useContext(CreateTestContext);
  const testSummaryContext = useContext(TestSummaryContext);
  const { state } = useLocation();
  const [editBannerInstruction, setEditBannerInstruction] = useState(false);
  const [editInstruction, seteditInstruction] = useState(false);
  const [assessmentAdmin, setassessmentAdmin] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [editTestDetails, seteditTestDetails] = useState(false);
  const [editTestCandidateDetails, seteditTestCandidateDetails] =
    useState(false);
  const [deleteSkillSetModel, setDeleteSkillSetModel] = useState(false);
  const [red2, setred2] = useState({
    status: false,
    index: null,
  });
  const [test, setTest] = useState(testSummaryContext.test);
  const [proctoringSettings, setProctoringSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [testDescription, setTestDescription] = useState("");

  const [searchPage, setsearchPage] = useState(1);
  const [editorContent, setEditorContent] = useState("");
  const [questionEditorFocused, setQuestionEditorFocused] = useState(false);
  const [isInviteData, setisInviteData] = useState([]);

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  let className = "RichEditor-editor";
  const editor = useRef(null);

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const handleEditorFocus = () => {
    setQuestionEditorFocused(true);
  };

  const handleEditorBlur = (event, editorContents) => {
    setQuestionEditorFocused(false);
  };

  const extractPlainText = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  const updateTest = async () => {
    try {
      if (extractPlainText(editorContent) === test.description) {
        return;
      } else if (
        editorContent.length &&
        extractPlainText(editorContent) !== test.description
      ) {
        const token = getCookie("Xh7ERL0G");
        let body = {
          ...test,
          name: test.name,
          startDate: test.startDate,
          endDate: test.endDate,
          cutOff: test.cutOff,
          totalTiming: test.totalTiming,
          totalScore: test.totalScore,
          testType: test.testType,
          testInviteOnly: test.testInviteOnly,
          description: extractPlainText(editorContent),
          html: editorContent,
          image: "",
        };

        const res = await axios.put(
          `${backend_url}test/update/${test._id}`,
          body,
          { headers: { token: token } }
        );
        toast.success("Test Instructions are saved successfully");
        setEditDescription(false);
        setTest(res.data.data);
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to save test instruction.");
    }
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

  // const focus = () => {
  //     if (editor.current) editor.current.focus();
  // };

  // const handleKeyCommand = useCallback(
  //     (command, editorState) => {
  //         const newState = RichUtils.handleKeyCommand(editorState, command);
  //         if (newState) {
  //             createTestContext.setTestDescription(newState);
  //             return 'handled';
  //         }
  //         return 'not-handled';
  //     },
  //     [createTestContext.testDescription, createTestContext.setTestDescription],
  // );

  // const mapKeyToEditorCommand = useCallback(
  //     e => {
  //         switch (e.keyCode) {

  //             case 9: // TAB
  //                 const newEditorState = RichUtils.onTab(
  //                     e,
  //                     createTestContext.testDescription,
  //                     4 /* maxDepth */,
  //                 );
  //                 if (newEditorState !== createTestContext.testDescription) {
  //                     createTestContext.setTestDescription(newEditorState);
  //                 }
  //                 return null;
  //         }
  //         return getDefaultKeyBinding(e);
  //     },
  //     [createTestContext.testDescription, createTestContext.setTestDescription],
  // );

  // const styleMap = {
  //     CODE: {
  //         backgroundColor: 'rgba(0, 0, 0, 0.05)',
  //         fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
  //         fontSize: 16,
  //         padding: 2,
  //     },
  // };

  // function getBlockStyle(block) {
  //     switch (block.getType()) {
  //         case 'blockquote':
  //             return 'RichEditor-blockquote';
  //         default:
  //             return null;
  //     }
  // }

  // const INLINE_STYLES = [
  //     { label: 'Bold', style: 'BOLD' },
  //     { label: 'Italic', style: 'ITALIC' },
  //     { label: 'Underline', style: 'UNDERLINE' },
  //     { label: 'Monospace', style: 'CODE' },
  // ];

  // function InlineStyleControls({ editorState, onToggle }) {
  //     const currentStyle = editorState.getCurrentInlineStyle();
  //     return (
  //         <div className="RichEditor-controls">
  //             {INLINE_STYLES.map(type => (
  //                 <StyleButton
  //                     key={type.label}
  //                     active={currentStyle.has(type.style)}
  //                     label={type.label}
  //                     onToggle={onToggle}
  //                     style={type.style}
  //                 />
  //             ))}
  //         </div>
  //     );
  // }

  // function StyleButton({ onToggle, active, label, style }) {
  //     let className = 'RichEditor-styleButton';
  //     if (active) {
  //         className += ' RichEditor-activeButton';
  //     }

  //     return (
  //         <span
  //             className={className}
  //             onMouseDown={e => {
  //                 e.preventDefault();
  //                 onToggle(style);
  //             }}>
  //             {label}
  //         </span>
  //     );
  // }

  // const BLOCK_TYPES = [
  //     { label: 'H1', style: 'header-one' },
  //     { label: 'H2', style: 'header-two' },
  //     { label: 'H3', style: 'header-three' },
  //     { label: 'H4', style: 'header-four' },
  //     { label: 'H5', style: 'header-five' },
  //     { label: 'H6', style: 'header-six' },
  //     { label: 'Blockquote', style: 'blockquote' },
  //     { label: 'UL', style: 'unordered-list-item' },
  //     { label: 'OL', style: 'ordered-list-item' },
  //     { label: 'Code Block', style: 'code-block' },
  // ];

  // function BlockStyleControls({ editorState, onToggle }) {
  //     const selection = editorState.getSelection();
  //     const blockType = editorState
  //         .getCurrentContent()
  //         .getBlockForKey(selection.getStartKey())
  //         .getType();

  //     return (
  //         <div className="RichEditor-controls">
  //             {BLOCK_TYPES.map(type => (
  //                 <StyleButton
  //                     key={type.label}
  //                     active={type.style === blockType}
  //                     label={type.label}
  //                     onToggle={onToggle}
  //                     style={type.style}
  //                 />
  //             ))}
  //         </div>
  //     );
  // }

  const closeButton = () => {
    setDeleteSkillSetModel(false);
    setAdminToDelete("");
    getTestById();
  };

  useEffect(() => {
    window.addEventListener("popstate", function (event) {
      navigate("/assessment");
    });
    getTestById();
  }, []);
  const { id } = useParams();
  const getTestById = async () => {
    try {
      setLoading(true);
      testSummaryContext.handleTestId(id);
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(`${backend_url}test/find/${id}`, {
        headers: { token: token },
      });
      setisInviteData(response.data.inviteData);
      setTest(response.data.data);
      setEditorContent(response.data.data.html);
      testSummaryContext.handleTest(response.data.data);
      if (response.data.data.proctoringSettings?.length === 0) {
        const settings = [
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
            active: false,
          },
          {
            setting: "Turn Off copy paste from external sources",
            active: false,
          },
          {
            setting: "Logout on leaving a test interface",
            active: false,
          },
        ];
        setProctoringSettings(settings);
      } else {
        setProctoringSettings(response.data.data.proctoringSettings);
      }

      setLoading(false);
    } catch (error) {
      const settings = [
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
          active: false,
        },
        {
          setting: "Turn Off copy paste from external sources",
          active: false,
        },
        {
          setting: "Logout on leaving a test interface",
          active: false,
        },
      ];
      setProctoringSettings(settings);
      setLoading(false);
      console.log(error);
    }
  };

  const updateTestDetails = (data) => {
    setTest(data);
    setTestDescription(data.description.slice(0, 20));
    testSummaryContext.handleTest(data);
    if (data?.proctoringSettings?.length === 0) {
      const settings = [
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
          active: false,
        },
        {
          setting: "Turn Off copy paste from external sources",
          active: false,
        },
        {
          setting: "Logout on leaving a test interface",
          active: false,
        },
      ];
      setProctoringSettings(settings);
    } else {
      setProctoringSettings(data.proctoringSettings);
    }
    seteditTestDetails(false);
  };

  const updateCandidateDetails = (data) => {
    setTest(data);
    seteditTestCandidateDetails(false);
  };

  const formatDateWithMonthInWords = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthIndex = date.getMonth();
    const monthName = months[monthIndex];
    const formattedDate = `${date.getDate()}th ${monthName} ${date.getFullYear()}`;
    return formattedDate;
  };

  const handleToggle = async (index) => {
    try {
      const settings = proctoringSettings?.map((data, i) => {
        if (index === i) {
          data.active = !data.active;
        }
        return data;
      });
      setProctoringSettings(settings);

      const token = getCookie("Xh7ERL0G");
      const response = await axios.put(
        `${backend_url}test/update/${test._id}`,
        {
          ...test,
          proctoringSettings: settings,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        toast.success("Proctoring setting updated successfully.");
        setTest({ ...test, proctoringSettings: settings });
      }
      getTestById();
    } catch (error) {
      console.log(error);
      toast.error("Opps, try again!");
    }
  };

  const handleTestCandidatePopup = () => {
    seteditTestCandidateDetails(false);
    getTestById();
  };
  const handleTestInstructionPopup = () => {
    seteditInstruction(false);
    getTestById();
  };

  const handleTestEditPopup = () => {
    setEditBannerInstruction(false);
    getTestById();
  };

  const deleteTestAdmins = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const deletedData = test.testAdmins
        .filter((data) => {
          return data.admin._id !== adminToDelete;
        })
        ?.map((data) => {
          return {
            admin: data.admin._id,
            access: data.access,
          };
        });
      await axios.put(
        `${backend_url}test/update/${test._id}`,
        {
          ...test,
          testAdmins: deletedData,
        },
        { headers: { token: token } }
      );
      getTestById();
      setDeleteSkillSetModel(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleTestDescription = () => {
    if (test.status !== "draft" && isInviteData.length) {
      toast("Test is in published mode and you have invited candidate");
    } else {
      setEditDescription(true);
      setEditorContent(test.html);
    }
  };

  const editTest = async () => {
    try {
      setEditLoading(true);
      const token = getCookie("Xh7ERL0G");

      const response = await axios.put(
        `${backend_url}test/update/${test._id}`,
        {
          ...test,
          description: editorState.getCurrentContent().getPlainText(),
        },
        { headers: { token: token } }
      );
      toast.success("Description edited successfully.");
      setEditLoading(false);
      setEditDescription(false);
    } catch (error) {
      setEditLoading(false);
      console.log(error);
    }
  };

  const onChangeToggle = async (e, data1) => {
    if (test.status !== "draft" && isInviteData.length) {
      toast("Test is in published mode and you have invited candidate");
    } else {
      const settings = proctoringSettings?.map((data, i) => {
        if (data.setting === data1) {
          data.active = !data.active;
        }
        return data;
      });
      setProctoringSettings(settings);

      const token = getCookie("Xh7ERL0G");
      const response = await axios.put(
        `${backend_url}test/update/${test._id}`,
        {
          ...test,
          proctoringSettings: settings,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        toast.success("Proctoring setting updated successfully.");
        setTest({ ...test, proctoringSettings: settings });
      }
      getTestById();
    }
  };

  return (
    <div className="AssessmentOverview">
      <NavigationBar assessment={false} />
      {editTestDetails && (
        <EditTestDetailsModal
          testDetails={test}
          close={() => seteditTestDetails(false)}
          updateTestDetailsOnPage={updateTestDetails}
        />
      )}
      {editTestCandidateDetails ? (
        <EditTestCandidateDetails
          close={() => seteditTestCandidateDetails(false)}
          testDetails={test}
          updateTestDetailsOnPage={updateCandidateDetails}
        />
      ) : (
        <></>
      )}
      {deleteSkillSetModel && (
        <DeleteSkillSetModel
          admin={true}
          onClickNo={closeButton}
          onClickYes={deleteTestAdmins}
        />
      )}
      {editInstruction && (
        <EditTestInstruction
          closeEditInstruction={() => {
            handleTestInstructionPopup();
          }}
          testData={test}
        />
      )}
      {editBannerInstruction && (
        <EditBannerInstruction
          closeEditBannerInstruction={() => {
            handleTestEditPopup();
          }}
          testData={test}
        />
      )}
      {assessmentAdmin && (
        <AssessmentOverviewAdmin
          close={() => {
            setassessmentAdmin(false);
          }}
          test={test}
          getTestById={getTestById}
        />
      )}
      <div className="assessmentOverview-container">
        <div className="assessmentOverview-container-left">
          <AssessmentPreviewSideBar
            testType={test?.status}
            testDetails={test}
            active={"test overview"}
            testName={test?.name}
          />
        </div>
        <div className="assessmentOverview-container-right">
          <div className="assessmentOverview-container-content">
            <div className="assessment-header">
              <div className="header-left">
                <svg
                  width="45"
                  height="45"
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
                  <path
                    d="M14 24C14 24 18 16 25 16C32 16 36 24 36 24C36 24 32 32 25 32C18 32 14 24 14 24Z"
                    stroke="#00C49A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M25 27C26.6569 27 28 25.6569 28 24C28 22.3431 26.6569 21 25 21C23.3431 21 22 22.3431 22 24C22 25.6569 23.3431 27 25 27Z"
                    stroke="#00C49A"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="title">
                  <span>
                    {test?.name || "Loading..."}{" "}
                    <button
                      data-tip={test?.status}
                      style={
                        test?.status === "published"
                          ? {}
                          : test?.status === "draft"
                          ? { backgroundColor: "#DEE2E8" }
                          : { backgroundColor: "#D6FFF6" }
                      }
                      className="status-button"
                    >
                      <div
                        style={
                          test?.status === "published"
                            ? {}
                            : test?.status === "draft"
                            ? { backgroundColor: "#384455" }
                            : { backgroundColor: "#00C49A" }
                        }
                        className="circle"
                      >
                        {/* Document Icon */}
                        <svg
                          width="8"
                          height="9"
                          viewBox="0 0 8 9"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M6.55997 1.31647L5.7115 0.468004C5.5635 0.319195 5.38747 0.201212 5.19358 0.120881C4.99968 0.0405496 4.79179 -0.000534645 4.58191 5.25282e-06H1.59727C1.1738 0.000512499 0.767824 0.168958 0.468388 0.468394C0.168953 0.767829 0.000507246 1.1738 0 1.59727V7.34742C0.000507246 7.77089 0.168953 8.17687 0.468388 8.4763C0.767824 8.77574 1.1738 8.94418 1.59727 8.94469H5.4307C5.85417 8.94418 6.26014 8.77574 6.55958 8.4763C6.85901 8.17687 7.02746 7.77089 7.02797 7.34742V2.44606C7.02851 2.23618 6.98742 2.02829 6.90709 1.8344C6.82676 1.6405 6.70878 1.46447 6.55997 1.31647ZM6.10826 1.76818C6.15341 1.81358 6.19397 1.86334 6.22933 1.91672H5.4307C5.34598 1.91672 5.26472 1.88307 5.20481 1.82316C5.1449 1.76325 5.11125 1.68199 5.11125 1.59727V0.798638C5.16465 0.834103 5.2144 0.874766 5.25979 0.92003L6.10826 1.76818ZM5.4307 8.30578H1.59727C1.34309 8.30578 1.09933 8.20481 0.919603 8.02509C0.739876 7.84536 0.638906 7.6016 0.638906 7.34742V1.59727C0.638906 1.3431 0.739876 1.09934 0.919603 0.919608C1.09933 0.739881 1.34309 0.638911 1.59727 0.638911H4.47234V1.59727C4.47234 1.85144 4.57331 2.09521 4.75304 2.27493C4.93277 2.45466 5.17653 2.55563 5.4307 2.55563H6.38906V7.34742C6.38906 7.6016 6.28809 7.84536 6.10836 8.02509C5.92864 8.20481 5.68487 8.30578 5.4307 8.30578Z"
                            fill="white"
                          />
                          <path
                            d="M1.91662 2.87523H3.19443C3.27916 2.87523 3.36041 2.84158 3.42032 2.78167C3.48023 2.72176 3.51389 2.64051 3.51389 2.55578C3.51389 2.47106 3.48023 2.3898 3.42032 2.32989C3.36041 2.26998 3.27916 2.23633 3.19443 2.23633H1.91662C1.8319 2.23633 1.75064 2.26998 1.69073 2.32989C1.63082 2.3898 1.59717 2.47106 1.59717 2.55578C1.59717 2.64051 1.63082 2.72176 1.69073 2.78167C1.75064 2.84158 1.8319 2.87523 1.91662 2.87523Z"
                            fill="white"
                          />
                          <path
                            d="M5.11115 3.51392H1.91662C1.8319 3.51392 1.75064 3.54757 1.69073 3.60748C1.63082 3.66739 1.59717 3.74864 1.59717 3.83337C1.59717 3.91809 1.63082 3.99935 1.69073 4.05926C1.75064 4.11917 1.8319 4.15282 1.91662 4.15282H5.11115C5.19588 4.15282 5.27713 4.11917 5.33704 4.05926C5.39695 3.99935 5.4306 3.91809 5.4306 3.83337C5.4306 3.74864 5.39695 3.66739 5.33704 3.60748C5.27713 3.54757 5.19588 3.51392 5.11115 3.51392Z"
                            fill="white"
                          />
                          <path
                            d="M5.11115 4.79175H1.91662C1.8319 4.79175 1.75064 4.8254 1.69073 4.88531C1.63082 4.94522 1.59717 5.02648 1.59717 5.1112C1.59717 5.19593 1.63082 5.27718 1.69073 5.33709C1.75064 5.397 1.8319 5.43065 1.91662 5.43065H5.11115C5.19588 5.43065 5.27713 5.397 5.33704 5.33709C5.39695 5.27718 5.4306 5.19593 5.4306 5.1112C5.4306 5.02648 5.39695 4.94522 5.33704 4.88531C5.27713 4.8254 5.19588 4.79175 5.11115 4.79175Z"
                            fill="white"
                          />
                          <path
                            d="M4.47225 6.06958H1.91662C1.8319 6.06958 1.75064 6.10324 1.69073 6.16315C1.63082 6.22305 1.59717 6.30431 1.59717 6.38903C1.59717 6.47376 1.63082 6.55501 1.69073 6.61492C1.75064 6.67483 1.8319 6.70849 1.91662 6.70849H4.47225C4.55697 6.70849 4.63822 6.67483 4.69813 6.61492C4.75804 6.55501 4.7917 6.47376 4.7917 6.38903C4.7917 6.30431 4.75804 6.22305 4.69813 6.16315C4.63822 6.10324 4.55697 6.06958 4.47225 6.06958Z"
                            fill="white"
                          />
                        </svg>
                      </div>
                      <span>{test?.status}</span>
                    </button>{" "}
                  </span>

                  <div className="info">
                    <p>{`${test?.experience} years` || "NA"}|</p>
                    <p>
                      {test?.startDate !== undefined && test?.startDate !== null
                        ? formatDateWithMonthInWords(test?.startDate)
                        : "NA"}{" "}
                      -{" "}
                      {test?.endDate !== undefined && test?.endDate !== null
                        ? formatDateWithMonthInWords(test?.endDate)
                        : "NA"}{" "}
                      |
                    </p>
                    <p>{test?.jobRole.jobrole || "NA"} |</p>
                    <p>
                      {test?.cutOff || 0}/{test?.totalScore || 0} |
                    </p>
                    <p
                      style={test?.testInviteOnly ? null : { display: "none" }}
                    >
                      {test?.testInviteOnly ? "Invite only |" : null}{" "}
                    </p>
                    <p>{test?.totalTiming + " " + "mins" || "NA"}</p>
                  </div>
                </div>
              </div>
              <div className="header-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(
                      `https://www.assessment.theeliteqa.com/preview?testId=${id}`
                    );
                  }}
                  className="test-preview-button"
                >
                  {/* Test Preview Icon */}
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.1449 8.04901V11.764C11.1449 12.0924 11.0145 12.4074 10.7822 12.6396C10.55 12.8719 10.235 13.0023 9.90659 13.0023H3.09576C2.76733 13.0023 2.45235 12.8719 2.22012 12.6396C1.98789 12.4074 1.85742 12.0924 1.85742 11.764V4.95318C1.85742 4.62475 1.98789 4.30978 2.22012 4.07754C2.45235 3.84531 2.76733 3.71484 3.09576 3.71484H6.81075"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M9.28711 1.85742H13.0021V5.57242"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.19141 8.66825L13.0022 1.85742"
                      stroke="#fff"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <span>Test Preview</span>
                </button>
                <svg
                  onClick={() => {
                    // test.status !== "draft" &&
                    // isInviteData.length &&
                    // new Date(test.startDate) < new Date()
                    //   ? toast(
                    //       "Test is in published mode and you have invited candidate"
                    //     )
                    //   : seteditTestDetails(true);
                    seteditTestDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="11" cy="11" r="11" fill="#00C49A" />
                  <path
                    d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z"
                    fill="#00C49A"
                    stroke="white"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* <div className="assessment-banner">
                            <div className="banner-title">
                                <span>{test?.name || "Loading..."}</span>
                                <svg onClick={() => { setEditBannerInstruction(true) }} style={{ cursor: "pointer" }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="11" fill="white" />
                                    <path d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z" fill="white" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div className="banner-bottom">
                                <div className="banner-details">
                                    <span>From {formatDateWithMonthInWords(test?.startDate) || "Loading..."} To {test?.endDate !== undefined ? formatDateWithMonthInWords(test?.endDate) || "Loading..." : "NA"} </span>
                                    <span>For Job role: {test?.jobRole.jobrole || "NA"}</span>
                                    <span>Total Score: {test?.totalScore || 0}  | Cutoff Score: {test?.cutOff || 0}</span>
                                </div>
                                <div className="banner-info">
                                    <button>{test?.testType || "Loading..."} : {test?.testInviteOnly ? "Invite only" : null}</button>
                                    <button>Duration: {test?.totalTiming + " " + "mins" || "NA"}</button>
                                </div>
                            </div>
                        </div> */}

            <div className="assessment-body">
              {editDescription ? (
                <div style={{ width: "48.5%", height: 80 }}>
                  <SunEditor
                    setContents={editorContent}
                    onChange={handleChange}
                    onImageUploadBefore={onImageUploadBefore}
                    height="60"
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
                  ></SunEditor>
                  <div className="bottom-button-container">
                    <button onClick={() => updateTest()}>Save</button>
                    <button onClick={() => setEditDescription(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="assessment-test-description">
                  <div className="description-title">
                    <span>Test Description</span>
                    <svg
                      onClick={() => {
                        handleTestDescription();
                      }}
                      style={{ cursor: "pointer" }}
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="11" cy="11" r="11" fill="#00C49A" />
                      <path
                        d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z"
                        fill="#00C49A"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="editor">
                    <SunEditor
                      height="150"
                      setOptions={{ resizeEnable: false }}
                      setContents={editorContent}
                      hideToolbar={true}
                      disable={true}
                    />
                  </div>
                </div>
              )}
              <div className="assessment-link-settings">
                <div className="assessment-link">
                  <div className="link">
                    <input type="text" value={test?.link || "no link"} />
                  </div>
                  <button
                    onClick={() => {
                      if (test?.status === "draft") {
                        toast.error("test in draft mode");
                      } else {
                        navigator.clipboard.writeText(test?.link);
                        toast.success(`Test Link Copied To ClipBoard`);
                      }
                    }}
                    className="link-btn"
                    style={{ cursor: "pointer" }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_3190_3821)">
                        <path
                          d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.16406 12.5003H3.33073C2.8887 12.5003 2.46478 12.3247 2.15222 12.0122C1.83966 11.6996 1.66406 11.2757 1.66406 10.8337V3.33366C1.66406 2.89163 1.83966 2.46771 2.15222 2.15515C2.46478 1.84259 2.8887 1.66699 3.33073 1.66699H10.8307C11.2728 1.66699 11.6967 1.84259 12.0092 2.15515C12.3218 2.46771 12.4974 2.89163 12.4974 3.33366V4.16699"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3190_3821">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>

                <div className="proctoring-setting">
                  <div className="settings-title">
                    <span style={{ marginTop: "8px" }}>
                      Proctoring Settings
                    </span>
                    {/* <svg style={{ cursor: "pointer" }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="11" cy="11" r="11" fill="#00C49A" />
                                            <path d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z" fill="#00C49A" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> */}
                  </div>
                  <div className="settings-list">
                    {test?.proctoringSettings?.length === 0
                      ? proctoringSettings?.map((data, index) => {
                          return (
                            <div className="group" key={index}>
                              <span>
                                {data.active ? (
                                  <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15.5 7.81429V8.50429C15.4991 10.1216 14.9754 11.6953 14.007 12.9907C13.0386 14.286 11.6775 15.2337 10.1265 15.6922C8.57557 16.1508 6.91794 16.0957 5.40085 15.5352C3.88376 14.9747 2.58849 13.9389 1.70822 12.5821C0.82795 11.2253 0.409843 9.62034 0.516258 8.00653C0.622672 6.39272 1.24791 4.85654 2.29871 3.6271C3.34951 2.39766 4.76959 1.54083 6.34714 1.1844C7.92469 0.827975 9.5752 0.991046 11.0525 1.64929"
                                      stroke="#00C49A"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M15.5 2.50391L8 10.0114L5.75 7.76141"
                                      stroke="#00C49A"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15.5 7.31429V8.00429C15.4991 9.62161 14.9754 11.1953 14.007 12.4907C13.0386 13.786 11.6775 14.7337 10.1265 15.1922C8.57557 15.6508 6.91794 15.5957 5.40085 15.0352C3.88376 14.4747 2.58849 13.4389 1.70822 12.0821C0.82795 10.7253 0.409843 9.12034 0.516258 7.50653C0.622672 5.89272 1.24791 4.35654 2.29871 3.1271C3.34951 1.89766 4.76959 1.04083 6.34714 0.684402C7.92469 0.327975 9.5752 0.491046 11.0525 1.14929"
                                      stroke="#827C7C"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M15.5 2.00391L8 9.51141L5.75 7.26141"
                                      stroke="#827C7C"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                )}
                                {data.setting}
                              </span>
                              {/* <AssessmentToggleButton status={data.active} testDataIndex={index} toggleSettings={handleToggle} /> */}
                              <label class="switch">
                                <input
                                  checked={data.active}
                                  onChange={(e) => {
                                    onChangeToggle(e, data.setting);
                                  }}
                                  type="checkbox"
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          );
                        })
                      : test?.proctoringSettings?.map((data, index) => {
                          return (
                            <div className="group" key={index}>
                              <span>
                                {data.active ? (
                                  <svg
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15.5 7.81429V8.50429C15.4991 10.1216 14.9754 11.6953 14.007 12.9907C13.0386 14.286 11.6775 15.2337 10.1265 15.6922C8.57557 16.1508 6.91794 16.0957 5.40085 15.5352C3.88376 14.9747 2.58849 13.9389 1.70822 12.5821C0.82795 11.2253 0.409843 9.62034 0.516258 8.00653C0.622672 6.39272 1.24791 4.85654 2.29871 3.6271C3.34951 2.39766 4.76959 1.54083 6.34714 1.1844C7.92469 0.827975 9.5752 0.991046 11.0525 1.64929"
                                      stroke="#00C49A"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M15.5 2.50391L8 10.0114L5.75 7.76141"
                                      stroke="#00C49A"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M15.5 7.31429V8.00429C15.4991 9.62161 14.9754 11.1953 14.007 12.4907C13.0386 13.786 11.6775 14.7337 10.1265 15.1922C8.57557 15.6508 6.91794 15.5957 5.40085 15.0352C3.88376 14.4747 2.58849 13.4389 1.70822 12.0821C0.82795 10.7253 0.409843 9.12034 0.516258 7.50653C0.622672 5.89272 1.24791 4.35654 2.29871 3.1271C3.34951 1.89766 4.76959 1.04083 6.34714 0.684402C7.92469 0.327975 9.5752 0.491046 11.0525 1.14929"
                                      stroke="#827C7C"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M15.5 2.00391L8 9.51141L5.75 7.26141"
                                      stroke="#827C7C"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                )}
                                {data.setting}
                              </span>
                              {/* <AssessmentToggleButton status={data.active} testDataIndex={index} toggleSettings={handleToggle} /> */}
                              <label class="switch">
                                <input
                                  checked={data.active}
                                  onChange={(e) => {
                                    onChangeToggle(e, data.setting);
                                  }}
                                  type="checkbox"
                                />
                                <span class="slider round"></span>
                              </label>
                            </div>
                          );
                        })}
                  </div>
                </div>
              </div>
            </div>

            <div className="test-instruction-and-candidate-settings-container">
              <div style={{ width: "60%" }} className="test-instruction">
                <div className="test-instructions-title">
                  <span>Test Instructions</span>
                  <svg
                    onClick={() => {
                      test.status !== "draft" && isInviteData.length
                        ? toast(
                            "Test is in published mode and you have invited candidate"
                          )
                        : seteditInstruction(true);
                    }}
                    style={{ cursor: "pointer" }}
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="11" fill="#00C49A" />
                    <path
                      d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z"
                      fill="#00C49A"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="instructions-content">
                  {test?.instruction?.length === 0 ? (
                    <span>No instruction for this test.</span>
                  ) : (
                    test?.instruction?.map((data, index) => {
                      return (
                        <span key={index}>
                          {" "}
                          {index + 1}. {data.instruction || "NA"}{" "}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ width: "40%" }} className="test-instruction">
                <div className="test-instructions-title">
                  <span>Candidate Settings</span>
                  <svg
                    onClick={() => {
                      test.status !== "draft" && isInviteData.length
                        ? toast(
                            "Test is in published mode and you have invited candidate"
                          )
                        : seteditTestCandidateDetails(true);
                    }}
                    style={{ cursor: "pointer" }}
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="11" cy="11" r="11" fill="#00C49A" />
                    <path
                      d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z"
                      fill="#00C49A"
                      stroke="white"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </div>
                <div className="instructions-content">
                  {test?.candiateSettings?.length === 0 ? (
                    <span>No candidate settings for this test.</span>
                  ) : (
                    test?.candiateSettings?.map((data, index) => {
                      return (
                        <span key={index}>
                          {" "}
                          {index + 1}. {data || "NA"}{" "}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            <div className="assessment-admin">
              <div className="admin-title">
                <span>Test Admins</span>

                <p
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setassessmentAdmin(true);
                  }}
                >
                  + Add Admin
                </p>
              </div>

              <div className="admin-table">
                <table className="admin" cellSpacing={0}>
                  <tr>
                    <th>Name</th>
                    <th>Email ID</th>
                    <th>Access</th>
                    <th>Delete</th>
                  </tr>

                  {test?.testAdmins?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{data?.admin?.fullName}</td>
                        <td>{data?.admin?.email}</td>
                        <td>{data?.access}</td>
                        <td>
                          <svg
                            style={{ cursor: "pointer" }}
                            onMouseOver={() => {
                              setred2({
                                status: true,
                                index: index,
                              });
                            }}
                            onMouseOut={() => {
                              setred2({
                                status: false,
                                index: index,
                              });
                            }}
                            onClick={() => {
                              setDeleteSkillSetModel(true);
                              setAdminToDelete(data.admin._id);
                            }}
                            className="dlt"
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              className="dlt"
                              d="M2.01562 4H3.34896H14.0156"
                              stroke={
                                red2.status && red2.index === index
                                  ? "#FF6812"
                                  : "#999999"
                              }
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              className="dlt"
                              d="M12.6849 3.99967V13.333C12.6849 13.6866 12.5444 14.0258 12.2944 14.2758C12.0443 14.5259 11.7052 14.6663 11.3516 14.6663H4.6849C4.33127 14.6663 3.99214 14.5259 3.74209 14.2758C3.49204 14.0258 3.35156 13.6866 3.35156 13.333V3.99967M5.35156 3.99967V2.66634C5.35156 2.31272 5.49204 1.97358 5.74209 1.72353C5.99214 1.47348 6.33127 1.33301 6.6849 1.33301H9.35156C9.70518 1.33301 10.0443 1.47348 10.2944 1.72353C10.5444 1.97358 10.6849 2.31272 10.6849 2.66634V3.99967"
                              stroke={
                                red2.status && red2.index === index
                                  ? "#FF6812"
                                  : "#999999"
                              }
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              className="dlt"
                              d="M6.67969 7.33301V11.333"
                              stroke={
                                red2.status && red2.index === index
                                  ? "#FF6812"
                                  : "#999999"
                              }
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              className="dlt"
                              d="M9.35156 7.33301V11.333"
                              stroke={
                                red2.status && red2.index === index
                                  ? "#FF6812"
                                  : "#999999"
                              }
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </td>
                      </tr>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentOverview;
