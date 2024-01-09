import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import AssessmentPreviewSideBar from "../../component/AssessmentOverviewSidebar";
import TestTakenCard from "./TestTakenCard";
import { useNavigate, useParams } from "react-router-dom";
import Shortlisted from "../../component/ShortlistedPopup";
import { backend_url, getCookie } from "../../constant";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import TestSummaryContext from "../../store/TestSummaryContext";
import CandidateCardSkeleton from "../../component/CandidateSekeleton";

function CandidatePass() {
  let navigate = useNavigate();
  const context = useContext(TestSummaryContext);
  const [shortlist, setShortlist] = useState(false);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [loading, setloading] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [selectedAll, setSelectedAll] = useState(false);
  const [loaderIndex, setLoaderIndex] = useState(null);
  const { id } = useParams();
  const loaderArray = [1, 2, 3, 4];
  const [test, setTest] = useState(context.test);
  const [refresh, setrefresh] = useState({});

  useEffect(() => {}, [refresh]);

  const searchInvitesOnChange = async (e) => {
    try {
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      const response = await axios.post(
        `${backend_url}invites/search/candidate/intest/${decoded.user_id}?page=1&limit=10`,
        {
          searchText: e.target.value,
          testId: context.testId,
          testType: context.testDetails.testType,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        if (e.target.value !== "") {
          const testTaken = response.data.data.filter((data) =>
            data.invite.status.some(
              (candidateStatus) =>
                candidateStatus.currentStatus === "appeared" &&
                data?.candidateResult?.candidate_total_Score >=
                  context.cutOffScore
            )
          );
          console.log(testTaken);
          setSearchData(testTaken);
        } else {
          setSearchData([]);
          // context.getCandidates()
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Opps something went wrong please try again!");
    }
  };

  const handleCheckBox = (length) => {
    if (length !== undefined) {
      setSelectedAll(true);
      setSelectedCandidates(
        context.testPassedCandidates.filter(
          (candidate) =>
            candidate.candidateResult.candidate_total_Score >=
              context.cutOffScore &&
            candidate?.invite.status[candidate?.invite.status?.length - 1]
              ?.currentStatus === "appeared"
        )
      );
    }
  };

  const updateCandidateStatusInBulk = async (candidateId) => {
    try {
      setloading(true);
      let candidates;
      if (candidateId === "") {
        candidates = selectedCandidates.map((data) => {
          data.invite.status.push({
            currentStatus: "shortlisted",
            statusDate: new Date(),
          });
          return data;
        });
      }

      const token = getCookie("Xh7ERL0G");
      const response = await axios.put(
        `${backend_url}invites/update/candidate/status`,
        {
          candidates: candidates.map((data) => data.invite),
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        setloading(false);
        candidates.forEach((data) => {
          context.shortlistedCandidates.push(data);
        });

        setShortlist(true);
        setSelectedAll(false);
        setSelectedCandidates([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Opps, Please try again!");
    }
  };

  useEffect(() => {
    //64032be82444024165243370
    context.getCandidates(id);
  }, []);

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

  const getreviewPendingCandidateCount = () => {
    const totalPassCandidate = context.testPassedCandidates.reduce(
      (candidateCount, candidate) => {
        if (
          candidate.candidateResult.candidate_total_Score >=
            context.cutOffScore &&
          candidate?.invite.status[candidate?.invite.status?.length - 1]
            ?.currentStatus === "appeared"
        ) {
          candidateCount += 1;
        }
        return candidateCount;
      },
      0
    );
    return totalPassCandidate;
  };

  const moveToReview = (candidateId) => {
    try {
      const candidateData = context.testPassedCandidates.filter(
        (data) => data.invite._id === candidateId
      );
      candidateData[0].invite.status.push({
        currentStatus: "reviewed",
        statusDate: new Date(),
      });
      const res = axios.put(
        `${backend_url}invites/moveToReviewCandidate/${candidateId}`,
        { status: candidateData[0].invite.status }
      );
      context.testPassedCandidates.forEach((data) => {
        if (data._id === candidateId) {
          data.status = candidateData.status;
        }
      });
      context.reviewedCandidates.push(candidateData[0]);
      //remove candidate from selectedCandidates
      const index = selectedCandidates.findIndex(
        (data) => data.invite._id === candidateId
      );
      if (index !== -1) {
        selectedCandidates.splice(index, 1);
      }

      setrefresh({});
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const moveToShortlisted = (candidateId) => {
    try {
      const candidateData = context.testPassedCandidates.filter(
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
      context.testPassedCandidates.forEach((data) => {
        if (data._id === candidateId) {
          data.status = candidateData.status;
        }
      });
      context.shortlistedCandidates.push(candidateData[0]);
      //remove candidate from selectedCandidates
      const index = selectedCandidates.findIndex(
        (data) => data.invite._id === candidateId
      );
      if (index !== -1) {
        selectedCandidates.splice(index, 1);
      }

      setrefresh({});
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  return (
    <div className="reviewed-container">
      <NavigationBar assessment={false} />
      {shortlist && (
        <Shortlisted
          single={true}
          cancelButton={() => {
            setShortlist(false);
          }}
          no={selectedCandidates.length}
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
                style={{ paddingRight: "55px", cursor: "pointer" }}
                className="test-not-active"
                onClick={() => {
                  context.getCandidates(id);
                  navigate(`/candidatetesttaken/${id}`);
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
                    x="0.226562"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#615D5B"
                  />
                  <path
                    d="M19.5 20.125V18.875C19.5 18.212 19.2366 17.5761 18.7678 17.1072C18.2989 16.6384 17.663 16.375 17 16.375H12C11.337 16.375 10.7011 16.6384 10.2322 17.1072C9.76339 17.5761 9.5 18.212 9.5 18.875V20.125"
                    stroke="#827C7C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.5 13.875C15.8807 13.875 17 12.7557 17 11.375C17 9.99429 15.8807 8.875 14.5 8.875C13.1193 8.875 12 9.99429 12 11.375C12 12.7557 13.1193 13.875 14.5 13.875Z"
                    stroke="#827C7C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>
                  Test Taken{" "}
                  {context.loading
                    ? null
                    : `(${context.totalCandidateCount?.candidatesAppeared})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>
              <div
                onClick={() => {
                  //candidatepass
                  context.getCandidates(id);
                  navigate(`/candidatepass/${id}`);
                }}
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
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#FF6812"
                  />
                  <g clip-path="url(#clip0_7211_4703)">
                    <path
                      d="M18.3359 19.792V18.542C18.3359 17.879 18.0725 17.2431 17.6037 16.7742C17.1349 16.3054 16.499 16.042 15.8359 16.042H11.4609C10.7979 16.042 10.162 16.3054 9.69317 16.7742C9.22433 17.2431 8.96094 17.879 8.96094 18.542V19.792"
                      stroke="#FF6812"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M13.6484 13.542C15.0291 13.542 16.1484 12.4227 16.1484 11.042C16.1484 9.66128 15.0291 8.54199 13.6484 8.54199C12.2677 8.54199 11.1484 9.66128 11.1484 11.042C11.1484 12.4227 12.2677 13.542 13.6484 13.542Z"
                      stroke="#FF6812"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M18.9609 13.542L20.2109 14.792L22.7109 12.292"
                      stroke="#FF6812"
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
                className="test-not-active"
                style={{ paddingRight: "55px", cursor: "pointer" }}
                onClick={() => {
                  context.getCandidates(id);
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
                className="test-not-active"
                style={{ paddingRight: "55px", cursor: "pointer" }}
                onClick={() => {
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
                className="test-not-active"
                style={{ paddingRight: "55px", cursor: "pointer" }}
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
                {selectedAll ? (
                  <svg
                    onClick={() => {
                      setSelectedAll(false);
                      setSelectedCandidates([]);
                    }}
                    style={{ cursor: "pointer" }}
                    width="20"
                    height="20"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="15" height="15" rx="2" fill="#FF6812" />
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
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      handleCheckBox(null, context.reviewedCandidates.length);
                    }}
                    width="20"
                    height="20"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.5"
                      y="1.30664"
                      width="19"
                      height="19"
                      rx="1.5"
                      stroke="#827C7C"
                    />
                  </svg>
                )}
                <span>
                  Review Pending Candidates ({getreviewPendingCandidateCount()})
                </span>
                <div>
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
                  {searchData.length === 0 ? null : (
                    <div className="search-container-candidate-pass">
                      {searchData.map((data, index) => {
                        return (
                          <span
                            key={index}
                            onClick={() => {
                              context.handleTestPassedCandidates([data]);
                              setSearch(data.invite.candidateName);
                            }}
                            className="candidate-pass-search-data"
                          >
                            {data.invite.candidateName}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="test-heading-right">
                <select
                  onChange={(e) => {
                    context.filterCandidates("passed", e.target.value);
                  }}
                >
                  <option>filter</option>
                  <option value="latest">Latest</option>
                  <option value="recommended">Recommended (High to Low)</option>
                  <option value="Greater than 75%">Greater than 75%</option>
                  <option value="Greater than 50%">Greater than 50%</option>
                  <option value="Less than 50%">Less than 50%</option>
                </select>
                <div
                  className="shortlist"
                  onClick={() => {
                    if (selectedCandidates.length) {
                      updateCandidateStatusInBulk("");
                    }
                  }}
                  style={
                    selectedCandidates.length > 0
                      ? { background: "#00C49A" }
                      : {}
                  }
                >
                  <svg
                    width="14"
                    height="15"
                    viewBox="0 0 14 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_3074_2310)">
                      <path
                        d="M9.33594 13.1309V11.9642C9.33594 11.3454 9.0901 10.7519 8.65252 10.3143C8.21493 9.87669 7.62144 9.63086 7.0026 9.63086H2.91927C2.30043 9.63086 1.70694 9.87669 1.26936 10.3143C0.83177 10.7519 0.585938 11.3454 0.585938 11.9642V13.1309"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M4.95833 7.29753C6.247 7.29753 7.29167 6.25286 7.29167 4.96419C7.29167 3.67553 6.247 2.63086 4.95833 2.63086C3.66967 2.63086 2.625 3.67553 2.625 4.96419C2.625 6.25286 3.66967 7.29753 4.95833 7.29753Z"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.6641 5.54785V9.04785"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.4141 7.29785H9.91406"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3074_2310">
                        <rect
                          width="14"
                          height="14"
                          fill="white"
                          transform="translate(0 0.880859)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>
                    {loading && loaderIndex === null
                      ? "Shortlisting..."
                      : "Shortlist"}
                  </span>
                </div>
              </div>
            </div>

            {getPassCandidateCount() < 0 ? (
              <span className="msg">No candidates reviewed.</span>
            ) : (
              <div className="candidate-card-container">
                {(selectedAll
                  ? selectedCandidates
                  : context.testPassedCandidates
                )
                  .filter(
                    (data) =>
                      data.candidateResult.candidate_total_Score >=
                      context.cutOffScore
                  )
                  .sort(
                    (a, b) =>
                      b.candidateResult.candidate_total_Score -
                      a.candidateResult.candidate_total_Score
                  )
                  .map((data, index) => {
                    return (
                      <TestTakenCard
                        moveToShortlisted={(id) => moveToShortlisted(id)}
                        moveToReview={(id) => moveToReview(id)}
                        finishedDate={data?.invite.status[0]?.statusDate}
                        status={
                          data?.invite.status[data?.invite.status?.length - 1]
                            ?.currentStatus
                        }
                        candidate={data}
                        no={index + 1}
                        setSelectedCandidates={setSelectedCandidates}
                        selectedCandidates={selectedCandidates}
                        setSelectedAll={setSelectedAll}
                        updateStatus={updateCandidateStatusInBulk}
                        setLoaderIndex={setLoaderIndex}
                        loaderIndex={loaderIndex}
                        loading={loading}
                      />
                    );
                  })}
              </div>
            )}
            {context.loading
              ? loaderArray.map((data) => {
                  return <CandidateCardSkeleton page="reviewed" />;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidatePass;
