import React, { useState, useEffect, memo } from "react";
import "./NavigationBar2.css";
import { Link, useNavigate } from "react-router-dom";
import defaultProfile from "../../assets/icon/profileDefaultIcon.svg";
import { getCookie } from "../../constant";

const NavigationBar2 = ({
  active,
  preview,
  backToLibrary,
  saveAsDraft,
  assessment2,
  testName,
  isOverview,
  testId,
}) => {
  const [profileImage, setprofileImage] = useState("");

  useEffect(() => {
    const profileURL = getCookie("Profile");
    setprofileImage(profileURL);
  }, []);

  const navigate = useNavigate();
  return (
    <nav className="navigation-bar2">
      <div className="row">
        {/*Logo */}
        <div className="row-left">
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect width="38" height="38" rx="2" fill="#2A2C2B" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.8139 27.0018C11.5423 26.5418 11.469 25.9913 11.6107 25.4763C11.7524 24.9613 12.097 24.5259 12.5657 24.2696L25.9068 16.7697C26.8866 16.2165 28.1285 16.5405 28.7131 17.5018C28.9847 17.9619 29.0581 18.5124 28.9164 19.0275C28.7747 19.5427 28.43 19.9782 27.9614 20.2347L14.6183 27.7333C14.3052 27.9094 13.9521 28.0019 13.5929 28.0018C12.8651 28.0055 12.1891 27.6255 11.8139 27.0018ZM10.2736 19.5015C10.0022 19.0415 9.92898 18.4911 10.0707 17.9762C10.2124 17.4612 10.5568 17.0257 11.0254 16.7693L24.3672 9.26998C25.3465 8.71647 26.5884 9.04025 27.1728 10.0015C27.4444 10.4615 27.5178 11.0121 27.3761 11.5272C27.2344 12.0423 26.8897 12.4779 26.4211 12.7343L13.0799 20.2336C12.767 20.4094 12.4141 20.5017 12.0552 20.5015C11.3264 20.5055 10.6494 20.1253 10.2736 19.5008V19.5015Z"
              fill="white"
            />
          </svg>
          <Link style={{ textDecoration: "none" }} to="/">
            <button>
              <span>
                {testName !== "" ? testName : "Mern stack developer test"}
              </span>
            </button>
          </Link>
        </div>

        <div className="row-right">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              isOverview
                ? navigate("/questionsoverview")
                : navigate(`/assessmentquestion/${testId}`);
            }}
            className="save-as-draft-button"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.6654 8H3.33203"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.9987 12.6663L3.33203 7.99967L7.9987 3.33301"
                stroke="black"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span>Back To Test</span>
          </div>

          <Link to="/notification">
            <div className="notification">
              {/* Notification Icon */}
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.4604 12.4093V7.91895C15.4062 4.94158 12.9772 2.5562 9.99924 2.5562C7.02132 2.5562 4.5923 4.94158 4.53804 7.91895L4.53815 12.4093C4.53903 13.0405 4.37097 13.6607 4.0514 14.2053L15.9481 14.2054C15.6283 13.6609 15.4599 13.0409 15.4604 12.4093ZM19.1019 16.0015H0.898068C0.577188 16.0015 0.280756 15.8304 0.120371 15.5525C-0.0401236 15.2746 -0.0401236 14.9323 0.120371 14.6544C0.280756 14.3765 0.577188 14.2054 0.898068 14.2054C1.89655 14.2118 2.71141 13.4078 2.71832 12.4092L2.71843 7.91889C2.7818 3.9426 6.02326 0.752441 9.99999 0.752441C13.9767 0.752441 17.2182 3.9426 17.2814 7.91889V12.4092C17.2845 12.8889 17.478 13.3475 17.8195 13.6844C18.1609 14.0213 18.6222 14.2088 19.1018 14.2054C19.4227 14.2054 19.7192 14.3765 19.8796 14.6544C20.0401 14.9322 20.0401 15.2746 19.8797 15.5525C19.7193 15.8303 19.4228 16.0015 19.1019 16.0015ZM12.3614 19.1454C11.8657 19.9778 10.9684 20.4879 9.99949 20.4879C9.03061 20.4879 8.13331 19.9778 7.63757 19.1454C7.4762 18.8661 7.47719 18.5217 7.63998 18.2431C7.80278 17.9646 8.1025 17.7948 8.42513 17.7983H11.5746C11.897 17.7952 12.1964 17.965 12.3591 18.2434C12.5217 18.522 12.5226 18.8662 12.3613 19.1454H12.3614Z"
                  fill="#333333"
                />
              </svg>

              <div className="notification-alert" />
            </div>
          </Link>
          {profileImage !== "" ? (
            <img
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/userprofile")}
              src={profileImage}
              alt=""
            />
          ) : (
            <img
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/userprofile")}
              src={defaultProfile}
              alt=""
            />
          )}

          {/* Dorp Down Icon */}
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 6.92308V3.46154C0 2.50566 0.337954 1.68977 1.01386 1.01386C1.68977 0.337954 2.50566 0 3.46154 0H11.5385C12.4943 0 13.3102 0.337954 13.9861 1.01386C14.662 1.68977 15 2.50566 15 3.46154V11.5385C15 12.4943 14.662 13.3102 13.9861 13.9861C13.3102 14.662 12.4943 15 11.5385 15H3.46154C2.50566 15 1.68977 14.662 1.01386 13.9861C0.337954 13.3102 0 12.4943 0 11.5385V6.92308Z"
              fill="#F1F5F7"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M8.26566 9.20199C8.15833 9.36052 7.97938 9.45545 7.78797 9.45545C7.59655 9.45545 7.4176 9.36052 7.31027 9.20199L5.00258 6.09181C4.883 5.91504 4.87089 5.68672 4.97089 5.49819C5.07097 5.30973 5.26682 5.19184 5.48021 5.19177H10.0957C10.3091 5.19184 10.505 5.30973 10.605 5.49819C10.7051 5.68672 10.6929 5.91504 10.5734 6.09181L8.26566 9.20199Z"
              fill="#809FB8"
            />
          </svg>
        </div>
      </div>
    </nav>
  );
};

export default memo(NavigationBar2);
