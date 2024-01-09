import React, { useState } from 'react'
import './index.css'
import AssessmentPreviewSideBar from '../../component/AssessmentOverviewSidebar'
import NavigationBar from '../../component/NavigationBar/NavigationBar'
import { useNavigate } from 'react-router-dom'
import QuestionCard from './QuestionCard'

function AssessmentEditQuestion() {
    const [mcq, setMcq] = useState(false)
    const [programming, setProgramming] = useState(false)
    const selected = [];
    const [selectedArr, setSetelctedArr] = useState([])
    const [selectedArrp, setSetelctedArrp] = useState([])
    const [dropvalue, setDropvalue] = useState("all")
    // const question = [{ title: "Javascript events", difficulty: "hard", type: "mcq" }, { title: "Javascript events", difficulty: "hard", type: "mcq" }, { title: "Javascript events", difficulty: "hard", type: "mcq" }]
    const arr = [1, 2, 3]
    let navigate = useNavigate();

    return (
        <div className="assessment-edit-question">
            <NavigationBar assessment={true} />
            <div className="assessment-edit-question-container">
                <div className="edit-question-left">
                    <AssessmentPreviewSideBar active={"questions"} />
                </div>
                <div className="edit-question-right">
                    <div className="edit-question-content">

                        <div className="col">
                            <div className="header">
                                <div className="title" onClick={() => {
                                    navigate("/assessmentquestion");
                                }}>
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 12.3955H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 19.3955L5 12.3955L12 5.39551" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <div className="group">
                                        <span>Edit Questions</span>
                                    </div>
                                </div>

                                <div className="button-container">
                                    <div className="next-button" style={{ backgroundColor: "#FF6812" }} onClick={() => {
                                        navigate("/choosefromlibrary");
                                    }}>
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.3955" r="10" fill="white" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.31091 6.39964C6.92633 6.39064 6.54154 6.40161 6.15811 6.43267C5.85899 6.42648 5.57028 6.54243 5.35866 6.75398C5.14703 6.96544 5.03081 7.25411 5.03684 7.55319C5.00576 7.93661 4.99474 8.32144 5.00379 8.70598V11.3958C5.00379 12.2604 4.94999 12.0034 5.2478 12.4437C5.406 12.6587 5.63916 12.8062 5.90106 12.8573C6.11623 12.8999 6.33497 12.9218 6.55431 12.9229C6.55892 13.0612 6.56353 13.198 6.57698 13.3159C6.57075 13.615 6.68678 13.9038 6.89826 14.1154C7.10974 14.3271 7.39838 14.4432 7.6975 14.4372C7.90192 14.4603 8.14823 14.4656 8.4203 14.468C8.43473 14.4692 8.44923 14.4697 8.46371 14.4693L12.6906 14.4692C13.0752 14.4782 13.46 14.4672 13.8434 14.4362C14.1425 14.4422 14.4312 14.3259 14.6427 14.1144C14.8541 13.9028 14.9702 13.614 14.9639 13.3149C14.9949 12.9315 15.006 12.5468 14.997 12.1621V11.3936C14.9971 11.3783 14.9964 11.363 14.9947 11.3479C14.9923 11.0766 14.987 10.8307 14.9639 10.6266C14.9701 10.3276 14.854 10.0389 14.6425 9.82726C14.4311 9.6157 14.1425 9.49947 13.8434 9.50538C13.7247 9.49196 13.5871 9.48774 13.448 9.48305C13.4556 9.45106 13.4591 9.41832 13.4584 9.38548C13.4658 9.07843 13.4426 8.77137 13.3892 8.46891C13.342 8.20454 13.1977 7.96747 12.9846 7.80414C12.5446 7.49681 12.7963 7.55103 11.9225 7.55103H10.9026C10.5235 7.57251 10.1438 7.52167 9.78367 7.40112C9.63149 7.3362 9.49899 7.23253 9.3994 7.10035C9.22044 6.88832 8.99525 6.72021 8.74115 6.60885C8.29198 6.44843 7.8158 6.37732 7.33935 6.39946H7.31245L7.31091 6.39964ZM7.31045 7.16811C7.69424 7.14653 8.07865 7.19738 8.44365 7.31793C8.59707 7.38238 8.73071 7.48633 8.83099 7.61917C9.00846 7.83063 9.23189 7.99874 9.48424 8.11066C9.93847 8.27381 10.4206 8.34511 10.9026 8.32043H11.9216C12.7947 8.32043 12.4627 8.37888 12.5422 8.43573C12.5806 8.46378 12.6045 8.48414 12.6367 8.63406C12.6762 8.88576 12.6936 9.14047 12.6886 9.39527C12.6886 9.42191 12.6913 9.44837 12.6967 9.47445H12.4385C12.0593 9.49602 11.6796 9.44518 11.3195 9.32472C11.1672 9.25961 11.0347 9.15567 10.9352 9.02339C10.7563 8.81137 10.5311 8.64316 10.277 8.5318C9.82735 8.37166 9.35083 8.30055 8.87403 8.3225H8.84712C8.46254 8.31359 8.07776 8.32475 7.69434 8.3559C7.39523 8.3497 7.1065 8.46566 6.89487 8.67721C6.68324 8.88867 6.56702 9.17734 6.57305 9.47642C6.54197 9.85984 6.53094 10.2446 6.54 10.6292V12.1544C6.38245 12.1516 6.22533 12.1368 6.07005 12.1101C5.92748 12.0775 5.91135 12.0572 5.8833 12.0156C5.8272 11.9326 5.77148 12.262 5.77148 11.3977V8.70789C5.77148 8.22868 5.77379 7.87519 5.79992 7.64234C5.82605 7.40949 5.87101 7.33031 5.90137 7.29992C5.93173 7.26952 6.01011 7.22571 6.24298 7.19963C6.47585 7.17355 6.83166 7.16811 7.31045 7.16811ZM8.84907 9.08949C9.23284 9.06801 9.61724 9.11876 9.98225 9.23932C10.1356 9.30358 10.2693 9.40743 10.3696 9.54009C10.547 9.75164 10.7705 9.91975 11.0229 10.0317C11.477 10.1952 11.9591 10.2666 12.4412 10.242L12.6917 10.2419C13.1709 10.2419 13.5248 10.2443 13.7573 10.2703C13.9898 10.2964 14.0693 10.3415 14.0997 10.3718C14.13 10.4021 14.1742 10.4805 14.2003 10.7133C14.2265 10.9462 14.2288 11.3001 14.2288 11.7789V12.1631C14.2288 12.642 14.2265 12.9966 14.2003 13.2291C14.1742 13.4615 14.13 13.5403 14.0997 13.5703C14.0693 13.6002 13.9901 13.6471 13.7573 13.6717C13.5244 13.6963 13.1709 13.6997 12.6917 13.6997H8.84907C8.36989 13.6997 8.01598 13.6974 7.7835 13.6717C7.55101 13.646 7.47147 13.6006 7.44112 13.5703C7.41077 13.54 7.36657 13.4612 7.34045 13.2291C7.31432 12.997 7.31201 12.6421 7.31201 12.1636V10.6266C7.31201 10.1477 7.31432 9.79348 7.34045 9.56138C7.36657 9.32928 7.41153 9.24935 7.4419 9.21858C7.47226 9.18781 7.55102 9.14438 7.78351 9.1183C8.01599 9.09221 8.37027 9.08949 8.84907 9.08949Z" fill="#FF6812" />
                                        </svg>

                                        <span>Choose From Library</span>

                                    </div>
                                    <div className="next-button" onClick={() => {
                                        navigate("/newquestion");
                                    }}>
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.3955" r="10" fill="white" />
                                            <path d="M10 6.89551V13.8955" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.5 10.3955H13.5" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <span>Create New Question</span>
                                    </div>

                                </div>
                            </div>

                            <div className="header-bar"></div>
                        </div>

                        <div className="topic-title">
                            <div className="topic-title-left">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7215 9.93967L8.94146 14.7197C8.81763 14.8436 8.67058 14.942 8.50871 15.0091C8.34685 15.0762 8.17335 15.1107 7.99812 15.1107C7.8229 15.1107 7.6494 15.0762 7.48754 15.0091C7.32567 14.942 7.17862 14.8436 7.05479 14.7197L1.32812 8.99967V2.33301H7.99479L13.7215 8.05967C13.9698 8.30949 14.1092 8.64743 14.1092 8.99967C14.1092 9.35192 13.9698 9.68986 13.7215 9.93967V9.93967Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.67188 5.66699H4.67813" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>Javascript Skillset</span>
                                <p>Total Score: 50</p>
                            </div>
                            <div className="topic-title-right">
                                <select name="" id="" onChange={(e) => { setDropvalue(e.target.value) }}>
                                    <option value="all">All</option>
                                    <option value="mcq">MCQ</option>
                                    <option value="programming">Programming</option>
                                </select>
                            </div>
                        </div>

                        {dropvalue == "all" || dropvalue == "mcq" ? <div className="question-cards">
                            <div className="question-card-title">
                                <div className="question-card-title-left">
                                    {mcq ? <svg onClick={() => { setMcq(false); setSetelctedArr([]) }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="15" height="15" rx="2" fill="#FF6812" />
                                        <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg> :
                                        <svg onClick={() => { setMcq(true); setSetelctedArr([1, 2, 3]) }} width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.5" y="1.30664" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                        </svg>}

                                    <span>MCQ (2)</span>
                                    <p>Total Score: 20</p>
                                </div>
                                {selectedArr.length + selectedArrp.length > 0 ? <div className="question-card-title-right">
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.875 3.75H3.125H13.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M6.25 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8.75 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <span>Remove Questions {selectedArr.length + selectedArrp.length}</span>
                                </div> : <></>}
                            </div>

                            <div className="detailed-question-card">

                                <QuestionCard title="Javascript events" difficulty="hard" arr={selectedArr} removeCheck={() => { setSetelctedArr(selectedArr => selectedArr.filter((data) => { return data != 1 })) }} selectCheck={() => { setSetelctedArr([...selectedArr, 1]); console.log(selectedArr) }} ptkey={1} />
                                <QuestionCard title="State Management" difficulty="easy" arr={selectedArr} removeCheck={() => { setSetelctedArr(selectedArr => selectedArr.filter((data) => { return data != 2 })) }} selectCheck={() => { setSetelctedArr([...selectedArr, 2]); console.log(selected) }} ptkey={2} />
                                <QuestionCard title="Database connectivity" difficulty="medium" arr={selectedArr} removeCheck={() => { setSetelctedArr(selectedArr => selectedArr.filter((data) => { return data != 3 })) }} selectCheck={() => { setSetelctedArr([...selectedArr, 3]);; console.log(selected) }} ptkey={3} />
                            </div>
                        </div> : <></>}

                        {/* programming question cards */}

                        {dropvalue == "programming" || dropvalue == "all" ? <div className="question-cards">
                            <div className="question-card-title">
                                <div className="question-card-title-left">
                                    {programming ? <svg onClick={() => { setProgramming(false); setSetelctedArrp([]) }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="15" height="15" rx="2" fill="#FF6812" />
                                        <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg> :
                                        <svg onClick={() => { setProgramming(true); setSetelctedArrp([...selectedArrp, 1]) }} width="20" height="20" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="0.5" y="1.30664" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                        </svg>}
                                    <span>Programming (3)</span>
                                    <p>Total Score: 30</p>
                                </div>
                            </div>

                            <div className="detailed-question-card">
                                <QuestionCard title="Javascript events" arr={selectedArrp} removeCheck={() => { setSetelctedArrp(selectedArrp => selectedArrp.filter((data) => { return data != 1 })) }} selectCheck={() => { setSetelctedArrp([...selectedArrp, 1]);; console.log(selected) }} ptkey={1} />
                            </div>
                        </div> : <></>}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AssessmentEditQuestion