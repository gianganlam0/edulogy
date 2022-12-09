import './Home.scss'
import { Button, } from 'react-bootstrap';
import CourseSquare from '../Utils/CourseSquare/CourseSquare';
import * as Icon from 'react-bootstrap-icons';
import Carousel from "react-multi-carousel";
import {useNavigate} from "react-router-dom";
import { useContext,useEffect,useState } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
export default function Home() {
    const context = useContext(Context);
    const [courseList, setCourseList] = useState([]);
    document.title = "Trang chủ";
    const responsive = { //for carousel
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
        }
    };
    useEffect(() => {//get data from api
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            offset: 0,
            itemPerPage: 10,
            keyword: '',
            cateid: 0,
            teacherid: 0,
            mycourse: 0,
            searchby: 'name',
            sortby: 'rate',
            orderby: 'desc'
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
                setCourseList(res.data.data);
            }
        }).fail(function(err){
            console.log(err);
        });
    }, []);
    const navigate = useNavigate();
    return <>
        <div id="home">
            <section className="main-bg">
                <div className="overlay" />
                <div className="home-text-wrapper relative container">
                    <div className="home-message">
                        <p>Hệ thống quản lý khóa học</p>
                        <small>
                        Edulogy là một hệ thống giáo dục trực tuyến lý tưởng dành cho bạn.
                        Tham gia khóa học trực tuyến của chúng tôi ngay bây giờ !.
                        </small>
                        <div className="btn-wrapper">
                            <div><Button hidden={context.isLogin} onClick={()=>{navigate('/login')}}>Đăng nhập</Button></div>
                            <Button variant="warning" hidden={context.isLogin} onClick={()=>{navigate('/register')}}>Đăng ký tài khoản</Button>    
                            <Button variant="success" size="lg" hidden={!context.isLogin} onClick={()=>{window.open(context.moodleHome)}}>Truy cập trang moodle</Button>
                        </div>
                    </div>
                </div>
                <div className="slider-bottom">
                    Khám phá
                    <div><Icon.ChevronDoubleDown /></div>
                </div>
            </section>

            {/* section thứ 2 */}
            <section className="section-2">
                <div className="container">
                    <div className="section-title text-center">
                        <h3>Khóa học nổi bậc</h3>
                        <p>
                            Dưới đây là danh sách 10 khóa học được đánh giá cao nhất:
                        </p>
                    </div>

                    <Carousel responsive={responsive} infinite autoPlay
                        autoPlaySpeed={2000} itemClass='outer-slider'>
                            {courseList.map((item, index) => {
                                return (
                                    <CourseSquare key={item.id} {...item}/>
                                )
                            })}
                    </Carousel>

                    <hr/>

                    <div className="section-button text-center">
                        <Button variant="success" onClick={()=>{navigate('/course-list?orderby=desc')}}>Xem thêm</Button>
                    </div>
                </div>
            </section>

        </div>
    </>
}