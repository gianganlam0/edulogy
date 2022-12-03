import './CourseCsv.scss';
import {Row, Col, Button, Table} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useSearchParams, Link , useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import CourseCsvItem from './CourseCsvItem';

export default function CourseCsv() {
    const navi = useNavigate();
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const {moodleHome} = useContext(Context);
    const [totalPage, setTotalPage] = useState();
    const [pendingList, setPendingList] = useState([]);
    const [total, setTotal] = useState();
    const [totalUnconfirm, setTotalUnconfirm] = useState();
    const [render, setRender] = useState(false);
    useEffect(() => {//take params from url
        setPage(parseInt(params.get('page')));
        if (!params.has('page') || params.get('page') === '') {
            setPage(1);  
    }}, [params, setParams]);
    useEffect(() => {//get data from api
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            offset: (page - 1) * 10
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getCourseCsv'
            },
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setTotalPage(Math.ceil(res.data.total / 10));
                setPendingList(res.data.data);
                setTotal(res.data.total);
                setTotalUnconfirm(res.data.totalUnconfirm);
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [page, render]);
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
    
    function handleConfirm(id){
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            id: id,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                    action: 'confirmCourseCsv'},
            beforeSend: function(){
                Swal.fire({
                    title: 'Đang xử lý...',
                    html: 'Xin chờ...',
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    didOpen: () => {
                      Swal.showLoading()
                    }
                  });
            },
        }).done(function(res){
            Swal.close();
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
            Swal.fire('Thất bại', 'Xác nhận thất bại', 'error');
        });
    }

    function handleDownload(csv){
        const file = new Blob([csv], {type: 'text/csv'});
        const url = URL.createObjectURL(file);
        window.open(url);
        URL.revokeObjectURL(url);
    }
    document.title = "Lịch sử xuất csv";
    return (
        <div className='course-csv'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>Lịch sử xuất csv</h3>
                        </div>
                        
                        <Row style={{padding: '10px 0 0'}}>
                            <Col className="left-text" xs={12} lg={3}>
                                <p> Có {total} kết quả xuất csv</p>
                                <p> Có {totalUnconfirm} kết quả chưa xác nhận upload</p>
                            </Col>
                            <Col className="right-text" lg={{span: 3, offset: 6}}>
                                <Row>
                                <Button onClick={()=> {window.open(moodleHome+'/admin/tool/uploadcourse/index.php')}} className="mb-1">Upload csv</Button>
                                </Row>
                            </Col>
                            <Col md={12} className="mx-auto">
                                
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th><div style={{minWidth: '300px'}}>Các tên rút gọn khóa học</div></th>
                                        <th>Người xuất</th>                   
                                        <th>Thời gian xuất</th>
                                        <th>Trạng thái</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingList.map((item, index) => {
                                        return <CourseCsvItem key={item.id} {...item} onConfirm={()=>{handleConfirm(item.id)}} onDownload={()=>{handleDownload(item.data)}}/>
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