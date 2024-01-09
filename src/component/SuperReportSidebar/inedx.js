import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

function SuperReportNavbar(props) {
    const navigate = useNavigate()

    return (
        <div className="super-report-sidebar">
            <div className="super-report-sidebar-content">
                <div style={{ paddingBottom: "13px", borderBottom: "1px solid #DDDDDD", paddingLeft: "0px" }} className={"test-notActive"}>
                    <span>Reports</span>

                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 13.3333V6.66663" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M12 13.3333V2.66663" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4 13.3333V10.6666" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                </div>
                <div onClick={() => { navigate('/employeereport') }} style={{ marginTop: "15px" }} className={props.active == "employeereport" ? "test-active" : "test-notActive"}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3346 14V12.6667C13.3346 11.9594 13.0537 11.2811 12.5536 10.781C12.0535 10.281 11.3752 10 10.668 10H5.33464C4.62739 10 3.94911 10.281 3.44902 10.781C2.94892 11.2811 2.66797 11.9594 2.66797 12.6667V14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.9987 7.33333C9.47146 7.33333 10.6654 6.13943 10.6654 4.66667C10.6654 3.19391 9.47146 2 7.9987 2C6.52594 2 5.33203 3.19391 5.33203 4.66667C5.33203 6.13943 6.52594 7.33333 7.9987 7.33333Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Employee Reports</span>
                </div>
                <div onClick={() => { navigate('/testreport') }} className={props.active == "testreport" ? "test-active" : "test-notActive"}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.668 2.66663H12.0013C12.3549 2.66663 12.6941 2.8071 12.9441 3.05715C13.1942 3.3072 13.3346 3.64634 13.3346 3.99996V13.3333C13.3346 13.6869 13.1942 14.0261 12.9441 14.2761C12.6941 14.5262 12.3549 14.6666 12.0013 14.6666H4.0013C3.64768 14.6666 3.30854 14.5262 3.05849 14.2761C2.80844 14.0261 2.66797 13.6869 2.66797 13.3333V3.99996C2.66797 3.64634 2.80844 3.3072 3.05849 3.05715C3.30854 2.8071 3.64768 2.66663 4.0013 2.66663H5.33464" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M9.9987 1.33337H5.9987C5.63051 1.33337 5.33203 1.63185 5.33203 2.00004V3.33337C5.33203 3.70156 5.63051 4.00004 5.9987 4.00004H9.9987C10.3669 4.00004 10.6654 3.70156 10.6654 3.33337V2.00004C10.6654 1.63185 10.3669 1.33337 9.9987 1.33337Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <span>Tests Reports</span>
                </div>
                <div onClick={() => { navigate('/departmentreport') }} className={props.active == "departmentreport" ? "test-active" : "test-notActive"}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M2 6H14" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6 14V6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>Department Reports</span>
                </div>
            </div>
        </div>
    )
}

export default SuperReportNavbar