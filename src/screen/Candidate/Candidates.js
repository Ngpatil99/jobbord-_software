import React from 'react'
import { useState, useEffect } from 'react'
import NavigationBar from '../../component/NavigationBar/NavigationBar'
import './Candidates.css'
import axios from 'axios';
import { backend_url, getCookie } from '../../constant';
import { toast } from 'react-toastify'
import jwtDecode from "jwt-decode"
let cancelToken;
function Candidates() {
    const [loading, setloading] = useState(false)
    const [createdBy, setcreatedBy] = useState([])
    const [myselfId, setmyselfId] = useState()
    const [invites, setInvites] = useState([])
    const [username, setusername] = useState('')
    const [selectedCreatedBy, setselectedCreatedBy] = useState('All Assesment')
    const [statistics, setStatistics] = useState(null)
    const [search, setSearch] = useState("")
    const [searchData, setSearchData] = useState([])
    const [statisticsLoading, setStatisticsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalDocs, setTotalDocs] = useState(0)
    const [statusFilter, setStatusFilter] = useState('All')
    const [searchLoading, setSearchLoading] = useState(false)
    const loadingArray = [
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
    ]
    const [candidateCopy, setCandidateCopy] = useState([])
    const [persistSearch, setPersistSearch] = useState("")

    useEffect(() => {
        getStatistics()
        searchInvites()
        getCreatedByUsers()
    }, [])

    useEffect(() => {
        searchInvites()
    }, [currentPage, selectedCreatedBy, statusFilter])

    useEffect(() => {
        return () => {
            if (cancelToken) {
                cancelToken.cancel("Operations cancelled due to new request");
            }
            cancelToken = axios.CancelToken.source();
        }
    }, [])


    const getCreatedByUsers = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const decoed = jwtDecode(token)
            setmyselfId(decoed.user_id)
            setusername(`Myself(${decoed.fullName})`)
            const res = await axios.get(`${backend_url}test/getTestAdmins/${decoed.user_id}`, { headers: { "token": token } })

            const createdByUsers = res.data.data.map((data) => {
                return data.createdBy
            });
            const result = createdByUsers.filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.email === value.email && decoed.fullName !== t.fullName
                ))
            )
            setcreatedBy(result)
        } catch (error) {
            toast(error)
        }
    }

    const getStatistics = async () => {
        try {
            setStatisticsLoading(true)
            const token = getCookie("Xh7ERL0G")
            const decoded = jwtDecode(token)
            const response = await axios.get(`${backend_url}invites/statistics/${decoded.user_id}`, { headers: { "token": token } })
            setStatistics(response.data)
            setStatisticsLoading(false)
        } catch (error) {
            setStatisticsLoading(false)
            console.log(error)
        }
    }



    const searchInvites = async () => {
        try {
            setloading(true);
            setSearch("")
            const token = getCookie("Xh7ERL0G");
            const decoded = jwtDecode(token);
            const response = await axios.post(`${backend_url}invites/search/${decoded.user_id}?filter=${statusFilter},${selectedCreatedBy}&page=${currentPage}&limit=25`, {
                searchText: persistSearch
            }, { headers: { "token": token } });

            if (response.status === 200) {
                if (response.data.data !== undefined) {
                    setInvites(response.data.data);
                    setCandidateCopy(response.data.data)
                    setCurrentPage(parseInt(response.data.currentPage))
                    setTotalPages(parseInt(response.data.totalPages))
                    setTotalDocs(parseInt(response.data.totalDocs))
                } else {
                    toast.success("No result found.");
                }
            }
            setloading(false);
        } catch (error) {
            console.log(error);
            toast.error("Oops, something went wrong. Please try again!");
        }
    };


    const searchInvitesOnChange = async (e) => {
        try {
            setSearchLoading(true)
            const token = getCookie("Xh7ERL0G")
            const decoded = jwtDecode(token)
            if (cancelToken) {
                cancelToken.cancel("Operations cancelled due to new request");
            }
            cancelToken = axios.CancelToken.source();
            const response = await axios.post(`${backend_url}invites/search/${decoded.user_id}?filter=${statusFilter},${selectedCreatedBy}&limit=25`, {
                searchText: e.target.value.toLowerCase()
            }, { cancelToken: cancelToken.token, headers: { "token": token } })
            if (response.status === 200) {
                setSearchLoading(false)
                if (e.target.value !== "") {
                    setSearchData(response.data.data)
                } else {
                    setSearchData([])
                    setInvites(candidateCopy)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            searchInvites()
        }
    }




    return (
        <div className="candidate-container">
            <NavigationBar active="candidate" />
            <div className="candidate-content">
                <div className="banner">
                    <div className="total">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="#00C49A" />
                            <path d="M32.6682 15.7464L30.2536 13.3318C29.8325 12.9084 29.3315 12.5726 28.7797 12.344C28.228 12.1154 27.6363 11.9985 27.0391 12H18.5455C17.3404 12.0015 16.1851 12.4808 15.3329 13.3329C14.4808 14.1851 14.0014 15.3404 14 16.5455V32.9091C14.0014 34.1142 14.4808 35.2695 15.3329 36.1216C16.1851 36.9737 17.3404 37.4531 18.5455 37.4545H29.4545C30.6596 37.4531 31.8149 36.9737 32.6671 36.1216C33.5192 35.2695 33.9985 34.1142 34 32.9091V18.9609C34.0015 18.3637 33.8846 17.772 33.656 17.2203C33.4274 16.6685 33.0916 16.1675 32.6682 15.7464ZM31.3827 17.0318C31.5112 17.161 31.6266 17.3026 31.7273 17.4546H29.4545C29.2134 17.4546 28.9822 17.3588 28.8117 17.1883C28.6412 17.0178 28.5454 16.7866 28.5454 16.5455V14.2727C28.6974 14.3737 28.839 14.4894 28.9682 14.6182L31.3827 17.0318ZM29.4545 35.6364H18.5455C17.8221 35.6364 17.1284 35.349 16.617 34.8376C16.1055 34.3261 15.8182 33.6324 15.8182 32.9091V16.5455C15.8182 15.8221 16.1055 15.1285 16.617 14.617C17.1284 14.1055 17.8221 13.8182 18.5455 13.8182H26.7273V16.5455C26.7273 17.2688 27.0146 17.9625 27.5261 18.4739C28.0375 18.9854 28.7312 19.2727 29.4545 19.2727H32.1818V32.9091C32.1818 33.6324 31.8945 34.3261 31.383 34.8376C30.8715 35.349 30.1779 35.6364 29.4545 35.6364Z" fill="white" />
                            <path d="M19.4482 20.1815H23.0845C23.3256 20.1815 23.5568 20.0857 23.7273 19.9152C23.8978 19.7447 23.9936 19.5135 23.9936 19.2724C23.9936 19.0313 23.8978 18.8 23.7273 18.6295C23.5568 18.4591 23.3256 18.3633 23.0845 18.3633H19.4482C19.207 18.3633 18.9758 18.4591 18.8053 18.6295C18.6348 18.8 18.5391 19.0313 18.5391 19.2724C18.5391 19.5135 18.6348 19.7447 18.8053 19.9152C18.9758 20.0857 19.207 20.1815 19.4482 20.1815Z" fill="white" />
                            <path d="M28.5391 22H19.4482C19.207 22 18.9758 22.0958 18.8053 22.2663C18.6348 22.4368 18.5391 22.668 18.5391 22.9091C18.5391 23.1502 18.6348 23.3814 18.8053 23.5519C18.9758 23.7224 19.207 23.8182 19.4482 23.8182H28.5391C28.7802 23.8182 29.0114 23.7224 29.1819 23.5519C29.3524 23.3814 29.4481 23.1502 29.4481 22.9091C29.4481 22.668 29.3524 22.4368 29.1819 22.2663C29.0114 22.0958 28.7802 22 28.5391 22Z" fill="white" />
                            <path d="M28.5391 25.6367H19.4482C19.207 25.6367 18.9758 25.7325 18.8053 25.903C18.6348 26.0735 18.5391 26.3047 18.5391 26.5458C18.5391 26.7869 18.6348 27.0181 18.8053 27.1886C18.9758 27.3591 19.207 27.4549 19.4482 27.4549H28.5391C28.7802 27.4549 29.0114 27.3591 29.1819 27.1886C29.3524 27.0181 29.4481 26.7869 29.4481 26.5458C29.4481 26.3047 29.3524 26.0735 29.1819 25.903C29.0114 25.7325 28.7802 25.6367 28.5391 25.6367Z" fill="white" />
                            <path d="M26.7209 29.2734H19.4482C19.207 29.2734 18.9758 29.3692 18.8053 29.5397C18.6348 29.7102 18.5391 29.9414 18.5391 30.1825C18.5391 30.4236 18.6348 30.6549 18.8053 30.8254C18.9758 30.9958 19.207 31.0916 19.4482 31.0916H26.7209C26.962 31.0916 27.1932 30.9958 27.3637 30.8254C27.5342 30.6549 27.63 30.4236 27.63 30.1825C27.63 29.9414 27.5342 29.7102 27.3637 29.5397C27.1932 29.3692 26.962 29.2734 26.7209 29.2734Z" fill="white" />
                        </svg>
                        <div className="detail">
                            <span>Total Assesments</span>
                            {statisticsLoading ? <div class="loader" ></div> : <p>{statistics?.totalAssesment}</p>}

                        </div>
                    </div>
                    <div className="candidates-invited">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="#00C49A" />
                            <path d="M33 17L22 28" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M33 17L26 37L22 28L13 24L33 17Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div className="detail">
                            <span>Candidates Invited</span>
                            {statisticsLoading ? <div class="loader" ></div> : <p>{statistics?.candidatesInvites}</p>}

                        </div>
                    </div>
                    <div className="candidates-appeared">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="#00C49A" />
                            <path d="M32 33V31C32 29.9391 31.5786 28.9217 30.8284 28.1716C30.0783 27.4214 29.0609 27 28 27H20C18.9391 27 17.9217 27.4214 17.1716 28.1716C16.4214 28.9217 16 29.9391 16 31V33" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M24 23C26.2091 23 28 21.2091 28 19C28 16.7909 26.2091 15 24 15C21.7909 15 20 16.7909 20 19C20 21.2091 21.7909 23 24 23Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <div className="detail">
                            <span>Candidates Appeared</span>
                            {statisticsLoading ? <div class="loader" ></div> : <p>{statistics?.candidatesAppeared}</p>}

                        </div>
                    </div>
                    <div className="candidates-shortlisted">
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="24" fill="#00C49A" />
                            <path d="M30 33V31C30 29.9391 29.5786 28.9217 28.8284 28.1716C28.0783 27.4214 27.0609 27 26 27H19C17.9391 27 16.9217 27.4214 16.1716 28.1716C15.4214 28.9217 15 29.9391 15 31V33" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M22.5 23C24.7091 23 26.5 21.2091 26.5 19C26.5 16.7909 24.7091 15 22.5 15C20.2909 15 18.5 16.7909 18.5 19C18.5 21.2091 20.2909 23 22.5 23Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M31 23L33 25L37 21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <div className="detail">
                            <span>Candidates Shortlisted</span>
                            {statisticsLoading ? <div class="loader" ></div> : <p>{statistics?.candidatesHired}</p>}
                        </div>
                    </div>
                </div>



                <div className="candidate-table">
                    <div className="candidate-heading">
                        <div className="left-heading">
                            <div><span>Candidates ({totalDocs})</span></div>
                            <div>
                                <div className="candidate-input">
                                    <svg style={{ cursor: 'pointer' }} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0225 16.0985L11.5314 12.6066C8.80893 14.7527 4.88556 14.4049 2.58295 11.8136C0.280299 9.22218 0.39631 5.28521 2.84757 2.83395C5.29883 0.38264 9.23585 0.266628 11.8272 2.56924C14.4186 4.87189 14.7663 8.79521 12.6203 11.5177L16.1114 15.0081C16.3365 15.1959 16.4362 15.4947 16.3689 15.78C16.3017 16.0653 16.079 16.2881 15.7937 16.3556C15.5085 16.423 15.2096 16.3235 15.0217 16.0985H15.0225ZM2.46881 7.4614C2.4681 9.4746 3.67365 11.2929 5.52884 12.0762C7.38399 12.8595 9.52788 12.4554 10.9706 11.0505C10.9848 11.0332 10.9999 11.0168 11.0159 11.0013C11.0319 10.9859 11.0482 10.9709 11.0647 10.9564C12.6401 9.33856 12.9379 6.86632 11.7917 4.92058C10.6454 2.97484 8.33872 2.03697 6.15992 2.63078C3.98111 3.22458 2.46928 5.20315 2.46876 7.4614H2.46881Z" fill="#606D77" />
                                    </svg>
                                    <input onKeyDown={handleKeyDown} onChange={(e) => {
                                        setSearch(e.target.value)
                                        setPersistSearch(e.target.value)
                                        searchInvitesOnChange(e)
                                    }} value={search} placeholder="Search candidates" />
                                    {search !== "" ?
                                        <svg onClick={() => {
                                            setSearch("")
                                        }} style={{ right: 50, cursor: 'pointer' }} width="12" height="12" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg> :
                                        <></>

                                    }
                                </div>
                                {search !== "" ? <div className="search-container">
                                    {searchData.length === 0 && searchLoading === false ? <p className='no-data'>No data found.</p> : null}
                                    {searchLoading ? <p className='no-data'>Loading...</p> : searchData.map((data, index) => {
                                        return <span key={index} onClick={() => {
                                            setInvites([data])
                                            setTotalDocs(1)
                                        }}>{data.invite.candidateName}</span>
                                    })}
                                </div> : null}
                            </div>

                        </div>
                        <div className="right-heading">
                            {/* <div className='filter-container' >
                                <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 2H1L5 6.73V10L7 11V6.73L11 2Z" stroke="#333333" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>Filter</span>
                            </div> */}
                            {/* <div className='interviewer-container' >
                                <select>
                                    <option label='select interviewer' value='select interviewer' />
                                </select>
                            </div> */}
                            {/* <div className='jobrole' >
                                <select>
                                    <option label='job role' value='job role' />
                                </select>
                            </div> */}
                            <div className="test">
                                <select onChange={(e) => {
                                    setStatusFilter(e.target.value)
                                    setCurrentPage(1)
                                }}>
                                    <option value="All">All Status</option>
                                    <option value="invited">Invited</option>
                                    <option value="hired">Hired</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="shortlisted">Shortlisted</option>
                                    <option value="imported">Imported</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="appeared">Appeared</option>
                                    <option value="not appeared">Not Appeared</option>
                                </select>
                            </div>
                            <div className="assesment" >
                                <select onChange={(e) => {
                                    setselectedCreatedBy(e.target.value)
                                    setCurrentPage(1)
                                }} > 
                             <option value="" label='Invited By' disabled /> 
                             <option label="Invited By" value="All Assesment" />
                                    <option label={username} value={myselfId} />
                                    {createdBy?.map((data) => {
                                        return <option label={data.fullName} value={data._id} />
                                    })}
                                </select>
                            </div> 
                            <div className="table1-heading">
                                {/* <div className="table-title">
                            <span>All candidates </span>
                        </div> */}

                                <div className="pagination">
                                    <button onClick={() => {
                                        if (currentPage > 1) {
                                            if (currentPage > 1) {
                                                if (loading === false) {
                                                    setCurrentPage(currentPage - 1)
                                                }
                                            }

                                        }
                                    }}>
                                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.41421 6L6.70711 10.2929C7.09763 10.6834 7.09763 11.3166 6.70711 11.7071C6.31658 12.0976 5.68342 12.0976 5.29289 11.7071L0.292893 6.70711C-0.0976311 6.31658 -0.0976311 5.68342 0.292893 5.29289L5.29289 0.292893C5.68342 -0.0976311 6.31658 -0.0976311 6.70711 0.292893C7.09763 0.683418 7.09763 1.31658 6.70711 1.70711L2.41421 6Z" fill="white" />
                                        </svg>
                                    </button>
                                    <span>{totalPages === 0 ? 0 : currentPage}/{totalPages}</span>
                                    <button onClick={() => {
                                        setCurrentPage(
                                            currentPage === totalPages || totalPages === 0
                                                ? currentPage
                                                : loading === false ? currentPage + 1 : currentPage
                                        );
                                    }}>
                                        <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.58579 6L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683417 0.292893 0.292893C0.683418 -0.0976305 1.31658 -0.0976305 1.70711 0.292893L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711L1.70711 11.7071C1.31658 12.0976 0.683418 12.0976 0.292893 11.7071C-0.0976311 11.3166 -0.0976311 10.6834 0.292893 10.2929L4.58579 6Z" fill="white" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                        </div>
                    </div>


                    <div className="candidate-table-content">
                        {loading ? (
                            <table cellSpacing={0}>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile No.</th>
                                    <th>Latest test name</th>
                                    <th>Latest Test Score</th>
                                    <th>Status</th>
                                    <th>Invited By</th>
                                </tr>
                                {loadingArray.map((data, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                            <td>
                                                <div className="skeleton" />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </table>
                        ) : (
                            <>
                                {invites.length === 0 ? (
                                    <div className="no-found">
                                        <h1>No data found.</h1>
                                    </div>
                                ) : (
                                    <table cellSpacing={0}>
                                        <tr>
                                            <th>No.</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Mobile No.</th>
                                            <th>Latest test name</th>
                                            <th>Latest Test Score</th>
                                            <th>Status</th>
                                            <th>Invited By</th>

                                        </tr>
                                        {invites.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{data.invite?.candidateName}</td>
                                                    <td>{data.invite?.candidateEmail}</td>
                                                    <td>{data.invite?.candidateMobile || "NA"}</td>
                                                    <td>{data.invite?.testId === null ? "NA" : data.invite?.testId?.name}</td>
                                                    <td>{data.candidateResult === null ? "NA" : data.candidateResult.candidate_total_Score}</td>
                                                    <td>
                                                        <button
                                                            style={
                                                                data?.invite.status[data.invite.status.length - 1].currentStatus === "imported"
                                                                    ? { background: "#D9D9D9" }
                                                                    : data?.invite.status[data.invite.status.length - 1].currentStatus === "shortlisted"
                                                                        ? { background: "#FF6812" }
                                                                        : data?.invite.status[data.invite.status.length - 1].currentStatus === "invited"
                                                                            ? { background: "#EBC604" }
                                                                            : data?.invite.status[data.invite.status.length - 1].currentStatus === "rejected"
                                                                                ? { background: "#F23E3E" }
                                                                                : data?.invite.status[data.invite.status.length - 1].currentStatus === "reviewed"
                                                                                    ? { background: "#384455" }
                                                                                    : data?.invite.status[data.invite.status.length - 1].currentStatus === "not appeared"
                                                                                        ? { background: "#827C7C" }
                                                                                        : data?.invite.status[data.invite.status.length - 1].currentStatus === "hired"
                                                                                            ? { background: "#00C499" }
                                                                                            : null
                                                            }
                                                        >
                                                            {data?.invite.status[data.invite.status.length - 1].currentStatus?.charAt(0)?.toUpperCase() + data?.invite.status[data.invite.status.length - 1].currentStatus?.slice(1)}
                                                        </button>
                                                    </td>
                                                    <td>
                                                        {data?.invite.invitedBy !== null ? data?.invite.invitedBy?.fullName : "NA"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </table>
                                )}
                            </>
                        )}
                    </div>


                </div>

            </div>
        </div>
    )
}

export default Candidates

