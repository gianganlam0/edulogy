import './Income.scss';
import {Row, Col, Table, InputGroup, FormControl, FormLabel} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import {useSearchParams } from 'react-router-dom';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import Item from './Item';
import * as CK from '../Utils/Cookie';
export default function Income() {
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const {isAdmin, API} = useContext(Context);
    const [totalPage, setTotalPage] = useState();
    //gmt +7
    //get today yyyy-mm-dd
    const today = new Date(new Date().getTime());
    //first day of month
    let fD = new Date(today.getFullYear(), today.getMonth(), 1, 7, 0, 0);
    //last day of month
    let lD = new Date(today.getFullYear(), today.getMonth() + 1, 0, 7, 0);
    fD = fD.toISOString().split('T')[0]
    lD = lD.toISOString().split('T')[0]
    const [firstDay, setFirstDay] = useState(fD);
    const [lastDay, setLastDay] = useState(lD);
    const [teacherId, setTeacherId] = useState(CK.getCookie('id'));
    const [teacherKeyword, setTeacherKeyword] = useState('');
    const [teacherList, setTeacherList] = useState([{teacherid: CK.getCookie('id'), fullname: localStorage.getItem('fullname').slice(1,-1)}]);
    const [list, setList] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    useEffect(() => {//take params from url
        setPage(parseInt(params.get('page')));
        if (!params.has('page') || params.get('page') === '') {
            setPage(1);  
    }}, [params, setParams]);
    useEffect(() => {//paging
        if (totalPage <= 4){
            setPaginationItems(
                <>
                <Pagination.First onClick={() => {
                        setParams({page: 1});
                    }}/>
                <Pagination.Prev disabled={page === 1} onClick={() => {
                        setParams({page: page-1});
                    }}/>
                {Array.from({ length: totalPage }, (_, i) => (
                    <Pagination.Item key={i+1} active={i+1 === page}
                    onClick={() => {
                        setParams({page: i+1});
                    }}
                    >{i+1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page === totalPage} onClick={() => {
                        setParams({page: page+1});
                    }} />
                <Pagination.Last onClick={() => {
                        setParams({page: totalPage});
                    }}/>
                </>
            );
        }
        else{
            if (page <= 2){
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page: 1});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page: page-1});
                        }}/>

                    <Pagination.Item active={page===1} onClick={() => {
                            setParams({page: 1});
                        }}>1</Pagination.Item>
                    <Pagination.Item active={page===2} onClick={() => {
                            setParams({page: 2});
                        }}>2</Pagination.Item>
                    {page === 2 ? <Pagination.Item onClick={() => {
                            setParams({page: 3});
                        }}>3</Pagination.Item> : null}
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={() => {
                            setParams({page: totalPage});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page: page+1});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page: totalPage});
                        }}/>
                    </>
                );
            }
            else if (page >= totalPage - 1){
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page: 1});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page: page-1});
                        }}/>
                    <Pagination.Item onClick={() => {
                            setParams({page: 1});
                        }}>1</Pagination.Item>
                    <Pagination.Ellipsis />
                    {page === totalPage - 1 ? <Pagination.Item onClick={() => {
                            setParams({page: totalPage - 2});
                        }}>{totalPage - 2}</Pagination.Item> : null}
                    <Pagination.Item active={page===totalPage-1} onClick={() => {
                            setParams({page: totalPage - 1});
                        }}>{totalPage - 1}</Pagination.Item>
                    <Pagination.Item active={page===totalPage} onClick={() => {
                            setParams({page: totalPage});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page: page+1});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page: totalPage});
                        }}/>
                    </>
                );
            }
            else{
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page: 1});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page: page-1});
                        }}/>
                    <Pagination.Item onClick={() => {
                            setParams({page: 1});
                        }}>1</Pagination.Item>
                    {page !== 3 ? <Pagination.Ellipsis /> : null}
                    <Pagination.Item onClick={() => {
                            setParams({page: page-1});
                        }}>{page-1}</Pagination.Item>
                    <Pagination.Item active onClick={() => {
                            setParams({page: page});
                        }}>{page}</Pagination.Item>
                    <Pagination.Item onClick={() => {
                            setParams({page: page+1});
                        }}>{page+1}</Pagination.Item>
                    {page !== totalPage - 2 ? <Pagination.Ellipsis /> : null}
                    <Pagination.Item onClick={() => {
                            setParams({page: totalPage});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page: page+1});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page: totalPage});
                        }}/>
                    </>
                );
            }
                
        }
    }, [page, totalPage, setPage, setParams]);
    useEffect(() => {//get data from api
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            offset: (page - 1) * 10,
            firstDay: firstDay,
            lastDay: lastDay,
            teacherId: teacherId,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getIncome'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setList(res.data.data);
                setTotalPage(Math.ceil(res.data.total / 10));
                let temp=0
                for (let i = 0; i < res.data.data.length; i++){
                    temp+= parseInt(res.data.data[i].amount);
                }
                temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                setTotalAmount(temp);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                });
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [page, firstDay, lastDay, teacherId, API]);
    function handleTeacherKeyword(e) {
        const newKeyword = e.target.value;
        setTeacherKeyword(newKeyword);
        if (newKeyword.length === 0) {
            setTeacherList([{teacherid: CK.getCookie('id'), fullname: localStorage.getItem('fullname').slice(1,-1)}]);
            setTeacherId(CK.getCookie('id'));
        }
        else{
            const url = `${API}/Controller/UserController.php`;
            const data = {
                offset: 0,
                limit: 30,
                keyword: newKeyword,
            }
            $.ajax({
                url: url,
                type: 'POST',
                data: {data: JSON.stringify(data),
                    action: 'getTeacherList'},
                }).done(function(res){
                    try {
                        res = JSON.parse(res);
                    } catch (error) {}
                    if (res.status === 0) {
                        if (res.data.data.length === 0) {
                            setTeacherList([{teacherid: CK.getCookie('id'), fullname: localStorage.getItem('fullname').slice(1,-1)}]);
                            setTeacherId(CK.getCookie('id'));
                            return;
                        }
                        setTeacherList(res.data.data);
                        setTeacherId(res.data.data[0].id);
                    }
                }).fail(function(err){
                    console.log(err);
                });
        }
    }
    document.title = "Tổng thu nhập";
    return (
        <div className='income'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        
                        <Row className="section-title text-center mb-3">
                            <h3>Tổng thu nhập</h3>
                        </Row>
                        <Row hidden={!isAdmin} className="justify-content-center">
                            
                                <Col lg={4}>
                                    <InputGroup className="mb-3">
                                    <FormLabel style={{margin:'0 10px'}}>Giáo viên: </FormLabel>
                                    <FormControl value={teacherKeyword} onChange={handleTeacherKeyword} type="text" placeholder="Tìm kiếm giáo viên" />
                                    </InputGroup>
                                </Col>
                                <Col lg={4}>
                                <select className='form-control' value={teacherId} onChange={e => setTeacherId(e.target.value)}>
                                {teacherList.map((item, i) => {
                                return <option key={i} value={item.id}>{item.fullname}</option>
                                }
                                )}
                                </select>
                                </Col>
                            
                        </Row>
                        <Row className='justify-content-center'>
                            <Col className="text-end" md={4} lg={4} xs={12} sm={12}>
                                <InputGroup className="mb-3">
                                    <FormLabel style={{margin:'0 10px'}}>Từ ngày</FormLabel>
                                    <FormControl value={firstDay} onChange={(e)=>setFirstDay(e.target.value)} style={{margin:'0 10px'}} type='date'/>
                                </InputGroup>
                            </Col>
                            <Col className="text-start" md={4} lg={4} xs={12} sm={12}>
                            <InputGroup className="mb-3">
                                    <FormLabel style={{margin:'0 10px'}}>Đến ngày</FormLabel>
                                    <FormControl value={lastDay} onChange={(e)=>setLastDay(e.target.value)} style={{margin:'0 10px'}} type='date'/>
                                </InputGroup>
                            </Col>
                        </Row>

                        <Row style={{padding: '10px 0 0'}}>
                            <Col md={12} className="mx-auto">           
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên khóa học</th>
                                        <th>Tên học viên</th>
                                        <th>Số tiền</th>
                                        <th>Thời gian</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.map((item, index) => {
                                        return <Item key={index} {...item}/>
                                    })}
                                </tbody>
                                </Table>                                  
                                
                                <hr className="invis"></hr>
                            </Col>
                            <Col md={6}>
                                <h4>Tổng thu nhập: {totalAmount} VNĐ</h4>
                            </Col>
                            <Col xs={12} lg={{span: 10, offset: 1}} style={{float: 'auto'}}>
                                <Pagination>{paginationItems}</Pagination>
                            </Col>
                        </Row>

                    </div>
                    
                </div>
            </section>
        </div>
    );
}