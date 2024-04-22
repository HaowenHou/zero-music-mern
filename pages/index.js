import React from 'react';
import Layout from './components/Layout';
import Register from './components/Register';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  return (
    <Layout>
      <div className='text-center'>
        <Register />
        <Login />
        <Profile />
      </div>
    </Layout>
  );
}

export default App;
