import './ChangePassword.scss';
import { Button, Form } from 'react-bootstrap';
import $ from 'jquery';
import * as CK from '../Utils/Cookie';
import Swal from 'sweetalert2';
import {sha256} from 'js-sha256';
import { useState, useEffect , useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
export default function ChangePassword() {

    // const navi = useNavigate();
    const {fullname, avatar} = useContext(Context);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');

    const [error, setError] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [render, setRender] = useState(false);
    const [showPassword, setShowPassword] = useState('password');
    ///////////VALIDATE ALL INPUTS////////////
    function valiAll(oldPassword, newPassword, reNewPassword) {
        if (!valiPassword(oldPassword)) {
            setError('Mật khẩu cũ không hợp lệ');    
        }
        else if (!valiPassword(newPassword)) {
            setError('Mật khẩu mới không hợp lệ');
        }
        else if (!valiSamePassword(newPassword, reNewPassword)) {
            setError('Mật khẩu mới không khớp');
        }
        else {
            setError('');
            setIsHidden(false);
            return true;
        }
        setIsHidden(true);
        return false;

    }
    /////////////       VALIDATE       /////////////
    function valiPassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        return regex.test(password);
    }
    function valiSamePassword(password1, password2) {
        return password1 === password2;
    }
    function handleOldPassword(e) {
        setOldPassword(e.target.value);
        if (!valiPassword(e.target.value)) {
            setError('Mật khẩu cũ không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(e.target.value, newPassword, reNewPassword);
    }
    function handleNewPassword(e) {
        setNewPassword(e.target.value);
        if (!valiPassword(e.target.value)) {
            setError('Mật khẩu mới không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(oldPassword, e.target.value, reNewPassword);
    }
    function handleReNewPassword(e) {
        setReNewPassword(e.target.value);
        valiAll(oldPassword, newPassword, e.target.value);
    }
    function handleShowPassword(){
        if(showPassword === 'password'){
            setShowPassword('text');
        }else{
            setShowPassword('password');
        }
    }
    function handleSave(){
        setError('');//reset error
        const url = '/edulogy/api/Controller/UserController.php';
        var data = new FormData();

        data.append('data', JSON.stringify({
                        oldPassword: sha256(oldPassword),
                        newPassword: sha256(newPassword),
                        }));
        data.append('action', 'changePassword');
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire(res.message, '', 'success')
                setRender(!render);
            }
            else if (res.status === -1 || res.status === -2){
                Swal.fire(res.message, '', 'error')
            }
            else if (isNaN(res.status)){//loi k xd
                Swal.fire("Lỗi không xác định", '', 'error')
            }
            
        }).fail(function(){
            Swal.fire("Lỗi kết nối", '', 'error')
        });
    }
    useEffect(() => {//hủy thay đổi
        setOldPassword('');
        setNewPassword('');
        setReNewPassword('');
        setError('');
    }
    , [render]);
    document.title = "Thay đổi mật khẩu";
    return (
        <div className='change-password'>
            <div className="overlay" />
            <section className="section-profile">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>Thay đổi mật khẩu</h3>
                        </div>
                        {/* the left white */}
                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="account-settings">
                                            <div className="user-profile">
                                                <div className="user-avatar">
                                                    <img src={avatar} alt={fullname} />
                                                </div>
                                                <h5 className="fullname">{fullname}</h5>
                                            </div>                  
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* the right white */}
                            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 className="mb-2 text-primary">Mật khẩu</h6>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="old-password">Mật khẩu cũ</label>
                                                    <input value={oldPassword} onChange={handleOldPassword} type={showPassword} className="form-control" id="old-password" placeholder="Mật khẩu cũ" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="new-password">Mật khẩu mới</label>
                                                    <input value={newPassword} onChange={handleNewPassword} type={showPassword} className="form-control" id="new-password" placeholder="Mật khẩu mới" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="renew-password">Xác nhận mật khẩu mới</label>
                                                    <input value={reNewPassword} onChange={handleReNewPassword} type={showPassword} className="form-control" id="renew-password" placeholder="Xác nhận mật khẩu mới" />
                                                </div>
                                            </div>
                                        </div>
                                        {/* check box show password */}
                                        <div className="form-check" style={{margin: "10px 0"}}>
                                            <input type="checkbox" className="form-check-input" onClick={handleShowPassword}/>
                                            <label className="form-check-label">Hiển thị mật khẩu</label>
                                        </div>
                                        {/* hiện lỗi */}
                                        <div style={{minHeight:'30px', color: 'red'}}>{error}</div> 

                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                
                                                <div className="btn-right">
                                                    <Button variant='danger' onClick={()=>{
                                                        Swal.fire({
                                                        title: 'Bạn có chắc muốn hủy bỏ thay đổi?',
                                                        text: "Tất cả thay đổi sẽ mất!",
                                                        icon: 'warning',
                                                        showCancelButton: true,
                                                        confirmButtonColor: '#3085d6',
                                                        cancelButtonColor: '#d33',
                                                        confirmButtonText: 'Vâng, hủy bỏ thay đổi!',
                                                        cancelButtonText: 'Không, giữ lại thay đổi!'
                                                        }).then((res) => {
                                                        if (res.isConfirmed) {
                                                            Swal.fire({
                                                            title: 'Đã hủy bỏ thay đổi!',
                                                            icon: 'success',
                                                            showConfirmButton: false,
                                                            timer: 1500
                                                            })
                                                            setRender(!render)
                                                        }
                                                        })
                                                    }}>Hủy</Button>
                                                    <Button disabled={isHidden} onClick={()=>{
                                                        Swal.fire({
                                                        title: 'Bạn có muốn lưu thay đổi?',
                                                        showCancelButton: true,
                                                        confirmButtonText: 'Lưu',
                                                        cancelButtonText: 'Hủy',
                                                        }).then((result) => {
                                                        if (result.isConfirmed) {
                                                            handleSave();
                                                        }
                                                        })
                                                    }}>Cập nhật</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                </div>
            </section>
        </div>
    );
}