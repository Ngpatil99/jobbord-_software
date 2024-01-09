import React from "react";
import "./index.css";
import { toast } from "react-toastify";

const DeleteSkillSetModel = (props) => {
  const truncateQuestionContent = (questionContent) => {
    if (questionContent?.length > 119) {
      return questionContent.substring(0, 119) + "...";
    }
    return questionContent;
  };
  return (
    <div className="delete-skillset-container-model">
      <div className="delete-skillset-type-box">
        <div className="header">
          <div onClick={() => props.closeButton()} className="title">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z"
                fill="#99B2C6"
              />
            </svg>
          </div>
        </div>

        <div className="content" style={{ marginTop: "10px" }}>
          <div className="icon">
            <svg
              width="51"
              height="50"
              viewBox="0 0 51 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="25.5" cy="25" r="25" fill="#FF6812" />
              <path d="M17.5 19.5H19.1667H32.5" fill="#FF6812" />
              <path
                d="M17.5 19.5H19.1667H32.5"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M30.8346 19.5003V31.167C30.8346 31.609 30.659 32.0329 30.3465 32.3455C30.0339 32.6581 29.61 32.8337 29.168 32.8337H20.8346C20.3926 32.8337 19.9687 32.6581 19.6561 32.3455C19.3436 32.0329 19.168 31.609 19.168 31.167V19.5003M21.668 19.5003V17.8337C21.668 17.3916 21.8436 16.9677 22.1561 16.6551C22.4687 16.3426 22.8926 16.167 23.3346 16.167H26.668C27.11 16.167 27.5339 16.3426 27.8465 16.6551C28.159 16.9677 28.3346 17.3916 28.3346 17.8337V19.5003"
                fill="#FF6812"
              />
              <path
                d="M30.8346 19.5003V31.167C30.8346 31.609 30.659 32.0329 30.3465 32.3455C30.0339 32.6581 29.61 32.8337 29.168 32.8337H20.8346C20.3926 32.8337 19.9687 32.6581 19.6561 32.3455C19.3436 32.0329 19.168 31.609 19.168 31.167V19.5003M21.668 19.5003V17.8337C21.668 17.3916 21.8436 16.9677 22.1561 16.6551C22.4687 16.3426 22.8926 16.167 23.3346 16.167H26.668C27.11 16.167 27.5339 16.3426 27.8465 16.6551C28.159 16.9677 28.3346 17.3916 28.3346 17.8337V19.5003"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M23.332 23.667V28.667"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M26.668 23.667V28.667"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div className="content-heading">
            {props.admin ? (
              <span>Do You Want To Delete This Admin</span>
            ) : (
              <>
                {props?.header ? (
                  <span>{props?.header}</span>
                ) : (
                  <span>
                    Do You Want To Delete{" "}
                    {props.multiple
                      ? `selected(${props.multiple})`
                      : `${
                          props?.skill?.skill === undefined
                            ? ""
                            : props?.skill?.skill
                        } `}
                    {props.problem
                      ? `${truncateQuestionContent(
                          props?.selectedQuestion?.question
                        )}`
                      : "SkillSet?"}
                    {props.multiple ? "s" : ""}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="button" style={{ marginTop: "30px" }}>
          <div onClick={() => props.onClickNo()} className="cancel-btn">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="white" />
              <path
                d="M12.5 5.5L5.5 12.5"
                stroke="#FF6812"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 5.5L12.5 12.5"
                stroke="#FF6812"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <button>No</button>
          </div>

          <div
            onClick={() => {
              props.onClickYes();
              // toast.success(`${props.admin ? "Admin" : props.problem ? "Question" : "Skillset"} deleted successfully.`);
            }}
            className="next-btn"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="white" />
              <path
                d="M14 6L7.125 12.875L4 9.75"
                stroke="#F23E3E"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <button>Yes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSkillSetModel;
