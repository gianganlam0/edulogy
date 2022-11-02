import { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import {MDBBtn,MDBContainer,MDBCard,MDBCardBody,MDBRow,MDBCol,MDBInput} from 'mdb-react-ui-kit';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {sha256} from 'js-sha256';
import { Context } from '../Utils/ContextProvider';
export default function LoginPage() {

    const navigate = useNavigate();
    const context = useContext(Context);
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
        const url = '/edulogy/api/Controller/LoginController.php';
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
                    showConfirmButton: true,
                    timer: 2000,
                    width: 500,
                })
                context.setFullname(res.data.fullname);
                context.setAvatar(res.data.avatar);
                context.setIsLogin(true);
                navigate('/');
            }
            else if (res.status === 2 || res.status === 3){//sai username hoặc password
                Swal.fire({
                    position: 'top',
                    text: res.message,
                    icon: 'error',
                    timer: 4000,
                    width: 500,
                })
            }
            else if (res.status === -1){
                Swal.fire({
                    position: 'top',
                    text: res.message,
                    icon: 'error',
                    timer: 4000,
                    width: 500,
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
    document.title = "Đăng nhập";
    return (
        <div className="login-page">
            <div className="main-bg">
                <div className="overlay" />
                <MDBContainer>

                    <MDBCard>
                        <MDBRow className='g-0'>

                            <MDBCol md='6'>
                                <div className='login-img' />
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
                                    <MDBBtn disabled = {isHidden} className="mb-4 px-5" color='primary' size='lg' onClick={handleLogin}>Đăng nhập</MDBBtn>
                                    <a className="small text-muted" href="#!">Quên mật khẩu?</a>
                                    {/* <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <a href="#!" style={{ color: '#393f81' }}>Register here</a></p> */}

                                </MDBCardBody>
                            </MDBCol>

                        </MDBRow>
                    </MDBCard>

                </MDBContainer>
            </div>

        </div>
    );
}