import './index.css'

const LibraryCardSkeleton = (props) => {
    return (
        <div className='library-card-container' style={props?.from === "overview" ? { border: "1px solid #E3E3E3" } : null}>
            <div className='library-header-container ' >
                <button className='skeleton-status-button skeleton'>

                </button>
                <label className='header skeleton' ></label>
            </div>

            <p className='p-box skeleton' ></p>
            <div className='border' ></div>
            <div className='library-bottom-container' >
                <div className='library-left-side' >
                    <span className='bottom-spam skeleton' >

                    </span>

                    <div className='card-border' ></div>

                    <span className='bottom-spam skeleton' >

                    </span>

                    <span className='bottom-spam skeleton' >

                    </span>
                </div>

                <div className='library-right-side' >
                    <span className='box-right-span skeleton'   >


                    </span>
                    <span className='box-right-span skeleton' >


                    </span>
                    <div className='card-border' ></div>
                    <div className='skeleton-library-name-container skeleton' ></div>
                    <div className='card-border' ></div>
                    <label className='right-label skeleton' ></label>
                </div>
            </div>
        </div>
    )
}

export default LibraryCardSkeleton