import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import PostDetail from './pages/PostDetail';
import Subscribe from './pages/Subscribe';
import Login from './pages/Login';

const styles = { app: { minHeight: '100vh', background: '#0a0a0a', color: '#fff' } };

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.app}>
        <Navbar />
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
