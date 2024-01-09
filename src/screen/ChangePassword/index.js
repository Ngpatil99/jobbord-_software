import React from 'react'
import { useState } from 'react';
import { toast } from 'react-toastify'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { backend_url,getCookie,deleteAllCookie } from '../../constant';
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import ProfileSidebar from '../../component/ProfileSidebar';
import LogoutUser from "../../component/LogoutUser";
import './index.css'
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
    const navigate = useNavigate()
    const [currentPassword, setcurrentPassword] = useState("")
    const [newPassword, setnewPassword] = useState("")
    const [confirmPassword, setconfirmPassword] = useState("")
    const [loading, setloading] = useState(false)
    const [strength, setstrength] = useState("Poor")
    const [currentPasswordView, setcurrentPasswordView] = useState(false)
    const [newPasswordView, setnewPasswordView] = useState(true)
    const [confirmPasswordView, setconfirmPasswordView] = useState(true)
    const [showLogoutPopup, setshowLogoutPopup] = useState(false)

    const ChangePassword = async () => {
        try {
            setloading(true)

            if (currentPassword === "") {
                toast("please enter current password", {
                    className: 'toast-message'
                })
                setloading(false)
            } else if (newPassword === "") {
                toast("please enter new password", {
                    className: 'toast-message'
                })
                setloading(false)
            } else if (confirmPassword === "") {
                toast("please enter confirm password", {
                    className: 'toast-message'
                })
                setloading(false)
            } else
                if (newPassword === confirmPassword) {

                    const token = getCookie("Xh7ERL0G")
                    const userData = jwtDecode(token)
                    await axios.put(`${backend_url}eqa/changepassword`, {
                        email: userData.email,
                        newpassword: newPassword,
                        confirmpassword: confirmPassword,
                        currentPassword: currentPassword
                    },{headers:{"token":token}})
                    setloading(false)

                    toast("password change", {
                        className: 'toast-message'
                    })

                } else {
                    setloading(false)
                    toast("New password and confirm password are not sames", {
                        className: 'toast-message'
                    })
                }
        } catch (error) {
            setloading(false)

            toast(error.response.data.error, {
                className: 'toast-message'
            })

        }
    }

    const changenewPassword = (e) => {
        setnewPassword(e.target.value)

    }

    const changeconfirmPassword = (e) => {
        passwordStrength(e.target.value)
        setconfirmPassword(e.target.value)

    }

    const passwordStrength = (evnt) => {
        const passwordValue = evnt;
        const passwordLength = passwordValue.length;
        const poorRegExp = /[a-z]/;
        const weakRegExp = /(?=.*?[0-9])/;;
        const strongRegExp = /(?=.*?[#?!@$%^&*-])/;
        //const whitespaceRegExp = /^$|\s+/;
        const poorPassword = poorRegExp.test(passwordValue);
        const weakPassword = weakRegExp.test(passwordValue);
        const strongPassword = strongRegExp.test(passwordValue);

        // to check poor password
        if (passwordLength <= 3 && (poorPassword || weakPassword || strongPassword)) {
            setstrength("Poor");
        }
        // to check weak password
        if (passwordLength >= 4 && poorPassword && (weakPassword || strongPassword)) {
            setstrength("Medium");
        }
        // to check strong Password
        if (passwordLength >= 6 && (poorPassword && weakPassword) && strongPassword) {
            setstrength("Strong");
        }

    }

    return (


        <div className='profile-new-password-container' >
            <NavigationBar />
            {showLogoutPopup ? <LogoutUser onClickNo={() => setshowLogoutPopup(false)} onClickYes={() => { toast("Log out user sucessfully!"); deleteAllCookie();window.open("https://theeliteqa.com/", "_self") }} /> : <></>}
            <div className="new-password-container">
                <ProfileSidebar active="password" />
                <div className="right-container">
                    <div className="password">
                        <div className="col">
                            <div className="heading-bar">
                                <div className="title">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                        <path d="M30.4167 22.083H17.5833C16.5708 22.083 15.75 22.9038 15.75 23.9163V30.333C15.75 31.3455 16.5708 32.1663 17.5833 32.1663H30.4167C31.4292 32.1663 32.25 31.3455 32.25 30.333V23.9163C32.25 22.9038 31.4292 22.083 30.4167 22.083Z" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M19.418 22.083V18.4163C19.418 17.2008 19.9009 16.035 20.7604 15.1754C21.6199 14.3159 22.7857 13.833 24.0013 13.833C25.2169 13.833 26.3827 14.3159 27.2422 15.1754C28.1018 16.035 28.5846 17.2008 28.5846 18.4163V22.083" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <div className="group">
                                        <span>Password</span>
                                        <p>Change and keep secure password</p>
                                    </div>
                                </div>
                                <div style={{cursor:'pointer'}} onClick={()=>ChangePassword()} className="reset-button">
                                    {loading?<div className='loader' ></div>:

                                    <>
                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10.4388" cy="10.6055" r="10" transform="rotate(-0.456831 10.4388 10.6055)" fill="white" />
                                        <g clip-path="url(#clip0_2085_1910)">
                                            <path d="M16.0093 10.0086L16.0136 10.5452C16.0229 11.8031 15.6254 13.0303 14.8803 14.0438C14.1351 15.0572 13.0824 15.8027 11.8789 16.169C10.6755 16.5352 9.38597 16.5027 8.20257 16.0762C7.01917 15.6497 6.00535 14.8521 5.3123 13.8023C4.61926 12.7525 4.28412 11.5068 4.35688 10.251C4.42963 8.9952 4.90638 7.79655 5.71602 6.83384C6.52567 5.87112 7.62482 5.19591 8.84956 4.90892C10.0743 4.62192 11.359 4.73852 12.512 5.24131" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.9757 5.87801L10.1891 11.7635L8.42518 10.0275" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2085_1910">
                                                <rect width="14" height="14" fill="white" transform="translate(3.125 3.64746) rotate(-0.456831)" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <span>Reset</span>
                                    </>
                                    }
                                </div>
                            </div>
                            <div className="heading-border">

                            </div>
                        </div>

                        <div className="row">
                            <div className="input">
                                <span>Current Password</span>
                                <div className="input-box1">
                                    <svg className='lock' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.25 8.25H3.75C2.92157 8.25 2.25 8.92157 2.25 9.75V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V9.75C15.75 8.92157 15.0784 8.25 14.25 8.25Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    {currentPasswordView ? <svg onClick={() => setcurrentPasswordView(!currentPasswordView) } className='eye' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2085_2053)">
                                            <path d="M1.54297 10.9206C1.54297 10.9206 4.8763 4.25391 10.7096 4.25391C16.543 4.25391 19.8763 10.9206 19.8763 10.9206C19.8763 10.9206 16.543 17.5872 10.7096 17.5872C4.8763 17.5872 1.54297 10.9206 1.54297 10.9206Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M10.7109 13.4209C12.0916 13.4209 13.2109 12.3016 13.2109 10.9209C13.2109 9.54019 12.0916 8.4209 10.7109 8.4209C9.33023 8.4209 8.21094 9.54019 8.21094 10.9209C8.21094 12.3016 9.33023 13.4209 10.7109 13.4209Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2085_2053">
                                                <rect width="20" height="20" fill="white" transform="translate(0.710938 0.920898)" />
                                            </clipPath>
                                        </defs>
                                    </svg> :
                                        <svg onClick={() => setcurrentPasswordView(!currentPasswordView) } className='eye' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2085_2029)">
                                                <path d="M14.9487 14.9497C13.5242 16.0355 11.7896 16.6371 9.9987 16.6664C4.16536 16.6664 0.832031 9.99969 0.832031 9.99969C1.86861 8.06794 3.30631 6.3802 5.0487 5.0497M8.2487 3.53303C8.82231 3.39876 9.40959 3.33164 9.9987 3.33303C15.832 3.33303 19.1654 9.99969 19.1654 9.99969C18.6595 10.946 18.0562 11.837 17.3654 12.658M11.7654 11.7664C11.5365 12.012 11.2605 12.209 10.9538 12.3456C10.6472 12.4823 10.3161 12.5557 9.98044 12.5617C9.64476 12.5676 9.31133 12.5058 9.00004 12.3801C8.68875 12.2544 8.40597 12.0672 8.16857 11.8298C7.93117 11.5924 7.74403 11.3096 7.61829 10.9984C7.49255 10.6871 7.4308 10.3536 7.43673 10.018C7.44265 9.68228 7.51612 9.35123 7.65276 9.04457C7.7894 8.7379 7.98641 8.4619 8.23203 8.23303" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M0.832031 0.833008L19.1654 19.1663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2085_2029">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    }

                                    <input onChange={(e)=>setcurrentPassword(e.target.value)} value={currentPassword} type={currentPasswordView ? "password" : "text"} placeholder='#Something123' />
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: 28 }} className="row">
                            <div className="input">
                                <span>New Password</span>
                                <div className="input-box1">
                                    <svg className='lock' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.25 8.25H3.75C2.92157 8.25 2.25 8.92157 2.25 9.75V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V9.75C15.75 8.92157 15.0784 8.25 14.25 8.25Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    {newPasswordView ? <svg onClick={() => { setnewPasswordView(!newPasswordView) }} className='eye' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2085_2053)">
                                            <path d="M1.54297 10.9206C1.54297 10.9206 4.8763 4.25391 10.7096 4.25391C16.543 4.25391 19.8763 10.9206 19.8763 10.9206C19.8763 10.9206 16.543 17.5872 10.7096 17.5872C4.8763 17.5872 1.54297 10.9206 1.54297 10.9206Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M10.7109 13.4209C12.0916 13.4209 13.2109 12.3016 13.2109 10.9209C13.2109 9.54019 12.0916 8.4209 10.7109 8.4209C9.33023 8.4209 8.21094 9.54019 8.21094 10.9209C8.21094 12.3016 9.33023 13.4209 10.7109 13.4209Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2085_2053">
                                                <rect width="20" height="20" fill="white" transform="translate(0.710938 0.920898)" />
                                            </clipPath>
                                        </defs>
                                    </svg> :
                                        <svg onClick={() => { setnewPasswordView(!newPasswordView) }} className='eye' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2085_2029)">
                                                <path d="M14.9487 14.9497C13.5242 16.0355 11.7896 16.6371 9.9987 16.6664C4.16536 16.6664 0.832031 9.99969 0.832031 9.99969C1.86861 8.06794 3.30631 6.3802 5.0487 5.0497M8.2487 3.53303C8.82231 3.39876 9.40959 3.33164 9.9987 3.33303C15.832 3.33303 19.1654 9.99969 19.1654 9.99969C18.6595 10.946 18.0562 11.837 17.3654 12.658M11.7654 11.7664C11.5365 12.012 11.2605 12.209 10.9538 12.3456C10.6472 12.4823 10.3161 12.5557 9.98044 12.5617C9.64476 12.5676 9.31133 12.5058 9.00004 12.3801C8.68875 12.2544 8.40597 12.0672 8.16857 11.8298C7.93117 11.5924 7.74403 11.3096 7.61829 10.9984C7.49255 10.6871 7.4308 10.3536 7.43673 10.018C7.44265 9.68228 7.51612 9.35123 7.65276 9.04457C7.7894 8.7379 7.98641 8.4619 8.23203 8.23303" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M0.832031 0.833008L19.1654 19.1663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2085_2029">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    }

                                    <input value={newPassword} onChange={changenewPassword} type={newPasswordView ? "password" : "text"} placeholder='#Something123' />
                                </div>
                                {newPassword && confirmPassword?
                                    <div className='password-strength-indicator' >
                                    <span>{strength}</span>
                                    <div style={strength==="Strong"?{background:"#00C49A"}:strength==="Medium"?{background:"yellow"}:{background:"red"}} className='indicator' ></div>
                                </div>:<></>
                                }
                                
                            </div>

                            <div className="input">
                                <span>Confirm Password</span>
                                <div className="input-box1">
                                    <svg className='lock' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.25 8.25H3.75C2.92157 8.25 2.25 8.92157 2.25 9.75V15C2.25 15.8284 2.92157 16.5 3.75 16.5H14.25C15.0784 16.5 15.75 15.8284 15.75 15V9.75C15.75 8.92157 15.0784 8.25 14.25 8.25Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M5.25 8.25V5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V8.25" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    {confirmPasswordView ? <svg onClick={() => { setconfirmPasswordView(!confirmPasswordView) }} className='eye' width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2085_2053)">
                                            <path d="M1.54297 10.9206C1.54297 10.9206 4.8763 4.25391 10.7096 4.25391C16.543 4.25391 19.8763 10.9206 19.8763 10.9206C19.8763 10.9206 16.543 17.5872 10.7096 17.5872C4.8763 17.5872 1.54297 10.9206 1.54297 10.9206Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M10.7109 13.4209C12.0916 13.4209 13.2109 12.3016 13.2109 10.9209C13.2109 9.54019 12.0916 8.4209 10.7109 8.4209C9.33023 8.4209 8.21094 9.54019 8.21094 10.9209C8.21094 12.3016 9.33023 13.4209 10.7109 13.4209Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2085_2053">
                                                <rect width="20" height="20" fill="white" transform="translate(0.710938 0.920898)" />
                                            </clipPath>
                                        </defs>
                                    </svg> :
                                        <svg onClick={() => { setconfirmPasswordView(!confirmPasswordView) }} className='eye' width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2085_2029)">
                                                <path d="M14.9487 14.9497C13.5242 16.0355 11.7896 16.6371 9.9987 16.6664C4.16536 16.6664 0.832031 9.99969 0.832031 9.99969C1.86861 8.06794 3.30631 6.3802 5.0487 5.0497M8.2487 3.53303C8.82231 3.39876 9.40959 3.33164 9.9987 3.33303C15.832 3.33303 19.1654 9.99969 19.1654 9.99969C18.6595 10.946 18.0562 11.837 17.3654 12.658M11.7654 11.7664C11.5365 12.012 11.2605 12.209 10.9538 12.3456C10.6472 12.4823 10.3161 12.5557 9.98044 12.5617C9.64476 12.5676 9.31133 12.5058 9.00004 12.3801C8.68875 12.2544 8.40597 12.0672 8.16857 11.8298C7.93117 11.5924 7.74403 11.3096 7.61829 10.9984C7.49255 10.6871 7.4308 10.3536 7.43673 10.018C7.44265 9.68228 7.51612 9.35123 7.65276 9.04457C7.7894 8.7379 7.98641 8.4619 8.23203 8.23303" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M0.832031 0.833008L19.1654 19.1663" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2085_2029">
                                                    <rect width="20" height="20" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>

                                    }
                                    <input value={confirmPassword} onChange={changeconfirmPassword} type={confirmPasswordView ? "password" : "text"} placeholder='#Something123' />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ div>
    )
}

export default ChangePassword;