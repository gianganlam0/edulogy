import Header from './Components/Utils/Header/Header';
import Footer from './Components/Utils/Footer/Footer';
import Home from './Components/Home/Home';
import LoginPage from './Components/LoginPage/LoginPage';
import RegisterPage from './Components/RegisterPage/RegisterPage';
import CourseList from './Components/CourseList/CourseList';
import CourseDetail from './Components/CourseDetail/CourseDetail';
import CateList from './Components/CateList/CateList';
import Cart from './Components/Cart/Cart';
import EditProfile from './Components/EditProfile/EditProfile';
import ChangePassword from './Components/ChangePassword/ChangePassword';
import AddCate from './Components/AddCate/AddCate';
import CatePending from './Components/CatePending/CatePending';
import ErrorPage from './Components/ErrorPage/ErrorPage';
import {Routes, Route} from 'react-router-dom';

import * as CK from './Components/Utils/Cookie';
import {useContext, useLayoutEffect, useEffect} from 'react';
import { Context } from './Components/Utils/ContextProvider';

function App() {
  const {log,
    isLogin, setIsLogin,
    isTeacher, setIsTeacher,
    isAdmin, setIsAdmin} = useContext(Context);
  useLayoutEffect(() => {
    if (CK.getCookie('id') !== '') { //da dang nhap
        setIsLogin(true);
        if (CK.getCookie('role') === '0') {
          setIsAdmin(false);
        }
        else if (CK.getCookie('role') === '1') {
          setIsTeacher(true);
        }
        else if (CK.getCookie('role') === '2') {
          setIsAdmin(true);
        }
    }
    else {
      setIsLogin(false);
      setIsTeacher(false);
      setIsAdmin(false);
    }

  }, [isLogin]);
  //check if cookie is expired five second a time
  
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={!isLogin ? <LoginPage/> : <ErrorPage msg="Bạn đã đăng nhập rồi !"/>}/>
      <Route path="/register" element={!isLogin ? <RegisterPage/> : <ErrorPage msg="Bạn phải đăng xuất mới đăng ký tài khoản được !"/>}/>
      <Route path="/course-list" element={<CourseList/>}/>
      <Route path="/course-detail" element={<CourseDetail/>}/>
      <Route path="/cate-list" element={<CateList/>}/>
      <Route path="/cate-list/?page=:page&keyword=:keyword&sortby=:sortby&orderby:=orderby" element={<CateList/>}/>
      <Route path="/add-cate" element={(isTeacher || isAdmin) ? <AddCate/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/cate-pending" element={(isTeacher || isAdmin) ? <CatePending/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/cate-pending?page=:page" element={(isTeacher || isAdmin) ? <CatePending/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/edit-profile"     element={isLogin ? <EditProfile/> : <ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/edit-profile/:id" element={isLogin ? <EditProfile/> : <ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/change-password"  element={isLogin ? <ChangePassword/> : <ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/un-auth" element={<ErrorPage msg="Bạn không có quyền xem trang này!"/>}/>
      <Route path="/not-found" element={<ErrorPage msg="Không tìm thấy trang cá nhân này! =(((("/>}/>
      <Route path="/:urlmsg" element={<ErrorPage/>}>
        <Route path="*" element={<ErrorPage/>}/>
      </Route>
    </Routes>
    <Footer/>
    <Header/>
    
    </>
  );
}

export default App;
