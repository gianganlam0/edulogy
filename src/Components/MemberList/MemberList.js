import './MemberList.scss';
import {Row, Col, Button, Table} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import { useSearchParams,useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import MemberItem from './MemberItem';

export default function MemberList() {
    const navi = useNavigate();
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const {moodleHome,API} = useContext(Context);
    const [totalPage, setTotalPage] = useState();
    const [courseid, setCourseid] = useState('');
    const [offset, setOffset] = useState(0);
    const [title, setTitle] = useState('');
    const [memberList, setMemberList] = useState([]);
    const [csv, setCsv] = useState('');
    const [isTeacher, setIsTeacher] = useState(false);
    const limit = 30;
    useEffect(() => {//take params from url
        if (!params.has('id') || params.get('id') === '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Không tìm thấy khóa học!',
            }).then((result) => {
                navi('/course-list');
            });
        }
        if (!params.has('page') || params.get('page') === '') {
            setPage(1);
            setCourseid(parseInt(params.get('id')))
            return; 
        }
        setCourseid(parseInt(params.get('id')))
        setPage(parseInt(params.get('page')));    
    }, [navi, params]);
    useEffect(() => {//get data from api
        if (courseid === '') return;
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            courseid: courseid,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getMemberList'
            },
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setMemberList(res.data.data);
                setTitle(res.data.courseName);
                setIsTeacher(res.data.isTeacher);
                setCsv(res.data.csv);
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                }).then((result) => {
                    navi('/course-list');
                });
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [API, courseid, navi]);
    useEffect(() => {//set offset
        if (memberList.length === 0) return;
        setOffset((page-1)*limit);
        setTotalPage(Math.ceil(memberList.length / limit));
    }, [page, memberList]);
    useEffect(() => {//paging
        if (totalPage <= 4){
            setPaginationItems(
                <>
                <Pagination.First onClick={() => {
                        setParams({page: 1,id: courseid});
                    }}/>
                <Pagination.Prev disabled={page === 1} onClick={() => {
                        setParams({page: page-1,id: courseid});
                    }}/>
                {Array.from({ length: totalPage }, (_, i) => (
                    <Pagination.Item key={i+1} active={i+1 === page}
                    onClick={() => {
                        setParams({page: i+1,id: courseid});
                    }}
                    >{i+1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page === totalPage} onClick={() => {
                        setParams({page: page+1,id: courseid});
                    }} />
                <Pagination.Last onClick={() => {
                        setParams({page: totalPage,id: courseid});
                    }}/>
                </>
            );
        }
        else{
            if (page <= 2){
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page: 1,id: courseid});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page: page-1,id: courseid});
                        }}/>

                    <Pagination.Item active={page===1} onClick={() => {
                            setParams({page: 1,id: courseid});
                        }}>1</Pagination.Item>
                    <Pagination.Item active={page===2} onClick={() => {
                            setParams({page: 2,id: courseid});
                        }}>2</Pagination.Item>
                    {page === 2 ? <Pagination.Item onClick={() => {
                            setParams({page: 3,id: courseid});
                        }}>3</Pagination.Item> : null}
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={() => {
                            setParams({page: totalPage,id: courseid});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page: page+1,id: courseid});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page: totalPage,id: courseid});
                        }}/>
                    </>
                );
            }
            else if (page >= totalPage - 1){
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page: 1,id: courseid});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page: page-1,id: courseid});
                        }}/>
                    <Pagination.Item onClick={() => {
                            setParams({page: 1,id: courseid});
                        }}>1</Pagination.Item>
                    <Pagination.Ellipsis />
                    {page === totalPage - 1 ? <Pagination.Item onClick={() => {
                            setParams({page: totalPage - 2,id: courseid});
                        }}>{totalPage - 2}</Pagination.Item> : null}
                    <Pagination.Item active={page===totalPage-1} onClick={() => {
                            setParams({page: totalPage - 1,id: courseid});
                        }}>{totalPage - 1}</Pagination.Item>
                    <Pagination.Item active={page===totalPage} onClick={() => {
                            setParams({page: totalPage,id: courseid});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page: page+1,id: courseid});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page: totalPage,id: courseid});
                        }}/>
                    </>
                );
            }
            else{
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page: 1,id: courseid});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page: page-1,id: courseid});
                        }}/>
                    <Pagination.Item onClick={() => {
                            setParams({page: 1,id: courseid});
                        }}>1</Pagination.Item>
                    {page !== 3 ? <Pagination.Ellipsis /> : null}
                    <Pagination.Item onClick={() => {
                            setParams({page: page-1,id: courseid});
                        }}>{page-1}</Pagination.Item>
                    <Pagination.Item active onClick={() => {
                            setParams({page: page,id: courseid});
                        }}>{page}</Pagination.Item>
                    <Pagination.Item onClick={() => {
                            setParams({page: page+1,id: courseid});
                        }}>{page+1}</Pagination.Item>
                    {page !== totalPage - 2 ? <Pagination.Ellipsis /> : null}
                    <Pagination.Item onClick={() => {
                            setParams({page: totalPage,id: courseid});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page: page+1,id: courseid});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page: totalPage,id: courseid});
                        }}/>
                    </>
                );
            }
                
        }
    }, [page, totalPage, setPage, setParams, courseid]);
    function handleCsv(){
        //delete the first row of csv
        const csvArr = csv.split('\n');
        csvArr.shift();
        //delete teacher info
        csvArr.shift();
        const newCsv = csvArr.join('\n');

        const file = new Blob([newCsv], {type: 'text/csv'});
        const url = URL.createObjectURL(file);
        window.open(url);
        URL.revokeObjectURL(url);
    }
    document.title = "Danh sách thành viên";
    return (
        <div className='member-list'>
            <div className="overlay" />
            <section className="section-cate">
                <div className="container">
                    <div className="boxed">
                        <div className="section-title text-center">
                            <h3>{title}</h3>
                        </div>                       
                        <Row style={{padding: '10px 0 0'}}>
                            <Col className="text-start" xs={12} lg={3}>
                                <p> Có {memberList.length} thành viên</p>
                            </Col>
                            <Col md={12} className="mx-auto">
                                
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th>Vai trò</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {memberList.slice(offset,offset+limit).map((item, i) => {
                                        return (
                                            <MemberItem key={i} {...item}/>
                                        )
                                    })}
                                </tbody>
                                </Table>                                  
                                   
                                <hr className="invis"></hr>
                                <Row>
                            <Col xs={12} lg={6} className="text-start">
                                <Button hidden={!isTeacher} onClick={handleCsv} variant="success">Xuất danh sách học viên</Button>
                            </Col>
                            <Col xs={12} lg={6} className="text-end">
                                <Button hidden={!isTeacher} onClick={()=>{window.open(moodleHome+"/local/userenrols/import.php?id="+courseid)}}>Upload danh sách học viên</Button>
                            </Col>
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