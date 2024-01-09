import { Grid, Typography } from "@mui/material";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import katex from "katex";
import "katex/dist/katex.min.css";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "./index.css";
import upload_icon from "../../assets/icon/upload.svg";
import UploadIdeal from "./UploadIdeal";
const file = [
    { name: 'Upload', icon: upload_icon, color: '#00C49A' },
    { name: 'Upload', icon: upload_icon, color: '#FF9736' },
    { name: 'Upload', icon: upload_icon, color: '#FF5D00' },
];
const domain = [
    { name: 'Time Limit (sec)', color: '#00C49A', limit: '200' },
    { name: 'Memory Limit (MB)', color: '#FF9736', limit: "256" },
    { name: 'Max Code Size (kb)', color: '#FF5D00', limit: '1024' },
];
const ProblemSolution = () => {
    const state = useLocation();
    const [selectedSkill, setSkillSelected] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [editorContent, setEditorContent] = useState("");
    const [questionEditorFocused, setQuestionEditorFocused] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setOpenModal] = useState(false);

    const closeModal = () => {
        setOpenModal(false);
    }
    const handleChange = (content) => {
        setEditorContent(content);
    };

    const handleEditorFocus = () => {
        setQuestionEditorFocused(true);
    };

    const handleEditorBlur = () => {
        setQuestionEditorFocused(false);
    };
    return (
        <>
            <Grid container mt={2} width={'100%'}>
                <Grid item md={6} pl={2} mt={2}>
                    <Typography className="que-type-tile">Domain Checker Settings</Typography>
                    <Grid container spacing={0} justifyContent={'space-between'} mt={1} width={'75%'}>
                        {domain.map((item) => (
                            <Grid item md={2} mt={1}>
                                <div className="dificulty-tile" style={{
                                    borderColor: '#DDD',
                                }}>
                                    <span>{item.limit}</span>
                                </div>
                                {/* <span>{item.name}</span> */}
                            </Grid>
                        ))}
                    </Grid>

                </Grid>
                <Grid item md={6} pl={3} mt={2}>
                    <Typography className="que-type-tile">Sample Details</Typography>
                    <Grid container spacing={0} justifyContent={'space-between'} mt={1} width={'75%'}>
                        {file.map((item) => (
                            <Grid item md={2} mt={1}>
                                <div onClick={()=>setOpenModal(true)} className="dificulty-tile" style={{
                                    borderColor: '#DDD',
                                }}>
                                    <img
                                        style={{ cursor: 'pointer', marginRight: '8px' }}
                                        src={item.icon}
                                        alt=""
                                    />
                                    <span>{item.name}</span>
                                </div>
                            </Grid>
                        ))}
                    </Grid>

                </Grid>

            </Grid>
            <Grid container mt={0} spacing={4} justifyContent={'space-between'} pl={2} pr={2}>
                <Grid item md={6} pl={3}>
                    <Typography className="que-type-tile">Problem</Typography>
                    <Grid mt={2}>
                        <SunEditor
                            setContents={editorContent}
                            onChange={handleChange}
                            // onImageUploadBefore={onImageUploadBefore}
                            // onVideoUploadBefore={onVideoUploadBefore}
                            height="190px"
                            setOptions={{
                                buttonList: [
                                    [
                                        "undo",
                                        "redo",
                                        "formatBlock",
                                        "paragraphStyle",
                                        "blockquote",
                                        "bold",
                                        "underline",
                                        "italic",
                                        "strike",
                                        "subscript",
                                        // "superscript",
                                        // "math",
                                        // "fontColor",
                                        // "hiliteColor",
                                        // "textStyle",
                                        // "removeFormat",
                                        // "outdent",
                                        // "indent",
                                        // "align",
                                        // "horizontalRule",
                                        // "list",
                                        // "lineHeight",
                                        // "table",
                                        // "image",
                                        // "fullScreen",
                                        // "showBlocks",
                                        // "preview",
                                    ],
                                ],
                                iframe: false,
                                tagsBlacklist:
                                    "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                pasteTagsBlacklist:
                                    "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                pasteTagsWhitelist: "p",
                                videoFileInput: true,
                                katex: katex,
                                tabDisable: true,
                            }}
                            onFocus={handleEditorFocus}
                            onBlur={handleEditorBlur}
                        />
                    </Grid>
                </Grid>
                <Grid item md={6}>
                    <Typography className="que-type-tile">Sample Explanation</Typography>
                    <Grid mt={2}>
                        <SunEditor
                            setContents={editorContent}
                            onChange={handleChange}
                            // onImageUploadBefore={onImageUploadBefore}
                            // onVideoUploadBefore={onVideoUploadBefore}
                            height="190px"
                            setOptions={{
                                buttonList: [
                                    [
                                        "undo",
                                        "redo",
                                        "formatBlock",
                                        "paragraphStyle",
                                        "blockquote",
                                        "bold",
                                        "underline",
                                        "italic",
                                        "strike",
                                        "subscript",
                                        // "superscript",
                                        // "math",
                                        // "fontColor",
                                        // "hiliteColor",
                                        // "textStyle",
                                        // "removeFormat",
                                        // "outdent",
                                        // "indent",
                                        // "align",
                                        // "horizontalRule",
                                        // "list",
                                        // "lineHeight",
                                        // "table",
                                        // "image",
                                        // "fullScreen",
                                        // "showBlocks",
                                        // "preview",
                                    ],
                                ],
                                iframe: false,
                                tagsBlacklist:
                                    "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                pasteTagsBlacklist:
                                    "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                pasteTagsWhitelist: "p",
                                videoFileInput: true,
                                katex: katex,
                                tabDisable: true,
                            }}
                            onFocus={handleEditorFocus}
                            onBlur={handleEditorBlur}
                        />

                        {/* <Grid container spacing={0} justifyContent={'space-between'} mt={1}>
                            <TextareaAutosize
                                value={`Case 1: Something here
                                    Case 2: Something here
                                    <script type="module" src="new_tab_page.js"></script>
                                    <link rel="stylesheet" href="chrome://resources/css/text_defaults_md.css">
                                    <link rel="stylesheet" href="shared_vars.css">`}
                                aria-label="Your Label"
                                minRows={4}
                                onFocus={handleTextareaFocus}
                                onBlur={handleTextareaBlur}
                                style={{
                                    width: '110%',
                                    borderColor: '#DDDDDD', // Set transparent border when focused
                                    borderWidth: '1px',
                                    padding: '8px',
                                    resize: 'none',
                                    height: '170px',
                                    outline: 'none'
                                }}
                            />
                        </Grid> */}
                    </Grid>
                </Grid>
                <UploadIdeal isOpen={isOpen} closeModal={closeModal} />
            </Grid>
        </>
    );
}

export default ProblemSolution;
