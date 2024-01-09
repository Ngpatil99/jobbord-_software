import "./App.css";
import Dashboard from "./screen/Dashbaord";
import Library from "./screen/Library";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Login from "./Authentication/Login";
import CheckLoginRoute from "./CheckLoginRoute";
import ProtectedRoutes from "./ProtectedRoutes";
import ForgotPassword from "./Authentication/ForgotPassword";
import ResetPassword from "./Authentication/ResetPassword";
import NotFound from "./screen/NotFound";
import MCQBulkUpload from "./screen/MCQBulkUpload";
import MCQBulkPreview from "./screen/MCQBulkPreview";
import ChangePassword from "./screen/ChangePassword";
import BulkImported from "./screen/BulkImported";
import Profile from "./screen/Profile";
import Assesment from "./screen/Assesment/Assesment";
import Notification from "./screen/Notification";
import NewQuestion from "./screen/NewQuestion";
import CreateQuestion from "./screen/CreateQuestion";
import ReactTooltip from "react-tooltip";
import QuestionPreview from "./screen/QuestionPreview/QuestionPreview";
import CreateTest1 from "./screen/NewAssessment";
import CreateTest2 from "./screen/TestSummary";
import DetailedQuestion from "./screen/DetailedQuestion";
import QuestionOverview from "./screen/QuestionOverview";
import TestSetting from "./screen/TestSettings";
import TestPublished from "./screen/TestPublished";
import Interview from "./screen/InterviewScreen/Interview";
import Candidates from "./screen/Candidate/Candidates";
import ChooseFromLibrary from "./screen/ChooseFromLibrary";
import AssessmentOverview from "./screen/AssessmentOverview";
import AssessmentQuestion from "./screen/AssessmentQuestion";
import TheTest from "./screen/TheTest";
import AssessmentEditQuestion from "./screen/AssessmentEditQuestion";
import CandidateTestTaken from "./screen/CandidateTestTaken";
import CandidateReviewed from "./screen/CandidateReviewed";
import CandidateShortlisted from "./screen/CandidateShortlisted";
import SingleCandidate from "./screen/SingleCandidate";
import CandidateInvited from "./screen/CandidateInvited";
import BulkInvite from "./screen/BulkInvite";
import InviteBulk from "./screen/ImportCandidate";
import InvitationSent from "./screen/InvitationSent";
import TestAnalytics from "./screen/TestAnalytics";
import QuestionAnalytics from "./screen/QuestionAnalytics";
import ImportCandidate from "./screen/ImportCandidate";
import SuperAdminDashboard from "./screen/SuperAdminDashboard/index";
import ManageAccess from "./screen/ManageAccess";
import ManageAccessInvite from "./screen/ManageAccessInvite";
import EmployeeReport from "./screen/EmployeeReport";
import TestReport from "./screen/TestsReport";
import DepartmentReport from "./screen/DepartmentReport";
import { getCookie, deleteAllCookie } from "../src/constant";
import jwtDecode from "jwt-decode";
import CandidatePass from "./screen/CandidatePass";
import CandidateResult from "./screen/CandidateResult";
import CustomTestSummary from "./screen/CustomeTestSummary";
function App() {
  const token = getCookie("Xh7ERL0G");
  const location = window.location.href;
  const redirectTowebSite = () => {
    deleteAllCookie();
    return window.open("https://theeliteqa.com/", "_self");
    //return window.open("http://localhost:3000/", "_self")
  };
  return (
    <>
      <ReactTooltip />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {location.split("/")[3] === "candidateResult" ? (
            <Route path="/candidateResult/:id" element={<CandidateResult />} />
          ) : (
            <>
              <Route
                path="/"
                element={
                  token === null || token === undefined ? (
                    <>{redirectTowebSite()}</>
                  ) : (
                    <Navigate to="/dashboard" />
                  )
                }
              />
              {/* <Route path='/' element={<CheckLoginRoute> <Login /></CheckLoginRoute>} />
          <Route path="/forgotpassword" element={<CheckLoginRoute><ForgotPassword /></CheckLoginRoute>} />
          <Route path="/resetpassword/:email" element={<CheckLoginRoute><ResetPassword /></CheckLoginRoute>} /> */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoutes>
                    {" "}
                    <Dashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/library"
                element={
                  <ProtectedRoutes>
                    {" "}
                    <Library />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/choosefromlibrary"
                element={
                  <ProtectedRoutes>
                    {" "}
                    <ChooseFromLibrary />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/mcqbulkupload"
                element={
                  <ProtectedRoutes>
                    <MCQBulkUpload />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/mcqbulkpreview"
                element={
                  <ProtectedRoutes>
                    <MCQBulkPreview />{" "}
                  </ProtectedRoutes>
                }
              />
              {/* <Route path="/profile" element={<ProtectedRoutes><UserProfile/> </ProtectedRoutes>} /> */}
              <Route
                path="/changepassword"
                element={
                  <ProtectedRoutes>
                    <ChangePassword />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/bulkimported"
                element={
                  <ProtectedRoutes>
                    <BulkImported />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/userprofile"
                element={
                  <ProtectedRoutes>
                    <Profile />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/assessment"
                element={
                  <ProtectedRoutes>
                    <Assesment />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/notification"
                element={
                  <ProtectedRoutes>
                    <Notification />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/newquestion"
                element={
                  <ProtectedRoutes>
                    <NewQuestion />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/createquestion"
                element={
                  <ProtectedRoutes>
                    <CreateQuestion />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/questionpreview"
                element={
                  <ProtectedRoutes>
                    <QuestionPreview />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/newassessment"
                element={
                  <ProtectedRoutes>
                    <CreateTest1 />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/testsummary"
                element={
                  <ProtectedRoutes>
                    <CreateTest2 />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/custome_test_summary"
                element={
                  <ProtectedRoutes>
                    <CustomTestSummary />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/questionsoverview"
                element={
                  <ProtectedRoutes>
                    <QuestionOverview />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/detailedquestion"
                element={
                  <ProtectedRoutes>
                    <DetailedQuestion />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/testsettings"
                element={
                  <ProtectedRoutes>
                    <TestSetting />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/testpublished"
                element={
                  <ProtectedRoutes>
                    <TestPublished />{" "}
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/interview"
                element={
                  <ProtectedRoutes>
                    <Interview />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/candidate"
                element={
                  <ProtectedRoutes>
                    <Candidates />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/assessmentoverview/:id"
                element={
                  <ProtectedRoutes>
                    <AssessmentOverview />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/assessmentquestion/:id"
                element={
                  <ProtectedRoutes>
                    <AssessmentQuestion />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/thetest"
                element={
                  <ProtectedRoutes>
                    <TheTest />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/assessmenteditquestion"
                element={
                  <ProtectedRoutes>
                    <AssessmentEditQuestion />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/candidatetesttaken/:id"
                element={
                  <ProtectedRoutes>
                    <CandidateTestTaken />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/candidatereviewed/:id"
                element={
                  <ProtectedRoutes>
                    <CandidateReviewed />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/candidateshortlisted/:id"
                element={
                  <ProtectedRoutes>
                    <CandidateShortlisted />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/candidatepass/:id"
                element={
                  <ProtectedRoutes>
                    <CandidatePass />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/singlecandidate"
                element={
                  <ProtectedRoutes>
                    <SingleCandidate />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/candidateinvited/:id"
                element={
                  <ProtectedRoutes>
                    <CandidateInvited />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/testanalytics/:id"
                element={
                  <ProtectedRoutes>
                    <TestAnalytics />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/questionanalytics"
                element={
                  <ProtectedRoutes>
                    <QuestionAnalytics />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/bulkinvite"
                element={
                  <ProtectedRoutes>
                    <BulkInvite />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/importedcandidate"
                element={
                  <ProtectedRoutes>
                    <ImportCandidate />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/invitesent/:id"
                element={
                  <ProtectedRoutes>
                    <InvitationSent />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/superadmin"
                element={
                  <ProtectedRoutes>
                    <SuperAdminDashboard />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/manageaccess"
                element={
                  <ProtectedRoutes>
                    <ManageAccess />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/manageaccessinvite"
                element={
                  <ProtectedRoutes>
                    <ManageAccessInvite />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/employeereport"
                element={
                  <ProtectedRoutes>
                    <EmployeeReport />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/testreport"
                element={
                  <ProtectedRoutes>
                    <TestReport />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/departmentreport"
                element={
                  <ProtectedRoutes>
                    <DepartmentReport />
                  </ProtectedRoutes>
                }
              />
            </>
          )}

          {/* <Route path="/candidate" element={<ProtectedRoutes><UserTest1 /></ProtectedRoutes>} />
                    <Route path="/usertest2" element={<ProtectedRoutes><UserTest2 /></ProtectedRoutes>} />
                    <Route path="/usertest3" element={<ProtectedRoutes><UserTest3 /></ProtectedRoutes>} />
                    <Route path="/usertest4" element={<ProtectedRoutes><UserTest4 /></ProtectedRoutes>} /> */}

          {/* <Route path="/loading" element={<Loading />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
