import { useState, useContext} from 'react';
import { useNavigate, Link} from 'react-router-dom';
import './RegisterPage.scss';
import {MDBBtn,MDBContainer,MDBCard,MDBCardBody,MDBRow,MDBCol,MDBInput} from 'mdb-react-ui-kit';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {sha256} from 'js-sha256';
import { Context } from '../Utils/ContextProvider';
export default function RegisterPage() {

    const navigate = useNavigate();
    const {setFullname,setAvatar,setIsLogin,moodleHome,PATTERN,REGISTER_BG,REGISTER_LEFT,API} = useContext(Context);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [showPassword, setShowPassword] = useState('password');
    function valiUsername(username) {
        const regex = /^[a-z][a-z0-9._]{1,100}$/;
        return regex.test(username);
    }
    function valiPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        return regex.test(password);
    }
    function valiSamePassword(password1, password2) {
        return password1 === password2;
    }
    function valiAll(username, password, rePassword) {
        if (!valiUsername(username)) {
            setErrorMsg('Tên đăng nhập không hợp lệ');
            setIsHidden(true);
        }
        else if(!valiPassword(password)){
            setErrorMsg('Mật khẩu phải chứa chữ thường, chữ hoa, số, ký tự đặc biệt và ít nhất 8 ký tự');
            setIsHidden(true);
        }
        else if(!valiSamePassword(password, rePassword)){
            setErrorMsg('Mật khẩu không khớp');
            setIsHidden(true);
        }
        else {
            setErrorMsg('');
            setIsHidden(false);
        }
    }
    function handleUsername(e){
        setUsername(e.target.value);
        if(!valiUsername(e.target.value)){
            setErrorMsg('Tên đăng nhập không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(e.target.value, password, rePassword);
    }
    function handlePassword(e){
        setPassword(e.target.value);
        if(!valiPassword(e.target.value)){
            setErrorMsg('Mật khẩu phải chứa chữ thường, chữ hoa, số, ký tự đặc biệt và ít nhất 8 ký tự');
            setIsHidden(true);
        }
        else
            valiAll(username, e.target.value, rePassword);
    }
    function handleRePassword(e){
        setRePassword(e.target.value);
        valiAll(username, password, e.target.value);      
    }
    function handleShowPassword(){
        if(showPassword === 'password'){
            setShowPassword('text');
        }else{
            setShowPassword('password');
        }
    }
    function handleRegister(){
        const url = `${API}/Controller/RegisterController.php`;
        const data = {
            data: JSON.stringify({
                username: username,
                password: sha256(password)
            })
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){//đăng ký thành công
                Swal.fire({
                    position: 'center',
                    text: res.message,
                    icon: 'success',
                    showDenyButton: true,
                    confirmButtonText: 'Cập nhật ngay!',
                    denyButtonText: 'Để sau',
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/');
                        //new tab
                        window.open(moodleHome, '_blank');
                        
                    } else if (result.isDenied) {
                        navigate('/');
                    }
                })
                
            }
            else if (res.status === -1){//chưa đăng xuất
                Swal.fire('Thông báo', res.message, 'error');
                setFullname("Khách");
                setAvatar("");
                setIsLogin(false);
            }
            else if (res.status === -2 || res.status === -3){ //username đã tồn tại or tên đăng nhập/mk không hợp lệ
                Swal.fire('Lỗi', res.message, 'error');
            }
            else if (isNaN(res.status)){//loi k xd
                Swal.fire('Lỗi', 'Lỗi không xác định', 'error');
            }
            
        }).fail(function(){
            Swal.fire('Lỗi', 'Không thể kết nối đến server', 'error');
        });
    }
    document.title = "Đăng ký tài khoản";
    return (
        <div className="register">
            <div className="main-bg" style={{backgroundImage:"url("+REGISTER_BG+")"}}>
                <div className="overlay" style={{backgroundImage:"url("+PATTERN+")"}}/>
                <MDBContainer>
                    <MDBCard>
                        <MDBRow className='g-0'>
                            <MDBCol md='6'>
                                <div className='register-img' style={{backgroundImage:"url("+REGISTER_LEFT+")"}}/>
                            </MDBCol>
                            <MDBCol md='6'>
                                <MDBCardBody className='d-flex flex-column'>
                                    <h3 className="fw-normal my-4 pb-3">ĐĂNG KÝ</h3>

                                    <MDBInput value={username} onChange={handleUsername} wrapperClass='mb-4' label='Tên tài khoản' type='text' size="lg" />
                                    <MDBInput value={password} onChange={handlePassword} wrapperClass='mb-4' label='Mật khẩu' type={showPassword} size="lg" />
                                    <MDBInput value={rePassword} onChange={handleRePassword} wrapperClass='mb-4' label='Nhập lại mật khẩu' type={showPassword} size="lg" />
                                    {/* check box show password */}
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" onClick={handleShowPassword}/>
                                        <label className="form-check-label">Hiển thị mật khẩu</label>
                                    </div>

                                    <div style={{minHeight:'30px', color: 'red'}}>{errorMsg}</div>
                                    <MDBBtn id='signup-btn' disabled = {isHidden} className="mb-4 px-5" color='success' size='lg' onClick={handleRegister}>Đăng ký</MDBBtn>
                                    <Link to={'/login'} style={{ color: '#393f81' }}>Đã có tài khoản? Đăng nhập ngay!</Link>
                                </MDBCardBody>
                            </MDBCol>

                        </MDBRow>
                    </MDBCard>

                </MDBContainer>
            </div>

        </div>
    );
}