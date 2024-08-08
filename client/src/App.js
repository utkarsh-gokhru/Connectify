import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LandingPage from './pages/landing'
import SignupPage from './pages/signup';
import LoginPage from './pages/login';
import HomePage from './pages/homePage';
import ProfileSetupPage from './pages/profile';
import Post from './components/post';
import AddPost from './pages/addPost';
import PostsPage from './pages/postPage';
import ProfilePage from './pages/userProfile';

function App(){

  return(
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element= {< LandingPage />} />
          <Route path='/signup' element= {< SignupPage />} />
          <Route path='/login' element= {< LoginPage />} />
          <Route path='/home' element= {< HomePage />} />
          <Route path='/profile' element= {< ProfileSetupPage/>} />
          <Route path='/post' element= {< Post/>} />
          <Route path='/xyz' element= {< AddPost/>} />
          <Route path='/posts' element= {< PostsPage/>} />
          <Route path='/user-profile' element= {< ProfilePage/>} />   
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;