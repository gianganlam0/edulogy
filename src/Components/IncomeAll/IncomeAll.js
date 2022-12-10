import './IncomeAll.scss';
import {Row, Col, Table, InputGroup, FormControl, FormLabel,Button} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useState, useEffect, useContext } from 'react';
import { useNavigate,useSearchParams } from 'react-router-dom';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import Item from './Item';
import * as CK from '../Utils/Cookie';
export default function IncomeAll() {
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
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
    const [list, setList] = useState([]);
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
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            offset: (page - 1) * 30,
            firstDay: firstDay,
            lastDay: lastDay,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getIncomeAll'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setList(res.data.data);
                setTotalPage(Math.ceil(res.data.total / 30));
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
    }, [page,firstDay, lastDay]);
    function handleCsv(){
        let newCsv = csv;
        //rename header to Vietnamese
        newCsv = newCsv.replace(/teacherid/, 'ID');
        newCsv = newCsv.replace(/fullname/, 'Tên');
        newCsv = newCsv.replace(/totalamount/, 'Tổng thu nhập');
        newCsv = newCsv.replace(/num_of_course/, 'Tổng số khóa học');
        //end
        const file = new Blob([newCsv], {type: 'text/csv'});
        const url = URL.createObjectURL(file);
        window.open(url);
        URL.revokeObjectURL(url);
    }
    document.title = "Tổng thu nhập của giáo viên";
    return (
        <div className='income-all'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        
                        <Row className="section-title text-center mb-3">
                            <h3>Tổng thu nhập của giáo viên</h3>
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
                                        <th>Tên giáo viên</th>
                                        <th>Tổng số khóa học</th>
                                        <th>Tổng thu nhập</th>
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
                                <Button onClick={handleCsv} variant="success">Xuất danh sách thu nhập</Button>
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