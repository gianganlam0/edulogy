import * as Icon from 'react-bootstrap-icons';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './Header.scss';
import { useState, useEffect} from 'react';
import {useNavigate,} from "react-router-dom";
import * as CK from '../../Utils/Cookie';
import $ from 'jquery';
import Swal from 'sweetalert2';

export default function Header() {
  const LS = localStorage;
  const [fullname , setFullname] = useState('');
  const [avatar , setAvatar] = useState('');
  
  const isLogin = CK.getCookie('id') !== '' ? true : false;

  useEffect(() => {
    const fullname = 'fullname' in LS ? JSON.parse(LS.getItem('fullname')) : 'Khách';
    const avatar = 'avatar' in LS ? JSON.parse(LS.getItem('avatar')) : 'https://i.imgur.com/AxnVk1a.png';
    setAvatar(avatar);
    setFullname(fullname);
  }, [isLogin, LS]);

  const navigate = useNavigate();
  const [navBarBg, setNavBarBg] = useState('transparent');
  const handleScroll = () => {
    if (window.scrollY > 100) {
      setNavBarBg('black')
    } else {
      setNavBarBg('transparent')
    }
  }
  const handleLogout = () => {
    const url = '/edulogy/api/Controller/LogoutController.php';
        $.ajax({
            url: url,
            type: 'POST',
        }).done(function(res){
            res = JSON.parse(res);
            if (res.status === 1){
              Swal.fire({
                  position: 'center',
                  text: res.message,
                  icon: 'success',
                  showConfirmButton: true,
                  timer: 2000,
                  width: 500,
              })
            }
            else{
              Swal.fire({
                  position: 'top',
                  text: res.message,
                  icon: 'error',
                  timer: 4000,
                  width: 500,
              })
            }
            navigate('/');           
        }).fail(function(){
            Swal.fire({
              position: 'top',
              text: 'Lỗi kết nối',
              icon: 'error',
              timer: 4000,
              width: 500,
          })
        });
    // CK.deleteCookie('id');
    // CK.deleteCookie('token');
    LS.removeItem('fullname');
    LS.removeItem('avatar');
    navigate('/');
  }

  window.addEventListener('scroll', handleScroll);
  return <>
    <Navbar id="header" fixed='top' collapseOnSelect expand="lg" bg={navBarBg} variant="white">
      <Container>
        <Navbar.Brand onClick={()=>{navigate('/')}}><div className='main-logo'/></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={()=>{navigate('/')}}><Icon.HouseFill/> Trang chủ</Nav.Link>
            <Nav.Link onClick={()=>{navigate('/course-list')}}><Icon.BookFill/> Khóa học</Nav.Link>
            <Nav.Link onClick={()=>{navigate('/cate-list')}}><Icon.PenFill/> Thể loại</Nav.Link>
          </Nav>
          <Nav>
            {/* <Nav.Link href="/contact"><Icon.TelephoneFill/> Liên lạc</Nav.Link> */}
            <NavDropdown disabled={!isLogin} title={fullname}>
              <NavDropdown.Item onClick={()=>{navigate('/edit-profile')}}><span><Icon.Person/> Thay đổi thông tin</span></NavDropdown.Item>
              <NavDropdown.Item href="/my-courses"><span><Icon.Book/> Khóa học của tôi</span></NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}><span><Icon.DoorClosed/> Đăng xuất</span></NavDropdown.Item>
            </NavDropdown>
            <Nav.Link hidden={isLogin} onClick={()=>{navigate('/login')}}> Đăng nhập</Nav.Link>
            <Nav.Link hidden={!isLogin} onClick={()=>{navigate('/cart')}}><Icon.Cart/></Nav.Link>
            {/* avatar box */}
            <div hidden={!isLogin} className="avatar-box">
              <img src={avatar} alt="avatar" />
              
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>

}