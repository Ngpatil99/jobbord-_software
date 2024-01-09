import React, { useState, useContext, useEffect, createContext } from "react";
import "./index.css";
import CreateTest3Sidebar from "../../component/CreateTest3Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import QuestionPreviewModel from "../../component/QuestionPreviewModel";
import EditQuestionModel from "../../component/EditQuestionModel";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import DeleteSkillSetModel from "../../component/DeleteSkillSetModel";
import TestDuration from "../../component/TestDuration/TestDuration";
import CreateTestContext from "../../store/CreateTestContext";
import CreateTest2Sidebar from "../../component/CreateTest2Sidebar";
import TestCreationDataLossPopup from "../../component/TestCreationDataLossPopup";
import AddQuestionPopup from "../../component/AddQuestionPopup";
import AddMultipleSkill from "../ChooseFromLibrary/AddMultipleSkill";

let cancelToken;
const QuestionOverview = () => {
  const navigate = useNavigate();
  const createTestContext = useContext(CreateTestContext);

  const [javascriptActive, setJavascriptActive] = useState("easy");
  const [isNavItem, setisNavItem] = useState(false);
  const [selectedNavItem, setselectedNavItem] = useState("");
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState("");

  const [questionPreview, setquestionPreview] = useState(false);
  const [editQuestion, seteditQuestion] = useState(false);
  const [selectedQuestionIndex, setselectedQuestionIndex] = useState("");
  // const [check, setCheck] = useState("")
  const [deleteSkillSetModel, setDeleteSkillSetModel] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectAllCheck, setselectAllCheck] = useState(false);
  const [multipleDelete, setmultipleDelete] = useState(false);
  const [javascriptType, setJavascriptType] = useState("all");
  const [duration, setDuration] = useState(false);
  const [selectedSkill, setselectedSkill] = useState(
    createTestContext?.addedSkills[0]?.skill
  );
  const [updateRefresh, setupdateRefresh] = useState({});
  const [isCreateQuestion, setisCreateQuestion] = useState(false);
  const [addMutipleSkillModal, setaddMutipleSkillModal] = useState(false);
  const [selectedMutipleObjectSkillAdd, setselectedMutipleObjectSkillAdd] =
    useState([]);

  const [selectMutipleQuestion, setselectMutipleQuestion] = useState([]);
  const [checkForQestion, setcheckForQestion] = useState(true);

  //const [questionOverview, setquestionOverview] = useState([])
  const [loading, setloading] = useState(false);
  const [deleteMutipleObject, setdeleteMutipleObject] = useState({
    skill: "",
    level: "",
  });
  const [deleteSingleObject, setdeleteSingleObject] = useState({
    skill: "",
    level: "",
  });
  const [totalScore, settotalScore] = useState("");
  const [questionEditedScore, setquestionEditedScore] = useState("");
  const [selectedQuestionData, setselectedQuestionData] = useState("");
  const [previousScore, setpreviousScore] = useState(null);
  const [updatedQuestion, setUpdatedQuestion] = useState({});

  // let arr = [];
  console.log(selectedSkill);

  useEffect(() => {
    window.history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function (event) {
      navigate("/testsummary", { state: { navigate: "true" } });
    });

    createTestContext.addedSkills.forEach((skillData) => {
      const obj = {
        skillName: "",
        totalNoOfQuestion: 0,
        totalScore: 0,
        type: "",
        filterType: "all",
        random: false,
        level: "",
        easyQuestion: {
          isPreviewQuestion: false,
          isSelectAll: false,
          question: [],
        },
        mediumQuestion: {
          isPreviewQuestion: false,
          isSelectAll: false,
          question: [],
        },
        hardQuestion: {
          isPreviewQuestion: false,
          isSelectAll: false,
          question: [],
        },
      };

      obj.skillName = skillData.skill;
      obj.totalNoOfQuestion = skillData.questions;
      obj.totalScore = skillData.score;
      obj.type = skillData.questionType;
      obj.random = skillData.random;
      obj.level = skillData.level;
      obj.easyQuestion.question = createTestContext.question
        .filter((data) => {
          //const skillExits = data.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            data.questions.difficultyLevelId.level === "easy" &&
            data.skillId === skillData.skillId &&
            data.questions.type === skillData.questionType
          );
        })
        .map((data, index) => {
          return {
            ...data.questions,
            keyID: `easy_${index}`,
            category: skillData.skill,
          };
        });

      obj.mediumQuestion.question = createTestContext.question
        .filter((data) => {
          //const skillExits = data.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            data.questions.difficultyLevelId.level === "medium" &&
            data.skillId === skillData.skillId &&
            data.questions.type === skillData.questionType
          );
        })
        .map((data, index) => {
          return {
            ...data.questions,
            keyID: `medium_${index}`,
            category: skillData.skill,
          };
        });

      obj.hardQuestion.question = createTestContext.question
        .filter((data) => {
          //const skillExits = data.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            data.questions.difficultyLevelId.level === "hard" &&
            data.skillId === skillData.skillId &&
            data.questions.type === skillData.questionType
          );
        })
        .map((data, index) => {
          return {
            ...data.questions,
            keyID: `hard_${index}`,
            category: skillData.skill,
          };
        });

      // if (obj.easyQuestion.question.length > 0) {
      //   obj.easyQuestion.isPreviewQuestion = true;
      // } else if (obj.mediumQuestion.question.length > 0) {
      //   obj.mediumQuestion.isPreviewQuestion = true;
      // } else if (obj.hardQuestion.question.length > 0) {
      //   obj.hardQuestion.isPreviewQuestion = true;
      // }

      createTestContext.setquestionOverview(obj);
    });

    settotalScore(
      parseInt(getTotalMCQQuestionScore()) +
        parseInt(getTotalProgrammingQuestionScore())
    );
    // createTestContext.question.forEach((data) => {
    //     data.selected = false
    // })
    // createTestContext.addedSkills.forEach(data => {
    //     data.selected = false
    //     data.levelWiseStatus = false
    // })
  }, []);

  useEffect(() => {
    settotalScore(
      parseInt(getTotalMCQQuestionScore()) +
        parseInt(getTotalProgrammingQuestionScore())
    );
  }, [createTestContext.question]);

  useEffect(() => {
    createTestContext.setFilterQuestionOverview([]);

    createTestContext.addedSkills.forEach((skillData) => {
      const obj = {
        skillName: "",
        totalNoOfQuestion: 0,
        totalScore: 0,
        type: "",
        level: "",
        filterType: "all",
        random: false,
        easyQuestion: {
          isPreviewQuestion: false,
          isSelectAll: false,
          question: [],
        },
        mediumQuestion: {
          isPreviewQuestion: false,
          isSelectAll: false,
          question: [],
        },
        hardQuestion: {
          isPreviewQuestion: false,
          isSelectAll: false,
          question: [],
        },
      };
      // obj.easyQuestion.isPreviewQuestion = false;
      // obj.mediumQuestion.isPreviewQuestion = false;
      // obj.hardQuestion.isPreviewQuestion = false;

      obj.skillName = skillData.skill;
      obj.totalNoOfQuestion = skillData.questions;
      obj.totalScore = skillData.score;
      obj.type = skillData.questionType;
      obj.random = skillData.random;
      obj.level = skillData.level;
      if (deleteSingleObject.level !== "") {
        if (
          deleteSingleObject.level === "easy" &&
          skillData.skill === deleteSingleObject.skill
        ) {
          obj.mediumQuestion.isPreviewQuestion = false;
          obj.hardQuestion.isPreviewQuestion = false;
          obj.easyQuestion.isPreviewQuestion = true;
        }

        if (
          deleteSingleObject.level === "medium" &&
          skillData.skill === deleteSingleObject.skill
        ) {
          obj.easyQuestion.isPreviewQuestion = false;
          obj.hardQuestion.isPreviewQuestion = false;
          obj.mediumQuestion.isPreviewQuestion = true;
        }

        if (
          deleteSingleObject.level === "hard" &&
          skillData.skill === deleteSingleObject.skill
        ) {
          obj.mediumQuestion.isPreviewQuestion = false;
          obj.easyQuestion.isPreviewQuestion = false;
          obj.hardQuestion.isPreviewQuestion = true;
        }
      } else if (deleteMutipleObject.level !== "") {
        if (
          deleteMutipleObject.level === "easy" &&
          skillData.skill === deleteMutipleObject.skill
        ) {
          obj.mediumQuestion.isPreviewQuestion = false;
          obj.hardQuestion.isPreviewQuestion = false;
          obj.easyQuestion.isPreviewQuestion = true;
        }

        if (
          deleteMutipleObject.level === "medium" &&
          skillData.skill === deleteMutipleObject.skill
        ) {
          obj.easyQuestion.isPreviewQuestion = false;
          obj.hardQuestion.isPreviewQuestion = false;
          obj.mediumQuestion.isPreviewQuestion = true;
        }

        if (
          deleteMutipleObject.level === "hard" &&
          skillData.skill === deleteMutipleObject.skill
        ) {
          obj.mediumQuestion.isPreviewQuestion = false;
          obj.easyQuestion.isPreviewQuestion = false;
          obj.hardQuestion.isPreviewQuestion = true;
        }
      }
      obj.easyQuestion.question = createTestContext.question
        .filter((data) => {
          // const skillExits = data.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            data.questions.difficultyLevelId.level === "easy" &&
            data.skillId === skillData.skillId &&
            data.questions.type === skillData.questionType
          );
        })
        .map((data, index) => {
          return {
            ...data.questions,
            keyID: `easy_${index}`,
            category: skillData.skill,
          };
        });
      obj.mediumQuestion.question = createTestContext.question
        .filter((data) => {
          //const skillExits = data.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            data.questions.difficultyLevelId.level === "medium" &&
            data.skillId === skillData.skillId &&
            data.questions.type === skillData.questionType
          );
        })
        .map((data, index) => {
          return {
            ...data.questions,
            keyID: `medium_${index}`,
            category: skillData.skill,
          };
        });

      obj.hardQuestion.question = createTestContext.question
        .filter((data) => {
          //const skillExits = data.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            data.questions.difficultyLevelId.level === "hard" &&
            data.skillId === skillData.skillId &&
            data.questions.type === skillData.questionType
          );
        })
        .map((data, index) => {
          return {
            ...data.questions,
            keyID: `hard_${index}`,
            category: skillData.skill,
          };
        });

      if (checkForQestion) {
        if (obj.easyQuestion.question.length > 0) {
          obj.easyQuestion.isPreviewQuestion = true;
        } else if (obj.mediumQuestion.question.length > 0) {
          obj.mediumQuestion.isPreviewQuestion = true;
        } else if (obj.hardQuestion.question.length > 0) {
          obj.hardQuestion.isPreviewQuestion = true;
        }
      }
      setcheckForQestion(false);
      createTestContext.setquestionOverview(obj);
    });
  }, [createTestContext.question, createTestContext.addedSkills]);

  useEffect(() => {
    const debounce = setTimeout(() => {}, 500);
    return () => clearTimeout(debounce);
  }, [questionEditedScore, selectedQuestionData]);

  const onChangeQuestionScore = (e, data) => {
    if (previousScore === null) {
      setpreviousScore(data.score);
    }
    setselectedQuestionData(data);
    setquestionEditedScore(e.target.value);
    data.score = parseInt(e.target.value.slice(0, 3));
    setupdateRefresh();
  };

  const onBlurQuestionScore = (e, data) => {
    if (e.target.value === "") {
      toast.error("Score should not be blank!");
      data.score = previousScore;
      setupdateRefresh({});
      return;
    }
    if (e.target.value === "0" || parseInt(e.target.value) < 0) {
      toast.error("Score should be greater than zero");
      data.score = previousScore;
      setupdateRefresh({});
      return;
    }

    if (/^0+$|^0*-0+$/.test(e.target.value)) {
      toast.error("Score should be greater than zero");
      data.score = previousScore;
      setupdateRefresh({});
      return;
    }
    updateQuestionUserScore(
      data._id,
      data.keyID,
      parseInt(e.target.value.slice(0, 3))
    );
  };

  const onClickEditSave = async (updatedQuestion, questionSkill) => {
    setUpdatedQuestion(updatedQuestion);
    console.log(questionSkill);
    await deleteSingleQuestion(selectedQuestion, true);
    await updateQuestion(updatedQuestion, questionSkill);
    seteditQuestion(false);
  };

  const closeButton = () => {
    setDeleteSkillSetModel(false);
  };

  const multipleCloseButton = () => {
    setmultipleDelete(false);
    setSelected([]);
    setselectAllCheck(false);
  };

  let arr = [];
  const selectAll = (length) => {
    setselectAllCheck(true);

    if (selected.length === length) {
      return arr;
    }

    for (let i = 1; i <= length; i++) {
      arr.push(i);
    }
    return arr;
  };

  const removeCheck = (val) => {
    setSelected((selected) =>
      selected.filter((data) => {
        return data !== val;
      })
    );
  };

  const setCheck = (val) => {
    setSelected([...selected, val]);
  };

  const getTotalQuestionScoreSkillWise = (skills, type) => {
    const skillsExits = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);

    const questions = createTestContext.question.filter((question) => {
      //const skillExits = question.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
      return (
        question?.questions?.type === type &&
        question.skillId ===
          createTestContext.addedSkills
            .filter((data) => data.skill === skills)
            .map((data) => data.skillId)[0] &&
        !skillsExits.includes(question.skillId)
      );
    });

    // Replace empty score values with 0
    const scores = questions.map((question) => question.questions.score || 0);

    // Sum the scores using reduce
    let totalScore = scores.reduce((total, score) => total + score, 0);
    if (skillsExits.length) {
      createTestContext.addedSkills.forEach((data) => {
        if (
          data.questionType === type &&
          data.skillId ===
            createTestContext.addedSkills
              .filter((data) => data.skill === skills)
              .map((data) => data.skillId)[0]
        ) {
          totalScore =
            totalScore +
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
        }
      });
    }
    return totalScore;
  };

  const getTotalMCQQuestionScore = () => {
    const skills = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);

    let toalMCQQuestionScore = createTestContext.question.reduce(
      (totalScore, question) => {
        if (
          question.questions.type === "MCQ" &&
          !skills.includes(question.skillId)
        ) {
          totalScore += question.questions.score;
        }
        return totalScore;
      },
      0
    );
    if (skills.length) {
      createTestContext.addedSkills.forEach((data) => {
        if (data.questionType === "MCQ") {
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
        }
      });
    }

    return toalMCQQuestionScore;
  };

  const getTotalProgrammingQuestionScore = () => {
    const skills = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);

    const toalProgrammingQuestionScore = createTestContext.question.reduce(
      (totalScore, question) => {
        if (
          question.questions.type === "Programming" &&
          !skills.includes(question.skillId)
        ) {
          totalScore += question.questions.score;
        }
        return totalScore;
      },
      0
    );

    if (skills.length) {
      createTestContext.addedSkills.forEach((data) => {
        if (data.questionType === "Programming") {
          toalProgrammingQuestionScore =
            toalProgrammingQuestionScore +
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
        }
      });
    }
    return toalProgrammingQuestionScore;
  };

  const selectAllQuestionAsPerLevel = (e, skill, level, state) => {
    e.stopPropagation();
    createTestContext.questionOverview.forEach((data) => {
      if (level === "easy" && data.skillName === skill) {
        // data.mediumQuestion.isSelectAll = false
        // data.hardQuestion.isSelectAll = false
        data.easyQuestion.isSelectAll = state;
        data.easyQuestion.question.forEach((data) => {
          data.category === skill && (data.selected = state);
        });
      }

      if (level === "medium" && data.skillName === skill) {
        // data.easyQuestion.isSelectAll = false
        // data.hardQuestion.isSelectAll = false
        data.mediumQuestion.isSelectAll = state;
        data.mediumQuestion.question.forEach((data) => {
          data.category === skill && (data.selected = state);
        });
      }

      if (level === "hard" && data.skillName === skill) {
        // data.mediumQuestion.isSelectAll = false
        // data.easyQuestion.isSelectAll = false
        data.hardQuestion.isSelectAll = state;
        data.hardQuestion.question.forEach((data) => {
          data.category === skill && (data.selected = state);
        });
      }
    });
    setupdateRefresh({});
  };

  const clickedLevel = (e, level, skill) => {
    e.stopPropagation();
    createTestContext.questionOverview.forEach((data) => {
      if (level === "easy" && data.skillName === skill) {
        data.mediumQuestion.isPreviewQuestion = false;
        data.hardQuestion.isPreviewQuestion = false;
        data.easyQuestion.isPreviewQuestion = true;
      }

      if (level === "medium" && data.skillName === skill) {
        data.easyQuestion.isPreviewQuestion = false;
        data.hardQuestion.isPreviewQuestion = false;
        data.mediumQuestion.isPreviewQuestion = true;
      }

      if (level === "hard" && data.skillName === skill) {
        data.mediumQuestion.isPreviewQuestion = false;
        data.easyQuestion.isPreviewQuestion = false;
        data.hardQuestion.isPreviewQuestion = true;
      }
    });
    setpreviousScore(null);
    setupdateRefresh({});
  };

  const selectSingleQuestion = (e, level, skill, id, key, state) => {
    e.stopPropagation();
    createTestContext.questionOverview.forEach((data) => {
      if (level === "easy" && data.skillName === skill) {
        data.easyQuestion.question.forEach((question) => {
          question._id === id &&
            question.keyID === key &&
            (question.selected = state);
        });
      }

      if (level === "medium" && data.skillName === skill) {
        data.mediumQuestion.question.forEach((question) => {
          question._id === id &&
            question.keyID === key &&
            (question.selected = state);
        });
      }

      if (level === "hard" && data.skillName === skill) {
        data.hardQuestion.question.forEach((question) => {
          question._id === id &&
            question.keyID === key &&
            (question.selected = state);
        });
      }
    });
    setupdateRefresh({});
  };

  const checkIsRemoveQuestionButtonActive = (skill, level) => {
    let cnt = 0;
    createTestContext.questionOverview.forEach((data) => {
      if (level === "easy" && data.skillName === skill) {
        data.easyQuestion.question.forEach((data1) => {
          if (
            data1.selected &&
            (data.type === data.filterType || data.filterType === "all")
          ) {
            cnt = cnt + 1;
          }
        });
      }

      if (level === "medium" && data.skillName === skill) {
        data.mediumQuestion.question.forEach((data1) => {
          if (
            data1.selected &&
            (data.type === data.filterType || data.filterType === "all")
          ) {
            cnt = cnt + 1;
          }
        });
      }

      if (level === "hard" && data.skillName === skill) {
        data.hardQuestion.question.forEach((data1) => {
          if (
            data1.selected &&
            (data.type === data.filterType || data.filterType === "all")
          ) {
            cnt = cnt + 1;
          }
        });
      }
    });

    return cnt;
  };

  const deleteSingleQuestion = async (question, hideMessage = false) => {
    const token = getCookie("Xh7ERL0G");
    const filterDeletedData = createTestContext.question.filter(
      (data) => data.questions._id !== question._id
    );

    const res = await axios.put(
      `${backend_url}question/updateQuestion/${question._id}`,
      {
        ...question,
        noOfTimesUsed: question.noOfTimesUsed,
      },
      { headers: { token: token } }
    );

    createTestContext.addDeleteQuestionData(filterDeletedData);
    closeButton();
    createTestContext.questionOverview.forEach((data) => {
      const filterEasyDeletedData = data.easyQuestion.question.filter(
        (data) => data._id !== question._id
      );
      const filterMediumDeletedData = data.mediumQuestion.question.filter(
        (data) => data._id !== question._id
      );

      const filterHardDeletedData = data.hardQuestion.question.filter(
        (data) => data._id !== question._id
      );

      createTestContext.addedSkills.forEach((skillData) => {
        if (
          skillData.skill === deleteSingleObject.skill &&
          skillData.questions > 0
        ) {
          const level = skillData?.level.split(",");
          let easyQuestion =
            parseInt(level[0]?.replace(/\D/g, "")) -
            parseInt(
              data.easyQuestion.question.filter(
                (data) => data._id === question._id
              ).length
            );
          let mediumQuestion =
            parseInt(level[1]?.replace(/\D/g, "")) -
            parseInt(
              data.mediumQuestion.question.filter(
                (data) => data._id === question._id
              ).length
            );
          let hardQuestion =
            parseInt(level[2]?.replace(/\D/g, "")) -
            parseInt(
              data.hardQuestion.question.filter(
                (data) => data._id === question._id
              ).length
            );

          skillData.level = `Easy(${easyQuestion}), Medium(${mediumQuestion}), Hard(${hardQuestion})`;
          skillData.questions =
            parseInt(skillData.questions) -
            parseInt(
              data.easyQuestion.question.filter(
                (data) => data._id === question._id
              ).length > 0
                ? data.easyQuestion.question.filter(
                    (data) => data._id === question._id
                  ).length
                : data.mediumQuestion.question.filter(
                    (data) => data._id === question._id
                  ).length > 0
                ? data.mediumQuestion.question.filter(
                    (data) => data._id === question._id
                  ).length
                : data.hardQuestion.question.filter(
                    (data) => data._id === question._id
                  ).length
            );
        }
      });

      createTestContext.addDeletedSkillData(createTestContext.addedSkills);
      data.easyQuestion.question = filterEasyDeletedData;
      data.mediumQuestion.question = filterMediumDeletedData;
      data.hardQuestion.question = filterHardDeletedData;
    });
    !hideMessage && toast.success("question delete successfully.");
    setupdateRefresh({});
    removeSkillIfNoQuestions();
    // clickedLevel("", deleteSingleObject.level, deleteSingleObject.skill);
  };

  const removeSkillIfNoQuestions = () => {
    const updatedSkills = createTestContext.addedSkills.filter(
      (skill) => skill.questions > 0
    );
    createTestContext.addDeletedSkillData(updatedSkills);
  };

  const checkSearchedSkillAddedOrNot = (skill, type) => {
    let isSkillExists = false;
    let searchSkill = skill
      ?.flatMap((data) => data?.skills?.skills)
      .filter(Boolean);

    isSkillExists = createTestContext.addedSkills.some((skillData) => {
      return (
        searchSkill.includes(skillData.skill) && skillData.questionType === type
      );
    });

    return isSkillExists;
  };

  const createSkillObject = async (skillName, type, skillId) => {
    const objForQuestionOverView = {
      skillName: skillName,
      totalNoOfQuestion: 0,
      totalScore: 0,
      type: type,
      filterType: "all",
      isChooseFromLibraryAdded: true,
      easyQuestion: {
        isPreviewQuestion: true,
        isSelectAll: false,
        question: [],
      },
      mediumQuestion: {
        isPreviewQuestion: false,
        isSelectAll: false,
        question: [],
      },
      hardQuestion: {
        isPreviewQuestion: false,
        isSelectAll: false,
        question: [],
      },
    };

    createTestContext.setquestionOverview(objForQuestionOverView);

    const objForSkillAdded = {
      skillId: skillId,
      skill: skillName,
      questionType: type,
      level: "Easy (0}), Medium (0}), Hard (0)",
      questions: 0,
      score: 0,
      random: false,
      isChooseFromLibraryAdded: true,
    };

    createTestContext.setAddedSkills(objForSkillAdded);
    //return both objects
    return { objForQuestionOverView, objForSkillAdded };
  };

  const updateQuestion = async (question, questionSkill) => {
    let searchSkill = [questionSkill];
    console.log(searchSkill);
    createTestContext.setQuestions({
      skillId: createTestContext.addedSkills
        .filter((data) => data.skill === searchSkill[0])
        .map((data) => data.skillId)[0],
      questions: question,
    });
    const token = getCookie("Xh7ERL0G");
    const res = await axios.put(
      `${backend_url}question/updateQuestion/${question._id}`,
      {
        ...question,
        noOfTimesUsed:
          question.noOfTimesUsed > 0 ? question.noOfTimesUsed - 1 : 0,
      },
      { headers: { token: token } }
    );
    //addMissingSkills(searchSkill,createTestContext.addedSkills)
    createTestContext.addedSkills.forEach((skillData) => {
      if (
        searchSkill.includes(skillData.skill) &&
        createTestContext.addedSkills
          .filter((data) => data.skill === searchSkill[0])
          .map((data) => data.skillId)[0] === skillData.skillId &&
        skillData.questionType === question.type
      ) {
        const level = skillData?.level.split(",");
        let easyQuestion = parseInt(level[0]?.replace(/\D/g, ""));
        let mediumQuestion = parseInt(level[1]?.replace(/\D/g, ""));
        let hardQuestion = parseInt(level[2]?.replace(/\D/g, ""));
        if (question.difficultyLevelId.level === "easy") {
          easyQuestion = easyQuestion;
        }
        if (question.difficultyLevelId.level === "medium") {
          mediumQuestion = mediumQuestion;
        }
        if (question.difficultyLevelId.level === "hard") {
          hardQuestion = hardQuestion;
        }

        skillData.level = `Easy(${easyQuestion}), Medium(${mediumQuestion}), Hard(${hardQuestion})`;
        skillData.questions = parseInt(skillData.questions);
      }
    });
    createTestContext.addDeletedSkillData(createTestContext.addedSkills);

    createTestContext.questionOverview.forEach((data) => {
      if (
        searchSkill.includes(data.skillName) &&
        createTestContext.addedSkills
          .filter((data) => data.skill === searchSkill[0])
          .map((data) => data.skill)[0] === data.skillName &&
        data.totalNoOfQuestion > 0
      ) {
        if (question.difficultyLevelId.level === "easy") {
          data.totalNoOfQuestion = data.totalNoOfQuestion;
          data.totalScore = data.totalScore + question.score;
          data.easyQuestion.question.push(question);
        }

        if (question.difficultyLevelId.level === "medium") {
          data.totalNoOfQuestion = data.totalNoOfQuestion;
          data.totalScore = data.totalScore + question.score;
          data.mediumQuestion.question.push(question);
        }

        if (question.difficultyLevelId.level === "hard") {
          data.totalNoOfQuestion = data.totalNoOfQuestion;
          data.totalScore = data.totalScore + question.score;
          data.hardQuestion.question.push(question);
        }
      }
    });
    createTestContext.setFilterQuestionOverview(
      createTestContext.questionOverview
    );
    toast.success("Question Updated Successfully");
  };

  const deleteMutipleQuestion = (level, skill) => {
    createTestContext.questionOverview.forEach((data) => {
      if (level === "easy" && data.skillName === skill) {
        const filterQuestionId = data.easyQuestion.question
          .filter((item) => item.selected)
          .map((data) => data._id);
        const filterQuestions = data.easyQuestion.question
          .filter((item) => item.selected)
          .map((data) => data);

        const filterDeletedData = createTestContext.question.filter(
          (data) => !filterQuestionId.includes(data.questions._id)
        );
        const token = getCookie("Xh7ERL0G");

        filterQuestions.forEach(async (question) => {
          const res = await axios.put(
            `${backend_url}question/updateQuestion/${question._id}`,
            {
              ...question,
              noOfTimesUsed: question.noOfTimesUsed,
            },
            { headers: { token: token } }
          );
        });

        createTestContext.addDeleteQuestionData(filterDeletedData);
        createTestContext.addedSkills.forEach((data) => {
          if (data.skill === skill && data.questions > 0) {
            const level = data?.level.split(",");
            let easyQuestion =
              parseInt(level[0]?.replace(/\D/g, "")) -
              parseInt(filterQuestionId.length);
            data.level = `Easy(${easyQuestion}), Medium(${level[1]?.replace(
              /\D/g,
              ""
            )}), Hard(${level[2]?.replace(/\D/g, "")})`;
            data.questions =
              parseInt(data.questions) - parseInt(filterQuestionId.length);
          }
        });

        createTestContext.addDeletedSkillData(createTestContext.addedSkills);
        const filterEasyDeletedData = data.easyQuestion.question.filter(
          (data) => data.selected !== true
        );
        data.easyQuestion.question = filterEasyDeletedData;
      }

      if (level === "medium" && data.skillName === skill) {
        const filterQuestionId = data.mediumQuestion.question
          .filter((item) => item.selected)
          .map((data) => data._id);

        const filterQuestions = data.easyQuestion.question
          .filter((item) => item.selected)
          .map((data) => data);

        const filterDeletedData = createTestContext.question.filter(
          (data) => !filterQuestionId.includes(data.questions._id)
        );
        createTestContext.addDeleteQuestionData(filterDeletedData);

        const token = getCookie("Xh7ERL0G");

        filterQuestions.forEach(async (question) => {
          const res = await axios.put(
            `${backend_url}question/updateQuestion/${question._id}`,
            {
              ...question,
              noOfTimesUsed: question.noOfTimesUsed,
            },
            { headers: { token: token } }
          );
        });

        createTestContext.addedSkills.forEach((data) => {
          if (data.skill === skill && data.questions > 0) {
            const level = data?.level.split(",");
            let mediumQuestion =
              parseInt(level[1]?.replace(/\D/g, "")) -
              parseInt(filterQuestionId.length);
            data.level = `Easy(${parseInt(
              level[0]?.replace(/\D/g, "")
            )}), Medium(${mediumQuestion}), Hard(${level[2]?.replace(
              /\D/g,
              ""
            )})`;
            data.questions =
              parseInt(data.questions) - parseInt(filterQuestionId.length);
          }
        });

        createTestContext.addDeletedSkillData(createTestContext.addedSkills);
        const filterMediumDeletedData = data.mediumQuestion.question.filter(
          (data) => data.selected !== true
        );
        data.mediumQuestion.question = filterMediumDeletedData;
      }

      if (level === "hard" && data.skillName === skill) {
        const filterQuestionId = data.hardQuestion.question
          .filter((item) => item.selected)
          .map((data) => data._id);

        const filterQuestions = data.hardQuestion.question
          .filter((item) => item.selected)
          .map((data) => data);

        const filterDeletedData = createTestContext.question.filter(
          (data) => !filterQuestionId.includes(data.questions._id)
        );
        createTestContext.addDeleteQuestionData(filterDeletedData);

        const token = getCookie("Xh7ERL0G");

        filterQuestions.forEach(async (question) => {
          const res = await axios.put(
            `${backend_url}question/updateQuestion/${question._id}`,
            {
              ...question,
              noOfTimesUsed: question.noOfTimesUsed,
            },
            { headers: { token: token } }
          );
        });

        createTestContext.addedSkills.forEach((data) => {
          if (data.skill === skill && data.questions > 0) {
            const level = data?.level.split(",");
            let hardQuestion =
              parseInt(level[2]?.replace(/\D/g, "")) -
              parseInt(filterQuestionId.length);
            data.level = `Easy(${parseInt(
              level[0]?.replace(/\D/g, "")
            )}), Medium(${parseInt(
              level[1]?.replace(/\D/g, "")
            )}), Hard(${hardQuestion})`;
            data.questions =
              parseInt(data.questions) - parseInt(filterQuestionId.length);
          }
        });

        createTestContext.addDeletedSkillData(createTestContext.addedSkills);
        const filterHardDeletedData = data.hardQuestion.question.filter(
          (data) => data.selected !== true
        );
        data.hardQuestion.question = filterHardDeletedData;
      }
    });
    toast.success("question delete successfully.");
    setupdateRefresh({});
    multipleCloseButton();
    removeSkillIfNoQuestions();
  };

  const updateTestSummaryData = async () => {
    try {
      let skillItems = [];
      createTestContext.questionOverview.forEach((data) => {
        const obj = {
          skill_id: "",
          question_type: "",
          easy_question: [],
          medium_question: [],
          hard_question: [],
          isRandom: false,
          score: 0,
        };
        const skillId = createTestContext.addedSkills.filter(
          (skillItem) => skillItem.skill === data.skillName
        );

        obj.skill_id = skillId[0]?.skillId;
        obj.question_type = data.type;
        obj.easy_question = data.random
          ? data.level?.split(",")[0]?.replace(/\D/g, "")
          : data.easyQuestion.question;
        obj.medium_question = data.random
          ? data.level?.split(",")[1]?.replace(/\D/g, "")
          : data.mediumQuestion.question;
        obj.hard_question = data.random
          ? data.level?.split(",")[2]?.replace(/\D/g, "")
          : data.hardQuestion.question;
        obj.isRandom = data.random;
        obj.score = data.totalScore;

        skillItems.push(obj);
      });
      const isAllSkillsetRandom = createTestContext.addedSkills.filter(
        (data) => data.random === true
      );

      const token = getCookie("Xh7ERL0G");
      const res = await axios.put(
        `${backend_url}testsummary/update/${createTestContext.testSummaryId}`,
        {
          skills: skillItems,
          testId: createTestContext.testId,
          name: createTestContext.testHeading,
          isRandomAll:
            isAllSkillsetRandom.length === createTestContext.addedSkills.length
              ? true
              : false,
        },
        { headers: { token: token } }
      );
      navigate("/testsettings");
    } catch (error) {
      toast.error(error);
    }
  };

  const saveAsDraft = async () => {
    setloading(true);
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
          name: `${testName[0].jobrole} test`,
          description: `${testName[0].jobrole} description`,
          jobRole: testName[0]._id,
          createdBy: decode.user_id,
          creationDateTime: new Date(),
          experience: createTestContext.experience,
          startDate: createTestContext.startDate,
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
          html: "",
          image: "",
        },
        { headers: { token: token } }
      );
      setloading(false);
      toast.success("assessment is saved as draft");
      createTestContext.clearState();
      navigate("/assessment");
    } catch (error) {
      toast.error(`${error}`);
      setloading(false);
    }
  };

  const updateQuestionUserScore = async (id, key, score) => {
    try {
      if (score === previousScore) {
        return;
      }
      if (score === 0) {
        toast.error("score should not be zero");
      } else if (score === "") {
        toast.error("score should not be black");
      } else if (score < 0) {
        toast.error("score should be greater than zero");
      } else {
        if (cancelToken) {
          //cancelToken.cancel("Operations cancelled due to new request");
        }
        cancelToken = axios.CancelToken.source();

        const token = getCookie("Xh7ERL0G");
        await axios.put(
          `${backend_url}question/updateUserScore/${id}`,
          { userScore: score },
          { cancelToken: cancelToken.token, headers: { token: token } }
        );
        toast.success("score is updated...");
        createTestContext.questionOverview.forEach((skillData) => {
          const isEasyQuestionExits = skillData.easyQuestion.question.map(
            (data) => data._id
          );
          const isMediumQuestionExits = skillData.easyQuestion.question.map(
            (data) => data._id
          );
          const isHardQuestionExits = skillData.easyQuestion.question.map(
            (data) => data._id
          );
          const AllQuestion = createTestContext.question.map(
            (data) => data.questions._id
          );
          if (AllQuestion.includes(id)) {
            createTestContext.question.forEach((data) => {
              if (data.questions._id === id) {
                data.questions.score = score;
              }
            });
            createTestContext.addDeleteQuestionData(createTestContext.question);
          }
          if (isEasyQuestionExits.includes(id)) {
            skillData.easyQuestion.question.forEach((data) => {
              if (data._id === id && data.keyID === key) {
                data.score = score;
              }
            });
          }
          if (isMediumQuestionExits.includes(id)) {
            skillData.mediumQuestion.question.forEach((data) => {
              if (data._id === id && data.keyID === key) {
                data.score = score;
              }
            });
          }
          if (isHardQuestionExits.includes(id)) {
            skillData.hardQuestion.question.forEach((data) => {
              if (data._id === id && data.keyID === key) {
                data.score = score;
              }
            });
          }
        });
        setpreviousScore(null);
        createTestContext.setFilterQuestionOverview(
          createTestContext.questionOverview
        );
        setupdateRefresh({});
        settotalScore(
          parseInt(getTotalMCQQuestionScore()) +
            parseInt(getTotalProgrammingQuestionScore())
        );
      }
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const navigatePage = (page) => {
    navigate(page);
    createTestContext.clearState();
  };

  const getSelectedQuestionCount = (level, skill) => {
    let count = 0;
    createTestContext.questionOverview.forEach((data) => {
      if (level === "easy" && data.skillName === skill) {
        data.easyQuestion.question.forEach((question) => {
          if (question.selected) {
            count = count + 1;
          }
        });
      }

      if (level === "medium" && data.skillName === skill) {
        data.mediumQuestion.question.forEach((question) => {
          if (question.selected) {
            count = count + 1;
          }
        });
      }

      if (level === "hard" && data.skillName === skill) {
        data.hardQuestion.question.forEach((question) => {
          if (question.selected) {
            count = count + 1;
          }
        });
      }
    });
    return count;
  };

  const truncateQuestionContent = (questionContent) => {
    if (questionContent?.length > 84) {
      return questionContent.substring(0, 84) + "...";
    }
    return questionContent;
  };

  return (
    <div className="create-test3-container">
      {/* <Navbar /> */}
      {addMutipleSkillModal ? (
        <AddMultipleSkill
          closeMutipleSkillModal={() => {
            setselectMutipleQuestion([]);
            setaddMutipleSkillModal(false);
          }}
          skills={selectedMutipleObjectSkillAdd}
          question={selectMutipleQuestion}
          clearSelectedMutipleQuestion={() => {
            setselectMutipleQuestion([]);
            createTestContext.addDeletedSkillData(
              createTestContext.addedSkills.filter(
                (v, i, a) => a.findIndex((v2) => v2.skillId === v.skillId) === i
              )
            );
          }}
        />
      ) : (
        <></>
      )}
      {duration && (
        <TestDuration
          changeTestTime={(score) => {
            settotalScore(score);
            setDuration(false);
          }}
          testTime={totalScore}
          closeButton={() => {
            setDuration(false);
          }}
          score={true}
        />
      )}
      {deleteSkillSetModel && (
        <DeleteSkillSetModel
          onClickNo={closeButton}
          onClickYes={() => deleteSingleQuestion(selectedQuestion)}
          problem={true}
          skill={selectedSkill}
          selectedQuestion={selectedQuestion}
          closeButton={closeButton}
        />
      )}
      {multipleDelete && (
        <DeleteSkillSetModel
          selectedSkill={deleteMutipleObject.skill}
          header={`Do you want to remove ${getSelectedQuestionCount(
            deleteMutipleObject.level,
            deleteMutipleObject.skill
          )} ${deleteMutipleObject.level} questions from ${
            deleteMutipleObject.skill
          } skillset? `}
          onClickYes={() =>
            deleteMutipleQuestion(
              deleteMutipleObject.level,
              deleteMutipleObject.skill
            )
          }
          onClickNo={multipleCloseButton}
          closeButton={multipleCloseButton}
          multiple={selected.length}
          problem={true}
        />
      )}
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
      {isNavItem ? (
        <TestCreationDataLossPopup
          closeButton={() => setisNavItem(false)}
          onClickNo={() => setisNavItem(false)}
          onClickYes={() => navigatePage(selectedNavItem)}
        />
      ) : (
        <></>
      )}

      <div className="create-test3">
        {openPreview ? (
          <QuestionPreviewModel
            onClickEdit={() => {
              setquestionPreview(false);
              seteditQuestion(true);
            }}
            selectedQuestionIndex={selectedQuestionIndex}
            data={selectedQuestion}
            onClickCancel={() => {
              setOpenPreview(false);
              setselectedQuestionIndex("");
            }}
          />
        ) : null}
        {editQuestion && (
          <EditQuestionModel
            selectedQuestionIndex={selectedQuestionIndex}
            data={selectedQuestion}
            onClickCancel={() => seteditQuestion(false)}
            onClickSave={(data) => onClickEditSave(data, selectedSkill)}
          />
        )}

        {isCreateQuestion ? (
          <AddQuestionPopup
            saveQuestionClick={(data) => {
              data.data.skillsId.forEach((skills) => {
                setselectedMutipleObjectSkillAdd((prev) => [...prev, skills]);
              });
              setselectMutipleQuestion((prev) => [...prev, data.data]);
              setaddMutipleSkillModal(true);
              setisCreateQuestion(false);
            }}
            closequestionPopUp={() => setisCreateQuestion(false)}
            closeQuestionTypeModel={() => setisCreateQuestion(false)}
          />
        ) : (
          <></>
        )}
        <div className="left-content">
          <CreateTest3Sidebar />
        </div>
        <div className="create-test3-content">
          <div className="test3-content">
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
                    <span>Questions Overview</span>
                    <p>Overview of all questions from skillset</p>
                  </div>
                </div>

                <div className="button-container-of-question-overview">
                  <div
                    className="back-button"
                    onClick={() => {
                      navigate("/testsummary", { state: { navigate: "true" } });
                    }}
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
                      updateTestSummaryData();
                    }}
                  >
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
                  </div>
                </div>
              </div>

              <div className="header-bar"></div>
            </div>

            <div className="buttons-container">
              <div className="score-group">
                <span>Test Score: {totalScore}</span>
                {/* <svg style={{ cursor: "pointer" }} onClick={() => { setDuration(true) }} width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11" cy="11" r="11" fill="#00C49A" />
                                    <path d="M13.4356 6.37944C13.7173 6.09772 14.0994 5.93945 14.4978 5.93945C14.8962 5.93945 15.2783 6.09772 15.56 6.37944C15.8417 6.66116 16 7.04325 16 7.44166C16 7.84008 15.8417 8.22217 15.56 8.50389L8.8326 15.2313L6 15.9395L6.70815 13.1069L13.4356 6.37944Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> */}
              </div>
              <div className="buttons-group">
                <div
                  className="Choose-From-Library"
                  onClick={() => {
                    navigate("/choosefromlibrary?isOverview=true");
                  }}
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10.3955" r="10" fill="white" />
                    <path
                      d="M7.31092 6.39965C6.92633 6.39064 6.54154 6.40162 6.15811 6.43267C5.85899 6.42648 5.57028 6.54244 5.35866 6.75399C5.14703 6.96545 5.03081 7.25411 5.03684 7.55319C5.00576 7.93661 4.99474 8.32144 5.00379 8.70599V11.3958C5.00379 12.2604 4.94999 12.0034 5.2478 12.4438C5.406 12.6587 5.63916 12.8063 5.90106 12.8573C6.11623 12.8999 6.33497 12.9218 6.55431 12.9229C6.55892 13.0612 6.56353 13.198 6.57698 13.3159C6.57075 13.615 6.68678 13.9038 6.89826 14.1154C7.10974 14.3271 7.39839 14.4432 7.6975 14.4372C7.90192 14.4603 8.14823 14.4656 8.4203 14.468C8.43473 14.4692 8.44923 14.4697 8.46371 14.4693L12.6906 14.4692C13.0752 14.4782 13.46 14.4672 13.8434 14.4362C14.1425 14.4422 14.4312 14.326 14.6427 14.1144C14.8541 13.9028 14.9702 13.614 14.9639 13.3149C14.9949 12.9315 15.006 12.5468 14.997 12.1621V11.3936C14.9971 11.3783 14.9964 11.363 14.9947 11.3479C14.9924 11.0766 14.987 10.8307 14.9639 10.6267C14.9701 10.3276 14.854 10.0389 14.6425 9.82726C14.4311 9.61571 14.1425 9.49947 13.8434 9.50538C13.7247 9.49197 13.5871 9.48775 13.448 9.48305C13.4556 9.45106 13.4591 9.41832 13.4584 9.38549C13.4658 9.07843 13.4426 8.77138 13.3892 8.46892C13.342 8.20455 13.1977 7.96748 12.9846 7.80415C12.5446 7.49681 12.7963 7.55104 11.9225 7.55104H10.9026C10.5235 7.57252 10.1438 7.52167 9.78367 7.40112C9.63149 7.3362 9.49899 7.23254 9.39941 7.10035C9.22044 6.88833 8.99525 6.72021 8.74115 6.60886C8.29198 6.44843 7.8158 6.37732 7.33935 6.39946V6.39946H7.31245L7.31092 6.39965ZM7.31045 7.16811C7.69424 7.14654 8.07865 7.19738 8.44365 7.31794C8.59707 7.38239 8.73071 7.48633 8.83099 7.61917C9.00846 7.83063 9.23189 7.99875 9.48424 8.11067C9.93847 8.27381 10.4206 8.34511 10.9026 8.32044H11.9216C12.7947 8.32044 12.4627 8.37889 12.5422 8.43574C12.5806 8.46379 12.6045 8.48415 12.6367 8.63406C12.6762 8.88577 12.6936 9.14047 12.6886 9.39527C12.6886 9.42192 12.6913 9.44837 12.6967 9.47445H12.4385C12.0593 9.49603 11.6796 9.44518 11.3195 9.32472C11.1672 9.25962 11.0347 9.15567 10.9352 9.02339C10.7563 8.81137 10.5311 8.64316 10.277 8.5318C9.82735 8.37166 9.35083 8.30055 8.87403 8.3225H8.84713C8.46254 8.31359 8.07776 8.32475 7.69434 8.3559C7.39523 8.34971 7.1065 8.46566 6.89487 8.67722C6.68324 8.88867 6.56702 9.17734 6.57305 9.47642C6.54197 9.85984 6.53094 10.2446 6.54 10.6292V12.1544C6.38245 12.1516 6.22534 12.1368 6.07005 12.1101C5.92749 12.0775 5.91135 12.0572 5.8833 12.0156C5.8272 11.9326 5.77148 12.262 5.77148 11.3977V8.70789C5.77148 8.22869 5.77379 7.87519 5.79992 7.64235C5.82605 7.4095 5.87101 7.33032 5.90137 7.29992C5.93173 7.26953 6.01011 7.22572 6.24298 7.19964C6.47586 7.17356 6.83166 7.16811 7.31045 7.16811V7.16811ZM8.84907 9.0895C9.23284 9.06802 9.61725 9.11877 9.98226 9.23932C10.1356 9.30358 10.2693 9.40744 10.3696 9.54009C10.547 9.75164 10.7705 9.91976 11.0229 10.0317C11.477 10.1952 11.9591 10.2666 12.4412 10.242L12.6917 10.2419C13.1709 10.2419 13.5248 10.2443 13.7573 10.2703C13.9898 10.2964 14.0693 10.3415 14.0997 10.3718C14.13 10.4021 14.1742 10.4805 14.2003 10.7133C14.2265 10.9462 14.2288 11.3001 14.2288 11.7789V12.1631C14.2288 12.642 14.2265 12.9966 14.2003 13.2291C14.1742 13.4615 14.13 13.5403 14.0997 13.5703C14.0693 13.6002 13.9901 13.6471 13.7573 13.6717C13.5244 13.6963 13.1709 13.6997 12.6917 13.6997H8.84907C8.36989 13.6997 8.01598 13.6974 7.7835 13.6717C7.55101 13.646 7.47147 13.6006 7.44112 13.5703C7.41077 13.54 7.36657 13.4612 7.34045 13.2291C7.31432 12.997 7.31201 12.6421 7.31201 12.1636V10.6266C7.31201 10.1477 7.31432 9.79348 7.34045 9.56139C7.36657 9.32929 7.41154 9.24936 7.4419 9.21859C7.47226 9.18782 7.55103 9.14438 7.78351 9.1183C8.01599 9.09222 8.37027 9.0895 8.84907 9.0895V9.0895Z"
                      fill="#FF6812"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <span>Choose From Library</span>
                </div>
                <div
                  className="Create-New-Question"
                  onClick={() => {
                    //navigate("/newquestion");
                    setisCreateQuestion(true);
                  }}
                >
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10.3955" r="10" fill="white" />
                    <path
                      d="M10 6.89551V13.8955"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.5 10.3955H13.5"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <span>Create New Question</span>
                </div>
              </div>
            </div>
            {/* {createTestContext.addedSkills.map((skillData) => {
                            return (
                                skillData.questions > 0 ?
                                    <div className="question-container">
                                        <div className="question-title">
                                            <span><svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.7254 9.94163L8.94536 14.7216C8.82153 14.8456 8.67448 14.9439 8.51262 15.011C8.35075 15.0781 8.17725 15.1127 8.00203 15.1127C7.82681 15.1127 7.65331 15.0781 7.49144 15.011C7.32958 14.9439 7.18253 14.8456 7.0587 14.7216L1.33203 9.00163V2.33496H7.9987L13.7254 8.06163C13.9737 8.31144 14.1131 8.64938 14.1131 9.00163C14.1131 9.35387 13.9737 9.69181 13.7254 9.94163V9.94163Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M4.66797 5.66895H4.67422" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                                {skillData.skill} Skillset ({skillData.questions})
                                            </span>
                                            <p><svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.3 0.501953H12.7C13.0448 0.501953 13.3754 0.654135 13.6192 0.925021C13.863 1.19591 14 1.56331 14 1.9464V6.27973C14 8.19518 13.3152 10.0322 12.0962 11.3866C10.8772 12.741 9.22391 13.502 7.5 13.502C6.64641 13.502 5.80117 13.3151 5.01256 12.9522C4.22394 12.5892 3.50739 12.0573 2.90381 11.3866C1.68482 10.0322 1 8.19518 1 6.27973V1.9464C1 1.56331 1.13696 1.19591 1.38076 0.925021C1.62456 0.654135 1.95522 0.501953 2.3 0.501953V0.501953Z" stroke="#353537" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M4.91016 5.55859L7.51016 8.44748L10.1102 5.55859" stroke="#353537" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                                Score: {getTotalQuestionScoreSkillWise(skillData.skill, skillData.questionType)}
                                            </p>
                                        </div>

                                        <div className="question-content">
                                            <div className="question-header">
                                                <div className="left-header">
                                                    <div onClick={(e) => clickedLevel(e, "easy", skillData.skill)} className={javascriptActive === "easy" && skillData.levelWiseStatus ? "easy-active" : "easy"} >
                                                        {javascriptActive === "easy" ?
                                                            skillData.selected ? <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "easy", false)} width="16" height="17" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M10.0156 3L4.51562 8.5L2.01562 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>

                                                                : <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "easy", true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    < path d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z" stroke="#F1EBEB" />
                                                                </svg> : <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "easy", true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                < path d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z" stroke="#F1EBEB" />
                                                            </svg>}

                                                        <span>Easy</span>
                                                        {javascriptActive !== "easy" ? <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.5737 2.85442C9.60324 1.85567 8.41202 1.09854 7.09577 0.643904C7.02734 0.624465 6.95474 0.625254 6.88675 0.646175C6.81876 0.667095 6.75828 0.707253 6.71261 0.761798C6.66767 0.816801 6.63959 0.883622 6.63175 0.954216C6.6239 1.02481 6.63663 1.09617 6.6684 1.15969C7.44822 2.60196 7.6661 4.28199 7.27998 5.87547C7.27361 5.90018 7.25939 5.92217 7.23946 5.93811C7.21953 5.95405 7.19496 5.9631 7.16945 5.96389C7.10314 5.96389 7.0884 5.96389 7.0884 5.91231C6.52577 4.54901 5.57846 3.37897 4.36209 2.54495C4.30008 2.50405 4.22714 2.48286 4.15287 2.48415C4.07859 2.48544 4.00644 2.50916 3.94588 2.55219C3.88532 2.59522 3.83918 2.65555 3.81352 2.72526C3.78786 2.79498 3.78388 2.87082 3.80209 2.94284C4.23683 4.64494 3.3821 5.66915 2.32841 6.96599C1.27473 8.26283 0 9.78072 0 12.227C0.0258836 13.7902 0.575961 15.2994 1.56202 16.5126C2.54808 17.7258 3.91299 18.5727 5.43788 18.9175C5.12703 18.6981 4.87274 18.408 4.69595 18.0711C4.51916 17.7342 4.42494 17.3601 4.42104 16.9796C4.42104 13.0449 6.99998 12.0649 6.99998 12.0649C7.51577 14.6439 9.57892 15.2333 9.57892 16.9796C9.57523 17.3557 9.4833 17.7256 9.31052 18.0597C9.13775 18.3937 8.88896 18.6825 8.58419 18.9028C9.6652 18.6683 10.6753 18.1809 11.5315 17.4807C12.3068 16.838 12.9302 16.0316 13.357 15.1194C13.7838 14.2073 14.0034 13.212 14 12.2049C14 7.27546 12.1358 4.40179 10.5737 2.85442Z" fill="#00C49A" />
                                                        </svg> : <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.5737 2.58294C9.60324 1.58419 8.41202 0.827059 7.09577 0.372419C7.02734 0.352981 6.95474 0.35377 6.88675 0.37469C6.81876 0.395611 6.75828 0.435769 6.71261 0.490314C6.66767 0.545317 6.63959 0.612138 6.63175 0.682731C6.6239 0.753325 6.63663 0.824681 6.6684 0.888207C7.44822 2.33048 7.6661 4.0105 7.27998 5.60398C7.27361 5.6287 7.25939 5.65068 7.23946 5.66663C7.21953 5.68257 7.19497 5.69162 7.16945 5.6924C7.10314 5.6924 7.0884 5.6924 7.0884 5.64083C6.52577 4.27753 5.57846 3.10748 4.36209 2.27347C4.30008 2.23257 4.22714 2.21138 4.15287 2.21267C4.07859 2.21396 4.00644 2.23767 3.94588 2.2807C3.88532 2.32373 3.83918 2.38406 3.81352 2.45378C3.78786 2.52349 3.78388 2.59934 3.80209 2.67136C4.23683 4.37346 3.3821 5.39767 2.32841 6.69451C1.27473 7.99135 0 9.50924 0 11.9555C0.0258836 13.5187 0.575961 15.0279 1.56202 16.2411C2.54808 17.4543 3.91299 18.3012 5.43788 18.6461C5.12703 18.4267 4.87274 18.1366 4.69595 17.7996C4.51916 17.4627 4.42494 17.0886 4.42104 16.7082C4.42104 12.7734 6.99998 11.7934 6.99998 11.7934C7.51577 14.3724 9.57892 14.9619 9.57892 16.7082C9.57523 17.0842 9.4833 17.4541 9.31052 17.7882C9.13775 18.1222 8.88896 18.411 8.58419 18.6313C9.6652 18.3968 10.6753 17.9095 11.5315 17.2092C12.3068 16.5665 12.9302 15.7601 13.357 14.848C13.7838 13.9358 14.0034 12.9405 14 11.9334C14 7.00398 12.1358 4.1303 10.5737 2.58294Z" fill="white" />
                                                        </svg>}

                                                    </div>
                                                    <div onClick={(e) => clickedLevel(e, "medium", skillData.skill)} className={javascriptActive === "medium" && skillData.levelWiseStatus ? "medium-active" : "medium"} >
                                                        {javascriptActive === "medium" ? skillData.selected ? <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "medium", false)} width="16" height="17" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.0156 3L4.51562 8.5L2.01562 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>

                                                            : <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "medium", true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                < path d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z" stroke="#F1EBEB" />
                                                            </svg> :
                                                            <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "medium", true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                < path d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z" stroke="#F1EBEB" />
                                                            </svg>
                                                        }

                                                        <span>Medium</span>
                                                        {javascriptActive !== "medium" ? < svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.5737 2.27435C9.60324 1.27559 8.41202 0.518465 7.09577 0.0638254C7.02734 0.0443872 6.95474 0.045176 6.88675 0.0660966C6.81876 0.0870172 6.75828 0.127175 6.71261 0.18172C6.66767 0.236723 6.63959 0.303544 6.63175 0.374138C6.6239 0.444731 6.63663 0.516087 6.6684 0.579613C7.44822 2.02189 7.6661 3.70191 7.27998 5.29539C7.27361 5.32011 7.25939 5.34209 7.23946 5.35803C7.21953 5.37398 7.19496 5.38302 7.16945 5.38381C7.10314 5.38381 7.0884 5.38381 7.0884 5.33223C6.52577 3.96893 5.57846 2.79889 4.36209 1.96487C4.30008 1.92398 4.22714 1.90278 4.15287 1.90407C4.07859 1.90536 4.00644 1.92908 3.94588 1.97211C3.88532 2.01514 3.83918 2.07547 3.81352 2.14518C3.78786 2.2149 3.78388 2.29075 3.80209 2.36277C4.23683 4.06487 3.3821 5.08908 2.32841 6.38591C1.27473 7.68275 0 9.20064 0 11.647C0.0258836 13.2101 0.575961 14.7193 1.56202 15.9325C2.54808 17.1457 3.91299 17.9926 5.43788 18.3375C5.12703 18.1181 4.87274 17.828 4.69595 17.491C4.51916 17.1541 4.42494 16.78 4.42104 16.3996C4.42104 12.4648 6.99998 11.4848 6.99998 11.4848C7.51577 14.0638 9.57892 14.6533 9.57892 16.3996C9.57523 16.7756 9.4833 17.1455 9.31052 17.4796C9.13775 17.8136 8.88896 18.1024 8.58419 18.3227C9.6652 18.0882 10.6753 17.6009 11.5315 16.9006C12.3068 16.2579 12.9302 15.4515 13.357 14.5394C13.7838 13.6272 14.0034 12.6319 14 11.6248C14 6.69539 12.1358 3.82171 10.5737 2.27435Z" fill="#FF9736" />
                                                        </svg> : <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.5737 2.58294C9.60324 1.58419 8.41202 0.827059 7.09577 0.372419C7.02734 0.352981 6.95474 0.35377 6.88675 0.37469C6.81876 0.395611 6.75828 0.435769 6.71261 0.490314C6.66767 0.545317 6.63959 0.612138 6.63175 0.682731C6.6239 0.753325 6.63663 0.824681 6.6684 0.888207C7.44822 2.33048 7.6661 4.0105 7.27998 5.60398C7.27361 5.6287 7.25939 5.65068 7.23946 5.66663C7.21953 5.68257 7.19497 5.69162 7.16945 5.6924C7.10314 5.6924 7.0884 5.6924 7.0884 5.64083C6.52577 4.27753 5.57846 3.10748 4.36209 2.27347C4.30008 2.23257 4.22714 2.21138 4.15287 2.21267C4.07859 2.21396 4.00644 2.23767 3.94588 2.2807C3.88532 2.32373 3.83918 2.38406 3.81352 2.45378C3.78786 2.52349 3.78388 2.59934 3.80209 2.67136C4.23683 4.37346 3.3821 5.39767 2.32841 6.69451C1.27473 7.99135 0 9.50924 0 11.9555C0.0258836 13.5187 0.575961 15.0279 1.56202 16.2411C2.54808 17.4543 3.91299 18.3012 5.43788 18.6461C5.12703 18.4267 4.87274 18.1366 4.69595 17.7996C4.51916 17.4627 4.42494 17.0886 4.42104 16.7082C4.42104 12.7734 6.99998 11.7934 6.99998 11.7934C7.51577 14.3724 9.57892 14.9619 9.57892 16.7082C9.57523 17.0842 9.4833 17.4541 9.31052 17.7882C9.13775 18.1222 8.88896 18.411 8.58419 18.6313C9.6652 18.3968 10.6753 17.9095 11.5315 17.2092C12.3068 16.5665 12.9302 15.7601 13.357 14.848C13.7838 13.9358 14.0034 12.9405 14 11.9334C14 7.00398 12.1358 4.1303 10.5737 2.58294Z" fill="white" />
                                                        </svg>}

                                                    </div>
                                                    <div onClick={(e) => clickedLevel(e, "hard", skillData.skill)} className={javascriptActive === "hard" && skillData.levelWiseStatus ? "hard-active" : "hard"} >
                                                        {javascriptActive === "hard" ? skillData.selected ? <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "hard", false)} width="16" height="17" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.0156 3L4.51562 8.5L2.01562 6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>

                                                            : <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "hard", true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                < path d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z" stroke="#F1EBEB" />
                                                            </svg> :
                                                            <svg onClick={(e) => selectAllQuestionAsPerLevel(e, skillData.skill, "easy", true)} width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                < path d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z" stroke="#F1EBEB" />
                                                            </svg>
                                                        }

                                                        <span>Hard</span>
                                                        {javascriptActive !== "hard" ? <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.5737 2.85442C9.60324 1.85567 8.41202 1.09854 7.09577 0.643904C7.02734 0.624465 6.95474 0.625254 6.88675 0.646175C6.81876 0.667095 6.75828 0.707253 6.71261 0.761798C6.66767 0.816801 6.63959 0.883622 6.63175 0.954216C6.6239 1.02481 6.63663 1.09617 6.6684 1.15969C7.44822 2.60196 7.6661 4.28199 7.27998 5.87547C7.27361 5.90018 7.25939 5.92217 7.23946 5.93811C7.21953 5.95405 7.19496 5.9631 7.16945 5.96389C7.10314 5.96389 7.0884 5.96389 7.0884 5.91231C6.52577 4.54901 5.57846 3.37897 4.36209 2.54495C4.30008 2.50405 4.22714 2.48286 4.15287 2.48415C4.07859 2.48544 4.00644 2.50916 3.94588 2.55219C3.88532 2.59522 3.83918 2.65555 3.81352 2.72526C3.78786 2.79498 3.78388 2.87082 3.80209 2.94284C4.23683 4.64494 3.3821 5.66915 2.32841 6.96599C1.27473 8.26283 0 9.78072 0 12.227C0.0258836 13.7902 0.575961 15.2994 1.56202 16.5126C2.54808 17.7258 3.91299 18.5727 5.43788 18.9175C5.12703 18.6981 4.87274 18.408 4.69595 18.0711C4.51916 17.7342 4.42494 17.3601 4.42104 16.9796C4.42104 13.0449 6.99998 12.0649 6.99998 12.0649C7.51577 14.6439 9.57892 15.2333 9.57892 16.9796C9.57523 17.3557 9.4833 17.7256 9.31052 18.0597C9.13775 18.3937 8.88896 18.6825 8.58419 18.9028C9.6652 18.6683 10.6753 18.1809 11.5315 17.4807C12.3068 16.838 12.9302 16.0316 13.357 15.1194C13.7838 14.2073 14.0034 13.212 14 12.2049C14 7.27546 12.1358 4.40179 10.5737 2.85442Z" fill="#FF6812" />
                                                        </svg> : <svg width="14" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M10.5737 2.58294C9.60324 1.58419 8.41202 0.827059 7.09577 0.372419C7.02734 0.352981 6.95474 0.35377 6.88675 0.37469C6.81876 0.395611 6.75828 0.435769 6.71261 0.490314C6.66767 0.545317 6.63959 0.612138 6.63175 0.682731C6.6239 0.753325 6.63663 0.824681 6.6684 0.888207C7.44822 2.33048 7.6661 4.0105 7.27998 5.60398C7.27361 5.6287 7.25939 5.65068 7.23946 5.66663C7.21953 5.68257 7.19497 5.69162 7.16945 5.6924C7.10314 5.6924 7.0884 5.6924 7.0884 5.64083C6.52577 4.27753 5.57846 3.10748 4.36209 2.27347C4.30008 2.23257 4.22714 2.21138 4.15287 2.21267C4.07859 2.21396 4.00644 2.23767 3.94588 2.2807C3.88532 2.32373 3.83918 2.38406 3.81352 2.45378C3.78786 2.52349 3.78388 2.59934 3.80209 2.67136C4.23683 4.37346 3.3821 5.39767 2.32841 6.69451C1.27473 7.99135 0 9.50924 0 11.9555C0.0258836 13.5187 0.575961 15.0279 1.56202 16.2411C2.54808 17.4543 3.91299 18.3012 5.43788 18.6461C5.12703 18.4267 4.87274 18.1366 4.69595 17.7996C4.51916 17.4627 4.42494 17.0886 4.42104 16.7082C4.42104 12.7734 6.99998 11.7934 6.99998 11.7934C7.51577 14.3724 9.57892 14.9619 9.57892 16.7082C9.57523 17.0842 9.4833 17.4541 9.31052 17.7882C9.13775 18.1222 8.88896 18.411 8.58419 18.6313C9.6652 18.3968 10.6753 17.9095 11.5315 17.2092C12.3068 16.5665 12.9302 15.7601 13.357 14.848C13.7838 13.9358 14.0034 12.9405 14 11.9334C14 7.00398 12.1358 4.1303 10.5737 2.58294Z" fill="white" />
                                                        </svg>}
                                                    </div>
                                                </div>
                                                <div className="right-header">
                                                    {selected.length && skillData.skill === selectedSkill ? <div className="remove" >
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M1.875 3.75H3.125H13.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M6.25 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M8.75 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                        <span>Remove Questions ({selected.length})</span>
                                                    </div> : <></>}

                                                    <div className="input-type">
                                                        <div className="select-box">
                                                            <select onChange={(e) => { setJavascriptType(e.target.value) }}>
                                                                <option value="all">All</option>
                                                                <option value="MCQ">MCQ</option>
                                                                <option value="Programming">Programming</option>
                                                            </select>
                                                            <svg className='vector-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {createTestContext.question.filter((data) => {
                                                const skillExits = data.skillsId.map((data) => data.skills.skills).filter(Boolean);

                                                return data.difficultyLevelId.level === javascriptActive && skillExits.includes(skillData.skill) && (data.type === javascriptType || javascriptType === "all")
                                            }).map((data, index) => {
                                                return (
                                                    <div className="question" >
                                                        <div className="content"  >
                                                            
                                                            {data.selected ? <svg onClick={() => { removeCheck(index + 1); setselectedSkill(skillData.skill) }} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect width="15" height="15" rx="2" fill="#FF6812" />
                                                                <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                                : <svg onClick={() => { setCheck(index + 1); setselectedSkill(skillData.skill) }} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <rect x="0.5" y="0.5" width="15" height="15" rx="1.5" stroke="#DDDDDD" />
                                                                </svg>
                                                            }
                                                            <span onClick={() => {
                                                                setSelectedQuestion(data);
                                                                setOpenPreview(true);
                                                                setSelectedQuestion(data);
                                                                setselectedQuestionIndex(index + 1);
                                                                setquestionPreview(true);
                                                            }} >{data.question}</span>
                                                        </div>
                                                        <div className="options">
                                                            <div className="question-score">
                                                                <div className="score">
                                                                    <span>Score: </span>
                                                                    <p>{data.score}</p>
                                                                </div>
                                                            </div>
                                                            <div className="question-type">
                                                                <span>{data.type}</span>
                                                            </div>
                                                            <div className="icons">
                                                                <svg onClick={() => {
                                                                    setSelectedQuestion(data);
                                                                    seteditQuestion(true);
                                                                    setSelectedQuestion(data);
                                                                    setselectedQuestionIndex(index + 1);
                                                                }} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.11328 13.5303H13.1133" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                    <path d="M10.1133 1.84342C10.3785 1.56163 10.7382 1.40332 11.1133 1.40332C11.299 1.40332 11.4829 1.44219 11.6545 1.5177C11.8261 1.59321 11.982 1.70389 12.1133 1.84342C12.2446 1.98295 12.3488 2.1486 12.4198 2.3309C12.4909 2.51321 12.5275 2.7086 12.5275 2.90592C12.5275 3.10325 12.4909 3.29864 12.4198 3.48094C12.3488 3.66325 12.2446 3.82889 12.1133 3.96842L3.77995 12.8226L1.11328 13.5309L1.77995 10.6976L10.1133 1.84342Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg> 
                                                                 <svg width="1" height="20" viewBox="0 0 1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <line x1="0.25" y1="19.5146" x2="0.25" y2="0.48835" stroke="#DDDDDD" stroke-width="0.5" />
                                                                </svg>
                                                                <svg onClick={() => {
                                                                    setDeleteSkillSetModel(true);
                                                                }} width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M0.976562 3.85938H2.3099H12.9766" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                    <path d="M11.6419 3.86003V13.1934C11.6419 13.547 11.5015 13.8861 11.2514 14.1362C11.0014 14.3862 10.6622 14.5267 10.3086 14.5267H3.64193C3.28831 14.5267 2.94917 14.3862 2.69912 14.1362C2.44907 13.8861 2.30859 13.547 2.30859 13.1934V3.86003M4.30859 3.86003V2.52669C4.30859 2.17307 4.44907 1.83393 4.69912 1.58388C4.94917 1.33384 5.2883 1.19336 5.64193 1.19336H8.30859C8.66222 1.19336 9.00135 1.33384 9.2514 1.58388C9.50145 1.83393 9.64193 2.17307 9.64193 2.52669V3.86003" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg>

                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                        </div>
                                    </div> : <></>
                            )
                        })
                        } */}

            {/*question overview array */}
            {createTestContext.questionOverview.map((skillData) => {
              return (
                <div className="question-container">
                  <div className="question-title">
                    <span>
                      <svg
                        width="16"
                        height="17"
                        viewBox="0 0 16 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7254 9.94163L8.94536 14.7216C8.82153 14.8456 8.67448 14.9439 8.51262 15.011C8.35075 15.0781 8.17725 15.1127 8.00203 15.1127C7.82681 15.1127 7.65331 15.0781 7.49144 15.011C7.32958 14.9439 7.18253 14.8456 7.0587 14.7216L1.33203 9.00163V2.33496H7.9987L13.7254 8.06163C13.9737 8.31144 14.1131 8.64938 14.1131 9.00163C14.1131 9.35387 13.9737 9.69181 13.7254 9.94163V9.94163Z"
                          stroke="#333333"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.66797 5.66895H4.67422"
                          stroke="#333333"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      {skillData.skillName} Skillset (
                      {skillData.totalNoOfQuestion})
                    </span>
                    <p>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.3 0.501953H12.7C13.0448 0.501953 13.3754 0.654135 13.6192 0.925021C13.863 1.19591 14 1.56331 14 1.9464V6.27973C14 8.19518 13.3152 10.0322 12.0962 11.3866C10.8772 12.741 9.22391 13.502 7.5 13.502C6.64641 13.502 5.80117 13.3151 5.01256 12.9522C4.22394 12.5892 3.50739 12.0573 2.90381 11.3866C1.68482 10.0322 1 8.19518 1 6.27973V1.9464C1 1.56331 1.13696 1.19591 1.38076 0.925021C1.62456 0.654135 1.95522 0.501953 2.3 0.501953V0.501953Z"
                          stroke="#353537"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.91016 5.55859L7.51016 8.44748L10.1102 5.55859"
                          stroke="#353537"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Score:{" "}
                      {getTotalQuestionScoreSkillWise(
                        skillData.skillName,
                        skillData.type
                      )}
                    </p>
                  </div>

                  <div className="question-content">
                    <div className="question-header">
                      <div className="left-header">
                        <div
                          onClick={(e) =>
                            clickedLevel(e, "easy", skillData.skillName)
                          }
                          className={
                            skillData.easyQuestion.isPreviewQuestion
                              ? "easy-active"
                              : "easy"
                          }
                        >
                          {skillData.random ? (
                            <></>
                          ) : (
                            <>
                              {skillData.easyQuestion.isPreviewQuestion ? (
                                skillData.easyQuestion.isSelectAll ? (
                                  <svg
                                    onClick={(e) =>
                                      selectAllQuestionAsPerLevel(
                                        e,
                                        skillData.skillName,
                                        "easy",
                                        false
                                      )
                                    }
                                    width="16"
                                    height="17"
                                    viewBox="0 0 13 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.0156 3L4.51562 8.5L2.01562 6"
                                      stroke="white"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    onClick={(e) =>
                                      selectAllQuestionAsPerLevel(
                                        e,
                                        skillData.skillName,
                                        "easy",
                                        true
                                      )
                                    }
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z"
                                      stroke="#F1EBEB"
                                    />
                                  </svg>
                                )
                              ) : skillData.easyQuestion.isSelectAll ? (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14 8.4668L8.5 13.9668L6 11.4668"
                                    stroke="#00C49A"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  onClick={(e) =>
                                    selectAllQuestionAsPerLevel(
                                      e,
                                      skillData.skillName,
                                      "easy",
                                      true
                                    )
                                  }
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z"
                                    stroke="#F1EBEB"
                                  />
                                </svg>
                              )}
                            </>
                          )}
                          <span>
                            Easy ({skillData.easyQuestion.question.length})
                          </span>
                          {!skillData.easyQuestion.isPreviewQuestion ? (
                            <svg
                              width="14"
                              height="19"
                              viewBox="0 0 14 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5737 2.85442C9.60324 1.85567 8.41202 1.09854 7.09577 0.643904C7.02734 0.624465 6.95474 0.625254 6.88675 0.646175C6.81876 0.667095 6.75828 0.707253 6.71261 0.761798C6.66767 0.816801 6.63959 0.883622 6.63175 0.954216C6.6239 1.02481 6.63663 1.09617 6.6684 1.15969C7.44822 2.60196 7.6661 4.28199 7.27998 5.87547C7.27361 5.90018 7.25939 5.92217 7.23946 5.93811C7.21953 5.95405 7.19496 5.9631 7.16945 5.96389C7.10314 5.96389 7.0884 5.96389 7.0884 5.91231C6.52577 4.54901 5.57846 3.37897 4.36209 2.54495C4.30008 2.50405 4.22714 2.48286 4.15287 2.48415C4.07859 2.48544 4.00644 2.50916 3.94588 2.55219C3.88532 2.59522 3.83918 2.65555 3.81352 2.72526C3.78786 2.79498 3.78388 2.87082 3.80209 2.94284C4.23683 4.64494 3.3821 5.66915 2.32841 6.96599C1.27473 8.26283 0 9.78072 0 12.227C0.0258836 13.7902 0.575961 15.2994 1.56202 16.5126C2.54808 17.7258 3.91299 18.5727 5.43788 18.9175C5.12703 18.6981 4.87274 18.408 4.69595 18.0711C4.51916 17.7342 4.42494 17.3601 4.42104 16.9796C4.42104 13.0449 6.99998 12.0649 6.99998 12.0649C7.51577 14.6439 9.57892 15.2333 9.57892 16.9796C9.57523 17.3557 9.4833 17.7256 9.31052 18.0597C9.13775 18.3937 8.88896 18.6825 8.58419 18.9028C9.6652 18.6683 10.6753 18.1809 11.5315 17.4807C12.3068 16.838 12.9302 16.0316 13.357 15.1194C13.7838 14.2073 14.0034 13.212 14 12.2049C14 7.27546 12.1358 4.40179 10.5737 2.85442Z"
                                fill="#00C49A"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="19"
                              viewBox="0 0 14 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5737 2.58294C9.60324 1.58419 8.41202 0.827059 7.09577 0.372419C7.02734 0.352981 6.95474 0.35377 6.88675 0.37469C6.81876 0.395611 6.75828 0.435769 6.71261 0.490314C6.66767 0.545317 6.63959 0.612138 6.63175 0.682731C6.6239 0.753325 6.63663 0.824681 6.6684 0.888207C7.44822 2.33048 7.6661 4.0105 7.27998 5.60398C7.27361 5.6287 7.25939 5.65068 7.23946 5.66663C7.21953 5.68257 7.19497 5.69162 7.16945 5.6924C7.10314 5.6924 7.0884 5.6924 7.0884 5.64083C6.52577 4.27753 5.57846 3.10748 4.36209 2.27347C4.30008 2.23257 4.22714 2.21138 4.15287 2.21267C4.07859 2.21396 4.00644 2.23767 3.94588 2.2807C3.88532 2.32373 3.83918 2.38406 3.81352 2.45378C3.78786 2.52349 3.78388 2.59934 3.80209 2.67136C4.23683 4.37346 3.3821 5.39767 2.32841 6.69451C1.27473 7.99135 0 9.50924 0 11.9555C0.0258836 13.5187 0.575961 15.0279 1.56202 16.2411C2.54808 17.4543 3.91299 18.3012 5.43788 18.6461C5.12703 18.4267 4.87274 18.1366 4.69595 17.7996C4.51916 17.4627 4.42494 17.0886 4.42104 16.7082C4.42104 12.7734 6.99998 11.7934 6.99998 11.7934C7.51577 14.3724 9.57892 14.9619 9.57892 16.7082C9.57523 17.0842 9.4833 17.4541 9.31052 17.7882C9.13775 18.1222 8.88896 18.411 8.58419 18.6313C9.6652 18.3968 10.6753 17.9095 11.5315 17.2092C12.3068 16.5665 12.9302 15.7601 13.357 14.848C13.7838 13.9358 14.0034 12.9405 14 11.9334C14 7.00398 12.1358 4.1303 10.5737 2.58294Z"
                                fill="white"
                              />
                            </svg>
                          )}
                        </div>
                        <div
                          onClick={(e) =>
                            clickedLevel(e, "medium", skillData.skillName)
                          }
                          className={
                            skillData.mediumQuestion.isPreviewQuestion
                              ? "medium-active"
                              : "medium"
                          }
                        >
                          {skillData.random ? (
                            <></>
                          ) : (
                            <>
                              {skillData.mediumQuestion.isPreviewQuestion ? (
                                skillData.mediumQuestion.isSelectAll ? (
                                  <svg
                                    onClick={(e) =>
                                      selectAllQuestionAsPerLevel(
                                        e,
                                        skillData.skillName,
                                        "medium",
                                        false
                                      )
                                    }
                                    width="16"
                                    height="17"
                                    viewBox="0 0 13 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.0156 3L4.51562 8.5L2.01562 6"
                                      stroke="white"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    onClick={(e) =>
                                      selectAllQuestionAsPerLevel(
                                        e,
                                        skillData.skillName,
                                        "medium",
                                        true
                                      )
                                    }
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z"
                                      stroke="#F1EBEB"
                                    />
                                  </svg>
                                )
                              ) : skillData.mediumQuestion.isSelectAll ? (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14 8.4668L8.5 13.9668L6 11.4668"
                                    stroke="#FF9736"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  onClick={(e) =>
                                    selectAllQuestionAsPerLevel(
                                      e,
                                      skillData.skillName,
                                      "medium",
                                      true
                                    )
                                  }
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z"
                                    stroke="#F1EBEB"
                                  />
                                </svg>
                              )}
                            </>
                          )}
                          <span>
                            Medium ({skillData.mediumQuestion.question.length})
                          </span>
                          {!skillData.mediumQuestion.isPreviewQuestion ? (
                            <svg
                              width="14"
                              height="19"
                              viewBox="0 0 14 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5737 2.27435C9.60324 1.27559 8.41202 0.518465 7.09577 0.0638254C7.02734 0.0443872 6.95474 0.045176 6.88675 0.0660966C6.81876 0.0870172 6.75828 0.127175 6.71261 0.18172C6.66767 0.236723 6.63959 0.303544 6.63175 0.374138C6.6239 0.444731 6.63663 0.516087 6.6684 0.579613C7.44822 2.02189 7.6661 3.70191 7.27998 5.29539C7.27361 5.32011 7.25939 5.34209 7.23946 5.35803C7.21953 5.37398 7.19496 5.38302 7.16945 5.38381C7.10314 5.38381 7.0884 5.38381 7.0884 5.33223C6.52577 3.96893 5.57846 2.79889 4.36209 1.96487C4.30008 1.92398 4.22714 1.90278 4.15287 1.90407C4.07859 1.90536 4.00644 1.92908 3.94588 1.97211C3.88532 2.01514 3.83918 2.07547 3.81352 2.14518C3.78786 2.2149 3.78388 2.29075 3.80209 2.36277C4.23683 4.06487 3.3821 5.08908 2.32841 6.38591C1.27473 7.68275 0 9.20064 0 11.647C0.0258836 13.2101 0.575961 14.7193 1.56202 15.9325C2.54808 17.1457 3.91299 17.9926 5.43788 18.3375C5.12703 18.1181 4.87274 17.828 4.69595 17.491C4.51916 17.1541 4.42494 16.78 4.42104 16.3996C4.42104 12.4648 6.99998 11.4848 6.99998 11.4848C7.51577 14.0638 9.57892 14.6533 9.57892 16.3996C9.57523 16.7756 9.4833 17.1455 9.31052 17.4796C9.13775 17.8136 8.88896 18.1024 8.58419 18.3227C9.6652 18.0882 10.6753 17.6009 11.5315 16.9006C12.3068 16.2579 12.9302 15.4515 13.357 14.5394C13.7838 13.6272 14.0034 12.6319 14 11.6248C14 6.69539 12.1358 3.82171 10.5737 2.27435Z"
                                fill="#FF9736"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="19"
                              viewBox="0 0 14 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5737 2.58294C9.60324 1.58419 8.41202 0.827059 7.09577 0.372419C7.02734 0.352981 6.95474 0.35377 6.88675 0.37469C6.81876 0.395611 6.75828 0.435769 6.71261 0.490314C6.66767 0.545317 6.63959 0.612138 6.63175 0.682731C6.6239 0.753325 6.63663 0.824681 6.6684 0.888207C7.44822 2.33048 7.6661 4.0105 7.27998 5.60398C7.27361 5.6287 7.25939 5.65068 7.23946 5.66663C7.21953 5.68257 7.19497 5.69162 7.16945 5.6924C7.10314 5.6924 7.0884 5.6924 7.0884 5.64083C6.52577 4.27753 5.57846 3.10748 4.36209 2.27347C4.30008 2.23257 4.22714 2.21138 4.15287 2.21267C4.07859 2.21396 4.00644 2.23767 3.94588 2.2807C3.88532 2.32373 3.83918 2.38406 3.81352 2.45378C3.78786 2.52349 3.78388 2.59934 3.80209 2.67136C4.23683 4.37346 3.3821 5.39767 2.32841 6.69451C1.27473 7.99135 0 9.50924 0 11.9555C0.0258836 13.5187 0.575961 15.0279 1.56202 16.2411C2.54808 17.4543 3.91299 18.3012 5.43788 18.6461C5.12703 18.4267 4.87274 18.1366 4.69595 17.7996C4.51916 17.4627 4.42494 17.0886 4.42104 16.7082C4.42104 12.7734 6.99998 11.7934 6.99998 11.7934C7.51577 14.3724 9.57892 14.9619 9.57892 16.7082C9.57523 17.0842 9.4833 17.4541 9.31052 17.7882C9.13775 18.1222 8.88896 18.411 8.58419 18.6313C9.6652 18.3968 10.6753 17.9095 11.5315 17.2092C12.3068 16.5665 12.9302 15.7601 13.357 14.848C13.7838 13.9358 14.0034 12.9405 14 11.9334C14 7.00398 12.1358 4.1303 10.5737 2.58294Z"
                                fill="white"
                              />
                            </svg>
                          )}
                        </div>
                        <div
                          onClick={(e) =>
                            clickedLevel(e, "hard", skillData.skillName)
                          }
                          className={
                            skillData.hardQuestion.isPreviewQuestion
                              ? "hard-active"
                              : "hard"
                          }
                        >
                          {skillData.random ? (
                            <></>
                          ) : (
                            <>
                              {skillData.hardQuestion.isPreviewQuestion ? (
                                skillData.hardQuestion.isSelectAll ? (
                                  <svg
                                    onClick={(e) =>
                                      selectAllQuestionAsPerLevel(
                                        e,
                                        skillData.skillName,
                                        "hard",
                                        false
                                      )
                                    }
                                    width="16"
                                    height="17"
                                    viewBox="0 0 13 12"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M10.0156 3L4.51562 8.5L2.01562 6"
                                      stroke="white"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                ) : (
                                  <svg
                                    onClick={(e) =>
                                      selectAllQuestionAsPerLevel(
                                        e,
                                        skillData.skillName,
                                        "hard",
                                        true
                                      )
                                    }
                                    width="16"
                                    height="17"
                                    viewBox="0 0 16 17"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <path
                                      d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z"
                                      stroke="#F1EBEB"
                                    />
                                  </svg>
                                )
                              ) : skillData.hardQuestion.isSelectAll ? (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M14 8.4668L8.5 13.9668L6 11.4668"
                                    stroke="#FF6812"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  onClick={(e) =>
                                    selectAllQuestionAsPerLevel(
                                      e,
                                      skillData.skillName,
                                      "hard",
                                      true
                                    )
                                  }
                                  width="16"
                                  height="17"
                                  viewBox="0 0 16 17"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M0.5 2.50195C0.5 1.67353 1.17157 1.00195 2 1.00195H14C14.8284 1.00195 15.5 1.67353 15.5 2.50195V14.502C15.5 15.3304 14.8284 16.002 14 16.002H2C1.17157 16.002 0.5 15.3304 0.5 14.502V2.50195Z"
                                    stroke="#F1EBEB"
                                  />
                                </svg>
                              )}
                            </>
                          )}
                          <span>
                            Hard ({skillData.hardQuestion.question.length})
                          </span>
                          {!skillData.hardQuestion.isPreviewQuestion ? (
                            <svg
                              width="14"
                              height="19"
                              viewBox="0 0 14 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5737 2.85442C9.60324 1.85567 8.41202 1.09854 7.09577 0.643904C7.02734 0.624465 6.95474 0.625254 6.88675 0.646175C6.81876 0.667095 6.75828 0.707253 6.71261 0.761798C6.66767 0.816801 6.63959 0.883622 6.63175 0.954216C6.6239 1.02481 6.63663 1.09617 6.6684 1.15969C7.44822 2.60196 7.6661 4.28199 7.27998 5.87547C7.27361 5.90018 7.25939 5.92217 7.23946 5.93811C7.21953 5.95405 7.19496 5.9631 7.16945 5.96389C7.10314 5.96389 7.0884 5.96389 7.0884 5.91231C6.52577 4.54901 5.57846 3.37897 4.36209 2.54495C4.30008 2.50405 4.22714 2.48286 4.15287 2.48415C4.07859 2.48544 4.00644 2.50916 3.94588 2.55219C3.88532 2.59522 3.83918 2.65555 3.81352 2.72526C3.78786 2.79498 3.78388 2.87082 3.80209 2.94284C4.23683 4.64494 3.3821 5.66915 2.32841 6.96599C1.27473 8.26283 0 9.78072 0 12.227C0.0258836 13.7902 0.575961 15.2994 1.56202 16.5126C2.54808 17.7258 3.91299 18.5727 5.43788 18.9175C5.12703 18.6981 4.87274 18.408 4.69595 18.0711C4.51916 17.7342 4.42494 17.3601 4.42104 16.9796C4.42104 13.0449 6.99998 12.0649 6.99998 12.0649C7.51577 14.6439 9.57892 15.2333 9.57892 16.9796C9.57523 17.3557 9.4833 17.7256 9.31052 18.0597C9.13775 18.3937 8.88896 18.6825 8.58419 18.9028C9.6652 18.6683 10.6753 18.1809 11.5315 17.4807C12.3068 16.838 12.9302 16.0316 13.357 15.1194C13.7838 14.2073 14.0034 13.212 14 12.2049C14 7.27546 12.1358 4.40179 10.5737 2.85442Z"
                                fill="#FF6812"
                              />
                            </svg>
                          ) : (
                            <svg
                              width="14"
                              height="19"
                              viewBox="0 0 14 19"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10.5737 2.58294C9.60324 1.58419 8.41202 0.827059 7.09577 0.372419C7.02734 0.352981 6.95474 0.35377 6.88675 0.37469C6.81876 0.395611 6.75828 0.435769 6.71261 0.490314C6.66767 0.545317 6.63959 0.612138 6.63175 0.682731C6.6239 0.753325 6.63663 0.824681 6.6684 0.888207C7.44822 2.33048 7.6661 4.0105 7.27998 5.60398C7.27361 5.6287 7.25939 5.65068 7.23946 5.66663C7.21953 5.68257 7.19497 5.69162 7.16945 5.6924C7.10314 5.6924 7.0884 5.6924 7.0884 5.64083C6.52577 4.27753 5.57846 3.10748 4.36209 2.27347C4.30008 2.23257 4.22714 2.21138 4.15287 2.21267C4.07859 2.21396 4.00644 2.23767 3.94588 2.2807C3.88532 2.32373 3.83918 2.38406 3.81352 2.45378C3.78786 2.52349 3.78388 2.59934 3.80209 2.67136C4.23683 4.37346 3.3821 5.39767 2.32841 6.69451C1.27473 7.99135 0 9.50924 0 11.9555C0.0258836 13.5187 0.575961 15.0279 1.56202 16.2411C2.54808 17.4543 3.91299 18.3012 5.43788 18.6461C5.12703 18.4267 4.87274 18.1366 4.69595 17.7996C4.51916 17.4627 4.42494 17.0886 4.42104 16.7082C4.42104 12.7734 6.99998 11.7934 6.99998 11.7934C7.51577 14.3724 9.57892 14.9619 9.57892 16.7082C9.57523 17.0842 9.4833 17.4541 9.31052 17.7882C9.13775 18.1222 8.88896 18.411 8.58419 18.6313C9.6652 18.3968 10.6753 17.9095 11.5315 17.2092C12.3068 16.5665 12.9302 15.7601 13.357 14.848C13.7838 13.9358 14.0034 12.9405 14 11.9334C14 7.00398 12.1358 4.1303 10.5737 2.58294Z"
                                fill="white"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="right-header">
                        {checkIsRemoveQuestionButtonActive(
                          skillData.skillName,
                          "easy"
                        ) > 0 && skillData.easyQuestion.isPreviewQuestion ? (
                          <div
                            onClick={() => {
                              setmultipleDelete(true);
                              setdeleteMutipleObject({
                                skill: skillData.skillName,
                                level: "easy",
                              });
                            }}
                            className="remove"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.875 3.75H3.125H13.125"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.25 6.875V10.625"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.75 6.875V10.625"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                            <span>
                              Remove Questions (
                              {checkIsRemoveQuestionButtonActive(
                                skillData.skillName,
                                "easy"
                              )}
                              )
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}

                        {checkIsRemoveQuestionButtonActive(
                          skillData.skillName,
                          "medium"
                        ) > 0 && skillData.mediumQuestion.isPreviewQuestion ? (
                          <div
                            onClick={() => {
                              setmultipleDelete(true);
                              setdeleteMutipleObject({
                                skill: skillData.skillName,
                                level: "medium",
                              });
                            }}
                            className="remove"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.875 3.75H3.125H13.125"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.25 6.875V10.625"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.75 6.875V10.625"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                            <span>
                              Remove Questions (
                              {checkIsRemoveQuestionButtonActive(
                                skillData.skillName,
                                "medium"
                              )}
                              )
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}

                        {checkIsRemoveQuestionButtonActive(
                          skillData.skillName,
                          "hard"
                        ) > 0 && skillData.hardQuestion.isPreviewQuestion ? (
                          <div
                            onClick={() => {
                              setmultipleDelete(true);
                              setdeleteMutipleObject({
                                skill: skillData.skillName,
                                level: "hard",
                              });
                            }}
                            className="remove"
                          >
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 15 15"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M1.875 3.75H3.125H13.125"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M6.25 6.875V10.625"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M8.75 6.875V10.625"
                                stroke="#F23E3E"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                            <span>
                              Remove Questions (
                              {checkIsRemoveQuestionButtonActive(
                                skillData.skillName,
                                "hard"
                              )}
                              )
                            </span>
                          </div>
                        ) : (
                          <></>
                        )}

                        <div className="input-type">
                          <div className="select-box">
                            <select
                              value={skillData.filterType}
                              onChange={(e) => {
                                skillData.filterType = e.target.value;
                                setupdateRefresh({});
                              }}
                            >
                              <option value="all">All</option>
                              <option value="MCQ">MCQ</option>
                              <option value="Programming">Programming</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {skillData.easyQuestion.isPreviewQuestion ? (
                      <>
                        {skillData?.easyQuestion?.question?.length ? (
                          <></>
                        ) : (
                          <>
                            {skillData.random ? (
                              <></>
                            ) : (
                              <div style={{ marginTop: 10 }}>
                                No question available
                              </div>
                            )}
                          </>
                        )}
                        {skillData.random ? (
                          <div className="question">
                            {skillData?.level
                              .split(",")[0]
                              ?.replace(/\D/g, "") > 0 ? (
                              <>
                                {skillData?.level
                                  .split(",")[0]
                                  ?.replace(/\D/g, "")}{" "}
                                Easy questions of {skillData.skillName} with{" "}
                                {skillData?.totalScore
                                  .split(",")[0]
                                  ?.replace(/\D/g, "")}{" "}
                                marks each will be dynamically selected every
                                time.
                              </>
                            ) : (
                              <>No question selections</>
                            )}{" "}
                          </div>
                        ) : (
                          <>
                            {skillData?.easyQuestion?.question?.map(
                              (data, index) => {
                                return data.type === skillData.filterType ||
                                  skillData.filterType === "all" ? (
                                  <div className="question">
                                    <div className="content">
                                      {/* <input type="checkbox" /> */}
                                      {data.selected ? (
                                        <svg
                                          onClick={(e) =>
                                            selectSingleQuestion(
                                              e,
                                              "easy",
                                              skillData.skillName,
                                              data._id,
                                              data.keyID,
                                              false
                                            )
                                          }
                                          width="15"
                                          height="15"
                                          viewBox="0 0 15 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            width="15"
                                            height="15"
                                            rx="2"
                                            fill="#FF6812"
                                          />
                                          <path
                                            d="M12 4.5L6.5 10L4 7.5"
                                            stroke="white"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          onClick={(e) =>
                                            selectSingleQuestion(
                                              e,
                                              "easy",
                                              skillData.skillName,
                                              data._id,
                                              data.keyID,
                                              true
                                            )
                                          }
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            x="0.5"
                                            y="0.5"
                                            width="15"
                                            height="15"
                                            rx="1.5"
                                            stroke="#DDDDDD"
                                          />
                                        </svg>
                                      )}
                                      <span
                                        onClick={() => {
                                          setSelectedQuestion(data);
                                          setOpenPreview(true);
                                          setSelectedQuestion(data);
                                          setselectedQuestionIndex(index + 1);
                                          setquestionPreview(true);
                                          setselectedSkill(skillData.skillName);
                                        }}
                                      >
                                        {truncateQuestionContent(data.question)}
                                      </span>
                                    </div>
                                    <div className="options">
                                      <div className="question-score">
                                        <div className="score">
                                          <span>Score: </span>
                                          {/* <p contenteditable="true" onInput={(e) => { e.stopPropagation(); !isNaN(+e.currentTarget.textContent)? updateQuestionUserScore(data._id ,parseInt(e.currentTarget.textContent)):toast.error("Please enter score in numeric format") }}  >{data.score}</p> */}
                                          <input
                                            onWheel={(e) => e.target.blur()}
                                            min={1}
                                            max={100}
                                            onKeyDown={(evt) => {
                                              if (evt.key === "e") {
                                                evt.preventDefault();
                                              }
                                              if (evt.key === "Enter") {
                                                evt.preventDefault();
                                                evt.target.blur();
                                              }
                                              if (evt.key === "-") {
                                                evt.preventDefault();
                                              }
                                            }}
                                            value={data.score}
                                            onChange={(e) =>
                                              onChangeQuestionScore(e, data)
                                            }
                                            onBlur={(e) =>
                                              onBlurQuestionScore(e, data)
                                            }
                                            type="number"
                                          />
                                        </div>
                                      </div>
                                      <div className="question-type">
                                        <span>{data.type}</span>
                                      </div>
                                      <div className="icons">
                                        {/* <svg onClick={() => {
                                                                    setSelectedQuestion(data);
                                                                    seteditQuestion(true);
                                                                    setSelectedQuestion(data);
                                                                    setselectedQuestionIndex(index + 1);
                                                                }} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.11328 13.5303H13.1133" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                    <path d="M10.1133 1.84342C10.3785 1.56163 10.7382 1.40332 11.1133 1.40332C11.299 1.40332 11.4829 1.44219 11.6545 1.5177C11.8261 1.59321 11.982 1.70389 12.1133 1.84342C12.2446 1.98295 12.3488 2.1486 12.4198 2.3309C12.4909 2.51321 12.5275 2.7086 12.5275 2.90592C12.5275 3.10325 12.4909 3.29864 12.4198 3.48094C12.3488 3.66325 12.2446 3.82889 12.1133 3.96842L3.77995 12.8226L1.11328 13.5309L1.77995 10.6976L10.1133 1.84342Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg> */}
                                        {/* <svg width="1" height="20" viewBox="0 0 1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <line x1="0.25" y1="19.5146" x2="0.25" y2="0.48835" stroke="#DDDDDD" stroke-width="0.5" />
                                                                </svg> */}
                                        <svg
                                          onClick={() => {
                                            console.log(skillData);
                                            setDeleteSkillSetModel(true);
                                            setSelectedQuestion(data);
                                            setselectedSkill(skillData);
                                            setdeleteSingleObject({
                                              skill: skillData?.skillName,
                                              level: "easy",
                                            });
                                          }}
                                          width="14"
                                          height="16"
                                          viewBox="0 0 14 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M0.976562 3.85938H2.3099H12.9766"
                                            stroke="#FF6812"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M11.6419 3.86003V13.1934C11.6419 13.547 11.5015 13.8861 11.2514 14.1362C11.0014 14.3862 10.6622 14.5267 10.3086 14.5267H3.64193C3.28831 14.5267 2.94917 14.3862 2.69912 14.1362C2.44907 13.8861 2.30859 13.547 2.30859 13.1934V3.86003M4.30859 3.86003V2.52669C4.30859 2.17307 4.44907 1.83393 4.69912 1.58388C4.94917 1.33384 5.2883 1.19336 5.64193 1.19336H8.30859C8.66222 1.19336 9.00135 1.33384 9.2514 1.58388C9.50145 1.83393 9.64193 2.17307 9.64193 2.52669V3.86003"
                                            stroke="#FF6812"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                );
                              }
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}

                    {skillData.mediumQuestion.isPreviewQuestion ? (
                      <>
                        {skillData.mediumQuestion.question.length ? (
                          <></>
                        ) : (
                          <>
                            {skillData.random ? (
                              <></>
                            ) : (
                              <div style={{ marginTop: 10 }}>
                                No question available
                              </div>
                            )}
                          </>
                        )}
                        {skillData.random ? (
                          <div className="question">
                            {skillData?.level
                              .split(",")[1]
                              ?.replace(/\D/g, "") > 0 ? (
                              <>
                                {skillData?.level
                                  .split(",")[1]
                                  ?.replace(/\D/g, "")}{" "}
                                Medium questions of {skillData.skillName} with{" "}
                                {skillData?.totalScore
                                  .split(",")[1]
                                  ?.replace(/\D/g, "")}{" "}
                                marks each will be dynamically selected every
                                time.
                              </>
                            ) : (
                              <>No question selection</>
                            )}{" "}
                          </div>
                        ) : (
                          <>
                            {skillData.mediumQuestion.question.map(
                              (data, index) => {
                                return data.type === skillData.filterType ||
                                  skillData.filterType === "all" ? (
                                  <div className="question">
                                    <div className="content">
                                      {/* <input type="checkbox" /> */}
                                      {data.selected ? (
                                        <svg
                                          onClick={(e) =>
                                            selectSingleQuestion(
                                              e,
                                              "medium",
                                              skillData.skillName,
                                              data._id,
                                              data.keyID,
                                              false
                                            )
                                          }
                                          width="15"
                                          height="15"
                                          viewBox="0 0 15 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            width="15"
                                            height="15"
                                            rx="2"
                                            fill="#FF6812"
                                          />
                                          <path
                                            d="M12 4.5L6.5 10L4 7.5"
                                            stroke="white"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          onClick={(e) =>
                                            selectSingleQuestion(
                                              e,
                                              "medium",
                                              skillData.skillName,
                                              data._id,
                                              data.keyID,
                                              true
                                            )
                                          }
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            x="0.5"
                                            y="0.5"
                                            width="15"
                                            height="15"
                                            rx="1.5"
                                            stroke="#DDDDDD"
                                          />
                                        </svg>
                                      )}
                                      <span
                                        onClick={() => {
                                          setSelectedQuestion(data);
                                          setOpenPreview(true);
                                          setSelectedQuestion(data);
                                          setselectedQuestionIndex(index + 1);
                                          setquestionPreview(true);
                                          setselectedSkill(skillData.skillName);
                                        }}
                                      >
                                        {truncateQuestionContent(data.question)}
                                      </span>
                                    </div>
                                    <div className="options">
                                      <div className="question-score">
                                        <div className="score">
                                          <span>Score: </span>
                                          {/* <p contenteditable="true" onInput={(e) => { e.stopPropagation();  !isNaN(+e.currentTarget.textContent)? updateQuestionUserScore(data._id ,parseInt(e.currentTarget.textContent)):toast.error("Please enter score in numeric format") }}  >{data.score}</p> */}
                                          <input
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(evt) => {
                                              if (evt.key === "e") {
                                                evt.preventDefault();
                                              }
                                              if (evt.key === "Enter") {
                                                evt.preventDefault();
                                                evt.target.blur();
                                              }
                                              if (evt.key === "-") {
                                                evt.preventDefault();
                                              }
                                            }}
                                            value={data.score}
                                            onChange={(e) =>
                                              onChangeQuestionScore(e, data)
                                            }
                                            type="number"
                                            min={1}
                                            max={100}
                                            onBlur={(e) =>
                                              onBlurQuestionScore(e, data)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="question-type">
                                        <span>{data.type}</span>
                                      </div>
                                      <div className="icons">
                                        {/* <svg onClick={() => {
                setSelectedQuestion(data);
                seteditQuestion(true);
                setSelectedQuestion(data);
                setselectedQuestionIndex(index + 1);
            }} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.11328 13.5303H13.1133" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M10.1133 1.84342C10.3785 1.56163 10.7382 1.40332 11.1133 1.40332C11.299 1.40332 11.4829 1.44219 11.6545 1.5177C11.8261 1.59321 11.982 1.70389 12.1133 1.84342C12.2446 1.98295 12.3488 2.1486 12.4198 2.3309C12.4909 2.51321 12.5275 2.7086 12.5275 2.90592C12.5275 3.10325 12.4909 3.29864 12.4198 3.48094C12.3488 3.66325 12.2446 3.82889 12.1133 3.96842L3.77995 12.8226L1.11328 13.5309L1.77995 10.6976L10.1133 1.84342Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
            </svg> */}
                                        {/* <svg width="1" height="20" viewBox="0 0 1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="0.25" y1="19.5146" x2="0.25" y2="0.48835" stroke="#DDDDDD" stroke-width="0.5" />
            </svg> */}
                                        <svg
                                          onClick={() => {
                                            console.log(skillData);
                                            setDeleteSkillSetModel(true);
                                            setSelectedQuestion(data);
                                            setselectedSkill(skillData);
                                            setdeleteSingleObject({
                                              skill: skillData?.skillName,
                                              level: "medium",
                                            });
                                          }}
                                          width="14"
                                          height="16"
                                          viewBox="0 0 14 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M0.976562 3.85938H2.3099H12.9766"
                                            stroke="#FF6812"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M11.6419 3.86003V13.1934C11.6419 13.547 11.5015 13.8861 11.2514 14.1362C11.0014 14.3862 10.6622 14.5267 10.3086 14.5267H3.64193C3.28831 14.5267 2.94917 14.3862 2.69912 14.1362C2.44907 13.8861 2.30859 13.547 2.30859 13.1934V3.86003M4.30859 3.86003V2.52669C4.30859 2.17307 4.44907 1.83393 4.69912 1.58388C4.94917 1.33384 5.2883 1.19336 5.64193 1.19336H8.30859C8.66222 1.19336 9.00135 1.33384 9.2514 1.58388C9.50145 1.83393 9.64193 2.17307 9.64193 2.52669V3.86003"
                                            stroke="#FF6812"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                );
                              }
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}

                    {skillData.hardQuestion.isPreviewQuestion ? (
                      <>
                        {skillData.hardQuestion.question.length ? (
                          <></>
                        ) : (
                          <>
                            {skillData.random ? (
                              <></>
                            ) : (
                              <div style={{ marginTop: 10 }}>
                                No question available
                              </div>
                            )}
                          </>
                        )}

                        {skillData.random ? (
                          <div className="question">
                            {skillData?.level
                              .split(",")[2]
                              ?.replace(/\D/g, "") > 0 ? (
                              <>
                                {skillData?.level
                                  .split(",")[2]
                                  ?.replace(/\D/g, "")}{" "}
                                Hard questions of {skillData.skillName} with{" "}
                                {skillData?.totalScore
                                  .split(",")[2]
                                  ?.replace(/\D/g, "")}{" "}
                                marks each will be dynamically selected every
                                time.
                              </>
                            ) : (
                              <>No question selection</>
                            )}{" "}
                          </div>
                        ) : (
                          <>
                            {skillData.hardQuestion.question.map(
                              (data, index) => {
                                return data.type === skillData.filterType ||
                                  skillData.filterType === "all" ? (
                                  <div className="question">
                                    <div className="content">
                                      {/* <input type="checkbox" /> */}
                                      {data.selected ? (
                                        <svg
                                          onClick={(e) => {
                                            selectSingleQuestion(
                                              e,
                                              "hard",
                                              skillData.skillName,
                                              data._id,
                                              data.keyID,
                                              false
                                            );
                                          }}
                                          width="15"
                                          height="15"
                                          viewBox="0 0 15 15"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            width="15"
                                            height="15"
                                            rx="2"
                                            fill="#FF6812"
                                          />
                                          <path
                                            d="M12 4.5L6.5 10L4 7.5"
                                            stroke="white"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      ) : (
                                        <svg
                                          onClick={(e) =>
                                            selectSingleQuestion(
                                              e,
                                              "hard",
                                              skillData.skillName,
                                              data._id,
                                              data.keyID,
                                              true
                                            )
                                          }
                                          width="16"
                                          height="16"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <rect
                                            x="0.5"
                                            y="0.5"
                                            width="15"
                                            height="15"
                                            rx="1.5"
                                            stroke="#DDDDDD"
                                          />
                                        </svg>
                                      )}
                                      <span
                                        onClick={() => {
                                          setSelectedQuestion(data);
                                          setOpenPreview(true);
                                          setSelectedQuestion(data);
                                          setselectedQuestionIndex(index + 1);
                                          setquestionPreview(true);
                                          setselectedSkill(skillData.skillName);
                                        }}
                                      >
                                        {truncateQuestionContent(data.question)}
                                      </span>
                                    </div>
                                    <div className="options">
                                      <div className="question-score">
                                        <div className="score">
                                          <span>Score: </span>
                                          {/* <p contenteditable="true" onInput={(e) => { e.stopPropagation();  !isNaN(+e.currentTarget.textContent)? updateQuestionUserScore(data._id ,parseInt(e.currentTarget.textContent)):toast.error("Please enter score in numeric format") }}  >{data.score}</p> */}
                                          <input
                                            onWheel={(e) => e.target.blur()}
                                            onKeyDown={(evt) => {
                                              if (evt.key === "e") {
                                                evt.preventDefault();
                                              }
                                              if (evt.key === "Enter") {
                                                evt.preventDefault();
                                                evt.target.blur();
                                              }
                                              if (evt.key === "-") {
                                                evt.preventDefault();
                                              }
                                            }}
                                            value={data.score}
                                            onChange={(e) =>
                                              onChangeQuestionScore(e, data)
                                            }
                                            type="number"
                                            min={1}
                                            max={100}
                                            onBlur={(e) =>
                                              onBlurQuestionScore(e, data)
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className="question-type">
                                        <span>{data.type}</span>
                                      </div>
                                      <div className="icons">
                                        {/* <svg onClick={() => {
                                                                    setSelectedQuestion(data);
                                                                    seteditQuestion(true);
                                                                    setSelectedQuestion(data);
                                                                    setselectedQuestionIndex(index + 1);
                                                                }} width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M7.11328 13.5303H13.1133" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                    <path d="M10.1133 1.84342C10.3785 1.56163 10.7382 1.40332 11.1133 1.40332C11.299 1.40332 11.4829 1.44219 11.6545 1.5177C11.8261 1.59321 11.982 1.70389 12.1133 1.84342C12.2446 1.98295 12.3488 2.1486 12.4198 2.3309C12.4909 2.51321 12.5275 2.7086 12.5275 2.90592C12.5275 3.10325 12.4909 3.29864 12.4198 3.48094C12.3488 3.66325 12.2446 3.82889 12.1133 3.96842L3.77995 12.8226L1.11328 13.5309L1.77995 10.6976L10.1133 1.84342Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                                </svg> */}
                                        {/* <svg width="1" height="20" viewBox="0 0 1 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <line x1="0.25" y1="19.5146" x2="0.25" y2="0.48835" stroke="#DDDDDD" stroke-width="0.5" />
                                                                </svg> */}
                                        <svg
                                          onClick={() => {
                                            setDeleteSkillSetModel(true);
                                            setSelectedQuestion(data);
                                            setselectedSkill(skillData);
                                            console.log(skillData);
                                            setdeleteSingleObject({
                                              skill: skillData?.skillName,
                                              level: "hard",
                                            });
                                          }}
                                          width="14"
                                          height="16"
                                          viewBox="0 0 14 16"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M0.976562 3.85938H2.3099H12.9766"
                                            stroke="#FF6812"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                          <path
                                            d="M11.6419 3.86003V13.1934C11.6419 13.547 11.5015 13.8861 11.2514 14.1362C11.0014 14.3862 10.6622 14.5267 10.3086 14.5267H3.64193C3.28831 14.5267 2.94917 14.3862 2.69912 14.1362C2.44907 13.8861 2.30859 13.547 2.30859 13.1934V3.86003M4.30859 3.86003V2.52669C4.30859 2.17307 4.44907 1.83393 4.69912 1.58388C4.94917 1.33384 5.2883 1.19336 5.64193 1.19336H8.30859C8.66222 1.19336 9.00135 1.33384 9.2514 1.58388C9.50145 1.83393 9.64193 2.17307 9.64193 2.52669V3.86003"
                                            stroke="#FF6812"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                          />
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                );
                              }
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionOverview;
