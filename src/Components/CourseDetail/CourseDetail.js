import './CourseDetail.scss';
import COURSE_IMAGE from '../../images/course1.jpg';
import * as Icon from 'react-bootstrap-icons';
import {Row, Col, Button, Table} from 'react-bootstrap';
import Comment from '../Utils/Comment/Comment';
export default function CourseDetail() {
    document.title = "Chi tiết khóa học";
    return (
        <div className='course-detail'>
            <div className="overlay" />

            <section className="section-detail">
                <div className="container">
                    <Row>
                        <Col md={6}>
                            <div class="course-image">
                                <img src={COURSE_IMAGE} alt=""/>
                            </div>
                        </Col>

                        <Col md={6}>
                            <div class="course-desc">
                                <h3>Lớp Java tháng 1/2022</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis consequat condimentum. In a tincidunt purus. Curabitur facilisis luctus aliquet. Aenean a cursus erat, sit amet interdum arcu. Mauris aliquam magna turpis,
                                    lobortis pellentesque velit elementum et. Nulla scelerisque a lorem nec posuere. Nunc convallis posuere tincidunt. Pellentesque a aliquet odio. Integer euismod, enim id lacinia auctor, tortor turpis malesuada enim, in semper
                                    turpis magna quis enim.
                                </p>
                                <Table responsive size="sm" bordered>
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Giáo viên: <Icon.MortarboardFill /></td>
                                        <td>Nguyễn Văn A</td>
                                    </tr>
                                    <tr>
                                        <td>Số học viên: <Icon.PersonFill /></td>
                                        <td>21</td>
                                    </tr>
                                    <tr>
                                        <td>Thời gian học: <Icon.ClockFill /></td>
                                        <td>T2: 14h30 - 17h30<br/>
                                            T3: 14h30 - 17h30<br/>
                                            T4: 14h30 - 17h30<br/></td>
                                    </tr>
                                    <tr>
                                        <td>Thời gian bắt đầu: <Icon.Calendar /></td>
                                        <td>14/01/2023</td>
                                    </tr>
                                    <tr>
                                        <td>Thời gian kết thúc: <Icon.CalendarFill /></td>
                                        <td>14/01/2024</td>
                                    </tr>
                                    <tr>
                                        <td>Đánh giá: <Icon.StarFill /></td>
                                        <td>4.5/5</td>
                                    </tr>
                                    <tr>
                                        <td>Mã khóa học: <Icon.Code /></td>
                                        <td>JAVA-NVA</td>
                                    </tr>
                                    <tr>
                                        <td>Giá tiền: <Icon.CashStack /></td>
                                        <td>1.000.000đ</td>
                                    </tr>
                                </tbody>
                                </Table>    
                                <div class="course-meta">
                                    <Button>Thêm vào giỏ hàng</Button>
                                    <div className="cate">
                                        Thể loại: <a href="aaa">Java</a>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div class="comment-box">
                                <h3 class="small-title">3 bình luận</h3>
                                <div class="comment-list">
                                    <Comment src="https://www.w3schools.com/howto/img_avatar.png" />
                                    <Comment src="https://www.w3schools.com/howto/img_avatar.png" />
                                    <Comment src="https://www.w3schools.com/howto/img_avatar.png" />

                                </div>
                            </div>

                            <div class="comment-box">
                                <h3 class="small-title">Để lại đánh giá</h3>
                                
                                <Col md={4}>
                                    <input type="text" class="form-control" name="name" placeholder="Số sao từ 0 đến 5"/>
                                </Col>
                                <hr />
                                <Col md={12}>
                                    <textarea placeholder="Bình luận" class="form-control"></textarea>
                                </Col>
                                <hr />
                                <Button>Gửi</Button>
                                

                            </div>

                        </Col>
                    </Row>
                    
                </div>
            </section>
        </div>
    );
}