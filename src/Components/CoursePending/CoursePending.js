import './CoursePending.scss';
import {Row, Col, Button, Table} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import CourseItem from './CourseItem';

export default function CoursePending() {
    const navi = useNavigate();
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const {isAdmin, API} = useContext(Context);
    const [totalPage, setTotalPage] = useState();
    const [pendingList, setPendingList] = useState([]);
    const [totalPending, setTotalPending] = useState();
    const [totalAccept, setTotalAccept] = useState();
    const [render, setRender] = useState(false);
    useEffect(() => {//take params from url
        setPage(parseInt(params.get('page')));
        if (!params.has('page') || params.get('page') === '') {
            setPage(1);  
    }}, [params, setParams]);
    useEffect(() => {//get data from api
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            offset: (page - 1) * 10
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: isAdmin ? 'getCoursePending' : 'getMyCoursePending'
            },
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setTotalPage(Math.ceil(res.data.total / 10));
                setPendingList(res.data.data);
                setTotalPending(res.data.totalPending);
                setTotalAccept(res.data.totalAccept);
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [API, isAdmin, page, render]);
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
    useEffect(() => {//check if course startdate is <= today
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            offset: (page - 1) * 10
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'checkStartDate',
            },
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                if (res.data.isExp)
                    setRender(!render);
            }
            
        }).fail(function(err){
            console.log(err);
        });
    }, [API, page, render]);
    function handleAccept(id){
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            id: id,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                    action: 'acceptCourse'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire('', res.message, 'success');
                setRender(!render);
            }
            else{
                Swal.fire('', res.message, 'error');
            }
        }).fail(function(err){
            Swal.fire('Thất bại', 'Duyệt thất bại', 'error');
        });
    }
    function handleReject(id){
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            id: id,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                    action: 'rejectCourse'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire('', res.message, 'success');
                setRender(!render);
            }
            else{
                Swal.fire('', res.message, 'error');
            }
        }).fail(function(err){
            Swal.fire('Thất bại', 'Từ chối thất bại', 'error');
        });
    }
    function handleSaveCsv(){
        const url = `${API}/Controller/CourseController.php`;
        const data = {
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                    action: 'saveCsvCourse'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire('', res.message, 'success');
                setRender(!render);
            }
            else{
                Swal.fire('', res.message, 'error');
            }
        }).fail(function(err){
            Swal.fire('Thất bại', 'Lỗi mạng', 'error');
        });
        
    }
    document.title = "Khóa học chờ duyệt";
    return (
        <div className='course-pending'>
            <div className="overlay" />
            <section className="section-cate">
                <div className="container">
                    <div className="boxed">
                        <div className="section-title text-center">
                            <h3>Khóa học chờ duyệt</h3>
                        </div>                    
                        <Row style={{padding: '10px 0 0'}}>
                            <Col className="left-text" xs={12} lg={3}>
                                <p> Có {totalPending} khóa học chưa duyệt</p>
                                <p> Có {totalAccept} khóa học chưa xuất csv</p>
                            </Col>
                            <Col className="right-text" lg={{span: 3, offset: 6}}>
                                <Row>
                                <Button disabled={totalAccept === '0'} hidden={!isAdmin} onClick={handleSaveCsv} className="mb-1" variant='success'>Lưu csv</Button>
                                <Button hidden={!isAdmin} onClick={()=>navi('/course-csv')} className="mb-1" variant='warning'>Xem lịch sử xuất csv</Button>
                                </Row>
                            </Col>
                            <Col md={12} className="mx-auto">
                                
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên khóa học</th>
                                        <th>Tên rút gọn</th>
                                        <th><div style={{minWidth: '200px'}}>Thời khóa biểu</div></th>
                                        <th>Thể loại</th>
                                        <th>Ngày bắt đầu</th>
                                        <th>Ngày kết thúc</th>
                                        <th>Mã khóa học</th>
                                        <th><div style={{minWidth: '200px'}}>Mô tả</div></th>
                                        <th>Giá</th>
                                        <th><div style={{minWidth: '300px'}}>Hình ảnh</div></th>
                                        <th>Giáo viên</th>                                  
                                        <th>Thời gian đăng</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingList.map((item, index) => {
                                        return <CourseItem key={item.id} {...item} onAccept={()=>{handleAccept(item.id)}} onReject={()=>{handleReject(item.id)}}/>
                                    })}
                                </tbody>
                                </Table>                                  
                                   
                                <hr className="invis"></hr>
                                <Row>
                            <Col xs={12} lg={{span: 10, offset: 1}} style={{float: 'auto'}}>
                                <Pagination>{paginationItems}</Pagination>
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