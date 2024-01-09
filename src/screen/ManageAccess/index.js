import React from 'react'
import './index.css'
import SuperNavbar from '../../component/SuperNavbar'
import AssessmentOverviewSidebar from '../../component/AssessmentOverviewSidebar'
import ManageAccessSideBar from '../../component/ManageAccessSidebar'
import { useNavigate } from 'react-router-dom'

function ManageAccess() {
    let navigate = useNavigate()

    return (
        <div className="manage-access">
            <SuperNavbar active={"manageaccessinvite"} />

            <div className="manage-access-container">
                <div className="manage-access-left">
                    <ManageAccessSideBar active={"manageAccess"} />
                </div>
                <div className="manage-access-right">
                    <div className="manage-access-content">
                        <div className="manage-access-header">
                            <div className="manage-access-title">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                    <path d="M26.7013 18.3C26.5181 18.4869 26.4155 18.7382 26.4155 19C26.4155 19.2617 26.5181 19.5131 26.7013 19.7L28.3013 21.3C28.4882 21.4832 28.7396 21.5858 29.0013 21.5858C29.2631 21.5858 29.5144 21.4832 29.7013 21.3L33.4713 17.53C33.9742 18.6412 34.1264 19.8792 33.9078 21.0791C33.6892 22.279 33.11 23.3838 32.2476 24.2463C31.3852 25.1087 30.2804 25.6878 29.0805 25.9064C27.8806 26.1251 26.6425 25.9728 25.5313 25.47L18.6213 32.38C18.2235 32.7778 17.6839 33.0013 17.1213 33.0013C16.5587 33.0013 16.0191 32.7778 15.6213 32.38C15.2235 31.9822 15 31.4426 15 30.88C15 30.3174 15.2235 29.7778 15.6213 29.38L22.5313 22.47C22.0285 21.3588 21.8762 20.1207 22.0949 18.9208C22.3135 17.7209 22.8926 16.6161 23.755 15.7537C24.6175 14.8913 25.7223 14.3121 26.9222 14.0935C28.1221 13.8749 29.3601 14.0271 30.4713 14.53L26.7113 18.29L26.7013 18.3Z" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div className="manage-access-name">
                                    <span>Manage Access (10/30)</span>
                                    <p>Assign/Edit/Delete Access to members</p>
                                </div>
                            </div>

                            <button className="manage-access-invite-member" onClick={()=>{navigate('/manageaccessinvite')}}>
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10.5169" cy="10.7575" r="10" transform="rotate(-0.456831 10.5169 10.7575)" fill="white" />
                                    <g clip-path="url(#clip0_3322_4386)">
                                        <path d="M15 6L9.5 11.5" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15 6L11.5 16L9.5 11.5L5 9.5L15 6Z" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3322_4386">
                                            <rect width="12" height="12" fill="white" transform="translate(4 5)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Invite Member
                            </button>
                        </div>

                        <div className="manage-access-table-content">
                            <table cellSpacing={0}>
                                <tr>
                                    <th>Name</th>
                                    <th>Email ID</th>
                                    <th>Department</th>
                                    <th>Access</th>
                                    <th>Edit/ Delete</th>
                                </tr>
                                <tr>
                                    <td>Person Name here</td>
                                    <td>username@site.com</td>
                                    <td>Design</td>
                                    <td>
                                        <select name="" id="">
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <svg className='edit' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_3325_2188)">
                                                <path d="M7.33203 2.66663H2.66536C2.31174 2.66663 1.9726 2.8071 1.72256 3.05715C1.47251 3.3072 1.33203 3.64634 1.33203 3.99996V13.3333C1.33203 13.6869 1.47251 14.0261 1.72256 14.2761C1.9726 14.5262 2.31174 14.6666 2.66536 14.6666H11.9987C12.3523 14.6666 12.6915 14.5262 12.9415 14.2761C13.1916 14.0261 13.332 13.6869 13.332 13.3333V8.66663" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12.332 1.66665C12.5972 1.40144 12.957 1.25244 13.332 1.25244C13.7071 1.25244 14.0668 1.40144 14.332 1.66665C14.5972 1.93187 14.7462 2.29158 14.7462 2.66665C14.7462 3.04173 14.5972 3.40144 14.332 3.66665L7.9987 9.99999L5.33203 10.6667L5.9987 7.99999L12.332 1.66665Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_3325_2188">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <svg className='delete' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.01172 4H3.34505H14.0117" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.6771 4.00004V13.3334C12.6771 13.687 12.5366 14.0261 12.2866 14.2762C12.0365 14.5262 11.6974 14.6667 11.3438 14.6667H4.67708C4.32346 14.6667 3.98432 14.5262 3.73427 14.2762C3.48423 14.0261 3.34375 13.687 3.34375 13.3334V4.00004M5.34375 4.00004V2.66671C5.34375 2.31309 5.48423 1.97395 5.73427 1.7239C5.98432 1.47385 6.32346 1.33337 6.67708 1.33337H9.34375C9.69737 1.33337 10.0365 1.47385 10.2866 1.7239C10.5366 1.97395 10.6771 2.31309 10.6771 2.66671V4.00004" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.67969 7.33337V11.3334" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9.34375 7.33337V11.3334" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Person Name here</td>
                                    <td>username@site.com</td>
                                    <td>Design</td>
                                    <td>
                                        <select name="" id="">
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <svg className='edit' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_3325_2188)">
                                                <path d="M7.33203 2.66663H2.66536C2.31174 2.66663 1.9726 2.8071 1.72256 3.05715C1.47251 3.3072 1.33203 3.64634 1.33203 3.99996V13.3333C1.33203 13.6869 1.47251 14.0261 1.72256 14.2761C1.9726 14.5262 2.31174 14.6666 2.66536 14.6666H11.9987C12.3523 14.6666 12.6915 14.5262 12.9415 14.2761C13.1916 14.0261 13.332 13.6869 13.332 13.3333V8.66663" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12.332 1.66665C12.5972 1.40144 12.957 1.25244 13.332 1.25244C13.7071 1.25244 14.0668 1.40144 14.332 1.66665C14.5972 1.93187 14.7462 2.29158 14.7462 2.66665C14.7462 3.04173 14.5972 3.40144 14.332 3.66665L7.9987 9.99999L5.33203 10.6667L5.9987 7.99999L12.332 1.66665Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_3325_2188">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <svg className='delete' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.01172 4H3.34505H14.0117" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.6771 4.00004V13.3334C12.6771 13.687 12.5366 14.0261 12.2866 14.2762C12.0365 14.5262 11.6974 14.6667 11.3438 14.6667H4.67708C4.32346 14.6667 3.98432 14.5262 3.73427 14.2762C3.48423 14.0261 3.34375 13.687 3.34375 13.3334V4.00004M5.34375 4.00004V2.66671C5.34375 2.31309 5.48423 1.97395 5.73427 1.7239C5.98432 1.47385 6.32346 1.33337 6.67708 1.33337H9.34375C9.69737 1.33337 10.0365 1.47385 10.2866 1.7239C10.5366 1.97395 10.6771 2.31309 10.6771 2.66671V4.00004" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.67969 7.33337V11.3334" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9.34375 7.33337V11.3334" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Person Name here</td>
                                    <td>username@site.com</td>
                                    <td>Design</td>
                                    <td>
                                        <select name="" id="">
                                            <option value="Super Admin">Super Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <svg className='edit' width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_3325_2188)">
                                                <path d="M7.33203 2.66663H2.66536C2.31174 2.66663 1.9726 2.8071 1.72256 3.05715C1.47251 3.3072 1.33203 3.64634 1.33203 3.99996V13.3333C1.33203 13.6869 1.47251 14.0261 1.72256 14.2761C1.9726 14.5262 2.31174 14.6666 2.66536 14.6666H11.9987C12.3523 14.6666 12.6915 14.5262 12.9415 14.2761C13.1916 14.0261 13.332 13.6869 13.332 13.3333V8.66663" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M12.332 1.66665C12.5972 1.40144 12.957 1.25244 13.332 1.25244C13.7071 1.25244 14.0668 1.40144 14.332 1.66665C14.5972 1.93187 14.7462 2.29158 14.7462 2.66665C14.7462 3.04173 14.5972 3.40144 14.332 3.66665L7.9987 9.99999L5.33203 10.6667L5.9987 7.99999L12.332 1.66665Z" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_3325_2188">
                                                    <rect width="16" height="16" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                        <svg className='delete' width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.01172 4H3.34505H14.0117" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.6771 4.00004V13.3334C12.6771 13.687 12.5366 14.0261 12.2866 14.2762C12.0365 14.5262 11.6974 14.6667 11.3438 14.6667H4.67708C4.32346 14.6667 3.98432 14.5262 3.73427 14.2762C3.48423 14.0261 3.34375 13.687 3.34375 13.3334V4.00004M5.34375 4.00004V2.66671C5.34375 2.31309 5.48423 1.97395 5.73427 1.7239C5.98432 1.47385 6.32346 1.33337 6.67708 1.33337H9.34375C9.69737 1.33337 10.0365 1.47385 10.2866 1.7239C10.5366 1.97395 10.6771 2.31309 10.6771 2.66671V4.00004" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.67969 7.33337V11.3334" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9.34375 7.33337V11.3334" stroke="#999999" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
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

export default ManageAccess