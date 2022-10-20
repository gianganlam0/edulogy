import './Cart.scss';
import {Button, Pagination} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';

function Item(props) {
    const courseStyle={
        float:'left',
        color: 'black',

    }
    const costStyle={
        float:'right',
        color: 'black',
        display: 'inline-flex',
        //center   
        justifyContent: 'center',
        alignItems: 'center',


    }
    return (
        <>
        <div class="col-md-12" style={{display: 'inline-block'}}>
            <div className='course-name' style={courseStyle}>
                Lập trình web cơ bản
            </div>
            <div className='course-right' style={costStyle}>
                <div>200.000đ</div>
                <Button size='sm' variant="danger" style={{margin:'0 5px'}}><Icon.Trash/></Button>
            </div>
        </div>
        <hr style={{color:'black'}}></hr>
        </>
        
        
    );
}

export default function Cart() {
    document.title = "Giỏ hàng";
    return (
        <div className='cart'>
            <div className="overlay" />

            <section className="section-cart">
                <div className="container">
                    <div class="boxed">
                        <div className="section-title text-center">
                            <h3>Giỏ hàng của bạn</h3>
                        </div>

                        <div class="cart-top">
                            <div class="left-text">
                                <p> Tổng số 10 sản phẩm</p>
                            </div>
                            
                        </div>
                        <hr style={{color:'black'}}></hr>
                        {/* show cart list grid */}
                        <div class="cart-grid">
                            <Item/>
                            <Item/>
                            <Item/>
                            <Item/>
                        </div>

                        
                        <div class="cart-total">
                            <div class="left-cost">
                                Tổng tiền: 200.000đ
                            </div>
                            <div class="right-btn">
                                <Button variant="success">Thanh toán</Button>
                            </div>
                        </div>
                        <Pagination variant="primary">
                            <Pagination.First />
                            <Pagination.Prev />
                            <Pagination.Item active>{1}</Pagination.Item>
                            <Pagination.Item>{2}</Pagination.Item>
                            <Pagination.Item>{3}</Pagination.Item>
                            <Pagination.Ellipsis />
                            <Pagination.Item>{20}</Pagination.Item>
                            <Pagination.Next />
                            <Pagination.Last />
                        </Pagination>
                    </div>
                    
                </div>
            </section>
        </div>
    );
}