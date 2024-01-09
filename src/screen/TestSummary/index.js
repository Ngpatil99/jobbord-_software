import React, { useState, useContext, useEffect } from "react";
import CreateTest2Sidebar from "../../component/CreateTest2Sidebar";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import "./index.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AddSkillSet from "../../component/AddSkillSetModel";
import DeleteSkillSetModel from "../../component/DeleteSkillSetModel";
import TestDuration from "../../component/TestDuration/TestDuration";
import AssessmentToggleButton from "../../component/AssessmentToggleButton";
import CreateTestContext from "../../store/CreateTestContext";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import jwtDecode from "jwt-decode";
import TestCreationDataLossPopup from "../../component/TestCreationDataLossPopup";
import NoQuestionAvailablePopup from "../../component/NoQuestionAvailablePopup";
import RandomSkillSet from "../../component/RandomSkillSet";
import RandomAllSkillSet from "../../component/RandomAllSkillSet";

function CreateTest2() {
  const state = useLocation();
  const navigate = useNavigate();
  const createTestContext = useContext(CreateTestContext);
  const [addSkillSetModel, setAddSkillSetModel] = useState(false);
  const [editSkillModel, seteditSkillModel] = useState(false);
  const [deleteSkillSetModel, setDeleteSkillSetModel] = useState(false);
  const [durationModel, setDurationModel] = useState(false);
  const [questionIndex, setQuestionIndex] = useState();
  const [testDuration, setTestDuration] = useState(0);
  const [updateRefresh, setupdateRefresh] = useState({});
  const [loading, setloading] = useState(false);
  const [isNavItem, setisNavItem] = useState(false);
  const [selectedNavItem, setselectedNavItem] = useState("");
  const [finishStatus, setfinishStatus] = useState(false);
  const [isQuesionAvailable, setisQuesionAvailable] = useState(false);
  const [nonQuestionAvailableSkills, setnonQuestionAvailableSkills] = useState(
    []
  );
  //const [isRandomAll,setisRandomAll]=useState(false)
  const [isRandomModel, setisRandomModel] = useState(false);
  const [selectedSkillsetForRandom, setselectedSkillsetForRandom] = useState(
    {}
  );
  const [isRandomAllSkillset, setisRandomAllSkillset] = useState(false);

  const getQuestionSkillWise = (skills, type, level) => {
    return createTestContext.question.filter(
      (question) =>
        question.questions?.difficultyLevelId?.level === level &&
        question.questions?.type === type &&
        createTestContext.skills
          .filter((data) => data.skills === skills)
          .map((data) => data._id)[0] === question.skillId
    ).length;
  };

  const getEasyQuestionSkillWise = (skills, type) => {
    return getQuestionSkillWise(skills, type, "easy");
  };

  const getMediumQuestionSkillWise = (skills, type) => {
    return getQuestionSkillWise(skills, type, "medium");
  };

  const getHardQuestionSkillWise = (skills, type) => {
    return getQuestionSkillWise(skills, type, "hard");
  };

  const getTotalQuestionSkillWise = (skills, type) => {
    return createTestContext.question.filter((question) => {
      const skillExits = question.questions.skillsId
        .map((data) => data.skills)
        .filter(Boolean);

      return (
        question.questions.type === type &&
        question.skillId ===
          skillExits
            .filter((data) => data.skills === skills)
            .map((data) => data._id)[0]
      );
    }).length;
  };

  const getTotalQuestionScoreSkillWise = (skills, type) => {
    const questions = createTestContext.question.filter((question) => {
      const skillExits = question.questions.skillsId
        .map((data) => data.skills)
        .filter(Boolean);

      return (
        question.questions.type === type &&
        question.skillId ===
          skillExits
            .filter((data) => data.skills === skills)
            .map((data) => data._id)[0]
      );
    });

    return questions.reduce(
      (total, question) => total + question.questions.score,
      0
    );
  };
  const createSkillData = (skillType) => {
    createTestContext.skills.forEach((data) => {
      Promise.all([
        getEasyQuestionSkillWise(data.skills, skillType),
        getMediumQuestionSkillWise(data.skills, skillType),
        getHardQuestionSkillWise(data.skills, skillType),
        getTotalQuestionSkillWise(data.skills, skillType),
        getTotalQuestionScoreSkillWise(data.skills, skillType),
      ])
        .then(
          ([
            easyQuestions,
            mediumQuestions,
            hardQuestions,
            totalQuestionCount,
            totalScore,
          ]) => {
            let levelQuestions = {
              easyQuestionSkillWise: easyQuestions,
              mediumQuestionSkillWise: mediumQuestions,
              hardQuestionSkillWise: hardQuestions,
              totalQuestionCountSkill: totalQuestionCount,
              totalScore: totalScore,
            };

            // Do something with levelQuestions

            const obj = {
              skillId: data._id,
              skill: data.skills,
              questionType: skillType,
              level: `Easy (${levelQuestions.easyQuestionSkillWise}), Medium (${levelQuestions.mediumQuestionSkillWise}), Hard (${levelQuestions.hardQuestionSkillWise})`,
              questions: `${levelQuestions.totalQuestionCountSkill}`,
              score: `${levelQuestions.totalScore}`,
              random: false,
            };
            if (obj.questions > 0) {
              createTestContext.setAddedSkills(obj);
            } else {
              setisQuesionAvailable(true);
              setnonQuestionAvailableSkills((prev) => [...prev, obj]);
            }
          }
        )
        .catch((error) => {
          console.log(error);
          // Handle error
        });
    });
  };

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!finishStatus) {
      setisNavItem(true);
      window.history.pushState(null, null, window.location.pathname);
    }
  };

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

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);

    if (state.state === null) {
      createSkillData("MCQ");
      createSkillData("Programming");
    }
    setTestDuration(getTotalTestDuration());
    createTestContext.settestTime(getTotalTestDuration());

    return () => {
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  useEffect(() => {
    setTestDuration(getTotalTestDuration());
    createTestContext.settestTime(getTotalTestDuration());
  }, [createTestContext.question, createTestContext.addedSkills]);

  const closeSkillSetModel = () => {
    setAddSkillSetModel(false);
  };

  const closeEditSkillSetModel = () => {
    seteditSkillModel(false);
  };

  const closeButton = () => {
    setDeleteSkillSetModel(false);
  };

  const closeDurationButton = () => {
    setDurationModel(false);
  };

  const getEasyMCQQuestion = () => {
    const totaleasymcqquestion = createTestContext.question.reduce(
      (easymcqquestion, question) => {
        if (
          question?.questions.difficultyLevelId?.level === "easy" &&
          question?.questions.type === "MCQ"
        ) {
          easymcqquestion += 1;
        }
        return easymcqquestion;
      },
      0
    );

    return totaleasymcqquestion;
  };

  const getMediumMCQQuestion = () => {
    const totalMediummcqquestion = createTestContext.question.reduce(
      (mediummcqquestion, question) => {
        if (
          question?.questions.difficultyLevelId?.level === "medium" &&
          question?.questions.type === "MCQ"
        ) {
          mediummcqquestion += 1;
        }
        return mediummcqquestion;
      },
      0
    );
    return totalMediummcqquestion;
  };

  const getHardMCQQuestion = () => {
    const totalHardmcqquestion = createTestContext.question.reduce(
      (hardmcqquestion, question) => {
        if (
          question?.questions.difficultyLevelId?.level === "hard" &&
          question?.questions.type === "MCQ"
        ) {
          hardmcqquestion += 1;
        }
        return hardmcqquestion;
      },
      0
    );
    return totalHardmcqquestion;
  };

  const getEasyProgrammingQuestion = () => {
    const totaleasyProgrammingquestion = createTestContext.question.reduce(
      (easyProgrammingquestion, question) => {
        if (
          question?.questions.difficultyLevelId?.level === "easy" &&
          question?.questions.type === "Programming"
        ) {
          easyProgrammingquestion += 1;
        }
        return easyProgrammingquestion;
      },
      0
    );
    return totaleasyProgrammingquestion;
  };

  const getMediumProgrammingQuestion = () => {
    const totalMediumProgrammingquestion = createTestContext.question.reduce(
      (mediumProgrammingquestion, question) => {
        if (
          question?.questions.difficultyLevelId?.level === "medium" &&
          question?.questions.type === "Programming"
        ) {
          mediumProgrammingquestion += 1;
        }
        return mediumProgrammingquestion;
      },
      0
    );
    return totalMediumProgrammingquestion;
  };

  const getHardProgrammingQuestion = () => {
    const totalHardProgrammingquestion = createTestContext.question.reduce(
      (hardProgrammingquestion, question) => {
        if (
          question?.questions.difficultyLevelId?.level === "hard" &&
          question?.questions.type === "Programming"
        ) {
          hardProgrammingquestion += 1;
        }
        return hardProgrammingquestion;
      },
      0
    );
    return totalHardProgrammingquestion;
  };

  const getTotalMCQQuestion = () => {
    const totalmcqquestion = createTestContext.question.reduce(
      (mcqquestion, question) => {
        if (question.questions.type === "MCQ") {
          mcqquestion += 1;
        }
        return mcqquestion;
      },
      0
    );
    return totalmcqquestion;
  };

  const getTotalProgrammingQuestion = () => {
    const totalProgrammingquestion = createTestContext.question.reduce(
      (Programmingquestion, question) => {
        if (question.questions.type === "Programming") {
          Programmingquestion += 1;
        }
        return Programmingquestion;
      },
      0
    );
    return totalProgrammingquestion;
  };

  const getTotalMCQQuestionScore = () => {
    //check random skill
    const skills = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);
    //filter question of random skill
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
    let toalProgrammingQuestionScore = createTestContext.question.reduce(
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

  const getTotalTestDuration = () => {
    const totalTestDuration = createTestContext.question.reduce(
      (testDurationOfTest, question) => {
        testDurationOfTest =
          testDurationOfTest +
          parseInt(
            question.questions.type === "MCQ"
              ? question.questions.difficultyLevelId.mcqTime
              : question.questions.difficultyLevelId.programmingTime
          );
        return testDurationOfTest;
      },
      0
    );

    return (totalTestDuration / 60).toFixed(0);
  };

  const getTotalQuestionScoreAsPerSkillWise = (skills, type) => {
    const questions = createTestContext.question.filter((question) => {
      const skillExits = question.questions.skillsId
        .map((data) => data.skills)
        .filter(Boolean);
      return (
        question.questions.type === type &&
        question.skillId ===
          skillExits
            .filter((data) => data.skills === skills)
            .map((data) => data._id)[0]
      );
    });
    return questions.reduce((total, question) => total + question.score, 0);
  };

  const updateSkillData = (data) => {
    createTestContext.addedSkills.forEach((skillData) => {
      if (
        data.skill === skillData.skill &&
        data.questionType === skillData.questionType
      ) {
        skillData.skillId = data.skillId;
        skillData.skill = data.skill;
        skillData.questionType = data.questionType;
        skillData.level = data.level;
        skillData.questions = data.questions;
        skillData.score = data.score;
        skillData.random = data.random;
      }
    });

    setupdateRefresh({});
  };

  const addSkillSet = (data) => {
    createTestContext.setAddedSkills(data);
    const isAllSkillsetRandom = createTestContext.addedSkills.filter(
      (data) => data.random === true
    );
    if (
      isAllSkillsetRandom.length ===
      createTestContext.addedSkills.length + 1
    ) {
      createTestContext.setisRandomAll(true);
    } else {
      createTestContext.setisRandomAll(false);
    }
    setupdateRefresh({});
  };

  const deleteQuestion = async (type, skill) => {
    const deleteQuestionId = [];
    const deletedQuestions = [];
    createTestContext.question.forEach((data, index) => {
      //const skillExits = data.questions.skillsId.map((data) => data.skills.skills);
      if (data.skillId === skill && data.questions.type === type) {
        deleteQuestionId.push(createTestContext.question[index].questions._id);
        deletedQuestions.push(createTestContext.question[index].questions);
      }
    });

    const token = getCookie("Xh7ERL0G");

    deletedQuestions.forEach(async (question) => {
      const res = await axios.put(
        `${backend_url}question/updateQuestion/${question._id}`,
        {
          ...question,
          noOfTimesUsed: question.noOfTimesUsed,
        },
        { headers: { token: token } }
      );
    });

    let filterDeletedQuestionData = createTestContext.question.filter(
      (item) => !deleteQuestionId.includes(item.questions._id)
    );
    createTestContext.addDeleteQuestionData(filterDeletedQuestionData);
  };

  const deleteSkillset = async (skill, type) => {
    await deleteQuestion(type, skill);
    const skillName = createTestContext.addedSkills
      .filter((data) => data.skillId === skill)
      .map((data) => data.skill)[0];
    createTestContext.addedSkills.forEach((data, index) => {
      if (data.skillId === skill && data.questionType === type) {
        console.log(createTestContext.addedSkills.splice(index, 1));
      }
    });
    setupdateRefresh({});
    toast.success(`${skillName} skillset is deleted.`);
    closeButton();
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

  const navigatePage = (page) => {
    navigate(page);
    createTestContext.clearState();
  };

  const getNoOfSkillAdded = () => {
    const NoOfSkillAdded = createTestContext.addedSkills.reduce(
      (totalSkill, skillData) => {
        if (skillData.questions > 0) {
          totalSkill += 1;
        }
        return totalSkill;
      },
      0
    );
    return NoOfSkillAdded;
  };

  const randomAllSkillset = (e) => {
    createTestContext.setisRandomAll(e.target.checked);
    setisRandomAllSkillset(e.target.checked);
    createTestContext.addedSkills.forEach((data) => {
      if (!e.target.checked) {
        data.score = "Easy(0),Medium(0),Hard(0)";
      }
      data.random = e.target.checked;
    });
    setupdateRefresh({});
  };

  const randomSingleSkillset = (e, data1) => {
    createTestContext.addedSkills.forEach((data) => {
      if (data.skillId === data1.skillId) {
        data.random = e.target.checked;
        setisRandomModel(e.target.checked);
        if (e.target.checked) {
          setselectedSkillsetForRandom(data1);
        } else {
          data.score = "Easy(0),Medium(0),Hard(0)";
        }
      }
    });
    setupdateRefresh({});
    const isAllSkillsetRandom = createTestContext.addedSkills.filter(
      (data) => data.random === true
    );
    if (isAllSkillsetRandom.length === createTestContext.addedSkills.length) {
      createTestContext.setisRandomAll(true);
    } else {
      createTestContext.setisRandomAll(false);
    }
  };

  const addAllRandomSkillSetScore = (data) => {
    createTestContext.addedSkills.forEach((skillData) => {
      skillData.score = data?.score;
    });
    setisRandomAllSkillset(false);
  };

  const addRandomSkillScore = (data) => {
    createTestContext.addedSkills.forEach((skillData) => {
      if (
        skillData.skill === data.skillName &&
        skillData.questionType === data.questionType
      ) {
        skillData.score = data?.score;
      }
    });
    setisRandomModel(false);
  };

  const closeRandomAllSkillset = (data1) => {
    setisRandomAllSkillset(false);
    createTestContext.setisRandomAll(false);
    createTestContext.addedSkills.forEach(
      (data) => (data.random = data1.random)
    );
    const isAllSkillsetRandom = createTestContext.addedSkills.filter(
      (data) => data.random === true
    );
    if (isAllSkillsetRandom.length === createTestContext.addedSkills.length) {
      createTestContext.setisRandomAll(true);
    } else {
      createTestContext.setisRandomAll(false);
    }
    setupdateRefresh({});
  };

  const closeSingleSkillset = (data1) => {
    setisRandomModel(false);
    createTestContext.addedSkills.forEach((data) => {
      if (data.skill === data1.skill && data.questionType === data1.type) {
        data.random = false;
      }
    });
    const isAllSkillsetRandom = createTestContext.addedSkills.filter(
      (data) => data.random === true
    );
    if (isAllSkillsetRandom.length === createTestContext.addedSkills.length) {
      createTestContext.setisRandomAll(true);
    } else {
      createTestContext.setisRandomAll(false);
    }
    setupdateRefresh({});
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
      {isQuesionAvailable && (
        <NoQuestionAvailablePopup
          closeModal={() => setisQuesionAvailable(false)}
          nonQuestionAvailableSkills={nonQuestionAvailableSkills}
        />
      )}
      {isRandomAllSkillset ? (
        <RandomAllSkillSet
          addData={addAllRandomSkillSetScore}
          closeButton={closeRandomAllSkillset}
        />
      ) : (
        <></>
      )}
      {isRandomModel ? (
        <RandomSkillSet
          addData={addRandomSkillScore}
          skill={selectedSkillsetForRandom.skill}
          type={selectedSkillsetForRandom.questionType}
          level={selectedSkillsetForRandom.level.split(",")}
          closeButton={closeSingleSkillset}
        />
      ) : (
        <></>
      )}
      {isNavItem ? (
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
        />
      ) : (
        <></>
      )}
      {addSkillSetModel && (
        <AddSkillSet
          addData={addSkillSet}
          closeSkillSetModel={closeSkillSetModel}
          addSkill={addSkillSetModel}
        />
      )}
      {editSkillModel && (
        <AddSkillSet
          updateSkillData={updateSkillData}
          onEdit={true}
          questionData={createTestContext.addedSkills[questionIndex]}
          edit={true}
          closeSkillSetModel={closeEditSkillSetModel}
        />
      )}
      {deleteSkillSetModel && (
        <DeleteSkillSetModel
          closeButton={closeButton}
          skill={createTestContext.addedSkills[questionIndex]}
          onClickYes={() =>
            deleteSkillset(
              createTestContext.addedSkills[questionIndex].skillId,
              createTestContext.addedSkills[questionIndex].questionType
            )
          }
          onClickNo={closeButton}
        />
      )}
      {durationModel && (
        <TestDuration
          score={false}
          duration={testDuration}
          changeTestTime={(val) => {
            setTestDuration(val);
            createTestContext.settestTime(val);
          }}
          closeButton={closeDurationButton}
        />
      )}
      <div className="create-test-2">
        <div className="create-test-2-sidebar">
          <CreateTest2Sidebar active="test details" pageNo="1" />
        </div>

        <div className="create-test-2-content">
          <div className="test-2-content">
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
                    <span>Test Details</span>
                    <p>
                      Experience: {createTestContext.experience} years | Test
                      duration: {testDuration} mins{" "}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_2813_5675)">
                          <path
                            d="M7.9987 14.6663C11.6806 14.6663 14.6654 11.6816 14.6654 7.99967C14.6654 4.31778 11.6806 1.33301 7.9987 1.33301C4.3168 1.33301 1.33203 4.31778 1.33203 7.99967C1.33203 11.6816 4.3168 14.6663 7.9987 14.6663Z"
                            stroke="#696767"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8 5.33301V7.99967"
                            stroke="#696767"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8 10.667H8.00583"
                            stroke="#696767"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_2813_5675">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </p>
                  </div>
                </div>

                <div className="button-container">
                  <div
                    className="next-button"
                    onClick={() => navigate("/questionsoverview")}
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

            <div className="question-type-table">
              <table cellSpacing="0" className="question-table">
                <tr className="table-header">
                  <th>Question Type</th>
                  <th>Difficulty Level</th>
                  <th>Questions</th>
                  <th>Score</th>
                </tr>
                <tr>
                  <td>Multiple Choice Questions</td>
                  <td>
                    Easy ({getEasyMCQQuestion()}), Medium (
                    {getMediumMCQQuestion()}), Hard ({getHardMCQQuestion()})
                  </td>
                  <td>{getTotalMCQQuestion()}</td>
                  <td>{getTotalMCQQuestionScore()}</td>
                </tr>
                <tr>
                  <td>Programming</td>
                  <td>
                    Easy ({getEasyProgrammingQuestion()}), Medium (
                    {getMediumProgrammingQuestion()}), Hard (
                    {getHardProgrammingQuestion()})
                  </td>
                  <td>{getTotalProgrammingQuestion()}</td>
                  <td>{getTotalProgrammingQuestionScore()}</td>
                </tr>
                <tr>
                  <td className="duration">
                    Test Duration: {testDuration} Mins{" "}
                    <svg
                      onClick={() => {
                        setDurationModel(true);
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
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </td>
                  <td></td>
                  <td style={{ paddingRight: "0px", color: "#333333" }}>
                    Questions:{" "}
                    {parseInt(getTotalMCQQuestion()) +
                      parseInt(getTotalProgrammingQuestion())}
                  </td>
                  <td style={{ paddingRight: "37px", color: "#333333" }}>
                    Score:{" "}
                    {parseInt(getTotalMCQQuestionScore()) +
                      parseInt(getTotalProgrammingQuestionScore())}
                  </td>
                </tr>
              </table>
            </div>

            <div className="skillset-container">
              <div className="skill-heading">
                <span>Added Skillsets ({getNoOfSkillAdded()})</span>
                <div className="combine">
                  <div className="randomise-btn">
                    <label class="switch">
                      <input
                        checked={createTestContext.isRandomAll}
                        onChange={(e) => randomAllSkillset(e)}
                        type="checkbox"
                      />
                      <span class="slider round"></span>
                    </label>
                    <span>Randomized All</span>
                  </div>
                  <div
                    className="skillset-button"
                    onClick={() => {
                      setAddSkillSetModel(true);
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
                        d="M10.668 5.44434V13.2221"
                        stroke="#FF6812"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M6.77734 9.33398H14.5551"
                        stroke="#FF6812"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <span>Add Skillset</span>
                  </div>
                </div>
              </div>

              <div className="skillset-table">
                <table cellSpacing="0" className="skill-table">
                  <tr className="skill-table-header">
                    <th>Sr. No.</th>
                    <th>Skills</th>
                    <th>Question Type</th>
                    <th>Difficulty Level</th>
                    <th>
                      Questions (
                      {parseInt(getTotalMCQQuestion()) +
                        parseInt(getTotalProgrammingQuestion())}
                      )
                    </th>
                    <th>
                      Score (
                      {getTotalMCQQuestionScore() +
                        getTotalProgrammingQuestionScore()}
                      )
                    </th>
                    <th>Random</th>
                    <th>Edit</th>
                  </tr>
                  {createTestContext.addedSkills?.map((data, index) => {
                    return (
                      <tr>
                        <td>{1 + index}</td>
                        <td>{data.skill}</td>
                        <td>{data.questionType}</td>
                        <td>{data.level}</td>
                        <td>{data.questions}</td>
                        <td>
                          {data.random
                            ? isNaN(data.score)
                              ? parseInt(
                                  data.score
                                    ?.split(",")[0]
                                    ?.replace(/\D/g, "") *
                                    data.level
                                      ?.split(",")[0]
                                      ?.replace(/\D/g, "")
                                ) +
                                parseInt(
                                  data.score
                                    ?.split(",")[1]
                                    ?.replace(/\D/g, "") *
                                    data.level.split(",")[1]?.replace(/\D/g, "")
                                ) +
                                parseInt(
                                  data.score
                                    ?.split(",")[2]
                                    ?.replace(/\D/g, "") *
                                    data.level.split(",")[2]?.replace(/\D/g, "")
                                )
                              : 0
                            : getTotalQuestionScoreSkillWise(
                                data.skill,
                                data.questionType
                              )}
                        </td>
                        <td>
                          <label class="switch">
                            <input
                              checked={data.random}
                              onChange={(e) => randomSingleSkillset(e, data)}
                              type="checkbox"
                            />
                            <span class="slider round"></span>
                          </label>
                        </td>
                        <td>
                          <svg
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              seteditSkillModel(true);
                              setQuestionIndex(index);
                            }}
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12.642"
                              cy="13.1439"
                              r="12.642"
                              fill="#384455"
                            />
                            <path
                              d="M11.8555 17.9854H16.5962"
                              stroke="white"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M14.2244 8.75106C14.4339 8.5284 14.7182 8.40332 15.0145 8.40332C15.1613 8.40332 15.3066 8.43403 15.4421 8.49369C15.5777 8.55336 15.7009 8.64081 15.8046 8.75106C15.9084 8.8613 15.9907 8.99218 16.0469 9.13622C16.103 9.28027 16.1319 9.43465 16.1319 9.59056C16.1319 9.74647 16.103 9.90086 16.0469 10.0449C15.9907 10.1889 15.9084 10.3198 15.8046 10.4301L9.22028 17.426L7.11328 17.9856L7.64003 15.7469L14.2244 8.75106Z"
                              stroke="white"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>

                          <svg
                            onClick={() => {
                              setDeleteSkillSetModel(true);
                              setQuestionIndex(index);
                            }}
                            style={{ cursor: "pointer" }}
                            width="26"
                            height="26"
                            viewBox="0 0 26 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx="12.9271"
                              cy="13.1439"
                              r="12.642"
                              fill="#384455"
                            />
                            <path
                              d="M8.97656 10.7734H9.76669H16.0877"
                              stroke="white"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M15.2965 10.7736V16.3045C15.2965 16.514 15.2132 16.715 15.0651 16.8632C14.9169 17.0113 14.7159 17.0946 14.5064 17.0946H10.5557C10.3462 17.0946 10.1452 17.0113 9.99705 16.8632C9.84887 16.715 9.76562 16.514 9.76562 16.3045V10.7736M10.9508 10.7736V9.98348C10.9508 9.77393 11.0341 9.57296 11.1822 9.42478C11.3304 9.2766 11.5314 9.19336 11.7409 9.19336H13.3212C13.5307 9.19336 13.7317 9.2766 13.8799 9.42478C14.0281 9.57296 14.1113 9.77393 14.1113 9.98348V10.7736"
                              stroke="white"
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

export default CreateTest2;
