import React from 'react'
import './index.css'
import avatar2 from '../../assets/icon/avatar.svg'
import save from "../../assets/icon/save.svg";
import ProfileSidebar from '../../component/ProfileSidebar';
import NavigationBar from '../../component/NavigationBar/NavigationBar';

const UserProfile=()=> {
    return (
        <>
        <NavigationBar/>
        <div className='profile-main-container' >
        <ProfileSidebar active="profile" />
        <div className="temp">
            <div className="profile-container">

                <div className="header">
                    <div className="title">
                        {/* <img src={avatar} alt="" /> */}
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M24 24C25.1046 24 26 23.1046 26 22C26 20.8954 25.1046 20 24 20C22.8954 20 22 20.8954 22 22C22 23.1046 22.8954 24 24 24ZM24 26C26.2091 26 28 24.2091 28 22C28 19.7909 26.2091 18 24 18C21.7909 18 20 19.7909 20 22C20 24.2091 21.7909 26 24 26Z" fill="#00C49A" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M30.5588 31.5488C32.6672 29.7154 34 27.0134 34 24C34 18.4772 29.5228 14 24 14C18.4772 14 14 18.4772 14 24C14 27.0134 15.3328 29.7154 17.4412 31.5488C19.1969 33.0756 21.4905 34 24 34C26.4162 34 28.6323 33.143 30.3609 31.7165C30.4276 31.6614 30.4936 31.6055 30.5588 31.5488ZM24.2579 31.9959C24.1723 31.9986 24.0863 32 24 32C23.9914 32 23.9827 32 23.9741 32C23.8937 31.9997 23.8135 31.9983 23.7337 31.9956C22.3914 31.9517 21.1327 31.5772 20.0365 30.9508C20.9518 29.7632 22.3882 29 24 29C25.6118 29 27.0482 29.7632 27.9634 30.9508C26.865 31.5785 25.6033 31.9533 24.2579 31.9959ZM29.5624 29.7498C28.2832 28.0781 26.2675 27 24 27C21.7325 27 19.7168 28.0781 18.4376 29.7498C16.9345 28.2953 16 26.2568 16 24C16 19.5817 19.5817 16 24 16C28.4183 16 32 19.5817 32 24C32 26.2568 31.0655 28.2953 29.5624 29.7498Z" fill="#00C49A" />
                        </svg>

                        <div className="group">
                            <span>Profile</span>
                            <p>Update your Profile photo and details</p>
                        </div>
                    </div>

                    <button className="save">
                        <img src={save} alt="save" />
                        Save
                    </button>
                </div>
                <div className="profile-pic">
                    <img src={avatar2} alt="" />
                </div>
                <div className="profile-form">
                    <div className="row">
                        <div className="input">
                            <span>Name</span>
                            <input type="text" placeholder='Person Name Here' />
                            <svg className='user' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 15V13.5C15 12.7044 14.6839 11.9413 14.1213 11.3787C13.5587 10.8161 12.7957 10.5 12 10.5H6C5.20435 10.5 4.44129 10.8161 3.87868 11.3787C3.31607 11.9413 3 12.7044 3 13.5V15" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M9 7.5C10.6569 7.5 12 6.15685 12 4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5C6 6.15685 7.34315 7.5 9 7.5Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <div className='errorMessage'></div>
                        </div>
                        <div className="input">
                            <span>Email</span>
                            <input type="text" placeholder='Somehting@something.com' />
                            <svg className='mail' width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3H15C15.825 3 16.5 3.675 16.5 4.5V13.5C16.5 14.325 15.825 15 15 15H3C2.175 15 1.5 14.325 1.5 13.5V4.5C1.5 3.675 2.175 3 3 3Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M16.5 4.5L9 9.75L1.5 4.5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                            <div className='errorMessage'></div>
                        </div>
                    </div>
                    <div className="row2">
                        <div className="input">
                            <span>Username</span>
                            <input type="text" placeholder='@something_here' />
                            <div className='errorMessage'></div>
                        </div>
                        <div className="input">
                            <span>Job Title</span>
                            <input type="text" placeholder='Senior Database Engineer' />
                            <div className='errorMessage'></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        </>
    )
}

export default UserProfile