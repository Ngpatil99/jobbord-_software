import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import jwtDecode from "jwt-decode";
import { backend_url, getCookie } from "../../constant";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import LibraryCard from "./Card";
import "./index.css";
import LibraryCardSkeleton from "../../component/LibraryCardSkeleton";
import QuestionTypeModel from "../../component/QuestionTypeModel";
import QuestionPreviewModel from "../../component/QuestionPreviewModel/index";
import DeletePopupModel from "../../component/DeletePopupModel/DeletePopupModel";
import EditQuestionModel from "../../component/EditQuestionModel";
import NavigationBar2 from "../../component/ChooseNavigationBar/NavigationBar2";
import CreateTestContext from "../../store/CreateTestContext";
import AddSkill from "./AddSkill";
import AddMultipleSkill from "./AddMultipleSkill";
import qs from "qs";
let cancelToken;

const ChooseFromLibrary = () => {
  const navigate = useNavigate();
  const state = useLocation();
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });
  const isOverview = query.isOverview;
  const testId = query.testId;
  const createTestContext = useContext(CreateTestContext);
  const [deleteQuestionModel, setdeleteQuestionModel] = useState(false);
  const [selectQuestionForDelete, setselectQuestionForDelete] = useState("");
  const [selectedSource, setselectedSource] = useState([]);
  const [selectedSkills, setselectedSkills] = useState([]);
  const [selectedDifficultLevel, setselectedDifficultLevel] = useState([]);
  const [selectedQuestionType, setselectedQuestionType] = useState([]);

  const [questionData, setquestionData] = useState([]);
  const [loading, setloading] = useState(true);
  const token = getCookie("Xh7ERL0G");
  const decode = jwtDecode(token);

  console.log(createTestContext.testId);

  const [source, setsource] = useState([
    { name: "EliteQA Library", status: true, _id: "632c16db596546cfa858136f" },
    { name: "My Library", status: false, _id: decode?.client?._id },
    { name: "Draft", status: false, _id: "" },
  ]);
  const [skills, setskills] = useState([]);
  const [difficultLevel, setdifficultLevel] = useState([
    { name: "easy", status: false, _id: "641bd41c8782fdd946db740b" },
    { name: "medium", status: false, _id: "641bf53ce012709b89e6c2cc" },
    { name: "hard", status: false, _id: "641bf5c1e012709b89e6c2d2" },
  ]);
  const [questionType, setquestionType] = useState([
    { name: "MCQ", status: false },
    { name: "Programming", status: false },
  ]);
  const [searchQuestion, setsearchQuestion] = useState("");
  const [loadingArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [searchData, setsearchData] = useState([]);
  const [searchLoading, setsearchLoading] = useState(false);
  const [searchFilter, setsearchFilter] = useState(false);
  const [skillSearchText, setskillSearchText] = useState("");
  const [searchSkillData, setsearchSkillData] = useState([]);
  const [closesearchSkillModel, setclosesearchSkillModel] = useState(true);

  const [sourceAllSelected, setsourceAllSelected] = useState(false);
  const [skillsAllSelected, setskillsAllSelected] = useState(false);
  const [difficultyAllLevelSelected, setdifficultyAllLevelSelected] =
    useState(false);
  const [questionTypeAllSelected, setquestionTypeAllSelected] = useState(false);
  const [createQuestion, setcreateQuestion] = useState(false);
  const [selectedQuestion, setselectedQuestion] = useState("");
  const [questionPreview, setquestionPreview] = useState(false);
  const [editQuestion, seteditQuestion] = useState(false);
  const [selectedQuestionData, setselectedQuestionData] = useState("");
  const [singleSkilledQuestions, setSingleSkilledQuestions] = useState();

  const [selectedQuestionIndex, setselectedQuestionIndex] = useState("");
  const [addedQues, setAddedques] = useState([]);
  const [allSelectedQues, setAllSelectedQues] = useState([]);
  const [userClientID, setuserClientID] = useState("");
  const [selectMutipleQuestion, setselectMutipleQuestion] = useState([]);
  const [searchPage, setsearchPage] = useState(1);
  const [paginationStopForSearch, setpaginationStopForSearch] = useState(true);
  const [page, setPage] = useState(1);
  const [pageForMyLibrary, setpageForMyLibrary] = useState(1);
  const [pageForDraft, setpageForDraft] = useState(1);

  //filteration state
  const [isfilter, setisfilter] = useState(false);
  const [filterTestData, setfilterTestData] = useState([]);
  const [paginationStopForFilter, setpaginationStopForFilter] = useState(true);
  const [isPaginationActive, setisPaginationActive] = useState(false);
  const [searchResultCount, setsearchResultCount] = useState("");
  const [filterResultCount, setfilterResultCount] = useState("");
  const [PaginationLoading, setPaginationLoading] = useState(false);
  const [nonFilterResultCount, setnonFilterResultCount] = useState("");
  const [paginationStop, setpaginationStop] = useState(true);

  const [addSkillModal, setaddSkillModal] = useState(false);
  const [isSkillAdded, setisSkillAdded] = useState(false);
  const [selectedSkillToAdd, setselectedSkillToAdd] = useState([]);

  const [addMutipleSkillModal, setaddMutipleSkillModal] = useState(false);
  const [selectedMutipleObjectSkillAdd, setselectedMutipleObjectSkillAdd] =
    useState([]);

  useEffect(() => {
    //getAllEliteQALibrary()
    const token = getCookie("Xh7ERL0G");
    const decode = jwtDecode(token);
    setuserClientID(decode.client._id);
    const isMyLibrarySelected =
      !createTestContext.testCreationTypeDetails.includes("My Library");
    const isEliteLibrarySelected =
      !createTestContext.testCreationTypeDetails.includes("EliteQA Library");

    onClickSource({ name: "My Library", status: isMyLibrarySelected });
    onClickSource({ name: "EliteQA Library", status: isEliteLibrarySelected });
    createTestContext?.addedSkills
      ?.filter((v, i, a) => a.findIndex((v2) => v2.skill === v.skill) === i)
      .forEach((data) => {
        if (data.questions > 0) {
          setselectedSkills((prev) => [...prev, data.skillId]);
          setskills((prev) => [
            ...prev,
            { name: data?.skill, status: true, _id: data.skillId },
          ]);
        }
      });

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const filterLibraryParameter = async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (cancelToken) {
          cancelToken.cancel("Operations cancelled due to new request");
        }
        cancelToken = axios.CancelToken.source();
        setloading(true);
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);

        const res = await axios.post(
          `${backend_url}question/filterQuestionOptimize/${decode?.client?._id}?page=${page}&limit=50`,
          {
            source: selectedSource,
            skill: selectedSkills,
            difficultlevel: selectedDifficultLevel,
            questionType: selectedQuestionType,
            searchText: searchQuestion,
            status: selectedSource.includes("") ? "draft" : undefined,
            eliteQALibraryId: selectedSource.filter(
              (data) => data !== decode?.client?._id
            )[0],
            createdBy:
              //send only for my Library source
              selectedSource.includes(decode?.client?._id)
                ? decode?.user_id
                : undefined,
            createdByInOr:
              selectedSource.length > 1 &&
              selectedSource.includes(decode?.client?._id)
                ? true
                : false,
          },
          { cancelToken: cancelToken.token, headers: { token: token } }
        );
        if (res.data.data.length < 50) {
          setpaginationStopForFilter(false);
          //setisPaginationActive(false)
        }

        if (page > 1) {
          res.data.data.forEach((data) => {
            const found = filterTestData.some((el) => el._id === data._id);
            if (!found) {
              setfilterTestData((prev) => [...prev, data]);
            }
          });
        } else {
          setfilterTestData(res.data.data);
        }
        setfilterResultCount(res.data.NoOfRecord);
        setloading(false);
        setPage((prev) => prev + 1);
        resolve("done");
      } catch (error) {
        if (error.message === "Operations cancelled due to new request") {
          //setsearchLoading(false);
          //setsearchFilter(false);
          reject(error);
        } else {
          reject(error);
          setloading(false);
        }
      }
    });
  };

  useEffect(() => {
    if (
      selectedSource.length !== 0 ||
      selectedSkills.length !== 0 ||
      selectedDifficultLevel.length !== 0 ||
      selectedQuestionType.length !== 0
    ) {
      setisfilter(true);
      setsearchFilter(false);
      setloading(true);
      filterLibraryParameter()
        .then((res) => {
          setloading(false);
        })
        .catch((error) => {
          setloading(false);
        });
    } else {
      setisfilter(false);
    }
  }, [
    selectedSource,
    selectedSkills,
    selectedDifficultLevel,
    selectedQuestionType,
  ]);

  const clearSearchText = async () => {
    setsearchQuestion("");
    setsearchFilter(false);
    setloading(true);
    try {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();

      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);

      const res = await axios.post(
        `${backend_url}question/filterQuestionOptimize/${decode?.client?._id}?page=1&limit=50`,
        {
          source: selectedSource,
          skill: selectedSkills,
          difficultlevel: selectedDifficultLevel,
          questionType: selectedQuestionType,
          status: selectedSource.includes("") ? "draft" : undefined,
          createdBy: selectedSource.includes(decode?.client?._id)
            ? decode?.user_id
            : undefined,
        },
        { cancelToken: cancelToken.token, headers: { token: token } }
      );
      if (res.data.data.length < 50) {
        setpaginationStopForFilter(false);
        //setisPaginationActive(false)
      }

      if (page > 1) {
        res.data.data.forEach((data) => {
          const found = filterTestData.some((el) => el._id === data._id);
          if (!found) {
            setfilterTestData((prev) => [...prev, data]);
          }
        });
      } else {
        setfilterTestData(res.data.data);
      }
      setfilterResultCount(res.data.NoOfRecord);
      setloading(false);
      //setPage((prev)=>prev+1)
    } catch (error) {
      setloading(false);
    }
  };

  useEffect(() => {
    setsearchPage(1);
    setpaginationStopForSearch(true);
    setisPaginationActive(false);
  }, [searchQuestion]);

  const getAllDraftQuestions = async () => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);

      const resofAllDraftQuestionClientID = await axios.post(
        `${backend_url}question/findDraftQuestionPerClientID/${
          decode.client._id
        }?page=${1}&limit=50`,
        { status: "draft" },
        { headers: { token: token } }
      );
      resofAllDraftQuestionClientID.data.data.forEach((element) => {
        element.sourceSelected = "Draft";
      });

      setloading(false);
      resofAllDraftQuestionClientID.data.data.forEach((element) => {
        setquestionData((prev) => [...prev, element]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const getAllEliteQALibrary = async () => {
    try {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const resofAllQuestionClientID = await axios.get(
        `${backend_url}question/findQuestionPerClientID/632c16db596546cfa858136f?page=${1}&limit=50`,
        { cancelToken: cancelToken.token, headers: { token: token } }
      );
      resofAllQuestionClientID.data.data.forEach((element) => {
        element.sourceSelected = "EliteQA Library";
      });

      setloading(false);
      resofAllQuestionClientID.data.data.forEach((element) => {
        setquestionData((prev) => [...prev, element]);
      });
    } catch (error) {
      if (error.message === "Operations cancelled due to new request") {
      } else {
        setloading(false);
      }
    }
  };

  const onClickAllSource = async (status) => {
    setquestionData([]);
    setsourceAllSelected(() => status);
    setpaginationStopForFilter(true);
    setpaginationStop(true);
    setpaginationStopForSearch(true);

    if (status) {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);

      setselectedSource(["632c16db596546cfa858136f", decode?.client?._id]);
      let AllQuestion = [];

      questionData.length = 0;
      const res = source.map((sourceData) => {
        sourceData.status = true;
        return sourceData;
      });

      setsource(res);

      //Elite library
      // const resofAllEliteQuestionClientID = await axios.get(`${backend_url}question/findQuestionPerClientID/632c16db596546cfa858136f`, { headers: { "token": token } })
      // resofAllEliteQuestionClientID.data.data.forEach(element => {
      //     element.sourceSelected = "EliteQA Library"
      // });

      // resofAllEliteQuestionClientID.data.data.forEach(element => {
      //     AllQuestion.push(element)
      // })

      //My library
      // const resofAllQuestionClientID = await axios.get(`${backend_url}question/findQuestionPerClientID/${decode.client._id}`, { headers: { "token": token } })
      // resofAllQuestionClientID.data.data.forEach(element => {
      //     element.sourceSelected = "My Library"
      // });

      // resofAllQuestionClientID.data.data.forEach(element => {
      //     AllQuestion.push(element)
      // })
      //Draft library
      // const resofAllDraftQuestionClientID = await axios.post(`${backend_url}question/findDraftQuestionPerClientID/${decode.client._id}`, { status: 'draft' }, { headers: { "token": token } })
      // resofAllDraftQuestionClientID.data.data.forEach(element => {
      //     element.sourceSelected = "Draft"
      // });

      // setloading(false)
      // resofAllDraftQuestionClientID.data.data.forEach(element => {
      //     AllQuestion.push(element)
      // })
      setquestionData(AllQuestion);
    } else {
      setloading(true);
      setselectedSource(["632c16db596546cfa858136f"]);
      const res = source.map((sourceData) => {
        if (sourceData.name === "EliteQA Library") {
          sourceData.status = true;
          // if (sourceData.status) {
          //     getAllEliteQALibrary()
          // }
        } else {
          sourceData.status = false;
        }
        return sourceData;
      });
      setsource(res);
    }
  };

  const onClickSource = (data) => {
    const res = source.map((sourceData) => {
      if (sourceData.name === data.name) {
        sourceData.status = !data.status;

        setsourceAllSelected(false);
        setPage(1);
        setpaginationStopForFilter(true);
        setpaginationStop(true);
        setpaginationStopForSearch(true);
        if (data.name === "EliteQA Library") {
          if (sourceData.status) {
            const filterSource = questionData?.filter(
              (filterdata) => filterdata.sourceSelected !== "EliteQA Library"
            );
            setquestionData(filterSource);
            getAllEliteQALibrary();
          } else {
            setPage(1);
            const filterSource = questionData?.filter(
              (filterdata) => filterdata.sourceSelected !== "EliteQA Library"
            );
            setquestionData(filterSource);
            if (source.filter((d) => d.status).length === 0) {
              // If no sources are selected, select the first source by default

              source[0].status = true;
              setselectedSource([source[0]._id]);
              setquestionData(
                questionData?.filter(
                  (filterdata) => filterdata.sourceSelected !== source[0].name
                )
              );
            }
          }
        }
        if (data.name === "My Library") {
          if (sourceData.status) {
            const filterSource = questionData?.filter(
              (filterdata) => filterdata.sourceSelected !== "My Library"
            );
            setquestionData(filterSource);
            // getAllQuestionAsperClientID()
          } else {
            setpageForMyLibrary(1);
            const filterSource = questionData?.filter(
              (filterdata) => filterdata.sourceSelected !== "My Library"
            );
            setquestionData(filterSource);
            if (source.filter((d) => d.status).length === 0) {
              // If no sources are selected, select the first source by default

              source[0].status = true;
              setselectedSource([source[0]._id]);
              setquestionData(
                questionData?.filter(
                  (filterdata) => filterdata.sourceSelected !== source[0].name
                )
              );
            }
          }
        }

        // if (data.name === "Draft") {
        //     if (sourceData.status) {
        //         const filterSource = questionData?.filter(filterdata => filterdata.sourceSelected !== "Draft")
        //         setquestionData(filterSource)
        //         //  getAllDraftQuestions()
        //     } else {
        //         setpageForDraft(1)
        //         const filterSource = questionData?.filter(filterdata => filterdata.sourceSelected !== "Draft")
        //         setquestionData(filterSource)
        //         if (source?.filter(d => d.status).length === 0) {
        //             // If no sources are selected, select the first source by default

        //             source[0].status = true;
        //             setselectedSource([source[0]._id]);
        //             setquestionData(questionData?.filter(filterdata => filterdata.sourceSelected !== source[0].name));
        //         }
        //     }
        // }
      }
      return sourceData;
    });

    setsource(res);

    let filterData = source?.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data._id;
    });

    setselectedSource(filterData);
  };

  const onClickAllSkill = (status) => {
    setskillsAllSelected(status);
    if (status) {
      const res = skills.map((skillData) => {
        skillData.status = true;
        return skillData;
      });
      setPage(1);
      setpaginationStopForFilter(true);
      setpaginationStop(true);
      setpaginationStopForSearch(true);

      setskills(res);

      let filterData = skills?.filter((data) => data.status === true);
      filterData = filterData.map((data) => {
        return data._id;
      });

      setselectedSkills(filterData);
    } else {
      setPage(1);
      setpaginationStopForFilter(true);
      setpaginationStop(true);
      setpaginationStopForSearch(true);

      const res = skills.map((skillData) => {
        skillData.status = false;
        return skillData;
      });
      setskills(res);
      selectedSkills.length = 0;
    }
  };

  const onClickSkills = (data) => {
    const res = skills.map((skillData) => {
      if (skillData.name === data.name) {
        skillData.status = !data.status;
      }
      return skillData;
    });
    setPage(1);
    setpaginationStopForFilter(true);
    setpaginationStop(true);
    setpaginationStopForSearch(true);

    let filterData = skills?.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data._id;
    });

    setselectedSkills(filterData);
    setskills(res);
  };

  const getAllQuestionAsperClientID = async () => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const resofAllQuestionClientID = await axios.get(
        `${backend_url}question/findQuestionPerClientID/${
          decode.client._id
        }?page=${1}&limit=50`,
        { headers: { token: token } }
      );
      resofAllQuestionClientID.data.data.forEach((element) => {
        element.sourceSelected = "My Library";
      });

      setloading(false);

      resofAllQuestionClientID.data.data.forEach((element) => {
        setquestionData((prev) => [...prev, element]);
      });
    } catch (error) {
      setloading(false);
    }
  };

  const onClickAllQuestionType = (status) => {
    setquestionTypeAllSelected(status);
    if (status) {
      const res = questionType.map((questionTypeData) => {
        questionTypeData.status = true;
        return questionTypeData;
      });
      setPage(1);
      setpaginationStopForFilter(true);
      setpaginationStop(true);
      setpaginationStopForSearch(true);

      setquestionType(res);

      let filterData = questionType?.filter((data) => data.status === true);
      filterData = filterData.map((data) => {
        return data.name;
      });

      setselectedQuestionType(filterData);
    } else {
      const res = questionType.map((questionTypeData) => {
        questionTypeData.status = false;
        return questionTypeData;
      });
      setquestionType(res);
      setPage(1);
      setpaginationStopForFilter(true);
      setpaginationStop(true);
      setpaginationStopForSearch(true);

      setselectedQuestionType([]);
    }
  };

  const onClickQuestionType = (data) => {
    const res = questionType.map((question) => {
      if (question.name === data.name) {
        question.status = !data.status;
      }
      return question;
    });
    setquestionType(res);
    setPage(1);
    setpaginationStopForFilter(true);
    setpaginationStop(true);
    setpaginationStopForSearch(true);

    let filterData = questionType?.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data.name;
    });

    setselectedQuestionType(filterData);
  };

  const onClickAllDiffcultLevel = (status) => {
    setdifficultyAllLevelSelected(status);
    if (status) {
      const res = difficultLevel.map((difficultLevelData) => {
        difficultLevelData.status = true;

        return difficultLevelData;
      });
      setdifficultLevel(res);
      setPage(1);
      setpaginationStopForFilter(true);
      setpaginationStop(true);
      setpaginationStopForSearch(true);

      let filterData = difficultLevel?.filter((data) => data.status === true);
      filterData = filterData.map((data) => {
        return data._id;
      });
      setselectedDifficultLevel(filterData);
    } else {
      setPage(1);
      const res = difficultLevel.map((difficultLevelData) => {
        difficultLevelData.status = false;
        return difficultLevelData;
      });
      setdifficultLevel(res);
      setselectedDifficultLevel([]);
    }
  };

  const onClickDiffcultLevelItem = (data) => {
    const res = difficultLevel.map((level) => {
      if (level.name === data.name) {
        level.status = !data.status;
      }
      return level;
    });
    setPage(1);
    setpaginationStopForFilter(true);
    setpaginationStop(true);
    setpaginationStopForSearch(true);

    let filterData = difficultLevel?.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data._id;
    });

    setdifficultLevel(res);
    setselectedDifficultLevel(filterData);
  };

  const searchQuestionData = () => {
    return new Promise(async (resolve, reject) => {
      setsearchLoading(true);
      try {
        if (cancelToken) {
          cancelToken.cancel("Operations cancelled due to new request");
        }
        cancelToken = axios.CancelToken.source();
        if (searchQuestion === "") {
          toast("Please enter question");
          setsearchLoading(false);
          reject("Please enter question");
        } else {
          const token = getCookie("Xh7ERL0G");
          const decode = jwtDecode(token);
          const res = await axios.post(
            `${backend_url}question/searchQuestionWithFilter/${decode?.client?._id}?page=${searchPage}&limit=50`,
            {
              source: selectedSource,
              skill: selectedSkills,
              difficultlevel: selectedDifficultLevel,
              questionType: selectedQuestionType,
              searchText: searchQuestion,
              status: selectedSource.includes("") ? "draft" : undefined,
            },
            { cancelToken: cancelToken.token, headers: { token } }
          );
          if (res.data.data.length) {
            setsearchFilter(true);
            setsearchLoading(false);
            setsearchPage(searchPage + 1);
            setsearchResultCount(res.data.NoOfRecord);
            if (searchPage > 1) {
              res.data.data.forEach((data) => {
                const found = searchData.some((el) => el._id === data._id);
                if (!found) {
                  setsearchData((prev) => [...prev, data]);
                }
              });
            } else {
              setsearchData(res.data.data);
            }

            if (res.data.data.length < 50) {
              setsearchPage(searchPage);
              setpaginationStopForSearch(false);
            }
            resolve(res.data.data);
          } else {
            toast("No question available");
            setsearchFilter(true);
            setsearchData([]);
            setsearchLoading(false);
            resolve([]);
          }
        }
      } catch (error) {
        setsearchLoading(false);
        setsearchFilter(false);
        reject(error);
      }
    });
  };

  const searchSkill = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(
        `${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`,
        { headers: { token: token } }
      );
      setsearchSkillData(res.data.data);
    } catch (error) {
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const addSearchedSkill = (skillName, skillId) => {
    let skillArray = skills.map(function (item) {
      return item.name;
    });

    if (!skillArray.includes(skillName)) {
      toast.success("skill is added");

      setskills((prev) => [
        ...prev,
        { name: skillName, status: false, _id: skillId },
      ]);
      setclosesearchSkillModel(false);
    } else {
      setclosesearchSkillModel(false);
      toast("You have added already that skill", {
        className: "toast-message",
      });
    }
  };

  const displaySourceHeader = () => {
    if (
      source[0].name === "EliteQA Library" &&
      source[0].status &&
      source[1].name === "My Library" &&
      source[1].status
    ) {
      return "All";
    } else if (
      source[0].name === "EliteQA Library" &&
      source[0].status &&
      source[1].name === "My Library" &&
      source[1].status
    ) {
      return "EliteQA Library & My Library";
    } else if (source[0].name === "EliteQA Library" && source[0].status) {
      return "EliteQA Library";
    } else if (source[1].name === "My Library" && source[1].status) {
      return "My Library ";
    } else if (source[0].name === "EliteQA Library" && source[0].status) {
      return "EliteQA Library";
    } else if (source[1].name === "My Library" && source[1].status) {
      return "My Library";
    }
  };

  const closeQuestionTypeModel = () => {
    setcreateQuestion(false);
  };

  const deleteQuestionAsPerQuestionID = async (questionID) => {
    try {
      if (searchQuestion !== "" && searchData.length) {
        const filterDeleteData = searchData?.filter(
          (data) => data._id !== questionID._id
        );
        setsearchData(filterDeleteData);
      } else {
        const filterDeleteData = (
          isfilter ? filterTestData : questionData
        ).filter((data) => data._id !== questionID._id);
        if (isfilter) {
          setfilterTestData(filterDeleteData);
        } else {
          setquestionData(filterDeleteData);
        }
      }
      const token = getCookie("Xh7ERL0G");
      await axios.post(
        `${backend_url}question/deleteQuestion/${questionID._id}`,
        { token: token }
      );
      toast("Question Deleted From Library");
    } catch (error) {
      toast(error);
    }
  };

  const getSearchCount = () => {
    let searchResult = 0;
    if (searchFilter && searchQuestion) {
      searchData.map((data, index) => {
        searchResult += 1;
      });
    } else {
      (isfilter ? filterTestData : questionData).map((data, index) => {
        searchResult += 1;
      });
    }
    return searchResult;
  };

  const onClickEditSave = (editQuestion, sourceSelected) => {
    questionData.forEach((data) => {
      if (data._id === editQuestion._id) {
        data.question = editQuestion.question;
        data.Section_header = editQuestion.Section_header;
        data.type = editQuestion.type;
        data.createdBy = editQuestion.createdBy;
        data.clientId = editQuestion.clientId;
        data.correctAnswerType = editQuestion.correctAnswerType;
        data.answersObjectArray = editQuestion.answersObjectArray;
        data.correctAnswerObjectArray = editQuestion.correctAnswerObjectArray;
        data.score = editQuestion.score;
        data.difficultyLevelId = editQuestion.difficultyLevelId;
        data.topicId = editQuestion.topicId;
        data.skillsId = editQuestion.skillsId;
        data.Section_header = editQuestion.Section_header;
        data.status = editQuestion.status;
        data.sourceSelected = sourceSelected;
      }
    });
    setquestionData(questionData);
    // console.log(sourceSelected)
    // if(sourceSelected==="EliteQA Library"){
    //     getAllEliteQALibrary()
    // }else if(sourceSelected==="My Library"){
    //     getAllQuestionAsperClientID()
    // }else if(sourceSelected==="Draft"){
    //     getAllDraftQuestions()
    // }

    seteditQuestion(false);
  };

  const onHandleScroll = async (e) => {
    e.persist();
    if (
      Math.abs(
        e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)
      ) <= 1
    ) {
      if (searchFilter && searchQuestion) {
        if (paginationStopForSearch) {
          setPaginationLoading(true);
          searchQuestionData()
            .then((data) => {
              setPaginationLoading(false);
            })
            .catch((error) => {
              setPaginationLoading(false);
            });
        }
        setsearchLoading(false);
      } else {
        if (isfilter) {
          if (paginationStopForFilter) {
            setPaginationLoading(true);
            filterLibraryParameter()
              .then((data) => {
                setPaginationLoading(false);
                // Do something with the returned data
              })
              .catch((error) => {
                setPaginationLoading(false);
                // Handle the error
              });
          }
        } else {
          console.log(paginationStop);
          if (paginationStop) {
            setPaginationLoading(true);
            filterLibraryParameter()
              .then((data) => {
                setPaginationLoading(false);
              })
              .catch((error) => {
                setPaginationLoading(false);
              });
          }
        }
      }
    }
  };

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
    let filterSource = skills.map((data) => {
      return data.name;
    });
    const res = data?.filter((item) => !filterSource.includes(item.skills));
    setsearchSkillData(res);
  };

  const onChangeSearchSkillText = (text) => {
    setclosesearchSkillModel(true);
    setskillSearchText(text);
  };

  const onQuestionDeselect = (data1) => {
    setselectMutipleQuestion(
      selectMutipleQuestion?.filter((data) => data._id !== data1._id)
    );
  };
  const onQuestionClickSelect = (data) => {
    setselectMutipleQuestion((prev) => [...prev, data]);
  };

  const temporySkillArray = [];

  // const addMutipleQuestionToLibrary = async () => {
  //   selectMutipleQuestion.forEach((data) => {
  //     data.skillsId.forEach((skills) => {
  //       temporySkillArray.push(skills);
  //     });
  //   });
  //   const removedDuplicateSkill = temporySkillArray.filter(
  //     (v, i, a) =>
  //       a.findIndex((v2) => v2?.skills?.skills === v?.skills?.skills) === i
  //   );
  //   setselectedMutipleObjectSkillAdd(removedDuplicateSkill);
  //   setaddMutipleSkillModal(true);
  // };

  const addMutipleQuestionToLibrary = async () => {
    const singleSkillQuestions = [];
    const multipleSkillQuestions = [];
    selectMutipleQuestion.forEach((data) => {
      if (data.skillsId.length === 1) {
        singleSkillQuestions.push(data);
      } else {
        multipleSkillQuestions.push(data);
      }
    });

    if (singleSkillQuestions.length > 0) {
      const questionsWithExistingSkills = [];
      const questionsWithoutExistingSkills = [];
      singleSkillQuestions.forEach((data) => {
        const found = createTestContext.addedSkills.some(
          (el) =>
            el.skill === data.skillsId[0]?.skills?.skills &&
            el.questionType === data.type
        );
        if (found) {
          questionsWithExistingSkills.push(data);
        } else {
          questionsWithoutExistingSkills.push(data);
        }
      });
      setSingleSkilledQuestions(questionsWithoutExistingSkills);
      addToLibrary(questionsWithExistingSkills, questionsWithoutExistingSkills);
    }

    if (multipleSkillQuestions.length > 0) {
      setselectMutipleQuestion(multipleSkillQuestions);
      multipleSkillQuestions.forEach((data) => {
        data.skillsId.forEach((skills) => {
          temporySkillArray.push(skills);
        });
      });
      const removedDuplicateSkill = temporySkillArray.filter(
        (v, i, a) =>
          a.findIndex((v2) => v2?.skills?.skills === v?.skills?.skills) === i
      );
      setselectedMutipleObjectSkillAdd(removedDuplicateSkill);
      setaddMutipleSkillModal(true);
    } else {
      setselectMutipleQuestion([]);
    }
  };

  const checkSearchedSkillAddedOrNot = (skill, type) => {
    console.log(skill, type);
    // let isSkillExists = false;
    // let searchSkill = skill
    //   ?.flatMap((data) => data?.skills?.skills)
    //   .filter(Boolean);

    // isSkillExists = createTestContext.addedSkills.some((skillData) => {
    //   return (
    //     searchSkill.includes(skillData.skill) && skillData.questionType === type
    //   );
    // });

    // return isSkillExists;
    return createTestContext.addedSkills.some(
      (skillData) =>
        skillData.skill === skill && skillData.questionType === type
    );
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

  useEffect(() => {
    if (isSkillAdded) {
      singleSkilledQuestions.forEach((questionData) => {
        addSingleToLibrary(questionData);
      });
      setSingleSkilledQuestions([]);
    }
  }, [isSkillAdded]);

  const addSingleToLibrary = async (question) => {
    let searchSkill = question.skillsId.map((data) => {
      return data.skills.skills;
    });
    createTestContext.setQuestions({
      skillId: createTestContext.addedSkills
        .filter((data) => data.skill === searchSkill[0])
        .map((data) => data.skillId)[0],
      questions: question,
    });
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
          easyQuestion = easyQuestion + parseInt(1);
        }
        if (question.difficultyLevelId.level === "medium") {
          mediumQuestion = mediumQuestion + parseInt(1);
        }
        if (question.difficultyLevelId.level === "hard") {
          hardQuestion = hardQuestion + parseInt(1);
        }

        skillData.level = `Easy(${easyQuestion}), Medium(${mediumQuestion}), Hard(${hardQuestion})`;
        skillData.questions = parseInt(skillData.questions) + parseInt(1);
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
          data.totalNoOfQuestion = data.totalNoOfQuestion + 1;
          data.totalScore = data.totalScore + question.score;
          data.easyQuestion.question.push(question);
        }

        if (question.difficultyLevelId.level === "medium") {
          data.totalNoOfQuestion = data.totalNoOfQuestion + 1;
          data.totalScore = data.totalScore + question.score;
          data.mediumQuestion.question.push(question);
        }

        if (question.difficultyLevelId.level === "hard") {
          data.totalNoOfQuestion = data.totalNoOfQuestion + 1;
          data.totalScore = data.totalScore + question.score;
          data.hardQuestion.question.push(question);
        }
      }
    });
    createTestContext.setFilterQuestionOverview(
      createTestContext.questionOverview
    );
  };

  const addToLibrary = async (
    questionsWithExistingSkills,
    questionsWithoutExistingSkills
  ) => {
    if (questionsWithoutExistingSkills.length > 0) {
      const skills = [];
      questionsWithoutExistingSkills.forEach((question) => {
        const skill = {
          skillName: question.skillsId[0].skills.skills,
          type: question.type,
          skillId: question.skillsId[0].skills._id,
        };
        if (!skills.some((s) => s.skillId === skill.skillId)) {
          skills.push(skill);
        }
      });
      skills.map(async (skill) => {
        if (!checkSearchedSkillAddedOrNot(skill.skillName, skill.type)) {
          await createSkillObject(skill.skillName, skill.type, skill.skillId);
          await new Promise((resolve) => setTimeout(resolve, 100));
          setisSkillAdded(true);
        }
      });
    }
    if (questionsWithExistingSkills.length > 0) {
      questionsWithExistingSkills.forEach((question) => {
        addSingleToLibrary(question);
      });
    }
    toast.success(
      `${
        questionsWithoutExistingSkills.length +
        questionsWithExistingSkills.length
      } Questions are added into test`
    );
  };

  const navigatePage = (page) => {
    navigate(page);
    createTestContext.clearState();
  };

  const closeAddSkillModel = () => {
    setaddSkillModal(false);
  };

  const closeMutipleSkillModal = () => {
    setaddMutipleSkillModal(false);
  };

  return (
    <>
      <NavigationBar2
        testName={createTestContext.testHeading}
        onClickNavItem={(page) => navigatePage(page)}
        isOverview={isOverview}
        testId={testId}
      />
      <div className="choose-library-container">
        {addMutipleSkillModal ? (
          <AddMultipleSkill
            closeMutipleSkillModal={() => closeMutipleSkillModal()}
            skills={selectedMutipleObjectSkillAdd}
            question={selectMutipleQuestion}
            clearSelectedMutipleQuestion={() => {
              setselectMutipleQuestion([]);
              createTestContext.addDeletedSkillData(
                createTestContext.addedSkills.filter(
                  (v, i, a) =>
                    a.findIndex((v2) => v2.skillId === v.skillId) === i
                )
              );
            }}
          />
        ) : (
          <></>
        )}
        {addSkillModal && (
          <AddSkill
            closeAddSkillModel={closeAddSkillModel}
            skills={selectedSkillToAdd}
            question={selectedQuestionData}
          />
        )}
        {deleteQuestionModel && (
          <DeletePopupModel
            sectionHeader={selectQuestionForDelete.Section_header}
            questionNo={selectedQuestionIndex}
            cancelButton={() => setdeleteQuestionModel(false)}
            yesButton={() => {
              deleteQuestionAsPerQuestionID(selectQuestionForDelete);
              setdeleteQuestionModel(false);
            }}
          />
        )}
        {createQuestion && (
          <QuestionTypeModel closeQuestionTypeModel={closeQuestionTypeModel} />
        )}
        {questionPreview && (
          <QuestionPreviewModel
            hideEditButton="true"
            onClickEdit={() => {
              setquestionPreview(false);
              seteditQuestion(true);
            }}
            selectedQuestionIndex={selectedQuestionIndex}
            data={selectedQuestionData}
            onClickCancel={() => setquestionPreview(false)}
          />
        )}
        {editQuestion && (
          <EditQuestionModel
            selectedQuestionIndex={selectedQuestionIndex}
            data={selectedQuestionData}
            onClickCancel={() => seteditQuestion(false)}
            onClickSave={(data, source) => onClickEditSave(data, source)}
          />
        )}
        {/*left side menu bar */}
        <div className="left-side">
          {/* <span onClick={() => { navigate('/questionsoverview') }} style={{ marginTop: "15px", cursor: "pointer" }}><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.8346 10H4.16797" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10.0013 15.8337L4.16797 10.0003L10.0013 4.16699" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                        <label style={{ fontSize: "20px", cursor: "pointer" }}>Back To Test</label>
                    </span> */}
          {/*Source section start */}
          <span style={{ marginTop: "10px" }}>
            {sourceAllSelected ? (
              <div
                onClick={() => onClickAllSource(false)}
                className="checkbox-container"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L3.5 6.5L1 4"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <div
                onClick={() => onClickAllSource(true)}
                style={{
                  background: "transparent",
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "white",
                }}
                className="checkbox-container"
              ></div>
            )}
            <label>Source</label>
          </span>
          <div className="border"></div>
          {source.map((sourceData) => {
            if (sourceData.name !== "Draft") {
              return (
                <span data-tip={sourceData?.name}>
                  {/*checkbox container */}
                  {sourceData.status ? (
                    <div
                      onClick={() => onClickSource(sourceData)}
                      className="checkbox-container"
                    >
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 1L3.5 6.5L1 4"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div
                      onClick={() => onClickSource(sourceData)}
                      style={{
                        background: "transparent",
                        borderWidth: 1.5,
                        borderStyle: "solid",
                        borderColor: "white",
                      }}
                      className="checkbox-container"
                    ></div>
                  )}

                  <p>{sourceData?.name}</p>
                </span>
              );
            }
          })}

          {/*skill section start */}
          <span style={{ marginTop: 15 }}>
            {skillsAllSelected ? (
              <div
                onClick={() => onClickAllSkill(false)}
                className="checkbox-container"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L3.5 6.5L1 4"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <div
                onClick={() => onClickAllSkill(true)}
                style={{
                  background: "transparent",
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "white",
                }}
                className="checkbox-container"
              ></div>
            )}
            <label>Skills</label>
          </span>
          {/*search skill container */}

          <div className="search-skill-container">
            {/*seach icon */}
            <svg
              style={{ cursor: "pointer" }}
              onClick={() => searchSkill()}
              width="10"
              height="11"
              viewBox="0 0 10 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9.11572 10.3203L6.85756 8.0617C5.09656 9.44978 2.5588 9.22488 1.06939 7.54874C-0.420043 5.87257 -0.345003 3.32607 1.24055 1.74055C2.82611 0.155006 5.37271 0.0799677 7.04888 1.56934C8.72509 3.05873 8.95 5.59641 7.56188 7.35736L9.82005 9.61501C9.96564 9.73646 10.0301 9.92974 9.98663 10.1143C9.94312 10.2988 9.79909 10.4429 9.61457 10.4866C9.43006 10.5302 9.23675 10.4659 9.1152 10.3203H9.11572ZM0.996124 4.73414C0.995666 6.03631 1.77546 7.21242 2.97546 7.71908C4.17543 8.22571 5.56217 7.96436 6.49537 7.05565C6.50457 7.04444 6.51432 7.0338 6.52467 7.02381C6.53503 7.01382 6.54554 7.00414 6.55621 6.99479C7.57527 5.94832 7.76791 4.34923 7.02646 3.09069C6.28504 1.83215 4.79298 1.22552 3.38366 1.60961C1.97433 1.99369 0.99643 3.27346 0.996094 4.73414H0.996124Z"
                fill="#55585D"
              />
            </svg>

            <input
              value={skillSearchText}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  searchSkill();
                }
              }}
              onChange={handleSearchChange}
              type="text"
              placeholder="Search Skills"
            />
            <span>
              {skillSearchText !== "" ? (
                <svg
                  onClick={() => {
                    setskillSearchText("");
                    searchSkillData.length = 0;
                    setclosesearchSkillModel(false);
                  }}
                  style={{ cursor: "pointer" }}
                  width="10"
                  height="11"
                  viewBox="0 0 10 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.832031 9.66634L5.00017 5.49967M5.00017 5.49967L9.16684 1.33301M5.00017 5.49967L0.832031 1.33301M5.00017 5.49967L9.16684 9.66634"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              ) : (
                <></>
              )}
            </span>
          </div>
          {skillSearchText !== "" && closesearchSkillModel ? (
            <div className="search-result-container">
              {searchSkillData.length ? (
                <>
                  {searchSkillData.map((data) => {
                    return (
                      <div
                        tabindex="-1"
                        style={
                          skills.find((obj) => obj.name === data.skills) !==
                          undefined
                            ? { background: "#384455" }
                            : {}
                        }
                        onClick={() =>
                          addSearchedSkill(data?.skills, data?._id)
                        }
                        className="skill-item"
                      >
                        <span
                          style={
                            skills.find((obj) => obj.name === data.skills) !==
                            undefined
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
                                  skills.find(
                                    (obj) => obj.name === data.skills
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
                                  skills.find(
                                    (obj) => obj.name === data.skills
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
                        {skills.find((obj) => obj.name === data.skills) !==
                        undefined ? (
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

          {skills.map((skillData, index) => {
            return (
              <div className="skills-item-container">
                <span key={index}>
                  {/*checkbox container */}
                  {skillData.status ? (
                    <div
                      onClick={() => onClickSkills(skillData)}
                      className="checkbox-container"
                    >
                      <svg
                        width="10"
                        height="8"
                        viewBox="0 0 10 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9 1L3.5 6.5L1 4"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div
                      onClick={() => onClickSkills(skillData)}
                      style={{
                        background: "transparent",
                        borderWidth: 1.5,
                        borderStyle: "solid",
                        borderColor: "white",
                      }}
                      className="checkbox-container"
                    ></div>
                  )}

                  <p>{skillData.name}</p>
                </span>
                <svg
                  onClick={() => {
                    setPage(1);
                    setsearchPage(1);
                    const filteredPeople = skills?.filter(
                      (item) => item.name !== skillData.name
                    );
                    setskills(filteredPeople);
                    const filterSkill = selectedSkills.filter(
                      (data) => data !== skillData._id
                    );
                    setselectedSkills(filterSkill);
                  }}
                  style={{ cursor: "pointer" }}
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.875 3.75H3.125H13.125"
                    stroke="#FFFFFF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75"
                    stroke="#FFFFFF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.25 6.875V10.625"
                    stroke="#FFFFFF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.75 6.875V10.625"
                    stroke="#FFFFFF"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            );
          })}

          {/*difficult level section start */}
          <span style={{ marginTop: 15 }}>
            {difficultyAllLevelSelected ? (
              <div
                onClick={() => onClickAllDiffcultLevel(false)}
                className="checkbox-container"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L3.5 6.5L1 4"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <div
                onClick={() => onClickAllDiffcultLevel(true)}
                style={{
                  background: "transparent",
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "white",
                }}
                className="checkbox-container"
              ></div>
            )}
            <label>Difficulty</label>
          </span>
          <div className="border"></div>
          {difficultLevel.map((difficultLevelData) => {
            return (
              <span>
                {/*checkbox container */}
                {difficultLevelData?.status ? (
                  <div
                    onClick={() => onClickDiffcultLevelItem(difficultLevelData)}
                    className="checkbox-container"
                  >
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    onClick={() => onClickDiffcultLevelItem(difficultLevelData)}
                    style={{
                      background: "transparent",
                      borderWidth: 1.5,
                      borderStyle: "solid",
                      borderColor: "white",
                    }}
                    className="checkbox-container"
                  ></div>
                )}

                <p>{difficultLevelData?.name}</p>
              </span>
            );
          })}

          {/*question type section start */}
          <span style={{ marginTop: 15 }}>
            {questionTypeAllSelected ? (
              <div
                onClick={() => onClickAllQuestionType(false)}
                className="checkbox-container"
              >
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L3.5 6.5L1 4"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            ) : (
              <div
                onClick={() => onClickAllQuestionType(true)}
                style={{
                  background: "transparent",
                  borderWidth: 1.5,
                  borderStyle: "solid",
                  borderColor: "white",
                }}
                className="checkbox-container"
              ></div>
            )}
            <label>Question Type</label>
          </span>
          <div className="border"></div>
          {questionType.map((questionTypeData) => {
            return (
              <span>
                {/*checkbox container */}
                {questionTypeData.status ? (
                  <div
                    onClick={() => onClickQuestionType(questionTypeData)}
                    className="checkbox-container"
                  >
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9 1L3.5 6.5L1 4"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                ) : (
                  <div
                    onClick={() => onClickQuestionType(questionTypeData)}
                    style={{
                      background: "transparent",
                      borderWidth: 1.5,
                      borderStyle: "solid",
                      borderColor: "white",
                    }}
                    className="checkbox-container"
                  ></div>
                )}

                <p>{questionTypeData.name}</p>
              </span>
            );
          })}
        </div>
        {/*right side menu bar */}

        <div className="right-side">
          {/*header section start */}
          <div className="header-container">
            <span>
              <div className="libray-name-header">
                <b>The {displaySourceHeader()}</b>{" "}
                <>
                  {loading || searchLoading ? (
                    <div className="loader"></div>
                  ) : (
                    <>
                      (
                      {isfilter
                        ? searchFilter
                          ? searchResultCount
                          : filterResultCount
                        : searchFilter
                        ? searchResultCount
                        : nonFilterResultCount}
                      )
                    </>
                  )}
                </>
              </div>
              <div className="search-container">
                <input
                  value={searchQuestion}
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchQuestionData();
                    }
                  }}
                  onChange={(e) => {
                    setsearchQuestion(e.target.value);
                  }}
                  placeholder="Search Questions"
                />

                {/* Search Icon */}
                {searchQuestion !== "" ? (
                  <svg
                    className="clear-icon"
                    onClick={clearSearchText}
                    style={{ right: 50 }}
                    width="12"
                    height="12"
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
                <svg
                  className="search-icon"
                  onClick={() => searchQuestionData()}
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.0216 16.099L11.5304 12.6071C8.80795 14.7531 4.88459 14.4054 2.58198 11.8141C0.279322 9.22267 0.395334 5.2857 2.84659 2.83444C5.29785 0.383128 9.23487 0.267116 11.8262 2.56973C14.4176 4.87238 14.7653 8.7957 12.6193 11.5182L16.1104 15.0086C16.3355 15.1964 16.4352 15.4952 16.368 15.7805C16.3007 16.0658 16.078 16.2886 15.7928 16.356C15.5075 16.4235 15.2087 16.324 15.0208 16.099H15.0216ZM2.4685 7.46203C2.46779 9.47522 3.67335 11.2935 5.52854 12.0768C7.38368 12.8601 9.52758 12.456 10.9703 11.0512C10.9845 11.0338 10.9996 11.0174 11.0156 11.0019C11.0316 10.9865 11.0479 10.9715 11.0644 10.9571C12.6398 9.33918 12.9376 6.86695 11.7914 4.92121C10.6451 2.97547 8.33841 2.0376 6.15961 2.6314C3.98081 3.2252 2.46897 5.20377 2.46845 7.46203H2.4685Z"
                    fill="#606D77"
                  />
                </svg>
              </div>
            </span>
            <div className="btn-container">
              {allSelectedQues.length ? (
                <div className="button-container">
                  <button onClick={() => setcreateQuestion(!createQuestion)}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="white" />
                      <path
                        d="M14 7L8.5 12.5L6 10"
                        stroke="#00C49A"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <p>Add To Test</p>
                  </button>
                </div>
              ) : (
                <></>
              )}
              <div className="button-container">
                {selectMutipleQuestion.length ? (
                  <button
                    style={{ background: "#FF6812" }}
                    onClick={() => addMutipleQuestionToLibrary()}
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
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.10343 14.2434L9.0947 14.1477V11.2798H5.90789C5.4315 11.2818 5.0352 10.9523 5.00221 10.5268C4.96918 10.1012 5.31079 9.72574 5.78291 9.66877L5.891 9.66095H9.09405V6.8071C9.09657 6.38242 9.46434 6.03135 9.93741 6.00198C10.4105 5.97261 10.8288 6.27487 10.8968 6.69514L10.9049 6.79197V9.65815H14.0917C14.5683 9.65624 14.9648 9.98596 14.9978 10.4118C15.0308 10.8376 14.6891 11.2132 14.2167 11.2703L14.108 11.277H10.9049V14.1309C10.9046 14.5566 10.5365 14.9096 10.0622 14.9391C9.58791 14.9686 9.16888 14.6645 9.10286 14.2428L9.10343 14.2434Z"
                        fill="#FF6812"
                      />
                    </svg>
                    <p>
                      Add {selectMutipleQuestion.length}{" "}
                      {selectMutipleQuestion.length > 1
                        ? "Questions"
                        : "Question"}
                    </p>
                  </button>
                ) : (
                  <button
                    style={{ background: "#e0dede" }}
                    onClick={() => addMutipleQuestionToLibrary()}
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
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M9.10343 14.2434L9.0947 14.1477V11.2798H5.90789C5.4315 11.2818 5.0352 10.9523 5.00221 10.5268C4.96918 10.1012 5.31079 9.72574 5.78291 9.66877L5.891 9.66095H9.09405V6.8071C9.09657 6.38242 9.46434 6.03135 9.93741 6.00198C10.4105 5.97261 10.8288 6.27487 10.8968 6.69514L10.9049 6.79197V9.65815H14.0917C14.5683 9.65624 14.9648 9.98596 14.9978 10.4118C15.0308 10.8376 14.6891 11.2132 14.2167 11.2703L14.108 11.277H10.9049V14.1309C10.9046 14.5566 10.5365 14.9096 10.0622 14.9391C9.58791 14.9686 9.16888 14.6645 9.10286 14.2428L9.10343 14.2434Z"
                        fill="#e0dede"
                      />
                    </svg>
                    <p>Add Question</p>
                  </button>
                )}
              </div>
            </div>
          </div>
          {(loading || searchLoading) && PaginationLoading === false ? (
            <div className="library1-container">
              {loadingArray.map((data) => {
                return <LibraryCardSkeleton />;
              })}
            </div>
          ) : (
            <div onScroll={onHandleScroll} className="library1-container">
              {searchFilter && searchQuestion ? (
                <>
                  {searchData.length ? (
                    <>
                      {getSearchCount() > 0 ? (
                        <>
                          {searchData.map((data, index) => {
                            let filterExitsQuestionIDLibrary =
                              createTestContext.question
                                .filter((data) => data.questions._id)
                                .map((data) => data.questions._id);
                            return (
                              <LibraryCard
                                onAddToLibrary={(data) => {
                                  setaddSkillModal(true);
                                  setselectedSkillToAdd(data.skillsId);
                                  setselectedQuestionData(data);
                                }}
                                onQuestionClickSelect={(questionData) =>
                                  onQuestionClickSelect(questionData)
                                }
                                onQuestionDeselect={(questionData) =>
                                  onQuestionDeselect(questionData)
                                }
                                selectMutipleQuestion={selectMutipleQuestion}
                                isQuestionAdded={filterExitsQuestionIDLibrary.includes(
                                  data._id
                                )}
                                onClickEditDraft={(data) => {
                                  setselectedQuestion(data._id);
                                  setselectedQuestionData(data);
                                  setselectedQuestionIndex(index + 1);
                                  seteditQuestion(true);
                                }}
                                onClickQuestion={(data) => {
                                  setselectedQuestion(data._id);
                                  setselectedQuestionData(data);
                                  setselectedQuestionIndex(index + 1);
                                  setquestionPreview(true);
                                }}
                                deleteQuestionAsPerQuestionID={() => {
                                  setdeleteQuestionModel(!deleteQuestionModel);
                                  setselectQuestionForDelete(data);
                                  setselectedQuestionIndex(index);
                                }}
                                key={index}
                                sourceSelected={
                                  data.clientId?._id ===
                                    "632c16db596546cfa858136f" &&
                                  data.status !== "draft"
                                    ? "EliteQA Library"
                                    : data.clientId?._id === userClientID &&
                                      data.status !== "draft"
                                    ? "My Library"
                                    : data.status === "draft"
                                    ? "Draft"
                                    : null
                                }
                                userClientID={userClientID}
                                data={data}
                              />
                            );
                          })}
                        </>
                      ) : (
                        <div style={{ textAlign: "center" }}>
                          No question available
                        </div>
                      )}
                    </>
                  ) : (
                    <div style={{ textAlign: "center" }}>
                      No question available
                    </div>
                  )}
                </>
              ) : (
                <>
                  <>
                    {getSearchCount() > 0 ? (
                      <>
                        {(isfilter ? filterTestData : questionData).map(
                          (data, index) => {
                            let filterExitsQuestionIDLibrary =
                              createTestContext.question
                                .filter((data) => data.questions._id)
                                .map((data) => data.questions._id);
                            return (
                              <LibraryCard
                                onAddToLibrary={(data) => {
                                  setaddSkillModal(true);
                                  setselectedSkillToAdd(data.skillsId);
                                  setselectedQuestionData(data);
                                }}
                                onQuestionClickSelect={(questionData) =>
                                  onQuestionClickSelect(questionData)
                                }
                                onQuestionDeselect={(questionData) =>
                                  onQuestionDeselect(questionData)
                                }
                                selectMutipleQuestion={selectMutipleQuestion}
                                isQuestionAdded={filterExitsQuestionIDLibrary.includes(
                                  data._id
                                )}
                                onClickEditDraft={(data) => {
                                  setselectedQuestion(data._id);
                                  setselectedQuestionData(data);
                                  setselectedQuestionIndex(index + 1);
                                  seteditQuestion(true);
                                }}
                                onClickQuestion={(data) => {
                                  setselectedQuestion(data._id);
                                  setselectedQuestionData(data);
                                  setselectedQuestionIndex(index + 1);
                                  setquestionPreview(true);
                                }}
                                deleteQuestionAsPerQuestionID={() => {
                                  setdeleteQuestionModel(!deleteQuestionModel);
                                  setselectQuestionForDelete(data);
                                  setselectedQuestionIndex(index);
                                }}
                                key={index}
                                userClientID={userClientID}
                                sourceSelected={
                                  data.clientId?._id ===
                                    "632c16db596546cfa858136f" &&
                                  data.status !== "draft"
                                    ? "EliteQA Library"
                                    : data.clientId?._id === userClientID &&
                                      data.status !== "draft"
                                    ? "My Library"
                                    : data.status === "draft"
                                    ? "Draft"
                                    : null
                                }
                                data={data}
                              />
                            );
                          }
                        )}
                      </>
                    ) : (
                      <div style={{ textAlign: "center" }}>
                        No question available
                      </div>
                    )}
                  </>
                </>
              )}
              {PaginationLoading ? (
                <>
                  {loadingArray.map((data) => {
                    return <LibraryCardSkeleton />;
                  })}
                </>
              ) : (
                <></>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChooseFromLibrary;
