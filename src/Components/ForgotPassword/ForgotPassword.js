import { useState, useContext} from 'react';
import { useNavigate, Link} from 'react-router-dom';
import './ForgotPassword.scss';
import {MDBBtn,MDBContainer,MDBCard,MDBCardBody,MDBRow,MDBCol,MDBInput} from 'mdb-react-ui-kit';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { Context } from '../Utils/ContextProvider';
export default function ForgotPassword() {
    const navigate = useNavigate();
    const {FORGOT_BG,PATTERN,FORGOT_LEFT,loading,API} = useContext(Context);
    const [email, setEmail] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    function valiEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }
    function valiAll(email) {
        if (!valiEmail(email)) {
            setErrorMsg('Email không hợp lệ');
            setIsHidden(true);
        }
        else {
            setErrorMsg('');
            setIsHidden(false);
        }
    }
    function handleEmail(e){
        setEmail(e.target.value);
        valiAll(e.target.value);
    }
    function handleForgot(){
        const url = `${API}/Controller/UserController.php`;
        const data = {
            data: JSON.stringify({
                email: email,
            }),
            action: 'forgotPassword'
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            beforeSend: function(){
                loading();
            }
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire({
                    position: 'center',
                    text: res.message,
                    icon: 'success',
                    timer: 2000,
                    width: 500,
                })
                navigate('/');
            }
            else if (res.status < 0 ){ //loi
                Swal.fire('Lỗi', res.message, 'error');
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
    document.title = "Quên mật khẩu";
    return (
        <div className="forgot-password">
            <div className="main-bg" style={{backgroundImage:"url("+FORGOT_BG+")"}}>
                <div className="overlay" style={{backgroundImage:"url("+PATTERN+")"}}/>
                <MDBContainer>
                    <MDBCard>
                        <MDBRow className='g-0'>
                            <MDBCol md='6'>
                                <div className='login-img' style={{backgroundImage:"url("+FORGOT_LEFT+")"}}/>
                            </MDBCol>
                            <MDBCol md='6'>
                                <MDBCardBody className='d-flex flex-column'>
                                    <h3 className="fw-normal">QUÊN MẬT KHẨU</h3>
                                    <h6 className="fw-normal my-4 pb-3">Nhập email liên kết với tài khoản:</h6>
                                    <MDBInput value={email} onChange={handleEmail} wrapperClass='mb-4' label='Email' type='text' size="lg" />

                                    <div style={{minHeight:'30px', color: 'red'}}>{errorMsg}</div>
                                    <MDBBtn id='forgot-btn' disabled = {isHidden} className="mb-4 px-5" color='warning' size='lg' onClick={handleForgot}>Khôi phục mật khẩu</MDBBtn>
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