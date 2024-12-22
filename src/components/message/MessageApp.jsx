import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import MessageGenerator from './MessageGenerator';
import Header from '../Header';
import Footer from '../Footer';
import '../../Styles/messageApp.css';

const MessageApp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [category, setCategory] = useState('greetings');

  return (
    <section className="d-flex flex-column min-vh-100 py-5 message-app">
      <Header />
      <main className="app-main">
        <div className="content-wrapper">
          <div className="main-container">
            <Routes>
              <Route 
                index 
                element={<MessageGenerator category={category} />} 
              />
              <Route 
                path="generate/:category" 
                element={<MessageGenerator category={category} />} 
              />
            </Routes>
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
};

export default MessageApp;