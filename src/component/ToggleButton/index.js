import { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { toast } from "react-toastify";
import "./index.css";

const ToggleButton = (props) => {
  const [checked, setchecked] = useState(false);
  useEffect(() => {
    setchecked(props?.name !== "draft" ? props.status : false);
  }, [props?.name]);

  const onChangeToggle = (e) => {
    const testEndDate = new Date(props?.testDetails?.startDate);
    testEndDate.setDate(testEndDate.getDate() + 14);
    // console.log(  props.testDetails.cutOff !== null  , (parseInt(props.testDetails.cutOff) > 0) , (props.testDetails.cutOff <= props.testDetails.totalScore) )
    if (
      props?.name !== "draft" &&
      (props?.testDetails?.totalScore > 0
        ? props.testDetails.cutOff !== null &&
          parseInt(props.testDetails.cutOff) > 0 &&
          props.testDetails.cutOff <= props.testDetails.totalScore
        : false)
    ) {
      let currentDate = new Date();
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );

      let endDate = props?.testDetails?.endDate;
      if (endDate !== undefined) {
        endDate = new Date(endDate);
        endDate = new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate()
        );
      }
      if (endDate === undefined || endDate >= currentDate) {
        setchecked(e.target.checked);
        props.onClick(e.target.checked, e);
        console.log("called");
        console.log(new Date(props?.testDetails?.endDate), new Date());
      } else {
        setchecked(false);
        if (
          props.testDetails.cutOff === "" ||
          props.testDetails.cutOff === null ||
          props.testDetails.cutOff === undefined
        ) {
          toast.error("please add cutoff score of the test");
        }
        if (
          props.testDetails.testType === "" ||
          props.testDetails.testType === null ||
          props.testDetails.testType === undefined
        ) {
          toast.error("please add test type of the test");
        }
        if (props.testDetails.totalNoOfQuestions === 0) {
          toast.error("please add some question in the test");
        }
        if (
          props.testDetails.totalTiming === "" ||
          props.testDetails.totalTiming === null ||
          props.testDetails.totalTiming === undefined
        ) {
          toast.error("please add time of the test");
        }
      }
    } else {
      if (
        props?.testDetails?.totalNoOfQuestions > 0 &&
        props?.testDetails?.link !== "" &&
        (props?.testDetails?.totalScore > 0
          ? props.testDetails.cutOff !== null &&
            parseInt(props.testDetails.cutOff) > 0 &&
            props.testDetails.cutOff <= props.testDetails.totalScore
          : false)
      ) {
        setchecked(e.target.checked);
        props.onClick(e.target.checked, e);
      } else {
        setchecked(false);
        if (
          props.testDetails.cutOff === "" ||
          props.testDetails.cutOff === null ||
          props.testDetails.cutOff === undefined
        ) {
          toast.error("please add cutoff score of the test");
        }
        if (
          props.testDetails.testType === "" ||
          props.testDetails.testType === null ||
          props.testDetails.testType === undefined
        ) {
          toast.error("please add test type of the test");
        }
        if (props.testDetails.totalNoOfQuestions === 0) {
          toast.error("please add some question in the test");
        }
        if (
          props.testDetails.totalTiming === "" ||
          props.testDetails.totalTiming === null ||
          props.testDetails.totalTiming === undefined
        ) {
          toast.error("please add time of the test");
        }
      }
    }
  };
  return (
    <>
      <label
        className="toggleSwitch"
        data-tip={
          props?.name === "draft" ? "Please publish your test" : `test off/on`
        }
        class="switch"
      >
        <input
          className="toggleSwitch"
          checked={checked}
          onChange={onChangeToggle}
          type="checkbox"
        />
        <span class="slider round"></span>
      </label>
      <ReactTooltip />
    </>
  );
};

export default ToggleButton;
