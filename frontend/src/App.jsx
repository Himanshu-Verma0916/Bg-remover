import React from 'react';
import {Routes, Route} from 'react-router-dom';

import Home from './pages/Home';
import BuyCredits from './pages/BuyCredits';
import Result from './pages/Result';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import {ToastContainer, toast} from 'react-toastify';

const App = () => {
  return (
    <div className='min-h-screen bg-slate-50'>
      <Navbar/>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/result' element={<Result/>} />
        <Route path='/buy-credits' element={<BuyCredits/>} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App
