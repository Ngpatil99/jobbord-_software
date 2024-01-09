import React,{useState,useContext} from 'react'
import './index.css'
import NavigationBar from '../../component/NavigationBar/NavigationBar'
import AssessmentPreviewSideBar from '../../component/AssessmentOverviewSidebar'
import { useNavigate } from 'react-router-dom'
import TestSummaryContext from "../../store/TestSummaryContext"


function TestAnalytics() {
    let navigate = useNavigate()
    const context = useContext(TestSummaryContext)
    const [test, setTest] = useState(context.test)
    return (
        <div className="test-analytics">
            <NavigationBar assessment={false} />
            <div className="test-analytics-container">
                <div className="test-analytics-left">
                    <AssessmentPreviewSideBar testType={test?.status} testDetails={test}  testName={test?.name} active={"analytics"} />
                </div>
                <div className="test-analytics-right">
                    <div className="test-analytics-content">

                        <div className="test-taken-header">
                            <div className="test-active" style={{ paddingRight: "66px", cursor: "pointer" }}>
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect opacity="0.1" x="0.226562" width="28.3336" height="28.3336" rx="14" fill="#FF6812" />
                                    <rect opacity="0.8" x="12.2969" y="9.99902" width="4.18565" height="10.2316" rx="1" fill="#FF6812" />
                                    <rect opacity="0.5" x="6.71875" y="12.3242" width="4.18565" height="7.90622" rx="1" fill="#FF6812" />
                                    <rect x="17.8828" y="7.67383" width="4.18565" height="12.5569" rx="1" fill="#FF6812" />
                                </svg>
                                <span>Test Analytics</span>
                            </div>
                            <div style={{ paddingRight: "66px", cursor: "pointer" }} className="test-not-active" onClick={() => { navigate('/questionanalytics') }}>
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect opacity="0.1" x="0.226562" width="28.3336" height="28.3336" rx="14" fill="#615D5B" />
                                    <g clip-path="url(#clip0_1492_5412)">
                                        <path d="M14.5 20.75C17.9518 20.75 20.75 17.9518 20.75 14.5C20.75 11.0482 17.9518 8.25 14.5 8.25C11.0482 8.25 8.25 11.0482 8.25 14.5C8.25 17.9518 11.0482 20.75 14.5 20.75Z" stroke="#827C7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12.6797 12.6249C12.8266 12.2072 13.1167 11.8549 13.4984 11.6306C13.8802 11.4062 14.329 11.3242 14.7654 11.3991C15.2018 11.4739 15.5977 11.7008 15.8829 12.0396C16.168 12.3783 16.3241 12.8071 16.3234 13.2499C16.3234 14.4999 14.4484 15.1249 14.4484 15.1249" stroke="#827C7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.5 17.625H14.5063" stroke="#827C7C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1492_5412">
                                            <rect width="15" height="15" fill="white" transform="translate(7 7)" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <span>Question Analytics</span>
                            </div>

                        </div>

                        <div className="hiring-funnel">
                            <div className="hiring-title">
                                <span>Candidate Hiring Funnel</span>
                                <p>50% Attempted</p>
                            </div>
                        </div>

                        <div className="candidate-score-graph">
                            <div className="score-graph-title">
                                <span>Candidate-Score Graph</span>
                                <p>No. of  Candidates who score greater than or equal to median score (55%): 5</p>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestAnalytics