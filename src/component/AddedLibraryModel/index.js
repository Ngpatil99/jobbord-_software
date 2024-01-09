import React,{useContext} from "react";
import './index.css'
import MCQBulkContext from '../../store/MCQBulkContext'

const AddedLibraryModel = (props) => {
    const BulkContext = useContext(MCQBulkContext)

    const getMovedToLibraryCount=()=>{
        let cnt=0;
        BulkContext.mcqBulkData.forEach((data)=>{
            if(data.moveToLibraryStatus ==="true" && BulkContext.selectedQuestion.includes(data._id)){
                cnt+=1
            }
        })
        return cnt
    }
   
    return (
        <div onClick={(e) => { e.stopPropagation(); props.onclickModelOutside() }} className="added-library-container" >
            <div className='added-library-popup' >
                <svg style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); props.setdisplayaddedlibrary(); }} className='canel-icon' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                </svg>

                <div className='card' >
                    <svg width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="25.5" cy="25" r="25" fill="#00C49A" />
                        <path d="M33.8346 24.2335V25.0002C33.8336 26.7972 33.2517 28.5458 32.1757 29.9851C31.0998 31.4244 29.5874 32.4773 27.8641 32.9868C26.1408 33.4963 24.299 33.4351 22.6134 32.8124C20.9277 32.1896 19.4885 31.0386 18.5104 29.5311C17.5324 28.0236 17.0678 26.2403 17.186 24.4471C17.3043 22.654 17.999 20.9472 19.1665 19.5811C20.3341 18.2151 21.912 17.263 23.6648 16.867C25.4176 16.471 27.2515 16.6522 28.893 17.3835" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M33.8333 18.333L25.5 26.6747L23 24.1747" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <label>{!props.selectIndex&&getMovedToLibraryCount()} Question{props.selectIndex?`.${props.selectIndex}`:'s'} Added to library!</label>
                    <p>{!props.selectIndex&&getMovedToLibraryCount()} Question{props.selectIndex?`.${props.selectIndex}`:'s'} added to library. You can find it in my<br /> library section of library</p>
                </div>
            </div>
        </div>
    )
}

export default AddedLibraryModel