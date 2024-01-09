import React from "react";
import { useState, useEffect } from "react";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import "./Interview.css";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { toast } from "react-toastify";
import jwtDecode from "jwt-decode";
import NotDonePopup from "./popup";
import SelectionStatusPopup from "./selection-popup";
let cancelToken;

function Interview() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setloading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [tests, setTests] = useState([]);
  const [statisticsLoading, setStatisticsLoading] = useState(false);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [closePopup, setClosePopup] = useState(false);
  const [selectedInterviews, setSelectedInterviews] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [completedfilterValue, setCompletedFilterValue] = useState("All");
  const [completedDateFilterValue, setCompletedDateFilterValue] =
    useState("This Week");
  const [filterValue, setFilterValue] = useState("All");
  const [scheduledDateFilterValue, setScheduledDateFilterValue] =
    useState("This Week");
  const [scheduledLoading, setScheduledLoading] = useState(false);
  const [scheduledInterviewCurrentPage, setScheduledInterviewCurrentPage] =
    useState(1);
  const [scheduledInterviewTotalPages, setScheduledInterviewTotalPages] =
    useState(1);
  const [completedInterviewCurrentPage, setCompletedInterviewCurrentPage] =
    useState(1);
  const [completedInterviewTotalPages, setCompletedInterviewTotalPages] =
    useState(1);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [completedInterviewSearch, setCompletedInterviewSearch] = useState("");
  const [loaderIndex, setLoaderIndex] = useState(null);
  const [scheduledDocs, setScheduledDocs] = useState(0);
  const [completedDocs, setCompletedDocs] = useState(0);
  const [selectionStatus, setSelectionStatus] = useState({
    isLoading: false,
    loaderIndex: null,
    button: null,
    data: null,
    status: null,
  });
  const [selectionPopup, setSelectionPopup] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [scheduledSearchLoading, setScheduledSearchLoading] = useState(false);
  const [completedSearchLoading, setCompletedSearchLoading] = useState(false);
  const [interviewsCopy, setInterviewsCopy] = useState([]);
  const [completedCopy, setCompletedCopy] = useState([]);
  const [completedSearchData, setCompletedSearchData] = useState([]);
  const [persistScheduledSearch, setPersistScheduledSearch] = useState("");
  const [persistCompletedSearch, setPersistCompletedSearch] = useState("");

  const loadingArray = [
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
  ];

  useEffect(() => {
    getTestsByUserId();
    getStatistics();
    searchInterviews("scheduled");
    searchCompletedInterviews("completed");
  }, []);

  useEffect(() => {
    searchInterviews("scheduled");
  }, [scheduledInterviewCurrentPage, filterValue, scheduledDateFilterValue]);

  useEffect(() => {
    searchCompletedInterviews("completed");
  }, [
    completedInterviewCurrentPage,
    completedfilterValue,
    completedDateFilterValue,
  ]);
  useEffect(() => {
    return () => {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
    };
  }, []);

  const getStatistics = async () => {
    try {
      setStatisticsLoading(true);
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(
        `${backend_url}interview/get/statistics`,
        { headers: { token: token } }
      );
      setStatistics(response.data);
      setStatisticsLoading(false);
    } catch (error) {
      console.log(error);
      setStatisticsLoading(false);
    }
  };

  const getTestsByUserId = async () => {
    try {
      setTestLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      const response = await axios.get(
        `${backend_url}test/getAllTest/${decoded.user_id}`,
        { headers: { token: token } }
      );
      setTests(response.data.data);
      setTestLoading(false);
    } catch (error) {
      console.log(error);
      setTestLoading(false);
    }
  };

  const getScheduledInterviews = async () => {
    try {
      setScheduledLoading(true);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(
        `${backend_url}interview/get/scheduled/interviews?page=${scheduledInterviewCurrentPage}&limit=10&filter=${filterValue},${scheduledDateFilterValue}`,
        { cancelToken: cancelToken.token, headers: { token: token } }
      );
      setInterviews(response.data.data);
      setInterviewsCopy(response.data.data);
      setScheduledInterviewCurrentPage(parseInt(response.data.currentPage));
      setScheduledInterviewTotalPages(parseInt(response.data.totalPages));
      setScheduledDocs(parseInt(response.data.totalDocs));
      setScheduledLoading(false);
    } catch (error) {
      setScheduledLoading(false);
      console.log(error);
    }
  };

  const getCompletedInterviews = async () => {
    try {
      setCompletedLoading(true);
      const token = getCookie("Xh7ERL0G");
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      const response = await axios.get(
        `${backend_url}interview/get/completed/interviews?page=${completedInterviewCurrentPage}&limit=10&filter=${completedfilterValue},${completedDateFilterValue}`,
        { headers: { token: token }, cancelToken: cancelToken.token }
      );
      setCompletedInterviews(response.data.data);
      setCompletedCopy(response.data.data);
      setCompletedInterviewCurrentPage(parseInt(response.data.currentPage));
      setCompletedInterviewTotalPages(parseInt(response.data.totalPages));
      setCompletedDocs(parseInt(response.data.totalDocs));
      setCompletedLoading(false);
    } catch (error) {
      setCompletedLoading(false);
      console.log(error);
    }
  };

  const searchInterviews = async (value) => {
    try {
      setSearch("");
      setScheduledLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        `${backend_url}interview/search/${decoded.user_id}?filter=${filterValue},${scheduledDateFilterValue},${value}&page=${scheduledInterviewCurrentPage}&limit=10`,
        {
          searchText: persistScheduledSearch.toLowerCase(),
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        if (response.data.data !== undefined) {
          setInterviews(response.data.data);
          setInterviewsCopy(response.data.data);
          setScheduledInterviewCurrentPage(parseInt(response.data.currentPage));
          setScheduledInterviewTotalPages(parseInt(response.data.totalPages));
          setScheduledDocs(parseInt(response.data.totalDocs));
          setScheduledLoading(false);
        } else {
          toast.success("No result found.");
        }
      }
      setScheduledLoading(false);
    } catch (error) {
      console.log(error);
      // toast.error("Opps something went wrong please try again!")
    }
  };

  const searchCompletedInterviews = async (value) => {
    try {
      setCompletedInterviewSearch("");
      setCompletedLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        `${backend_url}interview/search/${decoded.user_id}?filter=${completedfilterValue},${completedDateFilterValue},${value}&page=${completedInterviewCurrentPage}&limit=10`,
        {
          searchText: persistCompletedSearch.toLowerCase(),
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        if (response.data.data !== undefined) {
          setCompletedInterviews(response.data.data);
          setCompletedCopy(response.data.data);
          setCompletedInterviewCurrentPage(parseInt(response.data.currentPage));
          setCompletedInterviewTotalPages(parseInt(response.data.totalPages));
          setCompletedDocs(parseInt(response.data.totalDocs));
          setCompletedLoading(false);
        } else {
          toast.success("No result found.");
          setCompletedLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setCompletedLoading(false);
    }
  };

  const searchInterviewsOnChange = async (e, value) => {
    try {
      setScheduledSearchLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        `${backend_url}interview/search/${decoded.user_id}?filter=${filterValue},${scheduledDateFilterValue},${value}&page=${scheduledInterviewCurrentPage}&limit=10`,
        {
          searchText: e.target.value.toLowerCase(),
        },
        { headers: { token: token }, cancelToken: cancelToken.token }
      );
      if (response.status === 200) {
        setScheduledSearchLoading(false);
        if (e.target.value !== "") {
          setSearchData(response.data.data);
          setScheduledInterviewCurrentPage(1);
          setScheduledInterviewTotalPages(1);
        } else {
          setSearchData([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const searchCompletedInterviewsOnChange = async (e, value) => {
    try {
      setCompletedSearchLoading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      const response = await axios.post(
        `${backend_url}interview/search/${decoded.user_id}?filter=${completedfilterValue},${completedDateFilterValue},${value}`,
        {
          searchText: e.target.value.toLowerCase(),
        },
        { headers: { token: token }, cancelToken: cancelToken.token }
      );
      if (response.status === 200) {
        setCompletedSearchLoading(false);
        if (e.target.value !== "") {
          setCompletedSearchData(response.data.data);
          setCompletedInterviewCurrentPage(1);
          setCompletedInterviewTotalPages(1);
        } else {
          setCompletedSearchData([]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckBox = (length) => {
    if (length !== undefined) {
      setSelectedAll(true);
      setSelectedInterviews(interviews);
    }
  };

  const handlePopup = () => {
    setClosePopup(!closePopup);
  };
  const handleSelectionPopup = () => {
    setSelectionPopup(!selectionPopup);
  };

  const updateInterviewStatus = async (data) => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      let dataToUpdate = data;
      dataToUpdate.interviewStatus = "interviewed";
      const response = await axios.put(
        `${backend_url}interview/update/${data._id}`,
        {
          interview: dataToUpdate,
          userId: decoded.user_id,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        const removedInterviewFromSchedule = interviews.filter(
          (d) => d._id !== data._id
        );
        setScheduledDocs(scheduledDocs - 1);
        setInterviews(removedInterviewFromSchedule);
        await getCompletedInterviews();
        // setCompletedInterviews([...completedInterviews, ...[dataToUpdate]])
        setStatistics({
          ...statistics,
          candidateInterviewed: statistics.candidateInterviewed + 1,
        });
        setloading(false);
        toast.success("Interview status updated successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Opps, Please try again!");
    }
  };

  const updateSelectionStatus = async (data, status) => {
    try {
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      let dataToUpdate = data;
      dataToUpdate.selectionStatus = status;
      if (data.round === "R1" && status === "Not Selected") {
        dataToUpdate.finalStatus = "R1 Failed";
      } else if (data.round === "R1" && status === "selected") {
        dataToUpdate.finalStatus = "R1 Passed";
      } else if (data.round === "R2" && status === "selected") {
        dataToUpdate.finalStatus = "R2 Passed";
      } else if (data.round === "R2" && status === "Not Selected") {
        dataToUpdate.finalStatus = "R2 Failed";
      }
      const response = await axios.put(
        `${backend_url}interview/update/${data._id}`,
        {
          interview: dataToUpdate,
          userId: decoded.user_id,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        toast.success("Selection status updated successfully.");
        console.log(data);
        if (data.finalStatus === "R2 Passed" && status === "selected") {
          setStatistics({
            ...statistics,
            candidateSelected: statistics.candidateSelected + 1,
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Opps, Please try again!");
    }
  };

  const updateInterviewStatusInBulk = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      const response = await axios.put(
        `${backend_url}interview/update/interview/status/${decoded.user_id}`,
        {
          interviews: selectedInterviews,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        const updatedInterviews = selectedInterviews.map((data) => {
          data.status = "interviewed";
          return data;
        });
        const removedInterviewFromSchedule = interviews.filter(
          (data, index) => data._id !== selectedInterviews[index]?._id
        );
        setInterviews(removedInterviewFromSchedule);
        await getCompletedInterviews();
        // setCompletedInterviews([...completedInterviews, ...updatedInterviews])
        setScheduledDocs(scheduledDocs - selectedInterviews.length);
        setStatistics({
          ...statistics,
          candidateInterviewed:
            statistics.candidateInterviewed + updatedInterviews.length,
        });
        setSelectedInterviews([]);
        toast.success("Status updated successfully.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Opps, Please try again!");
    }
  };

  const handleInterviewedBtn = () => {
    if (selectedInterviews.length > 0) {
      setSelectionPopup(true);
    }
  };

  const handleNotDoneBtn = () => {
    if (selectedInterviews.length > 0) {
      setClosePopup(true);
    }
  };

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

  const formatDate = (time) => {
    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;

    return {
      fullDate: ` ${day} ${month} ${year} , ${strTime}, IST`,
      date: new Date(year, date.getMonth(), day), // add a new field for the formatted date
    };
  };

  useEffect(() => {
    if (selectionStatus.isLoading) {
      updateSelectionStatus(selectionStatus.data, selectionStatus.status).then(
        () => {
          setSelectionStatus({
            isLoading: false,
            loaderIndex: null,
            button: null,
          });
        }
      );
    }
  }, [selectionStatus]);

  const handleClick = (data, status, index, selection) => {
    setSelectionStatus({
      isLoading: true,
      loaderIndex: index,
      button: selection,
      data: data,
      status: status,
    });
  };

  // console.log(completedInterviews)
  return (
    <div className="interview-container">
      <NavigationBar active="interview" />
      {closePopup ? (
        <NotDonePopup
          closePopup={handlePopup}
          selectedInterviews={selectedInterviews}
          setClosePopup={setClosePopup}
          getCompletedInterviews={getCompletedInterviews}
          getScheduledInterviews={getScheduledInterviews}
          getStatistics={getStatistics}
          setSelectedInterviews={setSelectedInterviews}
        />
      ) : null}
      {selectionPopup ? (
        <SelectionStatusPopup
          closePopup={handleSelectionPopup}
          selectedInterviews={selectedInterviews}
          setSelectionPopup={setSelectionPopup}
          getCompletedInterviews={getCompletedInterviews}
          getScheduledInterviews={getScheduledInterviews}
          getStatistics={getStatistics}
          setSelectedInterviews={setSelectedInterviews}
          updateInterviewStatusInBulk={updateInterviewStatusInBulk}
        />
      ) : null}
      <div className="interview-content">
        <div className="interview-banner">
          <div className="total-interview">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="24" fill="#00C49A" />
              <path
                d="M32.6682 15.7464L30.2536 13.3318C29.8325 12.9084 29.3315 12.5726 28.7797 12.344C28.228 12.1154 27.6363 11.9985 27.0391 12H18.5455C17.3404 12.0015 16.1851 12.4808 15.3329 13.3329C14.4808 14.1851 14.0014 15.3404 14 16.5455V32.9091C14.0014 34.1142 14.4808 35.2695 15.3329 36.1216C16.1851 36.9737 17.3404 37.4531 18.5455 37.4545H29.4545C30.6596 37.4531 31.8149 36.9737 32.6671 36.1216C33.5192 35.2695 33.9985 34.1142 34 32.9091V18.9609C34.0015 18.3637 33.8846 17.772 33.656 17.2203C33.4274 16.6685 33.0916 16.1675 32.6682 15.7464ZM31.3827 17.0318C31.5112 17.161 31.6266 17.3026 31.7273 17.4546H29.4545C29.2134 17.4546 28.9822 17.3588 28.8117 17.1883C28.6412 17.0178 28.5454 16.7866 28.5454 16.5455V14.2727C28.6974 14.3737 28.839 14.4894 28.9682 14.6182L31.3827 17.0318ZM29.4545 35.6364H18.5455C17.8221 35.6364 17.1284 35.349 16.617 34.8376C16.1055 34.3261 15.8182 33.6324 15.8182 32.9091V16.5455C15.8182 15.8221 16.1055 15.1285 16.617 14.617C17.1284 14.1055 17.8221 13.8182 18.5455 13.8182H26.7273V16.5455C26.7273 17.2688 27.0146 17.9625 27.5261 18.4739C28.0375 18.9854 28.7312 19.2727 29.4545 19.2727H32.1818V32.9091C32.1818 33.6324 31.8945 34.3261 31.383 34.8376C30.8715 35.349 30.1779 35.6364 29.4545 35.6364Z"
                fill="white"
              />
              <path
                d="M19.4482 20.1815H23.0845C23.3256 20.1815 23.5568 20.0857 23.7273 19.9152C23.8978 19.7447 23.9936 19.5135 23.9936 19.2724C23.9936 19.0313 23.8978 18.8 23.7273 18.6295C23.5568 18.4591 23.3256 18.3633 23.0845 18.3633H19.4482C19.207 18.3633 18.9758 18.4591 18.8053 18.6295C18.6348 18.8 18.5391 19.0313 18.5391 19.2724C18.5391 19.5135 18.6348 19.7447 18.8053 19.9152C18.9758 20.0857 19.207 20.1815 19.4482 20.1815Z"
                fill="white"
              />
              <path
                d="M28.5391 22H19.4482C19.207 22 18.9758 22.0958 18.8053 22.2663C18.6348 22.4368 18.5391 22.668 18.5391 22.9091C18.5391 23.1502 18.6348 23.3814 18.8053 23.5519C18.9758 23.7224 19.207 23.8182 19.4482 23.8182H28.5391C28.7802 23.8182 29.0114 23.7224 29.1819 23.5519C29.3524 23.3814 29.4481 23.1502 29.4481 22.9091C29.4481 22.668 29.3524 22.4368 29.1819 22.2663C29.0114 22.0958 28.7802 22 28.5391 22Z"
                fill="white"
              />
              <path
                d="M28.5391 25.6367H19.4482C19.207 25.6367 18.9758 25.7325 18.8053 25.903C18.6348 26.0735 18.5391 26.3047 18.5391 26.5458C18.5391 26.7869 18.6348 27.0181 18.8053 27.1886C18.9758 27.3591 19.207 27.4549 19.4482 27.4549H28.5391C28.7802 27.4549 29.0114 27.3591 29.1819 27.1886C29.3524 27.0181 29.4481 26.7869 29.4481 26.5458C29.4481 26.3047 29.3524 26.0735 29.1819 25.903C29.0114 25.7325 28.7802 25.6367 28.5391 25.6367Z"
                fill="white"
              />
              <path
                d="M26.7209 29.2734H19.4482C19.207 29.2734 18.9758 29.3692 18.8053 29.5397C18.6348 29.7102 18.5391 29.9414 18.5391 30.1825C18.5391 30.4236 18.6348 30.6549 18.8053 30.8254C18.9758 30.9958 19.207 31.0916 19.4482 31.0916H26.7209C26.962 31.0916 27.1932 30.9958 27.3637 30.8254C27.5342 30.6549 27.63 30.4236 27.63 30.1825C27.63 29.9414 27.5342 29.7102 27.3637 29.5397C27.1932 29.3692 26.962 29.2734 26.7209 29.2734Z"
                fill="white"
              />
            </svg>
            <div className="detail">
              <span>Total Assesments</span>
              {statisticsLoading ? (
                <div class="loader"></div>
              ) : (
                <p>{statistics?.totalAssesment}</p>
              )}
            </div>
          </div>
          <div className="total-interview">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="24" fill="#00C49A" />
              <path
                d="M32.6682 15.7464L30.2536 13.3318C29.8325 12.9084 29.3315 12.5726 28.7797 12.344C28.228 12.1154 27.6363 11.9985 27.0391 12H18.5455C17.3404 12.0015 16.1851 12.4808 15.3329 13.3329C14.4808 14.1851 14.0014 15.3404 14 16.5455V32.9091C14.0014 34.1142 14.4808 35.2695 15.3329 36.1216C16.1851 36.9737 17.3404 37.4531 18.5455 37.4545H29.4545C30.6596 37.4531 31.8149 36.9737 32.6671 36.1216C33.5192 35.2695 33.9985 34.1142 34 32.9091V18.9609C34.0015 18.3637 33.8846 17.772 33.656 17.2203C33.4274 16.6685 33.0916 16.1675 32.6682 15.7464ZM31.3827 17.0318C31.5112 17.161 31.6266 17.3026 31.7273 17.4546H29.4545C29.2134 17.4546 28.9822 17.3588 28.8117 17.1883C28.6412 17.0178 28.5454 16.7866 28.5454 16.5455V14.2727C28.6974 14.3737 28.839 14.4894 28.9682 14.6182L31.3827 17.0318ZM29.4545 35.6364H18.5455C17.8221 35.6364 17.1284 35.349 16.617 34.8376C16.1055 34.3261 15.8182 33.6324 15.8182 32.9091V16.5455C15.8182 15.8221 16.1055 15.1285 16.617 14.617C17.1284 14.1055 17.8221 13.8182 18.5455 13.8182H26.7273V16.5455C26.7273 17.2688 27.0146 17.9625 27.5261 18.4739C28.0375 18.9854 28.7312 19.2727 29.4545 19.2727H32.1818V32.9091C32.1818 33.6324 31.8945 34.3261 31.383 34.8376C30.8715 35.349 30.1779 35.6364 29.4545 35.6364Z"
                fill="white"
              />
              <path
                d="M19.4482 20.1815H23.0845C23.3256 20.1815 23.5568 20.0857 23.7273 19.9152C23.8978 19.7447 23.9936 19.5135 23.9936 19.2724C23.9936 19.0313 23.8978 18.8 23.7273 18.6295C23.5568 18.4591 23.3256 18.3633 23.0845 18.3633H19.4482C19.207 18.3633 18.9758 18.4591 18.8053 18.6295C18.6348 18.8 18.5391 19.0313 18.5391 19.2724C18.5391 19.5135 18.6348 19.7447 18.8053 19.9152C18.9758 20.0857 19.207 20.1815 19.4482 20.1815Z"
                fill="white"
              />
              <path
                d="M28.5391 22H19.4482C19.207 22 18.9758 22.0958 18.8053 22.2663C18.6348 22.4368 18.5391 22.668 18.5391 22.9091C18.5391 23.1502 18.6348 23.3814 18.8053 23.5519C18.9758 23.7224 19.207 23.8182 19.4482 23.8182H28.5391C28.7802 23.8182 29.0114 23.7224 29.1819 23.5519C29.3524 23.3814 29.4481 23.1502 29.4481 22.9091C29.4481 22.668 29.3524 22.4368 29.1819 22.2663C29.0114 22.0958 28.7802 22 28.5391 22Z"
                fill="white"
              />
              <path
                d="M28.5391 25.6367H19.4482C19.207 25.6367 18.9758 25.7325 18.8053 25.903C18.6348 26.0735 18.5391 26.3047 18.5391 26.5458C18.5391 26.7869 18.6348 27.0181 18.8053 27.1886C18.9758 27.3591 19.207 27.4549 19.4482 27.4549H28.5391C28.7802 27.4549 29.0114 27.3591 29.1819 27.1886C29.3524 27.0181 29.4481 26.7869 29.4481 26.5458C29.4481 26.3047 29.3524 26.0735 29.1819 25.903C29.0114 25.7325 28.7802 25.6367 28.5391 25.6367Z"
                fill="white"
              />
              <path
                d="M26.7209 29.2734H19.4482C19.207 29.2734 18.9758 29.3692 18.8053 29.5397C18.6348 29.7102 18.5391 29.9414 18.5391 30.1825C18.5391 30.4236 18.6348 30.6549 18.8053 30.8254C18.9758 30.9958 19.207 31.0916 19.4482 31.0916H26.7209C26.962 31.0916 27.1932 30.9958 27.3637 30.8254C27.5342 30.6549 27.63 30.4236 27.63 30.1825C27.63 29.9414 27.5342 29.7102 27.3637 29.5397C27.1932 29.3692 26.962 29.2734 26.7209 29.2734Z"
                fill="white"
              />
            </svg>
            <div className="detail">
              <span>Total Scheduled</span>
              {statisticsLoading ? (
                <div class="loader"></div>
              ) : (
                <p>{statistics?.interviewScheduled}</p>
              )}
            </div>
          </div>
          <div className="candidates-invited">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="24" fill="#00C49A" />
              <path
                d="M33 17L22 28"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M33 17L26 37L22 28L13 24L33 17Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <div className="detail">
              <span>Candidates Interviewed</span>
              {statisticsLoading ? (
                <div class="loader"></div>
              ) : (
                <p>{statistics?.candidateInterviewed}</p>
              )}
            </div>
          </div>
          <div className="candidates-appeared">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="48" height="48" rx="24" fill="#00C49A" />
              <path
                d="M32 33V31C32 29.9391 31.5786 28.9217 30.8284 28.1716C30.0783 27.4214 29.0609 27 28 27H20C18.9391 27 17.9217 27.4214 17.1716 28.1716C16.4214 28.9217 16 29.9391 16 31V33"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M24 23C26.2091 23 28 21.2091 28 19C28 16.7909 26.2091 15 24 15C21.7909 15 20 16.7909 20 19C20 21.2091 21.7909 23 24 23Z"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <div className="detail">
              <span>Candidates Selected</span>
              {statisticsLoading ? (
                <div class="loader"></div>
              ) : (
                <p>{statistics?.candidateSelected}</p>
              )}
            </div>
          </div>
        </div>
        <div className="interview-heading">
          <div className="left-heading">
            <span>Interviews ({scheduledDocs})</span>
            <div>
              <div className="candidate-input">
                <svg
                  style={{ cursor: "pointer" }}
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
                      searchInterviews("scheduled");
                    }
                  }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPersistScheduledSearch(e.target.value);
                    searchInterviewsOnChange(e, "scheduled");
                  }}
                  value={search}
                  placeholder="Search candidates"
                />
                {search !== "" ? (
                  <svg
                    onClick={() => {
                      setSearch("");
                      setSearchData([]);
                    }}
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
              {search !== "" ? (
                <div className="search-container">
                  {searchData.length === 0 &&
                  scheduledSearchLoading === false ? (
                    <p className="no-data">No data found.</p>
                  ) : null}
                  {scheduledSearchLoading ? (
                    <p className="no-data">Loading...</p>
                  ) : (
                    searchData.map((data, index) => {
                      return (
                        <span
                          key={index}
                          onClick={() => {
                            setInterviews([data]);
                            setSearch("");
                          }}
                        >
                          {data.candidateId.candidateName}
                        </span>
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="right-heading">
            <div className="test">
              <select
                onChange={(e) => {
                  setFilterValue(e.target.value);
                }}
              >
                {testLoading ? (
                  <option value="All">Loading...</option>
                ) : (
                  <option value="All">All</option>
                )}
                {tests.map((data, index) => {
                  return (
                    <option value={data._id} key={index}>
                      {data.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="assesment">
              <select
                onChange={(e) => {
                  setScheduledDateFilterValue(e.target.value);
                  setScheduledInterviewCurrentPage(1);
                }}
              >
                <option value="This Week">This Week</option>
                <option value="Today">Today</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="interveiw-table-1">
          <div className="table1-heading">
            <div className="table-title">
              <span>Scheduled Interviews For You ({scheduledDocs})</span>
            </div>
            <div className="right-side">
              {selectedInterviews.length > 0 ? (
                <div className="table-buttons">
                  <button
                    className="interviewd"
                    style={
                      selectedInterviews.length > 0
                        ? { background: "#00C49A" }
                        : null
                    }
                    onClick={() => {
                      handleInterviewedBtn();
                    }}
                  >
                    {selectedInterviews.length > 0 ? (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10.5" cy="10.665" r="10" fill="white" />
                        <path
                          d="M15.2158 8.04024L8.74823 14.4055L5.85491 11.4657"
                          stroke="#00C49A"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 21 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="10.5" cy="10.665" r="10" fill="white" />
                        <path
                          d="M15.3877 9.07442L8.9201 15.4397L6.02678 12.4999"
                          stroke="#979797"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                    Interviewed
                  </button>
                  <button
                    className="not-done"
                    style={
                      selectedInterviews.length > 0
                        ? { background: "#FF6812" }
                        : null
                    }
                    onClick={() => {
                      handleNotDoneBtn();
                    }}
                  >
                    {selectedInterviews.length > 0 ? (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="7" cy="7" r="7" fill="white" />
                        <path
                          d="M9.72569 4.27734L4.28125 9.72179"
                          stroke="#F23E3E"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.28125 4.27734L9.72569 9.72179"
                          stroke="#F23E3E"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="21"
                        height="21"
                        viewBox="0 0 14 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="7" cy="7" r="7" fill="white" />
                        <path
                          d="M9.72569 4.27734L4.28125 9.72179"
                          stroke="#979797"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M4.28125 4.27734L9.72569 9.72179"
                          stroke="#979797"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                    Not Done
                  </button>{" "}
                </div>
              ) : null}
              <div className="pagination">
                <button
                  onClick={() => {
                    if (scheduledInterviewCurrentPage > 1) {
                      if (scheduledLoading === false) {
                        setSelectedAll(false);
                        setSelectedInterviews([]);
                        setScheduledInterviewCurrentPage(
                          scheduledInterviewCurrentPage - 1
                        );
                      }
                    }
                  }}
                >
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.41421 6L6.70711 10.2929C7.09763 10.6834 7.09763 11.3166 6.70711 11.7071C6.31658 12.0976 5.68342 12.0976 5.29289 11.7071L0.292893 6.70711C-0.0976311 6.31658 -0.0976311 5.68342 0.292893 5.29289L5.29289 0.292893C5.68342 -0.0976311 6.31658 -0.0976311 6.70711 0.292893C7.09763 0.683418 7.09763 1.31658 6.70711 1.70711L2.41421 6Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <span>
                  {scheduledInterviewTotalPages === 0
                    ? 0
                    : scheduledInterviewCurrentPage}
                  /{scheduledInterviewTotalPages}
                </span>
                <button
                  onClick={() => {
                    setScheduledInterviewCurrentPage(
                      scheduledInterviewCurrentPage ===
                        scheduledInterviewTotalPages ||
                        scheduledInterviewTotalPages === 0
                        ? scheduledInterviewCurrentPage
                        : scheduledLoading === false
                        ? scheduledInterviewCurrentPage + 1
                        : scheduledInterviewCurrentPage
                    );
                    setSelectedAll(false);
                    setSelectedInterviews([]);
                  }}
                >
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893C0.683418 -0.0976305 1.31658 -0.0976305 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="interview-table1-content">
            {scheduledLoading ? (
              <table cellSpacing={0}>
                <tr>
                  <th>
                    {selectedAll ? (
                      <svg
                        onClick={() => {
                          setSelectedAll(false);
                          setSelectedInterviews([]);
                        }}
                        width="15"
                        height="15"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          y="0.862305"
                          width="20"
                          height="20"
                          rx="2"
                          fill="#00C49A"
                        />
                        <path
                          d="M14 8.8623L8.5 14.3623L6 11.8623"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          handleCheckBox(null, interviews.length);
                        }}
                      >
                        <rect
                          x="0.5"
                          y="0.5"
                          width="14"
                          height="14"
                          stroke="#DDDDDD"
                        />
                      </svg>
                    )}
                  </th>
                  <th>Candidate</th>
                  <th>Candidate Contact</th>
                  <th>Date & Time</th>
                  <th>Test Name</th>
                  <th>Interview Status</th>
                  <th>Selection</th>
                </tr>
                {loadingArray.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                    </tr>
                  );
                })}
              </table>
            ) : (
              <table cellSpacing={0}>
                <tr>
                  <th>
                    {selectedAll ? (
                      <svg
                        onClick={() => {
                          setSelectedAll(false);
                          setSelectedInterviews([]);
                        }}
                        width="15"
                        height="15"
                        viewBox="0 0 20 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          y="0.862305"
                          width="20"
                          height="20"
                          rx="2"
                          fill="#00C49A"
                        />
                        <path
                          d="M14 8.8623L8.5 14.3623L6 11.8623"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 15 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        onClick={() => {
                          handleCheckBox(null, interviews.length);
                        }}
                      >
                        <rect
                          x="0.5"
                          y="0.5"
                          width="14"
                          height="14"
                          stroke="#DDDDDD"
                        />
                      </svg>
                    )}
                    #
                  </th>

                  <th>Candidate</th>
                  <th>Candidate Contact</th>
                  <th>Date & Time</th>
                  <th>Test Name</th>
                  <th>Interview Status</th>
                </tr>

                {interviews.length === 0
                  ? null
                  : interviews.map((data, index) => {
                      const date = formatDate(data.date);

                      return (
                        <tr>
                          <td>
                            {selectedInterviews.some(
                              (e) => e._id === data._id
                            ) ? (
                              <svg
                                onClick={() => {
                                  const removedArray =
                                    selectedInterviews.filter(
                                      (interveiw) => interveiw._id !== data._id
                                    );
                                  setSelectedInterviews(removedArray);
                                  setSelectedAll(false);
                                }}
                                width="15"
                                height="15"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  y="0.862305"
                                  width="20"
                                  height="20"
                                  rx="2"
                                  fill="#00C49A"
                                />
                                <path
                                  d="M14 8.8623L8.5 14.3623L6 11.8623"
                                  stroke="white"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                onClick={() => {
                                  setSelectedInterviews([
                                    ...selectedInterviews,
                                    data,
                                  ]);
                                }}
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <rect
                                  x="0.5"
                                  y="0.5"
                                  width="14"
                                  height="14"
                                  stroke="#DDDDDD"
                                />
                              </svg>
                            )}
                            {index + 1}
                          </td>

                          <td>{data.candidateId.candidateName}</td>
                          <td
                            style={{
                              textTransform: "lowercase",
                            }}
                          >
                            {data.candidateId.candidateEmail} |{" "}
                            {data.candidateId.candidateMobile}
                          </td>
                          <td>{data.date === "" ? "NA" : date.fullDate} </td>
                          <td>{data.testId.name}</td>
                          <td>
                            {loading && loaderIndex === index ? (
                              <div class="like-loader" />
                            ) : data.interviewStatus === "interviewed" ? (
                              <svg
                                width="28"
                                height="29"
                                viewBox="0 0 28 29"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <path
                                  d="M16.334 11V6.33333C16.334 5.40508 15.9652 4.51484 15.3089 3.85846C14.6525 3.20208 13.7622 2.83333 12.834 2.83333L8.16732 13.3333V26.1667H21.3273C21.89 26.173 22.4361 25.9758 22.8649 25.6113C23.2937 25.2469 23.5763 24.7397 23.6607 24.1833L25.2707 13.6833C25.3214 13.3489 25.2989 13.0075 25.2045 12.6826C25.1102 12.3578 24.9464 12.0573 24.7245 11.8021C24.5025 11.5469 24.2277 11.3429 23.9192 11.2044C23.6106 11.0659 23.2755 10.9962 22.9373 11H16.334ZM8.16732 26.1667H4.66732C4.04848 26.1667 3.45499 25.9208 3.0174 25.4832C2.57982 25.0457 2.33398 24.4522 2.33398 23.8333V15.6667C2.33398 15.0478 2.57982 14.4543 3.0174 14.0168C3.45499 13.5792 4.04848 13.3333 4.66732 13.3333H8.16732"
                                  fill="#00C49A"
                                />
                                <path
                                  d="M8.16732 26.1667H4.66732C4.04848 26.1667 3.45499 25.9208 3.0174 25.4832C2.57982 25.0457 2.33398 24.4522 2.33398 23.8333V15.6667C2.33398 15.0478 2.57982 14.4543 3.0174 14.0168C3.45499 13.5792 4.04848 13.3333 4.66732 13.3333H8.16732M16.334 11V6.33333C16.334 5.40508 15.9652 4.51484 15.3089 3.85846C14.6525 3.20208 13.7622 2.83333 12.834 2.83333L8.16732 13.3333V26.1667H21.3273C21.89 26.173 22.4361 25.9758 22.8649 25.6113C23.2937 25.2469 23.5763 24.7397 23.6607 24.1833L25.2707 13.6833C25.3214 13.3489 25.2989 13.0075 25.2045 12.6826C25.1102 12.3578 24.9464 12.0573 24.7245 11.8021C24.5025 11.5469 24.2277 11.3429 23.9192 11.2044C23.6106 11.0659 23.2755 10.9962 22.9373 11H16.334Z"
                                  stroke="white"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="22"
                                height="23"
                                viewBox="0 0 22 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setLoaderIndex(index);
                                  setSelectedInterviews([data]);
                                  setSelectionPopup(true);
                                }}
                              >
                                <path
                                  d="M6 21.5H3C2.46957 21.5 1.96086 21.2893 1.58579 20.9142C1.21071 20.5391 1 20.0304 1 19.5V12.5C1 11.9696 1.21071 11.4609 1.58579 11.0858C1.96086 10.7107 2.46957 10.5 3 10.5H6M13 8.5V4.5C13 3.70435 12.6839 2.94129 12.1213 2.37868C11.5587 1.81607 10.7956 1.5 10 1.5L6 10.5V21.5H17.28C17.7623 21.5055 18.2304 21.3364 18.5979 21.024C18.9654 20.7116 19.2077 20.2769 19.28 19.8L20.66 10.8C20.7035 10.5134 20.6842 10.2207 20.6033 9.94225C20.5225 9.66382 20.3821 9.40629 20.1919 9.18751C20.0016 8.96873 19.7661 8.79393 19.5016 8.67522C19.2371 8.5565 18.9499 8.49672 18.66 8.5H13Z"
                                  stroke="#979797"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            )}

                            {data.interviewStatus === "Not Done" ? (
                              <svg
                                width="26"
                                height="27"
                                viewBox="0 0 26 27"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setSelectedInterviews([data]);
                                  setClosePopup(true);
                                }}
                              >
                                <path
                                  d="M10.6662 17.0001V21.6668C10.6662 22.595 11.035 23.4853 11.6913 24.1416C12.3477 24.798 13.238 25.1668 14.1662 25.1668L18.8329 14.6668V1.83343H5.67288C5.11016 1.82707 4.56411 2.02429 4.13532 2.38876C3.70654 2.75322 3.42392 3.26037 3.33955 3.81676L1.72955 14.3168C1.67879 14.6512 1.70134 14.9926 1.79565 15.3175C1.88996 15.6423 2.05376 15.9428 2.27571 16.198C2.49766 16.4532 2.77245 16.6572 3.08105 16.7957C3.38964 16.9342 3.72465 17.0039 4.06288 17.0001H10.6662ZM18.8329 1.83343H21.9479C22.6082 1.82175 23.2498 2.05292 23.7509 2.48305C24.252 2.91318 24.5777 3.51233 24.6662 4.16676V12.3334C24.5777 12.9879 24.252 13.587 23.7509 14.0171C23.2498 14.4473 22.6082 14.6784 21.9479 14.6668H18.8329"
                                  fill="#FF6812"
                                />
                                <path
                                  d="M18.8329 14.6668L14.1662 25.1668C13.238 25.1668 12.3477 24.798 11.6913 24.1416C11.035 23.4853 10.6662 22.595 10.6662 21.6668V17.0001H4.06288C3.72465 17.0039 3.38964 16.9342 3.08105 16.7957C2.77245 16.6572 2.49766 16.4532 2.27571 16.198C2.05376 15.9428 1.88996 15.6423 1.79565 15.3175C1.70134 14.9926 1.67879 14.6512 1.72955 14.3168L3.33955 3.81676C3.42392 3.26037 3.70654 2.75322 4.13532 2.38876C4.56411 2.02429 5.11016 1.82707 5.67288 1.83343H18.8329M18.8329 14.6668V1.83343M18.8329 14.6668H21.9479C22.6082 14.6784 23.2498 14.4473 23.7509 14.0171C24.252 13.587 24.5777 12.9879 24.6662 12.3334V4.16676C24.5777 3.51233 24.252 2.91318 23.7509 2.48305C23.2498 2.05292 22.6082 1.82175 21.9479 1.83343H18.8329"
                                  stroke="white"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="22"
                                height="23"
                                viewBox="0 0 22 23"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                onClick={() => {
                                  setSelectedInterviews([data]);
                                  setClosePopup(true);
                                }}
                                style={{
                                  cursor: "pointer",
                                }}
                              >
                                <path
                                  d="M16.003 1.50036H18.673C19.2389 1.49035 19.7889 1.6885 20.2184 2.05718C20.6479 2.42586 20.9271 2.93942 21.003 3.50036V10.5004C20.9271 11.0613 20.6479 11.5749 20.2184 11.9435C19.7889 12.3122 19.2389 12.5104 18.673 12.5004H16.003M9.00296 14.5004V18.5004C9.00296 19.296 9.31903 20.0591 9.88164 20.6217C10.4442 21.1843 11.2073 21.5004 12.003 21.5004L16.003 12.5004V1.50036H4.72296C4.24063 1.49491 3.77258 1.66396 3.40505 1.97636C3.03753 2.28875 2.79528 2.72346 2.72296 3.20036L1.34296 12.2004C1.29945 12.487 1.31879 12.7797 1.39962 13.0581C1.48046 13.3365 1.62086 13.5941 1.8111 13.8128C2.00135 14.0316 2.23688 14.2064 2.50139 14.3251C2.7659 14.4439 3.05305 14.5036 3.34296 14.5004H9.00296Z"
                                  stroke="#979797"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            )}
                          </td>
                        </tr>
                      );
                    })}
              </table>
            )}
            {interviews.length === 0 && scheduledLoading === false ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <span
                  className="no-interviews"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    background: "#DDDDDD",
                    width: "40%",
                    height: "35px",
                    borderRadius: "5px",
                  }}
                >
                  No data found.
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="interview-heading">
          <div className="left-heading">
            <span>Completed Interviews ({completedDocs})</span>
            <div>
              <div className="candidate-input">
                <svg
                  style={{ cursor: "pointer" }}
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
                      searchCompletedInterviews("completed");
                    }
                  }}
                  onChange={(e) => {
                    setCompletedInterviewSearch(e.target.value);
                    setPersistCompletedSearch(e.target.value);
                    searchCompletedInterviewsOnChange(e, "completed");
                  }}
                  value={completedInterviewSearch}
                  placeholder="Search candidates"
                />
                {completedInterviewSearch !== "" ? (
                  <svg
                    onClick={() => {
                      setCompletedInterviewSearch("");
                      setCompletedSearchData([]);
                    }}
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
              {completedInterviewSearch !== "" ? (
                <div className="search-container">
                  {completedSearchData.length === 0 &&
                  completedSearchLoading === false ? (
                    <p className="no-data">No data found.</p>
                  ) : null}
                  {completedSearchLoading ? (
                    <p className="no-data">Loading...</p>
                  ) : (
                    completedSearchData.map((data, index) => {
                      return (
                        <span
                          key={index}
                          onClick={() => {
                            setCompletedInterviewSearch("");
                            setCompletedInterviews([data]);
                          }}
                        >
                          {data.candidateId.candidateName}
                        </span>
                      );
                    })
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <div className="right-heading">
            <div className="test">
              <select
                onChange={(e) => {
                  setCompletedFilterValue(e.target.value);
                }}
              >
                <option value="All">All</option>
                {tests.map((data, index) => {
                  return (
                    <option value={data._id} key={index}>
                      {data.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="assesment">
              <select
                onChange={(e) => {
                  setCompletedDateFilterValue(e.target.value);
                  setCompletedInterviewCurrentPage(1);
                }}
              >
                <option value="This Week">This Week</option>
                <option value="Today">Today</option>
                <option value="This Month">This Month</option>
                <option value="This Year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="interveiw-table-1">
          <div className="table1-heading">
            <div className="table-title">
              <span>Completed Interviews ({completedDocs})</span>
            </div>
            <div className="right-side">
              <div className="pagination">
                <button
                  onClick={() => {
                    if (completedInterviewCurrentPage > 1) {
                      if (completedInterviewCurrentPage > 1) {
                        if (completedLoading === false) {
                          setCompletedInterviewCurrentPage(
                            completedInterviewCurrentPage - 1
                          );
                        }
                      }
                    }
                  }}
                >
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2.41421 6L6.70711 10.2929C7.09763 10.6834 7.09763 11.3166 6.70711 11.7071C6.31658 12.0976 5.68342 12.0976 5.29289 11.7071L0.292893 6.70711C-0.0976311 6.31658 -0.0976311 5.68342 0.292893 5.29289L5.29289 0.292893C5.68342 -0.0976311 6.31658 -0.0976311 6.70711 0.292893C7.09763 0.683418 7.09763 1.31658 6.70711 1.70711L2.41421 6Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <span>
                  {completedInterviewTotalPages === 0
                    ? 0
                    : completedInterviewCurrentPage}
                  /{completedInterviewTotalPages}
                </span>
                <button
                  onClick={() => {
                    setCompletedInterviewCurrentPage(
                      completedInterviewCurrentPage ===
                        completedInterviewTotalPages ||
                        completedInterviewTotalPages === 0
                        ? completedInterviewCurrentPage
                        : completedLoading === false
                        ? completedInterviewCurrentPage + 1
                        : completedInterviewCurrentPage
                    );
                  }}
                >
                  <svg
                    width="7"
                    height="12"
                    viewBox="0 0 7 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893C0.683418 -0.0976305 1.31658 -0.0976305 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6Z"
                      fill="white"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="interview-table1-content">
            {completedLoading ? (
              <table cellSpacing={0}>
                <tr>
                  <th>#</th>
                  <th>Candidate</th>
                  <th>Candidate Contact</th>
                  <th>Date & Time</th>
                  <th>Test Name</th>
                  <th>Interview Status</th>
                  <th>Selection</th>
                </tr>
                {loadingArray.map((data, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                      <td>
                        <div className="skeleton" />
                      </td>
                    </tr>
                  );
                })}
              </table>
            ) : (
              <table cellSpacing={0}>
                <tr>
                  <th
                    style={{
                      width: "1%",
                    }}
                  >
                    #
                  </th>
                  <th>Candidate</th>
                  <th>Candidate Contact</th>
                  <th>Date & Time</th>
                  <th>Test Name</th>
                  <th>Interview Status</th>
                  <th>Selection</th>
                </tr>
                {completedInterviews.length === 0
                  ? null
                  : completedInterviews.map((data, index) => {
                      const date = formatDate(data.date);
                      return (
                        <tr>
                          <td
                            style={{
                              width: "1%",
                            }}
                          >
                            {index + 1}
                          </td>
                          <td>{data.candidateId.candidateName}</td>
                          <td
                            style={{
                              textTransform: "lowercase",
                            }}
                          >
                            {data.candidateId.candidateEmail} |{" "}
                            {data.candidateId.candidateMobile}
                          </td>
                          <td>{data.date === "" ? "NA" : date.fullDate} </td>
                          <td>{data.testId?.name}</td>
                          <td>
                            {data.interviewStatus === "Not Done" ? (
                              <button
                                style={{
                                  background: "#FF6813",
                                  width: "99px",
                                  height: "26px",
                                  borderRadius: "50px",
                                  border: "none",
                                  color: "#FFFFFF",
                                }}
                              >
                                <span>{data.interviewStatus}</span>
                              </button>
                            ) : (
                              <button
                                style={{
                                  background: "#00C499",
                                  width: "99px",
                                  height: "26px",
                                  borderRadius: "50px",
                                  border: "none",
                                  color: "#FFFFFF",
                                  textTransform: "capitalize",
                                }}
                              >
                                <span>{data.interviewStatus}</span>
                              </button>
                            )}
                          </td>
                          <td>
                            <div className="buttons-container">
                              {data.selectionStatus === "" ? (
                                <>
                                  {selectionStatus.isLoading &&
                                  selectionStatus.loaderIndex === index &&
                                  selectionStatus.button === "yes" ? (
                                    <div className="yes-button-loader" />
                                  ) : (
                                    <button
                                      className="yes"
                                      onClick={() => {
                                        handleClick(
                                          data,
                                          "selected",
                                          index,
                                          "yes"
                                        );
                                      }}
                                      style={{
                                        background:
                                          data.selectionStatus === "selected"
                                            ? "#384455"
                                            : "#979797",
                                      }}
                                    >
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <circle
                                          cx="7"
                                          cy="7"
                                          r="7"
                                          fill="white"
                                        />
                                        <g clipPath="url(#clip0_5381_2984)">
                                          <path
                                            d="M9.59339 5.05556L6.02857 8.62037L4.4082 7"
                                            stroke="#384455"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </g>
                                        <defs>
                                          <clipPath id="clip0_5381_2984">
                                            <rect
                                              width="7.77778"
                                              height="7.77778"
                                              fill="white"
                                              transform="translate(3.11133 3.11111)"
                                            />
                                          </clipPath>
                                        </defs>
                                      </svg>
                                      <span>Yes</span>
                                    </button>
                                  )}
                                  {selectionStatus.isLoading &&
                                  selectionStatus.loaderIndex === index &&
                                  selectionStatus.button === "no" ? (
                                    <div className="no-button-loader" />
                                  ) : (
                                    <button
                                      className="no"
                                      onClick={() => {
                                        handleClick(
                                          data,
                                          "Not Selected",
                                          index,
                                          "no"
                                        );
                                      }}
                                      style={{
                                        background:
                                          data.selectionStatus ===
                                          "Not Selected"
                                            ? "#F23E3E"
                                            : "#979797",
                                      }}
                                    >
                                      <svg
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <circle
                                          cx="7"
                                          cy="7"
                                          r="7"
                                          fill="white"
                                        />
                                        <path
                                          d="M9.72569 4.27734L4.28125 9.72179"
                                          stroke={
                                            data.selectionStatus ===
                                            "Not Selected"
                                              ? "#F23E3E"
                                              : "#979797"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M4.28125 4.27734L9.72569 9.72179"
                                          stroke={
                                            data.selectionStatus ===
                                            "Not Selected"
                                              ? "#F23E3E"
                                              : "#979797"
                                          }
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                      <span>No</span>
                                    </button>
                                  )}
                                </>
                              ) : data.selectionStatus === "selected" ||
                                data.selectionStatus === "Selected" ? (
                                <button
                                  className="yes"
                                  style={
                                    data.selectionStatus === "selected" ||
                                    data.selectionStatus === "Selected"
                                      ? {
                                          background: "#384455",
                                          width: "99px",
                                          height: "26px",
                                        }
                                      : {
                                          background: "#979797",
                                          width: "99px",
                                          height: "26px",
                                        }
                                  }
                                >
                                  <span>{data.selectionStatus}</span>
                                </button>
                              ) : (
                                <button
                                  className="no"
                                  style={
                                    data.selectionStatus === "Not Selected"
                                      ? {
                                          background: "#F23E3E",
                                          width: "99px",
                                          height: "26px",
                                        }
                                      : {
                                          background: "#979797",
                                          width: "99px",
                                          height: "26px",
                                        }
                                  }
                                >
                                  <span>{data.selectionStatus}</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
              </table>
            )}
            {completedInterviews.length === 0 && completedLoading === false ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <span
                  className="no-interviews"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    background: "#DDDDDD",
                    width: "40%",
                    height: "35px",
                    borderRadius: "5px",
                  }}
                >
                  No data found.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Interview;
