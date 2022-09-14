import { CarouselItem } from 'react-bootstrap';
import './CourseSquare.scss';
import * as Icon from 'react-bootstrap-icons';
export default function CourseSquare(props) {
    return (
        <div className="course-square">
            <div className="course-box">
                <div className="image-wrap entry">
                    <img src={props.src} alt="" className="img-responsive" />
                    <div className="magnifier">
                        <a href="a" title="">
                            <i className="flaticon-add" />
                        </a>
                    </div>
                </div>
                {/* end image-wrap */}
                <div className="course-details">
                    <h4>
                        <small>Javascript</small>
                        <a href="#a" title="">
                            Modern JavaScript Linting With ESLint
                        </a>
                    </h4>
                    <p>
                        Fusce interdum, elit sit amet vehicula malesuada, eros libero
                        elementum orci.
                    </p>
                </div>
                {/* end details */}
                <div className="course-footer clearfix">
                    <div className="pull-left">
                        <ul className="list-inline">
                            <li>
                                <a href="a">
                                    <i className="fa fa-user" /> 21
                                </a>
                            </li>
                            <li>
                                <a href="a">
                                    <i className="fa fa-clock-o" /> 15 Min.
                                </a>
                            </li>
                        </ul>
                    </div>
                    {/* end left */}
                    <div className="pull-right">
                        <ul className="list-inline">
                            <li>
                                <a href="a">$22.00</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}