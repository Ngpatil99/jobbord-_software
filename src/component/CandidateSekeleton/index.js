import './index.css'

const CandidateCardSkeleton = (props) => (
    <div className='candidate-loader-card-container'>
        <div className='left-side'  >
            <div className='header skeleton' />
            <div className='bottom-container ' >
                <div className='box skeleton' style={{
                    width: "10vw"
                }} />
                <div className='box skeleton' style={{
                    width: "15vw"
                }} />
                {props.page === "shortlisted" ? <div className='box skeleton' style={{
                    width: "15vw"
                }} /> : null}
            </div>
            {props.page === "testtaken" ? <div className='bottom-container ' >
                <div className='box skeleton' />
            </div> : null}
        </div>

        <div className='right-side' >
            <div className="bottom-container " >
                <button className='skeleton' ></button>
                <button className='skeleton' ></button>
                {props.page === "shortlisted" ? null : <button className='skeleton' ></button>}
            </div>
        </div>


    </div>
)

export default CandidateCardSkeleton