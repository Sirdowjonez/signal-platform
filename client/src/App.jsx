import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TickerTape from './components/TickerTape';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import Subscribe from './pages/Subscribe';
import Login from './pages/Login';

const styles = { app: { minHeight: '100vh', background: '#080810', color: '#eeeef5' } };

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
        <TickerTape />
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
