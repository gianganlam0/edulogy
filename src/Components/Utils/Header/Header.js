import * as Icon from 'react-bootstrap-icons';
import { Container, Row, Col, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import './Header.scss';
import Logo from '../../../images/logo.png';
import Avatar from '../../../images/avatar.png';
import { useState } from 'react';
// import styled from 'styled-components';


export default function Header() {

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
    <Navbar id="header" fixed='top' collapseOnSelect expand="lg" bg={navBarBg} variant="dark">
      <Container>
        <Navbar.Brand href="#home"><img src = {Logo} alt = 'logo'></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link active href="/"><Icon.HouseFill/> Trang chủ</Nav.Link>
            <Nav.Link href="/courses"><Icon.BookFill/> Khóa học</Nav.Link>
            <Nav.Link href="/news"><Icon.Newspaper/> Tin tức</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/contact"><Icon.TelephoneFill/> Liên lạc</Nav.Link>
            <NavDropdown title="anlam">
              <NavDropdown.Item href="/profile"><span><Icon.Person/> Thay đổi thông tin</span></NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/logout"><span><Icon.DoorClosed/> Đăng xuất</span></NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="/login"> Đăng nhập</Nav.Link>
            <Nav.Link href="/cart"><Icon.Cart/></Nav.Link>
            {/* avatar box */}
            <div className="avatar-box">
              <img src={Avatar} alt="avatar" />
              
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  </>

}