import { useNavigate } from 'react-router-dom';
import './CourseSquare.scss';
import * as Icon from 'react-bootstrap-icons';
export default function CourseSquare(props) {
    const navigate = useNavigate();
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
                        <div className="title" onClick={()=>{navigate('/course-detail')}}>
                            Modern JavaScript Linting With ESLint
                        </div>
                    </h4>
                    <p>
                        Fusce interdum, elit sit amet vehicula malesuada, eros libero
                        elementum orci.
                    </p>
                </div>
                {/* end details */}
                <div className="course-footer">
                    <div className="pull-left">
                        <div>
                            <Icon.PersonFill /> 21
                        </div>
                        <div>
                            <Icon.Clock /> 2h 30m
                        </div>
                        <div>
                            <Icon.MortarboardFill /> Nguyễn Văn A
                        </div>
                    </div>
                    {/* end left */}
                    <div className="pull-right">
                        <div>
                            <Icon.CashStack /> 200.000đ
                        </div>
                        <div style={{color:'gold'}}>
                            <Icon.StarFill /> 4.5
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}