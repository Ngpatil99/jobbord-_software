import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BulkMCQProvider } from '../src/store/MCQBulkContext'
import { CreateQuestionProvider } from '../src/store/CreateQuestionContext'
import { CreateTestProvider } from '../src/store/CreateTestContext'
import { TestSummaryProvider } from './store/TestSummaryContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>

  <BulkMCQProvider>
    <CreateQuestionProvider>
      <CreateTestProvider>
        <TestSummaryProvider>
          <App />
        </TestSummaryProvider>
      </CreateTestProvider>
    </CreateQuestionProvider>
  </BulkMCQProvider>


  //</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
