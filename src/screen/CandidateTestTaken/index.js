import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import AssessmentPreviewSideBar from "../../component/AssessmentOverviewSidebar";
import TestTakenCard from "./TestTakenCard";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Shortlisted from "../../component/ShortlistedPopup";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import TestSummaryContext from "../../store/TestSummaryContext";
import CandidateCardSkeleton from "../../component/CandidateSekeleton";
import UpdateCutOffScore from "../../component/UpdateCutOffScore";
import CandidateStatusFilter from "../../component/CandidateStatusFilter";
import * as XLSX from "xlsx";
import moment from "moment/moment";
const CandidateTestTaken = () => {
  let navigate = useNavigate();
  const context = useContext(TestSummaryContext);
  const [shortlist, setShortlist] = useState(false);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setloading] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [movedType, setMovedType] = useState("");
  const [test, setTest] = useState(context.test);
  const [isUpdateScore, setisUpdateScore] = useState(false);
  const [isCandidateStatus, setisCandidateStatus] = useState(false);
  const [candidateFilter, setcandidateFilter] = useState("All");
  const [showDropDown, setshowDropDown] = useState("none");
  const [currentPage, setCurrentPage] = useState(1);
  let limit = 50;

  const [refresh, setrefresh] = useState({});

  useEffect(() => {}, [refresh]);

  const { id } = useParams();
  useEffect(() => {
    if (id) {
      context.handleTestId(id);
      context.getCandidates(id, currentPage, limit, "appeared");
    }
  }, [currentPage]);

  const searchInvitesOnChange = async (e) => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      const response = await axios.post(
        `${backend_url}invites/search/candidate/intest/${decoded.user_id}?page=1&limit=10`,
        {
          searchText: e.target.value,
          testId: context.testId,
          testType: context.testDetails.testType,
          candidateStatus:
            candidateFilter === "All" ? undefined : candidateFilter,
        },
        { headers: { token: token } }
      );
      if (e.target.value !== "") {
        const testTaken = response.data.data.filter((data) =>
          data.invite.status.some(
            (candidateStatus) => candidateStatus.currentStatus === "appeared"
          )
        );
        setSearchData(testTaken);
      } else {
        setSearchData([]);
        // context.getCandidates()
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const getTestById = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(`${backend_url}test/find/${id}`, {
        headers: { token: token },
      });
      return response.data.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckBox = (length) => {
    if (length !== undefined) {
      setSelectedAll(true);
      setSelectedCandidates(context.testTakenCandidates);
    }
  };

  const updateCandidateStatusInBulk = async (id, value) => {
    try {
      setMovedType(value);
      setloading(true);
      let candidates;
      if (value !== "multi-select") {
        const candidateData = context.testTakenCandidates.filter(
          (data) => data._id === id
        );
        candidates = candidateData.map((data) => {
          if (value === "move to review") {
            data.status = "reviewed";
          } else {
            data.status = "shortlisted";
          }

          return data;
        });
      } else {
        candidates = selectedCandidates.map((data) => {
          data.status = "shortlisted";
          return data;
        });
      }

      const token = getCookie("Xh7ERL0G");
      const response = await axios.put(
        `${backend_url}invites/update/candidate/status`,
        {
          candidates: candidates,
        },
        { headers: { token: token } }
      );

      if (response.status === 200) {
        setloading(false);
        setShortlist(true);
        context.getCandidates();
        setSelectedCandidates([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Opps, Please try again!");
    }
  };

  const loaderArray = [1, 2, 3, 4];

  const filterCandidate = async (filterValue) => {
    try {
      setloading(true);
      const token = getCookie("Xh7ERL0G");
      const res = await axios.post(
        `${backend_url}invites/filterCandidateStatus/${id}`,
        { candidateStatus: filterValue.toLowerCase(), searchText: search },
        { headers: { token: token } }
      );
      setloading(false);
      context.handleTestTakenCandidates(res.data.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const getPassCandidateCount = () => {
    const totalPassCandidate = context.testPassedCandidates.reduce(
      (candidateCount, candidate) => {
        if (
          candidate.candidateResult.candidate_total_Score >= context.cutOffScore
        ) {
          candidateCount += 1;
        }
        return candidateCount;
      },
      0
    );
    return totalPassCandidate;
  };

  const moveToShortlisted = (e, candidateId) => {
    e.stopPropagation();
    try {
      const candidateData = context.testTakenCandidates.filter(
        (data) => data.invite._id === candidateId
      );
      candidateData[0].invite.status.push({
        currentStatus: "shortlisted",
        statusDate: new Date(),
      });
      const res = axios.put(
        `${backend_url}invites/moveToReviewCandidate/${candidateId}`,
        { status: candidateData[0].invite.status }
      );
      context.testTakenCandidates.forEach((data) => {
        if (data._id === candidateId) {
          data.status = candidateData.status;
        }
      });
      context.shortlistedCandidates.push(candidateData[0]);
      setrefresh({});
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const updateTestCutOffScore = async (value) => {
    try {
      const token = getCookie("Xh7ERL0G");
      await axios.put(
        `${backend_url}invites/updateTestCutOffScore/${id}`,
        {
          cutOff: value,
        },
        { headers: { token: token } }
      );
      context.setcutOffScore(value);
      setisUpdateScore(false);
      toast.success("test cutoff score update successfully!");
    } catch (error) {
      toast.error(error);
    }
  };

  const onClickCandidate = (e, id, rank) => {
    e.stopPropagation();
    navigate("/singlecandidate", { state: { id: id, rank: rank } });
  };

  const exportCandidates = async () => {
    const test = await getTestById();
    const data = [
      [
        "Name",
        "Email",
        "Score",
        "Section Score",
        "Status",
        "Time",
        "Result Link",
      ],
    ];

    const token = getCookie("Xh7ERL0G");
    const response = await axios.get(
      `${backend_url}invites/getInvite/${id}?status=${`appeared`}`,
      { headers: { token: token } }
    );

    console.log(response);

    response.data.data
      .sort(
        (a, b) =>
          b.candidateResult.candidate_total_Score -
          a.candidateResult.candidate_total_Score
      )
      .map((candidate, index) => {
        data.push([
          candidate.invite.candidateName,
          candidate.invite.candidateEmail,
          candidate.candidateResult.candidate_total_Score,
          "MCQ- " +
            candidate.candidateResult.candidate_total_Score +
            " & Programming- " +
            candidate?.candidateResult?.candidate_total_Programming_Score,
          candidate.candidateResult.candidate_total_Score >= context.cutOffScore
            ? "Pass"
            : "Failed",
          parseFloat(
            candidate.candidateResult.candidate_total_time_spent / 60
          ).toFixed(2) + " min",
          `https://www.dev.theeliteqa.com/candidateResult/${candidate.invite._id}`,
        ]);
      });

    //filtering data according to candidate total score high to low

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(fileData);
    anchor.download = `${test?.name}-${moment(test?.startDate).format(
      "DD-MMM-YYYY"
    )}.xlsx`;
    anchor.click();
  };

  return (
    <div className="test-taken">
      <NavigationBar assessment={false} />
      {shortlist && (
        <Shortlisted
          single={true}
          cancelButton={() => {
            setShortlist(false);
          }}
          no={selectedCandidates?.length}
          movedType={movedType}
        />
      )}
      <div className="test-taken-container">
        <div className="test-taken-container-left">
          <AssessmentPreviewSideBar
            testType={test?.status}
            testDetails={test}
            testName={test?.name}
            active={"candidates"}
          />
        </div>
        <div className="test-taken-container-right">
          <div className="test-taken-content">
            <div className="test-taken-header">
              <div
                className="test-active"
                style={{ paddingRight: "55px", cursor: "pointer" }}
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    x="0.226562"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#FF6812"
                  />
                  <path
                    d="M19.5 20.125V18.875C19.5 18.212 19.2366 17.5761 18.7678 17.1072C18.2989 16.6384 17.663 16.375 17 16.375H12C11.337 16.375 10.7011 16.6384 10.2322 17.1072C9.76339 17.5761 9.5 18.212 9.5 18.875V20.125"
                    stroke="#FF6812"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.5 13.875C15.8807 13.875 17 12.7557 17 11.375C17 9.99429 15.8807 8.875 14.5 8.875C13.1193 8.875 12 9.99429 12 11.375C12 12.7557 13.1193 13.875 14.5 13.875Z"
                    stroke="#FF6812"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>
                  Test Taken{" "}
                  {context.loading
                    ? null
                    : `(${context.totalCandidateCount.candidatesAppeared})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>
              <div
                onClick={() => {
                  //candidatepass
                  context.getCandidates(id);
                  navigate(`/candidatepass/${id}`);
                }}
                className="test-not-active"
                style={{ paddingRight: "55px", cursor: "pointer" }}
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#615D5B"
                  />
                  <g clip-path="url(#clip0_7211_4703)">
                    <path
                      d="M18.3359 19.792V18.542C18.3359 17.879 18.0725 17.2431 17.6037 16.7742C17.1349 16.3054 16.499 16.042 15.8359 16.042H11.4609C10.7979 16.042 10.162 16.3054 9.69317 16.7742C9.22433 17.2431 8.96094 17.879 8.96094 18.542V19.792"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.6484 13.542C15.0291 13.542 16.1484 12.4227 16.1484 11.042C16.1484 9.66128 15.0291 8.54199 13.6484 8.54199C12.2677 8.54199 11.1484 9.66128 11.1484 11.042C11.1484 12.4227 12.2677 13.542 13.6484 13.542Z"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.9609 13.542L20.2109 14.792L22.7109 12.292"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7211_4703">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(8.33594 6.66699)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span>
                  Passed{" "}
                  {context.loading
                    ? null
                    : `(${context.totalCandidateCount?.candidatesPassed})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>
              <div
                style={{ paddingRight: "55px", cursor: "pointer" }}
                className="test-not-active"
                onClick={() => {
                  context.getCandidates();
                  navigate(`/candidateshortlisted/${id}`);
                }}
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    x="0.328125"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#615D5B"
                  />
                  <g clip-path="url(#clip0_7211_4712)">
                    <path
                      d="M14.5156 21.5469L12.4062 19.5H9.5V16.5938L7.40625 14.5L9.5 12.4062V9.5H12.4062L14.5156 7.40625L16.5938 9.5H19.5V12.4062L21.5938 14.5L19.5 16.5938V19.5H16.5938L14.5156 21.5469ZM14.5156 20.2344L16.2018 18.5625H18.5625V16.2031L20.2656 14.5L18.5625 12.7969V10.4375H16.2031L14.5156 8.73438L12.7969 10.4375H10.4375V12.7969L8.73438 14.5L10.4375 16.2031V18.5625H12.7812L14.5156 20.2344ZM12.6719 17.1562L14.5 16.0469L16.3281 17.1562L15.8438 15.0781L17.4688 13.6719L15.3281 13.5L14.5 11.5312L13.6719 13.5L11.5312 13.6719L13.1562 15.0781L12.6719 17.1562Z"
                      fill="#827C7C"
                      stroke="#827C7C"
                      stroke-width="0.25"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_7211_4712">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(7 7)"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span>
                  Shortlisted{" "}
                  {context.loading
                    ? null
                    : `(${context.shortlistedCandidates.length})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>
              <div
                style={{ paddingRight: "55px", cursor: "pointer" }}
                className="test-not-active"
                onClick={() => {
                  context.getCandidates(id);
                  navigate(`/candidatereviewed/${id}`);
                }}
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#615D5B"
                  />
                  <g clip-path="url(#clip0_1492_5412)">
                    <path
                      d="M14.8359 20.417C18.2877 20.417 21.0859 17.6188 21.0859 14.167C21.0859 10.7152 18.2877 7.91699 14.8359 7.91699C11.3842 7.91699 8.58594 10.7152 8.58594 14.167C8.58594 17.6188 11.3842 20.417 14.8359 20.417Z"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M14.8359 10.417V14.167L17.3359 15.417"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1492_5412">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(7.33594 6.66699)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span>
                  Reviewed{" "}
                  {context.loading
                    ? null
                    : `(${context.reviewedCandidates.length})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>

              <div
                style={{ paddingRight: "55px", cursor: "pointer" }}
                className="test-not-active"
                onClick={() => {
                  context.getCandidates(id);
                  navigate(`/candidateinvited/${id}`);
                }}
              >
                <svg
                  width="29"
                  height="29"
                  viewBox="0 0 29 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    x="0.664062"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#615D5B"
                  />
                  <g clip-path="url(#clip0_1492_5412)">
                    <path
                      d="M19.75 8.91699L12.875 15.792"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.75 8.91699L15.375 21.417L12.875 15.792L7.25 13.292L19.75 8.91699Z"
                      stroke="#827C7C"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1492_5412">
                      <rect
                        width="15"
                        height="15"
                        fill="white"
                        transform="translate(6 7.66699)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <span>
                  Invited{" "}
                  {context.loading
                    ? null
                    : `(${context.totalCandidateCount?.candidatesInvited})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>
            </div>

            <div className="candidate-test-heading">
              <div className="test-heading-left">
                {/* {selectedAll ? <svg onClick={() => { setSelectedAll(false); setSelectedCandidates([]) }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="15" height="15" rx="2" fill="#FF6812" />
                                    <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> :
                                    <svg onClick={() => {
                                        handleCheckBox(null, context.testTakenCandidates.length)
                                    }} width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0.5" y="1.30664" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                    </svg>} */}
                <span>
                  Total Candidates{" "}
                  {context.loading
                    ? null
                    : `(${context.totalCandidateCount.candidatesAppeared})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
                <div style={{ position: "relative" }}>
                  <div className="input-container">
                    <svg
                      width="16"
                      height="17"
                      viewBox="0 0 16 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M14.1788 16.0985L10.6877 12.6066C7.96518 14.7527 4.04181 14.4049 1.7392 11.8136C-0.563451 9.22218 -0.44744 5.28521 2.00382 2.83395C4.45508 0.38264 8.3921 0.266628 10.9835 2.56924C13.5749 4.87189 13.9226 8.79521 11.7766 11.5177L15.2677 15.0081C15.4927 15.1959 15.5925 15.4947 15.5252 15.78C15.4579 16.0653 15.2353 16.2881 14.95 16.3556C14.6647 16.423 14.3659 16.3235 14.178 16.0985H14.1788ZM1.62506 7.4614C1.62435 9.4746 2.8299 11.2929 4.68509 12.0762C6.54024 12.8595 8.68413 12.4554 10.1269 11.0505C10.1411 11.0332 10.1561 11.0168 10.1722 11.0013C10.1882 10.9859 10.2044 10.9709 10.2209 10.9564C11.7964 9.33856 12.0942 6.86632 10.9479 4.92058C9.80169 2.97484 7.49497 2.03697 5.31617 2.63078C3.13736 3.22458 1.62553 5.20315 1.62501 7.4614H1.62506Z"
                        fill="#606D77"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search Candidates"
                      onChange={(e) => {
                        setSearch(e.target.value);
                        searchInvitesOnChange(e);
                      }}
                      value={search}
                    />
                    {search !== "" ? (
                      <svg
                        width="20px"
                        height="20px"
                        stroke-width="1.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#000000"
                        onClick={() => {
                          setSearch("");
                          setSearchData([]);
                          context.getCandidates(id);
                        }}
                        style={{
                          cursor: "pointer",
                        }}
                      >
                        <path
                          d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"
                          stroke="#000000"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        ></path>
                      </svg>
                    ) : null}
                  </div>

                  {searchData?.length === 0 ? null : (
                    <div className="search-container-of-test-taken">
                      {searchData.map((data, index) => {
                        return (
                          <span
                            key={index}
                            onClick={() => {
                              context.handleTestTakenCandidates([data]);
                              setSearch(data.invite.candidateName);
                            }}
                            className="candidate-name"
                          >
                            {data.invite.candidateName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="test-heading-right-of-test-taken">
                {isUpdateScore ? (
                  <UpdateCutOffScore
                    noOfQuestion={context.testDetails.totalNoOfQuestions}
                    testScore={context.testDetails.totalScore}
                    cutOffScore={context.cutOffScore}
                    onCuffOffScoreChange={(value) =>
                      updateTestCutOffScore(value)
                    }
                  />
                ) : (
                  <></>
                )}
                {isCandidateStatus ? (
                  <CandidateStatusFilter
                    closeFilterPopup={() => setisCandidateStatus(false)}
                    candidateFilter={candidateFilter}
                    onChangeCandidateFilter={(value) => {
                      value === "All"
                        ? context.getCandidates(id)
                        : filterCandidate(value);
                      setcandidateFilter(value);
                      setisCandidateStatus(false);
                    }}
                  />
                ) : (
                  <></>
                )}

                <div
                  onClick={() => setisCandidateStatus(!isCandidateStatus)}
                  className="candidate-status-dropdown"
                >
                  {candidateFilter}
                  {/* <option value="recommended">Recommended(High to Low)</option>
                                    <option value="latest">Latest</option>
                                    <option value="Greater than 75%">Greater than 75%</option>
                                    <option value="Greater than 50%">Greater than 50%</option>
                                    <option value="Less than 50%">Less than 50%</option> */}
                </div>

                <div
                  className="shortlist"
                  onClick={() => setisUpdateScore(!isUpdateScore)}
                  style={
                    selectedCandidates?.length > 0
                      ? { background: "#00C49A" }
                      : {}
                  }
                >
                  <svg
                    width="15"
                    height="14"
                    viewBox="0 0 15 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_7211_4748)">
                      <path
                        d="M7.72396 8.86686C9.97912 8.86686 11.8073 7.03869 11.8073 4.78353C11.8073 2.52837 9.97912 0.700195 7.72396 0.700195C5.4688 0.700195 3.64062 2.52837 3.64062 4.78353C3.64062 7.03869 5.4688 8.86686 7.72396 8.86686Z"
                        stroke="white"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M5.55346 8.72002L4.92969 13.4164L7.84635 11.6664L10.763 13.4164L10.1399 8.72002L10.0986 8.4082"
                        stroke="white"
                        stroke-width="1.25"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <line
                        x1="5.74219"
                        y1="4.27539"
                        x2="9.94219"
                        y2="4.27539"
                        stroke="white"
                        stroke-width="1.25"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_7211_4748">
                        <rect
                          width="14"
                          height="14"
                          fill="white"
                          transform="translate(0.84375)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <span>Update Cutoff ({context.cutOffScore})</span>
                </div>
                <div className="btnExport" onClick={exportCandidates}>
                  <button>Export</button>
                  <svg
                    width="22px"
                    height="22px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <path
                        d="M19.002 21V15M21.0303 17L19.0303 15L17.0303 17M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19M19 9V11M9 17H13M9 13H15M9 9H10"
                        stroke="#ffff"
                        stroke-width="1.416"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>{" "}
                    </g>
                  </svg>
                </div>
              </div>
            </div>
            {context.testTakenCandidates?.length === 0 &&
            context.loading === false ? (
              <span className="msg">No candidates found.</span>
            ) : (
              <>
                <div className="pagination">
                  <button
                    onClick={() => {
                      if (currentPage > 1) {
                        if (currentPage > 1) {
                          if (loading === false) {
                            setCurrentPage(currentPage - 1);
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
                    {context.totalPages === 0 ? 0 : currentPage}/
                    {context.totalPages}
                  </span>
                  <button
                    onClick={() => {
                      setCurrentPage(
                        currentPage === context.totalPages ||
                          context.totalPages === 0
                          ? currentPage
                          : loading === false
                          ? currentPage + 1
                          : currentPage
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
                <table cellSpacing={0}>
                  <tr>
                    <th>No</th>
                    <th>Name</th>
                    <th>Emails</th>
                    <th>Candidate Score</th>
                    <th>Section Score</th>
                    <th>Status</th>
                    <th>Test Duration</th>
                  </tr>
                  {context.testTakenCandidates
                    .sort(
                      (a, b) =>
                        b.candidateResult.candidate_total_Score -
                        a.candidateResult.candidate_total_Score
                    )
                    ?.map((data, index) => {
                      return (
                        <tr key={index}>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td className="dropdownParent">
                            {data?.invite.candidateName}
                            <svg
                              width="3"
                              height="12"
                              viewBox="0 0 3 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              style={{ float: "right", cursor: "pointer" }}
                              onClick={() => setshowDropDown(data.invite._id)}
                            >
                              <circle
                                cx="1.5"
                                cy="1.5"
                                r="1.5"
                                fill="#333333"
                              />
                              <circle cx="1.5" cy="6" r="1.5" fill="#333333" />
                              <circle
                                cx="1.5"
                                cy="10.5"
                                r="1.5"
                                fill="#333333"
                              />
                            </svg>
                            {showDropDown === data.invite._id && (
                              <ul className="dropDownMenu">
                                <li
                                  onClick={(e) =>
                                    onClickCandidate(
                                      e,
                                      data.invite._id,
                                      index + 1
                                    )
                                  }
                                >
                                  View
                                </li>
                                <li
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `https://www.dev.theeliteqa.com/candidateResult/${data.invite._id}`
                                    );
                                    toast.success("Link copied to clipboard");
                                  }}
                                >
                                  Get result Link
                                </li>
                                <li
                                  style={{
                                    float: "right",
                                    color: "#FF6812",
                                    marginTop: "4px",
                                  }}
                                  onClick={() => setshowDropDown("none")}
                                >
                                  Close
                                </li>
                              </ul>
                            )}
                          </td>
                          <td style={{ textTransform: "none" }}>
                            {data?.invite.candidateEmail}{" "}
                            {data?.candidateResult?.candidate_total_Score <
                              context.cutOffScore &&
                            data?.invite.status[data?.invite.status?.length - 1]
                              ?.currentStatus !== "shortlisted" &&
                            data?.invite.status[data?.invite.status?.length - 1]
                              ?.currentStatus !== "reviewed" ? (
                              <span
                                onClick={(e) =>
                                  moveToShortlisted(e, data.invite._id)
                                }
                              >
                                Move To Shortlisted
                                <svg
                                  width="12"
                                  height="13"
                                  viewBox="0 0 12 13"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2.5 6.36914H9.5"
                                    stroke="#00C49A"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M6 2.86914L9.5 6.36914L6 9.86914"
                                    stroke="#00C49A"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </span>
                            ) : null}{" "}
                          </td>
                          <td>
                            {data?.candidateResult?.candidate_total_Score}
                          </td>
                          <td>
                            MCQ - {data?.candidateResult?.candidate_total_Score}{" "}
                            & Program - {0}
                          </td>

                          {data.candidateResult !== null &&
                          data?.invite.status[data?.invite.status?.length - 1]
                            ?.currentStatus === "appeared" ? (
                            <>
                              {data?.candidateResult?.candidate_total_Score >=
                              context.cutOffScore ? (
                                <td
                                  style={{ color: "#00C49A", fontWeight: 500 }}
                                >
                                  {" "}
                                  Pass
                                </td>
                              ) : (
                                <td
                                  style={{ color: "#F23E3E", fontWeight: 500 }}
                                >
                                  {" "}
                                  Failed
                                </td>
                              )}
                            </>
                          ) : (
                            <td
                              style={
                                data?.invite.status[
                                  data?.invite.status?.length - 1
                                ]?.currentStatus === "appeared"
                                  ? { color: "#827C7C", fontWeight: 500 }
                                  : data?.invite.status[
                                      data?.invite.status?.length - 1
                                    ]?.currentStatus === "shortlisted"
                                  ? { color: "#FF6812", fontWeight: 500 }
                                  : { color: "#384455", fontWeight: 500 }
                              }
                            >
                              {" "}
                              {
                                data?.invite.status[
                                  data?.invite.status?.length - 1
                                ]?.currentStatus
                              }
                            </td>
                          )}
                          <td>
                            {(
                              parseInt(
                                data?.candidateResult
                                  ?.candidate_total_time_spent
                              ) / 60
                            ).toFixed(2)}{" "}
                            mins
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </>
            )}

            {/* {context.testTakenCandidates.length === 0 && context.loading === false ? <span className='msg'>No candidates found.</span> : <div className="candidate-card-container">
                            {context.testTakenCandidates.map((data, index) => {
                                return <TestTakenCard status={data.status} candidate={data} no={index + 1} setSelectedCandidates={setSelectedCandidates} selectedCandidates={selectedCandidates} setSelectedAll={setSelectedAll} updateStatus={updateCandidateStatusInBulk} />
                            })}

                        </div>} */}

            {context.loading
              ? loaderArray.map((data) => {
                  return <CandidateCardSkeleton page="testtaken" />;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateTestTaken;
