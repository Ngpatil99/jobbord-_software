import './index.css'

const AssesmentCardSkeleton = () => (
    <div className='loader-card-container '>
        <div className='left-side'  >
            <div className='header skeleton' >
                <span></span>
                <button className='status-button skeleton'>
                    <div className='circle skeleton'>
                        {/* Document Icon */}
                        <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                        </svg>
                    </div>
                    <span></span>
                </button>

            </div>
            <p className='info skeleton' ></p>
            <div className='bottom-container ' >
                <div className='toggle skeleton' ></div>
                <div className='box skeleton' >

                </div>
                <div className='box skeleton' >

                </div>
                <div className='box skeleton'>

                </div>


                <div className='box skeleton'>

                </div>


            </div>
        </div>

        <div className='right-side' >
            <div className='header' >
                <span className='skeleton' ></span>
                <p className='skeleton' ></p>
            </div>
            <div className="bottom-container " >
                <button className='skeleton' ></button>
                <button className='skeleton' ></button>
                <button className='skeleton' ></button>

            </div>
        </div>


    </div>
)

export default AssesmentCardSkeleton