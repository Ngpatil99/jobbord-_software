import React, { useContext } from "react";
import "./index.css";
import { toast } from "react-toastify";
import { useState } from "react";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import CreateTestContext from "../../store/CreateTestContext";
const CancelToken = axios.CancelToken;
let cancel;

function AddSkillSet(props) {
  const createTestContext = useContext(CreateTestContext);
  const [skillSearchText, setskillSearchText] = useState("");

  const [searchSkillData, setsearchSkillData] = useState([]);
  const [info, setInfo] = useState({
    skillId: "",
    skill: "",
    questionType: "MCQ",
    level: "",
    questions: "",
    score: "",
    random: false,
  });
  const [showSkillSetData, setshowSkillSetData] = useState([]);
  const [type, setType] = useState("");
  const [easyMarks, setEasyMarks] = useState(0);
  const [mediumMarks, setMediumMarks] = useState(0);
  const [hardMarks, setHardMarks] = useState(0);
  const [easyMarksOptions, seteasyMarksOptions] = useState([]);
  const [mediumMarksOptions, setmediumMarksOptions] = useState([]);
  const [hardMarksOptions, sethardMarksOptions] = useState([]);

  const [easyMarksProgrammingOptions, seteasyMarksProgrammingOptions] =
    useState([]);
  const [mediumMarksProgrammingOptions, setmediumMarksProgrammingOptions] =
    useState([]);
  const [hardMarksProgrammingOptions, sethardMarksProgrammingOptions] =
    useState([]);

  const [isAddorUpdateClick, setisAddorUpdateClick] = useState(false);
  const [addSkillLoading, setaddSkillLoading] = useState(false);
  const [updateSkillLoading, setupdateSkillLoading] = useState(false);
  const [updateRefresh, setupdateRefresh] = useState({});

  const [easyScore, seteasyScore] = useState("");
  const [mediumScore, setmediumScore] = useState("");
  const [hardScore, sethardScore] = useState("");

  const [easyScoreError, seteasyScoreError] = useState(false);
  const [mediumScoreError, setmediumScoreError] = useState(false);
  const [hardScoreError, sethardScoreError] = useState(false);

  const [totaleasymcqquestion, settotaleasymcqquestion] = useState(0);
  const [totalmediumquestion, settotalmediumquestion] = useState(0);
  const [totalhardquestion, settotalhardquestion] = useState(0);

  const [easyMarksError, seteasyMarksError] = useState(false);
  const [mediumMarksError, setmediumMarksError] = useState(false);
  const [hardMarksError, sethardMarksError] = useState(false);

  useEffect(() => {
    if (props.questionData !== undefined) {
      setInfo({
        skill: props?.questionData?.skill,
        skillId: props?.questionData?.skillId,
      });
      const level = props?.questionData?.level.split(",");
      getUpdateSkillNoOfquestionAvailable();
      setType(props?.questionData?.questionType);
      setshowSkillSetData((prev) => [...prev, props?.questionData?.skill]);
      setEasyMarks(level[0]?.replace(/\D/g, ""));
      setMediumMarks(level[1]?.replace(/\D/g, ""));
      setHardMarks(level[2]?.replace(/\D/g, ""));
      if (props?.questionData?.random) {
        const score = props?.questionData?.score.split(",");
        seteasyScore(score[0]?.replace(/\D/g, ""));
        setmediumScore(score[1]?.replace(/\D/g, ""));
        sethardScore(score[2]?.replace(/\D/g, ""));
      }
    }
  }, [props.questionData]);

  const getUpdateSkillNoOfquestionAvailable = async () => {
    const token = getCookie("Xh7ERL0G");
    const decode = jwtDecode(token);
    const duplicateQuestions = createTestContext.question.filter((data) => {
      const skillExits = data.questions.skillsId
        .map((data) => data.skills._id)
        .filter(Boolean);
      return skillExits.includes(props?.questionData?.skillId);
    });
    const res = await axios.post(
      `${backend_url}question/getAddQuestionLevelAsPerSkillWise`,
      {
        type: [props?.questionData?.questionType],
        eliteQALibraryId: createTestContext.testCreationTypeDetails.includes(
          "EliteQA Library"
        )
          ? "632c16db596546cfa858136f"
          : "",
        createdBy: createTestContext.testCreationTypeDetails.includes(
          "My Library"
        )
          ? [`${decode.user_id}`]
          : undefined,
        skills: [props?.questionData?.skillId],
        createdByInOr:
          createTestContext.testCreationTypeDetails.length > 1 &&
          createTestContext.testCreationTypeDetails.includes("My Library")
            ? true
            : false,
        // healthScore: 20,
        //"question": createTestContext.question.filter(data=>data.skillId === props?.questionData?.skillId).map(data=>data.questions._id)
        question: duplicateQuestions.map((data) => data.questions._id),
      },
      { headers: { token: token } }
    );
    settotaleasymcqquestion(
      parseInt(props?.questionData?.level.split(",")[0]?.replace(/\D/g, "")) +
        parseInt(
          props?.questionData?.questionType === "MCQ"
            ? res.data.easyMCQQuestion
            : res.data.easyProgrammingQuestion
        )
    );
    settotalmediumquestion(
      parseInt(props?.questionData?.level.split(",")[1]?.replace(/\D/g, "")) +
        parseInt(
          props?.questionData?.questionType === "MCQ"
            ? res.data.mediumMCQQuestion
            : res.data.mediumProgrammingQuestion
        )
    );
    settotalhardquestion(
      parseInt(props?.questionData?.level.split(",")[2]?.replace(/\D/g, "")) +
        parseInt(
          props?.questionData?.questionType === "MCQ"
            ? res.data.hardMCQQuestion
            : res.data.hardProgrammingQuestion
        )
    );

    // settotaleasyProgrammingquestion(res.data.easyProgrammingQuestion)
    // settotalMediumProgrammingquestion(res.data.mediumProgrammingQuestion)
    // settotalHardProgrammingquestion(res.data.hardProgrammingQuestion)
    // const totaleasymcqquestion = (parseInt(props?.questionData?.level.split(",")[0]?.replace(/\D/g, "")) + parseInt(res.data.easyQuestion))
    // const totalmediumquestion = (parseInt(props?.questionData?.level.split(",")[1]?.replace(/\D/g, "")) + parseInt(res.data.mediumQuestion))
    // const totalhardquestion = (parseInt(props?.questionData?.level.split(",")[2]?.replace(/\D/g, "")) + parseInt(res.data.hardQuestion))
    // const totaleasyProgrammingquestion = (parseInt(props?.questionData?.level.split(",")[0]?.replace(/\D/g, "")) + parseInt(res.data.easyProgrammingQuestion))
    // const totalMediumProgrammingquestion = (parseInt(props?.questionData?.level.split(",")[1]?.replace(/\D/g, "")) + parseInt(res.data.mediumProgrammingQuestion))
    // const totalHardProgrammingquestion = (parseInt(props?.questionData?.level.split(",")[2]?.replace(/\D/g, "")) + parseInt(res.data.hardProgrammingQuestion))

    // for (let i = 1; i <= (( totaleasymcqquestion  > 10) ? 10 : totaleasymcqquestion); i++) {
    //     seteasyMarksOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= (( totalmediumquestion  > 10) ? 10 : totalmediumquestion); i++) {
    //     setmediumMarksOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= (( totalhardquestion  > 10) ? 10 : totalhardquestion); i++) {
    //     sethardMarksOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= (( totaleasyProgrammingquestion  > 10) ? 10 :totaleasyProgrammingquestion ); i++) {
    //     seteasyMarksProgrammingOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= (( (totalMediumProgrammingquestion) > 10) ? 10 : totalMediumProgrammingquestion); i++) {
    //     setmediumMarksProgrammingOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= (( ( totalHardProgrammingquestion ) > 10) ? 10 : totalHardProgrammingquestion); i++) {
    //     sethardMarksProgrammingOptions((prev) => [...prev, i])
    // }
  };

  const addSearchedSkill = async (skillName, id) => {
    if (
      !showSkillSetData.includes(skillName) &&
      showSkillSetData.length < 1 &&
      !createTestContext.addedSkills.some((data) =>
        data.skill === skillName ? true : false
      )
    ) {
      setshowSkillSetData([...showSkillSetData, skillName]);
      setInfo({ skill: skillName, skillId: id });
      setType("MCQ");
      onChangeQuestionType(id);
    } else {
      if (
        showSkillSetData.includes(skillName) ||
        createTestContext.addedSkills.some((data) =>
          data.skill === skillName ? true : false
        )
      ) {
        toast("You have added already that skill", {
          className: "toast-message",
        });
      } else {
        toast.error("Only one skill can select");
      }
    }
  };

  const removeSkill = (skillId) => {
    if (props.addSkill) {
      const filterSkillData = showSkillSetData.filter(
        (element) => element !== skillId
      );
      setshowSkillSetData(filterSkillData);
      seteasyMarksOptions([]);
      setmediumMarksOptions([]);
      sethardMarksOptions([]);

      seteasyMarksProgrammingOptions([]);
      setmediumMarksProgrammingOptions([]);
      sethardMarksProgrammingOptions([]);
      setType("");
      setEasyMarks(0);
      setMediumMarks(0);
      setHardMarks(0);
      toast("skill is removed...");
    } else {
      toast("you cannot delete this skill while editing skill");
    }
  };

  const searchSkill = async () => {
    try {
      if (props.addSkill) {
        const token = getCookie("Xh7ERL0G");
        const res = await axios.get(
          `${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`,
          { headers: { token: token } }
        );
        setsearchSkillData(res.data.data);
      } else {
        toast("you cannot search skill while editing skill.");
      }
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  // function to retrieve questions
  const getQuestions = async (difficultyLevelId, addNumberOfQuestion) => {
    if (addNumberOfQuestion > 0) {
      try {
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);
        const questions = createTestContext.question.filter((question) => {
          // const skillExits = question.questions.skillsId.map((data) => data.skills.skills).filter(Boolean);
          return (
            createTestContext.addedSkills
              .filter((skill) => skill.skill === props?.questionData?.skill)
              .map((data) => data.skill)[0] === props?.questionData?.skill
          );
        });
        const skillIds = createTestContext.addedSkills
          .filter((skill) => skill.skill === props?.questionData?.skill)
          .map((data) => data.skillId)[0];

        const res = await axios.post(
          `${backend_url}question/getQuestionAsPerExperience?page=1&limit=${addNumberOfQuestion}`,
          {
            type: type,
            createdBy:
              createTestContext.testCreationTypeDetails.includes(
                "EliteQA Library"
              ) &&
              createTestContext.testCreationTypeDetails.includes("My Library")
                ? ["632c16db596546cfa858136f", `${decode.user_id}`]
                : createTestContext.testCreationTypeDetails.includes(
                    "EliteQA Library"
                  )
                ? ["632c16db596546cfa858136f"]
                : [`${decode.user_id}`],
            skills: [skillIds === undefined ? info.skillId : skillIds],
            // healthScore: 20,
            difficultyLevelId: difficultyLevelId,
            question: createTestContext.question.map(
              (data) => data.questions._id
            ),
          },
          { headers: { token: token } }
        );

        res?.data?.data?.forEach(async (data) => {
          createTestContext.setQuestions({
            skillId: skillIds === undefined ? info.skillId : skillIds,
            questions: data,
          });
          // const res2 = await axios.put(
          //   `${backend_url}question/updateQuestion/${data._id}`,
          //   {
          //     // ...data,
          //     noOfTimesUsed:
          //       data.noOfTimesUsed > 0 ? data.noOfTimesUsed - 1 : 0,
          //   },
          //   { headers: { token: token } }
          // );
        });

        return res?.data?.data?.length;
      } catch (error) {
        console.log(error);
      }
    }
  };

  let AllSkillDeleteQuestionId = [];
  const deleteQuestion = async (level, noOfQuestions) => {
    const deleteQuestionId = [];
    createTestContext.question.forEach((data, index) => {
      // const skillExits = data.questions.skillsId.map((data) => data.skills.skills);
      if (
        data.questions.difficultyLevelId.level === level.split("(")[0].trim() &&
        data.questions.type === type &&
        data.skillId ===
          createTestContext.addedSkills
            .filter((data) => data.skill === props?.questionData.skill)
            .map((data) => data.skillId)[0] &&
        noOfQuestions > 0
      ) {
        deleteQuestionId.push(createTestContext.question[index].questions._id);
        AllSkillDeleteQuestionId.push(
          createTestContext.question[index].questions._id
        );
        noOfQuestions = noOfQuestions - 1;
      }
    });

    let filterDeletedQuestionData = createTestContext.question.filter(
      (item) => !AllSkillDeleteQuestionId.includes(item.questions._id)
    );
    createTestContext.addDeleteQuestionData(filterDeletedQuestionData);
    return deleteQuestionId.length;
  };

  const updateQuestions = async (level, marks, topicId) => {
    let NoOfQuestionAdded = 0;
    const numQuestions = parseInt(marks) - parseInt(level.replace(/\D/g, ""));
    if (numQuestions > 0) {
      NoOfQuestionAdded = await getQuestions([topicId], numQuestions);
    } else if (numQuestions < 0) {
      NoOfQuestionAdded = await deleteQuestion(
        level.toLowerCase(),
        Math.abs(numQuestions)
      );
    }
    if (numQuestions > 0) {
      return parseInt(NoOfQuestionAdded) + parseInt(level.replace(/\D/g, ""));
    } else {
      return parseInt(level.replace(/\D/g, "")) - parseInt(NoOfQuestionAdded);
    }
  };

  const updateSkillSet = async () => {
    let obj = {
      easyQuestionAdded: 0,
      mediumQuestionAdded: 0,
      hardQuestionAdded: 0,
    };
    const level = props?.questionData?.level.split(",");
    await Promise.all([
      (obj.easyQuestionAdded = updateQuestions(
        level[0],
        easyMarks,
        "641bd41c8782fdd946db740b"
      )),
      (obj.mediumQuestionAdded = updateQuestions(
        level[1],
        mediumMarks,
        "641bf53ce012709b89e6c2cc"
      )),
      (obj.hardQuestionAdded = updateQuestions(
        level[2],
        hardMarks,
        "641bf5c1e012709b89e6c2d2"
      )),
    ]);

    return obj;
  };

  const onClickAddOrUpdate = async () => {
    setisAddorUpdateClick(true);
    if (props.addSkill) {
      if (type !== "" && showSkillSetData.length > 0) {
        setaddSkillLoading(true);

        const easyQuestionAdded = await getQuestions(
          ["641bd41c8782fdd946db740b"],
          easyMarks
        );

        const mediumQuestionAdded = await getQuestions(
          ["641bf53ce012709b89e6c2cc"],
          mediumMarks
        );

        const hardQuestionAdded = await getQuestions(
          ["641bf5c1e012709b89e6c2d2"],
          hardMarks
        );

        if (
          parseInt(easyQuestionAdded !== undefined ? easyQuestionAdded : 0) +
            parseInt(
              mediumQuestionAdded !== undefined ? mediumQuestionAdded : 0
            ) +
            parseInt(hardQuestionAdded !== undefined ? hardQuestionAdded : 0) >
          0
        ) {
          props.addData({
            ...info,
            questionType: type,
            level: `Easy(${
              easyQuestionAdded !== undefined ? easyQuestionAdded : 0
            }), Medium(${
              mediumQuestionAdded !== undefined ? mediumQuestionAdded : 0
            }), Hard(${
              hardQuestionAdded !== undefined ? hardQuestionAdded : 0
            })`,
            questions: `${
              parseInt(
                easyQuestionAdded !== undefined ? easyQuestionAdded : 0
              ) +
              parseInt(
                mediumQuestionAdded !== undefined ? mediumQuestionAdded : 0
              ) +
              parseInt(hardQuestionAdded !== undefined ? hardQuestionAdded : 0)
            }`,
            score: "0",
            random: false,
          });
          toast.success(
            `Skillset${props.edit ? " edited" : " added"} succesfully.`
          );
          props.closeSkillSetModel();
        } else {
          toast.error("Please selct number of question easy, medium, hard");
        }

        setaddSkillLoading(false);
      }
    } else {
      if (type !== "" && showSkillSetData.length > 0) {
        setupdateSkillLoading(true);
        let easyQuestionAdded,
          mediumQuestionAdded,
          hardQuestionAdded = 0;
        const data = await updateSkillSet();
        await Promise.all([
          (easyQuestionAdded = await data.easyQuestionAdded),
          (mediumQuestionAdded = await data.mediumQuestionAdded),
          (hardQuestionAdded = await data.hardQuestionAdded),
        ]);
        if (props.questionData.random) {
          if (easyScore > 0 && mediumScore > 0 && hardScore > 0) {
            props.updateSkillData({
              ...info,
              questionType: type,
              level: `Easy(${
                easyQuestionAdded > 0 ? easyQuestionAdded : easyMarks
              }), Medium(${
                mediumQuestionAdded > 0 ? mediumQuestionAdded : mediumMarks
              }), Hard(${
                hardQuestionAdded > 0 ? hardQuestionAdded : hardMarks
              })`,
              questions: `${
                parseInt(
                  easyQuestionAdded > 0 ? easyQuestionAdded : easyMarks
                ) +
                parseInt(
                  mediumQuestionAdded > 0 ? mediumQuestionAdded : mediumMarks
                ) +
                parseInt(hardQuestionAdded > 0 ? hardQuestionAdded : hardMarks)
              }`,
              score: `Easy(${easyScore}),Medium(${mediumScore}),Hard(${hardScore})`,
              random: true,
            });
          }
        } else {
          props.updateSkillData({
            ...info,
            questionType: type,
            level: `Easy(${
              easyQuestionAdded > 0 ? easyQuestionAdded : easyMarks
            }), Medium(${
              mediumQuestionAdded > 0 ? mediumQuestionAdded : mediumMarks
            }), Hard(${hardQuestionAdded > 0 ? hardQuestionAdded : hardMarks})`,
            questions: `${
              parseInt(easyQuestionAdded > 0 ? easyQuestionAdded : easyMarks) +
              parseInt(
                mediumQuestionAdded > 0 ? mediumQuestionAdded : mediumMarks
              ) +
              parseInt(hardQuestionAdded > 0 ? hardQuestionAdded : hardMarks)
            }`,
            score: "0",
            random: false,
          });
        }

        props.closeSkillSetModel();
        toast.success(
          `Skillset${props.edit ? " edited" : " added"} succesfully.`
        );
        setupdateSkillLoading(false);
      }
    }
  };

  const onType = async (e) => {
    if (props.addSkill) {
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
    } else {
      toast("you cannot search skill while editing skill.");
    }
  };

  const onChangeQuestionType = async (searchSkillId) => {
    const token = getCookie("Xh7ERL0G");
    const decode = jwtDecode(token);
    const res = await axios.post(
      `${backend_url}question/getAddQuestionLevelAsPerSkillWise`,
      {
        eliteQALibraryId: createTestContext.testCreationTypeDetails.includes(
          "EliteQA Library"
        )
          ? "632c16db596546cfa858136f"
          : "",
        createdBy: createTestContext.testCreationTypeDetails.includes(
          "My Library"
        )
          ? [`${decode.user_id}`]
          : undefined,
        skills: [searchSkillId],
        createdByInOr:
          createTestContext.testCreationTypeDetails.length > 1 &&
          createTestContext.testCreationTypeDetails.includes("My Library")
            ? true
            : false,
        // healthScore: 20,
        question: createTestContext.question.map((data) => data.questions._id),
      },
      { headers: { token: token } }
    );
    settotaleasymcqquestion(res.data.easyMCQQuestion);
    settotalmediumquestion(res.data.mediumMCQQuestion);
    settotalhardquestion(res.data.hardMCQQuestion);

    // settotaleasyProgrammingquestion(res.data.easyProgrammingQuestion)
    // settotalMediumProgrammingquestion(res.data.mediumProgrammingQuestion)
    // settotalHardProgrammingquestion(res.data.hardProgrammingQuestion)

    // for (let i = 1; i <= ((res.data.easyMCQQuestion > 10) ? 10 : res.data.easyMCQQuestion); i++) {
    //     seteasyMarksOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= ((res.data.mediumMCQQuestion > 10) ? 10 : res.data.mediumMCQQuestion); i++) {
    //     setmediumMarksOptions((prev) => [...prev, i])
    // }

    // for (let i = 1; i <= ((res.data.hardMCQQuestion > 10) ? 10 : res.data.hardMCQQuestion); i++) {
    //     sethardMarksOptions((prev) => [...prev, i])
    // }
  };

  const disabledAddButton = () => {
    if (
      easyMarks <= totaleasymcqquestion &&
      easyMarks >= 0 &&
      easyMarks !== "" &&
      mediumMarks <= totalmediumquestion &&
      mediumMarks >= 0 &&
      mediumMarks !== "" &&
      hardMarks <= totalhardquestion &&
      hardMarks >= 0 &&
      hardMarks !== "" &&
      (props?.questionData?.random
        ? easyScore > 0 && mediumScore > 0 && hardScore > 0
        : true)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const onChangeEasyQuestionCount = (e) => {
    setEasyMarks(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value) ||
      e.target.value > totaleasymcqquestion
    ) {
      seteasyMarksError(true);
    } else {
      seteasyMarksError(true);
    }
  };

  const onChangeMediumQuestionCount = (e) => {
    setMediumMarks(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value) ||
      e.target.value > totalmediumquestion
    ) {
      setmediumMarksError(true);
    } else {
      setmediumMarksError(false);
    }
  };

  const onChangeHardQuestionCount = (e) => {
    setHardMarks(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value) ||
      e.target.value > totalhardquestion
    ) {
      sethardMarksError(true);
    } else {
      sethardMarksError(false);
    }
  };
  const onChangeEasyScore = (e) => {
    seteasyScore(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value)
    ) {
      seteasyScoreError(true);
    } else {
      seteasyScoreError(false);
    }
  };

  const onChangeMediumScore = (e) => {
    setmediumScore(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value)
    ) {
      setmediumScoreError(true);
    } else {
      setmediumScoreError(false);
    }
  };

  const onChangeHardScore = (e) => {
    sethardScore(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value)
    ) {
      sethardScoreError(true);
    } else {
      sethardScoreError(false);
    }
  };

  return (
    <div className="add-skillset-container">
      <div className="skillset-type-box">
        <div className="header">
          <div className="title">
            <span>{props.addSkill ? "Add" : "Edit"} Skillset</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={props.closeSkillSetModel}
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

        <div className="details">
          <div className="experience">
            {props.addSkill ? (
              <>
                <span>Choose Skill</span>
                <div className="select-box">
                  <svg
                    onClick={() => searchSkill()}
                    className="search-svg"
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.25 14.7666C11.5637 14.7666 14.25 12.0803 14.25 8.7666C14.25 5.45289 11.5637 2.7666 8.25 2.7666C4.93629 2.7666 2.25 5.45289 2.25 8.7666C2.25 12.0803 4.93629 14.7666 8.25 14.7666Z"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M15.7508 16.2664L12.4883 13.0039"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <input
                    onChange={onType}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        searchSkill();
                      }
                    }}
                    value={skillSearchText}
                    type="text"
                    name=""
                    id=""
                  />
                  {skillSearchText !== "" ? (
                    <svg
                      style={{
                        cursor: "pointer",
                        position: "absolute",
                        top: "16px",
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
              </>
            ) : (
              <></>
            )}
            {showSkillSetData.length === 0 && isAddorUpdateClick && (
              <div>Please add skill.</div>
            )}
            <div className="skill-list-item-container">
              {showSkillSetData?.map((data) => {
                return (
                  <button>
                    <span>{data}</span>
                    {/* <svg onClick={() => removeSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                            <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                            <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                        </svg> */}
                    <svg
                      className="right-icon"
                      width="20"
                      height="21"
                      viewBox="0 0 20 21"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10.5" r="10" fill="#00C49A" />
                      <path
                        d="M13.5 7.75L8.6875 12.5625L6.5 10.375"
                        stroke="white"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <svg
                      className="cancel-icon"
                      onClick={() => {
                        removeSkill(data);
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

            {skillSearchText !== "" && searchSkillData.length ? (
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
                        onClick={() =>
                          addSearchedSkill(data?.skills, data?._id)
                        }
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
          {props.addSkill ? (
            <div className="job-role">
              <span>Question Type</span>
              <div className="select-box">
                <select
                  disabled={props.addSkill ? false : true}
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  name=""
                  id=""
                >
                  <option value={0}>Select</option>
                  <option value="MCQ">MCQ</option>
                  <option value="Programming">Programming</option>
                </select>
              </div>
              {type === "" && isAddorUpdateClick && (
                <div>Please select question type.</div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <div className="skill-table">
          <table className="skillset" cellSpacing="0px">
            <tr>
              <th>Difficulty</th>
              <th>
                Question Count (
                {showSkillSetData.length
                  ? parseInt(easyMarks === "" ? 0 : easyMarks) +
                    parseInt(mediumMarks === "" ? 0 : mediumMarks) +
                    parseInt(hardMarks === "" ? 0 : hardMarks)
                  : 0}
                )
              </th>
              {props?.questionData?.random ? <th>Score</th> : <></>}
            </tr>
            <tr>
              <td>
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
                Easy ({totaleasymcqquestion})
              </td>
              <td>
                {/* {(type !== "Programming" ? easyMarksOptions : easyMarksProgrammingOptions).length ?
                                    <select value={easyMarks} onChange={(e) => { setEasyMarks(e.target.value) }} name="" id="">
                                        <option value={0}>Select</option>
                                        {(type !== "Programming" ? easyMarksOptions : easyMarksProgrammingOptions).map((data) => {
                                            return <option value={data}>{data}</option>
                                        })

                                        }
                                    </select> : <span>{showSkillSetData.length?"No question available":"-"} </span>
                                } */}
                <input
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(evt) =>
                    (evt.key === "e" ||
                      evt.keyCode === 190 ||
                      evt.keyCode === 110) &&
                    evt.preventDefault()
                  }
                  min={0}
                  max={100}
                  value={easyMarks}
                  defaultValue={easyMarks ? easyMarks : 0}
                  onChange={onChangeEasyQuestionCount}
                  type="number"
                />
                {easyMarksError && easyMarks === "" ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    Enter number of question
                  </p>
                ) : (
                  <></>
                )}

                {easyMarks < 0 ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    Number of question should be greater than zero.
                  </p>
                ) : (
                  <></>
                )}
                {easyMarks > totaleasymcqquestion ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    {`Number of questions should be <= ${totaleasymcqquestion}`}
                  </p>
                ) : (
                  <></>
                )}
              </td>
              {props?.questionData?.random ? (
                <td>
                  <input
                    maxLength={3}
                    value={easyScore}
                    onChange={onChangeEasyScore}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.keyCode === 190 ||
                        evt.keyCode === 110) &&
                      evt.preventDefault()
                    }
                    min={0}
                    max={100}
                    type="number"
                  />
                  {easyScoreError && easyScore === "" ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Enter score
                    </p>
                  ) : (
                    <></>
                  )}
                  {easyScore === "0" ||
                  /^0+$|^0*-0+$/.test(easyScore) ||
                  easyScore < 0 ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Score should be greater than zero.
                    </p>
                  ) : (
                    <></>
                  )}
                </td>
              ) : (
                <></>
              )}
            </tr>
            <tr>
              <td>
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
                Medium ({totalmediumquestion})
              </td>
              <td>
                {/* {(type !== "Programming" ? mediumMarksOptions : mediumMarksProgrammingOptions).length ?
                                    <select value={mediumMarks} onChange={(e) => { setMediumMarks(e.target.value) }} name="" id="">
                                        <option value={0}>Select</option>
                                        {(type !== "Programming" ? mediumMarksOptions : mediumMarksProgrammingOptions).map((data) => {
                                            return <option value={data}>{data}</option>
                                        })
                                        }
                                    </select> : <span>{showSkillSetData.length?"No question available":"-"}</span>
                                } */}
                <input
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(evt) =>
                    (evt.key === "e" ||
                      evt.keyCode === 190 ||
                      evt.keyCode === 110) &&
                    evt.preventDefault()
                  }
                  min={0}
                  max={100}
                  value={mediumMarks}
                  onChange={onChangeMediumQuestionCount}
                  type="number"
                />
                {mediumMarksError && mediumMarks === "" ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    Enter number of questions
                  </p>
                ) : (
                  <></>
                )}
                {mediumMarks < 0 ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    Number of question should be greater than zero.
                  </p>
                ) : (
                  <></>
                )}
                {mediumMarks > totalmediumquestion ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    {`Number of questions should be <= ${totalmediumquestion}`}
                  </p>
                ) : (
                  <></>
                )}
              </td>
              {props?.questionData?.random ? (
                <td>
                  <input
                    maxLength={3}
                    value={mediumScore}
                    onChange={onChangeMediumScore}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.keyCode === 190 ||
                        evt.keyCode === 110) &&
                      evt.preventDefault()
                    }
                    min={0}
                    max={100}
                    type="number"
                  />
                  {mediumScoreError && mediumScore === "" ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Enter score
                    </p>
                  ) : (
                    <></>
                  )}
                  {mediumScore === "0" ||
                  /^0+$|^0*-0+$/.test(mediumScore) ||
                  mediumScore < 0 ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Score should be greater than zero.
                    </p>
                  ) : (
                    <></>
                  )}
                </td>
              ) : (
                <></>
              )}
            </tr>
            <tr>
              <td>
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
                Hard ({totalhardquestion}){" "}
              </td>
              <td>
                {/* {(type !== "Programming" ? hardMarksOptions : hardMarksProgrammingOptions).length ?
                                    <select value={hardMarks} onChange={(e) => { setHardMarks(e.target.value) }} name="" id="">

                                        <option value={0}>Select</option>
                                        {(type !== "Programming" ? hardMarksOptions : hardMarksProgrammingOptions).map((data) => {
                                            return <option value={data}>{data}</option>
                                        })
                                        }
                                    </select>:<span>{showSkillSetData.length?"No question available":"-"}</span>
                                } */}
                <input
                  onWheel={(e) => e.target.blur()}
                  onKeyDown={(evt) =>
                    (evt.key === "e" ||
                      evt.keyCode === 190 ||
                      evt.keyCode === 110) &&
                    evt.preventDefault()
                  }
                  min={0}
                  max={100}
                  value={hardMarks}
                  onChange={onChangeHardQuestionCount}
                  type="number"
                />
                {hardMarksError && hardMarks === "" ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    Enter number of question
                  </p>
                ) : (
                  <></>
                )}
                {hardMarks < 0 ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    Number of question should be greater than zero.
                  </p>
                ) : (
                  <></>
                )}
                {hardMarks > totaleasymcqquestion ? (
                  <p
                    style={{ color: "red", fontSize: 12, fontWeight: "normal" }}
                  >
                    {`Number of questions should be <= ${totalhardquestion}`}
                  </p>
                ) : (
                  <></>
                )}
              </td>
              {props?.questionData?.random ? (
                <td>
                  <input
                    maxLength={3}
                    value={hardScore}
                    onChange={onChangeHardScore}
                    onWheel={(e) => e.target.blur()}
                    onKeyDown={(evt) =>
                      (evt.key === "e" ||
                        evt.keyCode === 190 ||
                        evt.keyCode === 110) &&
                      evt.preventDefault()
                    }
                    min={0}
                    max={100}
                    type="number"
                  />
                  {hardScoreError && hardScore === "" ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Enter score
                    </p>
                  ) : (
                    <></>
                  )}
                  {hardScore === "0" ||
                  /^0+$|^0*-0+$/.test(hardScore) ||
                  hardScore < 0 ? (
                    <p
                      style={{
                        color: "red",
                        fontSize: 12,
                        fontWeight: "normal",
                      }}
                    >
                      Score should be greater than zero.
                    </p>
                  ) : (
                    <></>
                  )}
                </td>
              ) : (
                <></>
              )}
            </tr>
          </table>
        </div>

        <div className="button" style={{ marginTop: "5px" }}>
          <div className="cancel-btn" onClick={props.closeSkillSetModel}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginRight: "10px" }}
            >
              <circle cx="9" cy="9" r="9" fill="white" />
              <path
                d="M12.5 5.5L5.5 12.5"
                stroke="#FF6812"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 5.5L12.5 12.5"
                stroke="#FF6812"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <button>Cancel</button>
          </div>
          {disabledAddButton() ? (
            <div className="next-btn" onClick={onClickAddOrUpdate}>
              {addSkillLoading || updateSkillLoading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "10px" }}
                  >
                    <circle cx="9" cy="9" r="9" fill="white" />
                    <path
                      d="M9.01826 4.0505L8.97489 13.9499"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.04688 8.97852L13.9463 9.02188"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <button>{props.addSkill ? "Add" : "Update"}</button>
                </>
              )}
            </div>
          ) : (
            <div style={{ background: "#C8C8C8" }} className="next-btn">
              {addSkillLoading || updateSkillLoading ? (
                <div className="loader"></div>
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ marginRight: "10px" }}
                  >
                    <circle cx="9" cy="9" r="9" fill="white" />
                    <path
                      d="M9.01826 4.0505L8.97489 13.9499"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4.04688 8.97852L13.9463 9.02188"
                      stroke="#00C49A"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>

                  <button style={{ background: "#C8C8C8" }}>
                    {props.addSkill ? "Add" : "Update"}
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddSkillSet;
