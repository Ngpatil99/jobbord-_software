import React from 'react'
import SuperNavbar from '../../component/SuperNavbar'
import SuperReportNavbar from '../../component/SuperReportSidebar/inedx'
import './index.css'

function DepartmentReport() {
    return (
        <div className="department-report">
            <SuperNavbar active={"employeereport"} />

            <div className="department-report-container">
                <div className="department-left">
                    <SuperReportNavbar active={"departmentreport"} />
                </div>
                <div className="department-right">
                    <div className="department-report-content">
                        <div className="department-report-header">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                <path d="M31 15H17C15.8954 15 15 15.8954 15 17V31C15 32.1046 15.8954 33 17 33H31C32.1046 33 33 32.1046 33 31V17C33 15.8954 32.1046 15 31 15Z" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15 21H33" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M21 33V21" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <div className="department-report-header-title">
                                <span>Department Reports</span>
                                <p>View Reports of all departments</p>
                            </div>
                        </div>

                        <div className="department-report-body">
                            <div className="department-report-body-left">
                                <div className="department-report-body-left-title">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DepartmentReport