import React, { useState, useEffect, useContext } from "react";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import "./index.css";
import AssessmentPreviewSideBar from "../../component/AssessmentOverviewSidebar";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import CandidateInvite from "../../component/CandidateInvitePopup";
import TestSummaryContext from "../../store/TestSummaryContext";
import { backend_url, getCookie } from "../../constant";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import InviteExpiredCandidate from "../../component/InviteExpiredCandidate";
import CandidateInvitedStatusFilter from "../../component/CandidateInvitedStatusFilter";

function CandidateInvited() {
  let navigate = useNavigate();
  const context = useContext(TestSummaryContext);
  const [invitePopup, setInvitePopup] = useState(false);
  const [loading, setLoading] = useState([]);
  const { state } = useLocation();
  const { id } = useParams();
  const [test, setTest] = useState(context.test);
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [showInviteExpiryModal, setshowInviteExpiryModal] = useState(false);
  const [candidateFilter, setcandidateFilter] = useState("All");
  const [isCandidateStatus, setisCandidateStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    if (candidateFilter !== "All") {
      filterCandidate();
    } else {
      context.getCandidates(id, currentPage, limit);
    }
  }, [candidateFilter]);

  const filterCandidate = async () => {
    try {
      setLoading(true);
      const token = getCookie("Xh7ERL0G");
      const res = await axios.post(
        `${backend_url}invites/filterCandidateStatus/${id}`,
        { candidateStatus: candidateFilter.toLowerCase(), searchText: search },
        { headers: { token: token } }
      );
      setLoading(false);
      context.handleInvitedCandidates(res.data.data);
    } catch (error) {
      toast.error(error);
    }
  };

  const searchInvitesOnChange = async (e) => {
    try {
      const token = getCookie("Xh7ERL0G");
      const decoded = jwtDecode(token);
      const response = await axios.post(
        `${backend_url}invites/search/candidate/intest/${decoded.user_id}?page=1&limit=10`,
        {
          searchText: e.target.value,
          testId: id,
          testType: context.testDetails.testType,
        },
        { headers: { token: token } }
      );
      if (response.status === 200) {
        if (e.target.value !== "") {
          const reviewed = response.data.data.filter((data) =>
            data.invite.status.filter(
              (candidateStatus) =>
                candidateStatus.currentStatus === "invited" ||
                candidateStatus.currentStatus === "shortlisted" ||
                candidateStatus.currentStatus === "reviewed" ||
                candidateStatus.currentStatus === "appeared" ||
                candidateStatus.currentStatus === "rejected" ||
                candidateStatus.currentStatus === "hired"
            )
          );
          setSearchData(reviewed);
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

  useEffect(() => {
    if (state?.popup) {
      setInvitePopup(true);
    }
  }, []);

  useEffect(() => {
    //64032be82444024165243370
    context.getCandidates(id, currentPage, limit);
  }, [currentPage]);

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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

  const formateDate = (time) => {
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

    return ` ${day}-${month}-${year} at ${strTime}`;
  };

  const getExpiredCount = () => {
    let totalCount = 0;
    const currentDate = new Date(); // Assuming currentDate is in milliseconds.
    let candidates = [];
    context.invitedCandidates.forEach((data) => {
      if (
        currentDate > new Date(data.invite.validityEndDate) &&
        data.invite.status[data.invite.status.length - 1].currentStatus ===
          "invited"
      ) {
        totalCount = totalCount + 1;
        candidates.push(data);
      }
    });

    return totalCount;
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

  const inviteExpiryCandidate = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const currentDate = new Date();
      let candidates = [];
      context.invitedCandidates.forEach((data) => {
        if (
          currentDate > new Date(data.invite.validityEndDate) &&
          data.invite.status[data.invite.status.length - 1].currentStatus ===
            "invited"
        ) {
          candidates.push(data);
        }
      });
      await axios.put(
        `${backend_url}invites/expiryCandidate`,
        { candidate: candidates },
        { headers: { token: token } }
      );
      context.getCandidates(id, currentPage, limit);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const showExpiredCandidatePopup = () => {
    setshowInviteExpiryModal(!showInviteExpiryModal);
  };

  return (
    <div className="candidate-invited">
      <NavigationBar assessment={false} />
      {showInviteExpiryModal ? (
        <InviteExpiredCandidate
          expiryCandidateCount={getExpiredCount()}
          closeButton={() => setshowInviteExpiryModal(false)}
          onClickNo={() => setshowInviteExpiryModal(false)}
          onClickYes={() => inviteExpiryCandidate()}
        />
      ) : (
        <></>
      )}
      {invitePopup ? (
        <CandidateInvite
          testData={context.testDetails}
          invitedCandidate={() => {
            context.getCandidates(id);
            setInvitePopup(false);
          }}
          closePopup={() => {
            setInvitePopup(false);
          }}
          testId={id}
        />
      ) : null}
      <div className="candidate-invited-container">
        <div className="candidate-invited-container-left">
          <AssessmentPreviewSideBar
            testType={test?.status}
            testDetails={test}
            testName={test?.name}
            active={"candidates"}
          />
        </div>
        <div className="candidate-invited-container-right">
          <div className="candidate-invited-content">
            <div className="test-taken-header">
              <div
                className="test-not-active"
                style={{ paddingRight: "55px", cursor: "pointer" }}
                onClick={() => {
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
                    d="M19.7266 20.125V18.875C19.7266 18.212 19.4632 17.5761 18.9943 17.1072C18.5255 16.6384 17.8896 16.375 17.2266 16.375H12.2266C11.5635 16.375 10.9276 16.6384 10.4588 17.1072C9.98995 17.5761 9.72656 18.212 9.72656 18.875V20.125"
                    stroke="#827C7C"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M14.7266 13.875C16.1073 13.875 17.2266 12.7557 17.2266 11.375C17.2266 9.99429 16.1073 8.875 14.7266 8.875C13.3459 8.875 12.2266 9.99429 12.2266 11.375C12.2266 12.7557 13.3459 13.875 14.7266 13.875Z"
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
                    : `(${context.totalCandidateCount?.candidatesShortlisted})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>
              <div
                style={{ paddingRight: "55px", cursor: "pointer" }}
                className="test-not-active"
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
                    : `(${context.totalCandidateCount?.candidatesReviewed})`}
                </span>
                {context.loading ? <div className="skeleton" /> : null}
              </div>

              <div
                style={{ paddingRight: "55px", cursor: "pointer" }}
                className="test-active"
                onClick={() => {
                  navigate(`/candidateinvited/${id}`);
                }}
              >
                <svg
                  width="30"
                  height="29"
                  viewBox="0 0 30 29"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    opacity="0.1"
                    x="0.890625"
                    width="28.3336"
                    height="28.3336"
                    rx="14"
                    fill="#FF6812"
                  />
                  <g clip-path="url(#clip0_1492_5412)">
                    <path
                      d="M19.9766 8.91699L13.1016 15.792"
                      stroke="#FF6812"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M19.9766 8.91699L15.6016 21.417L13.1016 15.792L7.47656 13.292L19.9766 8.91699Z"
                      stroke="#FF6812"
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
                        transform="translate(6.22656 7.66699)"
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
                <span>
                  All Invited Candidates
                  {`(${context.invitedCandidates?.length})`}
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
                  {searchData?.length === 0 ? null : (
                    <div className="search-container-reviewed">
                      {searchData.map((data, index) => {
                        return (
                          <span
                            key={index}
                            onClick={() => {
                              context.handleInvitedCandidates([data]);
                              setSearch(data.invite.candidateName);
                            }}
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
                {isCandidateStatus && (
                  <CandidateInvitedStatusFilter
                    closeFilterPopup={() => setisCandidateStatus(false)}
                    candidateFilter={candidateFilter}
                    onChangeCandidateFilter={(value) => {
                      setcandidateFilter(value);
                      setisCandidateStatus(false);
                    }}
                  />
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
                  onClick={showExpiredCandidatePopup}
                  className="invite-expiry-button"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8" r="8" fill="white" />
                    <g clip-path="url(#clip0_7156_5887)">
                      <path
                        d="M11.5953 5L7.19531 9.4"
                        stroke="#FF6812"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.5938 5L8.79375 13L7.19375 9.4L3.59375 7.8L11.5938 5Z"
                        stroke="#FF6812"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_7156_5887">
                        <rect
                          width="9.6"
                          height="9.6"
                          fill="white"
                          transform="translate(2.79688 4.2002)"
                        />
                      </clipPath>
                    </defs>
                  </svg>

                  <span>Invite Expired ({getExpiredCount()})</span>
                </div>
                <div
                  className="shortlist"
                  onClick={() => {
                    if (context.test.status !== "draft") {
                      setInvitePopup(true);
                    } else {
                      toast.error("test is in draft mode!");
                    }
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="8" cy="8" r="8" fill="white" />
                    <g clip-path="url(#clip0_3111_2647)">
                      <path
                        d="M11.5953 5L7.19531 9.4"
                        stroke="#00C49A"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.5938 5L8.79375 13L7.19375 9.4L3.59375 7.8L11.5938 5Z"
                        stroke="#00C49A"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3111_2647">
                        <rect
                          width="9.6"
                          height="9.6"
                          fill="white"
                          transform="translate(2.79688 4.2002)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <span>Invite</span>
                </div>
              </div>
            </div>

            <div className="invited-table">
              {context.loading ? (
                <table cellSpacing="0px">
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Emails</th>
                    <th>Invited On</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th>Invited By</th>
                  </tr>

                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((data) => {
                    return (
                      <tr>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                        <td className="skeleton"></td>
                      </tr>
                    );
                  })}
                </table>
              ) : (
                <>
                  <div className="pagination">
                    <button
                      onClick={() => {
                        if (currentPage > 1 && context.totalPages !== 0)
                          setCurrentPage(currentPage - 1);
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
                        if (
                          currentPage < context.totalPages &&
                          context.totalPages !== 0
                        )
                          setCurrentPage(currentPage + 1);
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
                  <table cellSpacing="0px">
                    <tr>
                      <th>No.</th>
                      <th>Name</th>
                      <th>Emails</th>
                      <th>Invited On</th>
                      <th>Expiry Date</th>
                      <th>Status</th>
                      <th>Invited By</th>
                    </tr>
                    {context.invitedCandidates.map((data, index) => {
                      return (
                        <tr>
                          <td>{(currentPage - 1) * limit + index + 1}</td>
                          <td>{data?.invite.candidateName}</td>
                          <td style={{ textTransform: "lowercase" }}>
                            {data?.invite.candidateEmail}
                          </td>
                          <td>
                            {data?.invite.validityStartDate !== undefined
                              ? formateDate(data?.invite.validityStartDate)
                              : "-"}
                          </td>
                          <td>
                            {data?.invite.validityEndDate !== undefined
                              ? formateDate(data?.invite.validityEndDate)
                              : "-"}
                          </td>
                          <td
                            style={
                              new Date() >
                                new Date(data.invite.validityEndDate) &&
                              data.invite.status[
                                data?.invite?.status?.length - 1
                              ].currentStatus === "invited"
                                ? { color: "#F23E3E" }
                                : data.invite.status[
                                    data?.invite?.status?.length - 1
                                  ].currentStatus === "invited"
                                ? { color: "#00C49A" }
                                : data.invite.status[
                                    data?.invite?.status?.length - 1
                                  ].currentStatus === "appeared" ||
                                  data.invite.status[
                                    data?.invite?.status?.length - 1
                                  ].currentStatus === "reviewed" ||
                                  data.invite.status[
                                    data?.invite?.status?.length - 1
                                  ].currentStatus === "shortlisted"
                                ? { color: "#333333" }
                                : {}
                            }
                          >
                            {new Date() >
                              new Date(data.invite.validityEndDate) &&
                            data.invite.status[data?.invite?.status?.length - 1]
                              .currentStatus === "invited"
                              ? "Expired"
                              : data.invite.status[
                                  data?.invite?.status?.length - 1
                                ].currentStatus}
                          </td>
                          <td>
                            {data?.invite.invitedBy?.fullName !== undefined
                              ? data?.invite?.invitedBy?.fullName
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CandidateInvited;
