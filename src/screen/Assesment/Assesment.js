import React, { useState, useEffect, useContext, useRef } from "react";
import { backend_url, getCookie } from "../../constant";
import axios from "axios";
import jwtDecode from "jwt-decode";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import Card from "../Dashbaord/Card/Card";
import "./Assesment.css";
import AssesmentCardSkeleton from "./AssesmentCardSkeleton";
import { toast } from "react-toastify";
import TestTypeModel from "../../component/TestTypeModel";
import CreateTestContext from "../../store/CreateTestContext";
import CandidateInvite from "../../component/CandidateInvitePopup";

let cancelToken;

const Assesment = () => {
  const context = useContext(CreateTestContext);
  let startDate = new Date();
  let endDate = new Date();
  const createdBySelect = useRef();
  const creationDateSelect = useRef();
  const token = getCookie("Xh7ERL0G");
  const decode = jwtDecode(token);
  const [selectedCreatedBy, setselectedCreatedBy] = useState(decode.user_id);
  const [selectedTestStatus, setselectedTestStatus] = useState([]);
  const [selectedTestType, setselectedTestType] = useState([]);
  const [selectedInviteOnly, setselectedInviteOnly] = useState([]);
  const [sendInvitePopup, setSendInvitePopup] = useState(false);
  const [testId, settestID] = useState("");
  const [singleTestData, setsingleTestData] = useState({});

  const [loadingArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const [loading, setloading] = useState(true);
  const [testData, settestData] = useState([]);
  const [searchText, setsearchText] = useState("");
  const [searchLoading, setsearchLoading] = useState(false);
  const [searchData, setsearchData] = useState([]);
  const [searchFilter, setsearchFilter] = useState(false);
  const [testStatus, settestStatus] = useState([
    { name: "published", status: false, count: 0 },
    { name: "completed", status: false, count: 0 },
    { name: "draft", status: false, count: 0 },
  ]);
  const [testType, settestType] = useState([
    { name: "private", status: false, count: 0 },
    { name: "public", status: false, count: 0 },
  ]);
  const [inviteOnlyType, setinviteOnlyType] = useState([
    { name: "invite only", status: false, count: 0 },
  ]);
  const [testStatusAllSelected, settestStatusAllSelected] = useState(false);
  const [testTypeStatusAllSelected, settestTypeStatusAllSelected] =
    useState(false);
  const [createdBy, setcreatedBy] = useState([]);
  const [selectedCreationDate, setselectedCreationDate] = useState("");
  const [createAssessment, setCreateAssessment] = useState(false);
  const [myselfId, setmyselfId] = useState("");
  const [username, setusername] = useState("");
  const [searchPage, setsearchPage] = useState(1);
  const [paginationStopForSearch, setpaginationStopForSearch] = useState(true);
  const [page, setPage] = useState(1);
  const [paginationStop, setpaginationStop] = useState(true);
  const [totalTest, settotalTest] = useState(0);
  const [testInviteOnlyAllSelected, settestInviteOnlyAllSelected] = useState(0);
  const [canceled, setCanceled] = useState(false);

  //filteration state
  const [isfilter, setisfilter] = useState(false);
  const [filterTestData, setfilterTestData] = useState([]);
  const [paginationStopForFilter, setpaginationStopForFilter] = useState(true);
  const [isPaginationActive, setisPaginationActive] = useState(false);
  const [searchResultCount, setsearchResultCount] = useState("");
  const [filterResultCount, setfilterResultCount] = useState("");
  const [PaginationLoading, setPaginationLoading] = useState(false);
  const [testNonFilterCount, settestNonFilterCount] = useState(0);
  const [finishStatus, setfinishStatus] = useState(false);

  const onBackButtonEvent = (e) => {
    e.preventDefault();
    if (!finishStatus) {
      setCreateAssessment(false);
      context.clearState();
      window.history.pushState(null, null, window.location.pathname);
    }
  };

  useEffect(() => {
    getJobROle();
    getExperince();
    getAllTest();
    getCreatedByUsers();
    getAllTestDetals();
    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener("popstate", onBackButtonEvent);
    return () => {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      window.removeEventListener("popstate", onBackButtonEvent);
    };
  }, []);

  const getAllTestDetals = async () => {
    setloading(true);
    try {
      const token = getCookie("Xh7ERL0G");
      const decoed = jwtDecode(token);
      const res = await axios.get(
        `${backend_url}test/getAllTestDetails/${decoed.user_id}`,
        { headers: { token: token } }
      );
      settotalTest(res.data.totalTest);
      const testStatusTestCount = testStatus.map((testStatus) => {
        if (testStatus.name === "published") {
          testStatus.count = res.data.publishedTest;
        }
        if (testStatus.name === "completed") {
          testStatus.count = res.data.completedTest;
        }
        if (testStatus.name === "draft") {
          testStatus.count = res.data.draftTest;
        }
        return testStatus;
      });
      settestStatus(testStatusTestCount);

      const testtypeTestCount = testType.map((testStatus) => {
        if (testStatus.name === "public") {
          testStatus.count = res.data.publicTest;
        }

        if (testStatus.name === "private") {
          testStatus.count = res.data.privateTest;
        }

        return testStatus;
      });

      settestType(testtypeTestCount);

      const inviteOnlyTestCount = inviteOnlyType.map((inviteOnly) => {
        if (inviteOnly.name === "invite only") {
          inviteOnly.count = res.data.inviteOnlyTest;
        }
        return inviteOnly;
      });
      setinviteOnlyType(inviteOnlyTestCount);
    } catch (error) {
      setloading(false);
      toast.error(error);
    }
  };

  const getJobROle = async () => {
    setloading(true);
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(`${backend_url}jobrole/getroleTable`, {
        headers: { token: token },
      });
      context.setJobRoleData(res.data.roleTables);
    } catch (error) {
      console.log(error);
      setloading(false);
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const getExperince = async () => {
    setloading(true);
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.get(`${backend_url}experience/getAll`, {
        headers: { token: token },
      });
      context.setexprienceData(res.data.data);
    } catch (error) {
      setloading(false);
      toast(`${error}`, {
        className: "toast-message",
      });
    }
  };

  const getCreatedByUsers = async () => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const decoed = jwtDecode(token);
      setmyselfId(decoed.user_id);
      setusername(`Myself(${decoed.fullName})`);
      const res = await axios.get(
        `${backend_url}test/getTestAdmins/${decoed.user_id}`,
        { headers: { token: token } }
      );

      const createdByUsers = res.data.data.map((data) => {
        return data.createdBy;
      });
      const result = createdByUsers.filter(
        (value, index, self) =>
          index ===
          self.findIndex(
            (t) => t.email === value.email && decoed.fullName !== t.fullName
          )
      );
      setcreatedBy(result);
    } catch (error) {
      setloading(false);
      toast(error);
    }
  };

  // const getNoOfTestAsPerTestStatus = () => {
  //     const publishedCnt = (searchText !== "" && searchData.length ? searchData : testData).filter(element => element.status === "published")
  //     const completedCnt = (searchText !== "" && searchData.length ? searchData : testData).filter(element => element.status === "completed")
  //     const draftCnt = (searchText !== "" && searchData.length ? searchData : testData).filter(element => element.status === "draft")
  //     const inviteonlyCnt = (searchText !== "" && searchData.length ? searchData : testData).filter(element => element.testType === "invite only")
  //     const publicCnt = (searchText !== "" && searchData.length ? searchData : testData).filter(element => element.testType === "public")

  //     const testStatusTestCount = testStatus.map((testStatus) => {
  //         if (testStatus.name === "published") {
  //             testStatus.count = publishedCnt.length
  //         }
  //         if (testStatus.name === "completed") {
  //             testStatus.count = completedCnt.length
  //         }
  //         if (testStatus.name === "draft") {
  //             testStatus.count = draftCnt.length
  //         }
  //         return testStatus
  //     })
  //     settestStatus(testStatusTestCount)

  //     const testtypeTestCount = testType.map((testStatus) => {
  //         if (testStatus.name === "invite only") {
  //             testStatus.count = inviteonlyCnt.length
  //         }
  //         if (testStatus.name === "public") {
  //             testStatus.count = publicCnt.length
  //         }

  //         return testStatus
  //     })
  //     settestType(testtypeTestCount)

  // }

  const getAllTest = () => {
    return new Promise(async (resolve, reject) => {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      setCanceled(false);
      setloading(true);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      try {
        const res = await axios.get(
          `${backend_url}test/getAllTest/${decode.user_id}?page=${page}&limit=10`,
          { cancelToken: cancelToken.token, headers: { token: token } }
        );
        settestNonFilterCount(res.data.noOfRecord);
        res.data.data.forEach((element) => {
          const found = testData.some((el) => el._id === element._id);
          if (!found) {
            settestData((prev) => [...prev, element]);
          }
        });
        if (
          selectedTestStatus.length !== 0 ||
          selectedInviteOnly.length !== 0 ||
          selectedTestType.length !== 0 ||
          selectedCreatedBy !== "" ||
          selectedCreationDate !== ""
        ) {
          setisfilter(true);
        } else {
          setisfilter(false);
        }

        if (res.data.data.length < 10) {
          setpaginationStop(false);
        }
        setPage(page + 1);
        setloading(false);
        setCanceled(false);
        resolve("done");
      } catch (error) {
        if (error.message === "Operations cancelled due to new request") {
          //setsearchLoading(false);
          //setsearchFilter(false);
          setloading(false);
          setCanceled(true);
        } else {
          setloading(false);
          reject(error);
        }
      }
    });
  };

  // useEffect(() => {
  //     getNoOfTestAsPerTestStatus()
  //     // eslint-disable-next-line
  // }, [(searchText !== "" && searchData.length ? searchData : testData)])

  const searchTest = () => {
    return new Promise(async (resolve, reject) => {
      setsearchLoading(true);
      setCanceled(false);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      try {
        if (selectedCreationDate === "Last 1 Week") {
          endDate.setDate(endDate.getDate() - 7);
        }
        if (selectedCreationDate === "Last 1 Month") {
          endDate.setDate(endDate.getDate() - 30);
        }
        if (selectedCreationDate === "Last Quarter") {
          endDate.setDate(endDate.getDate() - 120);
        }
        if (selectedCreationDate === "Last Year") {
          endDate.setDate(endDate.getDate() - 365);
        }
        if (searchText === "") {
          toast("Please enter search assessment");
          setsearchLoading(false);
          setCanceled(false);
          reject("Please enter search assessment");
        } else {
          const token = getCookie("Xh7ERL0G");
          const decoed = jwtDecode(token);
          let res = [];
          res = await axios.post(
            `${backend_url}test/searchTest?page=${searchPage}&limit=10`,
            {
              searchText: searchText.toLowerCase(),
              status: selectedTestStatus.length ? selectedTestStatus : [],
              testInviteOnly: selectedInviteOnly.length ? true : undefined,
              testType: selectedTestType.length ? selectedTestType : [],
              startDate:
                selectedCreationDate !== ""
                  ? `${startDate.getFullYear()}-${
                      startDate.getMonth() + 1
                    }-${startDate.getDate()}`
                  : undefined,
              endDate:
                selectedCreationDate !== ""
                  ? `${endDate.getFullYear()}-${
                      endDate.getMonth() + 1
                    }-${endDate.getDate()}`
                  : undefined,
              selectedCreatedBy:
                selectedCreatedBy !== ""
                  ? selectedCreatedBy === decoed.user_id
                    ? decoed.user_id
                    : selectedCreatedBy
                  : undefined,
              userId: decoed.user_id,
            },
            { cancelToken: cancelToken.token, headers: { token } }
          );
          setsearchResultCount(res.data.NoOfRecord);
          //if (res.data.data.length) {
          if (res.data.data.length < 10) {
            setpaginationStopForSearch(false);
          }
          setsearchFilter(true);
          setsearchLoading(false);
          setCanceled(false);
          setsearchPage((prev) => prev + 1);

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
          // } else {
          //     setsearchData([]);
          //     setsearchLoading(false);
          //     setsearchFilter(true);
          // }
          resolve("done");
        }
      } catch (error) {
        if (error.message === "Operations cancelled due to new request") {
          //setsearchLoading(false);
          //setsearchFilter(false);
          setCanceled(true);
          setsearchLoading(false);
        } else {
          setsearchLoading(false);
          setsearchFilter(false);
        }
        reject(error);
      }
    });
  };

  const onClickSearchIcon = () => {
    return new Promise(async (resolve, reject) => {
      setsearchLoading(true);
      setCanceled(false);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      try {
        if (selectedCreationDate === "Last 1 Week") {
          endDate.setDate(endDate.getDate() - 7);
        }
        if (selectedCreationDate === "Last 1 Month") {
          endDate.setDate(endDate.getDate() - 30);
        }
        if (selectedCreationDate === "Last Quarter") {
          endDate.setDate(endDate.getDate() - 120);
        }
        if (selectedCreationDate === "Last Year") {
          endDate.setDate(endDate.getDate() - 365);
        }
        if (searchText === "") {
          toast("Please enter search assessment");
          setsearchLoading(false);
          setCanceled(false);
          reject("Please enter search assessment");
        } else {
          const token = getCookie("Xh7ERL0G");
          const decoed = jwtDecode(token);
          let res = [];
          res = await axios.post(
            `${backend_url}test/searchTest?page=${1}&limit=10`,
            {
              searchText: searchText.toLowerCase(),
              status: selectedTestStatus.length ? selectedTestStatus : [],
              testInviteOnly: selectedInviteOnly.length ? true : undefined,
              testType: selectedTestType.length ? selectedTestType : [],
              startDate:
                selectedCreationDate !== ""
                  ? `${startDate.getFullYear()}-${
                      startDate.getMonth() + 1
                    }-${startDate.getDate()}`
                  : undefined,
              endDate:
                selectedCreationDate !== ""
                  ? `${endDate.getFullYear()}-${
                      endDate.getMonth() + 1
                    }-${endDate.getDate()}`
                  : undefined,
              selectedCreatedBy:
                selectedCreatedBy !== ""
                  ? selectedCreatedBy === decoed.user_id
                    ? decoed.user_id
                    : selectedCreatedBy
                  : undefined,
              userId: decoed.user_id,
            },
            { cancelToken: cancelToken.token, headers: { token } }
          );
          setsearchResultCount(res.data.NoOfRecord);
          if (res.data.data.length) {
            if (res.data.data.length < 10) {
              setpaginationStopForSearch(false);
            }
            setsearchFilter(true);
            setsearchLoading(false);
            setCanceled(false);
            setsearchPage(2);

            // if (searchPage > 1) {
            //     res.data.data.forEach((data) => {
            //         const found = searchData.some((el) => el._id === data._id);
            //         if (!found) {
            //             setsearchData((prev) => [...prev, data]);
            //         }
            //     });
            // } else {
            setsearchData(res.data.data);
            //}
          } else {
            setsearchData([]);
            setsearchLoading(false);
            setCanceled(false);
            setsearchFilter(true);
          }
          resolve("done");
        }
      } catch (error) {
        if (error.message === "Operations cancelled due to new request") {
          //setsearchLoading(false);
          //setsearchFilter(false);
          setCanceled(true);
          setsearchLoading(false);
        } else {
          setsearchLoading(false);
          setsearchFilter(false);
        }
        reject(error);
      }
    });
  };

  const onClickAllType = (status) => {
    settestTypeStatusAllSelected(status);
    if (status) {
      const res = testType.map((testStatus) => {
        testStatus.status = true;
        return testStatus;
      });
      setPage(1);
      setsearchFilter(false);
      if (isfilter) {
        setpaginationStopForFilter(true);
        setisPaginationActive(false);
      } else {
        setpaginationStop(true);
        setisPaginationActive(false);
      }
      settestType(res);

      let filterData = testType.filter((data) => data.status === true);
      filterData = filterData.map((data) => {
        return data.name;
      });
      setselectedTestType(filterData);
    } else {
      if (searchText !== "") {
        setsearchFilter(true);
      }
      const res = testType.map((testStatus) => {
        testStatus.status = false;
        return testStatus;
      });
      settestType(res);
      setselectedTestType([]);
    }
  };

  const onClickAllStatus = (status) => {
    settestStatusAllSelected(status);
    if (status) {
      const res = testStatus.map((testStatus) => {
        testStatus.status = true;
        return testStatus;
      });
      setsearchFilter(false);
      settestStatus(res);
      let filterData = testStatus.filter((data) => data.status === true);
      filterData = filterData.map((data) => {
        return data.name;
      });
      setselectedTestStatus(filterData);
      setPage(1);
      if (isfilter) {
        setpaginationStopForFilter(true);
        setisPaginationActive(false);
      } else {
        setpaginationStop(true);
        setisPaginationActive(false);
      }
    } else {
      searchText !== "" && setsearchFilter(true);
      const res = testStatus.map((testStatus) => {
        testStatus.status = false;
        return testStatus;
      });
      settestStatus(res);
      setselectedTestStatus([]);
    }
  };

  const onClickTestStatus = (data) => {
    const res = testStatus.map((testStatus) => {
      if (testStatus.name === data.name) {
        if (data.status === false) {
          setPage(1);
          setsearchFilter(false);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setpaginationStop(true);
            setisPaginationActive(false);
          }
        } else {
          setPage(1);
          searchText !== "" && setsearchFilter(true);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setpaginationStop(true);
            setisPaginationActive(false);
          }
        }
        testStatus.status = !data.status;
        settestStatusAllSelected(false);
      }
      return testStatus;
    });
    settestStatus(res);

    let filterData = testStatus.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data.name;
    });
    setselectedTestStatus(filterData);
  };

  const onClickTestType = (data) => {
    const res = testType.map((testType) => {
      if (testType.name === data.name) {
        if (data.status === false) {
          setPage(1);
          setsearchFilter(false);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setpaginationStop(true);
            setisPaginationActive(false);
          }
        } else {
          setPage(1);
          searchText !== "" && setsearchFilter(true);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setpaginationStop(true);
            setisPaginationActive(false);
          }
        }
        testType.status = !data.status;
        settestTypeStatusAllSelected(false);
      }
      return testType;
    });
    settestType(res);

    let filterData = testType.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data.name;
    });
    setselectedTestType(filterData);
  };

  const SelectAllInviteOnly = (status, name) => {
    settestInviteOnlyAllSelected(status);
    const res = inviteOnlyType.map((testType) => {
      if (testType.name === name) {
        if (status) {
          setPage(1);
          setsearchFilter(false);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setisPaginationActive(false);
            setpaginationStop(true);
          }
        } else {
          setPage(1);
          searchText !== "" && setsearchFilter(true);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setpaginationStop(true);
            setisPaginationActive(false);
          }
        }
        testType.status = status;
      }
      return testType;
    });
    setinviteOnlyType(res);

    let filterData = inviteOnlyType.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data.name;
    });
    setselectedInviteOnly(filterData);
  };

  const onClickInviteOnly = (data) => {
    const res = inviteOnlyType.map((testType) => {
      if (testType.name === data.name) {
        if (data.status === false) {
          setPage(1);
          setsearchFilter(false);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setisPaginationActive(false);
            setpaginationStop(true);
          }
        } else {
          setPage(1);
          searchText !== "" && setsearchFilter(true);
          if (isfilter) {
            setpaginationStopForFilter(true);
            setisPaginationActive(false);
          } else {
            setpaginationStop(true);
            setisPaginationActive(false);
          }
        }
        testType.status = !data.status;

        settestInviteOnlyAllSelected(false);
      }
      return testType;
    });
    setinviteOnlyType(res);

    let filterData = inviteOnlyType.filter((data) => data.status === true);
    filterData = filterData.map((data) => {
      return data.name;
    });
    setselectedInviteOnly(filterData);
  };
  const checkSearchResultData = (data, index) => {
    return (
      <Card
        refersh={(updateData) => {
          const newArray = searchData.map((testDetails) =>
            testDetails._id === updateData._id
              ? { ...testDetails, status: updateData.status }
              : testDetails
          );

          setsearchData(newArray);
          getAllTestDetals();
          setloading(false);
        }}
        open={(testId) => {
          setSendInvitePopup(true);
          settestID(testId);
          const filterTestDataSingle = searchData.filter(
            (data) => data._id === testId
          );
          setsingleTestData(filterTestDataSingle[0]);
        }}
        {...data}
      />
    );
  };
  const checkData = (data, index) => {
    return (
      <Card
        refersh={(updateData) => {
          const newArray = (isfilter ? filterTestData : testData).map(
            (testDetails) =>
              testDetails._id === updateData._id
                ? {
                    ...testDetails,
                    status: updateData.status,
                    isActive: updateData.isActive,
                  }
                : testDetails
          );
          isfilter ? setfilterTestData(newArray) : settestData(newArray);
          getAllTestDetals();
          setloading(false);
        }}
        open={(testId) => {
          setSendInvitePopup(true);
          settestID(testId);
          const filterTestDataSingle = (
            isfilter ? filterTestData : testData
          ).filter((data) => data._id === testId);
          setsingleTestData(filterTestDataSingle[0]);
        }}
        {...data}
      />
    );
  };

  const filterCreationDate = async (creationDatDropdown, pageNo) => {
    try {
      setloading(true);
      setisfilter(true);
      const token = getCookie("Xh7ERL0G");
      const decoed = jwtDecode(token);

      if (creationDatDropdown === "Last 1 Week") {
        endDate.setDate(endDate.getDate() - 7);
      }
      if (creationDatDropdown === "Last 1 Month") {
        endDate.setDate(endDate.getDate() - 30);
      }
      if (creationDatDropdown === "Last Quarter") {
        endDate.setDate(endDate.getDate() - 120);
      }
      if (creationDatDropdown === "Last Year") {
        endDate.setDate(endDate.getDate() - 365);
      }

      if (creationDatDropdown !== "") {
        const res = await axios.post(
          `${backend_url}test/getTestAsPerCreationDate/${decoed.user_id}?page=${pageNo}&limit=10`,
          {
            startDate: `${startDate.getFullYear()}-${
              startDate.getMonth() + 1
            }-${startDate.getDate()}`,
            endDate: `${endDate.getFullYear()}-${
              endDate.getMonth() + 1
            }-${endDate.getDate()}`,
            status: selectedTestStatus.length ? selectedTestStatus : [],
            testInviteOnly: selectedInviteOnly.length ? true : undefined,
            testType: selectedTestType.length ? selectedTestType : [],
            selectedCreatedBy:
              selectedCreatedBy !== ""
                ? selectedCreatedBy === decoed.user_id
                  ? decoed.user_id
                  : selectedCreatedBy
                : undefined,
            searchText:
              searchText !== "" ? searchText.toLowerCase() : undefined,
          },
          { headers: { token: token } }
        );
        if (searchFilter && searchText !== "") {
          setsearchResultCount(res.data.NoOfRecord);
        } else {
          setfilterResultCount(res.data.NoOfRecord);
        }
        setloading(false);
        if (res.data.data.length) {
          setPage(2);

          if (res.data.data.length < 10) {
            setpaginationStopForFilter(false);
            // setisPaginationActive(false)
          }

          if (searchFilter && searchText !== "") {
            setsearchData(res.data.data);
          } else {
            setfilterTestData(res.data.data);
          }
        } else {
          setfilterTestData([]);
        }
      } else {
        if (
          selectedTestStatus.length !== 0 ||
          selectedInviteOnly.length !== 0 ||
          selectedTestType.length !== 0 ||
          selectedCreatedBy !== "" ||
          creationDatDropdown !== ""
        ) {
          setisfilter(true);
          if (creationDatDropdown === "Last 1 Week") {
            endDate.setDate(endDate.getDate() - 7);
          }
          if (creationDatDropdown === "Last 1 Month") {
            endDate.setDate(endDate.getDate() - 30);
          }
          if (creationDatDropdown === "Last Quarter") {
            endDate.setDate(endDate.getDate() - 120);
          }
          if (creationDatDropdown === "Last Year") {
            endDate.setDate(endDate.getDate() - 365);
          }
          const token = getCookie("Xh7ERL0G");
          const decode = jwtDecode(token);
          const currentDate = new Date(startDate);
          let newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);
          const res = await axios.post(
            `${backend_url}test/filterAssessemntAsPerParameterOptimise/${
              decode.user_id
            }?page=${1}&limit=10`,
            {
              status: selectedTestStatus.length ? selectedTestStatus : [],
              testInviteOnly: selectedInviteOnly.length ? true : undefined,
              testType: selectedTestType.length ? selectedTestType : [],
              startDate: creationDatDropdown !== "" ? newDate : undefined,
              endDate:
                creationDatDropdown !== ""
                  ? `${endDate.getFullYear()}-${
                      endDate.getMonth() + 1
                    }-${endDate.getDate()}`
                  : undefined,
              selectedCreatedBy:
                selectedCreatedBy !== ""
                  ? selectedCreatedBy === decode.user_id
                    ? decode.user_id
                    : selectedCreatedBy
                  : undefined,
              searchText:
                searchText !== "" ? searchText.toLowerCase() : undefined,
            },
            { headers: { token: token } }
          );
          if (searchFilter && searchText !== "") {
            setsearchResultCount(res.data.NoOfRecord);
          } else {
            setfilterResultCount(res.data.NoOfRecord);
          }
          setloading(false);
          if (res.data.data.length < 10) {
            setpaginationStopForFilter(false);
            //setisPaginationActive(false)
          }
          setPage((prev) => prev + 1);
          if (searchFilter && searchText !== "") {
            if (page > 1) {
              res.data.data.forEach((data) => {
                const found = searchData.some((el) => el._id === data._id);
                if (!found) {
                  setsearchData((prev) => [...prev, data]);
                }
              });
            } else {
              setsearchData(res.data.data);
            }
          } else {
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
          }
        } else {
          setisfilter(false);
          const token = getCookie("Xh7ERL0G");
          const decode = jwtDecode(token);

          if (creationDatDropdown === "Last 1 Week") {
            endDate.setDate(endDate.getDate() - 7);
          }
          if (creationDatDropdown === "Last 1 Month") {
            endDate.setDate(endDate.getDate() - 30);
          }
          if (creationDatDropdown === "Last Quarter") {
            endDate.setDate(endDate.getDate() - 120);
          }
          if (creationDatDropdown === "Last Year") {
            endDate.setDate(endDate.getDate() - 365);
          }
          const currentDate = new Date(startDate);
          let newDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate()
          );
          newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);
          const res = await axios.post(
            `${backend_url}test/filterAssessemntAsPerParameterOptimise/${
              decode.user_id
            }?page=${1}&limit=10`,
            {
              status: selectedTestStatus.length ? selectedTestStatus : [],
              testInviteOnly: selectedInviteOnly.length ? true : undefined,
              testType: selectedTestType.length ? selectedTestType : [],
              startDate: creationDatDropdown !== "" ? newDate : undefined,
              endDate:
                creationDatDropdown !== ""
                  ? `${endDate.getFullYear()}-${
                      endDate.getMonth() + 1
                    }-${endDate.getDate()}`
                  : undefined,
              selectedCreatedBy:
                selectedCreatedBy !== ""
                  ? selectedCreatedBy === decode.user_id
                    ? decode.user_id
                    : selectedCreatedBy
                  : undefined,
              searchText:
                searchText !== "" ? searchText.toLowerCase() : undefined,
            },
            { headers: { token: token } }
          );
          setloading(false);
          if (searchFilter && searchText !== "") {
            setsearchFilter(true);
            setsearchResultCount(res.data.NoOfRecord);
            setsearchData(res.data.data);
          } else {
            setisfilter(false);
            settestData(res.data.data);
            settotalTest(res.data.NoOfRecord);
          }
        }
        // getCreatedByUsers()
      }
    } catch (error) {
      setloading(false);
      toast(error);
    }
  };

  const getFilterCount = () => {
    let searchCount = 0;

    if (searchFilter && searchText !== "") {
      searchData.map((data) => {
        searchCount += 1;
      });
    } else {
      (isfilter ? filterTestData : testData).map((data) => {
        searchCount += 1;
      });
    }
    return searchCount;
  };

  const closeAssessmentModel = () => {
    setCreateAssessment(false);
  };

  const onHandleScroll = (e) => {
    if (
      Math.abs(
        e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)
      ) <= 1
    ) {
      setisPaginationActive(true);
      if (searchFilter && searchText !== "") {
        if (paginationStopForSearch) {
          setPaginationLoading(true);
          searchTest()
            .then((res) => {
              setPaginationLoading(false);
            })
            .catch((err) => {
              setPaginationLoading(false);
            });
        }
      } else {
        if (isfilter) {
          if (paginationStopForFilter) {
            setPaginationLoading(true);
            filterAssessementAsPerParameter()
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
          if (paginationStop) {
            setPaginationLoading(true);
            getAllTest()
              .then((data) => {
                setPaginationLoading(false);
              })
              .catch((error) => {
                setPaginationLoading(false);
              });
          }
        }
      }
      // if (searchFilter && searchText) {
      //     setsearchPage(prev => prev + 1)
      //     setsearchLoading(false)
      // } else {
      //     if (isfilter) {
      //         setPage(prev => prev + 1)
      //     } else {
      //         setPage(prev => prev + 1)
      //         setloading(false)
      //     }
      // }
    } else {
      return;
    }
  };

  const closePopup = (e) => {
    e.stopPropagation();
    setCreateAssessment(false);
  };

  const clickAssessment = (e) => {
    e.stopPropagation();
    setCreateAssessment(true);
  };

  useEffect(() => {
    if (
      selectedTestStatus.length !== 0 ||
      selectedInviteOnly.length !== 0 ||
      selectedTestType.length !== 0 ||
      selectedCreatedBy !== "" ||
      selectedCreationDate !== ""
    ) {
      setisfilter(true);
      filterAssessementAsPerParameter();
    } else {
      setisfilter(false);
      getAllTest();
    }
  }, [
    selectedTestStatus,
    selectedInviteOnly,
    selectedTestType,
    selectedCreatedBy,
  ]);

  const filterAssessementAsPerParameter = () => {
    return new Promise(async (resolve, reject) => {
      setCanceled(false);
      setloading(true);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      try {
        if (selectedCreationDate === "Last 1 Week") {
          endDate.setDate(endDate.getDate() - 7);
        }
        if (selectedCreationDate === "Last 1 Month") {
          endDate.setDate(endDate.getDate() - 30);
        }
        if (selectedCreationDate === "Last Quarter") {
          endDate.setDate(endDate.getDate() - 120);
        }
        if (selectedCreationDate === "Last Year") {
          endDate.setDate(endDate.getDate() - 365);
        }
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);
        const currentDate = new Date(startDate);
        let newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);

        const res = await axios.post(
          `${backend_url}test/filterAssessemntAsPerParameterOptimise/${decode.user_id}?page=${page}&limit=10`,
          {
            status: selectedTestStatus.length ? selectedTestStatus : [],
            testInviteOnly: selectedInviteOnly.length ? true : undefined,
            testType: selectedTestType.length ? selectedTestType : [],
            startDate: selectedCreationDate !== "" ? newDate : undefined,
            endDate:
              selectedCreationDate !== ""
                ? `${endDate.getFullYear()}-${
                    endDate.getMonth() + 1
                  }-${endDate.getDate()}`
                : undefined,
            selectedCreatedBy:
              selectedCreatedBy !== ""
                ? selectedCreatedBy === decode.user_id
                  ? decode.user_id
                  : selectedCreatedBy
                : undefined,
            searchText:
              searchText !== "" ? searchText.toLowerCase() : undefined,
          },
          { cancelToken: cancelToken.token, headers: { token: token } }
        );
        if (searchText !== "" && searchFilter) {
          setsearchResultCount(res.data.NoOfRecord);
        } else {
          setfilterResultCount(res.data.NoOfRecord);
        }
        if (res.data.data.length < 10) {
          setpaginationStopForFilter(false);
          //setisPaginationActive(false)
        }
        setPage((prev) => prev + 1);
        if (searchFilter && searchText !== "") {
          if (page > 1) {
            res.data.data.forEach((data) => {
              const found = searchData.some((el) => el._id === data._id);
              if (!found) {
                setsearchData((prev) => [...prev, data]);
              }
            });
          } else {
            setsearchData(res.data.data);
          }
        } else {
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
        }
        setloading(false);
        setCanceled(false);
        resolve("done"); // Return the data
      } catch (error) {
        if (error.message === "Operations cancelled due to new request") {
          setloading(false);
          setCanceled(true);
        } else {
          setloading(false);
        }
        toast.error(error);
        reject(error); // Reject with the error
      } finally {
        setloading(false); // Ensure that the loading state is always set to false
      }
    });
  };

  const handleCreationDateDropdown = (e) => {
    setPage(() => 1);
    if (isfilter) {
      setpaginationStopForFilter(true);
    } else {
      setpaginationStop(true);
    }
    setselectedCreationDate(e.target.value);
    filterCreationDate(e.target.value, 1);
  };

  const handleCreatedByDropdown = async (e) => {
    setPage(() => 1);
    setselectedCreatedBy(e.target.value);
    if (e.target.value !== "") {
      setsearchFilter(false);
    } else {
      if (searchText !== "") {
        setsearchFilter(true);
      }
      if (
        selectedTestStatus.length !== 0 ||
        selectedInviteOnly.length !== 0 ||
        selectedTestType.length !== 0 ||
        e.target.value !== "" ||
        selectedCreationDate !== ""
      ) {
        setisfilter(true);
      } else {
        setisfilter(false);
      }
      setloading(true);

      if (
        selectedTestStatus.length !== 0 ||
        selectedInviteOnly.length !== 0 ||
        selectedTestType.length !== 0 ||
        e.target.value !== "" ||
        selectedCreationDate !== ""
      ) {
        setisfilter(true);
        if (selectedCreationDate === "Last 1 Week") {
          endDate.setDate(endDate.getDate() - 7);
        }
        if (selectedCreationDate === "Last 1 Month") {
          endDate.setDate(endDate.getDate() - 30);
        }
        if (selectedCreationDate === "Last Quarter") {
          endDate.setDate(endDate.getDate() - 120);
        }
        if (selectedCreationDate === "Last Year") {
          endDate.setDate(endDate.getDate() - 365);
        }

        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);
        const currentDate = new Date(startDate);
        let newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);
        const res = await axios.post(
          `${backend_url}test/filterAssessemntAsPerParameterOptimise/${
            decode.user_id
          }?page=${1}&limit=10`,
          {
            status: selectedTestStatus.length ? selectedTestStatus : [],
            testInviteOnly: selectedInviteOnly.length ? true : undefined,
            testType: selectedTestType.length ? selectedTestType : [],
            startDate: selectedCreationDate !== "" ? newDate : undefined,
            endDate:
              selectedCreationDate !== ""
                ? `${endDate.getFullYear()}-${
                    endDate.getMonth() + 1
                  }-${endDate.getDate()}`
                : undefined,
            selectedCreatedBy:
              e.target.value !== ""
                ? e.target.value === decode.user_id
                  ? decode.user_id
                  : e.target.value
                : undefined,
            searchText:
              searchText !== "" ? searchText.toLowerCase() : undefined,
          },
          { headers: { token: token } }
        );
        setloading(false);
        setfilterResultCount(res.data.NoOfRecord);
        if (res.data.data.length < 10) {
          setpaginationStopForFilter(false);
          //setisPaginationActive(false)
        }

        if (searchFilter && searchText !== "") {
          if (page > 1) {
            res.data.data.forEach((data) => {
              const found = searchData.some((el) => el._id === data._id);
              if (!found) {
                setsearchData((prev) => [...prev, data]);
              }
            });
          } else {
            setsearchData(res.data.data);
          }
          setisfilter(true);
        } else {
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
          setisfilter(true);
        }
        setPage((prev) => prev + 1);
      } else {
        setisfilter(false);
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);

        if (selectedCreationDate === "Last 1 Week") {
          endDate.setDate(endDate.getDate() - 7);
        }
        if (selectedCreationDate === "Last 1 Month") {
          endDate.setDate(endDate.getDate() - 30);
        }
        if (selectedCreationDate === "Last Quarter") {
          endDate.setDate(endDate.getDate() - 120);
        }
        if (selectedCreationDate === "Last Year") {
          endDate.setDate(endDate.getDate() - 365);
        }
        const currentDate = new Date(startDate);
        let newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate()
        );
        newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);
        const res = await axios.post(
          `${backend_url}test/filterAssessemntAsPerParameterOptimise/${
            decode.user_id
          }?page=${1}&limit=10`,
          {
            status: selectedTestStatus.length ? selectedTestStatus : [],
            testInviteOnly: selectedInviteOnly.length ? true : undefined,
            testType: selectedTestType.length ? selectedTestType : [],
            startDate: selectedCreationDate !== "" ? newDate : undefined,
            endDate:
              selectedCreationDate !== ""
                ? `${endDate.getFullYear()}-${
                    endDate.getMonth() + 1
                  }-${endDate.getDate()}`
                : undefined,
            selectedCreatedBy:
              e.target.value !== ""
                ? e.target.value === decode.user_id
                  ? decode.user_id
                  : e.target.value
                : undefined,
            searchText:
              searchText !== "" ? searchText.toLowerCase() : undefined,
          },
          { headers: { token: token } }
        );
        setloading(false);
        if (searchFilter && searchText !== "") {
          setsearchFilter(true);
          setsearchResultCount(res.data.NoOfRecord);
          setsearchData(res.data.data);
        } else {
          setisfilter(false);
          settestData(res.data.data);
          settotalTest(res.data.NoOfRecord);
        }
      }
    }

    if (isfilter) {
      setpaginationStopForFilter(true);
    } else {
      setpaginationStop(true);
    }
  };

  useEffect(() => {
    setsearchPage(1);
    setpaginationStopForSearch(true);
    setisPaginationActive(false);
    cancelToken = axios.CancelToken.source();
    // console.log(searchText === "")
    // if (searchText === "") {
    //     filterAssessementAsPerParameter()
    // }
  }, [searchText]);

  const handleSearchChange = async (e) => {
    setsearchLoading(true);
    setCanceled(false);
    onChangeSearchSkillText(e.target.value);
    const value = e.target.value;
    if (cancelToken) {
      cancelToken.cancel("Operations cancelled due to new request");
    }
    cancelToken = axios.CancelToken.source();

    try {
      if (selectedCreationDate === "Last 1 Week") {
        endDate.setDate(endDate.getDate() - 7);
      }
      if (selectedCreationDate === "Last 1 Month") {
        endDate.setDate(endDate.getDate() - 30);
      }
      if (selectedCreationDate === "Last Quarter") {
        endDate.setDate(endDate.getDate() - 120);
      }
      if (selectedCreationDate === "Last Year") {
        endDate.setDate(endDate.getDate() - 365);
      }
      const token = getCookie("Xh7ERL0G");
      const decoed = jwtDecode(token);
      let res = [];
      res = await axios.post(
        `${backend_url}test/searchTest?page=1&limit=10`,
        {
          searchText: value.toLowerCase(),
          status: selectedTestStatus.length ? selectedTestStatus : [],
          testInviteOnly: selectedInviteOnly.length ? true : undefined,
          testType: selectedTestType.length ? selectedTestType : [],
          startDate:
            selectedCreationDate !== ""
              ? `${startDate.getFullYear()}-${
                  startDate.getMonth() + 1
                }-${startDate.getDate()}`
              : undefined,
          endDate:
            selectedCreationDate !== ""
              ? `${endDate.getFullYear()}-${
                  endDate.getMonth() + 1
                }-${endDate.getDate()}`
              : undefined,
          selectedCreatedBy:
            selectedCreatedBy !== ""
              ? selectedCreatedBy === decoed.user_id
                ? decoed.user_id
                : selectedCreatedBy
              : undefined,
          userId: decoed.user_id,
        },
        { cancelToken: cancelToken.token, headers: { token: token } }
      );

      if (value !== "") {
        setsearchResultCount(res.data.NoOfRecord);
      } else {
        setfilterResultCount(res.data.NoOfRecord);
      }
      if (
        selectedTestStatus.length !== 0 ||
        selectedInviteOnly.length !== 0 ||
        selectedTestType.length !== 0 ||
        selectedCreatedBy !== decode.user_id ||
        selectedCreationDate !== ""
      ) {
        setisfilter(true);
      } else {
        setisfilter(false);
      }

      setSkillData(res.data.data, value);
      setsearchLoading(false);
      setCanceled(false);
    } catch (error) {
      if (error.message === "Operations cancelled due to new request") {
        setCanceled(true);
        setsearchLoading(false);
      } else {
        setsearchLoading(false);
      }
      toast.error(error);
    } finally {
      setsearchLoading(false); // Ensure that the loading state is always set to false
    }
  };

  const setSkillData = (data, text) => {
    if (data.length) {
      if (data.length < 10) {
        setpaginationStopForSearch(false);
      }
      setsearchFilter(true);
      setsearchLoading(false);
      if (text !== "") {
        if (searchPage > 1) {
          data.forEach((data) => {
            setsearchData((prev) => [...prev, data]);
          });
        } else {
          setsearchData(data);
        }
      } else {
        setisfilter(true);
        setfilterTestData(data);
      }
    } else {
      setsearchData([]);
      setsearchLoading(false);
      setsearchFilter(true);
    }
  };

  const onChangeSearchSkillText = (text) => {
    setsearchText(text);
  };

  const clearSearchText = async () => {
    setsearchText("");
    setsearchFilter(false);
    setloading(true);
    try {
      if (selectedCreationDate === "Last 1 Week") {
        endDate.setDate(endDate.getDate() - 7);
      }
      if (selectedCreationDate === "Last 1 Month") {
        endDate.setDate(endDate.getDate() - 30);
      }
      if (selectedCreationDate === "Last Quarter") {
        endDate.setDate(endDate.getDate() - 120);
      }
      if (selectedCreationDate === "Last Year") {
        endDate.setDate(endDate.getDate() - 365);
      }
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const currentDate = new Date(startDate);
      let newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      newDate = new Date(newDate.getTime() + 24 * 60 * 60 * 1000);
      const res = await axios.post(
        `${backend_url}test/filterAssessemntAsPerParameterOptimise/${decode.user_id}?page=1&limit=10`,
        {
          status: selectedTestStatus.length ? selectedTestStatus : [],
          testInviteOnly: selectedInviteOnly.length ? true : undefined,
          testType: selectedTestType.length ? selectedTestType : [],
          startDate: selectedCreationDate !== "" ? newDate : undefined,
          endDate:
            selectedCreationDate !== ""
              ? `${endDate.getFullYear()}-${
                  endDate.getMonth() + 1
                }-${endDate.getDate()}`
              : undefined,
          selectedCreatedBy:
            selectedCreatedBy !== ""
              ? selectedCreatedBy === decode.user_id
                ? decode.user_id
                : selectedCreatedBy
              : undefined,
        },
        { headers: { token: token } }
      );
      // console.log(searchFilter && searchText !== "")
      // if (searchFilter && searchText !== "") {
      //     setsearchResultCount(res.data.NoOfRecord)
      // } else {
      setfilterResultCount(res.data.NoOfRecord);
      //}
      if (res.data.data.length < 10) {
        setpaginationStopForFilter(false);
        //setisPaginationActive(false)
      }
      if (
        selectedTestStatus.length !== 0 ||
        selectedInviteOnly.length !== 0 ||
        selectedTestType.length !== 0 ||
        selectedCreatedBy !== "" ||
        selectedCreationDate !== ""
      ) {
        setisfilter(true);
      } else {
        setisfilter(false);
      }

      setPage((prev) => prev + 1);
      if (
        selectedTestStatus.length !== 0 ||
        selectedInviteOnly.length !== 0 ||
        selectedTestType.length !== 0 ||
        selectedCreatedBy !== "" ||
        selectedCreationDate !== ""
      ) {
        setfilterTestData(res.data.data);
      } else {
        settestData(res.data.data);
      }
      setloading(false);
    } catch (error) {
      setloading(false);
    }
  };

  return (
    <div>
      {createAssessment && (
        <TestTypeModel closeAssessmentModel={closeAssessmentModel} />
      )}

      <NavigationBar active="assesment" />
      {sendInvitePopup && (
        <CandidateInvite
          testData={singleTestData}
          testId={testId}
          open={() => {
            setSendInvitePopup(true);
          }}
          invitedCandidate={() => {
            getAllTest();
            setSendInvitePopup(false);
          }}
          closePopup={() => {
            setSendInvitePopup(false);
          }}
        />
      )}
      <div className="assement-container">
        <div className="left-panel-container">
          <span>
            {testStatusAllSelected ? (
              <svg
                style={{ cursor: "pointer" }}
                onClick={() => onClickAllStatus(false)}
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="0.5" width="15" height="15" rx="2" fill="#FF6812" />
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
                style={{ cursor: "pointer" }}
                onClick={() => onClickAllStatus(true)}
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
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
            )}
            <label>Test Status</label>
          </span>
          <div className="border-of-assessment">1</div>
          {testStatus.map((data, index) => {
            return (
              <div
                data-tip={data.name}
                key={index}
                className="test-status-list-item"
              >
                {data.status ? (
                  <svg
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickTestStatus(data)}
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
                      fill="#FF6812"
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
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickTestStatus(data)}
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
                      stroke="white"
                      stroke-width="1.5"
                    />
                  </svg>
                )}
                <span>
                  {data.name} ({data.count})
                </span>
              </div>
            );
          })}
          <span style={{ marginTop: 30 }}>
            <label>Created By</label>
          </span>
          <div
            style={{ cursor: "pointer" }}
            className="created-by-dropdown-container"
          >
            <select
              ref={createdBySelect}
              style={{ cursor: "pointer" }}
              value={selectedCreatedBy}
              onChange={handleCreatedByDropdown}
            >
              <option label="All" value="" />
              <option label={username} value={myselfId} />
              {createdBy?.map((data) => {
                return <option label={data.fullName} value={data._id} />;
              })}
            </select>
          </div>
          <span style={{ marginTop: 30 }}>
            <label>Creation Date</label>
          </span>
          <div
            style={{ cursor: "pointer" }}
            className="created-by-dropdown-container"
          >
            <select
              style={{ cursor: "pointer" }}
              value={selectedCreationDate}
              onChange={handleCreationDateDropdown}
            >
              <option label="All" value="" />
              <option label="Last 1 Week" value="Last 1 Week" />
              <option label="Last 1 Month" value="Last 1 Month" />
              <option label="Last Quarter" value="Last Quarter" />
              <option label="Last Year" value="Last Year" />
            </select>
          </div>

          <span style={{ marginTop: 30 }}>
            {testTypeStatusAllSelected ? (
              <svg
                style={{ cursor: "pointer" }}
                onClick={() => onClickAllType(false)}
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="0.5" width="15" height="15" rx="2" fill="#FF6812" />
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
                style={{ cursor: "pointer" }}
                onClick={() => onClickAllType(true)}
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
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
            )}
            <label>Test Type</label>
          </span>
          <div className="border-of-assessment">1</div>

          {testType.map((data, index) => {
            return (
              <div
                data-tip={data.name}
                key={index}
                className="test-status-list-item"
              >
                {data.status ? (
                  <svg
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickTestType(data)}
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
                      fill="#FF6812"
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
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickTestType(data)}
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
                      stroke="white"
                      stroke-width="1.5"
                    />
                  </svg>
                )}
                <span>
                  {data.name} ({data.count})
                </span>
              </div>
            );
          })}

          <span style={{ marginTop: 30 }}>
            {testInviteOnlyAllSelected ? (
              <svg
                style={{ cursor: "pointer" }}
                onClick={() => SelectAllInviteOnly(false, "invite only")}
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect y="0.5" width="15" height="15" rx="2" fill="#FF6812" />
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
                style={{ cursor: "pointer" }}
                onClick={() => SelectAllInviteOnly(true, "invite only")}
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
                  stroke="white"
                  stroke-width="1.5"
                />
              </svg>
            )}
            <label>Invite Only</label>
          </span>
          <div className="border-of-assessment">1</div>
          {inviteOnlyType.map((data, index) => {
            return (
              <div
                data-tip={data.name}
                key={index}
                className="test-status-list-item"
              >
                {data.status ? (
                  <svg
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickInviteOnly(data)}
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
                      fill="#FF6812"
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
                    style={{ cursor: "pointer" }}
                    onClick={() => onClickInviteOnly(data)}
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
                      stroke="white"
                      stroke-width="1.5"
                    />
                  </svg>
                )}
                <span>
                  {data.name} ({data.count})
                </span>
              </div>
            );
          })}
        </div>

        <div className="right-panel-container">
          <div className="header-and-button-container">
            <span>
              <label>
                Assessments{" "}
                {(loading || searchLoading) && PaginationLoading === false ? (
                  <div className="loader"></div>
                ) : (
                  <>
                    {canceled ? (
                      <div className="loader"></div>
                    ) : (
                      <>
                        (
                        {searchFilter && searchText !== ""
                          ? searchResultCount !== ""
                            ? searchResultCount
                            : 0
                          : selectedTestStatus.length !== 0 ||
                            selectedInviteOnly.length !== 0 ||
                            selectedTestType.length !== 0 ||
                            selectedCreatedBy !== "" ||
                            selectedCreationDate !== ""
                          ? filterResultCount !== ""
                            ? filterResultCount
                            : 0
                          : testNonFilterCount}
                        )
                      </>
                    )}{" "}
                  </>
                )}{" "}
              </label>
              <div className="search-container">
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    onClickSearchIcon();
                  }}
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.0225 16.0985L11.5314 12.6066C8.80893 14.7527 4.88556 14.4049 2.58295 11.8136C0.280299 9.22218 0.39631 5.28521 2.84757 2.83395C5.29883 0.38264 9.23585 0.266628 11.8272 2.56924C14.4186 4.87189 14.7663 8.79521 12.6203 11.5177L16.1114 15.0081C16.3365 15.1959 16.4362 15.4947 16.3689 15.78C16.3017 16.0653 16.079 16.2881 15.7937 16.3556C15.5085 16.423 15.2096 16.3235 15.0217 16.0985H15.0225ZM2.46881 7.4614C2.4681 9.4746 3.67365 11.2929 5.52884 12.0762C7.38399 12.8595 9.52788 12.4554 10.9706 11.0505C10.9848 11.0332 10.9999 11.0168 11.0159 11.0013C11.0319 10.9859 11.0482 10.9709 11.0647 10.9564C12.6401 9.33856 12.9379 6.86632 11.7917 4.92058C10.6454 2.97484 8.33872 2.03697 6.15992 2.63078C3.98111 3.22458 2.46928 5.20315 2.46876 7.4614H2.46881Z"
                    fill="#606D77"
                  />
                </svg>
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchTest();
                    }
                  }}
                  onChange={handleSearchChange}
                  value={searchText}
                  placeholder="Search assessments"
                />
                {searchText !== "" ? (
                  <svg
                    onClick={() => clearSearchText()}
                    style={{ right: 50, cursor: "pointer" }}
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
              </div>
            </span>

            <button onClick={clickAssessment}>
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
              <span>Create Assessments</span>
            </button>
          </div>
          <div onScroll={(e) => onHandleScroll(e)} className="assessment-card">
            {(loading || searchLoading) && PaginationLoading === false ? (
              <>
                {loadingArray.map((index) => (
                  <AssesmentCardSkeleton key={index} />
                ))}
              </>
            ) : (
              <>
                {canceled ? (
                  <>
                    {loadingArray.map((index) => (
                      <AssesmentCardSkeleton key={index} />
                    ))}
                  </>
                ) : (
                  <>
                    {searchFilter && searchText !== "" ? (
                      <>
                        {searchData ? (
                          <>
                            {searchData.length ? (
                              <>
                                {searchData.map((data, index) => {
                                  return checkSearchResultData(data);
                                })}
                              </>
                            ) : (
                              <div style={{ textAlign: "center" }}>
                                No assessment available
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            "No assessment available "
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {(isfilter ? filterTestData : testData) ? (
                          <>
                            {(isfilter ? filterTestData : testData).length ? (
                              <>
                                {(isfilter ? filterTestData : testData).map(
                                  (data) => {
                                    return checkData(data);
                                  }
                                )}
                              </>
                            ) : (
                              <div style={{ textAlign: "center" }}>
                                No assessment available
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ textAlign: "center" }}>
                            No assessment available
                          </div>
                        )}
                      </>
                    )}

                    {PaginationLoading ? (
                      <>
                        {loadingArray.map((index) => (
                          <AssesmentCardSkeleton key={index} />
                        ))}
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assesment;
