import React, { useContext } from 'react';
import axios from 'axios';
import { backend_url,getCookie } from '../../constant';
import { toast } from 'react-toastify'
import CreateTest1Sidebar from '../../component/CreateTest1Sidebar';
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import './index.css';
import './rich-editor.css'
import { Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, useRef, useEffect, forwardRef } from 'react';
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale, getDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from 'date-fns/locale';
import CreateTestContext from '../../store/CreateTestContext'
import ChangeJobRoleValue from '../../component/ChangeJobRoleValue';
registerLocale('enGB', enGB)
setDefaultLocale('enGB');
getDefaultLocale('enGB')
let cancelToken;

function CreateTest1() {
    const createTestContext = useContext(CreateTestContext)
    const navigate = useNavigate();
    let className = 'RichEditor-editor';
    const editor = useRef(null);
    const [skillSearchText, setskillSearchText] = useState("")
    const [searchSkillData, setsearchSkillData] = useState([])
    const [jobRoleData, setJobRoleData] = useState([])
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [suggestedSkill, setsuggestedSkill] = useState([])
    const [closesearchSkillModel, setclosesearchSkillModel] = useState(true)
    const [onClickedNext, setonClickedNext] = useState(false)
    const [suggestedError, setsuggestedError] = useState(false)
    const [changeJobrole,setchangeJobrole]=useState(false)
    const [changeJobroleConfirm,setchangeJobroleConfirm]=useState(false)
    const [selectedValue,setselectedValue]=useState('')
    const startDate = useRef(null)
    const endDate = useRef(null)
    

    const focus = () => {
        if (editor.current) editor.current.focus();
    };


    useEffect(() => {
        getJobROle()

    }, [])

    const handleSearchChange = async (e) => {
        onChangeSearchSkillText(e.target.value)
        const value = e.target.value;
        if (cancelToken) {
            cancelToken.cancel("Operations cancelled due to new request");
        }
        cancelToken = axios.CancelToken.source();
        let results;
        let token = getCookie("Xh7ERL0G")
        try {
            results = await axios.get(`${backend_url}skill/search?page=1&limit=5&searchText=${value}`, {
                cancelToken: cancelToken.token,
                headers: { "token": token },
            });
        } catch (error) {
            console.log(error);
        }
        setSkillData(results.data.data)
    };

    const setSkillData = (data) => {
        let filterSource = createTestContext.skills.map((data) => { return data.skills })
        const res = data.filter(item => !filterSource.includes(item.skills))
        setsearchSkillData(res)
    }

    const onChangeSearchSkillText = (text) => {
        setclosesearchSkillModel(true)
        setskillSearchText(text)
    }

    const addSuggestedSkill = (skillName) => {
        if (!createTestContext.skills.includes(skillName.skillId.skills)) {
            if (createTestContext.skills.length < 5) {
                setsuggestedError(false)
                createTestContext.setSkillsByJobRole(skillName.skillId.skills)
                suggestedSkill.forEach(data => {
                    if (data.skillId.skills === skillName.skillId.skills) {
                        data.isAdded = true
                    }
                })
            } else {
                setsuggestedError(true)
            }
        } else {
            toast("You have added already that skill", {
                className: 'toast-message'
            })
        }
    }

    const handleKeyCommand = useCallback(
        (command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                createTestContext.setTestDescription(newState);
                return 'handled';
            }
            return 'not-handled';
        },
        [createTestContext.testDescription, createTestContext.setTestDescription],
    );

    const mapKeyToEditorCommand = useCallback(
        e => {
            switch (e.keyCode) {

                case 9: // TAB
                    const newEditorState = RichUtils.onTab(
                        e,
                        createTestContext.testDescription,
                        4 /* maxDepth */,
                    );
                    if (newEditorState !== createTestContext.testDescription) {
                        createTestContext.setTestDescription(newEditorState);
                    }
                    return null;
            }
            return getDefaultKeyBinding(e);
        },
        [createTestContext.testDescription, createTestContext.setTestDescription],
    );


    const styleMap = {
        CODE: {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
            fontSize: 16,
            padding: 2,
        },
    };

    function getBlockStyle(block) {
        switch (block.getType()) {
            case 'blockquote':
                return 'RichEditor-blockquote';
            default:
                return null;
        }
    }

    const INLINE_STYLES = [
        { label: 'Bold', style: 'BOLD' },
        { label: 'Italic', style: 'ITALIC' },
        { label: 'Underline', style: 'UNDERLINE' },
        { label: 'Monospace', style: 'CODE' },
    ];


    function InlineStyleControls({ editorState, onToggle }) {
        const currentStyle = editorState.getCurrentInlineStyle();
        return (
            <div className="RichEditor-controls">
                {INLINE_STYLES.map(type => (
                    <StyleButton
                        key={type.label}
                        active={currentStyle.has(type.style)}
                        label={type.label}
                        onToggle={onToggle}
                        style={type.style}
                    />
                ))}
            </div>
        );
    }


    function StyleButton({ onToggle, active, label, style }) {
        let className = 'RichEditor-styleButton';
        if (active) {
            className += ' RichEditor-activeButton';
        }

        return (
            <span
                className={className}
                onMouseDown={e => {
                    e.preventDefault();
                    onToggle(style);
                }}>
                {label}
            </span>
        );
    }

    const BLOCK_TYPES = [
        { label: 'H1', style: 'header-one' },
        { label: 'H2', style: 'header-two' },
        { label: 'H3', style: 'header-three' },
        { label: 'H4', style: 'header-four' },
        { label: 'H5', style: 'header-five' },
        { label: 'H6', style: 'header-six' },
        { label: 'Blockquote', style: 'blockquote' },
        { label: 'UL', style: 'unordered-list-item' },
        { label: 'OL', style: 'ordered-list-item' },
        { label: 'Code Block', style: 'code-block' },
    ];

    function BlockStyleControls({ editorState, onToggle }) {
        const selection = editorState.getSelection();
        const blockType = editorState
            .getCurrentContent()
            .getBlockForKey(selection.getStartKey())
            .getType();

        return (
            <div className="RichEditor-controls">
                {BLOCK_TYPES.map(type => (
                    <StyleButton
                        key={type.label}
                        active={type.style === blockType}
                        label={type.label}
                        onToggle={onToggle}
                        style={type.style}
                    />
                ))}
            </div>
        );
    }

    const searchSkill = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get(`${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`, { headers: { "token": token } })
            setsearchSkillData(res.data.data)
            setclosesearchSkillModel(true)
        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const getJobROle = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get("https://api.theeliteqa.com/api/jobrole/getroleTable", { headers: { "token": token } })
            res.data.roleTables.forEach((data) => {
                if (data._id === createTestContext.jobRole) {
                    createTestContext.setTestHeading(data.jobrole + ' test')
                    createTestContext.setTestDescription(EditorState.createWithContent(
                        ContentState.createFromText(data.jobrole + ' description')
                    ))
                }
            })
            setJobRoleData(res.data.roleTables)

        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const addSearchedSkill = (skillName) => {
        if (!createTestContext.skills.includes(skillName)) {
            if (createTestContext.skills.length < 5) {
                setsuggestedError(false)
                createTestContext.setSkillsByJobRole(skillName)
                setclosesearchSkillModel(false)
            } else {
                setsuggestedError(true)
            }
        } else {
            toast("You have added already that skill", {
                className: 'toast-message'
            })
        }
    }

    const removeSkill = (skillId) => {
        suggestedSkill.forEach(data => {
            if (data.skillId.skills === skillId.skills) {
                data.isAdded = false
                setsuggestedError(false)
            }
        })
        const filterSkillData = createTestContext.skills.filter(element => element.skills !== skillId.skills)
        createTestContext.setskills(filterSkillData)
        toast("skill is removed...")
    }

    const userChangeJobRole=(e)=>{
        setchangeJobrole(true)
        setselectedValue(e.target.value)
    }

    const changeJobRole = (e) => {
        createTestContext.setjobRole(e)
        if (e.target.value !== "") {
            setsuggestedSkill([])
            getSkillByJobRole(e)
        }
    }

    const getSkillByJobRole = async (id) => {
        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get(`${backend_url}jobrole/getroleTable/${id}`, { headers: { "token": token } })
            res.data.roleTableSpec.skills.forEach(element => {
                element.isAdded = false
                setsuggestedSkill(prev => [...prev, element])
            });
        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const navigateToNextPage=(e)=>{
        e.stopPropagation()
        setonClickedNext(true)
        if(createTestContext.testHeading === ""){
            toast.error("Please add some value in test heading!")
        }else if(createTestContext.testDescription === ""){
            toast.error("Please add some value in test description!")
        }else if (createTestContext.testCreationType === 'Auto Test' && !(createTestContext.testCreationTypeDetails.includes('EliteQA Library') || createTestContext.testCreationTypeDetails.includes('My Library'))) {
            toast.error("Please select atleast one library!")
        } else if (createTestContext.experience === "") {
            toast.error("Please select experience!")
        } else if (createTestContext.jobRole === "") {
            toast.error("Please select jobrole!")
        } else if (createTestContext.skills.length === 0) {
            toast.error("Please add skill!")
        } else if (createTestContext.skills.length > 5) {
            toast.error("Please add skill less than 5!")
        } else {
            navigate("/testsummary")
        }
    }

    // const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    //     value === null?
    //     <button style={{ backgroundColor: "white", border: "none", outline: "none", cursor: "pointer", width: "100%", height: "40px", textAlign: "left", position: "relative" }} className="example-custom-input" onClick={onClick} ref={ref}>
    //         Select date
    //     </button>:
    //     <button style={{ backgroundColor: "white", border: "none", outline: "none", cursor: "pointer", width: "100%", height: "40px", textAlign: "left", position: "relative" }} className="example-custom-input" onClick={onClick} ref={ref}>
    //     {value}
    //     </button>
    // ));

    return (
        <div className="create-test-1-container">
            <NavigationBar saveAsDraft={true} assessment2={true} />
            {changeJobrole?<ChangeJobRoleValue cancelButton={()=>setchangeJobrole(false)} yesButton={()=>{setchangeJobrole(false);changeJobRole(selectedValue)}} />:<></>

            }
            <div className="create-test-1">
                <div className="left">
                    <CreateTest1Sidebar />
                </div>

                <div className="right">
                    <div className="test-1-container">
                        <div className="col">
                            <div className="header">
                                <div className="title">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                        <g clip-path="url(#clip0_1897_1286)">
                                            <path d="M33.444 16.833H15.5551C15.2162 16.833 14.8912 16.9676 14.6516 17.2073C14.412 17.4469 14.2773 17.7719 14.2773 18.1108V30.8886C14.2773 31.2275 14.412 31.5525 14.6516 31.7921C14.8912 32.0317 15.2162 32.1663 15.5551 32.1663H33.444C33.7829 32.1663 34.1079 32.0317 34.3475 31.7921C34.5872 31.5525 34.7218 31.2275 34.7218 30.8886V18.1108C34.7218 17.7719 34.5872 17.4469 34.3475 17.2073C34.1079 16.9676 33.7829 16.833 33.444 16.833ZM33.444 30.8886H15.5551V18.1108H33.444V30.8886Z" fill="#00C49A" />
                                            <path d="M18.7502 21.9448H30.2502C30.4197 21.9448 30.5822 21.8775 30.702 21.7576C30.8218 21.6378 30.8891 21.4753 30.8891 21.3059C30.8891 21.1364 30.8218 20.9739 30.702 20.8541C30.5822 20.7343 30.4197 20.667 30.2502 20.667H18.7502C18.5808 20.667 18.4183 20.7343 18.2985 20.8541C18.1786 20.9739 18.1113 21.1364 18.1113 21.3059C18.1113 21.4753 18.1786 21.6378 18.2985 21.7576C18.4183 21.8775 18.5808 21.9448 18.7502 21.9448Z" fill="#00C49A" />
                                            <path d="M18.7502 24.5004H30.2502C30.4197 24.5004 30.5822 24.4331 30.702 24.3133C30.8218 24.1935 30.8891 24.031 30.8891 23.8615C30.8891 23.6921 30.8218 23.5296 30.702 23.4098C30.5822 23.29 30.4197 23.2227 30.2502 23.2227H18.7502C18.5808 23.2227 18.4183 23.29 18.2985 23.4098C18.1786 23.5296 18.1113 23.6921 18.1113 23.8615C18.1113 24.031 18.1786 24.1935 18.2985 24.3133C18.4183 24.4331 18.5808 24.5004 18.7502 24.5004Z" fill="#00C49A" />
                                            <path d="M18.7502 27.0551H25.1391C25.3085 27.0551 25.4711 26.9878 25.5909 26.868C25.7107 26.7482 25.778 26.5857 25.778 26.4162C25.778 26.2468 25.7107 26.0843 25.5909 25.9645C25.4711 25.8447 25.3085 25.7773 25.1391 25.7773H18.7502C18.5808 25.7773 18.4183 25.8447 18.2985 25.9645C18.1786 26.0843 18.1113 26.2468 18.1113 26.4162C18.1113 26.5857 18.1786 26.7482 18.2985 26.868C18.4183 26.9878 18.5808 27.0551 18.7502 27.0551Z" fill="#00C49A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1897_1286">
                                                <rect width="23" height="23" fill="white" transform="translate(13 13)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div className="group">
                                        <span>Test Basics</span>
                                        <p>Basic details include all important small details</p>
                                    </div>
                                </div>

                                <div className="next-button" onClick={navigateToNextPage}>

                                    <span>Next</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="white" />
                                        <path d="M8 15.2661L14 10.613L8 5.95996" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="header-bar"></div>
                        </div>

                        <div className="content">
                            <div className="left">
                                <div className="test-heading">
                                    <span>Test Heading <label>*</label></span>
                                    <input value={createTestContext.testHeading} onChange={(e) => createTestContext.setTestHeading(e.target.value)} type="text" placeholder='Enter Test Heading' />
                                    <div style={{color:'red'}} className='error-header'>{(onClickedNext && createTestContext.testHeading === "" ) && 'Please add some value in test heading!'}</div>
                                </div>

                                <div className="test-description-2" >
                                    <label>Test Description <span>*</span> </label>
                                    <div className="RichEditor-root-2" style={{ width: "100%" }}>
                                        <BlockStyleControls
                                            editorState={createTestContext.testDescription}
                                            onToggle={blockType => {
                                                const newState = RichUtils.toggleBlockType(editorState, blockType);
                                                createTestContext.setTestDescription(newState);
                                            }}
                                        />
                                        <InlineStyleControls
                                            editorState={createTestContext.testDescription}
                                            onToggle={inlineStyle => {
                                                const newState = RichUtils.toggleInlineStyle(
                                                    editorState,
                                                    inlineStyle,
                                                );
                                                createTestContext.setTestDescription(newState);
                                            }}
                                        />
                                        <div className={className} onClick={focus}>
                                            <Editor
                                                blockStyleFn={getBlockStyle}
                                                customStyleMap={styleMap}
                                                editorState={createTestContext.testDescription}
                                                handleKeyCommand={handleKeyCommand}
                                                keyBindingFn={mapKeyToEditorCommand}
                                                onChange={createTestContext.setTestDescription}
                                                placeholder="Enter problem statement..."
                                                ref={editor}
                                                spellCheck={true}
                                            />
                                        </div>

                                    </div>
                                    <div style={{color:'red'}} className='error-header'>{(onClickedNext && createTestContext.testDescription.getCurrentContent().getPlainText('\u0001') === "" ) && 'Please add some value in test description!'}</div>
                                
                                </div>
                            </div>

                            <div className="right-side">
                                <div className="time-container">
                                    <div className="time-box">
                                        <span  >Start On</span>
                                        <div className="box">
                                            <svg onClick={()=>{const startDatePicker = startDate.current;startDatePicker.setFocus(true);}} className='calender' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.099 3.33301H4.43229C3.51182 3.33301 2.76562 4.0792 2.76562 4.99967V16.6663C2.76562 17.5868 3.51182 18.333 4.43229 18.333H16.099C17.0194 18.333 17.7656 17.5868 17.7656 16.6663V4.99967C17.7656 4.0792 17.0194 3.33301 16.099 3.33301Z" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13.5977 1.66699V5.00033" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M6.93359 1.66699V5.00033" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M2.76562 8.33301H17.7656" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <DatePicker ref={startDate} placeholderText={'Select date'} locale={enGB} selected={createTestContext.startDate} dateFormat="dd/MM/yyyy" onChange={(date) => createTestContext.setStartDate(date)} >
                                            </DatePicker>

                                        </div>
                                    </div>

                                    <div className="time-box" style={{ width: "48%" }}>
                                        <span>Ends On</span>
                                        <div className="box">
                                            <svg onClick={()=>{const startDatePicker = endDate.current;startDatePicker.setFocus(true);}} className='calender' width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16.099 3.33301H4.43229C3.51182 3.33301 2.76562 4.0792 2.76562 4.99967V16.6663C2.76562 17.5868 3.51182 18.333 4.43229 18.333H16.099C17.0194 18.333 17.7656 17.5868 17.7656 16.6663V4.99967C17.7656 4.0792 17.0194 3.33301 16.099 3.33301Z" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13.5977 1.66699V5.00033" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M6.93359 1.66699V5.00033" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M2.76562 8.33301H17.7656" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>

                                            <DatePicker ref={endDate} placeholderText={'Select date'} locale={enGB} selected={createTestContext.endDate} dateFormat="dd/MM/yyyy" type="date" onChange={(date) => createTestContext.setEndDate(date)}  />

                                        </div>
                                    </div>
                                </div>

                                <div className="test-type">
                                    <div className="test-title">
                                        <span>Test Type <label>*</label> </span>
                                        <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2432_6385)">
                                                <path d="M8.01432 14.6663C11.6962 14.6663 14.681 11.6816 14.681 7.99967C14.681 4.31778 11.6962 1.33301 8.01432 1.33301C4.33242 1.33301 1.34766 4.31778 1.34766 7.99967C1.34766 11.6816 4.33242 14.6663 8.01432 14.6663Z" stroke="#384455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M8.01562 5.33301V7.99967" stroke="#384455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M8.01562 10.667H8.02146" stroke="#384455" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2432_6385">
                                                    <rect width="16" height="16" fill="white" transform="translate(0.015625)" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    </div>
                                    <div className='test-button'>
                                        <div className='temp'>
                                            <div onClick={() => { createTestContext.settestCreationType('Auto Test') }} className={createTestContext.testCreationType === 'Auto Test' ? "selected-test" : "unselected-test"}>
                                                <div className="auto-test">
                                                    <span>Auto Test</span>
                                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="0.375" width="20" height="20" rx="2" fill={createTestContext.testCreationType === 'Auto Test' ? "#FF6812" : "#999999"} />
                                                        <path d="M14.375 8L8.875 13.5L6.375 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                </div>

                                            </div>
                                            <div onClick={() => { createTestContext.settestCreationType('Custom Test') }} className={createTestContext.testCreationType === 'Custom Test' ? "selected-test" : "unselected-test"}>
                                                <div className="auto-test">
                                                    <span>Custom Test</span>
                                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="0.015625" width="20" height="20" rx="2" fill={createTestContext.testCreationType === 'Custom Test' ? "#FF6812" : "#999999"} />
                                                        <path d="M14.0156 8L8.51562 13.5L6.01562 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>

                                                </div>

                                            </div>
                                        </div>
                                        {createTestContext.testCreationType === 'Auto Test' ?
                                            <div className="library-type">
                                                <div className="library-btn">
                                                    {createTestContext.testCreationTypeDetails.includes('EliteQA Library') ? <svg onClick={() => { createTestContext.settestCreationTypeDetails('EliteQA Library') }} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect y="0.5" width="15" height="15" rx="2" fill="#00C49A" />
                                                        <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg> :
                                                        <svg onClick={() => { createTestContext.settestCreationTypeDetails('EliteQA Library') }} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="0.75" y="1.25" width="13.5" height="13.5" rx="1.25" stroke="#252424" stroke-width="1" />
                                                        </svg>}
                                                    <span>EliteQA Library</span>
                                                </div>
                                                <div className="library-btn">
                                                    {createTestContext.testCreationTypeDetails.includes('My Library') ? <svg onClick={() => { createTestContext.settestCreationTypeDetails('My Library') }} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect y="0.5" width="15" height="15" rx="2" fill="#00C49A" />
                                                        <path d="M12 5L6.5 10.5L4 8" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg> :
                                                        <svg onClick={() => { createTestContext.settestCreationTypeDetails('My Library') }} width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect x="0.75" y="1.25" width="13.5" height="13.5" rx="1.25" stroke="#252424" stroke-width="1" />
                                                        </svg>}
                                                    <span>My Library</span>
                                                </div>
                                            </div> : <></>
                                        }
                                        <div style={{color:'red'}} className='error-header'>{(onClickedNext && createTestContext.testCreationTypeDetails.length === 0 && createTestContext.testCreationType === 'Auto Test') && 'Please select at least one library!'}</div>
                
                                    </div>
                                 </div>
                                <div className="details">
                                    <div className="experience">
                                        <span>Experience <label>*</label> </span>
                                        <div className="select-box">
                                            <select value={createTestContext.experience} onChange={e => createTestContext.setexperience(e.target.value)} >
                                                <option value="">Select Experience</option>
                                                <option value="Freshers (Less Than 1 Year)">Freshers ( &lt;1 Year)</option>
                                                <option value="Juniors (1-3 years)">Juniors (1-3 years)</option>
                                                <option value="Mid-level (4-6 Years)">Mid-level (4-6 Years)</option>
                                                <option value="Seniors (More Than 6 Years)">Seniors ( &gt;6 Years)</option>
                                            </select>
                                            <svg className='vector-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div style={{color:'red'}} className='error-header' >{(onClickedNext && createTestContext.experience === '') && 'Please select exprience!'}</div>
                                    </div>
                                    <div className="job-role">
                                        <span>Job Role <label>*</label></span>
                                        <div className="select-box">
                                            <select value={createTestContext.jobRole} onChange={userChangeJobRole}  >
                                                <option value="">Select Role</option>
                                                {jobRoleData?.map((data, index) => {
                                                    return (<option key={index} value={data._id}>{data.jobrole}</option>)

                                                })}
                                            </select>
                                            <svg className='vector-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <div style={{color:'red'}} className='error-header' >{(onClickedNext && createTestContext.jobRole === '') && 'Please select job role!'}</div>
                                    </div>
                                </div>

                                <div className="skill-topics-container">
                                    <div className="skill-input-header-container" >
                                        <label>Skills <span>*</span></label>
                                        <div style={{ marginTop: 10 }} className="skill-list-item-container" >
                                        {createTestContext.skills?.map((data) => {
                                            return (
                                                <button>
                                                    <span >{data.skills}</span>
                                                    <svg onClick={() => removeSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                        <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                        <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                    </svg>

                                                </button>
                                            )
                                        })


                                        }
                                        </div>
                                        <div style={{color:'red'}} className='error-header' >{(onClickedNext && createTestContext.skills.length === 0) && 'Please select atleast one skill!'}</div>
                                        
                                        {/* <div className="inputbox-skill" >
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M4.375 4.375H4.38125" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <input onKeyDown={(e) => { if (e.key === "Enter") { searchSkill() } }} value={skillSearchText} onChange={handleSearchChange} placeholder="Search Skills" />
                                            {skillSearchText !== "" ?
                                                <svg className='search-svg' style={{ cursor: 'pointer', position: 'absolute', right: 40 }} onClick={() => { setskillSearchText(""); searchSkillData.length = 0 }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                                </svg> :
                                                <></>
                                            }
                                            <svg onClick={() => searchSkill()} style={{ cursor: "pointer" }} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clip-path="url(#clip0_2071_2845)">
                                                    <path d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M13.125 13.125L10.4062 10.4062" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2071_2845">
                                                        <rect width="15" height="15" fill="white" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                        </div> */}
                                        {/* {(skillSearchText !== "" && closesearchSkillModel) ?
                                            <div className="search-result-container" >
                                                {searchSkillData.length ?
                                                    <>
                                                        {searchSkillData.map((data) => {
                                                            return <div style={createTestContext.skills.find(obj => obj === data.skills) !== undefined ? { background: '#384455' } : {}} onClick={() => addSearchedSkill(data?.skills)} className="skill-item" >

                                                                <span style={createTestContext.skills.find(obj => obj === data.skills) !== undefined ? { color: "white" } : {}} >
                                                                    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <g clip-path="url(#clip0_5427_2844)">
                                                                            <path d="M8.57787 6.08717L5.59036 9.07467C5.51297 9.15216 5.42106 9.21362 5.3199 9.25556C5.21873 9.2975 5.11029 9.31908 5.00078 9.31908C4.89127 9.31908 4.78283 9.2975 4.68166 9.25556C4.5805 9.21362 4.48859 9.15216 4.4112 9.07467L0.832031 5.49967V1.33301H4.9987L8.57787 4.91217C8.73307 5.06831 8.82019 5.27952 8.82019 5.49967C8.82019 5.71983 8.73307 5.93104 8.57787 6.08717V6.08717Z" stroke={createTestContext.skills.find(obj => obj === data.skills) !== undefined ? "white" : "black"} stroke-linecap="round" stroke-linejoin="round" />
                                                                            <path d="M2.91797 3.41699H2.92214" stroke={createTestContext.skills.find(obj => obj === data.skills) !== undefined ? "white" : "black"} stroke-linecap="round" stroke-linejoin="round" />
                                                                        </g>
                                                                        <defs>
                                                                            <clipPath id="clip0_5427_2844">
                                                                                <rect width="10" height="10" fill="white" transform="translate(0 0.5)" />
                                                                            </clipPath>
                                                                        </defs>
                                                                    </svg>
                                                                    {data?.skills}
                                                                </span>
                                                                {createTestContext.skills.find(obj => obj === data.skills) !== undefined ?
                                                                    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <path d="M1 4.1L3.4 6.5L9.4 0.5" stroke="#F1F5F7" stroke-linecap="round" stroke-linejoin="round" />
                                                                    </svg> : <></>

                                                                }
                                                                

                                                            </div>
                                                        })

                                                        }
                                                    </>
                                                    : <div style={{ textAlign: 'center' }} >No data found...</div>

                                                }
                                            </div> : <></>
                                        } */}
                                        {/* <div style={{ color: 'red' }} >{(onClickedNext && createTestContext.skills.length === 0) && 'Please select atleast one skill!'}</div> */}
                                        {(createTestContext.skills.length || suggestedSkill.length) ?
                                            <div className='skill-suggested-skill-container' >
                                                {/* <div className='selected-skill-main-container' >
                                                    <label>Selected skill</label>
                                                    <div style={{ marginTop: 10 }} className="skill-list-item-container" >
                                                        {createTestContext.skills?.map((data) => {
                                                            return (
                                                                <button>
                                                                    <span >{data}</span>
                                                                    <svg onClick={() => removeSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                        <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                                        <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                                        <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                                    </svg>

                                                                </button>
                                                            )
                                                        })


                                                        }
                                                    </div>

                                                </div>
                                                
                                                <div className='border' ></div> */}
                                                {/* <div className='suggested-main-container' >
                                                    <label>Suggested skill</label>
                                                    <div style={{ marginTop: 10 }} className="suggested-skill-list-item-container" >
                                                        {suggestedSkill?.map((data) => {
                                                            if (data.isAdded === false) {
                                                                return (
                                                                    data.skillId !== null ?
                                                                        <button>
                                                                            <span >{data?.skillId?.skills}</span>
                                                                            <svg style={{ transform: 'rotate(45deg)' }} onClick={() => addSuggestedSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                                                <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                                                <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                                            </svg>

                                                                        </button> : <></>
                                                                )
                                                            }
                                                        })


                                                        }
                                                    </div>
                                                </div> */}

                                            </div> : <></>}
                                        {/* <div style={{ color: 'red' }} >{suggestedError && 'Please add skill less than 5!'}</div> */}





                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateTest1;