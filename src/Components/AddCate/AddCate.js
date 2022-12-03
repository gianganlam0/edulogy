import './AddCate.scss';
import {Row, Col, Button, Form} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
export default function AddCate() {
    // const {isAdmin, isTeacher} = useContext(Context);
    const [error, setError] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [imgFile, setImgFile] = useState(undefined);
    const [image, setImage] = useState('https://i.imgur.com/HcIaAlA.png');
    const imgFileRef = useRef();
    function valiAll(name, imgFile) {
        if (!valiName(name)) {
            setError('Tên danh mục không được trống!');    
        }
        else if (!valiImgFile(imgFile)) {
            setError('Tệp ảnh không hợp lệ');
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
    function valiName(name){
        return name.length > 0 && name.length < 255;
    }
    function valiImgFile(imgFile) {
        const regex = /^image\/(jpg|jpeg|png)$/;
        if (imgFile === undefined) {
            return true;
        }
        return regex.test(imgFile.type);
    }
    function handleName(e) {
        setName(e.target.value);
        valiAll(e.target.value, imgFile);
    }
    function handleImgFile(e) {///có set cả avatar để preview
        setImgFile(e.target.files[0]);

        if (image.startsWith('blob:')) {
            URL.revokeObjectURL(image); //xóa cái cũ
        }
        if (!valiImgFile(e.target.files[0])) {
            setError('Tệp ảnh không hợp lệ');
            setIsHidden(true);
        }
        else if(e.target.files[0].size > 1024*1024*5){
            setError('Tệp ảnh không được quá 5MB');
            setIsHidden(true);
        }
        else {
            const temp = URL.createObjectURL(e.target.files[0]);
            setImage(temp); //for preview
            valiAll(name, e.target.files[0]);
        }
    }
    function handleDeleteImg() {
        if (image.startsWith('blob:')) {
            URL.revokeObjectURL(image); //xóa cái cũ
        }
        imgFileRef.current.value = null;
        setImgFile(undefined);
        setImage('https://i.imgur.com/HcIaAlA.png');
        valiAll(name, undefined);
    }
    function handleUp(){
        const url = '/edulogy/api/Controller/CateController.php';
        const data = new FormData();
        if (imgFile !== undefined) {
            data.append('imgFile', imgFile);
        }
        data.append('data', JSON.stringify({
            name: name,
            desc: desc,
            }));
        data.append('action', 'addCate');
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
        }).done(function(res) {
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire(res.message, '', 'success')
            }
            else if (res.status < 0){
                Swal.fire({
                    text: res.message,
                    icon: 'error',
                })
            }
            else if (isNaN(res.status)){//loi k xd
                Swal.fire({
                    text: "Lỗi không xác định",
                    icon: 'error',
                })
            }
            
        }).fail(function(){
            Swal.fire({
                text: "Lỗi kết nối",
                icon: 'error',
            })
        });

    }
    document.title = "Thêm danh mục";
    return (
        <div className='add-cate'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>Thêm danh mục</h3>
                        </div>
                        
                        <Row>
                            
                            <Col md={8} className="mx-auto">
                                <div style={{minHeight:'30px', color: 'red'}}>{error}</div> 
                                <p>Dấu <span style={{color:'red'}}>*</span> chỉ mục bắt buộc</p>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên danh mục <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control value={name} onChange={handleName} type="text" placeholder="Nhập tên danh mục" />
                                    </Form.Group>

                                    {/* description textarea */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control value={desc} onChange={e => setDesc(e.target.value)} as="textarea" rows={3} placeholder="Nhập mô tả" />
                                    </Form.Group>
                                    {/* image for category  */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ảnh danh mục</Form.Label>
                                        <Form.Control ref={imgFileRef} onChange={handleImgFile} onClick={e => e.target.value = null} type="file" accept="image/png, image/jpeg" placeholder="Chọn ảnh danh mục" />
                                    </Form.Group>
                                    {/* preview category image */}
                                    <div className="preview-img">
                                        <img src={image} alt="preview" />
                                    </div>
                                </Form>
                                {/* 2 button float start and end */}
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Button onClick={handleUp} disabled={isHidden}>
                                            Thêm danh mục
                                        </Button>
                                    </Col>
                                    <Col md={{span:'4',offset:'4'}} className="text-center">
                                        <Button onClick={handleDeleteImg} variant="danger">
                                            Xóa ảnh
                                        </Button>
                                    </Col>
                                </Row>
                                
                                    
                            </Col>
                        </Row>

                    </div>
                    
                </div>
            </section>
        </div>
    );
}