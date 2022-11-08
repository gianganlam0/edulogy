import './CatePending.scss';
import {Row, Col, Button, Table} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useSearchParams, Link } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import CateItem from './CateItem';
const fakeData = []
for (let i = 1; i <= 10; i++) {
    fakeData.push({
        id: i,
        name: 'Danh mục ' + i,
        description: 'Mô tả danh mục ' + i,
        image: 'https://i.imgur.com/HcIaAlA.png',
        pending: (i % 3 === 0 ? -1 : (i % 3 === 1 ? 0 : 1)),
        time: '2021-06-0' + i,
        uploaderName: 'Nguyễn Văn ' + String.fromCharCode(64 + i),
        uploaderId: i
    })
}
export default function CatePending() {
    // const {isAdmin, isTeacher} = useContext(Context);

    document.title = "Danh mục chờ duyệt";
    return (
        <div className='cate-pending'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>Danh mục chờ duyệt</h3>
                        </div>
                        
                        <Row style={{padding: '10px 0 0'}}>

                            <Col md={12} className="mx-auto">
                                
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên danh mục</th>
                                        <th style={{width: '30px'}}>Mô tả</th>
                                        <th>Người đăng</th>
                                        <th>Hình ảnh</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fakeData.map((item, index) => {
                                        return <CateItem key={item.id} {...item}/>
                                    })}
                                </tbody>
                                </Table>                                  
                                   
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Button onClick={()=>{}}>
                                            Lưu
                                        </Button>
                                    </Col>
                                    <Col md={{span:'4',offset:'4'}} className="text-center">
                                        <Button onClick={()=>{}} variant="danger">
                                            Hủy
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