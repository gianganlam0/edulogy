import Header from './Components/Utils/Header/Header';
import Footer from './Components/Utils/Footer/Footer';
import Home from './Components/Home/Home';
import LoginPage from './Components/LoginPage/LoginPage';
import RegisterPage from './Components/RegisterPage/RegisterPage';
import ForgotPassword from './Components/ForgotPassword/ForgotPassword';
import CourseList from './Components/CourseList/CourseList';
import AddCourse from './Components/AddCourse/AddCourse';
import CoursePending from './Components/CoursePending/CoursePending';
import CourseCsv from './Components/CourseCsv/CourseCsv';
import CourseDetail from './Components/CourseDetail/CourseDetail';
import MemberList from './Components/MemberList/MemberList';
import Schedule from './Components/Schedule/Schedule';
import CateList from './Components/CateList/CateList';
import Cart from './Components/Cart/Cart';
import EditProfile from './Components/EditProfile/EditProfile';
import ChangePassword from './Components/ChangePassword/ChangePassword';
import AddCate from './Components/AddCate/AddCate';
import CatePending from './Components/CatePending/CatePending';
import ErrorPage from './Components/ErrorPage/ErrorPage';
import Recharge from './Components/Recharge/Recharge';
import TransactionHistory from './Components/TransactionHistory/TransactionHistory';
import Income from './Components/Income/Income';
import IncomeAll from './Components/IncomeAll/IncomeAll';
import UserList from './Components/UserList/UserList';
import {Routes, Route, useLocation} from 'react-router-dom';

import * as CK from './Components/Utils/Cookie';
import {useContext, useLayoutEffect, useEffect} from 'react';
import { Context } from './Components/Utils/ContextProvider';

function App() {
  const {
    isLogin, setIsLogin,
    isTeacher, setIsTeacher,
    isAdmin, setIsAdmin} = useContext(Context);
  const location = useLocation();
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

  }, [isLogin, setIsAdmin, setIsLogin, setIsTeacher]);

  useEffect(() => {
    //scroll to top
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={!isLogin ? <LoginPage/> : <ErrorPage msg="Bạn đã đăng nhập rồi !"/>}/>
      <Route path="/register" element={!isLogin ? <RegisterPage/> : <ErrorPage msg="Bạn phải đăng xuất mới đăng ký tài khoản được !"/>}/>
      <Route path="/forgot-password" element={!isLogin ? <ForgotPassword/> : <ErrorPage msg="Bạn phải đăng xuất trước !"/>}/>
      <Route path="/course-list" element={<CourseList/>}/>
      <Route path="/course-list?page=:page&keyword=:keyword&cateid=:cateid&teacherid=:teacherid&mycourse=:mycourse&searchby=:searchby&sortby=:sortby&orderby:=orderby" element={<CourseList/>}/>
      <Route path="/add-course" element={(isTeacher || isAdmin) ? <AddCourse/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/course-detail" element={<ErrorPage msg="Thiếu thông tin id khóa học !"/>}/>
      <Route path="/course-detail/:id" element={<CourseDetail/>}/>
      <Route path="/member-list" element={<MemberList/>}/>
      <Route path="/member-list/id=:id&page=:page" element={<MemberList/>}/>
      <Route path="/schedule" element={isLogin?<Schedule/>:<ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/cate-list" element={<CateList/>}/>
      <Route path="/cate-list?page=:page&keyword=:keyword&sortby=:sortby&orderby=:orderby" element={<CateList/>}/>
      <Route path="/add-cate" element={(isTeacher || isAdmin) ? <AddCate/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/course-pending" element={(isTeacher || isAdmin) ? <CoursePending/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/course-pending?page=:page" element={(isTeacher || isAdmin) ? <CoursePending/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/course-csv" element={isAdmin ? <CourseCsv/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/course-csv?page=:page" element={isAdmin ? <CourseCsv/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/cate-pending" element={(isTeacher || isAdmin) ? <CatePending/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/cate-pending?page=:page" element={(isTeacher || isAdmin) ? <CatePending/> : <ErrorPage msg="Bạn không có quyền xem trang này !"/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/cart?page=:page" element={<Cart/>}/>
      <Route path="/edit-profile"     element={isLogin ? <EditProfile/> : <ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/edit-profile/:id" element={isLogin ? <EditProfile/> : <ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/change-password"  element={isLogin ? <ChangePassword/> : <ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/recharge" element={isLogin?<Recharge/>:<ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/transaction-history" element={isLogin?<TransactionHistory/>:<ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/income" element={(isAdmin||isTeacher)?<Income/>:<ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/income?page=:page" element={(isAdmin||isTeacher)?<Income/>:<ErrorPage msg="Bạn chưa đăng nhập !"/>}/>
      <Route path="/income-all" element={isAdmin?<IncomeAll/>:<ErrorPage msg="Bạn không có quyền !"/>}/>
      <Route path="/income-all?page=:page" element={isAdmin?<IncomeAll/>:<ErrorPage msg="Bạn không có quyền !"/>}/>
      <Route path="/user-list" element={isAdmin?<UserList/>:<ErrorPage msg="Bạn không có quyền !"/>}/>
      <Route path="/user-list?page=:page" element={isAdmin?<UserList/>:<ErrorPage msg="Bạn không có quyền !"/>}/>
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
