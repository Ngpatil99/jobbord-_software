import React, { useRef, useState } from "react";
import DatePicker from "react-datepicker";
import {
  registerLocale,
  setDefaultLocale,
  getDefaultLocale,
} from "react-datepicker";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";
import "./index.css";
import { toast } from "react-toastify";
registerLocale("enGB", enGB);
setDefaultLocale("enGB");
getDefaultLocale("enGB");

const EditTestDetailsModal = ({
  close,
  testDetails,
  updateTestDetailsOnPage,
}) => {
  const startDate = useRef(null);
  const endDate = useRef(null);

  const [testHeading, settestHeading] = useState(testDetails?.name);
  const [testTime, settestTime] = useState(testDetails?.totalTiming);
  const [testStartDate, settestStartDate] = useState(testDetails?.startDate);
  const [testEndDate, settestEndDate] = useState(testDetails?.endDate);
  const [testScore, settestScore] = useState(
    testDetails?.totalScore === null ? 0 : testDetails?.totalScore
  );
  const [testCutOff, settestCutOff] = useState(testDetails?.cutOff);
  const [testType, settestType] = useState(testDetails?.testType);
  const [testInviteOnly, settestInviteOnly] = useState(
    testDetails?.testInviteOnly === true ? "Yes" : "No"
  );
  const [isTestTime, setisTestTime] = useState(false);
  const [isTestCutOff, setisTestCutOff] = useState(false);
  const [isTestType, setisTestType] = useState(false);
  const [isTestHeading, setisTestHeading] = useState(false);
  const [isDateCorrect, setisDateCorrect] = useState(true);
  const [isEndDateCorrect, setisEndDateCorrect] = useState(true);

  const updateTestDetails = async () => {
    try {
      if (testHeading === "") {
        setisTestHeading(true);
      } else {
        setisTestHeading(false);
      }
      if (testTime === "" || testTime === "0" || parseInt(testTime) < 0) {
        setisTestTime(true);
      } else {
        setisTestTime(false);
      }
      if (
        testScore > 0
          ? testCutOff === "" ||
            testCutOff === "0" ||
            parseInt(testCutOff) < 0 ||
            testCutOff > testScore ||
            /^0+$|^0*-0+$/.test(testCutOff)
          : false
      ) {
        setisTestCutOff(true);
      } else {
        setisTestCutOff(false);
      }

      if (testType === "") {
        setisTestType(true);
      } else {
        setisTestType(false);
      }

      if (
        testEndDate !== null
          ? new Date(testStartDate) >= new Date(testEndDate)
          : false
      ) {
        setisDateCorrect(true);
      }

      if (testStartDate === null) {
        setisDateCorrect(false);
      }

      if (
        testEndDate !== null
          ? new Date(testEndDate).setHours(0, 0, 0, 0) <
            new Date(testStartDate).setHours(0, 0, 0, 0)
          : false
      ) {
        setisEndDateCorrect(true);
      } else if (testEndDate === null) {
        setisEndDateCorrect(true);
      }
      console.log(testEndDate);
      if (
        (testEndDate !== null
          ? new Date(testStartDate) <= new Date(testEndDate) ||
            new Date(testStartDate).setHours(0, 0, 0, 0) ===
              new Date(testEndDate).setHours(0, 0, 0, 0)
          : true) &&
        testStartDate !== null &&
        testHeading !== "" &&
        testTime !== "" &&
        testTime !== "0" &&
        parseInt(testTime) > 0 &&
        (testScore > 0
          ? testCutOff !== "" &&
            testCutOff !== "0" &&
            parseInt(testCutOff) > 0 &&
            testCutOff <= testScore &&
            !/^0+$|^0*-0+$/.test(testCutOff)
          : true) &&
        testType !== ""
      ) {
        const token = getCookie("Xh7ERL0G");
        const requestBody = {
          ...testDetails,
          name: testHeading,
          startDate: testStartDate,
          endDate: testEndDate,
          cutOff: testCutOff,
          totalTiming: testTime,
          totalScore: testScore,
          testType: testType,
          testInviteOnly: testInviteOnly === "Yes" ? true : false,
        };

        const url = `${backend_url}test/update/${testDetails._id}`;

        const config = {
          headers: { token: token },
        };

        const res = await axios.put(url, requestBody, config);
        updateTestDetailsOnPage(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeTestDuration = (e) => {
    settestTime(e.target.value.slice(0, 3));
    if (
      e.target.value === "" ||
      e.target.value === "0" ||
      parseInt(e.target.value) < 0 ||
      /^0+$|^0*-0+$/.test(e.target.value)
    ) {
      setisTestTime(true);
    } else {
      setisTestTime(false);
    }
  };

  const onChangeTestCutOffScore = (e) => {
    let value = parseInt(e.target.value);
    console.log(value);
    if (value > testScore || value <= 0) {
      if (value > testScore) {
        toast.warning("Cut off score should be less than total score");
      } else if (value <= 0) {
        toast.warning("Cut off score should be greater than zero");
      }
    } else {
      setisTestCutOff(false);
      settestCutOff(value);
    }
    // if (
    //   e.target.value === "" ||
    //   e.target.value == "0" ||
    //   parseInt(e.target.value) <= 0 ||
    //   testCutOff > testScore ||
    //   /^0+$|^0*-0+$/.test(e.target.value)
    // ) {
    //   setisTestCutOff(true);
    // } else {
    //   setisTestCutOff(false);
    // }
  };

  return (
    <div className="edit-test-details-modal-container">
      <div className="edit-test-details-modal">
        <div className="heading-of-edit-test-details">
          <span>Edit Test Details</span>

          {/* cancel icon */}
          <svg
            onClick={close}
            style={{ cursor: "pointer" }}
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.9863 13.6551L7.97706 8.65882L2.96898 13.6551C2.50802 14.1148 1.7605 14.1151 1.29925 13.6554C0.838013 13.1957 0.837725 12.4499 1.29853 11.99L6.3077 6.99369L1.29846 1.99628C0.850335 1.534 0.856676 0.798602 1.31287 0.34437C1.769 -0.110149 2.50622 -0.115324 2.96898 0.332296L7.97706 5.32856L12.9863 0.332296C13.4508 -0.103824 14.1786 -0.0928997 14.6298 0.35702C15.081 0.806652 15.0925 1.53256 14.6557 1.99628L9.64642 6.99369L14.6557 11.99C15.1041 12.4519 15.0982 13.1873 14.6423 13.6419C14.1866 14.0967 13.4493 14.1024 12.9862 13.6551H12.9863Z"
              fill="#99B2C6"
            />
          </svg>
        </div>

        <div className="border-of-edit-test-details"></div>

        <div className="test-heading-and-time-container">
          <div className="test-heading-container">
            <span>
              Test Heading <label style={{ color: "red" }}>*</label>{" "}
            </span>
            <input
              value={testHeading}
              onChange={(e) => settestHeading(e.target.value.slice(0, 100))}
              placeholder="test heading"
            />
            {testHeading === "" ? (
              <p style={{ color: "red", fontSize: 12, fontWeight: "normal" }}>
                Please enter test heading
              </p>
            ) : (
              <></>
            )}
          </div>

          <div className="test-time-container">
            <span>
              Test Time <label style={{ color: "red" }}>*</label>{" "}
            </span>
            <div className="time-input-box">
              <svg
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.9974 18.8356C14.5998 18.8356 18.3307 15.1047 18.3307 10.5023C18.3307 5.89991 14.5998 2.16895 9.9974 2.16895C5.39502 2.16895 1.66406 5.89991 1.66406 10.5023C1.66406 15.1047 5.39502 18.8356 9.9974 18.8356Z"
                  stroke="#333333"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10 5.50195V10.502L13.3333 12.1686"
                  stroke="#333333"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                type="number"
                onWheel={(e) => e.target.blur()}
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.keyCode === 190 ||
                    evt.keyCode === 110) &&
                  evt.preventDefault()
                }
                value={testTime}
                onChange={onChangeTestDuration}
                placeholder="Test time"
              />
              <span>mins</span>
            </div>
            {isTestTime && testTime === "" ? (
              <p style={{ color: "red", fontSize: 12, fontWeight: "normal" }}>
                Please enter test time
              </p>
            ) : (
              <></>
            )}
            {testTime === "0" ||
            parseInt(testTime) < 0 ||
            /^0+$|^0*-0+$/.test(testTime) ? (
              <p style={{ color: "red", fontSize: 12, fontWeight: "normal" }}>
                Test duration should be greater than zero.
              </p>
            ) : (
              <></>
            )}
          </div>
        </div>

        <div className="start-date-and-end-date-and-score-and-cutoff-score-container">
          <div className="start-and-end-date-container">
            <div className="start-date-container">
              <span>
                Starts On <span style={{ color: "red" }}>*</span>
              </span>
              <div className="box">
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const startDatePicker = startDate.current;
                    startDatePicker.setFocus(true);
                  }}
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.099 3.33301H4.43229C3.51182 3.33301 2.76562 4.0792 2.76562 4.99967V16.6663C2.76562 17.5868 3.51182 18.333 4.43229 18.333H16.099C17.0194 18.333 17.7656 17.5868 17.7656 16.6663V4.99967C17.7656 4.0792 17.0194 3.33301 16.099 3.33301Z"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.5977 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.93359 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.76562 8.33301H17.7656"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <DatePicker
                  selected={
                    testStartDate
                      ? new Date(testStartDate).setHours(0, 0, 0, 0)
                      : null
                  }
                  onChange={(date) => {
                    //validate and then save the date
                    if (new Date(testEndDate) < date) {
                      settestEndDate(date);
                    }
                    settestStartDate(date);
                  }}
                  minDate={new Date()}
                  className="start-date-picker"
                  ref={startDate}
                  placeholderText={"Start date"}
                  locale={enGB}
                  dateFormat="dd/MM/yyyy"
                  required
                />
              </div>
              {!isDateCorrect && (
                <p style={{ color: "red" }}>Please select valid start date</p>
              )}
            </div>

            <div className="start-date-container">
              <span>Ends On</span>
              <div className="box">
                <svg
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    const endDatePicker = endDate.current;
                    endDatePicker.setFocus(true);
                  }}
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M16.099 3.33301H4.43229C3.51182 3.33301 2.76562 4.0792 2.76562 4.99967V16.6663C2.76562 17.5868 3.51182 18.333 4.43229 18.333H16.099C17.0194 18.333 17.7656 17.5868 17.7656 16.6663V4.99967C17.7656 4.0792 17.0194 3.33301 16.099 3.33301Z"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.5977 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.93359 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.76562 8.33301H17.7656"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <DatePicker
                  selected={
                    testEndDate
                      ? new Date(testEndDate).setHours(0, 0, 0, 0)
                      : null
                  }
                  onChange={(date) => settestEndDate(date)}
                  minDate={new Date()}
                  className="start-date-picker"
                  ref={endDate}
                  placeholderText={"End date"}
                  locale={enGB}
                  dateFormat="dd/MM/yyyy"
                ></DatePicker>
              </div>
              {!isEndDateCorrect && (
                <p style={{ color: "red" }}>
                  End date should be greater than start date
                </p>
              )}
            </div>
          </div>

          <div className="test-and-cutoff-container">
            <div className="test-score-container">
              <span>Test Score</span>
              <input
                disabled={true}
                value={testScore}
                onChange={(e) => settestScore(e.target.value)}
                placeholder="Score"
              />
            </div>

            <div className="test-score-container">
              <span>
                Cutoff Score <label style={{ color: "red" }}>*</label>{" "}
              </span>
              <input
                onWheel={(e) => e.target.blur()}
                onKeyDown={(evt) =>
                  (evt.key === "e" ||
                    evt.keyCode === 190 ||
                    evt.keyCode === 110) &&
                  evt.preventDefault()
                }
                value={testCutOff}
                onChange={onChangeTestCutOffScore}
                placeholder="Cutoff score"
                type="number"
              />

              {testCutOff === "" || testCutOff === null ? (
                <p style={{ color: "red", fontSize: 12, fontWeight: "normal" }}>
                  Please enter cut off score
                </p>
              ) : (
                <></>
              )}
              {testScore > 0 ? (
                testCutOff === "0" ||
                parseInt(testCutOff) < 0 ||
                /^0+$|^0*-0+$/.test(testCutOff)
              ) : false ? (
                <p style={{ color: "red", fontSize: 12, fontWeight: "normal" }}>
                  Cut off score greater than zero.
                </p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>

        <div className="test-type-main-container">
          <div className="test-type">
            <span>
              Test Type <label style={{ color: "red" }}>*</label>{" "}
            </span>
            <div className="button-container">
              <div
                className={testType === "public" ? "active" : "not-active"}
                onClick={() => {
                  settestType("public");
                  setisTestType(false);
                }}
              >
                {testType === "public" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#00C49A"
                      stroke-width="2"
                    />
                    <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#AAAAAA"
                      stroke-width="2"
                    />
                  </svg>
                )}
                <span>Public</span>
              </div>
              <div
                className={testType === "private" ? "active" : "not-active"}
                onClick={() => {
                  settestType("private");
                  setisTestType(false);
                }}
              >
                {testType === "private" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#00C49A"
                      stroke-width="2"
                    />
                    <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#AAAAAA"
                      stroke-width="2"
                    />
                  </svg>
                )}
                <span>Private</span>
              </div>
            </div>
            {isTestType ? (
              <p
                style={{
                  color: "red",
                  fontSize: 12,
                  fontWeight: "normal",
                  marginTop: 10,
                }}
              >
                Please enter test type
              </p>
            ) : (
              <></>
            )}
          </div>
          <div className="test-type">
            <span>
              Invite Only <label style={{ color: "red" }}>*</label>
            </span>
            {/* <div onClick={() => createTestContext.settestInviteType(!createTestContext.testInviteType)} className="button-container">
                                            <div style={createTestContext.testInviteType ? { gap: "20px", borderColor: '#FF6812' } : { gap: "20px" }} className={createTestContext.testInviteType ? "active" : "not-active"}  >
                                                <span>Yes</span>
                                                {createTestContext.testInviteType ? <svg onClick={() => createTestContext.settestInviteType(false)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.498047" width="20" height="20" rx="2" fill="#FF6812" />
                                                    <path d="M14 8.49805L8.5 13.998L6 11.498" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg> : <svg onClick={() => createTestContext.settestInviteType(true)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.498047" width="20" height="20" rx="2" fill="#999999" />
                                                    <path d="M14 8.49805L8.5 13.998L6 11.498" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>}

                                            </div>
                                            
                                        </div> */}
            <div className="invite-only-container">
              <span className="yes-checkbox-container">
                {testInviteOnly === "Yes" ? (
                  <svg
                    onClick={() => settestInviteOnly("Yes")}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#00C49A"
                      stroke-width="2"
                    />
                    <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                  </svg>
                ) : (
                  <svg
                    onClick={() => settestInviteOnly("Yes")}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#AAAAAA"
                      stroke-width="2"
                    />
                  </svg>
                )}
                <label>Yes</label>
              </span>
              <span className="no-checkbox-container">
                {testInviteOnly === "No" ? (
                  <svg
                    onClick={() => settestInviteOnly("No")}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#00C49A"
                      stroke-width="2"
                    />
                    <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                  </svg>
                ) : (
                  <svg
                    onClick={() => settestInviteOnly("No")}
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="8"
                      fill="white"
                      stroke="#AAAAAA"
                      stroke-width="2"
                    />
                  </svg>
                )}
                <label>No</label>
              </span>
            </div>
          </div>
        </div>

        <div className="bottom-save-cancel-container">
          <div className="save-cancel-container">
            <button onClick={close}>
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9.5166" r="9" fill="white" />
                <path
                  d="M12.5 6.0166L5.5 13.0166"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.5 6.0166L12.5 13.0166"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Cancel</span>
            </button>
            <button onClick={() => updateTestDetails()}>
              <svg
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9.5166" r="9" fill="white" />
                <path
                  d="M11.9557 7.4248L7.3724 12.0081L5.28906 9.9248"
                  stroke="#00C49A"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span>Save</span>{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTestDetailsModal;
