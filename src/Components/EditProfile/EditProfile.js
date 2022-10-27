import './EditProfile.scss';
import { Button, Form } from 'react-bootstrap';
import $ from 'jquery';
import * as CK from '../Utils/Cookie';
import Swal from 'sweetalert2';
import { useState, useEffect , useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import { useParams, useNavigate } from 'react-router-dom';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';

export default function EditProfile() {
    const params = useParams();

    const navi = useNavigate();
    const [userId, setUserId] = useState();
    const [isMyProfile, setIsMyProfile] = useState(false);
    
    const {isAdmin} = useContext(Context);

    const [lastname, setLastname] = useState('');
    const [firstname, setFirstname] = useState('');
    const [phone, setPhone] = useState('');
    const [IDNumber, setIDNumber] = useState('');
    const [sex, setSex] = useState('');
    const [birthday, setBirthday] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [balance, setBalance] = useState('');
    const [desc, setDesc] = useState('');
    const [avaFile, setAvaFile] = useState(undefined);

    const [avatar, setAvatar] = useState('');

    const [error, setError] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [isBasicAva, setIsBasicAva] = useState(true);
    const [isEditMode, setIsEditMode] = useState(false);
    
    useEffect(() => {//kiểm tra có phải ava cơ bản hay không để còn hiện nút xóa
        if (avatar === 'http://localhost/edulogy/api/images/avatar/basic.png'){
            setIsBasicAva(true);
        }
        else{
            setIsBasicAva(false);
        }
    }, [avatar]);
    ///////////VALIDATE ALL INPUTS////////////
    function valiAll(lastname, firstname, phone, IDNumber , birthday, email, avaFile) {
        if (!valiLastname(lastname)) {
            setError('Họ không hợp lệ');    
        }
        else if (lastname.length > 100) {
            setError('Họ không được quá 100 ký tự!');
        }
        else if (!valiFirstname(firstname)) {
            setError('Tên đệm và tên không hợp lệ');
        }
        else if (firstname.length > 100) {
            setError('Tên đệm và tên không được quá 100 ký tự!');
        }
        else if (!valiPhone(phone)) {
            setError('Số điện thoại không hợp lệ');
        }
        else if (!valiIDNumber(IDNumber)) {
            setError('Số CMND/CCCD không hợp lệ');
        }
        else if (!valiBirthday(birthday)) {
            setError('Ngày sinh không hợp lệ');
        }
        else if (!valiEmail(email)) {
            setError('Email không hợp lệ');
        }
        else if (!valiAvaFile(avaFile)) {
            setError('Tệp ảnh đại diện không hợp lệ');
        }
        else {
            setError('');
            setIsHidden(false);
            return true;
        }
        setIsHidden(true);
        return false;
/////////////       VALIDATE
    }
    function valiLastname(lastname) {
        const regex = /^[\p{L}']([ \p{L}'-]*[\p{L}])?$/u;
        return regex.test(lastname);
    }
    function valiFirstname(firstname) {
        const regex = /^[\p{L}']([ \p{L}'-]*[\p{L}])?$/u;
        return regex.test(firstname);
    }
    function valiPhone(phone) {
        const regex = /^[0-9]{10,20}$/;
        return regex.test(phone);
    }
    function valiIDNumber(IDNumber) {
        const regex = /^[0-9]{9,12}$/;
        return regex.test(IDNumber);
    }
    function valiBirthday(birthday) {
        const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
        if (regex.test(birthday)) {
            const date = new Date(birthday);
            const today = new Date();
            if (date > today) {
                return false;
            }
            else if (date.getFullYear() < 1800) {// hơn 200 tuổi
                return false;
            }
            return true;
        }
        return false;
    }
    function valiEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    }
    function valiAvaFile(avaFile) {
        const regex = /^image\/(jpg|jpeg|png)$/;
        if (avaFile === undefined) {
            return true;
        }
        return regex.test(avaFile.type);
    }
    function handleLastname(e) {
        //cái đầu tiên
        setLastname(e.target.value);
        valiAll(e.target.value, firstname, phone, IDNumber, birthday, email, avaFile);
    }
    function handleFirstname(e) {
        setFirstname(e.target.value);
        if (!valiFirstname(e.target.value)) {
            setError('Tên đệm và tên không hợp lệ');
            setIsHidden(true);
        }
        else if (e.target.value.length > 100) {
            setError('Tên đệm và tên không được quá 100 ký tự!');
            setIsHidden(true);
        }
        else
            valiAll(lastname, e.target.value, phone, IDNumber, birthday, email, avaFile);
    }
    function handlePhone(e) {
        setPhone(e.target.value);
        if (!valiPhone(e.target.value)) {
            setError('Số điện thoại không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(lastname, firstname, e.target.value, IDNumber, birthday, email, avaFile);
    }
    function handleIDNumber(e) {
        setIDNumber(e.target.value);
        if (!valiIDNumber(e.target.value)) {
            setError('Số CMND/CCCD không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(lastname, firstname, phone, e.target.value, birthday, email, avaFile);
    }
    function handleSex(e) {
        setSex(e.target.value);
    }
    function handleBirthday(e) {
        setBirthday(e.target.value);
        if (!valiBirthday(e.target.value)) {
            setError('Ngày sinh không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(lastname, firstname, phone, IDNumber, e.target.value, email, avaFile);
    }
    function handleEmail(e) {
        setEmail(e.target.value);
        if (!valiEmail(e.target.value)) {
            setError('Email không hợp lệ');
            setIsHidden(true);
        }
        else
            valiAll(lastname, firstname, phone, IDNumber, birthday, e.target.value, avaFile);
    }
    function handleRole(e) {
        setRole(e.target.value);
    }
    function handleDesc(e) {
        setDesc(e.target.value);
    }
    function handleAvaFile(e) {///có set cả avatar để preview
        setAvaFile(e.target.files[0]);
        if (!valiAvaFile(e.target.files[0])) {
            setError('Tệp ảnh đại diện không hợp lệ');
            setIsHidden(true);
        }
        else
            setAvatar(URL.createObjectURL(e.target.files[0]));
            valiAll(lastname, firstname, phone, IDNumber, birthday, email, e.target.files[0]);
    }
    function handleIsEditMode(e) {
        setIsEditMode(e.target.checked);
    }
    useEffect(() => {//kiểm tra xem phải trang của mình hay không
        if(params.id === "my" || Object.keys(params).length === 0 || params.id === CK.getCookie('id')) {
            setUserId(CK.getCookie('id'));
            setIsMyProfile(true);       
        }
        //else if type of params.id is a integer number
        else if(!isNaN(params.id)){
            setUserId(params.id);
            setIsMyProfile(false);
        }
        else{
            navi('/not-found');
        }     
    }, [params, navi]);

    useEffect(() => {//lấy thông tin user
        if (userId === undefined) {//init state
            return;
        }
        if (isMyProfile) {
            const url = '/edulogy/api/Controller/UserController.php';
            const data = {data: JSON.stringify({id: ''})};
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
            }).done(function(res){
                try {
                    res = JSON.parse(res);
                } catch (error) {}
                if (res.status === 0){
                    setLastname(res.data.lastname);
                    setFirstname(res.data.firstname);
                    setPhone(res.data.phone);
                    setIDNumber(res.data.IDNumber);
                    setSex(res.data.sex);
                    setBirthday(res.data.birthday);
                    setUsername(res.data.username);
                    setEmail(res.data.email);
                    setRole(res.data.role);
                    setBalance(res.data.balance);
                    if (res.data.desc === null) {
                        setDesc('');
                    }
                    else {
                        setDesc(res.data.desc);
                    }
                    setAvatar(res.data.avatar);
                }
                else if (res.status === -1 || res.status === 1){
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
        else {
            const url = '/edulogy/api/Controller/UserController.php';
            const data = {data: JSON.stringify({id: userId})};
            $.ajax({
                url: url,
                type: 'POST',
                data: data,
            }).done(function(res){
                try {
                    res = JSON.parse(res);
                } catch (error) {}
                if (res.status === 0){
                    setLastname(res.data.lastname);
                    setFirstname(res.data.firstname);
                    setUsername(res.data.username);
                    setEmail(res.data.email);
                    setRole(res.data.role);
                    if (isAdmin){
                        setBalance(res.data.balance);
                    }
                    if (res.data.desc === null) {
                        setDesc('');
                    }
                    else {
                        setDesc(res.data.desc);
                    }
                    setAvatar(res.data.avatar);
                }
                else if (res.status < 0){
                    Swal.fire({
                        position: 'top',
                        text: res.message,
                        icon: 'error',
                        timer: 4000,
                        width: 500,
                    })
                    navi('/not-found');
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
    }, [isEditMode, isMyProfile, userId, isAdmin, navi]);
    document.title = lastname + ' ' + firstname;
    return (
        <div className='edit-profile'>
            <div className="overlay" />
            <section className="section-profile">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>{"Thông tin cá nhân của " + (isMyProfile ? 'tôi' : document.title)}</h3>
                        </div>

                        <div className="row">
                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="account-settings">
                                            <div className="user-profile">
                                                <div className="user-avatar">
                                                    <img src={avatar} alt={lastname + ' ' + firstname} />
                                                </div>
                                                <h5 className="fullname">{lastname + ' ' + firstname}</h5>
                                                <h6 className="email">{email}</h6>
                                            </div>
                                            <div className="about">
                                                <h5>Giới thiệu</h5>
                                                <Interweave content={desc}
	                                                matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}
                                                    newWindow
                                                />
                                            </div>
                                            <div hidden={!isMyProfile} className="change-ava-btn">
                                                <input onChange={handleAvaFile} hidden id="up-btn" type="file" accept="image/png, image/jpeg" />
                                                <Button hidden={!isEditMode} variant="dark" onClick={()=>{$('#up-btn').click()}}>Thay đổi ảnh đại diện</Button>
                                                <Button hidden={isBasicAva || !isEditMode} variant="danger">Xóa ảnh đại diện</Button>  
                                            </div>                             
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                                <div className="card h-100">
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 className="mb-2 text-primary">Thông tin cá nhân</h6>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="lastname">Họ</label>
                                                    <input disabled={!isMyProfile || !isEditMode} onChange={handleLastname} value={lastname} type="text" className="form-control" id="lastname" placeholder="Họ" />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="firstname">Tên đệm và tên</label>
                                                    <input disabled={!isMyProfile || !isEditMode} onChange={handleFirstname} value={firstname} type="text" className="form-control" id="firstname" placeholder="Tên đệm và tên" />
                                                </div>
                                            </div>
                                            <div hidden={!isMyProfile} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="phone">Số điện thoại</label>
                                                    <input disabled={!isEditMode} onChange={handlePhone} value={phone} type="tel" className="form-control" id="phone" placeholder="Số điện thoại" />
                                                </div>
                                            </div>
                                            <div hidden={!isMyProfile} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="website">Số CMND/CCCD</label>
                                                    <input disabled={!isEditMode} onChange={handleIDNumber} value={IDNumber} type="text" className="form-control" id="id-number" placeholder="CMND/CCCD" />
                                                </div>
                                            </div>
                                            <div hidden={!isMyProfile} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="sex"/>Giới tính
                                                    <select disabled={!isEditMode} onChange={handleSex} value={sex} className="form-control" id="sex">
                                                        <option value="0">Nam</option>
                                                        <option value="1">Nữ</option>
                                                        <option value="2">Khác</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div hidden={!isMyProfile} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                <label htmlFor="dob"/>Ngày sinh
                                                <input disabled={!isEditMode} onClick={handleBirthday} onChange={handleBirthday} value={birthday} type="date" className="form-control" id="dob" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 className="mt-3 mb-2 text-primary">Thông tin tài khoản</h6>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="username">Tên người dùng</label>
                                                    <input value={username} disabled type="text" className="form-control" id="username" placeholder="Tên người dùng" />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <input disabled={!isMyProfile  || !isEditMode} onChange={handleEmail} value={email} type="email" className="form-control" id="email" placeholder="Email" />
                                                </div>
                                            </div>
                                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="role">Vai trò</label>
                                                    <select onChange={handleRole} value={role} disabled={!isAdmin  || !isEditMode} className="form-control" id="role">
                                                        <option value="0">Học viên</option>
                                                        <option value="1">Giảng viên</option>
                                                        <option value="2">Quản trị</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div hidden={!isAdmin && !isMyProfile} className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                                                <div className="form-group">
                                                    <label htmlFor="balance">Số dư tài khoản (VNĐ)</label>
                                                    <input value={balance} disabled type="number" className="form-control" id="balance" placeholder="Số dư tài khoản" />
                                                </div>
                                            </div>
                                            <div style={{minHeight:'30px', color: 'red'}}>{error}</div> 
                                        </div>
                                        <div className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <h6 className="mt-3 mb-2 text-primary">Giới thiệu</h6>
                                            </div>
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="form-group">
                                                    <textarea disabled={!isMyProfile || !isEditMode} onChange={handleDesc} value={desc} className="form-control" id="about" rows="5" placeholder="Giới thiệu"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div hidden={!isMyProfile && !isAdmin} className="row">
                                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                                                <div className="btn-left">
                                                    <Form.Check onChange={handleIsEditMode} value={isEditMode} type="switch" label="Bật chế độ chỉnh sửa"/> 
                                                </div>
                                                
                                                <div hidden={!isEditMode} className="btn-right">
                                                    <Button variant='danger'>Hủy</Button>
                                                    <Button disabled={isHidden}>Cập nhật</Button>
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