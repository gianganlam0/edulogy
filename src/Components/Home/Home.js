import './Home.scss'
import { Button, } from 'react-bootstrap';
import CourseSquare from '../Utils/CourseSquare/CourseSquare';
import COURSE_IMAGE from '../../images/course1.jpg';
import * as Icon from 'react-bootstrap-icons';
import Carousel from "react-multi-carousel";
import {useNavigate} from "react-router-dom";
import { useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
export default function Home() {
    const context = useContext(Context);
    
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
    const navigate = useNavigate();
    return <>
        <div id="home">
            <section className="main-bg">
                <div className="overlay" />
                <div className="home-text-wrapper relative container">
                    <div className="home-message">
                        <p>Hệ thống quản lý khóa học</p>
                        <small>
                            Edulogy is the ideal choice for your organization, your business and
                            your online education system. Create your online course now with
                            unlimited page templates, color options, and menu features.
                        </small>
                        <div className="btn-wrapper">
                            <Button hidden={context.isLogin} onClick={()=>{navigate('/login')}}>Đăng nhập</Button>     
                            <Button variant="success" size="lg" hidden={!context.isLogin} onClick={()=>{window.location.href="http://localhost/sura"}}>Truy cập trang moodle</Button>
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
                            Maecenas sit amet tristique turpis. Quisque porttitor eros quis leo
                            pulvinar, at hendrerit sapien iaculis. Donec consectetur accumsan arcu,
                            sit amet fringilla ex ultricies.
                        </p>
                    </div>

                    <Carousel responsive={responsive} infinite autoPlay
                        autoPlaySpeed={2000} itemClass='outer-slider'>
                        <CourseSquare src={COURSE_IMAGE} />
                        <CourseSquare src={COURSE_IMAGE} />
                        <CourseSquare src={COURSE_IMAGE} />
                        <CourseSquare src={COURSE_IMAGE} />
                        <CourseSquare src={COURSE_IMAGE} />
                        <CourseSquare src={COURSE_IMAGE} />
                    </Carousel>

                    <hr/>

                    <div className="section-button text-center">
                        <Button variant="success" onClick={()=>{navigate('/course-list')}}>Xem thêm</Button>
                    </div>
                </div>
            </section>

        </div>
    </>
}