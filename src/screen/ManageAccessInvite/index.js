import React, { useState } from 'react'
import './index.css'
import SuperNavbar from '../../component/SuperNavbar'
import AssessmentOverviewSidebar from '../../component/AssessmentOverviewSidebar'
import ManageAccessSideBar from '../../component/ManageAccessSidebar'

function ManageAccessInvite() {
    const [person, setPerson] = useState("")
    const [email, setEmail] = useState("")
    const [department, setDepartment] = useState("")
    const [access, setAccess] = useState("")

    function ValidateEmail(mail) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
            return (true)
        }
        return (false)
    }

    return (
        <div className="manage-access-invite">
            <SuperNavbar active={"manageaccessinvite"} />

            <div className="manage-access-container">
                <div className="manage-access-left">
                    <ManageAccessSideBar active={"invite"} />
                </div>
                <div className="manage-access-right">
                    <div className="manage-access-content">
                        <div className="manage-access-header">
                            <div className="manage-access-title">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                    <path d="M33 16L22 27" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M33 16L26 36L22 27L13 23L33 16Z" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                <div className="manage-access-name">
                                    <span>Invite Members</span>
                                    <p>Invite Member to organisation and assign roles</p>
                                </div>
                            </div>
                        </div>

                        <div className="invite-input">
                            <div className="row1">
                                <div className="name">
                                    <span>Name</span>
                                    <div className="input-box">
                                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_3329_2396)">
                                                <path d="M15 15.2449V13.7449C15 12.9492 14.6839 12.1862 14.1213 11.6236C13.5587 11.0609 12.7957 10.7449 12 10.7449H6C5.20435 10.7449 4.44129 11.0609 3.87868 11.6236C3.31607 12.1862 3 12.9492 3 13.7449V15.2449" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M9 7.74487C10.6569 7.74487 12 6.40173 12 4.74487C12 3.08802 10.6569 1.74487 9 1.74487C7.34315 1.74487 6 3.08802 6 4.74487C6 6.40173 7.34315 7.74487 9 7.74487Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_3329_2396">
                                                    <rect width="18" height="18" fill="white" transform="translate(0 0.244873)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <input onChange={(e) => { setPerson(e.target.value) }} type="text" placeholder='Person Name Here' />
                                    </div>
                                </div>

                                <div className="name">
                                    <span>Email</span>
                                    <div className="input-box">
                                        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_3329_2405)">
                                                <path d="M3.48047 3.24487H15.4805C16.3055 3.24487 16.9805 3.91987 16.9805 4.74487V13.7449C16.9805 14.5699 16.3055 15.2449 15.4805 15.2449H3.48047C2.65547 15.2449 1.98047 14.5699 1.98047 13.7449V4.74487C1.98047 3.91987 2.65547 3.24487 3.48047 3.24487Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M16.9805 4.74487L9.48047 9.99487L1.98047 4.74487" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_3329_2405">
                                                    <rect width="18" height="18" fill="white" transform="translate(0.480469 0.244873)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <input onChange={(e) => { setEmail(e.target.value) }} type="text" placeholder='Something@something.com' />
                                    </div>
                                </div>
                            </div>

                            <div className="row2">
                                <div className="department">
                                    <span>Department</span>
                                    <div className="select-box">
                                        <select onChange={(e) => { setDepartment(e.target.value) }} name="" id="">
                                            <option value="">Select</option>
                                            <option value="Product">Product</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="department">
                                    <span>Access</span>
                                    <div onChange={(e) => { setAccess(e.target.value) }} className="select-box">
                                        <select name="" id="">
                                            <option value="">Select</option>
                                            <option value="Product">Recruiter</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="row3">
                                <button className={person != "" && ValidateEmail(email) && department != "" && access != "" ? "invite-btn" : "not-active-btn"}>
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10.2449" r="10" fill="white" />
                                        <g clip-path="url(#clip0_3329_2415)">
                                            <path d="M14.5 5.24487L9 10.7449" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M14.5 5.24487L11 15.2449L9 10.7449L4.5 8.74487L14.5 5.24487Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3329_2415">
                                                <rect width="12" height="12" fill="white" transform="translate(3.5 4.24487)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    Send Invite
                                </button>
                            </div>
                        </div>
                        <div className="mid-border"></div>
                        <div className="manage-access-table-content">
                            <span>Invited Members</span>
                            <table cellSpacing={0}>
                                <tr>
                                    <th>Name</th>
                                    <th>Email ID</th>

                                    <th>Access</th>
                                </tr>
                                <tr>
                                    <td>Person Name here</td>
                                    <td>username@site.com</td>

                                    <td>
                                        Super Admin
                                    </td>
                                </tr>
                                <tr>
                                    <td>Person Name here</td>
                                    <td>username@site.com</td>

                                    <td>
                                        Recruiter
                                    </td>
                                </tr>
                                <tr>
                                    <td>Person Name here</td>
                                    <td>username@site.com</td>

                                    <td>
                                        Recruiter
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageAccessInvite