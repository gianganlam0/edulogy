import './UserList.scss';
import {Row, Col, Table, InputGroup, FormControl, FormLabel,Button} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useState, useEffect, useRef } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import Item from './Item';
import * as CK from '../Utils/Cookie';
export default function UserList() {
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [list, setList] = useState([]);
    const [totalUser, setTotalUser] = useState(0);
    const [keyword, setKeyword] = useState('');
    const keywordRef = useRef();
    const [csv, setCsv] = useState('');
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
        const url = '/edulogy/api/Controller/UserController.php';
        const data = {
            offset: (page - 1) * 30,
            keyword: keyword,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getUserList'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setList(res.data.data);
                setTotalPage(Math.ceil(res.data.total / 30));
                setTotalUser(res.data.total);
                setCsv(res.data.csv);
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
    }, [page,keyword]);
    function handleCsv(){
        let newCsv = csv;
        //rename header to Vietnamese
        newCsv = newCsv.replace(/id/, 'ID');
        newCsv = newCsv.replace(/fullname/, 'Họ và tên');
        newCsv = newCsv.replace(/phone2/, 'Số điện thoại');
        newCsv = newCsv.replace(/idnumber/, 'Số CMND/CCCD');
        newCsv = newCsv.replace(/email/, 'Email');
        newCsv = newCsv.replace(/sex/, 'Giới tính');
        newCsv = newCsv.replace(/birthday/, 'Ngày sinh');
        newCsv = newCsv.replace(/username/, 'Tên đăng nhập');
        newCsv = newCsv.replace(/role/, 'Vai trò');
        newCsv = newCsv.replace(/balance/, 'Số dư');
        //end
        const file = new Blob([newCsv], {type: 'text/csv'});
        const url = URL.createObjectURL(file);
        window.open(url);
        URL.revokeObjectURL(url);
    }
    document.title = "Danh sách thành viên";
    return (
        <div className='user-list'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        
                        <Row className="section-title text-center mb-3">
                            <h3>Danh sách thành viên</h3>
                        </Row>
                        <Row style={{padding: '10px 0 0'}}>
                            <Col xs={12} lg={{span:'6',offset:'3'}}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text><I.Search/></InputGroup.Text>
                                    <FormControl ref={keywordRef} placeholder="Nhập tên thành viên"/>
                                    <Button onClick={()=>{
                                        setKeyword(keywordRef.current.value);
                                        setParams({page: 1, keyword: keywordRef.current.value});
                                    }} variant="dark"><I.Search/></Button>
                                </InputGroup>
                            </Col>
                            <Col md={6} className="text-start">
                                <h4>Tổng số người dùng: {totalUser}</h4>
                            </Col>
                            <Col md={12} className="mx-auto">           
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên đầy đủ</th>
                                        <th>Tên người dùng</th>
                                        <th>Email</th>
                                        <th>Vai trò</th>
                                        <th>Số điện thoại</th>
                                        <th>CMND/CCCD</th>
                                        <th>Giới tính</th>
                                        <th>Ngày sinh</th>
                                        <th>Số dư</th>
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
                            <Col xs={12} lg={6} className="text-start">
                                <Button onClick={handleCsv} variant="success">Xuất danh sách thành viên</Button>
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