import './index.css'
const ProfileSkeletonLoading=()=>{
    return(
        <div className="profile-loading-form" >
        <div className='profile-img skeleton ' ></div>
        <div style={{marginTop:29}} className="name-email-input-container" >
            <div className="name-input-container" >
                <label className='component-label skeleton' ></label>
                <div className="name-input-box" >
                    <div className='loading-svg skeleton' ></div>
                    <div className='loading-input skeleton' />
                </div>
            </div>

            <div className="name-input-container" >
                <label className='component-label skeleton' ></label>
                <div className="name-input-box" >
                <div className='loading-svg skeleton' ></div>
                  
                    <div className='loading-input skeleton' />
                
                </div>
                
            </div>

        </div>

        <div className="name-email-input-container" >
            <div className="name-input-container" >
                <label className='component-label skeleton' ></label>
                <div className="name-input-box" >

                    <div className='loading-input skeleton' />
                </div>
            </div>

            <div className="name-input-container" >
                <label className='component-label skeleton' ></label>
                <div className="name-input-box" >
                    <div className='loading-input skeleton' />
                </div>
            </div>

        </div>



    </div>
        )
}

export default ProfileSkeletonLoading