import * as Icon from 'react-bootstrap-icons';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './Header.scss';
import { useState, useEffect, useContext, useMemo} from 'react';
import {useNavigate, useLocation} from "react-router-dom";
import $ from 'jquery';
import * as CK from '../Cookie';
import Swal from 'sweetalert2';
import { Context } from '../ContextProvider';

export default function Header() {
  const {log, checkPathname, fullname, setFullname, avatar, setAvatar, isLogin,setIsAdmin,setIsTeacher,setIsLogin,setCart} = useContext(Context);
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [navBarBg, setNavBarBg] = useState('transparent');
  const [isExpand, setIsExpand] = useState(false);
  const initState = useMemo(() => {
    return {
      home: false,
      courses: false,
      cate: false,
      myInfo: false,
      myCourse: false,
      changePass: false,
      schedule: false,
      recharge: false,
      transHistory: false,
      login: false,
      cart: false
    }
  }, []);

  const [active, setActive] = useState(initState);
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => { // kiểm tra cookie hết hạn
    if (CK.getCookie('id') === '') {
      setFullname('Khách');
    }
  }, [pathname]);
  useEffect(() => { //chuyển trang thì đóng dropdown
    setIsExpand(false);
  }, [pathname]);
  useEffect(() => { //xử lý active
    if (pathname === '/') {
      setActive({...initState, home: true})
    }
    else if (pathname.includes('/course-list?') || checkPathname(pathname, '/course-list')) {
      setActive({...initState, courses: true})
    }
    else if (pathname.includes('/cate-list')) {
      setActive({...initState, cate: true})
    }
    else if(checkPathname(pathname, "/edit-profile")||
            checkPathname(pathname, "/edit-profile/my")||
            checkPathname(pathname, "/edit-profile/" + CK.getCookie('id'))) {
      setActive({...initState, myInfo: true});
    }
    else if(checkPathname(pathname, "/course-list/my")) {
      setActive({...initState, myCourse: true});
    }
    else if (checkPathname(pathname, '/change-password')) {
      setActive({...initState, changePass: true})
    }
    else if (checkPathname(pathname, '/schedule')) {
      setActive({...initState, schedule: true})
    }
    else if (checkPathname(pathname, '/recharge')) {
      setActive({...initState, recharge: true})
    }
    else if (checkPathname(pathname, '/transaction-history')) {
      setActive({...initState, transHistory: true})
    }
    else if(checkPathname(pathname, "/login")) {
      setActive({...initState, login: true})
    }
    else if(checkPathname(pathname, "/cart")) {
      setActive({...initState, cart: true})
    }
    else {
      setActive(initState);
    }
    
  }
  , [checkPathname, initState, pathname]);

  function handleDropdown(expanded){
    setIsExpand(expanded);
    setNavBarBg('black');
  }
  
  const handleScroll = () => {
    setScrollY(window.scrollY);
  }
  useEffect(() => { //cuộn chuột thì đổi màu navbar
    if (scrollY > 100) {
      setNavBarBg('black')
    } else if (!isExpand) {
      setNavBarBg('transparent')
    }
  }, [scrollY, isExpand])
  window.addEventListener('scroll', handleScroll);
  const handleLogout = () => {
    const url = '/edulogy/api/Controller/LogoutController.php';
        $.ajax({
            url: url,
            type: 'POST',
        }).done(function(res){
            try {
              res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
              Swal.fire({
                  position: 'center',
                  text: res.message,
                  icon: 'success',
                  showConfirmButton: true,
                  timer: 2000,
                  width: 500,
              })
              setFullname("Khách");
              setAvatar("");
              setIsLogin(false);
              setIsTeacher(false);
              setIsAdmin(false);
              navigate('/login');
              setCart([])
              localStorage.cart=JSON.stringify([]);
            }
            else if (res.status === 1){
              Swal.fire({ //dang xuat roi
                  position: 'top',
                  text: res.message,
                  icon: 'error',
                  timer: 4000,
                  width: 500,
              })
              setFullname("Khách");
              setAvatar("");
              setIsLogin(false);
              navigate('/login');
              setCart([])
              localStorage.cart=JSON.stringify([]);
            }
            else if (isNaN(res.status)){
              Swal.fire({
                  position: 'top',
                  text: "Lỗi server!",
                  icon: 'error',
                  timer: 4000,
                  width: 500,
              })
            }
            
            
        }).fail(function(){
            Swal.fire({
              position: 'top',
              text: 'Lỗi kết nối',
              icon: 'error',
              timer: 4000,
              width: 500,
            })
        });
    
  }
  
  return (
  <header className="header">
    <Navbar fixed='top' collapseOnSelect expand="lg" bg={navBarBg} variant="white" expanded={isExpand} onToggle = {handleDropdown}>
      <Container>
        <Navbar.Brand onClick={()=>{navigate('/')}}><div className='main-logo'/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link active={active.home} onClick={()=>{navigate('/')}}><Icon.HouseFill/> Trang chủ</Nav.Link>
            <Nav.Link active={active.courses} onClick={()=>{navigate('/course-list')}}><Icon.BookFill/> Khóa học</Nav.Link>
            <Nav.Link active={active.cate} onClick={()=>{navigate('/cate-list')}}><Icon.PenFill/> Danh mục</Nav.Link>
            {/* <Nav.Link href="/contact"><Icon.TelephoneFill/> Liên lạc</Nav.Link> */}
          </Nav>
          <Nav>
            
            <NavDropdown disabled={!isLogin} title={fullname}
            active={active.myInfo || active.myCourse || active.changePass||
              active.schedule||active.recharge||active.transHistory}>
              <NavDropdown.Item active={active.myInfo} onClick={()=>{navigate('/edit-profile/my')}}><span><Icon.Person/> Thay đổi thông tin</span></NavDropdown.Item>
              <NavDropdown.Item active={active.myCourse} onClick={()=>{navigate('/course-list/?mycourse=1')}}><span><Icon.Book/> Khóa học của tôi</span></NavDropdown.Item>
              <NavDropdown.Item active={active.changePass} onClick={()=>{navigate('/change-password')}}><span><Icon.Lock/> Thay đổi mật khẩu</span></NavDropdown.Item>
              <NavDropdown.Item active={active.schedule} onClick={()=>{navigate('/schedule')}}><span><Icon.Clock/> Xem thời khóa biểu</span></NavDropdown.Item>
              <NavDropdown.Item active={active.recharge} onClick={()=>{navigate('/recharge')}}><span><Icon.Cash/> Nạp tiền vào tài khoản</span></NavDropdown.Item>
              <NavDropdown.Item active={active.transHistory} onClick={()=>{navigate('/transaction-history')}}><span><Icon.ClockHistory/> Lịch sử giao dịch</span></NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}><span><Icon.DoorClosed/> Đăng xuất</span></NavDropdown.Item>
            </NavDropdown>
            <Nav.Link active={active.login} hidden={isLogin} onClick={()=>{navigate('/login')}}> Đăng nhập</Nav.Link>
            <Nav.Link active={active.cart} hidden={!isLogin} onClick={()=>{navigate('/cart')}}><Icon.Cart/></Nav.Link>
            {/* avatar box */}
            <div hidden={!isLogin} className="avatar-box">
              <img src={avatar} alt="avatar" />      
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </header>
  );

}