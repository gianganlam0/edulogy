import './Recharge.scss';
import {Row, Col, Button, Form} from 'react-bootstrap';
import {useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
// import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
export default function Recharge() {
    //get time and date
    const date = new Date();
    //padding 2 zeros
    const day = `0${date.getDate()}`.slice(-2);
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const year = date.getFullYear();
    //padding 2 zeros
    const hour = `0${date.getHours()}`.slice(-2);
    const minute = `0${date.getMinutes()}`.slice(-2);
    const second = `0${date.getSeconds()}`.slice(-2);
    const time = `${day}-${month}-${year} ${hour}:${minute}:${second}`;
    const navi = useNavigate();
    // const {loading} = useContext(Context);
    const [error, setError] = useState('');
    const [isHidden, setIsHidden] = useState(false);
    const [amount, setAmount] = useState(50000);
    const [desc, setDesc] = useState(`Nap tien vao tai khoan vao luc ${time}, so tien: 50000 VND`);
    const [title, setTitle] = useState('Nạp tiền vào tài khoản');
    const [hidden, setHidden] = useState(false);
    
    function valiAll(amount) {
        if (!valiAmount(amount)) {
            setError('Số tiền phải trong khoảng 50.000 và 1.000.000.000!');    
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
    function valiAmount(amount){
        //if amount is not a int
        const regex = /^\d+$/;
        if (!regex.test(amount)) return false;
        if (amount < 50000) return false;
        if (amount > 1000000000) return false;
        return true;
    }
    function handleAmount(e) {
        setAmount(e.target.value);
        const desc = `Nap tien vao tai khoan vao luc ${time}, so tien: ${e.target.value} VND`;
        setDesc(desc);
        valiAll(e.target.value);
    }
    function handleCancel() {
        Swal.fire({
            title: 'Hủy giao dịch',
            text: "Bạn có chắc muốn hủy giao dịch này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đồng ý',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                navi('/');
            }
        })
    }
    function handleRecharge(){
        const url = '/edulogy/api/Controller/UserController.php';
        const data = {
            amount: amount,
            content: desc,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'recharge'},
            }).done(function(res) {
                try {
                    res = JSON.parse(res);
                } catch (error) {}
                if (res.status <0) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: res.message,
                    })
                }
                else {
                    Swal.fire({
                        icon: 'success',
                        title: 'Đang xử lý',
                        text: res.message,
                    })
                    setTitle(res.message);
                    setHidden(true);
                    setIsHidden(true);
                    window.open(res.data);
                }
            })
            .fail(function() {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Lỗi không xác định!',
                })
            })
    }
    document.title = "Nạp tiền vào tài khoản";
    return (
        <div className='recharge'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>{title}</h3>
                        </div>
                        
                        <Row>
                            
                            <Col md={8} className="mx-auto">
                                <div style={{minHeight:'30px', color: 'red'}}>{error}</div> 
                                <p>Dấu <span style={{color:'red'}}>*</span> chỉ mục bắt buộc</p>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Số tiền <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control disabled={hidden} value={amount} onChange={handleAmount} type="number" placeholder="Nhập số tiền" />
                                    </Form.Group>

                                    {/* description textarea */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Nội dung</Form.Label>
                                        <Form.Control disabled value={desc} as="textarea" rows={3} />
                                    </Form.Group>
                                </Form>
                                
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Button hidden={isHidden} variant="danger" onClick={handleCancel}>
                                        Hủy
                                        </Button>
                                    </Col>
                                    <Col md={{span:'4',offset:'4'}} className="text-center">
                                        <Button hidden={isHidden} onClick={handleRecharge}>
                                        Chuyển đến trang thanh toán
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