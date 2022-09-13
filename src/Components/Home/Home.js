import $ from 'jquery';
import './Home.scss'
import {Button} from 'react-bootstrap';
export default function Home() {
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
                            <div className="text-center">
                                <Button wow slideInUp>Đăng nhập</Button>
                            </div>
                        </div>
                        {/* end row */}
                    </div>
                </div>
                <div className="slider-bottom">
                    <span>
                        Khám phá <i className="fa fa-angle-down" />
                    </span>
                </div>
            </section>
        </div>
    </>
}