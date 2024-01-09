import { React, useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TestSummaryContext from "../../store/TestSummaryContext";
import "./index.css";
import ToggleButton from "../ToggleButton";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { toast } from "react-toastify";

function AssessmentPreviewSideBar(props) {
  const [active, setactive] = useState("test overview");
  let navigate = useNavigate();
  const context = useContext(TestSummaryContext);
  const [published, setPublished] = useState(props?.testDetails?.isActive);

  const { id } = useParams();
  const onClickToggle = () => {
    if (props?.testDetails?.status !== "draft") {
      setPublished(!published);
      updateTestisActive(!published);
    } else {
      if (
        props?.testDetails.totalNoOfQuestions > 0 &&
        props?.testDetails.link !== ""
      ) {
        setPublished(!published);
        updateTestisActive(!published);
      } else {
        toast.error("test in draft mode...!");
      }
    }
  };

  const updateTestisActive = async (status) => {
    try {
      const token = getCookie("Xh7ERL0G");
      await axios.put(
        `${backend_url}test/updateStatusOfDraftTest/${props?.testDetails?._id}`,
        {
          isActive: status,
          status:
            props?.testDetails?.status !== "draft"
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="assessment-sidebar">
      <div className="assessment-sidebar-content-test-overview">
        <div
          className={
            props.active == "test overview" ? "test-active" : "test-notActive"
          }
          onClick={() => {
            navigate(
              `/assessmentOverview/${
                id !== undefined ? id : props.testDetails._id
              }`
            );
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_3190_3902)">
              <path
                d="M0.664062 8.00033C0.664062 8.00033 3.33073 2.66699 7.9974 2.66699C12.6641 2.66699 15.3307 8.00033 15.3307 8.00033C15.3307 8.00033 12.6641 13.3337 7.9974 13.3337C3.33073 13.3337 0.664062 8.00033 0.664062 8.00033Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_3190_3902">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>Test Overview</span>
        </div>
        <div
          className={
            props?.active == "questions" ? "test-active" : "test-notActive"
          }
          onClick={() => {
            context.getCandidates(
              id !== undefined ? id : props.testDetails._id
            );
            navigate(
              `/assessmentquestion/${
                id !== undefined ? id : props.testDetails._id
              }`
            );
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_3190_3907)">
              <path
                d="M8.0026 14.6663C11.6845 14.6663 14.6693 11.6816 14.6693 7.99967C14.6693 4.31778 11.6845 1.33301 8.0026 1.33301C4.32071 1.33301 1.33594 4.31778 1.33594 7.99967C1.33594 11.6816 4.32071 14.6663 8.0026 14.6663Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.0625 6.00038C6.21924 5.55482 6.5286 5.17912 6.9358 4.9398C7.343 4.70049 7.82176 4.61301 8.28728 4.69285C8.7528 4.7727 9.17504 5.01473 9.47922 5.37606C9.78339 5.7374 9.94987 6.19473 9.94917 6.66705C9.94917 8.00038 7.94917 8.66705 7.94917 8.66705"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 11.333H8.00727"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_3190_3907">
                <rect width="16" height="16" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span>Questions</span>
        </div>
        <div
          className={
            props.active == "candidates" ? "test-active" : "test-notActive"
          }
          onClick={() => {
            context.getCandidates(
              id !== undefined ? id : props.testDetails._id
            );
            navigate(
              `/candidatetesttaken/${
                id !== undefined ? id : props.testDetails._id
              }`
            );
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.3307 13.333V11.9997C13.3307 11.2924 13.0498 10.6142 12.5497 10.1141C12.0496 9.61396 11.3713 9.33301 10.6641 9.33301H5.33073C4.62349 9.33301 3.94521 9.61396 3.44511 10.1141C2.94501 10.6142 2.66406 11.2924 2.66406 11.9997V13.333"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M8.0026 6.66634C9.47536 6.66634 10.6693 5.47243 10.6693 3.99967C10.6693 2.52692 9.47536 1.33301 8.0026 1.33301C6.52984 1.33301 5.33594 2.52692 5.33594 3.99967C5.33594 5.47243 6.52984 6.66634 8.0026 6.66634Z"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Candidates</span>
        </div>
        <div
          className={
            props.active == "analytics" ? "test-active" : "test-notActive"
          }
          onClick={() => {
            navigate(`/testanalytics/${id}`);
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 13.3337V6.66699"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 13.3337V2.66699"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M4 13.3337V10.667"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>Analytics</span>
        </div>
        <div
          className={
            props.active == "delete" ? "test-active" : "test-notActive"
          }
          onClick={() => {
            navigate(`/testanalytics/${id}`);
          }}
        >
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            color="#ffffff"
          >
            <path
              d="M20 9l-1.995 11.346A2 2 0 0116.035 22h-8.07a2 2 0 01-1.97-1.654L4 9M21 6h-5.625M3 6h5.625m0 0V4a2 2 0 012-2h2.75a2 2 0 012 2v2m-6.75 0h6.75"
              stroke="#ffffff"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
          <span>Delete Assessment</span>
        </div>
        <div className="unpublish-test">
          <span>
            {props?.testDetails?.status !== "draft"
              ? published
                ? "Unpublish Test?"
                : "Publish Test?"
              : published
              ? "Unpublish Test?"
              : "Publish Test?"}{" "}
          </span>
          <p>
            Do you want to{" "}
            {props?.testDetails?.status !== "draft"
              ? published
                ? "unpublish"
                : "publish"
              : published
              ? "unpublish "
              : "publish "}{" "}
            the {props?.testName || context.test?.name}?
          </p>

          {/* <div className="unpublish-btn">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clip-path="url(#clip0_3190_3930)">
                                <path d="M7.5 13.75C10.9518 13.75 13.75 10.9518 13.75 7.5C13.75 4.04822 10.9518 1.25 7.5 1.25C4.04822 1.25 1.25 4.04822 1.25 7.5C1.25 10.9518 4.04822 13.75 7.5 13.75Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9.375 5.625L5.625 9.375" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.625 5.625L9.375 9.375" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_3190_3930">
                                    <rect width="15" height="15" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        <span>Unpublish</span>
                    </div> */}
          <div
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginTop: "20px",
            }}
          >
            <ToggleButton
              name={props?.testDetails?.status}
              testDetails={props?.testDetails}
              status={published}
              onClick={onClickToggle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentPreviewSideBar;
