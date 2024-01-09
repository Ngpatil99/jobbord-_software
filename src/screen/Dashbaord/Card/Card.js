import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import ReactTooltip from "react-tooltip";
import jwtDecode from "jwt-decode";
import ToggleButton from "../../../component/ToggleButton";
import { backend_url, getCookie } from "../../../constant";
import "./Card.css";
import { useNavigate } from "react-router-dom";
import TestSummaryContext from "../../../store/TestSummaryContext";
import { toast } from "react-toastify";

const Card = (props) => {
  const context = useContext(TestSummaryContext);
  const navigate = useNavigate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  console.log(props);
  const startDate = new Date(props.startDate);
  const endDate = props.endDate ? new Date(props.endDate) : "";
  const [inviteDetails, setinviteDetails] = useState({
    totalInvite: 0,
    appeared: 0,
    qualified: 0,
  });
  const [clientId, setclientId] = useState("");

  const getInviteDetails = async () => {
    let qualifiedcnt = 0;
    let appearcnt = 0;
    let totalInvite = 0;
    const token = getCookie("Xh7ERL0G");
    if (props?.status !== "draft") {
      totalInvite = props.testInviteData.length;
      props.testInviteData.forEach((element) => {
        element.status.forEach((status) => {
          if (status.currentStatus === "hired") {
            qualifiedcnt = qualifiedcnt + 1;
          }
        });
      });

      props.testInviteData.forEach((element) => {
        element.status.forEach((status) => {
          if (status.currentStatus === "appeared") {
            appearcnt = appearcnt + 1;
          }
        });
      });
    }

    setinviteDetails((prev) => ({
      ...prev,
      totalInvite: totalInvite,
      appeared: appearcnt,
      qualified: props.qualified,
    }));
  };

  const updateTestisActive = async (status) => {
    try {
      const token = getCookie("Xh7ERL0G");
      const res = await axios.put(
        `${backend_url}test/updateStatusOfDraftTest/${props?._id}`,
        {
          isActive: status,
          status:
            props?.testType !== "draft"
              ? status
                ? "published"
                : "completed"
              : status
              ? "published"
              : "completed",
        },
        { headers: { token: token } }
      );
      toast(`test is ${status ? "on" : "off"}`);
      props.refersh(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const token = getCookie("Xh7ERL0G");
    const decode = jwtDecode(token);

    setclientId(decode.user_id);

    getInviteDetails();
    // eslint-disable-next-line
  }, [props._id]);

  const handleClickOnCard = (e) => {
    e.stopPropagation();

    if (e.target === e.currentTarget) {
      navigate(`/assessmentoverview/${props._id}`);
      context.handleTestId(props._id);
      context.handleTest(props);
    } else if (
      e.target.className !== "slider round" &&
      e.target.className !== "toggleSwitch"
    ) {
      navigate(`/assessmentoverview/${props._id}`);
      context.handleTestId(props._id);
      context.handleTest(props);
    }
  };

  const onClickToggle = (testStatus) => {
    updateTestisActive(testStatus);
  };

  const onClickSendInvite = (e, testID) => {
    e.stopPropagation();
    props.open(testID);
  };

  const copyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(props?.link);
    toast.success(`Test Link Copied To ClipBoard`);
  };

  const truncateTestHeader = (questionHeader) => {
    if (questionHeader?.length > 35) {
      return questionHeader.substring(0, 35) + "...";
    }
    return questionHeader;
  };

  return (
    <div className="dashboard-card-container" onClick={handleClickOnCard}>
      <div className="left-side">
        <div className="header">
          <span>{truncateTestHeader(props.name)}</span>

          <button
            data-tip={props?.status}
            style={
              props?.status === "published"
                ? {}
                : props?.status === "draft"
                ? { backgroundColor: "#DEE2E8" }
                : { backgroundColor: "#D6FFF6" }
            }
            className="status-button"
          >
            <div
              style={
                props?.status === "published"
                  ? {}
                  : props?.status === "draft"
                  ? { backgroundColor: "#384455" }
                  : { backgroundColor: "#00C49A" }
              }
              className="circle"
            >
              {/* Document Icon */}
              <svg
                width="8"
                height="9"
                viewBox="0 0 8 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.55997 1.31647L5.7115 0.468004C5.5635 0.319195 5.38747 0.201212 5.19358 0.120881C4.99968 0.0405496 4.79179 -0.000534645 4.58191 5.25282e-06H1.59727C1.1738 0.000512499 0.767824 0.168958 0.468388 0.468394C0.168953 0.767829 0.000507246 1.1738 0 1.59727V7.34742C0.000507246 7.77089 0.168953 8.17687 0.468388 8.4763C0.767824 8.77574 1.1738 8.94418 1.59727 8.94469H5.4307C5.85417 8.94418 6.26014 8.77574 6.55958 8.4763C6.85901 8.17687 7.02746 7.77089 7.02797 7.34742V2.44606C7.02851 2.23618 6.98742 2.02829 6.90709 1.8344C6.82676 1.6405 6.70878 1.46447 6.55997 1.31647ZM6.10826 1.76818C6.15341 1.81358 6.19397 1.86334 6.22933 1.91672H5.4307C5.34598 1.91672 5.26472 1.88307 5.20481 1.82316C5.1449 1.76325 5.11125 1.68199 5.11125 1.59727V0.798638C5.16465 0.834103 5.2144 0.874766 5.25979 0.92003L6.10826 1.76818ZM5.4307 8.30578H1.59727C1.34309 8.30578 1.09933 8.20481 0.919603 8.02509C0.739876 7.84536 0.638906 7.6016 0.638906 7.34742V1.59727C0.638906 1.3431 0.739876 1.09934 0.919603 0.919608C1.09933 0.739881 1.34309 0.638911 1.59727 0.638911H4.47234V1.59727C4.47234 1.85144 4.57331 2.09521 4.75304 2.27493C4.93277 2.45466 5.17653 2.55563 5.4307 2.55563H6.38906V7.34742C6.38906 7.6016 6.28809 7.84536 6.10836 8.02509C5.92864 8.20481 5.68487 8.30578 5.4307 8.30578Z"
                  fill="white"
                />
                <path
                  d="M1.91662 2.87523H3.19443C3.27916 2.87523 3.36041 2.84158 3.42032 2.78167C3.48023 2.72176 3.51389 2.64051 3.51389 2.55578C3.51389 2.47106 3.48023 2.3898 3.42032 2.32989C3.36041 2.26998 3.27916 2.23633 3.19443 2.23633H1.91662C1.8319 2.23633 1.75064 2.26998 1.69073 2.32989C1.63082 2.3898 1.59717 2.47106 1.59717 2.55578C1.59717 2.64051 1.63082 2.72176 1.69073 2.78167C1.75064 2.84158 1.8319 2.87523 1.91662 2.87523Z"
                  fill="white"
                />
                <path
                  d="M5.11115 3.51392H1.91662C1.8319 3.51392 1.75064 3.54757 1.69073 3.60748C1.63082 3.66739 1.59717 3.74864 1.59717 3.83337C1.59717 3.91809 1.63082 3.99935 1.69073 4.05926C1.75064 4.11917 1.8319 4.15282 1.91662 4.15282H5.11115C5.19588 4.15282 5.27713 4.11917 5.33704 4.05926C5.39695 3.99935 5.4306 3.91809 5.4306 3.83337C5.4306 3.74864 5.39695 3.66739 5.33704 3.60748C5.27713 3.54757 5.19588 3.51392 5.11115 3.51392Z"
                  fill="white"
                />
                <path
                  d="M5.11115 4.79175H1.91662C1.8319 4.79175 1.75064 4.8254 1.69073 4.88531C1.63082 4.94522 1.59717 5.02648 1.59717 5.1112C1.59717 5.19593 1.63082 5.27718 1.69073 5.33709C1.75064 5.397 1.8319 5.43065 1.91662 5.43065H5.11115C5.19588 5.43065 5.27713 5.397 5.33704 5.33709C5.39695 5.27718 5.4306 5.19593 5.4306 5.1112C5.4306 5.02648 5.39695 4.94522 5.33704 4.88531C5.27713 4.8254 5.19588 4.79175 5.11115 4.79175Z"
                  fill="white"
                />
                <path
                  d="M4.47225 6.06958H1.91662C1.8319 6.06958 1.75064 6.10324 1.69073 6.16315C1.63082 6.22305 1.59717 6.30431 1.59717 6.38903C1.59717 6.47376 1.63082 6.55501 1.69073 6.61492C1.75064 6.67483 1.8319 6.70849 1.91662 6.70849H4.47225C4.55697 6.70849 4.63822 6.67483 4.69813 6.61492C4.75804 6.55501 4.7917 6.47376 4.7917 6.38903C4.7917 6.30431 4.75804 6.22305 4.69813 6.16315C4.63822 6.10324 4.55697 6.06958 4.47225 6.06958Z"
                  fill="white"
                />
              </svg>
            </div>
            <span>{props?.status}</span>
          </button>
          <label>
            {props.createdBy._id !== clientId
              ? `Created by ${props.createdBy.fullName}`
              : ""}
          </label>
        </div>
        <p className="info">
          <label>{inviteDetails?.totalInvite}</label> candidates have been
          invited; <label>{inviteDetails?.appeared}</label> have appeared from
          which <label>{inviteDetails?.qualified}</label> is qualified
        </p>
        <div className="bottom-container">
          <ToggleButton
            name={props?.status}
            testDetails={props}
            status={props?.isActive}
            onClick={onClickToggle}
          />
          <div onClick={(e) => copyLink(e)} className="box">
            {/* Copy link Icon */}

            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1449 8.04901V11.764C11.1449 12.0924 11.0145 12.4074 10.7822 12.6396C10.55 12.8719 10.235 13.0023 9.90659 13.0023H3.09576C2.76733 13.0023 2.45235 12.8719 2.22012 12.6396C1.98789 12.4074 1.85742 12.0924 1.85742 11.764V4.95318C1.85742 4.62475 1.98789 4.30978 2.22012 4.07754C2.45235 3.84531 2.76733 3.71484 3.09576 3.71484H6.81075"
                stroke="#3B3A39"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.28711 1.85742H13.0021V5.57242"
                stroke="#3B3A39"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.19141 8.66825L13.0022 1.85742"
                stroke="#3B3A39"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>Copy Link</span>
          </div>
          <div className="box">
            {/* Clock Icon */}

            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_1918_1330)">
                <path
                  d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7.5 3.75V7.5L10 8.75"
                  stroke="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_1918_1330">
                  <rect width="15" height="15" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <span>
              {" "}
              {props.totalTiming !== "" ? props.totalTiming : 0} mins
            </span>
          </div>
          <div className="box">
            {/* Mail Icon */}
            <svg
              width="14"
              height="12"
              viewBox="0 0 14 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.25 1H12.25C12.9375 1 13.5 1.5625 13.5 2.25V9.75C13.5 10.4375 12.9375 11 12.25 11H2.25C1.5625 11 1 10.4375 1 9.75V2.25C1 1.5625 1.5625 1 2.25 1Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.5 2.25L7.25 6.625L1 2.25"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span>
              {props?.testType}
              {props?.testInviteOnly ? " - Invite Only" : ""}
            </span>
          </div>

          <div className="box">
            {/* Date Icon */}
            <svg
              width="13"
              height="14"
              viewBox="0 0 13 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 2.25H2.25C1.55964 2.25 1 2.80964 1 3.5V12.25C1 12.9404 1.55964 13.5 2.25 13.5H11C11.6904 13.5 12.25 12.9404 12.25 12.25V3.5C12.25 2.80964 11.6904 2.25 11 2.25Z"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9.125 1V3.5"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.125 1V3.5"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M1 6H12.25"
                stroke="black"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span>
              {" "}
              {startDate.getDate()} {monthNames[startDate.getMonth()]}{" "}
              {startDate.getFullYear()} -{" "}
              {endDate ? (
                <>
                  {endDate.getDate()} {monthNames[endDate.getMonth()]}{" "}
                  {endDate.getFullYear()}
                </>
              ) : (
                "NA"
              )}
            </span>
          </div>
        </div>
      </div>

      <div className="right-side">
        <div data-tip="Percentage of candidate qualified" className="header">
          <span>
            {isNaN(
              (inviteDetails?.qualified * 100) / inviteDetails?.totalInvite
            )
              ? 0
              : (
                  (inviteDetails?.qualified * 100) /
                  inviteDetails?.totalInvite
                ).toFixed(0)}
            %
          </span>
          <p>Candidates Qualified</p>
        </div>
        {props?.status !== "draft" ? (
          <div className="bottom-container">
            {props?.status === "published" && (
              <button onClick={(e) => onClickSendInvite(e, props._id)}>
                {/* Send Invites Icon */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_1496_2298)">
                    <path
                      d="M12.8334 1.16675L6.41675 7.58341"
                      stroke="#384455"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.8334 1.16675L8.75008 12.8334L6.41675 7.58342L1.16675 5.25008L12.8334 1.16675Z"
                      stroke="#384455"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_1496_2298">
                      <rect width="14" height="14" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>Send Invites</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `https://www.dev.theeliteqa.com/candidatetesttaken/${props._id}`,
                  "_blank"
                );
              }}
            >
              {/* View Reports Icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_1496_2295)">
                  <path
                    d="M0.619141 7.42845C0.619141 7.42845 3.09533 2.47607 7.42866 2.47607C11.762 2.47607 14.2382 7.42845 14.2382 7.42845C14.2382 7.42845 11.762 12.3808 7.42866 12.3808C3.09533 12.3808 0.619141 7.42845 0.619141 7.42845Z"
                    stroke="#3B3A39"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7.42868 9.28582C8.45435 9.28582 9.28582 8.45435 9.28582 7.42868C9.28582 6.403 8.45435 5.57153 7.42868 5.57153C6.403 5.57153 5.57153 6.403 5.57153 7.42868C5.57153 8.45435 6.403 9.28582 7.42868 9.28582Z"
                    stroke="#3B3A39"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1496_2295">
                    <rect width="14.8571" height="14.8571" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>View Results</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `https://www.assessment.theeliteqa.com/preview?testId=${props._id}`
                );
              }}
            >
              {/* Test Preview Icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1449 8.04901V11.764C11.1449 12.0924 11.0145 12.4074 10.7822 12.6396C10.55 12.8719 10.235 13.0023 9.90659 13.0023H3.09576C2.76733 13.0023 2.45235 12.8719 2.22012 12.6396C1.98789 12.4074 1.85742 12.0924 1.85742 11.764V4.95318C1.85742 4.62475 1.98789 4.30978 2.22012 4.07754C2.45235 3.84531 2.76733 3.71484 3.09576 3.71484H6.81075"
                  stroke="#3B3A39"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.28711 1.85742H13.0021V5.57242"
                  stroke="#3B3A39"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.19141 8.66825L13.0022 1.85742"
                  stroke="#3B3A39"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Test Preview</span>
            </button>
          </div>
        ) : (
          <div className="bottom-container">
            <button style={{ marginLeft: 100 }}>
              {/* edit Icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_2151_1949)">
                  <path
                    d="M6.41602 2.33301H2.33268C2.02326 2.33301 1.72652 2.45592 1.50772 2.67472C1.28893 2.89351 1.16602 3.19026 1.16602 3.49967V11.6663C1.16602 11.9758 1.28893 12.2725 1.50772 12.4913C1.72652 12.7101 2.02326 12.833 2.33268 12.833H10.4993C10.8088 12.833 11.1055 12.7101 11.3243 12.4913C11.5431 12.2725 11.666 11.9758 11.666 11.6663V7.58301"
                    stroke="#514D4D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.791 1.45814C11.0231 1.22608 11.3378 1.0957 11.666 1.0957C11.9942 1.0957 12.309 1.22608 12.541 1.45814C12.7731 1.6902 12.9035 2.00495 12.9035 2.33314C12.9035 2.66133 12.7731 2.97608 12.541 3.20814L6.99935 8.74981L4.66602 9.33314L5.24935 6.99981L10.791 1.45814Z"
                    stroke="#514D4D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2151_1949">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Edit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
