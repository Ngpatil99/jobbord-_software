import React, { useEffect, useState, useContext } from "react";
import { backend_url, getCookie } from "../../constant";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import jwtDecode from "jwt-decode";
import ReactTooltip from 'react-tooltip';
import './index.css';
import user from '../../assets/icon/appared.svg';
import logo from '../../assets/icon/companylogo.svg';
import DashboardCard from "../../component/DashboardCard";
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import Card from './Card/Card';
import qualified from '../../assets/icon/qualified.svg';
import TestCardSkeleton from "../../component/TestCardSkeleton";
import QuestionTypeModel from "../../component/QuestionTypeModel";
import TestTypeModel from "../../component/TestTypeModel";
import { toast } from "react-toastify";
import CreateTestContext from '../../store/CreateTestContext'
import CandidateInvite from "../../component/CandidateInvitePopup";
import AddQuestionPopup from '../../component/AddQuestionPopup';
let cancelToken;

const Dashboard = () => {
    const navigate = useNavigate()
    const context = useContext(CreateTestContext)
    const [loadingArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    const [loading, setloading] = useState(false)
    const [testData, settestData] = useState([])
    const [dashboardData, setdashboardData] = useState({ invitesUsed: "", companyTest: "", candidateAppear: "", candidateSelected: "" })
    const [searchText, setsearchText] = useState("")
    const [searchPage, setsearchPage] = useState(1)
    const [paginationStopForSearch, setpaginationStopForSearch] = useState(true)
    const [searchLoading, setsearchLoading] = useState(false)
    const [searchData, setsearchData] = useState([])
    const [searchFilter, setsearchFilter] = useState(false)
    const [createQuestion, setcreateQuestion] = useState(false)
    const [sendInvitePopup, setSendInvitePopup] = useState(false)
    const [createAssessment, setCreateAssessment] = useState(false);
    const [searchResultCount, setsearchResultCount] = useState('')
    const [loadingforDashboard, setloadingforDashboard] = useState(true)
    const [loadingforAssessmentData, setloadingforAssessmentData] = useState(true)
    const [paginationLoading, setpaginationLoading] = useState(false)
    const [questionPopup, setQuestionPopup] = useState(false)
    const [finishStatus, setfinishStatus] = useState(false);
    const [testId, settestID] = useState('')
    const [singleTestData, setsingleTestData] = useState({})
    const [departmentDetails,setdepartmentDetails]=useState({})

    const onBackButtonEvent = (e) => {
        e.preventDefault();
        if (!finishStatus) {
            setCreateAssessment(false)
            context.clearState()
            window.history.pushState(null, null, window.location.pathname);
        }
    }

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
        window.addEventListener('popstate', onBackButtonEvent);

        getJobROle();
        getExperince();
        getAllTest();
        getDashboardData();
        return () => {
            if (cancelToken) {
                cancelToken.cancel("Operations cancelled due to new request");
            }
            cancelToken = axios.CancelToken.source();
            window.removeEventListener('popstate', onBackButtonEvent);
        }
    }, []);

    const getJobROle = async () => {
        setloading(true)
        try {
            const token = getCookie("Xh7ERL0G")
            const decode = jwtDecode(token)
            setdepartmentDetails(decode.role.inviteAssigned)
            const res = await axios.get(`${backend_url}jobrole/getroleTable`, { headers: { "token": token } })
            context.setJobRoleData(res.data.roleTables)

        } catch (error) {
            setloading(false)
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const getExperince = async () => {
        setloading(true)
        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get(`${backend_url}experience/getAll`, { headers: { "token": token } })
            context.setexprienceData(res.data.data)

        } catch (error) {
            setloading(false)
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const getAllTest = async () => {
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);

        setloadingforAssessmentData(true);
        try {
            const res = await axios.get(`${backend_url}test/getTestsAsPerUser/${decode.user_id}?page=1&limit=6`, { headers: { "token": token } });
            settestData(res.data.data);
            setloadingforAssessmentData(false)
        } catch (error) {
            setloadingforAssessmentData(false);

        }
    };

    const getDashboardData = async () => {
        setloadingforDashboard(true);
        try {
            const token = getCookie("Xh7ERL0G");
            const decode = jwtDecode(token);
            const res = await axios.get(`${backend_url}dashboard/${decode.user_id}`, { headers: { "token": token } });

            let appearedCount = 0;
            let qualifiedCount = 0;
            res.data.invitesData.forEach(data => {
                data.status.forEach(status => {
                    switch (status.currentStatus) {
                        case "appeared":
                            appearedCount++;
                            break;
                    }
                })

            });


            setdashboardData((prev) => ({ ...prev, invitesUsed: res.data.invitesData.length, companyTest: res.data.assement, candidateAppear: appearedCount, candidateSelected: res.data.qualified }));

            setloadingforDashboard(false)
        } catch (error) {
            setloadingforDashboard(false);

        }
    };

    const searchTest = (page) => {

        return new Promise(async (resolve, reject) => {
            setsearchLoading(true);
            if (cancelToken) {
                cancelToken.cancel("Operations cancelled due to new request");
            }
            cancelToken = axios.CancelToken.source();

            try {
                if (searchText === "") {
                    toast("Please enter search assessment");
                    setsearchLoading(false);
                    reject("Please enter search assessment");
                } else {
                    const token = getCookie("Xh7ERL0G");
                    const decoed = jwtDecode(token);
                    const res = await axios.post(
                        `${backend_url}test/searchTest?page=${page || searchPage}&limit=6`,
                        {
                            searchText: searchText.toLowerCase(),
                            status: [],
                            testInviteOnly: undefined,
                            testType: [],
                            startDate: undefined,
                            endDate: undefined,
                            selectedCreatedBy: undefined,
                            userId: decoed.user_id,
                        },
                        { cancelToken: cancelToken.token, headers: { token } }
                    );
                    if (res.data.data.length < 6) {
                        setpaginationStopForSearch(false);
                    }

                    if (!page) {
                        setsearchPage((prev) => prev + 1);
                    }
                    setsearchResultCount(res.data.NoOfRecord);

                    if (searchPage > 1) {
                        if (page === undefined) {
                            res.data.data.forEach((data) => {
                                setsearchData((prev) => [...prev, data]);
                            });
                        } else {
                            setsearchData(res.data.data);
                        }

                    } else {
                        setsearchData(res.data.data);
                    }
                    setsearchFilter(true);
                    setsearchLoading(false);
                    resolve(res.data);

                }
            } catch (error) {
                setsearchFilter(true);
                setsearchLoading(false);
                reject(error);
            }
        });
    };

    const closeQuestionTypeModel = () => {
        setcreateQuestion(false);
    };

    const closeAssessmentModel = () => {
        setCreateAssessment(false);
    };

    const closePopup = (e) => {
        e.stopPropagation();
        setCreateAssessment(false)
        setcreateQuestion(false)

    }

    const clickAssessment = (e) => {
        e.stopPropagation();
        setCreateAssessment(true)
    }

    const clickQuestion = (e) => {
        e.stopPropagation();
        setcreateQuestion(true)
    }

    const onHandleScroll = async (e) => {
        e.persist();
        if (Math.abs(e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)) <= 1) {

            if (searchFilter && searchText !== "" && paginationStopForSearch) {
                if (paginationStopForSearch) {
                    setpaginationLoading(true)
                    searchTest()
                        .then((result) => {
                            setpaginationLoading(false)
                        })
                        .catch((error) => { setpaginationLoading(false) });
                }
            }
        }

    }


    useEffect(() => {
        setsearchPage(1)
        setpaginationStopForSearch(true)
    }, [searchText])
    const closeQuestionPopup = () => {
        setQuestionPopup(!questionPopup)
    }
    return (
        <div  >
            <ReactTooltip />
            <NavigationBar active="dashboard" />
            {sendInvitePopup && <CandidateInvite testData={singleTestData} testId={testId} invitedCandidate={() => { getAllTest(); setSendInvitePopup(false) }} open={() => { setSendInvitePopup(true) }} closePopup={() => { setSendInvitePopup(false) }} />}
            {createQuestion && <QuestionTypeModel closeQuestionTypeModel={closeQuestionTypeModel} questionPopUp={closeQuestionPopup} />}
            {createAssessment && <TestTypeModel closeAssessmentModel={closeAssessmentModel} />}
            {questionPopup ? <AddQuestionPopup closequestionPopUp={closeQuestionPopup} closeQuestionTypeModel={closeQuestionTypeModel} from="dashboard" /> : null}

            <div className="container" onScroll={onHandleScroll} style={createQuestion || createAssessment ? { overflow: 'hidden' } : {}}>
                <div className="cardContainer" >
                    <div className="inviteCardMainContainer" >
                        <div data-tip="Invite Used" className="inviteCard" >
                            <span  >Invites Used<br />{loadingforDashboard ? <div className="loader" ></div> : <b>{dashboardData.candidateAppear}/{departmentDetails}</b>}</span>
                            {loadingforDashboard ? <div></div> : <meter id="disk_d" value={(dashboardData.candidateAppear / 10000).toFixed(2)}>100%</meter>}
                        </div>
                        <div className="icon-container" >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                        </div>
                    </div>
                    <DashboardCard logo={logo} background="#384455" header="Total Assessments" value={loadingforDashboard ? "loading" : dashboardData.companyTest} />

                    <DashboardCard logo={qualified} background="#384455" header="Total Appeared" value={loadingforDashboard ? "loading" : dashboardData.candidateAppear} />
                    <DashboardCard logo={user} background="#384455" header="Total Qualified" value={loadingforDashboard ? "loading" : dashboardData.candidateSelected} />
                </div>
                <div className="buttonContainer" >
                    <div>
                        {searchFilter && searchText ?
                            <span style={{ width: '17.5vw' }} >Search Assessments ({searchResultCount})</span> :
                            <span style={{ width: '17.5vw' }} >Recent Assessments ({testData.length})</span>

                        }
                        <div className="dashboard-search-container" >
                            <svg onClick={() => searchTest(1)} style={{ cursor: 'pointer' }} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0225 16.0985L11.5314 12.6066C8.80893 14.7527 4.88556 14.4049 2.58295 11.8136C0.280299 9.22218 0.39631 5.28521 2.84757 2.83395C5.29883 0.38264 9.23585 0.266628 11.8272 2.56924C14.4186 4.87189 14.7663 8.79521 12.6203 11.5177L16.1114 15.0081C16.3365 15.1959 16.4362 15.4947 16.3689 15.78C16.3017 16.0653 16.079 16.2881 15.7937 16.3556C15.5085 16.423 15.2096 16.3235 15.0217 16.0985H15.0225ZM2.46881 7.4614C2.4681 9.4746 3.67365 11.2929 5.52884 12.0762C7.38399 12.8595 9.52788 12.4554 10.9706 11.0505C10.9848 11.0332 10.9999 11.0168 11.0159 11.0013C11.0319 10.9859 11.0482 10.9709 11.0647 10.9564C12.6401 9.33856 12.9379 6.86632 11.7917 4.92058C10.6454 2.97484 8.33872 2.03697 6.15992 2.63078C3.98111 3.22458 2.46928 5.20315 2.46876 7.4614H2.46881Z" fill="#606D77" />
                            </svg>
                            <input onKeyDown={(e) => { if (e.key === "Enter") { searchTest(1) } }} onChange={(e) => setsearchText(e.target.value)} value={searchText} type="text" placeholder="Search assessments" />

                            {searchText !== "" ?
                                <svg onClick={() => { setsearchText(""); setsearchFilter(false) }} style={{ right: 50, cursor: 'pointer' }} width="12" height="12" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                </svg> :
                                <></>
                            }


                        </div>
                        {/* <div className='dashboard-search-container'>
                            
                            <svg className="search-icon" onClick={() => searchTest()} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0216 16.099L11.5304 12.6071C8.80795 14.7531 4.88459 14.4054 2.58198 11.8141C0.279322 9.22267 0.395334 5.2857 2.84659 2.83444C5.29785 0.383128 9.23487 0.267116 11.8262 2.56973C14.4176 4.87238 14.7653 8.7957 12.6193 11.5182L16.1104 15.0086C16.3355 15.1964 16.4352 15.4952 16.368 15.7805C16.3007 16.0658 16.078 16.2886 15.7928 16.356C15.5075 16.4235 15.2087 16.324 15.0208 16.099H15.0216ZM2.4685 7.46203C2.46779 9.47522 3.67335 11.2935 5.52854 12.0768C7.38368 12.8601 9.52758 12.456 10.9703 11.0512C10.9845 11.0338 10.9996 11.0174 11.0156 11.0019C11.0316 10.9865 11.0479 10.9715 11.0644 10.9571C12.6398 9.33918 12.9376 6.86695 11.7914 4.92121C10.6451 2.97547 8.33841 2.0376 6.15961 2.6314C3.98081 3.2252 2.46897 5.20377 2.46845 7.46203H2.4685Z" fill="#606D77" />
                            </svg>

                            <input onKeyDown={(e) => { if (e.key === "Enter") { searchTest() } }} onChange={(e) => setsearchText(e.target.value)} value={searchText} type="text" placeholder="Search assessment" />
                            {searchText !== "" ?
                                <svg className="cancel-icon" onClick={() => { setsearchText(""); setsearchFilter(false) }} style={{ right: 50 }} width="12" height="12" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                </svg> :
                                <></>

                            }
                            

                        </div> */}
                    </div>
                    <div>
                        <button className="createAssementButton" onClick={clickAssessment}>
                            {/* Create Assestment icons*/}
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="10" fill="white" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.40164 12.8291L9.39581 12.7653V10.8534H7.27128C6.95368 10.8547 6.68948 10.635 6.66749 10.3513C6.64547 10.0676 6.87321 9.81732 7.18796 9.77934L7.26002 9.77413H9.39538V7.87156C9.39706 7.58845 9.64224 7.3544 9.95762 7.33482C10.273 7.31523 10.5519 7.51674 10.5972 7.79692L10.6026 7.86147V9.77226H12.7272C13.0449 9.77099 13.3092 9.9908 13.3312 10.2747C13.3532 10.5585 13.1254 10.809 12.8105 10.847L12.738 10.8515H10.6026V12.7541C10.6024 13.0379 10.357 13.2732 10.0408 13.2929C9.72462 13.3126 9.44527 13.1098 9.40126 12.8287L9.40164 12.8291Z" fill="#FF6812" />
                            </svg>

                            <span className="header" >Create Assessments</span>
                        </button>


                        <button onClick={clickQuestion} className="createQuestionButton" >
                            {/* Create Question icons*/}

                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="10" cy="10" r="10" fill="white" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M9.40164 12.8291L9.39581 12.7653V10.8534H7.27128C6.95368 10.8547 6.68948 10.635 6.66749 10.3513C6.64547 10.0676 6.87321 9.81732 7.18796 9.77934L7.26002 9.77413H9.39538V7.87156C9.39706 7.58845 9.64224 7.3544 9.95762 7.33482C10.273 7.31523 10.5519 7.51674 10.5972 7.79692L10.6026 7.86147V9.77226H12.7272C13.0449 9.77099 13.3092 9.9908 13.3312 10.2747C13.3532 10.5585 13.1254 10.809 12.8105 10.847L12.738 10.8515H10.6026V12.7541C10.6024 13.0379 10.357 13.2732 10.0408 13.2929C9.72462 13.3126 9.44527 13.1098 9.40126 12.8287L9.40164 12.8291Z" fill="#00C49A" />
                            </svg>

                            <span className="header" >Create Question</span>
                        </button>
                    </div>
                </div>
                {(loadingforAssessmentData || searchLoading) && (paginationLoading === false) ?
                    <>
                        {loadingArray.map((index) => (<TestCardSkeleton key={index} />))
                        }
                    </> :
                    <>
                        {searchFilter && searchText ?
                            <>
                                {searchData.length ?
                                    <div  >
                                        {searchData.map((data) => {
                                            return (
                                                <Card refersh={(updateData) => {
                                                    const newArray = (testData).map(testDetails =>
                                                        testDetails._id === updateData._id ? { ...testDetails, status: updateData.status, isActive: updateData.isActive } : testDetails
                                                    );

                                                    setsearchData(newArray);
                                                }} open={(testId) => { setSendInvitePopup(true); settestID(testId); const filterTestData = searchData.filter(data => data._id === testId); setsingleTestData(filterTestData[0]) }} {...data} />
                                            )
                                        })

                                        }
                                    </div> : <div style={{ textAlign: 'center' }} >No assessment available</div>

                                }

                            </> :
                            <>
                                {testData.length ?
                                    <>
                                        {testData.map((data) => {
                                            return (
                                                <Card refersh={(updateData) => {
                                                    const newArray = (testData).map(testDetails =>
                                                        testDetails._id === updateData._id ? { ...testDetails, status: updateData.status, isActive: updateData.isActive } : testDetails
                                                    );

                                                    settestData(newArray);
                                                }} open={(testId) => { setSendInvitePopup(true); settestID(testId); const filterTestData = testData.filter(data => data._id === testId); setsingleTestData(filterTestData[0]) }} {...data} />
                                            );
                                        })

                                        }
                                        <label onClick={() => navigate('/assessment')} className="see-all-button" >See all</label>

                                    </> : <div style={{ textAlign: 'center' }} >No assessment available</div>

                                }
                            </>

                        }
                        {paginationLoading ? <>
                            {loadingArray.map((index) => (<TestCardSkeleton key={index} />))
                            }
                        </> : <></>

                        }
                    </>

                }


            </div>
        </div>
    );
};

export default Dashboard;