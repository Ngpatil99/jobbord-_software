import React from 'react'
import { useNavigate } from 'react-router-dom'
import './index.css'

function ManageAccessSideBar(props) {
    const navigate = useNavigate()
    return (
        <div className="assessment-sidebar">
            <div className="assessment-sidebar-content">
                <div  style={{ paddingBottom: "13px", borderBottom: "1px solid #DDDDDD", paddingLeft: "0px" }} className={"test-notActive"}>
                    <span>Manage Access</span>
                </div>
                <div onClick={() => { navigate('/manageaccess') }} style={{ marginTop: "15px" }} className={props.active == "manageAccess" ? "test-active" : "test-notActive"}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.80088 4.20003C9.67873 4.32465 9.61031 4.49219 9.61031 4.66669C9.61031 4.8412 9.67873 5.00874 9.80088 5.13336L10.8675 6.20003C10.9922 6.32218 11.1597 6.3906 11.3342 6.3906C11.5087 6.3906 11.6763 6.32218 11.8009 6.20003L14.3142 3.68669C14.6494 4.42749 14.7509 5.25285 14.6052 6.05279C14.4594 6.85273 14.0734 7.58926 13.4984 8.16421C12.9234 8.73917 12.1869 9.12525 11.387 9.271C10.587 9.41675 9.76167 9.31525 9.02088 8.98003L4.41421 13.5867C4.149 13.8519 3.78929 14.0009 3.41421 14.0009C3.03914 14.0009 2.67943 13.8519 2.41421 13.5867C2.149 13.3215 2 12.9618 2 12.5867C2 12.2116 2.149 11.8519 2.41421 11.5867L7.02088 6.98003C6.68566 6.23923 6.58416 5.41387 6.72991 4.61393C6.87566 3.81399 7.26174 3.07746 7.83669 2.50251C8.41165 1.92755 9.14818 1.54147 9.94812 1.39572C10.7481 1.24997 11.5734 1.35147 12.3142 1.68669L9.80755 4.19336L9.80088 4.20003Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <span>Manage Access</span>
                </div>
                <div onClick={() => { navigate('/manageaccessinvite') }} className={props.active == "invite" ? "test-active" : "test-notActive"}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3322_4369)">
                            <path d="M14.6654 1.33337L7.33203 8.66671" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M14.6654 1.33337L9.9987 14.6667L7.33203 8.66671L1.33203 6.00004L14.6654 1.33337Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3322_4369">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>

                    <span>Invite Members</span>
                </div>
            </div>
        </div>
    )
}

export default ManageAccessSideBar