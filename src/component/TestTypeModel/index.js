import React, { useContext } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { toast } from "react-toastify";
import CreateTestContext from "../../store/CreateTestContext";
import jwtDecode from "jwt-decode";
import { EditorState, ContentState } from "draft-js";
import TestCreationLoadingScreen from "../TestCreationLoadingScreen";

let cancelToken;

function TestTypeModel(props) {
  const createTestContext = useContext(CreateTestContext);
  const navigate = useNavigate();
  const [skillSearchText, setskillSearchText] = useState("");
  const [searchSkillData, setsearchSkillData] = useState([]);
  const [closesearchSkillModel, setclosesearchSkillModel] = useState(true);
  const [onClickedNext, setonClickedNext] = useState(false);
  const [suggestedError, setsuggestedError] = useState(false);
  const [suggestedSkill, setsuggestedSkill] = useState([]);
  const [totalMcqQuestion, settotalMcqQuestion] = useState(0);
  const [totalProgrammingQuestion, settotalProgrammingQuestion] = useState(0);
  const [skillItem, setskillItem] = useState([]);
  const [loading, setloading] = useState(false);
  const [nextPageLoding, setnextPageLoding] = useState(false);
  const [perSkillMcqQuestion, setperSkillMcqQuestion] = useState("");
  const [perSkillProgQuestion, setperSkillProgQuestion] = useState("");

  const handleSearchChange = async (e) => {
    onChangeSearchSkillText(e.target.value);
    const value = e.target.value;
    if (cancelToken) {
      cancelToken.cancel("Operations cancelled due to new request");
    }
    cancelToken = axios.CancelToken.source();
    let results;
    let token = getCookie("Xh7ERL0G");
    try {
      results = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${value}`,
        {
          cancelToken: cancelToken.token,
          headers: { token: token },
        }
      );
    } catch (error) {
      console.log(error);
    }
    setSkillData(results.data.data);
  };

  const setSkillData = (data) => {
    let filterSource = createTestContext.skills.map((data) => {
      return data.skills;
    });
    const res = data.filter((item) => !filterSource.includes(item.skills));
    setsearchSkillData(res);
  };

  const onChangeSearchSkillText = (text) => {
    setclosesearchSkillModel(true);
    setskillSearchText(text);
  };

  const searchSkill = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`,
        { headers: { token: token } }
      );
      setsearchSkillData(res.data.data);
      setclosesearchSkillModel(true);
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const addSearchedSkill = (skillName) => {
    const filterSelectedSkill = createTestContext.skills.map((data) => {
      return data.skills;
    });
    const filterSuggestedSkill = suggestedSkill.map((data) => {
      return data?.skillId?.skills;
    });
    if (
      !filterSelectedSkill.includes(skillName.skills) &&
      !filterSuggestedSkill.includes(skillName.skills)
    ) {
      if (createTestContext.skills.length < 5) {
        setsuggestedError(false);
        createTestContext.setSkillsByJobRole(skillName);

        setsuggestedSkill((prev) => [
          ...prev,
          { isAdded: true, skillId: skillName },
        ]);
        setclosesearchSkillModel(false);
      } else {
        setsuggestedError(true);
      }
    } else {
      toast("You have added already that skill", {
        className: "toast-message",
      });
    }
  };

  const addSuggestedSkill = (skillName) => {
    const filterSelectedSkill = createTestContext.skills.map((data) => {
      return data.skills;
    });
    if (!filterSelectedSkill.includes(skillName.skillId.skills)) {
      if (createTestContext.skills.length < 5) {
        setsuggestedError(false);
        createTestContext.setSkillsByJobRole(skillName.skillId);
        suggestedSkill.forEach((data) => {
          if (data?.skillId?.skills === skillName.skillId.skills) {
            data.isAdded = true;
          }
        });
      } else {
        setsuggestedError(true);
      }
    } else {
      setsuggestedError(false);
      const filterSkillData = createTestContext.skills.filter(
        (element) => element.skills !== skillName.skillId.skills
      );
      createTestContext.setskills(filterSkillData);
      suggestedSkill.forEach((data) => {
        if (data?.skillId?.skills === skillName.skillId.skills) {
          data.isAdded = false;
        }
      });
    }
  };

  const removeSkill = (skillId) => {
    suggestedSkill.forEach((data) => {
      if (data?.skillId?.skills === skillId.skills) {
        data.isAdded = false;
        setsuggestedError(false);
      }
    });
    const filterSkillData = createTestContext.skills.filter(
      (element) => element.skills !== skillId.skills
    );
    createTestContext.setskills(filterSkillData);
    toast("skill is removed...");
  };

  const getSkillByJobRole = async (id) => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(`${backend_url}jobrole/getroleTable/${id}`, {
        headers: { token: token },
      });
      res.data.roleTableSpec.skills.forEach((element) => {
        element.isAdded = false;
        setsuggestedSkill((prev) => [...prev, element]);
      });
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const changeJobRole = (e) => {
    createTestContext.setjobRole(e.target.value);
    if (e.target.value !== "") {
      setsuggestedSkill([]);
      createTestContext.skills.length = 0;
      getSkillByJobRole(e.target.value);
    }
  };

  const createTest = async (skillItem) => {
    try {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const testName = createTestContext.jobRoleData.filter((data) => {
        return data._id === createTestContext.jobRole;
      });
      const res = await axios.post(
        `${backend_url}test/create`,
        {
          name: `${testName[0].jobrole} test`,
          createdBy: decode.user_id,
          creationDateTime: new Date(),
          description: `${testName[0].jobrole} description`,
          experience: createTestContext.experience,
          jobRole: testName[0]._id,
          skill: skillItem
            .filter((data) => data.skillId)
            .map((data) => data.skillId),
          testCreationType: "",
          testCreationTypeDetails: "",
          cutOff: null,
          totalTiming: "",
          totalScore: null,
          totalNoOfQuestions: null,
          link: "",
          instruction: "",
          testType: "",
          isActive: false,
          status: "draft",
          html: "",
          image: "",
        },
        { headers: { token: token } }
      );
      return res.data.data;
    } catch (error) {
      toast.error(error);
    }
  };

  const navigateToNextPage = (e) => {
    setnextPageLoding(true);
    e.stopPropagation();
    setonClickedNext(true);
    if(createTestContext.testCreationType === "Auto Test"){
      if (
        createTestContext.testCreationType === "Auto Test" &&
        !(
          createTestContext.testCreationTypeDetails.includes("EliteQA Library") ||
          createTestContext.testCreationTypeDetails.includes("My Library")
        )
      ) {
        toast.error("Please select atleast one library!");
        setnextPageLoding(false);
      } else if (createTestContext.experience === "") {
        toast.error("Please select experience!");
        setnextPageLoding(false);
      } else if (createTestContext.jobRole === "") {
        toast.error("Please select jobrole!");
        setnextPageLoding(false);
      } else if (createTestContext.skills.length === 0) {
        toast.error("Please add skill!");
        setnextPageLoding(false);
      } else if (createTestContext.skills.length > 5) {
        toast.error("Please add skill less than 5!");
        setnextPageLoding(false);
      } else {
        insertQuestion();
      }
    }else{
      navigate("/custome_test_summary");
    }
  
  };

  const insertQuestion = async () => {
    try {
      const output = {
        mcqEasy: [],
        mcqMedium: [],
        mcqHard: [],
        programmingEasy: [],
        programmingMedium: [],
        programmingHard: [],
      };

      const mcqTotal = (data) => ~~((data.mcq / 100) * 20);
      const programmingTotal = (data) => ~~((data.programming / 100) * 20);

      createTestContext.exprienceData.forEach((data) => {
        if (data.experience === createTestContext.experience) {
          const totalMCQEasyQuestions = (
            mcqTotal(data) *
            (data.easy / 100)
          ).toFixed(0);
          const totalMCQMediumQuestions = (
            mcqTotal(data) *
            (data.medium / 100)
          ).toFixed(0);
          let totalEasyMediumMCQ =
            parseInt(totalMCQEasyQuestions) + parseInt(totalMCQMediumQuestions);
          const totalMCQHardQuestions = mcqTotal(data) - totalEasyMediumMCQ;
          const totalProgrammingEasyQuestions =
            programmingTotal(data) * (data.easy / 100);
          const totalProgrammingMediumQuestions =
            programmingTotal(data) * (data.medium / 100);
          const totalProgrammingEasyMedium =
            parseInt(programmingTotal(data) * (data.easy / 100)) +
            parseInt(programmingTotal(data) * (data.medium / 100));
          const totalProgrammingHardQuestions =
            programmingTotal(data) - totalProgrammingEasyMedium;
          for (let i = 0; i < totalMCQEasyQuestions; i++) {
            output.mcqEasy.push(
              createTestContext.skills[i % createTestContext.skills.length]._id
            );
          }

          for (let i = 0; i < totalMCQMediumQuestions; i++) {
            output.mcqMedium.push(
              createTestContext.skills[i % createTestContext.skills.length]._id
            );
          }

          for (let i = 0; i < totalMCQHardQuestions; i++) {
            output.mcqHard.push(
              createTestContext.skills[i % createTestContext.skills.length]._id
            );
          }

          for (let i = 0; i < totalProgrammingEasyQuestions; i++) {
            output.programmingEasy.push(
              createTestContext.skills[i % createTestContext.skills.length]._id
            );
          }

          for (let i = 0; i < totalProgrammingMediumQuestions; i++) {
            output.programmingMedium.push(
              createTestContext.skills[i % createTestContext.skills.length]._id
            );
          }

          for (let i = 0; i < totalProgrammingHardQuestions; i++) {
            output.programmingHard.push(
              createTestContext.skills[i % createTestContext.skills.length]._id
            );
          }
        }
      });
      const skillItem = [];

      createTestContext.skills.forEach((data) => {
        const objMCQ = {
          skillId: data._id,
          question_type: "MCQ",
          easy_question: output.mcqEasy.filter((data1) => data1 === data._id),
          medium_question: output.mcqMedium.filter(
            (data1) => data1 === data._id
          ),
          hard_question: output.mcqHard.filter((data1) => data1 === data._id),
        };
        skillItem.push(objMCQ);

        const objProgramming = {
          skillId: data._id,
          question_type: "Programming",
          easy_question: output.programmingEasy.filter(
            (data1) => data1 === data._id
          ),
          medium_question: output.programmingMedium.filter(
            (data1) => data1 === data._id
          ),
          hard_question: output.programmingHard.filter(
            (data1) => data1 === data._id
          ),
        };
        skillItem.push(objProgramming);
      });

      const testData = await createTest(skillItem);

      const questionDuplicate = [];
      // const promises = skillItem.map(async (data) => {
      //     for (const key in data) {
      //         if (key === "easy_question" || key === "medium_question" || key === "hard_question") {
      //             const token = getCookie("Xh7ERL0G");
      //             const decode = jwtDecode(token)
      //             const difficultyLevelId = key === "easy_question" ? ["641bd41c8782fdd946db740b"] : key === "medium_question" ? ["641bf53ce012709b89e6c2cc"] : ["641bf5c1e012709b89e6c2d2"];
      //             if (data[key].length > 0) {
      //                 const res = await axios.post(`${backend_url}question/getQuestionAsPerExperience?page=1&limit=${data[key].length}`, {
      //                     "type": data['question_type'],
      //                     "createdBy": createTestContext.testCreationTypeDetails.includes('EliteQA Library') && createTestContext.testCreationTypeDetails.includes('My Library') ? ["632c16db596546cfa858136f", `${decode.client._id}`] : createTestContext.testCreationTypeDetails.includes('EliteQA Library') ? ['632c16db596546cfa858136f'] : [`${decode.client._id}`],
      //                     "skills": [data['skillId']],
      //                     "healthScore": 20,
      //                     "difficultyLevelId": difficultyLevelId,
      //                     "question": questionDuplicate.map(data=>data.questions._id)
      //                 }, { headers: { "token": token } });

      //                 res?.data?.data?.forEach((question) => {
      //                     createTestContext.setQuestions({skillId: data['skillId'], questions: question});
      //                     questionDuplicate.push({skillId: data['skillId'], questions: question})
      //                 });
      //             }
      //         }
      //     }
      // });

      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const difficultyLevels = {
        easy_question: ["641bd41c8782fdd946db740b"],
        medium_question: ["641bf53ce012709b89e6c2cc"],
        hard_question: ["641bf5c1e012709b89e6c2d2"],
      };

      const fetchData = async () => {
        for (const data of skillItem) {
          for (const key in data) {
            if (
              key === "easy_question" ||
              key === "medium_question" ||
              key === "hard_question"
            ) {
              const difficultyLevelId = difficultyLevels[key];

              if (data[key].length > 0) {
                const res = await axios.post(
                  `${backend_url}question/getQuestionAsPerExperience?page=1&limit=${data[key].length}`,
                  {
                    type: data["question_type"],
                    createdBy:
                      createTestContext.testCreationTypeDetails.includes(
                        "EliteQA Library"
                      ) &&
                      createTestContext.testCreationTypeDetails.includes(
                        "My Library"
                      )
                        ? ["632c16db596546cfa858136f", `${decode.user_id}`]
                        : createTestContext.testCreationTypeDetails.includes(
                            "EliteQA Library"
                          )
                        ? ["632c16db596546cfa858136f"]
                        : [`${decode.user_id}`],
                    // clientId:
                    //   createTestContext.testCreationTypeDetails.includes(
                    //     "EliteQA Library"
                    //   ) && ["632c16db596546cfa858136f"],
                    // createdBy:
                    //   createTestContext.testCreationTypeDetails.includes(
                    //     "My Library"
                    //   ) && [`${decode.user_id}`],
                    skills: [data["skillId"]],
                    // healthScore: 20,
                    difficultyLevelId: difficultyLevelId,
                    question: questionDuplicate.map(
                      (data) => data.questions._id
                    ),
                  },
                  { headers: { token: token } }
                );

                res?.data?.data?.forEach(async (question) => {
                  createTestContext.setQuestions({
                    skillId: data["skillId"],
                    questions: question,
                  });
                  questionDuplicate.push({
                    skillId: data["skillId"],
                    questions: question,
                  });
                });
              }
            }
          }
        }
      };

      const promises = [fetchData()];

      Promise.all(promises)
        .then(async () => {
          //All API calls are complete

          const token = getCookie("Xh7ERL0G");
          const testName = createTestContext.jobRoleData.filter((data) => {
            return data._id === createTestContext.jobRole;
          });
          createTestContext.setTestHeading(`${testName[0].jobrole} test`);
          createTestContext.setTestDescription(
            `<p>${testName[0].jobrole} description </p>`
          );
          createTestContext.setTestId(testData._id);
          const res = await axios.post(
            `${backend_url}testsummary/create`,
            {
              testId: testData._id,
              name: `${testName[0].jobrole} test`,
              skills: skillItem,
            },
            { headers: { token: token } }
          );
          createTestContext.setTestSummaryId(res.data.data._id);
          navigate("/testsummary");
          setnextPageLoding(false);
        })
        .catch((error) => {
          setnextPageLoding(false);
          // Handle error
        });
    } catch (error) {
      setnextPageLoding(false);
      toast.error(error);
    }
  };

  return (
    <div className="test-type-container-model">
      {nextPageLoding ? (
        <TestCreationLoadingScreen />
      ) : (
        <div className="test-type-box">
          <div className="header">
            <div className="title">
              <span>Choose Test Type</span>
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  createTestContext.clearState();
                  props.closeAssessmentModel();
                }}
                style={{ cursor: "pointer" }}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z"
                  fill="#99B2C6"
                />
              </svg>
            </div>
            <div className="header-border"></div>
          </div>

          <div className="test-type" style={{ marginTop: "5px" }}>
            <div className="test-btn">
              <div
                onClick={() => {
                  createTestContext.settestCreationType("Auto Test");
                }}
                className={
                  createTestContext.testCreationType === "Auto Test"
                    ? "selected-test"
                    : "unselected-test"
                }
              >
                <span>Auto Test</span>
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.4362 14.6663C12.1181 14.6663 15.1029 11.6816 15.1029 7.99967C15.1029 4.31778 12.1181 1.33301 8.4362 1.33301C4.7543 1.33301 1.76953 4.31778 1.76953 7.99967C1.76953 11.6816 4.7543 14.6663 8.4362 14.6663Z"
                    stroke={
                      createTestContext.testCreationType === "Auto Test"
                        ? "#FF6812"
                        : "black"
                    }
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.4375 5.33301V7.99967"
                    stroke={
                      createTestContext.testCreationType === "Auto Test"
                        ? "#FF6812"
                        : "black"
                    }
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.4375 10.667H8.44453"
                    stroke={
                      createTestContext.testCreationType === "Auto Test"
                        ? "#FF6812"
                        : "black"
                    }
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <div
                onClick={() => {
                  createTestContext.settestCreationType("Custom Test");
                }}
                className={
                  createTestContext.testCreationType === "Custom Test"
                    ? "selected-test"
                    : "unselected-test"
                }
              >
                <span>Custom Test</span>
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.4362 14.6663C12.1181 14.6663 15.1029 11.6816 15.1029 7.99967C15.1029 4.31778 12.1181 1.33301 8.4362 1.33301C4.7543 1.33301 1.76953 4.31778 1.76953 7.99967C1.76953 11.6816 4.7543 14.6663 8.4362 14.6663Z"
                    stroke={
                      createTestContext.testCreationType === "Custom Test"
                        ? "#FF6812"
                        : "black"
                    }
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.4375 5.33301V7.99967"
                    stroke={
                      createTestContext.testCreationType === "Custom Test"
                        ? "#FF6812"
                        : "black"
                    }
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.4375 10.667H8.44453"
                    stroke={
                      createTestContext.testCreationType === "Custom Test"
                        ? "#FF6812"
                        : "black"
                    }
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
            {createTestContext.testCreationType === "Auto Test" ? (
              <div className="library-type">
                <div className="library-btn">
                  {createTestContext.testCreationTypeDetails.includes(
                    "EliteQA Library"
                  ) ? (
                    <svg
                      onClick={() => {
                        createTestContext.settestCreationTypeDetails(
                          "EliteQA Library"
                        );
                      }}
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        y="0.5"
                        width="15"
                        height="15"
                        rx="2"
                        fill="#00C49A"
                      />
                      <path
                        d="M12 5L6.5 10.5L4 8"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      onClick={() => {
                        createTestContext.settestCreationTypeDetails(
                          "EliteQA Library"
                        );
                      }}
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.75"
                        y="1.25"
                        width="13.5"
                        height="13.5"
                        rx="1.25"
                        stroke="#252424"
                        stroke-width="1"
                      />
                    </svg>
                  )}

                  <span>EliteQA Library</span>
                </div>
                <div className="library-btn">
                  {createTestContext.testCreationTypeDetails.includes(
                    "My Library"
                  ) ? (
                    <svg
                      onClick={() => {
                        createTestContext.settestCreationTypeDetails(
                          "My Library"
                        );
                      }}
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        y="0.5"
                        width="15"
                        height="15"
                        rx="2"
                        fill="#00C49A"
                      />
                      <path
                        d="M12 5L6.5 10.5L4 8"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      onClick={() => {
                        createTestContext.settestCreationTypeDetails(
                          "My Library"
                        );
                      }}
                      width="15"
                      height="16"
                      viewBox="0 0 15 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect
                        x="0.75"
                        y="1.25"
                        width="13.5"
                        height="13.5"
                        rx="1.25"
                        stroke="#252424"
                        stroke-width="1"
                      />
                    </svg>
                  )}
                  <span>My Library</span>
                </div>
              </div>
            ) : (
              <></>
            )}
            <div className="error-header">
              {onClickedNext &&
                createTestContext.testCreationTypeDetails.length === 0 &&
                createTestContext.testCreationType === "Auto Test" &&
                "Please select at least one library!"}
            </div>
          </div>
          <div className="details">
           {createTestContext.testCreationType === "Auto Test" &&  <div className="experience">
              <span>
                Experience <label>*</label>
              </span>
              <div className="select-box">
                <select
                  value={createTestContext.experience}
                  onChange={(e) =>
                    createTestContext.setexperience(e.target.value)
                  }
                  name=""
                  id=""
                >
                  <option value="">Select</option>
                  {createTestContext.exprienceData.map((data) => {
                    return (
                      <option label={data.title} value={data.experience} />
                    );
                  })}
                </select>
              </div>
              <div className="error-header">
                {onClickedNext &&
                  createTestContext.experience === "" &&
                  "Please select exprience!"}
              </div>
            </div>} 
         
            <div className={createTestContext.testCreationType === "Auto Test"?'job-role':'custome-test-job-role'}>
              <span>
                Job Role {createTestContext.testCreationType === "Auto Test"&&<label>*</label>}
              </span>
              <div className="select-box">
                <select
                  value={createTestContext.jobRole}
                  onChange={changeJobRole}
                  name=""
                  id=""
                >
                  <option value="">Select</option>
                  {createTestContext.jobRoleData?.map((data, index) => {
                    return (
                      <option key={index} value={data._id}>
                        {data.jobrole}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="error-header">
                {onClickedNext &&
                  createTestContext.jobRole === "" &&
                  "Please select job role!"}
              </div>
            </div>
          </div>
          <div className="skill-topics-container">
            <div className="skill-input-header-container">
              <label>
                Skills {createTestContext.testCreationType != "Custom Test"&&<span>*</span> }
              </label>
              <div className="inputbox-skill">
                {/* <svg
                  onClick={() => searchSkill()}
                  style={{ cursor: "pointer" }}
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2071_2845)">
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
                    <clipPath id="clip0_2071_2845">
                      <rect width="15" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg> */}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.375 4.375H4.38125" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchSkill();
                    }
                  }}
                  value={skillSearchText}
                  onChange={handleSearchChange}
                  placeholder="Search Skills"
                />
                <svg
                  onClick={() => searchSkill()}
                  style={{ cursor: "pointer" }}
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2071_2845)">
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
                    <clipPath id="clip0_2071_2845">
                      <rect width="15" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                {skillSearchText !== "" ? (
                  <svg
                    className="search-svg"
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: 40,
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
              {skillSearchText !== "" && closesearchSkillModel ? (
                <div className="search-result-container">
                  {searchSkillData.length ? (
                    <>
                      {searchSkillData.map((data) => {
                        return (
                          <div
                            style={
                              createTestContext.skills.find(
                                (obj) => obj.skills === data.skills
                              ) !== undefined
                                ? { background: "#384455" }
                                : {}
                            }
                            onClick={() => addSearchedSkill(data)}
                            className="skill-item"
                          >
                            <span
                              style={
                                createTestContext.skills.find(
                                  (obj) => obj.skills === data.skills
                                ) !== undefined
                                  ? { color: "white" }
                                  : {}
                              }
                            >
                              <svg
                                width="10"
                                height="11"
                                viewBox="0 0 10 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <g clip-path="url(#clip0_5427_2844)">
                                  <path
                                    d="M8.57787 6.08717L5.59036 9.07467C5.51297 9.15216 5.42106 9.21362 5.3199 9.25556C5.21873 9.2975 5.11029 9.31908 5.00078 9.31908C4.89127 9.31908 4.78283 9.2975 4.68166 9.25556C4.5805 9.21362 4.48859 9.15216 4.4112 9.07467L0.832031 5.49967V1.33301H4.9987L8.57787 4.91217C8.73307 5.06831 8.82019 5.27952 8.82019 5.49967C8.82019 5.71983 8.73307 5.93104 8.57787 6.08717V6.08717Z"
                                    stroke={
                                      createTestContext.skills.find(
                                        (obj) => obj === data.skills
                                      ) !== undefined
                                        ? "white"
                                        : "black"
                                    }
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M2.91797 3.41699H2.92214"
                                    stroke={
                                      createTestContext.skills.find(
                                        (obj) => obj.skills === data.skills
                                      ) !== undefined
                                        ? "white"
                                        : "black"
                                    }
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_5427_2844">
                                    <rect
                                      width="10"
                                      height="10"
                                      fill="white"
                                      transform="translate(0 0.5)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data?.skills}
                            </span>
                            {createTestContext.skills.find(
                              (obj) => obj.skills === data.skills
                            ) !== undefined ? (
                              <svg
                                width="10"
                                height="7"
                                viewBox="0 0 10 7"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M1 4.1L3.4 6.5L9.4 0.5"
                                  stroke="#F1F5F7"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            ) : (
                              <></>
                            )}
                            {/* <svg  style={{ cursor: 'pointer' }} width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z" fill="#FF6812" />
                                    </svg> */}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <div style={{ textAlign: "center" }}>No data found...</div>
                  )}
                </div>
              ) : (
                <></>
              )}
              <div className="error-header">
                {onClickedNext &&
                  createTestContext.skills.length === 0 &&
                  "Please select atleast one skill!"}
              </div>
              {suggestedSkill.length ? (
                <>
                  <div className="suggested-skill-main-container">
                    <label>Suggested Skills</label>
                    <div className="suggested-skill-list-container">
                      {suggestedSkill
                        .filter(
                          (v, i, a) =>
                            a.findIndex(
                              (v2) => v2.skillId?.skills === v.skillId?.skills
                            ) === i
                        )
                        .map((data) => {
                          return data.skillId !== null ? (
                            <div
                              style={
                                data.isAdded
                                  ? { border: "1px solid #00C49A" }
                                  : {}
                              }
                              onClick={() => addSuggestedSkill(data)}
                              className="skills-item-container"
                            >
                              <span
                                style={
                                  data.isAdded ? { color: " #00C49A" } : {}
                                }
                              >
                                {data?.skillId?.skills}
                              </span>
                              {data.isAdded ? (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="10"
                                    cy="10.5"
                                    r="10"
                                    fill="#00C49A"
                                  />
                                  <path
                                    d="M13.5 7.75L8.6875 12.5625L6.5 10.375"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <circle
                                    cx="10"
                                    cy="10.5"
                                    r="10"
                                    fill="#F0F7FB"
                                  />
                                  <path
                                    d="M13.5 7.75L8.6875 12.5625L6.5 10.375"
                                    stroke="#BDCCD3"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              )}
                            </div>
                          ) : (
                            <></>
                          );
                        })}
                    </div>
                  </div>
                  <div className="suggested-skill-note">
                    Note: You can add upto 5 Skills Only
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* {(createTestContext.skills.length || suggestedSkill.length) ?
                            <div className='skill-suggested-skill-container' >
                                <div className='selected-skill-main-container' >
                                    <label>Selected skill</label>
                                    <div style={{ marginTop: 10 }} className="skill-list-item-container" >
                                        {createTestContext.skills?.map((data) => {
                                            return (
                                                <button>
                                                    <span >{data.skills}</span>
                                                    <svg onClick={() => removeSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                        <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                        <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                    </svg>

                                                </button>
                                            )
                                        })


                                        }
                                    </div>

                                </div>
                                <div className='border' ></div>
                                <div className='suggested-main-container' >
                                    <label>Suggested skill</label>

                                    <div style={{ marginTop: 10 }} className="suggested-skill-list-item-container" >
                                        {suggestedSkill?.map((data) => {
                                            if (data.isAdded === false) {
                                                return (
                                                    data.skillId !== null ?
                                                        <button>
                                                            <span >{data?.skillId?.skills}</span>
                                                            <svg style={{ transform: 'rotate(45deg)' }} onClick={() => addSuggestedSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                                <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                                <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                            </svg>

                                                        </button> : <></>
                                                )
                                            }
                                        })


                                        }
                                    </div>
                                </div>


                            </div> : <></>
                        } */}
              <div className="error-header">
                {suggestedError && "Please add skill less than 5!"}
              </div>
            </div>
          </div>
          <div className="button" style={{ marginTop: "5px" }}>
            <div className="next-btn" onClick={navigateToNextPage}>
              <>
                <button>Next</button>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 16 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="7.33464" cy="6.99967" r="6.66667" fill="white" />
                  <path
                    d="M6 10.5097L10 7.4077L6 4.30566"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TestTypeModel;
