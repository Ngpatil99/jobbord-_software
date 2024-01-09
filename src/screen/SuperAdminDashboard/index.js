import React from "react";
import ReactTooltip from 'react-tooltip';
import './index.css';
import user from '../../assets/icon/appared.svg';
import logo from '../../assets/icon/companylogo.svg';
import DashboardCard from "../../component/DashboardCard";
import Card from './Card/Card';
import qualified from '../../assets/icon/qualified.svg';
import SuperNavbar from "../../component/SuperNavbar";

const SuperAdminDashboard = () => {

    return (
        <div>
            <ReactTooltip />
            <SuperNavbar active="dashboard" />

            <div className="super-admin-container">
                <div className="super-admin-cardContainer" >
                    <div data-tip="Invite Used" className="inviteCard" >
                        <span  >Invites Used<br /><b>534/10000</b></span>
                        <meter id="disk_d" value={(534 / 10000).toFixed(2)}>100%</meter>
                    </div>
                    <DashboardCard logo={logo} background="#384455" header="Total Assessments" value="534" />
                    <DashboardCard logo={qualified} background="#384455" header="Total Appeared" value="534" />
                    <DashboardCard logo={user} background="#384455" header="Total Qualified" value="534" />
                </div>
                <div className="buttonContainer" >
                    <div>
                        <span>Assesments (4)</span>
                        <div className='dashboard-search-container'>
                            <input type="text" placeholder="Search Tests" />

                            {/* Search Icon */}
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M15.0216 16.099L11.5304 12.6071C8.80795 14.7531 4.88459 14.4054 2.58198 11.8141C0.279322 9.22267 0.395334 5.2857 2.84659 2.83444C5.29785 0.383128 9.23487 0.267116 11.8262 2.56973C14.4176 4.87238 14.7653 8.7957 12.6193 11.5182L16.1104 15.0086C16.3355 15.1964 16.4352 15.4952 16.368 15.7805C16.3007 16.0658 16.078 16.2886 15.7928 16.356C15.5075 16.4235 15.2087 16.324 15.0208 16.099H15.0216ZM2.4685 7.46203C2.46779 9.47522 3.67335 11.2935 5.52854 12.0768C7.38368 12.8601 9.52758 12.456 10.9703 11.0512C10.9845 11.0338 10.9996 11.0174 11.0156 11.0019C11.0316 10.9865 11.0479 10.9715 11.0644 10.9571C12.6398 9.33918 12.9376 6.86695 11.7914 4.92121C10.6451 2.97547 8.33841 2.0376 6.15961 2.6314C3.98081 3.2252 2.46897 5.20377 2.46845 7.46203H2.4685Z" fill="#606D77" />
                            </svg>

                        </div>
                    </div>
                    <div>
                        <div className="recruiter" >
                            <select name="" id="">
                                <option value="Recruiter">Recruiter</option>
                            </select>
                        </div>


                        <div className="thisMonth" >
                            <select name="" id="">
                                <option value="This  Month">This  Month</option>
                            </select>
                        </div>
                    </div>
                </div>
                <Card status="published" />
                <Card />
                <Card status="published" />
                <Card />
            </div>
        </div>
    );
};

export default SuperAdminDashboard;