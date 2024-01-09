import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  getDefaultKeyBinding,
} from "draft-js";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import "./index.css";
import "../../screen/BulkImported/draft.css";
import "../../screen/BulkImported/example.css";
import "../../screen/BulkImported/rich-editor.css";
const CancelToken = axios.CancelToken;
let cancel;

const EditQuestionModel = (props) => {
  const editor = useRef(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [sectionHeader, setsectionHeader] = useState("");
  const [difficultyLevel, setdifficultyLevel] = useState("");
  const [answerObj, setanswerObj] = useState([]);
  const [correctObj, setcorrectObj] = useState([]);
  const [score, setscore] = useState("");
  const [correctAnswerType, setcorrectAnswerType] = useState("");
  const [skills, setskills] = useState([]);
  const [topics, settopics] = useState([]);
  const [sourceSelected, setsourceSelected] = useState("");
  const [skillSearchText, setskillSearchText] = useState("");
  const [searchSkillData, setsearchSkillData] = useState([]);
  const [topicSearchText, settopicSearchText] = useState("");
  const [searchTopicData, setsearchTopicData] = useState([]);
  const [refresh, setrefresh] = useState({});
  const [loading, setloading] = useState(false);
  const [checked, setchecked] = useState(
    props?.data?.correctAnswerType === "Yes" ? true : false
  );
  const onChangeToggle = (e) => {
    e.target.checked ? setcorrectAnswerType("Yes") : setcorrectAnswerType("No");
    setchecked(e.target.checked);
  };

  useEffect(() => {
    setsourceSelected(props?.data?.sourceSelected);
    setEditorState(
      EditorState.createWithContent(
        ContentState.createFromText(props.data?.question)
      )
    );
    setsectionHeader(props?.data?.Section_header);
    setdifficultyLevel(props?.data?.difficultyLevelId?.level);
    setanswerObj(props?.data?.answersObjectArray);
    setcorrectAnswerType(props?.data?.correctAnswerType);
    setcorrectObj(props?.data?.correctAnswerObjectArray);
    setscore(props?.data?.score);
    setskills(props?.data?.skillsId);
    props?.data?.skillsId.forEach((data) => {
      data.topicId?.forEach((topic) => {
        settopics((prev) => [...prev, topic]);
      });
    });
  }, [props?.data]);
  const focus = () => {
    if (editor.current) editor.current.focus();
  };

  const handleKeyCommand = useCallback(
    (command, editorState) => {
      const newState = RichUtils.handleKeyCommand(editorState, command);
      if (newState) {
        setEditorState(newState);
        return "handled";
      }
      return "not-handled";
    },
    // eslint-disable-next-line
    [editorState, setEditorState]
  );

  const mapKeyToEditorCommand = useCallback(
    (e) => {
      // eslint-disable-next-line
      switch (e.keyCode) {
        case 9: // TAB
          const newEditorState = RichUtils.onTab(
            e,
            editorState,
            4 /* maxDepth */
          );
          if (newEditorState !== editorState) {
            setEditorState(newEditorState);
          }
          return null;
      }
      return getDefaultKeyBinding(e);
    },
    [editorState, setEditorState]
  );

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = "RichEditor-editor";
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
    }
  }

  const onType = async (e) => {
    const search = e.target.value;
    setskillSearchText(e.target.value);

    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${search}`,
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

  const searchSkill = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`,
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
        `${backend_url}topic/search?page=1&limit=5&searchText=${topicSearchText}`,
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
        settopics((prev) => [...prev, topicId?.topicId]);
        obj.topicId.push(topicId?.topicId);
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
    let topicsArray = topics?.map(function (item) {
      return item.topic;
    });

    if (!topicsArray.includes(topicName.topic)) {
      settopics((prev) => [...prev, topicName]);
      searchTopicData.length = 0;
    } else {
      toast("You have added already that topic", {
        className: "toast-message",
      });
    }
  };

  const removeSkill = (skillId) => {
    const filterSkillData = skills.filter(
      (element) => element.skills._id !== skillId
    );
    setskills(filterSkillData);
    topics.length = 0;
    filterSkillData.forEach((data) => {
      data.topicId.forEach((topic) => {
        settopics((prev) => [...prev, topic]);
      });
    });
    toast("skill is removed...");
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
    const filterTopicData = topics.filter((element) => element._id !== topicId);
    settopics(filterTopicData);
    toast("topic is removed...");
  };

  const changeCorrectAnswer = async (e, editedIndex) => {
    if (correctAnswerType === "Yes") {
      const itemIndex = correctObj.findIndex((o) => {
        return parseInt(o) === parseInt(editedIndex);
      });
      if (itemIndex > -1) {
        correctObj.splice(itemIndex, 1);
      } else {
        correctObj.push(`${editedIndex}`);
      }
    } else {
      const itemIndex = correctObj.findIndex((o) => {
        return parseInt(o) === parseInt(editedIndex);
      });
      if (itemIndex > -1) {
        correctObj.splice(itemIndex, 1);
      } else {
        correctObj[0] = editedIndex;
      }
    }

    setrefresh({});
  };

  const updateQuestionToLibrary = async () => {
    setloading(true);
    try {
      if (editorState.getCurrentContent().getPlainText("\u0001") === "") {
        toast("please enter problem field!");
        setloading(false);
      } else if (sectionHeader === "") {
        toast("please question title  field!");
        setloading(false);
      } else if (score === "") {
        toast("please enter score field!");
        setloading(false);
      } else if (skills.length === 0) {
        toast("please add atleast one skill!");
        setloading(false);
      } else if (topics.length === 0) {
        toast("please add atleast one topic!");
        setloading(false);
      } else {
        const token = getCookie("Xh7ERL0G");
        let tempArray = [];
        skills.forEach((element) => {
          const obj = {
            skills: "",
            topicId: [],
          };
          obj.skills = element.skills._id;
          element.topicId?.forEach((topicId) => {
            obj.topicId.push(topicId._id);
          });
          tempArray.push(obj);
        });
        //const skillsData1 = skills?.map(element => { return element._id })
        const topicsData1 = topics?.map((element) => {
          return element._id;
        });
        let difficultyLevelID;
        if (difficultyLevel === "easy") {
          difficultyLevelID = "641bd41c8782fdd946db740b";
        }
        if (difficultyLevel === "medium") {
          difficultyLevelID = "641bf53ce012709b89e6c2cc";
        }
        if (difficultyLevel === "hard") {
          difficultyLevelID = "641bf5c1e012709b89e6c2d2";
        }
        const res = await axios.put(
          `${backend_url}question/updateQuestion/${props?.data?._id}`,
          {
            question: editorState.getCurrentContent().getPlainText("\u0001"),
            answersObjectArray: answerObj,
            correctAnswerObjectArray: correctObj,
            Section_header: sectionHeader,
            token: token,
            type: props?.data?.type,
            clientId: props?.data?.clientId,
            createdBy: props?.data?.createdBy,
            correctAnswerType: correctAnswerType,
            difficultyLevelId: difficultyLevelID,
            topicId: topicsData1,
            skillsId: tempArray,
            score: score,
            status: "complete",
          }
        );
        setloading(false);
        toast("question updated successfully!");
        props?.onClickSave(res.data.data, sourceSelected);
      }
    } catch (error) {
      setloading(false);
      if (error.response.data.error.code === 11000) {
        toast("Question is already exits in library!");
      } else {
        toast(error.message);
      }
    }
  };

  const removeAnwserObject = (name) => {
    const newAnwserObject = answerObj.filter((data) => data.option !== name);
    setanswerObj(newAnwserObject);
  };

  const addNewOption = () => {
    const optionId = uuidv4();

    if (answerObj.length < 6) {
      setanswerObj((prev) => [
        ...prev,
        answerObj.includes(`option ${answerObj.length + 1}`)
          ? { optionId: optionId, option: `option ${Math.random().toFixed(0)}` }
          : { option: `option ${answerObj.length + 1}`, optionId: optionId },
      ]);
    } else {
      toast.error("only 6 solution are allowed");
    }
  };
  return (
    <div className="Edit-question-parent-model-container">
      <svg
        onClick={() => props?.onClickCancel()}
        className="cancel-icon"
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
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
      <div className="Edit-question-model-container">
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
            <label>Edit Question</label>
          </div>

          <div className="button-container">
            <button
              onClick={() => props?.onClickCancel()}
              style={{ background: "#827C7C" }}
            >
              {/*discard icon */}
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="8.72179" cy="8" rx="8.44444" ry="8" fill="white" />
                <path
                  d="M11.5859 5.22363L5.58594 11.2236"
                  stroke="#999999"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.58594 5.22363L11.5859 11.2236"
                  stroke="#999999"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <label>Discard</label>
            </button>

            <button
              onClick={updateQuestionToLibrary}
              style={{ background: "#00C49A" }}
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

        <div className="edit-question-title-container">
          <label>Question Title</label>
          <input
            value={sectionHeader}
            onChange={(e) => setsectionHeader(e.target.value)}
            placeholder="javascript question"
          />
        </div>

        <div className="edit-score-diffuculty-level-container">
          <div className="edit-score-input-container">
            <label>Score</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setscore(e.target.value.slice(0, 3))}
              placeholder="Enter Maximum Score"
            />
          </div>
          <div className="edit-difficulty-level-container">
            <label>Difficulty</label>
            <div className="edit-difficulty-button-container">
              <button
                onClick={() => setdifficultyLevel("easy")}
                style={
                  difficultyLevel === "easy"
                    ? { borderColor: "#00C49A" }
                    : { borderColor: "#DDDDDD" }
                }
              >
                {/*easy icon */}
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z"
                    fill="#00C49A"
                  />
                </svg>
                <label>Easy</label>
              </button>
              <button
                onClick={() => setdifficultyLevel("medium")}
                style={
                  difficultyLevel === "medium"
                    ? { borderColor: "#FF9736" }
                    : { borderColor: "#DDDDDD" }
                }
              >
                {/*medium icon */}
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z"
                    fill="#FF9736"
                  />
                </svg>
                <label>Medium</label>
              </button>
              <button
                onClick={() => setdifficultyLevel("hard")}
                style={
                  difficultyLevel === "hard"
                    ? { borderColor: "#FF5D00" }
                    : { borderColor: "#DDDDDD" }
                }
              >
                {/*hard icon */}
                <svg
                  width="14"
                  height="20"
                  viewBox="0 0 14 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z"
                    fill="#FF5D00"
                  />
                </svg>
                <label>Hard</label>
              </button>
            </div>
          </div>
        </div>
        <div className="edit-skill-topics-container">
          <div
            style={{ position: "relative" }}
            className="edit-skill-container"
          >
            <label>Skills</label>
            <div className="edit-search-skill-container">
              {/**tag icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.375 4.375H4.38125"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
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
              />
              {skillSearchText !== "" ? (
                <svg
                  style={{ cursor: "pointer", position: "absolute", right: 40 }}
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
              {/**search icon */}
              <svg
                onClick={() => searchSkill()}
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
            </div>
            <div className="edit-skill-list-item-container">
              {skills?.map((data) => {
                //if(data.topicId?.length){
                return (
                  <div className="edit-skill-list-item">
                    <p>{data?.skills.skills}</p>
                    {/**cancel icon */}
                    <svg
                      onClick={() => removeSkill(data.skills._id)}
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
                  </div>
                );
                // }
              })}
            </div>
            {skillSearchText !== "" && searchSkillData?.length ? (
              <div
                onClick={() => (searchSkillData.length = 0)}
                className="search-result-container"
              >
                <svg
                  style={{ cursor: "pointer", position: "absolute", right: 20 }}
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
                    <div style={{ marginTop: 5 }} className="skill-item">
                      <span> {data?.skills}</span>
                      <svg
                        onClick={() => addSearchedSkill(data)}
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

          <div
            style={{ position: "relative" }}
            className="edit-topics-container"
          >
            <label>Topic</label>
            <div className="edit-search-topics-container">
              {/**tag icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.375 4.375H4.38125"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchTopic();
                  }
                }}
                value={topicSearchText}
                onChange={(e) => settopicSearchText(e.target.value)}
                placeholder="Search topic here..."
              />
              {topicSearchText !== "" ? (
                <svg
                  style={{ cursor: "pointer", position: "absolute", right: 40 }}
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
              {/**search icon */}
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
            </div>
            <div className="edit-topics-list-item-container">
              {topics?.map((data) => {
                return (
                  <div className="edit-topics-list-item">
                    <p>{data?.topic}</p>
                    {/**cancel icon */}
                    <svg
                      onClick={() => removeTopic(data._id)}
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
                  </div>
                );
              })}
            </div>
            {topicSearchText !== "" && searchTopicData?.length ? (
              <div className="search-result-container">
                <svg
                  style={{ cursor: "pointer", position: "absolute", right: 20 }}
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

        <div className="edit-problem-solution-input-container">
          <div className="edit-problem-input-container">
            <label>Problem</label>
            <div className="RichEditor-root">
              <BlockStyleControls
                editorState={editorState}
                onToggle={(blockType) => {
                  const newState = RichUtils.toggleBlockType(
                    editorState,
                    blockType
                  );
                  setEditorState(newState);
                }}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={(inlineStyle) => {
                  const newState = RichUtils.toggleInlineStyle(
                    editorState,
                    inlineStyle
                  );
                  setEditorState(newState);
                }}
              />
              <div className={className} onClick={focus}>
                <Editor
                  blockStyleFn={getBlockStyle}
                  customStyleMap={styleMap}
                  editorState={editorState}
                  handleKeyCommand={handleKeyCommand}
                  keyBindingFn={mapKeyToEditorCommand}
                  onChange={setEditorState}
                  placeholder="Write something..."
                  ref={editor}
                  spellCheck={true}
                />
              </div>
            </div>
          </div>

          <div className="edit-solution-answer-input-container">
            <div className="header">
              <label>Solution</label>
              <span>
                <label class="switch">
                  <input
                    checked={checked}
                    onChange={onChangeToggle}
                    type="checkbox"
                  />
                  <span class="slider round"></span>
                </label>

                {correctAnswerType === "Yes" ? (
                  <svg
                    width="15"
                    height="16"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2071_2909)">
                      <path
                        d="M13.75 7.42467V7.99967C13.7492 9.34744 13.3128 10.6588 12.5058 11.7383C11.6989 12.8178 10.5646 13.6075 9.2721 13.9896C7.97964 14.3717 6.59829 14.3259 5.33404 13.8588C4.0698 13.3917 2.99041 12.5285 2.25685 11.3978C1.52329 10.2672 1.17487 8.92971 1.26355 7.58487C1.35223 6.24002 1.87325 4.95988 2.74892 3.93534C3.6246 2.91081 4.80799 2.19679 6.12262 1.89976C7.43725 1.60274 8.81267 1.73863 10.0438 2.28717"
                        stroke="#00C49A"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.75 3L7.5 9.25625L5.625 7.38125"
                        stroke="#00C49A"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2071_2909">
                        <rect
                          width="15"
                          height="15"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                ) : (
                  <svg
                    width="15"
                    height="16"
                    viewBox="0 0 15 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_2071_2909)">
                      <path
                        d="M13.75 7.42467V7.99967C13.7492 9.34744 13.3128 10.6588 12.5058 11.7383C11.6989 12.8178 10.5646 13.6075 9.2721 13.9896C7.97964 14.3717 6.59829 14.3259 5.33404 13.8588C4.0698 13.3917 2.99041 12.5285 2.25685 11.3978C1.52329 10.2672 1.17487 8.92971 1.26355 7.58487C1.35223 6.24002 1.87325 4.95988 2.74892 3.93534C3.6246 2.91081 4.80799 2.19679 6.12262 1.89976C7.43725 1.60274 8.81267 1.73863 10.0438 2.28717"
                        stroke="#d3d3d3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.75 3L7.5 9.25625L5.625 7.38125"
                        stroke="#d3d3d3"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2071_2909">
                        <rect
                          width="15"
                          height="15"
                          fill="white"
                          transform="translate(0 0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                )}
                {correctAnswerType === "Yes" ? (
                  <label>Multiple answers allowed</label>
                ) : (
                  <label>Single answers allowed</label>
                )}
              </span>
            </div>
            <div className="edit-answer-input-container">
              {answerObj?.map((data, index) => {
                return (
                  <div
                    style={
                      correctObj?.includes(
                        correctAnswerType === "Yes"
                          ? `${data.optionId}`
                          : data.optionId
                      )
                        ? { borderColor: "#00C49A" }
                        : {}
                    }
                    className="edit-answer-input"
                  >
                    <div className="anwser-item">
                      <span>{index + 1}. </span>
                      <span
                        contenteditable="true"
                        onInput={(e) => {
                          e.stopPropagation();
                          answerObj[index].option = e.currentTarget.textContent;
                        }}
                      >
                        {data.option === false || data.option === true
                          ? data.option + ""
                          : data.option}
                      </span>
                    </div>
                    <div>
                      {index > 1 && (
                        <label onClick={() => removeAnwserObject(data.option)}>
                          Remove
                        </label>
                      )}

                      {correctObj.includes(
                        correctAnswerType === "Yes"
                          ? `${data.optionId}`
                          : data.optionId
                      ) ? (
                        <svg
                          onClick={(e) => {
                            e.stopPropagation();
                            changeCorrectAnswer(e, data.optionId);
                          }}
                          width="20"
                          height="21"
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
                            changeCorrectAnswer(e, data.optionId);
                          }}
                          width="20"
                          height="21"
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
                  </div>
                );
              })}
              <button onClick={() => addNewOption()}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 3.33301V12.6663"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33398 8H12.6673"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>New field</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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

export default EditQuestionModel;
