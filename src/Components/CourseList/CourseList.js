import { useState } from 'react';
import './CourseList.scss';
import CourseSquare from '../Utils/CourseSquare/CourseSquare';
import COURSE_IMAGE from '../../images/course1.jpg';
import {DropdownButton, Dropdown, Pagination} from 'react-bootstrap';

function ColCourseSquare(props) {
    return (
        <div class="col-md-4" style={{margin: '20px 0'}}>
            <CourseSquare src={props.src} />
        </div>
    );
}

export default function CourseList() {

    return (
        <div className='course-list'>
            <div className="overlay" />

            <section className="section-course">
                <div className="container">
                    <div class="boxed">
                        <div className="section-title text-center">
                            <h3>Danh sách khóa học</h3>
                        </div>

                        <div class="course-top">
                            <div class="left-text">
                                <p> Tìm thấy 25 kết quả</p>
                            </div>
                            <div class="right-text">
                                <DropdownButton variant="dark" title="Lọc theo">
                                    <Dropdown.Item>Theo tên</Dropdown.Item>
                                    <Dropdown.Item active>Theo số sao</Dropdown.Item>
                                    <Dropdown.Item>Theo giá tiền</Dropdown.Item>
                                </DropdownButton>

                                <DropdownButton variant="dark" title="Thứ tự">
                                    <Dropdown.Item active>Tăng dần</Dropdown.Item>
                                    <Dropdown.Item>Giảm dần</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>

                        {/* show course list grid */}
                        <div class="row course-grid">
                            <ColCourseSquare src={COURSE_IMAGE} />
                            <ColCourseSquare src={COURSE_IMAGE} />
                            <ColCourseSquare src={COURSE_IMAGE} />
                            <ColCourseSquare src={COURSE_IMAGE} />
                            <ColCourseSquare src={COURSE_IMAGE} />
                            <ColCourseSquare src={COURSE_IMAGE} />
                        </div>

                        <hr class="invis"></hr>

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