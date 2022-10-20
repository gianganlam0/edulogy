import * as Icon from 'react-bootstrap-icons';
import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './Header.scss';
import { useState, useEffect} from 'react';
import {useNavigate,} from "react-router-dom";
import * as CK from '../../Utils/Cookie';

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
              <NavDropdown.Item href="/logout"><span><Icon.DoorClosed/> Đăng xuất</span></NavDropdown.Item>
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