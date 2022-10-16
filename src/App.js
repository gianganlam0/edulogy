import Header from './Components/Utils/Header/Header';
import Footer from './Components/Utils/Footer/Footer';
import Home from './Components/Home/Home';
import LoginPage from './Components/LoginPage/LoginPage';
import CourseList from './Components/CourseList/CourseList';
import CourseDetail from './Components/CourseDetail/CourseDetail';
import CateList from './Components/CateList/CateList';
import Cart from './Components/Cart/Cart';
import EditProfile from './Components/EditProfile/EditProfile';
import {Routes, Route, Link} from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/course-list" element={<CourseList/>}/>
      <Route path="/course-detail" element={<CourseDetail/>}/>
      <Route path="/cate-list" element={<CateList/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/edit-profile" element={<EditProfile/>}/>
      {/* <Route path="/news" element={<News/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/login" element={<Login/>}/>
      
      <Route path="/logout" element={<Logout/>}/> */}
    </Routes>
    <Footer/>
    <Header/>
    
    </>
  );
}

export default App;
