import Header from './Components/Utils/Header/Header';
import Footer from './Components/Utils/Footer/Footer';
import Home from './Components/Home/Home';
import {Routes, Route, Link} from 'react-router-dom';
function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>}/>
      {/* <Route path="/courses" element={<Courses/>}/>
      <Route path="/news" element={<News/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/logout" element={<Logout/>}/> */}
    </Routes>
    <Header/>
    <Footer/>
    </>
  );
}

export default App;
