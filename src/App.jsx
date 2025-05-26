import React from 'react';
import Routes from './routes/index';
import './App.scss';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <React.Fragment>
      <Routes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        progressStyle={{ background: '#5f2eea' }}
      />
    </React.Fragment>
  );
}

export default App;
