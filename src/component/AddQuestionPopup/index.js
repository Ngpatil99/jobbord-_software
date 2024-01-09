import React, { useState } from "react";
import "./index.css";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import jwtDecode from "jwt-decode";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import katex from "katex";
import "katex/dist/katex.min.css";
import { useNavigate } from "react-router-dom";
import NotSavePopUp from "../NotSavePopup";
const CancelToken = axios.CancelToken;
let cancel;

const AddQuestionPopup = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [answerObj, setanswerObj] = useState([
    {
      optionId: uuidv4(),
      option: "",
      html: "",
      images: [],
    },
    {
      optionId: uuidv4(),
      option: "",
      html: "",
      images: [],
    },
  ]);
  const [correctObj, setcorrectObj] = useState([]);
  const [score, setscore] = useState("");
  const [correctAnswerType, setcorrectAnswerType] = useState("");
  const [checked, setchecked] = useState(false);
  const [refresh, setrefresh] = useState({});
  const [difficulty, setDifficulty] = useState("");
  const [skills, setskills] = useState([]);
  const [topics, settopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [skillSearchText, setskillSearchText] = useState("");
  const [searchSkillData, setsearchSkillData] = useState([]);
  const [topicSearchText, settopicSearchText] = useState("");
  const [searchTopicData, setsearchTopicData] = useState([]);
  const [richText, setRichText] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [draftLoading, setDraftLoading] = useState(false);
  const [focusedEditor, setFocusedEditor] = useState({
    isFocused: false,
    no: null,
  });
  const [questionEditorFocused, setQuestionEditorFocused] = useState(false);

  const [editorContent, setEditorContent] = useState("");
  const [notSave, setNotSave] = useState(false);

  const handleChange = (content) => {
    setEditorContent(content);
  };

  const handleEditorFocus = () => {
    setQuestionEditorFocused(true);
  };

  const handleEditorBlur = () => {
    setQuestionEditorFocused(false);
  };

  const handleAnsEditorFocus = (index) => {
    setFocusedEditor({
      isFocused: true,
      no: index,
    });
  };

  const handleAnsEditorBlur = () => {
    setFocusedEditor({
      isFocused: false,
      no: null,
    });
  };

  // const countWords = () => {
  //     const words = questionTitle.trim().split(/\s+/);
  //     const filteredWords = words.filter(word => word !== '');
  //     return filteredWords.length;
  // };

  const validation = (status) => {
    const regex = /^\s*$/;
    if (status === "draft") {
      if (questionTitle === "" || regex.test(questionTitle)) {
        toast.error("Enter question title to save draft.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }
    } else {
      if (questionTitle === "" || regex.test(questionTitle)) {
        toast.error("Enter question title.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }
      if (score === "") {
        toast.error("Enter question score.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }
      if (Number(score) > 20) {
        toast.error("Score cannot be greater then 20.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }
      if (isPositiveNumber(score) === false) {
        toast.error("Score cannot be negative and decimal.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }

      if (
        extractPlainText(editorContent) === "" ||
        regex.test(extractPlainText(editorContent))
      ) {
        toast.error("Enter question.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }

      if (correctObj.length === 0) {
        toast.error("Atleast one correct answer should be selected.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }

      if (difficulty === "") {
        toast.error("Difficulty level is mandatory.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }

      if (skills.length === 0) {
        toast.error("Atleast one skill is mandatory.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }

      if (selectedTopics.length === 0) {
        toast.error("Atleast one topic is mandatory.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }

      const answerChecker = answerObj.filter((data) =>
        /^\s*$/.test(data.option)
      );
      const checkImage = answerObj.filter((data) => /\S/.test(data.html));

      if (answerChecker.length !== 0 || checkImage.length === 0) {
        toast.error("Answers cannot be empty or contain only spaces.");
        setLoading(false);
        setDraftLoading(false);
        return false;
      }
    }
    return true;
  };

  const saveQuestion = async (status) => {
    try {
      if (status === "draft") {
        setDraftLoading(true);
      } else {
        setLoading(true);
      }

      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      let tempArray = [];
      skills.forEach((element) => {
        const obj = {
          skills: "",
          topicId: [],
        };
        obj.skills = element.skills._id;
        element.topicId.forEach((topicId) => {
          obj.topicId.push(topicId._id);
        });
        tempArray.push(obj);
      });

      const topicsData = [];
      selectedTopics?.map((element) => {
        topics.find((data) => {
          if (data._id === element) {
            topicsData.push(data);
          }
        });
      });

      if (validation(status)) {
        let questionObj = {
          Section_header: questionTitle,
          approved: `Approved By ${decode.fullName}`,
          type: "MCQ",
          difficultyLevelId: difficulty === "" ? null : difficulty,
          topicId: topicsData,
          skillsId: tempArray,
          score: score,
          status: status,
          createdBy: decode.user_id,
          clientId: decode.client._id,
          answersObjectArray: answerObj,
          correctAnswerObjectArray: correctObj,
          correctAnswerType: checked ? "Yes" : "No",
          question: extractPlainText(editorContent),
          images: [],
          html: editorContent,
          noOfTimesUsed: 100,
          isEditorEnable: richText,
        };

        const res = await axios.post(
          `${backend_url}question/createQuestion`,
          questionObj,
          { headers: { token: token } }
        );
        toast.success("Question created successfully.");

        if (props.from === "dashboard") {
          navigate("/library");
        }

        if (status === "draft") {
          props.saveDraftClick();
        } else {
          props.saveQuestionClick(res.data);
        }

        console.log(questionObj);

        setQuestionTitle("");
        setDifficulty("");
        setskills([]);
        settopics([]);
        setSelectedTopics([]);
        setscore("");
        setcorrectAnswerType("");
        setcorrectObj([]);
        setanswerObj([
          {
            optionId: uuidv4(),
            option: "",
            html: "",
            images: [],
          },
          {
            optionId: uuidv4(),
            option: "",
            html: "",
            images: [],
          },
        ]);
        setEditorContent("");
        if (status === "draft") {
          setDraftLoading(false);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      if (status === "draft") {
        setDraftLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  const onChangeToggle = () => {
    setchecked(!checked);
    if (checked && correctObj.length > 1) {
      setcorrectObj([correctObj[0]]);
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

  function onVideoUploadBefore(files, info, uploadHandler) {
    const handleVideoUpload = async () => {
      try {
        const videoURL = await uploadImageToS3(files);

        const response = {
          result: [
            {
              url: videoURL,
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

    handleVideoUpload();
  }

  const removeAnwserObject = (optionId) => {
    if (answerObj.length === 2) {
      return toast.error("At least two options are mandatory.");
    }
    const newAnwserObject = answerObj.filter(
      (data) => data.optionId !== optionId
    );
    const newCorrectAnsObject = correctObj.filter((data) => data !== optionId);
    setanswerObj(newAnwserObject);
    setcorrectObj(newCorrectAnsObject);
  };

  const addNewOption = () => {
    const optionId = uuidv4();
    if (answerObj.length < 6) {
      setanswerObj((prev) => [
        ...prev,
        answerObj.includes(`option ${answerObj.length + 1}`)
          ? { optionId: optionId, option: "", html: "", images: [] }
          : { option: "", optionId: optionId, html: "", images: [] },
      ]);
    } else {
      toast.error("only 6 solution are allowed");
    }
  };

  const changeCorrectAnswer = async (optionid) => {
    if (checked) {
      const checker = correctObj.includes(optionid);

      const data = checker
        ? correctObj.filter((i) => i !== optionid)
        : [...correctObj, optionid];

      setcorrectObj(data);
    } else {
      if (correctObj.includes(optionid)) {
        setcorrectObj([]); // Deselect the option if already selected
      } else {
        if (correctObj.length === 0) {
          setcorrectObj([...correctObj, optionid]); // Set only the selected option as correct answer
        } else {
          toast.error(
            "Please tick multiple option checkbox to select multiple."
          );
        }
      }
    }
    setrefresh({});
  };

  const onType = async (e) => {
    const search = e.target.value;
    setskillSearchText(e.target.value);

    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${search.toLowerCase()}`,
        {
          headers: { token: token },
          cancelToken: new CancelToken(function executor(c) {
            // An executor function is executed when the cancelToken is created
            cancel = c;
          }),
        }
      );
      setsearchSkillData(res.data.data);
      cancel("Canceling request");
    } catch (error) {
      console.log(error);
    }
  };

  const onTopicType = async (e) => {
    try {
      const search = e.target.value;
      settopicSearchText(e.target.value);
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}topic/search?page=1&limit=5&searchText=${search.toLowerCase()}`,
        { headers: { token: token } }
      );
      setsearchTopicData(res.data.data);
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const searchSkill = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText.toLowerCase()}`,
        {
          headers: { token: token },
          cancelToken: new CancelToken(function executor(c) {
            // An executor function is executed when the cancelToken is created
            cancel = c;
          }),
        }
      );
      setsearchSkillData(res.data.data);
      cancel("Canceling request");
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const searchTopic = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}topic/search?page=1&limit=5&searchText=${topicSearchText.toLowerCase()}`,
        { headers: { token: token } }
      );
      setsearchTopicData(res.data.data);
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const addSearchedSkill = (skillName) => {
    let skillArray = skills?.map(function (item) {
      return item?.skills.skills;
    });
    if (!skillArray.includes(skillName.skills)) {
      const obj = {
        skills: {},
        topicId: [],
      };
      obj.skills = skillName;
      skillName.topics?.forEach((topicId) => {
        if (topicId?.topicId !== null) {
          settopics((prev) => [...prev, topicId?.topicId]);
          obj.topicId.push(topicId?.topicId);
        }
      });
      setskills((prev) => [...prev, obj]);
      searchSkillData.length = 0;
    } else {
      toast("You have added already that skill", {
        className: "toast-message",
      });
    }
  };

  const addSearchedTopics = (topicName) => {
    console.log(topicName);
    let topicsArray = topics?.map(function (item) {
      return item.topic;
    });

    if (!topicsArray.includes(topicName.topic)) {
      settopics((prev) => [...prev, topicName]);
      setSelectedTopics([...selectedTopics, topicName._id]);
      searchTopicData.length = 0;
    } else {
      toast("You have added already that topic", {
        className: "toast-message",
      });
    }
  };

  const removeSkill = (skillId) => {
    const skill = skills.filter((element) => element.skills._id === skillId);
    const filterSkillData = skills.filter(
      (element) => element.skills._id !== skillId
    );
    setskills(filterSkillData);
    const skillTopicIds = [];
    skill.forEach((data) => {
      data.topicId.forEach((topic) => {
        skillTopicIds.push(topic._id);
      });
    });

    const filteredTopics = topics.map((data) => {
      if (!skillTopicIds.includes(data._id)) {
        return data;
      }
    });

    const filteredArray = filteredTopics.filter((item) => item !== undefined);
    settopics(filteredArray);

    setSelectedTopics(
      selectedTopics.map((data) => !skillTopicIds.includes(data._id))
    );
  };

  const toggleTopic = (topic) => {
    if (selectedTopics.includes(topic._id)) {
      setSelectedTopics(selectedTopics.filter((item) => item !== topic._id));
      // Remove and add topic from skills
      let topicExists = false;
      skills.forEach((data, index1) => {
        data.topicId.forEach((topicId, index2) => {
          if (topicId._id === topic._id) {
            skills[index1].topicId.splice(index2, 1);
            if (data.topicId.length === 0) {
              skills.splice(index1, 1);
            }
          }
        });
        if (data._id === topic._id) {
          data.topicId.forEach((topicId) => {
            if (topicId._id === topic._id) {
              topicExists = true;
            }
          });
          if (!topicExists) {
            data.topicId.push(topic);
          }
        }
      });
    } else {
      setSelectedTopics([...selectedTopics, topic._id]);
    }
  };

  const removeTopic = (topicId) => {
    skills.forEach((data, index1) => {
      data.topicId.forEach((topic, index2) => {
        if (topic._id === topicId) {
          skills[index1].topicId.splice(index2, 1);
          if (data.topicId.length === 0) {
            skills.splice(index1, 1);
          }
        }
      });
    });
    const filteredArray = topics.filter((item) => item._id !== topicId);
    settopics(filteredArray);
    // toast("Topic is removed...");
  };

  const isPositiveNumber = (num) => {
    // Convert the input to a number
    const parsedNum = Number(num);

    return parsedNum >= /^[0-9]+$/.test(num);
  };

  const handleRichText = () => {
    setRichText(!richText);
  };

  const modifyAnswerObject = (index, option, html, images) => {
    setanswerObj((prevState) => {
      const updatedArray = [...prevState];

      updatedArray[index] = {
        ...updatedArray[index],
        option: option,
        html: html,
        images: images,
      };
      return updatedArray;
    });
  };

  const extractPlainText = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  const handleAnswerOnChange = (index, content) => {
    if (index === 0) {
      modifyAnswerObject(index, extractPlainText(content), content, []);
    } else if (index === 1) {
      modifyAnswerObject(index, extractPlainText(content), content, []);
    } else if (index === 2) {
      modifyAnswerObject(index, extractPlainText(content), content, []);
    } else if (index === 3) {
      modifyAnswerObject(index, extractPlainText(content), content, []);
    } else if (index === 4) {
      modifyAnswerObject(index, extractPlainText(content), content, []);
    } else if (index === 5) {
      modifyAnswerObject(index, extractPlainText(content), content, []);
    }
  };

  function onAnsImageUploadBefore(index, files, info, uploadHandler) {
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

  function onAnsVideoUploadBefore(index, files, info, uploadHandler) {
    const handleVideoUpload = async () => {
      try {
        const videoURL = await uploadImageToS3(files);

        const response = {
          result: [
            {
              url: videoURL,
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

    handleVideoUpload();
  }

  const exceptThisSymbols = ["e", "E", "+", "-", "."];

  const handleQuestionSave = (value) => {
    if (value === "complete") {
      if (loading === false) {
        saveQuestion("complete");
      }
    } else {
      if (draftLoading === false) {
        saveQuestion("draft");
      }
    }
  };

  const handleQuestionModel = () => {
    //Check the all questions fields is empty or not if not then show the popup
    if (
      questionTitle !== "" ||
      score !== "" ||
      editorContent !== "" ||
      correctObj.length !== 0 ||
      skills.length !== 0 ||
      topics.length !== 0
    ) {
      setNotSave(true);
    } else {
      props.closequestionPopUp();
      props.closeQuestionTypeModel();
    }
  };

  const closeNotSavePopUp = () => {
    setNotSave(false);
    props.closequestionPopUp();
    props.closeQuestionTypeModel();
  };

  return (
    <div className="add-question-parent-model-container">
      {notSave ? (
        <NotSavePopUp saveQuestion={saveQuestion} close={closeNotSavePopUp} />
      ) : null}
      <svg
        className="cancel-icon"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        onClick={() => {
          handleQuestionModel();
        }}
      >
        <circle cx="20" cy="20" r="20" fill="white" />
        <rect
          width="17.7778"
          height="17.7778"
          transform="translate(6.6875 20.7412) rotate(-45)"
          fill="white"
        />
        <path
          d="M15.5918 17.0752L22.9248 24.4082"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.5918 24.4072L22.9248 17.0743"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div className="add-question-model-container">
        <div className="header-and-button-container">
          <div className="header-container">
            {/*Edit question icon */}
            <svg
              width="35"
              height="35"
              viewBox="0 0 35 35"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="17.5"
                cy="17.5"
                r="17.5"
                fill="#00C49A"
                fill-opacity="0.1"
              />
              <g clip-path="url(#clip0_4024_3667)">
                <path
                  d="M24.3898 12.2744H11.3458C11.0987 12.2744 10.8617 12.3726 10.687 12.5473C10.5122 12.722 10.4141 12.959 10.4141 13.2061V22.5233C10.4141 22.7704 10.5122 23.0073 10.687 23.1821C10.8617 23.3568 11.0987 23.455 11.3458 23.455H24.3898C24.6369 23.455 24.8738 23.3568 25.0486 23.1821C25.2233 23.0073 25.3215 22.7704 25.3215 22.5233V13.2061C25.3215 12.959 25.2233 12.722 25.0486 12.5473C24.8738 12.3726 24.6369 12.2744 24.3898 12.2744ZM24.3898 22.5233H11.3458V13.2061H24.3898V22.5233Z"
                  fill="#00C49A"
                />
                <path
                  d="M13.6729 16.001H22.0583C22.1819 16.001 22.3004 15.952 22.3877 15.8646C22.4751 15.7772 22.5242 15.6587 22.5242 15.5352C22.5242 15.4116 22.4751 15.2931 22.3877 15.2058C22.3004 15.1184 22.1819 15.0693 22.0583 15.0693H13.6729C13.5493 15.0693 13.4308 15.1184 13.3435 15.2058C13.2561 15.2931 13.207 15.4116 13.207 15.5352C13.207 15.6587 13.2561 15.7772 13.3435 15.8646C13.4308 15.952 13.5493 16.001 13.6729 16.001Z"
                  fill="#00C49A"
                />
                <path
                  d="M13.6729 17.8653H22.0583C22.1819 17.8653 22.3004 17.8162 22.3877 17.7289C22.4751 17.6415 22.5242 17.523 22.5242 17.3995C22.5242 17.2759 22.4751 17.1574 22.3877 17.07C22.3004 16.9827 22.1819 16.9336 22.0583 16.9336H13.6729C13.5493 16.9336 13.4308 16.9827 13.3435 17.07C13.2561 17.1574 13.207 17.2759 13.207 17.3995C13.207 17.523 13.2561 17.6415 13.3435 17.7289C13.4308 17.8162 13.5493 17.8653 13.6729 17.8653Z"
                  fill="#00C49A"
                />
                <path
                  d="M13.6729 19.7286H18.3315C18.455 19.7286 18.5735 19.6795 18.6609 19.5921C18.7482 19.5048 18.7973 19.3863 18.7973 19.2627C18.7973 19.1392 18.7482 19.0207 18.6609 18.9333C18.5735 18.846 18.455 18.7969 18.3315 18.7969H13.6729C13.5493 18.7969 13.4308 18.846 13.3435 18.9333C13.2561 19.0207 13.207 19.1392 13.207 19.2627C13.207 19.3863 13.2561 19.5048 13.3435 19.5921C13.4308 19.6795 13.5493 19.7286 13.6729 19.7286Z"
                  fill="#00C49A"
                />
              </g>
              <defs>
                <clipPath id="clip0_4024_3667">
                  <rect
                    width="16.7708"
                    height="16.7708"
                    fill="white"
                    transform="translate(9.48047 9.47949)"
                  />
                </clipPath>
              </defs>
            </svg>
            <label>Create New Question</label>
          </div>

          <div className="button-container">
            <button
              style={{ background: "#999999" }}
              className="draft-btn"
              onClick={() => {
                handleQuestionSave("draft");
              }}
            >
              {draftLoading ? (
                <div className="loader"></div>
              ) : (
                <>
                  {/*draft icon */}
                  <svg
                    width="17"
                    height="16"
                    viewBox="0 0 17 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <ellipse
                      cx="8.44444"
                      cy="8"
                      rx="8.44444"
                      ry="8"
                      fill="#DDDDDD"
                    />
                    <path
                      d="M12.2227 12H5.22266C4.95744 12 4.70309 11.8946 4.51555 11.7071C4.32801 11.5196 4.22266 11.2652 4.22266 11V4C4.22266 3.73478 4.32801 3.48043 4.51555 3.29289C4.70309 3.10536 4.95744 3 5.22266 3H10.7227L13.2227 5.5V11C13.2227 11.2652 13.1173 11.5196 12.9298 11.7071C12.7422 11.8946 12.4879 12 12.2227 12Z"
                      stroke="#999999"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M11.2227 12V8H6.22266V12"
                      stroke="#999999"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.22266 3V5.5H10.2227"
                      stroke="#999999"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <label>Save As Draft</label>
                </>
              )}
            </button>

            <button
              style={{ background: "#00C49A" }}
              onClick={() => {
                handleQuestionSave("complete");
              }}
            >
              {loading ? (
                <div className="loader"></div>
              ) : (
                <>
                  {/*save icon */}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8" r="8" fill="white" />
                    <path
                      d="M11.5859 5.22363L6.08594 10.7236L3.58594 8.22363"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <label>Save</label>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="question-container">
          <div className="left-container">
            <div className="add-question-title-container">
              <label>
                Question Title{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              </label>
              <input
                placeholder="Your question title"
                onChange={(e) => {
                  setQuestionTitle(e.target.value);
                }}
                value={questionTitle}
                onFocus={() => {
                  setFocusedEditor({
                    isFocused: false,
                    no: null,
                  });
                }}
              />
              {/* <label style={{
                                color: "red",
                                fontSize: "12px"
                            }}>{countWords() > 8 ? "Question title should not exceed 8 word." : null}</label> */}
            </div>

            <div className="add-problem-solution-input-container">
              <div className="add-problem-input-container">
                <label>
                  Problem{" "}
                  <span
                    style={{
                      color: "red",
                    }}
                  >
                    *
                  </span>
                </label>
                <div
                  style={
                    questionEditorFocused
                      ? { border: "1px solid #000000" }
                      : { border: "1px solid #DDDDDD" }
                  }
                >
                  <SunEditor
                    setContents={editorContent}
                    onChange={handleChange}
                    onImageUploadBefore={onImageUploadBefore}
                    onVideoUploadBefore={onVideoUploadBefore}
                    height="auto"
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
                          "math",
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
                          "preview",
                        ],
                      ],
                      iframe: false,
                      tagsBlacklist:
                        "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                      pasteTagsBlacklist:
                        "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                      pasteTagsWhitelist: "p",
                      videoFileInput: true,
                      katex: katex,
                      tabDisable: true,
                    }}
                    onFocus={handleEditorFocus}
                    onBlur={handleEditorBlur}
                  />
                </div>
              </div>

              <div className="add-solution-answer-input-container">
                <div className="header">
                  <label
                    style={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    Solution{" "}
                    <span
                      style={{
                        color: "red",
                        marginLeft: "5px",
                        fontSize: "15px",
                      }}
                    >
                      *
                    </span>
                  </label>
                  <span
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {richText ? (
                        <svg
                          onClick={() => {
                            handleRichText();
                          }}
                          width="18"
                          height="18"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.466797"
                            width="20"
                            height="20"
                            rx="2"
                            fill="#00C49A"
                          />
                          <path
                            d="M14 8.4668L8.5 13.9668L6 11.4668"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          onClick={() => {
                            handleRichText();
                          }}
                          width="18"
                          height="18"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.466797"
                            width="20"
                            height="20"
                            rx="2"
                            fill="#dddddd"
                          />
                        </svg>
                      )}
                    </div>
                    <span>Rich Text</span>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {checked ? (
                        <svg
                          onClick={(e) => {
                            onChangeToggle(e);
                          }}
                          width="18"
                          height="18"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.466797"
                            width="20"
                            height="20"
                            rx="2"
                            fill="#00C49A"
                          />
                          <path
                            d="M14 8.4668L8.5 13.9668L6 11.4668"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg
                          onClick={onChangeToggle}
                          width="18"
                          height="18"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            y="0.466797"
                            width="20"
                            height="20"
                            rx="2"
                            fill="#dddddd"
                          />
                        </svg>
                      )}
                    </div>
                    <span>Allow Multiple Answers</span>
                  </span>
                </div>
                <div className="answers-container">
                  {answerObj.map((data, index) => {
                    return (
                      <div
                        className="answer-box"
                        tabIndex={index + 1}
                        style={
                          index === focusedEditor.no && focusedEditor.isFocused
                            ? { border: "1px solid #000000" }
                            : null
                        }
                      >
                        <div className="check-box">
                          {correctObj.includes(
                            correctAnswerType === "Yes"
                              ? `${data.optionId}`
                              : data.optionId
                          ) ? (
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                changeCorrectAnswer(data.optionId);
                              }}
                              width="18"
                              height="18"
                              viewBox="0 0 20 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.466797"
                                width="20"
                                height="20"
                                rx="2"
                                fill="#00C49A"
                              />
                              <path
                                d="M14 8.4668L8.5 13.9668L6 11.4668"
                                stroke="white"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              onClick={(e) => {
                                e.stopPropagation();
                                changeCorrectAnswer(data.optionId);
                              }}
                              width="18"
                              height="18"
                              viewBox="0 0 20 21"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <rect
                                y="0.466797"
                                width="20"
                                height="20"
                                rx="2"
                                fill="#dddddd"
                              />
                            </svg>
                          )}
                        </div>
                        <div className="editor">
                          <SunEditor
                            height="auto"
                            width="auto"
                            hideToolbar={!richText}
                            setContents={answerObj[index].html}
                            onChange={(content) => {
                              handleAnswerOnChange(index, content);
                            }}
                            onImageUploadBefore={(
                              files,
                              info,
                              uploadHandler
                            ) => {
                              onAnsImageUploadBefore(
                                index,
                                files,
                                info,
                                uploadHandler
                              );
                            }}
                            onVideoUploadBefore={(
                              files,
                              info,
                              uploadHandler
                            ) => {
                              onAnsVideoUploadBefore(
                                index,
                                files,
                                info,
                                uploadHandler
                              );
                            }}
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
                                  "math",
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
                                  "preview",
                                ],
                              ],
                              iframe: false,
                              tabDisable: true,
                              tagsBlacklist:
                                "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                              pasteTagsBlacklist:
                                "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                              pasteTagsWhitelist: "p",
                              resizingBar: false,
                              videoFileInput: true,
                              katex: katex,
                            }}
                            onFocus={() => {
                              handleAnsEditorFocus(index);
                            }}
                            onBlur={() => {
                              handleAnsEditorBlur(index);
                            }}
                          />
                        </div>
                        <div id="solution-cross">
                          <svg
                            width="15"
                            height="16"
                            viewBox="0 0 15 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            onClick={() => removeAnwserObject(data.optionId)}
                          >
                            <circle cx="7.5" cy="8" r="7.5" fill="#DDDDDD" />
                            <path
                              d="M9.75 5.75L5.25 10.25"
                              stroke="#999999"
                              stroke-linecap="round"
                            />
                            <path
                              d="M9.75 10.25L5.25014 5.75014"
                              stroke="#999999"
                              stroke-linecap="round"
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}

                  <span
                    onClick={() => addNewOption()}
                    className="add-more-option-btn"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{
                        marginRight: "10px",
                      }}
                    >
                      <path
                        d="M8 3.33301V12.6663"
                        stroke="gray"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3.33398 8H12.6673"
                        stroke="gray"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Add another option</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="right-container">
            <div className="add-question-score-container">
              <label>
                Score{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              </label>
              <input
                placeholder="Score"
                onChange={(e) => {
                  setscore(e.target.value);
                }}
                value={score}
                type="number"
                onKeyDown={(e) =>
                  exceptThisSymbols.includes(e.key) && e.preventDefault()
                }
              />
              {score !== "" && isPositiveNumber(score) === false ? (
                <label
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  {" "}
                  Only enter positive numbers
                </label>
              ) : score > 20 ? (
                <label
                  style={{
                    color: "red",
                    fontSize: "12px",
                  }}
                >
                  Score cannot be greater then 20
                </label>
              ) : null}
            </div>
            <div className="difficulty-level-container">
              <label>
                Difficulty{" "}
                <span
                  style={{
                    color: "red",
                  }}
                >
                  *
                </span>
              </label>
              <button
                onClick={() => {
                  setDifficulty("641bd41c8782fdd946db740b");
                }}
                className={
                  difficulty === "641bd41c8782fdd946db740b"
                    ? "active-level-btn"
                    : null
                }
                style={
                  difficulty === "641bd41c8782fdd946db740b"
                    ? { border: "1px solid #00C49A" }
                    : null
                }
              >
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
                    r="9"
                    fill={
                      difficulty === "641bd41c8782fdd946db740b"
                        ? "#00C49A"
                        : "#999999"
                    }
                  />
                  <path
                    d="M13 7L7.5 12.5L5 10"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Easy
              </button>
              <button
                onClick={() => {
                  setDifficulty("641bf53ce012709b89e6c2cc");
                }}
                className={
                  difficulty === "641bf53ce012709b89e6c2cc"
                    ? "active-level-btn"
                    : null
                }
                style={
                  difficulty === "641bf53ce012709b89e6c2cc"
                    ? { border: "1px solid #FF9736" }
                    : null
                }
              >
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
                    r="9"
                    fill={
                      difficulty === "641bf53ce012709b89e6c2cc"
                        ? "#FF9736"
                        : "#999999"
                    }
                  />
                  <path
                    d="M13 7L7.5 12.5L5 10"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Medium
              </button>
              <button
                onClick={() => {
                  setDifficulty("641bf5c1e012709b89e6c2d2");
                }}
                className={
                  difficulty === "641bf5c1e012709b89e6c2d2"
                    ? "active-level-btn"
                    : null
                }
                style={
                  difficulty === "641bf5c1e012709b89e6c2d2"
                    ? { border: "1px solid #FF5D00" }
                    : null
                }
              >
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
                    r="9"
                    fill={
                      difficulty === "641bf5c1e012709b89e6c2d2"
                        ? "#FF5D00"
                        : "#999999"
                    }
                  />
                  <path
                    d="M13 7L7.5 12.5L5 10"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                Hard
              </button>
            </div>
            <div className="add-skill-topics-container">
              <div
                style={{ position: "relative" }}
                className="add-skill-container"
              >
                <label>Skills</label>
                <div
                  className="add-search-skill-container"
                  onClick={() => searchSkill()}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_4024_4072)">
                      <path
                        d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z"
                        stroke="#363534"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.125 13.125L10.4062 10.4062"
                        stroke="#363534"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4024_4072">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchSkill();
                      }
                    }}
                    value={skillSearchText}
                    onChange={onType}
                    placeholder="Search skill here..."
                    onFocus={() => {
                      setFocusedEditor({
                        isFocused: false,
                        no: null,
                      });
                    }}
                  />
                  {skillSearchText !== "" ? (
                    <svg
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: 10,
                      }}
                      onClick={() => {
                        setskillSearchText("");
                        searchSkillData.length = 0;
                      }}
                      width="10"
                      height="10"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z"
                        fill="#99B2C6"
                      />
                    </svg>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="add-skill-list-item-container">
                  {skills?.map((data) => {
                    // let skillArray = skills?.map(function (item) { return item?.skills });

                    return (
                      <div className="add-skill-list-item" id="add-skill">
                        <p>{data?.skills.skills}</p>
                        {/**cancel icon */}

                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          id="tick-skill"
                        >
                          <circle cx="9" cy="9" r="9" fill="#00C49A" />
                          <path
                            d="M13 7L7.5 12.5L5 10"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        <svg
                          onClick={() => removeSkill(data.skills._id)}
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          id="cross-skill"
                        >
                          <circle cx="7.5" cy="7.5" r="7.5" fill="red" />
                          <path
                            d="M9.75 5.25L5.25 9.75"
                            stroke="white"
                            stroke-linecap="round"
                          />
                          <path
                            d="M9.75 9.75L5.25014 5.25014"
                            stroke="white"
                            stroke-linecap="round"
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>
                {skillSearchText !== "" && searchSkillData?.length ? (
                  <div
                    onClick={() => (searchSkillData.length = 0)}
                    className="search-result-container"
                  >
                    <svg
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: 10,
                      }}
                      onClick={() => {
                        setsearchSkillData([]);
                      }}
                      width="10"
                      height="10"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z"
                        fill="#99B2C6"
                      />
                    </svg>
                    {searchSkillData?.map((data) => {
                      return (
                        <div
                          style={{ marginTop: 5 }}
                          className="skill-item"
                          onClick={() => addSearchedSkill(data)}
                        >
                          <span> {data?.skills}</span>
                          <svg
                            width="10"
                            height="9"
                            viewBox="0 0 10 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z"
                              fill="#FF6812"
                            />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div
                style={{ position: "relative" }}
                className="add-topics-container"
              >
                <label>Topic</label>
                <div className="add-search-topics-container">
                  <svg
                    onClick={searchTopic}
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_4024_4072)">
                      <path
                        d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z"
                        stroke="#363534"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.125 13.125L10.4062 10.4062"
                        stroke="#363534"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_4024_4072">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <input
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchTopic();
                      }
                    }}
                    value={topicSearchText}
                    onChange={onTopicType}
                    placeholder="Search topic here..."
                    onFocus={() => {
                      setFocusedEditor({
                        isFocused: false,
                        no: null,
                      });
                    }}
                  />
                  {topicSearchText !== "" ? (
                    <svg
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: 10,
                      }}
                      onClick={() => {
                        settopicSearchText("");
                        searchTopicData.length = 0;
                      }}
                      width="10"
                      height="10"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z"
                        fill="#99B2C6"
                      />
                    </svg>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="add-topics-list-item-container">
                  {topics?.map((data) => {
                    // let topicsArray = topics?.map(function (item) { return item?.topic });
                    return (
                      <div
                        onClick={() => toggleTopic(data)}
                        className="add-topics-list-item"
                        style={
                          selectedTopics.includes(data._id)
                            ? { border: "1px solid #00C49A" }
                            : { border: "1px solid #b1b3b5" }
                        }
                        id="add-topic"
                      >
                        <p>{data?.topic}</p>

                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          id="tick-topic"
                        >
                          <circle
                            cx="9"
                            cy="9"
                            r="9"
                            fill={
                              selectedTopics?.includes(data._id)
                                ? "#00C49A"
                                : "#b1b3b5"
                            }
                          />
                          <path
                            d="M13 7L7.5 12.5L5 10"
                            stroke="white"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>

                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          id="cross-topic"
                        >
                          {selectedTopics.includes(data._id) ? (
                            <>
                              <circle cx="7.5" cy="7.5" r="7.5" fill="red" />
                              <path
                                d="M9.75 5.25L5.25 9.75"
                                stroke="white"
                                stroke-linecap="round"
                              />
                              <path
                                d="M9.75 9.75L5.25014 5.25014"
                                stroke="white"
                                stroke-linecap="round"
                              />
                            </>
                          ) : (
                            <>
                              <circle
                                cx="7.5"
                                cy="7.5"
                                r="7.5"
                                fill="#00C49A"
                              />

                              <path
                                d="M7.5 4.5V10.5"
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M4.5 7.5H10.5"
                                stroke="white"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </>
                          )}
                        </svg>
                      </div>
                    );
                  })}
                </div>
                {topicSearchText !== "" && searchTopicData?.length ? (
                  <div
                    className="search-result-container"
                    style={{
                      marginTop: "40px",
                    }}
                  >
                    <svg
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        right: 10,
                      }}
                      onClick={() => {
                        setsearchTopicData([]);
                      }}
                      width="10"
                      height="10"
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z"
                        fill="#99B2C6"
                      />
                    </svg>

                    {searchTopicData?.map((data) => {
                      return (
                        <div style={{ marginTop: 5 }} className="skill-item">
                          <span> {data?.topic}</span>
                          <svg
                            onClick={() => addSearchedTopics(data)}
                            style={{ cursor: "pointer" }}
                            width="10"
                            height="9"
                            viewBox="0 0 10 9"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fill-rule="evenodd"
                              clip-rule="evenodd"
                              d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z"
                              fill="#FF6812"
                            />
                          </svg>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionPopup;
