import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { backend_url, getCookie } from '../../constant'
import { toast } from 'react-toastify'
import LeftSidePanelOfMCQBulk from '../../component/LeftSidePanelOfMCQBulk'
import NavigationBar from '../../component/NavigationBar/NavigationBar'
import LibraryCard from '../Library/Card'
import MCQBulkContext from '../../store/MCQBulkContext'
import QuestionPreviewModel from '../../component/QuestionPreviewModel/index'
import DeletePopupModel from "../../component/DeletePopupModel/DeletePopupModel";
import './index.css'
import AddedLibraryModel from '../../component/AddedLibraryModel'
import jwtDecode from 'jwt-decode'

const MCQBulkPreview = () => {
    const [deleteQuestionModel, setdeleteQuestionModel] = useState(false)
    const [selectQuestionForDelete, setselectQuestionForDelete] = useState("")
    const [selectedQuestionID, setselectedQuestionID] = useState("")
    const [selectedQuestionData, setselectedQuestionData] = useState("")
    const [displayaddedlibrary, setdisplayaddedlibrary] = useState(false)
    const [search, setsearch] = useState("")
    const [searchData, setsearchData] = useState([])
    const [searchFilter, setsearchFilter] = useState(false)
    const [loading, setloading] = useState(false)
    const [page, setpage] = useState(1)
    const [leftSideDeleteClicked, setleftSideDeleteClicked] = useState(false)
    const limit = 50;
    const BulkContext = useContext(MCQBulkContext)
    const [paginationArray, setpaginationArray] = useState([1])
    const navigate = useNavigate()

    const deleteManyQuestion = async () => {
        try {
            let deleteQuestion = [];
            BulkContext.mcqBulkData.forEach(data => {
                if (BulkContext.selectedQuestion.includes(data._id) && data.isQuestionDeleted !== "true" && data.moveToLibraryStatus !== "true") {
                    deleteQuestion.push(`${data._id}`)
                    data.isQuestionDeleted = "true"
                }
            })
            if (deleteQuestion.length > 0) {
                const token = getCookie("Xh7ERL0G")
                await axios.delete(`${backend_url}mcqbulkupload/deleteManyQuestion`, { deleteQuestion: deleteQuestion }, { token: token })
                toast('Question Deleted from Library')
            }
        } catch (error) {
            toast(error)
        }
    }

    const deleteQuestionAsPerQuestionID = async (questionID) => {
        try {
            // const filterSearchDeleteData = searchData.filter(data => data._id !== questionID._id)
            // setsearchData(filterSearchDeleteData)

            // const filterDeleteData = BulkContext?.mcqBulkData.filter(data => data._id !== questionID._id)
            // BulkContext.readDataFromS3(filterDeleteData)
            BulkContext.mcqBulkData.forEach((element) => {
                if (element._id === questionID._id) {
                    element.isQuestionDeleted = "true"
                }
            })

            const token = getCookie("Xh7ERL0G")
            await axios.post(`${backend_url}mcqbulkupload/deleteQuestion/${questionID._id}`, { token: token })
            toast('Question Deleted from Library')
        } catch (error) {
            toast(error)
        }
    }

    
    const moveToLibrary = async () => {
        const token = getCookie("Xh7ERL0G")
        const decode = jwtDecode(token)
        setloading(true)
        let bulkmcqquestion = JSON.stringify(BulkContext?.mcqBulkData)
        bulkmcqquestion = JSON.parse(bulkmcqquestion)
        let filterDeleteData = bulkmcqquestion.filter(data => BulkContext.selectedQuestion.includes(data?._id) && data.moveToLibraryStatus === "false" && data.isQuestionDeleted === "false")
        filterDeleteData = filterDeleteData.map(element => {
            let tempArray = []
            element.skillsId.forEach(element => {
                const obj = {
                    skills: '',
                    topicId: []
                }
                obj.skills = element.skills._id
                element.topicId.map((topicId) => {
                    obj.topicId.push(topicId._id)
                })
                tempArray.push(obj)
            })
            element.skillsId = tempArray
            element.topicId = element.topicId.map(data => { return data._id })
            element.status = 'complete'
            element.approved = `Approved By ${decode.fullName}`
            return element
        })
        const deleteQuestion = filterDeleteData.map(data => data._id);

        const areAllQuestionsValid = filterDeleteData.every(question => {
            // Check if there's at least one correct answer in the question
            return question.correctAnswerObjectArray.some(answer => answer);
          });

        try {
            if (filterDeleteData.length) {
                if(areAllQuestionsValid){
                const res = await axios.post(`${backend_url}question/createManyQuestion`, {
                    filterDeleteData: filterDeleteData,
                    deleteQuestion: deleteQuestion,
                    token: token
                })
                BulkContext.mcqBulkData.map((element) => {
                    if (BulkContext.selectedQuestion.includes(element?._id) && element.isQuestionDeleted === "false") {
                        element.moveToLibraryStatus = "true"
                    }
                })



                setloading(false)
                setdisplayaddedlibrary(true)
                }else{
                    toast("You have to select at least one correct answer to move library!")
                    setloading(false)
                }
            } else {
                toast("You have to select at least one question to move library!")
                setloading(false)
            }
        } catch (error) {
            setloading(false)
            BulkContext.mcqBulkData.map((element) => {
                let inserData = error.response.data.error?.insertedDocs.map((data) => {
                    if (data._id !== null) {
                        return data._id
                    }
                })
                if (inserData.includes(element?._id)) {
                    element.moveToLibraryStatus = "true"
                }
            })
            if (error.response.data.error.code === 11000) {
                toast("Question is already exits in library!")
            } else {
                toast(error.message)
            }
        }
    }

    useEffect(() => {
        getPaginationArray()
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
        // eslint-disable-next-line
    }, [])

    const getPaginationArray = () => {
        const itemsPerPage = 50;
        const totalItems = BulkContext.mcqBulkData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
    
        const paginationArray = [];
    
        for (let page = 1; page <= totalPages; page++) {
            paginationArray.push(page);
        }
        setpaginationArray(paginationArray)

    }

    const searchQuestion = () => {

        const filtersearchData = BulkContext?.mcqBulkData.filter(data => {
            let skills = data.skillsId.map(data => {
                if (data.skills.skills !== "") {
                    return data.skills.skills
                }
            })
            let topics = data.topicId.map(data => {
                if (data.topics !== "") {
                    return data.topic
                }
            })
            if (data.question.toLowerCase().includes(search.toLowerCase()) || data.Section_header.toLowerCase().includes(search.toLowerCase()) || skills.includes(search.toLowerCase()) || topics.includes(search.toLowerCase())) {
                return data
            } else {
                return
            }
        })
        if (filtersearchData.length) {
            setsearchData(filtersearchData)
            setsearchFilter(true)
        } else {
            toast("No question available")
            setsearchData([])
            setsearchFilter(true)
        }
    }

    const paginate = (array, page_size, page_number) => {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    const trackNoOfQuestionImported = () => {
        let cnt = 0;
        BulkContext.mcqBulkData.forEach(data => {
            if (data.moveToLibraryStatus === "false" && data.isQuestionDeleted === "false") {
                cnt += 1
            }
        })
        return cnt
    }

    const trackNoOfQuestionDeleted = () => {
        let cnt = 0;
        BulkContext.mcqBulkData.forEach(data => {
            if (data.isQuestionDeleted === "true") {
                cnt += 1
            }
        })
        return cnt
    }

    const previousQuestionPreview = () => {
        const allQuestionId = BulkContext.mcqBulkData.map(data => {
            if (data._id !== "") {
                return data._id
            }
        })
        const filterPreviousQuestion = BulkContext.mcqBulkData.filter(questions => questions?._id === BulkContext.previewQuestion)
        if (allQuestionId.includes(BulkContext.previewQuestion) && (filterPreviousQuestion.length ? filterPreviousQuestion[0]?.isQuestionDeleted === "false" : true)) {
            return true
        } else {
            return false
        }
    }

    const onClickQuestionPreviewButton = () => {
        if (previousQuestionPreview()) {
            BulkContext.mcqBulkData.forEach(element => {
                if (element._id === BulkContext.previewQuestion && element.moveToLibraryStatus === "false") {
                    const deletedQuestion = BulkContext.mcqBulkData.filter(question => question.isQuestionDeleted !== "true" && question._id === BulkContext.previewQuestion)
                    if (deletedQuestion.length) {
                        BulkContext.selectpreviewQuestion(deletedQuestion[0]?._id)
                    } else {
                        BulkContext.selectpreviewQuestion('')
                    }
                    navigate('/bulkimported')
                } else {
                    if (element._id === BulkContext.previewQuestion) {
                        toast("Already added question to library can't preview")
                    }
                }
            })
        } else {
            const deletedQuestion = BulkContext.mcqBulkData.filter(question => question.isQuestionDeleted !== "true")
            if (deletedQuestion.length) {
                BulkContext.selectpreviewQuestion(deletedQuestion[0]?._id)
            } else {
                BulkContext.selectpreviewQuestion('')
            }
            navigate('/bulkimported')
        }
    }

    const onClickBack = () => {
        
        if(paginationArray[0] < page){
                setpage(page - 1);
        }
            
    }

    const onClickNext = () => {
        if(paginationArray[paginationArray.length -1 ] > page){
        setpage(page + 1);
        }
    }
    return (
        <>
            <NavigationBar backToLibrary={true} />
            {/* <AddedLibraryModel/> */}

            <div className='mcq-bulk-preview-container' >
                {displayaddedlibrary &&
                    <AddedLibraryModel onclickModelOutside={() => setdisplayaddedlibrary(!displayaddedlibrary)} setdisplayaddedlibrary={() => { setdisplayaddedlibrary(!displayaddedlibrary) }} />

                }
                {deleteQuestionModel && <DeletePopupModel sectionHeader={selectQuestionForDelete.Section_header} questionNo={selectQuestionForDelete.questionIndex} cancelButton={() => setdeleteQuestionModel(false)} yesButton={() => { leftSideDeleteClicked ? deleteManyQuestion() : deleteQuestionAsPerQuestionID(selectQuestionForDelete); setdeleteQuestionModel(false) }} />
                }
                {selectedQuestionID && <QuestionPreviewModel pageName='mcqbulkupload' selectedQuestionIndex={selectedQuestionData.questionIndex + 1} page="bulkpreviewpage" onClickEdit={() => { BulkContext.selectpreviewQuestion(selectedQuestionData._id); navigate('/bulkimported') }} data={selectedQuestionData} onClickCancel={() => setselectedQuestionID("")} />
                }

                <LeftSidePanelOfMCQBulk onClickDelete={() => { setdeleteQuestionModel(!deleteQuestionModel); setleftSideDeleteClicked(true); setselectQuestionForDelete("") }} />
                <div className='question-card-container' >
                    <div className="header-container" >
                        <span>
                            <div className="libray-name-header" >All Imported Questions ({trackNoOfQuestionImported()})</div>
                            <div className='search-container'>
                                <input onKeyDown={(e) => { if (e.key === "Enter") { searchQuestion() } }} onChange={(e) => setsearch(e.target.value)} value={search} type="text" placeholder="Search Questions" />
                                {search !== "" ?
                                    <svg style={{ cursor: 'pointer' }} className="cross-icon" onClick={() => { setsearch(""); setsearchFilter(false) }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                    </svg> :
                                    <></>

                                }
                                {/* Search Icon */}

                                <svg className='search-icon' onClick={() => searchQuestion()} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0216 16.099L11.5304 12.6071C8.80795 14.7531 4.88459 14.4054 2.58198 11.8141C0.279322 9.22267 0.395334 5.2857 2.84659 2.83444C5.29785 0.383128 9.23487 0.267116 11.8262 2.56973C14.4176 4.87238 14.7653 8.7957 12.6193 11.5182L16.1104 15.0086C16.3355 15.1964 16.4352 15.4952 16.368 15.7805C16.3007 16.0658 16.078 16.2886 15.7928 16.356C15.5075 16.4235 15.2087 16.324 15.0208 16.099H15.0216ZM2.4685 7.46203C2.46779 9.47522 3.67335 11.2935 5.52854 12.0768C7.38368 12.8601 9.52758 12.456 10.9703 11.0512C10.9845 11.0338 10.9996 11.0174 11.0156 11.0019C11.0316 10.9865 11.0479 10.9715 11.0644 10.9571C12.6398 9.33918 12.9376 6.86695 11.7914 4.92121C10.6451 2.97547 8.33841 2.0376 6.15961 2.6314C3.98081 3.2252 2.46897 5.20377 2.46845 7.46203H2.4685Z" fill="#606D77" />
                                </svg>

                            </div>
                        </span>

                        <div className="button-container" >
                            <button onClick={onClickQuestionPreviewButton} >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10" r="10" fill="white" />
                                    <g clip-path="url(#clip0_2116_8684)">
                                        <path d="M13.5 10.5833V14.0833C13.5 14.3928 13.3771 14.6895 13.1583 14.9083C12.9395 15.1271 12.6428 15.25 12.3333 15.25H5.91667C5.60725 15.25 5.3105 15.1271 5.09171 14.9083C4.87292 14.6895 4.75 14.3928 4.75 14.0833V7.66667C4.75 7.35725 4.87292 7.0605 5.09171 6.84171C5.3105 6.62292 5.60725 6.5 5.91667 6.5H9.41667" stroke="#FF6812" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.75 4.75H15.25V8.25" stroke="#FF6812" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8.83203 11.1667L15.2487 4.75" stroke="#FF6812" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2116_8684">
                                            <rect width="14" height="14" fill="white" transform="translate(3 3)" />
                                        </clipPath>
                                    </defs>
                                </svg>

                                <p>Preview 1-1</p>
                            </button>



                            <button onClick={moveToLibrary} >
                                {loading ? <div className='loader' ></div> :
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="white" />
                                            <g clip-path="url(#clip0_2116_9076)">
                                                <path d="M15.8346 9.46309V9.99976C15.8339 11.2577 15.4266 12.4817 14.6734 13.4892C13.9202 14.4967 12.8616 15.2337 11.6553 15.5904C10.449 15.947 9.1597 15.9042 7.97974 15.4683C6.79978 15.0323 5.79235 14.2267 5.1077 13.1714C4.42304 12.1161 4.09785 10.8678 4.18061 9.61261C4.26338 8.35742 4.74967 7.16262 5.56697 6.20638C6.38426 5.25015 7.48876 4.58373 8.71575 4.30651C9.94273 4.02929 11.2265 4.15612 12.3755 4.66809" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M15.8333 5.33301L10 11.1722L8.25 9.42217" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2116_9076">
                                                    <rect width="14" height="14" fill="white" transform="translate(3 3)" />
                                                </clipPath>
                                            </defs>
                                        </svg>


                                        <p>Move To Library</p>
                                    </>
                                }

                            </button>
                        </div>
                    </div>

                    {/*question card */}
                    <div className="library1-container" >
                        {searchFilter && search ?
                            <>
                                {trackNoOfQuestionImported() != 0 ?
                                    <>
                                        {searchData.length ?
                                            <>
                                                {searchData.map((data, index) => {
                                                    if (data.moveToLibraryStatus === "false" && data.isQuestionDeleted === "false") {

                                                        return (
                                                            <LibraryCard onClickQuestion={(data) => { setselectedQuestionID(data._id); setselectedQuestionData(data) }} deleteQuestionAsPerQuestionID={() => { setdeleteQuestionModel(!deleteQuestionModel); setselectQuestionForDelete(data._id); setleftSideDeleteClicked(false) }} name="mcqbulkpreview" questionNo={data?.questionIndex} key={index} data={data} />
                                                        )
                                                    }
                                                })

                                                }
                                            </>
                                            :
                                            <div style={{ textAlign: 'center' }} >No question available</div>

                                        }

                                    </> :
                                    <>
                                        {trackNoOfQuestionDeleted() === BulkContext.mcqBulkData.length ?
                                            <span>All question have been deleted from excel</span> :
                                            <span>All Questions have been added to My library <a href='' style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/library')} >Go To My Library</a></span>

                                        }
                                    </>

                                }

                            </> :
                            <>
                                {trackNoOfQuestionImported() != 0 ?
                                    <>
                                        {BulkContext?.mcqBulkData.length ?
                                            <>
                                                {paginate(BulkContext?.mcqBulkData, limit, page).map((data, index) => {
                                                    if (data.moveToLibraryStatus === "false" && data.isQuestionDeleted === "false") {
                                                        return (
                                                            <LibraryCard onClickQuestion={(data) => { setselectedQuestionID(data._id); setselectedQuestionData(data) }} deleteQuestionAsPerQuestionID={() => { setdeleteQuestionModel(!deleteQuestionModel); setselectQuestionForDelete(data); setleftSideDeleteClicked(false) }} name="mcqbulkpreview" questionNo={data?.questionIndex} key={index} data={data} />
                                                        )
                                                    }
                                                })

                                                }
                                            </> : <div style={{ textAlign: 'center' }} >No question available</div>

                                        }

                                    </> :
                                    <>
                                        {trackNoOfQuestionDeleted() === BulkContext.mcqBulkData.length ?
                                            <span>All question have been deleted from excel</span> :
                                            <span>All Questions have been added to My library <a href='' style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => navigate('/library')} >Go To My Library</a></span>

                                        }
                                    </>
                                }

                            </>

                        }

                    </div>
                    {/* <LibraryCard  /> */}
                    {BulkContext.mcqBulkData.length > 50 ?
                        <div className='pagination-container' >

                            <button onClick={onClickBack} >
                                <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M2.41421 6L6.70711 10.2929C7.09763 10.6834 7.09763 11.3166 6.70711 11.7071C6.31658 12.0976 5.68342 12.0976 5.29289 11.7071L0.292893 6.70711C-0.0976311 6.31658 -0.0976311 5.68342 0.292893 5.29289L5.29289 0.292893C5.68342 -0.0976311 6.31658 -0.0976311 6.70711 0.292893C7.09763 0.683418 7.09763 1.31658 6.70711 1.70711L2.41421 6Z" fill="white" />
                                </svg>

                            </button>

                            {paginationArray.map((data) => {
                                return (
                                    <button onClick={() => setpage(data)} style={page === data ? { background: '#00C49A', color: 'white', border: 'none' } : { background: 'transparent', borderColor: '#C2C2C7' }} >
                                        {data}
                                    </button>
                                )
                            })

                            }

                            <button onClick={onClickNext} >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.5858 12L9.29289 7.70711C8.90237 7.31658 8.90237 6.68342 9.29289 6.29289C9.68342 5.90237 10.3166 5.90237 10.7071 6.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L10.7071 17.7071C10.3166 18.0976 9.68342 18.0976 9.29289 17.7071C8.90237 17.3166 8.90237 16.6834 9.29289 16.2929L13.5858 12Z" fill="white" />
                                </svg>

                            </button>
                        </div> : <></>
                    }
                </div>
            </div>
        </>
    )
}

export default MCQBulkPreview