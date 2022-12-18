import './Cart.scss';
import {Row, Col, Button, Table} from 'react-bootstrap';
import {Pagination} from 'react-bootstrap';
import { useSearchParams} from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import CartItem from './CartItem';

export default function Cart() {
    const [paginationItems, setPaginationItems] = useState();
    const [params, setParams] = useSearchParams();
    const [page, setPage] = useState(1);
    const {cart,setCart,API} = useContext(Context);
    const [totalPage, setTotalPage] = useState();
    const [offset, setOffset] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [render, setRender] = useState(false);
    useEffect(() => {//take params from url
        setPage(parseInt(params.get('page')));
        if (!params.has('page') || params.get('page') === '') {
            setPage(1);  
    }}, [params, setParams]);

    useEffect(() => {//get data from cart
        setOffset((page-1)*10);
        setTotalPage(Math.ceil(cart.length / 10));
        let temp = cart.reduce((a, b) => a + parseInt(b.cost), 0);
        temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + ' VND';
        setTotalCost(temp);
        // setPendingList(res.data.data);
    }, [page, cart,render]);
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

    function handleBuy(){
        //first are you sure?
        Swal.fire({
            title: 'Bạn có chắc chắn muốn mua hàng?',
            showDenyButton: true,
            confirmButtonText: `Đồng ý`,
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                const url = `${API}/Controller/CourseController.php`;
                const data = {
                    cart: cart,
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {data: JSON.stringify(data),
                            action: 'buyCourses'},
                }).done(function(res){
                    try {
                        res = JSON.parse(res);
                    } catch (error) {}
                    if (res.status === 0){
                        Swal.fire('', res.message, 'success');
                        setCart([]);
                        localStorage.cart='[]';
                        setRender(!render);
                    }
                    else{
                        Swal.fire('', res.message, 'error');
                    }
                }).fail(function(err){
                    Swal.fire('Thất bại', 'Lỗi mạng', 'error');
                });
            } else if (result.isDenied) {
                Swal.fire('Đã hủy', '', 'info')
            }
        }
        );
    }

    function handleDelete(i){
        let newCart = cart;
        newCart.splice(i, 1);
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
        setRender(!render);
    }

    document.title = "Giỏ hàng";
    return (
        <div className='cart'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>Giỏ hàng của tôi</h3>
                        </div>
                        
                        <Row style={{padding: '10px 0 0'}}>
                            <Col className="text-start" xs={12} lg={3}>
                                <p> Có {cart.length} sản phẩm trong giỏ hàng</p>
                            </Col>
                            <Col md={12} className="mx-auto">
                                
                                <Table responsive style={{textAlign: 'center'}} size="sm" striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Tên khóa học</th>
                                        <th>Tên rút gọn</th>
                                        <th>Giáo viên</th>
                                        <th><div style={{minWidth: '300px'}}>Hình ảnh</div></th>
                                        <th>Giá</th>
                                        <th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cart.slice(offset,offset+10).map((item, i) => {
                                        return (
                                            <CartItem key={i} {...item} onDelete={()=>handleDelete(i)}/>
                                        )
                                    })}
                                </tbody>
                                </Table>                                  
                                   
                                <hr className="invis"></hr>
                                <Row>
                            <Col xs={6} lg={6} className="text-start">
                                <h2>Tổng tiền: {totalCost}</h2>
                            </Col>
                            <Col xs={6} lg={6} className="text-end">
                                <Button hidden={cart.length === 0} onClick={handleBuy} variant="success">Thanh toán</Button>
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