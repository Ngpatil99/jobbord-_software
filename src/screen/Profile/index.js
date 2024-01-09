import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backend_url,getCookie,deleteAllCookie,setCookie } from "../../constant";
import { toast } from 'react-toastify'
import jwtDecode from "jwt-decode";
import { useNavigate } from 'react-router-dom'
import './index.css';
import NavigationBar from '../../component/NavigationBar/NavigationBar'
import defaultProfile from '../../assets/icon/profileDefaultIcon.svg'
import ProfileSidebar from "../../component/ProfileSidebar";
import ProfileSkeletonLoading from "./ProfileSkeletonLoading";
import LogoutUser from "../../component/LogoutUser";
const Profile = () => {
    const hiddenFileInput = useRef(null)
    const [profileImage, setprofileImage] = useState("")
    const [name, setname] = useState("")
    const [username, setusername] = useState("")
    const [jobTitle, setjobTitle] = useState("")
    const [email, setemail] = useState("")
    const [loading, setloading] = useState(true)
    const [loadingDp, setloadingDp] = useState(false)
    const [saveloader, setsaveloader] = useState(false)
    const [profileDp, setProfileDp] = useState(false)
    const [jobTitleData, setjobTitleData] = useState([])
    const [showLogoutPopup, setshowLogoutPopup] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        getJobTitle()
        getProfileData()
    }, [])

    const getJobTitle = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const jobtitleResponse = await axios.get(`${backend_url}department/`, { headers: { "token": token } })
            setjobTitleData(jobtitleResponse.data.data)
        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const getProfileData = async () => {
        try {

            const token = getCookie("Xh7ERL0G")
            const decode = jwtDecode(token)
            const userProfileResponse = await axios.get(`${backend_url}eqa/find/${decode?.user_id}`, { headers: { "token": token } })
            setloading(false)
            setname(userProfileResponse.data.data.fullName)
            setemail(userProfileResponse.data.data.email)
            setjobTitle(userProfileResponse.data.data.departmentId?._id)
            setusername(userProfileResponse.data.data.userName)
            setprofileImage(userProfileResponse.data.data.profileUrl ? userProfileResponse.data.data.profileUrl : "")


        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const handleChange = async (event) => {
        try {
            setloadingDp(true)
            const fileUploaded = event.target.files[0];
            const token = getCookie("Xh7ERL0G")
            const uploadURL = await axios.get(`${backend_url}S3Url`,{headers: { "token": token }})
            await axios.request({
                method: "PUT",
                headers: {
                    "Content-Type": fileUploaded.type
                },
                url: uploadURL.data.uploadURL,
                data: fileUploaded,
            })
            const imageURL = uploadURL.data.uploadURL.split('?')[0]
            setloadingDp(false)
            setprofileImage(imageURL)
            
        } catch (error) {
            setloadingDp(false)
            toast(`${error}`, {
                className: 'toast-message'
            })
        }

    };

    const saveUserProfile = async () => {
        try {
            setsaveloader(true)
            const token = getCookie("Xh7ERL0G")
            const decode = jwtDecode(token)
            await axios.put(`${backend_url}eqa/update/${decode.user_id}`, {
                fullName: name,
                email: email,
                userName: username,
                departmentId: jobTitle,
                profileUrl: profileImage,
                client: decode.client._id
            }, { headers: { "token": token } })
            setCookie('Profile',profileDp)
            setTimeout(() => {
                setsaveloader(false)
            }, 1000)
            setProfileDp(!profileDp)
            toast("Success. Your Details has been saved", {
                className: 'toast-message'
            })

        } catch (error) {
            setsaveloader(false)
            toast(`${error.message}`, {
                className: 'toast-message'
            })
        }
    }

    function isEmail(val) {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;//eslint-disable-line
        if (!regEmail.test(val)) {
            return 'Invalid Email';
        }
    }

    const handleClick = event => {
        event.stopPropagation()
        hiddenFileInput.current.click();
    };

    return (
        <>
            {!loadingDp ? <input type="file"
                ref={hiddenFileInput}
                accept="image/x-png,image/gif,image/jpeg"
                onChange={handleChange}
                style={{ display: 'none' }}
            /> : <></>}
            <div className="userprofile-container" >
                <NavigationBar profileDp={profileDp} />
                {showLogoutPopup ? <LogoutUser onClickNo={() => setshowLogoutPopup(false)} onClickYes={() => { toast("Log out user sucessfully!"); deleteAllCookie();window.open("https://theeliteqa.com/", "_self") }} /> : <></>}
                <div className="left-right-container" >
                    <ProfileSidebar onClickLogoutOption={() => setshowLogoutPopup(true)} active="profile" />
                    <div className="right-side-container" >

                        <div className="header-container" >
                            <div className="left-side-header" >
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M24 24C25.1046 24 26 23.1046 26 22C26 20.8954 25.1046 20 24 20C22.8954 20 22 20.8954 22 22C22 23.1046 22.8954 24 24 24ZM24 26C26.2091 26 28 24.2091 28 22C28 19.7909 26.2091 18 24 18C21.7909 18 20 19.7909 20 22C20 24.2091 21.7909 26 24 26Z" fill="#00C49A" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M30.5588 31.5488C32.6672 29.7154 34 27.0134 34 24C34 18.4772 29.5228 14 24 14C18.4772 14 14 18.4772 14 24C14 27.0134 15.3328 29.7154 17.4412 31.5488C19.1969 33.0756 21.4905 34 24 34C26.4162 34 28.6323 33.143 30.3609 31.7165C30.4276 31.6614 30.4936 31.6055 30.5588 31.5488ZM24.2579 31.9959C24.1723 31.9986 24.0863 32 24 32C23.9914 32 23.9827 32 23.9741 32C23.8937 31.9997 23.8135 31.9983 23.7337 31.9956C22.3914 31.9517 21.1327 31.5772 20.0365 30.9508C20.9518 29.7632 22.3882 29 24 29C25.6118 29 27.0482 29.7632 27.9634 30.9508C26.865 31.5785 25.6033 31.9533 24.2579 31.9959ZM29.5624 29.7498C28.2832 28.0781 26.2675 27 24 27C21.7325 27 19.7168 28.0781 18.4376 29.7498C16.9345 28.2953 16 26.2568 16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 26.2568 31.0655 28.2953 29.5624 29.7498Z" fill="#00C49A" />
                                </svg>
                                <span>
                                    <label>Profile</label><br />
                                    <p>Update your Profile photo and details</p>
                                </span>
                            </div>

                            <button style={{ cursor: 'pointer' }} onClick={() => saveUserProfile()} >
                                {saveloader ? <div className="loader"></div> :

                                    <>
                                        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10.4388" cy="10.6055" r="10" transform="rotate(-0.456831 10.4388 10.6055)" fill="white" />
                                            <g clip-path="url(#clip0_2313_2836)">
                                                <path d="M16.0093 10.0086L16.0136 10.5452C16.0229 11.8031 15.6254 13.0303 14.8803 14.0438C14.1351 15.0572 13.0824 15.8027 11.8789 16.169C10.6755 16.5352 9.38597 16.5027 8.20257 16.0762C7.01917 15.6497 6.00535 14.8521 5.3123 13.8023C4.61926 12.7525 4.28412 11.5068 4.35688 10.251C4.42963 8.9952 4.90638 7.79655 5.71602 6.83384C6.52567 5.87112 7.62482 5.19591 8.84956 4.90892C10.0743 4.62192 11.359 4.73852 12.512 5.24131" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M15.9757 5.87801L10.1891 11.7635L8.42518 10.0275" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2313_2836">
                                                    <rect width="14" height="14" fill="white" transform="translate(3.125 3.64746) rotate(-0.456831)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <span>Save</span>
                                    </>
                                }
                            </button>
                        </div>

                        <div className="border" >

                        </div>
                        {loading ? <ProfileSkeletonLoading /> :


                            <div className="form" >
                                 {!loadingDp ?<div className="profile-image-container" >
                                    <img style={{ cursor: 'pointer' }} onClick={(e) => handleClick(e)} src={profileImage !== "" ? profileImage : defaultProfile} alt="" />
                                    <span onClick={(e) => handleClick(e)} className="change-profile-header" >change</span>
                                </div>:<div className="loader"  style={{width:"128px", height:"128px"}}  ></div>}
                                <div style={{ marginTop: 29 }} className="name-email-input-container" >
                                    <div className="name-input-container" >
                                        <label>Name</label>
                                        <div className="name-input-box" >
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M15 15V13.5C15 12.7044 14.6839 11.9413 14.1213 11.3787C13.5587 10.8161 12.7957 10.5 12 10.5H6C5.20435 10.5 4.44129 10.8161 3.87868 11.3787C3.31607 11.9413 3 12.7044 3 13.5V15" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M9 7.5C10.6569 7.5 12 6.15685 12 4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5C6 6.15685 7.34315 7.5 9 7.5Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <input value={name} onChange={(e) => setname(e.target.value)} placeholder="Person Name Here" />

                                        </div>
                                    </div>

                                    <div className="name-input-container" >
                                        <label>Email</label>
                                        <div className="name-input-box" >
                                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 3H15C15.825 3 16.5 3.675 16.5 4.5V13.5C16.5 14.325 15.825 15 15 15H3C2.175 15 1.5 14.325 1.5 13.5V4.5C1.5 3.675 2.175 3 3 3Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M16.5 4.5L9 9.75L1.5 4.5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>

                                            <input value={email} onChange={(e) => setemail(e.target.value)} placeholder="Something@something.com" />
                                        </div>
                                        {email !== "" ?
                                            <span  >{isEmail(email)}</span> : <></>
                                        }
                                    </div>

                                </div>

                                <div className="name-email-input-container" >
                                    <div className="name-input-container" >
                                        <label>Username</label>
                                        <div className="name-input-box" >

                                            <input value={username} onChange={(e) => setusername(e.target.value)} placeholder="Person Name Here" />
                                        </div>
                                    </div>

                                    <div className="name-input-container" >
                                        <label>Job Title</label>
                                        <div className="name-input-box" >
                                            <select value={jobTitle} onChange={(e) => { setjobTitle(e.target.value) }} >
                                                <option value="">Select Job Title</option>
                                                {jobTitleData?.map((jobtitledata, index) => {
                                                    return (
                                                        <option key={index} label={jobtitledata.department} value={jobtitledata._id} />
                                                    )
                                                })

                                                }
                                            </select>
                                        </div>
                                    </div>

                                </div>



                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile