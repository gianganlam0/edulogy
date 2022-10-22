import Header from './Components/Utils/Header/Header';
import Footer from './Components/Utils/Footer/Footer';
import Home from './Components/Home/Home';
import LoginPage from './Components/LoginPage/LoginPage';
import CourseList from './Components/CourseList/CourseList';
import CourseDetail from './Components/CourseDetail/CourseDetail';
import CateList from './Components/CateList/CateList';
import Cart from './Components/Cart/Cart';
import EditProfile from './Components/EditProfile/EditProfile';
import ErrorPage from './Components/ErrorPage/ErrorPage';
import {Routes, Route, useParams} from 'react-router-dom';

import * as CK from './Components/Utils/Cookie';
import {useContext, useEffect, useLayoutEffect} from 'react';
import { Context } from './Components/Utils/ContextProvider';

function App() {
  const context = useContext(Context);
  useLayoutEffect(() => {
    if (CK.getCookie('id') !== '') { //da dang nhap
        context.setIsLogin(true);
        if (CK.getCookie('role') === '0') {
          context.setIsAdmin(false);
        }
        else if (CK.getCookie('role') === '1') {
          // context.setIsAdmin(true);
        }
        else if (CK.getCookie('role') === '2') {
          context.setIsAdmin(true);
        }
    }
    else {
      context.setIsLogin(false);
      context.setIsAdmin(false);
    }

  }, [context]);
  console.log(context);
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={!context.isLogin ? <LoginPage/> : <ErrorPage msg="Bạn đã đăng nhập rồi !"/>}/>
      <Route path="/course-list" element={<CourseList/>}/>
      <Route path="/course-detail" element={<CourseDetail/>}/>
      <Route path="/cate-list" element={<CateList/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/edit-profile/:id" element={<EditProfile/>}/>
      <Route path="*" element={<ErrorPage/>}/>
    </Routes>
    <Footer/>
    <Header/>
    
    </>
  );
}

export default App;
