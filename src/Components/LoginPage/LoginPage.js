import { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.scss';
import {MDBBtn,MDBContainer,MDBCard,MDBCardBody,MDBRow,MDBCol,MDBInput} from 'mdb-react-ui-kit';
import $ from 'jquery';
import Swal from 'sweetalert2';
import {sha256} from 'js-sha256';
import * as ck from '../Utils/Cookie';

export default function LoginPage() {
    const navigate = useNavigate();
    const isLogin = ck.getCookie('id');
    if (isLogin) {
        window.location.href = '/';
    }
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [showPassword, setShowPassword] = useState('password');

    function handleValiUsername(e){
        setUsername(e.target.value);
        const regex = /^[a-z][a-z0-9._]{1,100}$/;
        if(!regex.test(e.target.value) && e.target.value !== ''){
            setError('Tên đăng nhập không hợp lệ!');
            setIsHidden(true);
        }else{
            setError('');
            setIsHidden(false);
        }
        if (e.target.value === '' || password === ''){
            setIsHidden(true);
        }
    }
    function handleValiPassword(e){
        setPassword(e.target.value);
        //Password must have at least 8 characters, at least 1 number, at least 1 lowercase character, at least 1 uppercase character, at least 1 non-numeric character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        if(!regex.test(e.target.value) && e.target.value !== ''){
            setError('Mật khẩu không hợp lệ!');
            setIsHidden(true);
        }else{
            setError('');
            setIsHidden(false);
        }
        if (e.target.value === '' || username === ''){
            setIsHidden(true);
        }
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
            res = JSON.parse(res);
            if (res.status === 1 || res.status === 2){
                Swal.fire({
                    position: 'center',
                    text: res.message,
                    icon: 'success',
                    showConfirmButton: true,
                    timer: 2000,
                    width: 500,
                })
                localStorage.setItem('fullname', JSON.stringify(res.data.fullname));
                localStorage.setItem('avatar', JSON.stringify(res.data.avatar));
                navigate('/');
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
            
        }).fail(function(){
            setError('Lỗi kết nối!');
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

                                    <MDBInput value={username} onChange={handleValiUsername} wrapperClass='mb-4' label='Tên tài khoản' type='text' size="lg" />
                                    <MDBInput value={password} onChange={handleValiPassword} wrapperClass='mb-4' label='Mật khẩu' type={showPassword} size="lg" />
                                    {/* check box show password */}
                                    <div className="form-check mb-4">
                                        <input type="checkbox" className="form-check-input" onClick={handleShowPassword}/>
                                        <label className="form-check-label">Hiển thị mật khẩu</label>
                                    </div>

                                    <div style={{minHeight:'30px', color: 'red'}}>{error}</div>
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