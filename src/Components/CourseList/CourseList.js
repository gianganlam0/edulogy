import './CourseList.scss';
import CourseSquare from '../Utils/CourseSquare/CourseSquare';
import {Pagination} from 'react-bootstrap';
import {Row, Col, Button, Form, InputGroup, FloatingLabel, FormControl} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';

export default function CourseList() {
    const navi = useNavigate();
    const {isAdmin, isTeacher,API} = useContext(Context);
    const itemPerPageRef = useRef();
    const jumpPageRef = useRef();
    const keywordRef = useRef();
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState('');
    const [cateid, setCateid] = useState(0);//0: all
    const [teacherid, setTeacherid] = useState(0);//0: all
    const [mycourse, setMycourse] = useState(0);//0: all, 1: my course
    const [searchby, setSearchby] = useState('name');//name,cate,teacher
    const [sortby, setSortby] = useState('rate');//rate,price,num of student
    const [orderby, setOrderby] = useState('asc');//asc,desc
    const [totalPage, setTotalPage] = useState();
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [itemPerPage, setItemPerPage] = useState(10);
    const [centerTitle, setCenterTitle] = useState('Danh sách khóa học');
    const [courseList, setCourseList] = useState([]);
    const [totalResult, setTotalResult] = useState(0);
    const [filterTitle, setFilterTitle] = useState('');
    useEffect(() => {//take params from url
        setPage(parseInt(params.get('page')));
        setKeyword(params.get('keyword'));
        setCateid(parseInt(params.get('cateid')));
        setTeacherid(parseInt(params.get('teacherid')));
        setMycourse(parseInt(params.get('mycourse')));
        setSearchby(params.get('searchby'));
        setSortby(params.get('sortby'));
        setOrderby(params.get('orderby'));
        if (!params.has('page') || params.get('page') === '') {
            setPage(1);
        }
        if (!params.has('keyword') || params.get('keyword') === '') {
            setKeyword('');
        }
        if (!params.has('cateid') || params.get('cateid') === '') {
            setCateid(0);
        }
        if (!params.has('teacherid') || params.get('teacherid') === '') {
            setTeacherid(0);
        }
        if (!params.has('mycourse') || params.get('mycourse') === '') {
            setMycourse(0);
        }
        if (!params.has('searchby') || params.get('searchby') === '') {
            setSearchby('name');
        }
        if (!params.has('sortby') || params.get('sortby') === '') {
            setSortby('rate');
        }
        if (!params.has('orderby') || params.get('orderby') === '') {
            setOrderby('asc');
        }
        if (mycourse === 1) {
            setCenterTitle('Danh sách khóa học của tôi');
        }
        else {
            setCenterTitle('Danh sách khóa học');
        }
    }, [mycourse, params, setParams]);
    useEffect(() => {//get data from api
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            offset: (page - 1) * itemPerPage,
            itemPerPage: itemPerPage,
            keyword: keyword,
            cateid: cateid,
            teacherid: teacherid,
            mycourse: mycourse,
            searchby: searchby,
            sortby: sortby,
            orderby: orderby
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getCourseList'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setTotalResult(res.data.total);
                setTotalPage(Math.ceil(res.data.total / itemPerPage));
                setCourseList(res.data.data);
                if (teacherid !== 0) {
                    setFilterTitle('Lọc theo giáo viên: "' + res.data.data[0].teacherName + '"');
                }
                if (cateid !== 0) {
                    setFilterTitle('Lọc theo danh mục: "' + res.data.data[0].cateName + '"');
                }
                if (teacherid !== 0 && cateid !== 0) {
                    setFilterTitle('Lọc theo giáo viên: "' + res.data.data[0].teacherName + '" và lọc theo danh mục: "' + res.data.data[0].cateName + '"');
                }
                if (teacherid === 0 && cateid === 0) {
                    setFilterTitle('');
                }
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [page, itemPerPage, keyword, sortby, orderby, cateid, teacherid, mycourse, searchby, API]);
    useEffect(() => {//paging
        if (totalPage <= 4){
            setPaginationItems(
                <>
                <Pagination.First onClick={() => {
                        setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                    }}/>
                <Pagination.Prev disabled={page === 1} onClick={() => {
                        setParams({page:page-1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                    }}/>
                {Array.from({ length: totalPage }, (_, i) => (
                    <Pagination.Item key={i+1} active={i+1 === page}
                    onClick={() => {
                        setParams({page:i+1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                    }}
                    >{i+1}</Pagination.Item>
                ))}
                <Pagination.Next disabled={page === totalPage} onClick={() => {
                        setParams({page:page+1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                    }} />
                <Pagination.Last onClick={() => {
                        setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                    }}/>
                </>
            );
        }
        else{
            if (page <= 2){
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page:page-1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>

                    <Pagination.Item active={page===1} onClick={() => {
                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>1</Pagination.Item>
                    <Pagination.Item active={page===2} onClick={() => {
                            setParams({page:2,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>2</Pagination.Item>
                    {page === 2 ? <Pagination.Item onClick={() => {
                            setParams({page:3,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>3</Pagination.Item> : null}
                    <Pagination.Ellipsis />
                    <Pagination.Item onClick={() => {
                            setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page:page+1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    </>
                );
            }
            else if (page >= totalPage - 1){
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page:page-1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    <Pagination.Item onClick={() => {
                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>1</Pagination.Item>
                    <Pagination.Ellipsis />
                    {page === totalPage - 1 ? <Pagination.Item onClick={() => {
                            setParams({page:totalPage-2,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{totalPage - 2}</Pagination.Item> : null}
                    <Pagination.Item active={page===totalPage-1} onClick={() => {
                            setParams({page:totalPage-1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{totalPage - 1}</Pagination.Item>
                    <Pagination.Item active={page===totalPage} onClick={() => {
                            setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page:page+1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    </>
                );
            }
            else{
                setPaginationItems(
                    <>
                    <Pagination.First onClick={() => {
                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    <Pagination.Prev disabled={page === 1} onClick={() => {
                            setParams({page:page-1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    <Pagination.Item onClick={() => {
                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>1</Pagination.Item>
                    {page !== 3 ? <Pagination.Ellipsis /> : null}
                    <Pagination.Item onClick={() => {
                            setParams({page:page-1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{page-1}</Pagination.Item>
                    <Pagination.Item active onClick={() => {
                            setParams({page:page,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{page}</Pagination.Item>
                    <Pagination.Item onClick={() => {
                            setParams({page:page+1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{page+1}</Pagination.Item>
                    {page !== totalPage - 2 ? <Pagination.Ellipsis /> : null}
                    <Pagination.Item onClick={() => {
                            setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}>{totalPage}</Pagination.Item>
                    <Pagination.Next disabled={page === totalPage} onClick={() => {
                            setParams({page:page+1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }} />
                    <Pagination.Last onClick={() => {
                            setParams({page:totalPage,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                        }}/>
                    </>
                );
            }
                
        }
    }, [page, totalPage, setPage, setParams, keyword, sortby, orderby, itemPerPage, cateid, teacherid, mycourse, searchby]);
    document.title = "Khóa học";
    return (
        <div className='course-list'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">
                        
                        <Row>
                            <Col xs={12} lg={3}>
                                <div hidden={!isAdmin && !isTeacher} className="text-center">
                                <Button onClick={()=>{navi('/add-course')}} variant="warning"><I.PlusCircleFill/>Thêm khóa học</Button>
                                </div>                            
                            </Col>
                            <Col xs={12} lg={6}>
                                <InputGroup className="mb-3">
                                    <InputGroup.Text><I.Search/></InputGroup.Text>
                                    <FormControl ref={keywordRef} placeholder="Nhập từ khóa tìm kiếm"/>
                                    <Button onClick={()=>{
                                        setKeyword(keywordRef.current.value);
                                        setParams({page:1,keyword:keywordRef.current.value,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                                    }} variant="dark"><I.Search/></Button>
                                </InputGroup>
                            </Col>
                            <Col xs={12} lg={3} style={{justifyContent: 'center'}}>
                                <div hidden={!isAdmin && !isTeacher} className="text-center">
                                <Button onClick={()=>{navi('/course-pending')}} variant="success"><I.CheckCircleFill/>Danh sách chờ duyệt</Button>
                                </div>
                            </Col>
                        </Row>

                        <div className="section-title text-center">
                            <h3>{centerTitle}</h3>
                        </div>

                        <div className="cate-top">
                            <Row>
                                <Col className="left-text" xs={12} lg={3}>
                                    <p> Tìm thấy {totalResult} kết quả</p>
                                    <p style={{fontStyle:'italic',color:'#000',fontSize:'medium'}}>{filterTitle}</p>                                  
                                </Col>

                                <Col className="right-text" xs={12} lg={{span: 2, offset: 3}}>
                                    <FloatingLabel className="mb-3" label="Tìm kiếm theo">
                                        <Form.Select value={searchby} onChange={(e)=>{
                                            setSearchby(e.target.value);
                                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:e.target.value,sortby:sortby,orderby:orderby});}}>
                                            <option value="name">Theo tên</option>
                                            <option value="cate">Theo danh mục</option>
                                            <option value="teacher">Theo giáo viên</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col className="right-text" xs={12} lg={2}>
                                    <FloatingLabel className="mb-3" label="Sắp xếp theo">
                                        <Form.Select value={sortby} onChange={(e)=>{
                                            setSortby(e.target.value);
                                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:e.target.value,orderby:orderby});
                                            }}>
                                            <option value="rate">Số sao</option>
                                            <option value="cost">Giá tiền</option>
                                            <option value="student">Số học viên</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                                <Col className="right-text" xs={12} lg={2}>
                                    <FloatingLabel className="mb-3" label="Thứ tự">
                                        <Form.Select value={orderby} onChange={(e)=>{
                                            setOrderby(e.target.value);
                                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:e.target.value});
                                            }}>
                                            <option value="asc">Tăng dần</option>
                                            <option value="desc">Giảm dần</option>
                                        </Form.Select>
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        </div>

                        <Row>             
                            {courseList.map((item, index) => {
                                return (
                                    <Col lg={4} md={6} key={item.id} style={{margin: '10px 0'}}>
                                        <CourseSquare {...item}/>
                                    </Col>
                                )
                            })}

                        </Row>

                        <hr className="invis"></hr>
                        <Row>
                            <Col xs={12} lg={{span: 10, offset: 1}} style={{float: 'auto'}}>
                                <Pagination>{paginationItems}</Pagination>
                            </Col>
                        </Row>
                        <Row className="d-inline">
                            <Col xs={12} lg={4} className="float-start">
                            Số kết quả hiển thị trên một trang:
                                <InputGroup>
                                    <Form.Control defaultValue={10} ref = {itemPerPageRef}/>
                                    <Button onClick={()=>{
                                        var value = itemPerPageRef.current.value;
                                        if(value > 0){
                                            setItemPerPage(value);
                                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                                        }
                                        else{
                                            itemPerPageRef.current.value = 10;
                                            setItemPerPage(10);
                                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                                        }
                                    }}>Hiển thị</Button>
                                </InputGroup>
                            </Col>

                            <Col xs={12} lg={4} className="float-end">
                            Chuyển đến trang:
                                <InputGroup>
                                    <Form.Control defaultValue={1} ref={jumpPageRef}/>
                                    <Button onClick={()=>{
                                        var value = jumpPageRef.current.value;
                                        if(value > 0 && value <= totalPage){
                                            setParams({page:value,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                                        }
                                        else{
                                            jumpPageRef.current.value = 1;
                                            setParams({page:1,keyword:keyword,cateid:cateid,teacherid:teacherid,mycourse:mycourse,searchby:searchby,sortby:sortby,orderby:orderby});
                                        }
                                    }}>Chuyển</Button>
                                </InputGroup>
                            </Col>
                        </Row>
                        
                    </div>
                    
                </div>
            </section>
        </div>
    );
}