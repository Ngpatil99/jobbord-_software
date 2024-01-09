import React from 'react'
import SuperNavbar from '../../component/SuperNavbar'
import SuperReportNavbar from '../../component/SuperReportSidebar/inedx'
import './index.css'

function EmployeeReport() {
    return (
        <div className="employee-report">
            <SuperNavbar active={"employeereport"} />

            <div className="employee-report-container">
                <div className="employee-left">
                    <SuperReportNavbar active={"employeereport"} />
                </div>
                <div className="employee-right">
                    <div className="employee-report-content">
                        <div className="employee-report-header">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                <path d="M32 33V31C32 29.9391 31.5786 28.9217 30.8284 28.1716C30.0783 27.4214 29.0609 27 28 27H20C18.9391 27 17.9217 27.4214 17.1716 28.1716C16.4214 28.9217 16 29.9391 16 31V33" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M24 23C26.2091 23 28 21.2091 28 19C28 16.7909 26.2091 15 24 15C21.7909 15 20 16.7909 20 19C20 21.2091 21.7909 23 24 23Z" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div className="employee-report-header-title">
                                <span>Employee Reports</span>
                                <p>Invite Member to organisation and assign roles</p>
                            </div>
                        </div>

                        <div className="employee-report-btn">
                            <div className="select-emplyee-btn">
                                <select name="" id="">
                                    <option value="Select Employee">Select Employee</option>
                                </select>
                            </div>
                        </div>

                        <div className="employee-report-body">
                            <div className="employee-report-body-left">

                            </div>
                            <div className="employee-report-body-right">
                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeReport