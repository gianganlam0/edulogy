import './CateList.scss';
import CateSquare from '../Utils/CateSquare/CateSquare';
import COURSE_IMAGE from '../../images/course1.jpg';
import {DropdownButton, Dropdown, Pagination} from 'react-bootstrap';

function ColCateSquare(props) {
    return (
        <div className="col-md-4" style={{margin: '20px 0'}}>
            <CateSquare src={props.src} />
        </div>
    );
}

export default function CateList() {
    document.title = "Danh mục";
    return (
        <div className='cate-list'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">
                        <div className="section-title text-center">
                            <h3>Danh sách thể loại</h3>
                        </div>

                        <div className="cate-top">
                            <div className="left-text">
                                <p> Tìm thấy 25 kết quả</p>
                            </div>
                            <div className="right-text">
                                <DropdownButton variant="dark" title="Lọc theo">
                                    <Dropdown.Item>Theo tên</Dropdown.Item>
                                    <Dropdown.Item active>Theo số lượng khóa học</Dropdown.Item>
                                </DropdownButton>

                                <DropdownButton variant="dark" title="Thứ tự">
                                    <Dropdown.Item active>Tăng dần</Dropdown.Item>
                                    <Dropdown.Item>Giảm dần</Dropdown.Item>
                                </DropdownButton>
                            </div>
                        </div>

                        {/* show cate list grid */}
                        <div className="row cate-grid">
                            <ColCateSquare src={COURSE_IMAGE} />
                            <ColCateSquare src={COURSE_IMAGE} />
                            <ColCateSquare src={COURSE_IMAGE} />
                            <ColCateSquare src={COURSE_IMAGE} />
                            <ColCateSquare src={COURSE_IMAGE} />
                            <ColCateSquare src={COURSE_IMAGE} />
                            <ColCateSquare src={COURSE_IMAGE} />
                        </div>

                        <hr className="invis"></hr>

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