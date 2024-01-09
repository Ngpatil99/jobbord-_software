import React, { useState } from 'react'
import './index.css'
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import InviteDelete from '../../component/InviteBulkDelete';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import EditCandidateInvite from '../../component/EditCandidateInvite';

function ImportCandidate() {
    let navigate = useNavigate()
    const [delteMultiple, setDeleteMultiple] = useState(false)
    const [delteRecentlyAdded, setRecentlyAdded] = useState(false)
    const [delteSingle, setDeleteSingle] = useState(false)
    const [editSingle, setEditSingle] = useState(false)

    const onClickSave = () => {
        toast.success("All your data is saved successfully")
        setInterval(() => {
            navigate('/assessmentoverview')
        }, 4000);
    }


    return (
        <div className="invite-bulk">
            <NavigationBar />
            <div className="invite-bulk-container">
                {delteMultiple && <InviteDelete close={() => { setDeleteMultiple(false) }} />}
                {delteRecentlyAdded && <InviteDelete recentlyAdded={true} close={() => { setRecentlyAdded(false) }} />}
                {delteSingle && <InviteDelete single={true} close={() => { setDeleteSingle(false) }} />}
                {editSingle && <EditCandidateInvite close={() => { setEditSingle(false) }} />}

                <div className="invite-bulk-content">
                    <div className="invite-bulk-header" >
                        <div className="title" onClick={() => { navigate('/bulkinvite') }}>
                            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12.0908H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M12 19.0908L5 12.0908L12 5.09082" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span>Imported Candidates (6)</span>
                        </div>

                        <div className="title-button-container">
                            <button onClick={() => { navigate('/invitesent') }} className="send-invite">
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10.0908" r="10" fill="white" />
                                    <g clip-path="url(#clip0_2716_3802)">
                                        <path d="M14.5 5.09082L9 10.5908" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.5 5.09082L11 15.0908L9 10.5908L4.5 8.59082L14.5 5.09082Z" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2716_3802">
                                            <rect width="12" height="12" fill="white" transform="translate(3.5 4.09082)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Send Invite
                            </button>
                        </div>
                    </div>

                    <div className="details-button-container">
                        <div className="save-validity">
                            <div className="select-input">
                                <select name="" id="">
                                    <option value="">Validity</option>
                                </select>
                            </div>
                            <button className="save" onClick={() => { onClickSave() }}>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10.0908" r="10" fill="white" />
                                    <path d="M13.5 14.5908H6.5C6.23478 14.5908 5.98043 14.4855 5.79289 14.2979C5.60536 14.1104 5.5 13.856 5.5 13.5908V6.59082C5.5 6.3256 5.60536 6.07125 5.79289 5.88371C5.98043 5.69618 6.23478 5.59082 6.5 5.59082H12L14.5 8.09082V13.5908C14.5 13.856 14.3946 14.1104 14.2071 14.2979C14.0196 14.4855 13.7652 14.5908 13.5 14.5908Z" stroke="#384455" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12.5 14.5908V10.5908H7.5V14.5908" stroke="#384455" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M7.5 5.59082V8.09082H11.5" stroke="#384455" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                Save
                            </button>

                        </div>

                        <div className="delete-button-container">
                            <button onClick={() => { setDeleteMultiple(true) }} className="delete-duplicate">
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10.0234" cy="10.3633" r="10" fill="#FF6812" />
                                    <g clip-path="url(#clip0_3506_2410)">
                                        <path d="M5.52344 7.36328H6.52344H14.5234" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M13.5234 7.36328V14.3633C13.5234 14.6285 13.4181 14.8829 13.2305 15.0704C13.043 15.2579 12.7887 15.3633 12.5234 15.3633H7.52344C7.25822 15.3633 7.00387 15.2579 6.81633 15.0704C6.62879 14.8829 6.52344 14.6285 6.52344 14.3633V7.36328M8.02344 7.36328V6.36328C8.02344 6.09806 8.12879 5.84371 8.31633 5.65617C8.50387 5.46864 8.75822 5.36328 9.02344 5.36328H11.0234C11.2887 5.36328 11.543 5.46864 11.7305 5.65617C11.9181 5.84371 12.0234 6.09806 12.0234 6.36328V7.36328" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.02344 9.86328V12.8633" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.0234 9.86328V12.8633" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_3506_2410">
                                            <rect width="12" height="12" fill="white" transform="translate(4.02344 4.36328)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Delete Duplicate
                            </button>

                            <button className="recently-appeared" onClick={() => { setRecentlyAdded(true) }}>
                                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10.0234" cy="10.3633" r="10" fill="#FF6812" />
                                    <g clip-path="url(#clip0_2716_3899)">
                                        <path d="M5.52344 7.36328H6.52344H14.5234" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M13.5234 7.36328V14.3633C13.5234 14.6285 13.4181 14.8829 13.2305 15.0704C13.043 15.2579 12.7887 15.3633 12.5234 15.3633H7.52344C7.25822 15.3633 7.00387 15.2579 6.81633 15.0704C6.62879 14.8829 6.52344 14.6285 6.52344 14.3633V7.36328M8.02344 7.36328V6.36328C8.02344 6.09806 8.12879 5.84371 8.31633 5.65617C8.50387 5.46864 8.75822 5.36328 9.02344 5.36328H11.0234C11.2887 5.36328 11.543 5.46864 11.7305 5.65617C11.9181 5.84371 12.0234 6.09806 12.0234 6.36328V7.36328" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M9.02344 9.86328V12.8633" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.0234 9.86328V12.8633" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2716_3899">
                                            <rect width="12" height="12" fill="white" transform="translate(4.02344 4.36328)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                Delete  Recently Appeared
                            </button>
                        </div>
                    </div>

                    <div className="imported-table">
                        <table cellSpacing={0}>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Name</th>
                                <th>Email ID</th>
                                <th>Edit</th>
                            </tr>
                            <tr>
                                <td>1</td>
                                <td>Name Goes Here</td>
                                <td>Something@something.com</td>
                                <td>
                                    <svg onClick={() => { setEditSingle(true) }} width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13.5404" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M12.75 18.3486H17.4907" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1189 9.11434C15.3285 8.89169 15.6127 8.7666 15.909 8.7666C16.0558 8.7666 16.2011 8.79731 16.3367 8.85697C16.4722 8.91664 16.5954 9.00409 16.6992 9.11434C16.8029 9.22458 16.8852 9.35546 16.9414 9.49951C16.9975 9.64355 17.0265 9.79793 17.0265 9.95384C17.0265 10.1098 16.9975 10.2641 16.9414 10.4082C16.8852 10.5522 16.8029 10.6831 16.6992 10.7933L10.1148 17.7892L8.00781 18.3489L8.53456 16.1102L15.1189 9.11434Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg onClick={() => { setDeleteSingle(true) }} width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12.8217" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M8.86719 11.1367H9.65731H15.9783" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1949 11.1369V16.6678C15.1949 16.8773 15.1117 17.0783 14.9635 17.2265C14.8153 17.3746 14.6144 17.4579 14.4048 17.4579H10.4542C10.2446 17.4579 10.0437 17.3746 9.89548 17.2265C9.74731 17.0783 9.66406 16.8773 9.66406 16.6678V11.1369M10.8492 11.1369V10.3468C10.8492 10.1372 10.9325 9.93624 11.0807 9.78806C11.2288 9.63989 11.4298 9.55664 11.6394 9.55664H13.2196C13.4292 9.55664 13.6301 9.63989 13.7783 9.78806C13.9265 9.93624 14.0097 10.1372 14.0097 10.3468V11.1369" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Name Goes Here</td>
                                <td>Something@something.com</td>
                                <td>
                                    <svg onClick={() => { setEditSingle(true) }} width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13.5404" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M12.75 18.3486H17.4907" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1189 9.11434C15.3285 8.89169 15.6127 8.7666 15.909 8.7666C16.0558 8.7666 16.2011 8.79731 16.3367 8.85697C16.4722 8.91664 16.5954 9.00409 16.6992 9.11434C16.8029 9.22458 16.8852 9.35546 16.9414 9.49951C16.9975 9.64355 17.0265 9.79793 17.0265 9.95384C17.0265 10.1098 16.9975 10.2641 16.9414 10.4082C16.8852 10.5522 16.8029 10.6831 16.6992 10.7933L10.1148 17.7892L8.00781 18.3489L8.53456 16.1102L15.1189 9.11434Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg onClick={() => { setDeleteSingle(true) }} width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12.8217" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M8.86719 11.1367H9.65731H15.9783" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1949 11.1369V16.6678C15.1949 16.8773 15.1117 17.0783 14.9635 17.2265C14.8153 17.3746 14.6144 17.4579 14.4048 17.4579H10.4542C10.2446 17.4579 10.0437 17.3746 9.89548 17.2265C9.74731 17.0783 9.66406 16.8773 9.66406 16.6678V11.1369M10.8492 11.1369V10.3468C10.8492 10.1372 10.9325 9.93624 11.0807 9.78806C11.2288 9.63989 11.4298 9.55664 11.6394 9.55664H13.2196C13.4292 9.55664 13.6301 9.63989 13.7783 9.78806C13.9265 9.93624 14.0097 10.1372 14.0097 10.3468V11.1369" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Name Goes Here</td>
                                <td>Something@something.com</td>
                                <td>
                                    <svg onClick={() => { setEditSingle(true) }} width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13.5404" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M12.75 18.3486H17.4907" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1189 9.11434C15.3285 8.89169 15.6127 8.7666 15.909 8.7666C16.0558 8.7666 16.2011 8.79731 16.3367 8.85697C16.4722 8.91664 16.5954 9.00409 16.6992 9.11434C16.8029 9.22458 16.8852 9.35546 16.9414 9.49951C16.9975 9.64355 17.0265 9.79793 17.0265 9.95384C17.0265 10.1098 16.9975 10.2641 16.9414 10.4082C16.8852 10.5522 16.8029 10.6831 16.6992 10.7933L10.1148 17.7892L8.00781 18.3489L8.53456 16.1102L15.1189 9.11434Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg onClick={() => { setDeleteSingle(true) }} width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12.8217" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M8.86719 11.1367H9.65731H15.9783" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1949 11.1369V16.6678C15.1949 16.8773 15.1117 17.0783 14.9635 17.2265C14.8153 17.3746 14.6144 17.4579 14.4048 17.4579H10.4542C10.2446 17.4579 10.0437 17.3746 9.89548 17.2265C9.74731 17.0783 9.66406 16.8773 9.66406 16.6678V11.1369M10.8492 11.1369V10.3468C10.8492 10.1372 10.9325 9.93624 11.0807 9.78806C11.2288 9.63989 11.4298 9.55664 11.6394 9.55664H13.2196C13.4292 9.55664 13.6301 9.63989 13.7783 9.78806C13.9265 9.93624 14.0097 10.1372 14.0097 10.3468V11.1369" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </td>
                            </tr>
                            <tr>
                                <td>4</td>
                                <td>Name Goes Here</td>
                                <td>Something@something.com</td>
                                <td>
                                    <svg onClick={() => { setEditSingle(true) }} width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="13.5404" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M12.75 18.3486H17.4907" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1189 9.11434C15.3285 8.89169 15.6127 8.7666 15.909 8.7666C16.0558 8.7666 16.2011 8.79731 16.3367 8.85697C16.4722 8.91664 16.5954 9.00409 16.6992 9.11434C16.8029 9.22458 16.8852 9.35546 16.9414 9.49951C16.9975 9.64355 17.0265 9.79793 17.0265 9.95384C17.0265 10.1098 16.9975 10.2641 16.9414 10.4082C16.8852 10.5522 16.8029 10.6831 16.6992 10.7933L10.1148 17.7892L8.00781 18.3489L8.53456 16.1102L15.1189 9.11434Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <svg onClick={() => { setDeleteSingle(true) }} width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12.8217" cy="13.5072" r="12.642" fill="#384455" />
                                        <path d="M8.86719 11.1367H9.65731H15.9783" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M15.1949 11.1369V16.6678C15.1949 16.8773 15.1117 17.0783 14.9635 17.2265C14.8153 17.3746 14.6144 17.4579 14.4048 17.4579H10.4542C10.2446 17.4579 10.0437 17.3746 9.89548 17.2265C9.74731 17.0783 9.66406 16.8773 9.66406 16.6678V11.1369M10.8492 11.1369V10.3468C10.8492 10.1372 10.9325 9.93624 11.0807 9.78806C11.2288 9.63989 11.4298 9.55664 11.6394 9.55664H13.2196C13.4292 9.55664 13.6301 9.63989 13.7783 9.78806C13.9265 9.93624 14.0097 10.1372 14.0097 10.3468V11.1369" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </td>
                            </tr>
                        </table>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default ImportCandidate