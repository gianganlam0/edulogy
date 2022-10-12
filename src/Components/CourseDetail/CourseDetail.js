import { useState } from 'react';
import './CourseDetail.scss';
import COURSE_IMAGE from '../../images/course1.jpg';
import * as Icon from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap';
import Comment from '../Utils/Comment/Comment';
export default function CourseDetail() {

    return (
        <div className='course-detail'>
            <div className="overlay" />

            <section className="section-detail">
                <div className="container">
                    <div className="row">
                        <div class="col-md-6">
                            <div class="course-image">
                                <img src={COURSE_IMAGE} alt=""/>
                            </div>
                        </div>

                        <div class="col-md-6">
                            <div class="course-desc">
                                <h3>Khóa học Java</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis consequat condimentum. In a tincidunt purus. Curabitur facilisis luctus aliquet. Aenean a cursus erat, sit amet interdum arcu. Mauris aliquam magna turpis,
                                    lobortis pellentesque velit elementum et. Nulla scelerisque a lorem nec posuere. Nunc convallis posuere tincidunt. Pellentesque a aliquet odio. Integer euismod, enim id lacinia auctor, tortor turpis malesuada enim, in semper
                                    turpis magna quis enim.
                                </p>
                                <div className="course-footer">
                                    <div className="pull-left">
                                        <div>
                                            Số học viên <Icon.PersonFill /> 21
                                        </div>  
                                        <div>
                                            Thời gian <Icon.ClockFill /> 2h 30m
                                        </div>
                                    </div>
                                    {/* end left */}
                                    <div className="pull-right">
                                        <div>
                                            Giá tiền <Icon.CashStack /> 200.000đ
                                        </div>
                                        <div>
                                            Đánh giá <Icon.StarFill /> 4.5/5
                                        </div>
                                    </div>
                                </div>
                                <div class="course-meta">
                                    <Button>Thêm vào giỏ hàng</Button>
                                    <div className="cate">
                                        Thể loại: <a href="aaa">Java</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
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
                                
                                <div class="col-md-4">
                                    <input type="text" class="form-control" name="name" placeholder="Số sao từ 0 đến 5"/>
                                </div>
                                <hr />
                                <div class="col-md-12">
                                    <textarea placeholder="Bình luận" class="form-control"></textarea>
                                </div>
                                <hr />
                                <Button>Gửi</Button>
                                

                            </div>

                        </div>
                    </div>
                    
                </div>
            </section>
        </div>
    );
}