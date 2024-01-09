import { createContext, useState } from "react";
import { backend_url, getCookie } from "../constant";
import axios from "axios";

const TestSummaryContext = createContext({
  testId: "",
  testTakenCandidates: [],
  testPassedCandidates: [],
  reviewedCandidates: [],
  shortlistedCandidates: [],
  invitedCandidates: [],
  loading: false,
  test: null,
  testDetails: "",
  cutOffScore: "",
  handleTestId: () => {},
  getCandidates: () => {},
  handleTestTakenCandidates: () => {},
  handleTestPassedCandidates: () => {},
  handleReviewedCandidates: () => {},
  handleShortlistedCandidates: () => {},
  handleInvitedCandidates: () => {},
  filterCandidates: () => {},
  handleTest: () => {},
  setcutOffScore: () => {},
  setTestDetails: () => {},
});

export const TestSummaryProvider = ({ children }) => {
  const [testId, setTestId] = useState("");
  const [testTakenCandidates, setTestTakenCandidates] = useState([]);
  const [testPassedCandidates, settestPassedCandidates] = useState([]);
  const [reviewedCandidates, setReviewedCandidates] = useState([]);
  const [shortlistedCandidates, setShortlistedCandidates] = useState([]);
  const [invitedCandidates, setInvitedCandidates] = useState([]);
  const [testTakenCandidatesFilter, setTestTakenCandidatesFilter] = useState(
    []
  );
  const [reviewedCandidatesFilter, setReviewedCandidatesFilter] = useState([]);
  const [shortlistedCandidatesFilter, setShortlistedCandidatesFilter] =
    useState([]);
  const [invitedCandidatesFilter, setInvitedCandidatesFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allCandidates, setAllCandidates] = useState([]);
  const [test, setTest] = useState(null);
  const [cutOffScore, setcutOffScore] = useState("");
  const [testDetails, settestDetails] = useState("");
  const [totalCandidateCount, setTotalCandidateCount] = useState({
    candidatesInvited: 0,
    candidatesAppeared: 0,
    candidatesReviewed: 0,
    candidatesShortlisted: 0,
    candidatesPassed: 0,
  });
  const [totalPages, setTotalPages] = useState(0);

  const handleTestDetails = (value) => {
    settestDetails(value);
  };

  const handleCutOffScore = (value) => {
    setcutOffScore(value);
  };

  const handleTestId = (value) => {
    setTestId(value);
  };

  const filterCandidates = (page, value) => {
    if (page === "passed") {
      if (value === "recommended") {
        const sortedCandidates = [...testTakenCandidatesFilter].sort(
          (a, b) =>
            b.candidateResult?.candidate_total_Score -
            a.candidateResult?.candidate_total_Score
        );
        settestPassedCandidates(sortedCandidates);
      } else if (value === "Greater than 75%") {
        const passingPercentage = 0.75;
        const passingScore = testDetails.totalScore * passingPercentage;
        const filteredCandidates = testTakenCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score >= passingScore
        );
        settestPassedCandidates(filteredCandidates);
      } else if (value === "latest") {
        const testTaken = allCandidates.filter(
          (data) => data.status === "appeared"
        );
        settestPassedCandidates(testTaken);
      } else if (value === "Greater than 50%") {
        const passingPercentage = 0.5;
        const passingScore = testDetails.totalScore * passingPercentage;
        const filteredCandidates = testTakenCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score >= passingScore
        );
        settestPassedCandidates(filteredCandidates);
      } else {
        const failingPercentage = 0.5;
        const passingScore = testDetails.totalScore * failingPercentage;
        const filteredCandidates = testTakenCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score < passingScore
        );
        setTestTakenCandidates(filteredCandidates);
      }
    } else if (page === "reviewed") {
      if (value === "recommended") {
        const sortedCandidates = [...reviewedCandidatesFilter].sort(
          (a, b) =>
            b.candidateResult.candidate_total_Score -
            a.candidateResult.candidate_total_Score
        );
        setReviewedCandidates(sortedCandidates);
      } else if (value === "Greater than 75%") {
        const passingPercentage = 0.75;
        const passingScore = testDetails.totalScore * passingPercentage;
        const filteredCandidates = reviewedCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score >= passingScore
        );
        setReviewedCandidates(filteredCandidates);
      } else if (value === "latest") {
        const reviewed = allCandidates.filter(
          (data) => data.status === "reviewed"
        );
        setReviewedCandidates(reviewed);
      } else if (value === "Greater than 50%") {
        const passingPercentage = 0.5;
        const passingScore = testDetails.totalScore * passingPercentage;
        const filteredCandidates = reviewedCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score >= passingScore
        );
        setReviewedCandidates(filteredCandidates);
      } else {
        const failingPercentage = 0.5;
        const passingScore = testDetails?.totalScore * failingPercentage;
        const filteredCandidates = reviewedCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score < passingScore
        );
        setReviewedCandidates(filteredCandidates);
      }
    } else {
      if (value === "recommended") {
        const sortedCandidates = [...shortlistedCandidatesFilter].sort(
          (a, b) =>
            b.candidateResult?.candidate_total_Score -
            a.candidateResult?.candidate_total_Score
        );
        setShortlistedCandidates(sortedCandidates);
      } else if (value === "Greater than 75%") {
        const passingPercentage = 0.75;
        const passingScore = testDetails.totalScore * passingPercentage;
        const filteredCandidates = shortlistedCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score >= passingScore
        );
        setShortlistedCandidates(filteredCandidates);
      } else if (value === "latest") {
        const shortlisted = allCandidates.filter(
          (data) => data.status === "shortlisted"
        );
        setShortlistedCandidates(shortlisted);
      } else if (value === "Greater than 50%") {
        const passingPercentage = 0.5;
        const passingScore = testDetails.totalScore * passingPercentage;
        const filteredCandidates = shortlistedCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score >= passingScore
        );
        setShortlistedCandidates(filteredCandidates);
      } else {
        console.log(testDetails);
        const failingPercentage = 0.5;
        const passingScore = testDetails.totalScore * failingPercentage;
        console.log(passingScore);
        const filteredCandidates = shortlistedCandidatesFilter.filter(
          (candidate) =>
            candidate.candidateResult?.candidate_total_Score < passingScore
        );
        console.log(filteredCandidates);
        setShortlistedCandidates(filteredCandidates);
      }
    }
  };

  const getCandidates = async (id, page, limit, status) => {
    try {
      setTotalCandidateCount({
        candidatesInvited: 0,
        candidatesAppeared: 0,
        candidatesReviewed: 0,
        candidatesShortlisted: 0,
        candidatesPassed: 0,
      });
      setAllCandidates([]);
      setTestTakenCandidates([]);
      settestPassedCandidates([]);
      setReviewedCandidates([]);
      setShortlistedCandidates([]);
      setInvitedCandidates([]);
      setTestTakenCandidatesFilter([]);
      setReviewedCandidatesFilter([]);
      setShortlistedCandidatesFilter([]);
      setInvitedCandidatesFilter([]);
      setLoading(true);

      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(
        `${backend_url}invites/getInvite/${id === undefined ? testId : id}${
          page && limit ? `?page=${page}&limit=${limit}` : ""
        }${status ? `&status=${status}` : ""}`,
        { headers: { token: token } }
      );
      //const testTaken = response.data.data.filter((data) => data.status === 'appeared')

      const testTaken = response.data.data.filter((data) =>
        data.invite.status.some(
          (candidateStatus) => candidateStatus.currentStatus === "appeared"
        )
      );

      testTaken.sort((a, b) => b.testScore - a.testScore);
      //const reviewed = response.data.data.filter((data) => data.status === 'reviewed')
      const reviewed = response.data.data.filter((data) =>
        data.invite.status.some(
          (candidateStatus) => candidateStatus.currentStatus === "reviewed"
        )
      );

      // const shortlisted = response.data.data.filter((data) => data.status === 'shortlisted')
      const shortlisted = response.data.data.filter((data) =>
        data.invite.status.some(
          (candidateStatus) => candidateStatus.currentStatus === "shortlisted"
        )
      );

      shortlisted.sort((a, b) => b.testScore - a.testScore);
      const invited = response.data.data;
      settestDetails(response.data.data[0].invite.testId);
      setcutOffScore(response.data.data[0]?.invite?.testId?.cutOff);
      setAllCandidates(response.data.data);
      setTotalCandidateCount({
        candidatesInvited: response.data.totalDocs,
        candidatesAppeared: response.data.appeared,
        candidatesReviewed: response.data.reviewed,
        candidatesShortlisted: response.data.shortlisted,
        candidatesPassed: response.data.passed,
      });

      setTotalPages(response.data.totalPages);
      setTestTakenCandidates(testTaken);
      settestPassedCandidates(testTaken);
      setReviewedCandidates(reviewed);
      setShortlistedCandidates(shortlisted);
      setInvitedCandidates(invited);
      setTestTakenCandidatesFilter(testTaken);
      setReviewedCandidatesFilter(reviewed);
      setShortlistedCandidatesFilter(shortlisted);
      setInvitedCandidatesFilter(invited);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleTest = (value) => {
    setTest(value);
  };

  const handleTestTakenCandidates = (value) => {
    setTestTakenCandidates(value);
  };
  const handleReviewedCandidates = (value) => {
    setReviewedCandidates(value);
  };
  const handleShortlistedCandidates = (value) => {
    setShortlistedCandidates(value);
  };

  const handleInvitedCandidates = (value) => {
    setInvitedCandidates(value);
  };

  const handleTestPassedCandidates = (value) => {
    settestPassedCandidates(value);
  };

  const context = {
    testId: testId,
    testTakenCandidates: testTakenCandidates,
    testPassedCandidates: testPassedCandidates,
    reviewedCandidates: reviewedCandidates,
    shortlistedCandidates: shortlistedCandidates,
    invitedCandidates: invitedCandidates,
    loading: loading,
    totalCandidateCount: totalCandidateCount,
    totalPages: totalPages,
    test: test,
    cutOffScore: cutOffScore,
    testDetails: testDetails,
    settestDetails: handleTestDetails,
    handleTestId: handleTestId,
    getCandidates: getCandidates,
    handleTestTakenCandidates: handleTestTakenCandidates,
    handleTestPassedCandidates: handleTestPassedCandidates,
    handleReviewedCandidates: handleReviewedCandidates,
    handleShortlistedCandidates: handleShortlistedCandidates,
    handleInvitedCandidates: handleInvitedCandidates,
    filterCandidates: filterCandidates,
    handleTest: handleTest,
    setcutOffScore: handleCutOffScore,
  };

  return (
    <TestSummaryContext.Provider value={context}>
      {children}
    </TestSummaryContext.Provider>
  );
};

export default TestSummaryContext;
