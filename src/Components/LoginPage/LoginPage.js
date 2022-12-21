import { useState, useContext} from 'react';
import { useNavigate, Link,useLocation } from 'react-router-dom';
import './LoginPage.scss';
import {MDBBtn,MDBContainer,MDBCard,MDBCardBody,MDBRow,MDBCol,MDBInput} from 'mdb-react-ui-kit';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {sha256} from 'js-sha256';
import { Context } from '../Utils/ContextProvider';
export default function LoginPage() {

    const navigate = useNavigate();
    const location = useLocation();
    const {LOGIN_BG,LOGIN_LEFT,PATTERN,setFullname,setAvatar,setIsLogin,moodleHome,API} = useContext(Context);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
    function valiAll(username, password) {
        if (!valiUsername(username)) {
            setErrorMsg('Tên đăng nhập không hợp lệ');
            setIsHidden(true);
        }
        else if(!valiPassword(password)){
            setErrorMsg('Mật khẩu không hợp lệ');
            setIsHidden(true);
        }
        else {
            setErrorMsg('');
            setIsHidden(false);
        }
    }
    function handleUsername(e){
        setUsername(e.target.value);
        valiAll(e.target.value, password);
    }
    function handlePassword(e){
        setPassword(e.target.value);
        valiAll(username, e.target.value);
    }
    function handleShowPassword(){
        if(showPassword === 'password'){
            setShowPassword('text');
        }else{
            setShowPassword('password');
        }
    }
    function handleLogin(){
        const url = `${API}/Controller/LoginController.php`;
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
            if (res.status === 0 || res.status === 1){//đăng nhập thành công hoặc đã đăng nhập
                Swal.fire({
                    position: 'center',
                    text: res.message,
                    icon: 'success',
                    timer: 2000,
                    width: 500,
                })
                setFullname(res.data.fullname);
                setAvatar(res.data.avatar);
                setIsLogin(true);
                navigate('/');
            }
            else if (res.status === 2 || res.status === 3 || res.status === -1 ){//sai username hoặc password hoặc lỗi qq j đó
                Swal.fire('Lỗi', res.message, 'error');
            }
            else if (res.status === -2){//chưa capaj nhat thong tin
                Swal.fire({
                    position: 'center',
                    text: res.message,
                    icon: 'error',
                    showDenyButton: true,
                    confirmButtonText: 'Cập nhật ngay!',
                    denyButtonText: 'Để sau',
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.open(moodleHome, '_blank');
                        
                    } else if (result.isDenied) {
                        // navigate('/');
                    }
                })

            }
            else if (isNaN(res.status)){//loi k xd
                Swal.fire({
                    position: 'top',
                    text: "Lỗi không xác định",
                    icon: 'error',
                    timer: 4000,
                    width: 500,
                })
            }
            
        }).fail(function(){
            Swal.fire({
                position: 'top',
                text: "Lỗi kết nối",
                icon: 'error',
                timer: 4000,
                width: 500,
            })
        });
    }
    //bind enter key to #login-btn
    $(document).on('keypress', function(e) {
        if(e.key === 'Enter') {
            if(location.pathname === '/login'){
                $('#login-btn').trigger('click');
            }
        }
    });
    document.title = "Đăng nhập";
    return (
        <div className="login-page">
            <div className="main-bg" style={{backgroundImage:"url("+LOGIN_BG+")"}}>
                <div className="overlay" style={{backgroundImage:"url("+PATTERN+")"}}/>
                <MDBContainer>
                    <MDBCard>
                        <MDBRow className='g-0'>
                            <MDBCol md='6'>
                                <div className='login-img' style={{backgroundImage:"url("+LOGIN_LEFT+")"}}/>
                            </MDBCol>
                            <MDBCol md='6'>
                                <MDBCardBody className='d-flex flex-column'>
                                    <h3 className="fw-normal my-4 pb-3">ĐĂNG NHẬP</h3>
                                    <MDBInput value={username} onChange={handleUsername} wrapperClass='mb-4' label='Tên tài khoản' type='text' size="lg" />
                                    <MDBInput value={password} onChange={handlePassword} wrapperClass='mb-4' label='Mật khẩu' type={showPassword} size="lg" />
                                    {/* check box show password */}
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" onClick={handleShowPassword}/>
                                        <label className="form-check-label">Hiển thị mật khẩu</label>
                                    </div>

                                    <div style={{minHeight:'30px', color: 'red'}}>{errorMsg}</div>
                                    <MDBBtn id='login-btn' disabled = {isHidden} className="mb-4 px-5" color='primary' size='lg' onClick={handleLogin}>Đăng nhập</MDBBtn>
                                    <Link to={'/forgot-password'} style={{ fontSize: 'small' }}>Quên mật khẩu?</Link>
                                    <Link to={'/register'} style={{ color: '#393f81' }}>Chưa có tài khoản? Đăng ký ngay!</Link>

                                </MDBCardBody>
                            </MDBCol>

                        </MDBRow>
                    </MDBCard>

                </MDBContainer>
            </div>

        </div>
    );
}