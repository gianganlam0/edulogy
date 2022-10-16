import { CarouselItem } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CateSquare.scss';
import * as Icon from 'react-bootstrap-icons';
export default function CateSquare(props) {
    const navigate = useNavigate();
    return (
        <div className="cate-square">
            <div className="cate-box">
                <div className="image-wrap entry">
                    <img src={props.src} alt="" className="img-responsive" />
                    <div className="magnifier">
                        <a href="a" title="">
                            <i className="flaticon-add" />
                        </a>
                    </div>
                </div>
                {/* end image-wrap */}
                <div className="cate-details">
                    <h4>
                        <div className="title" onClick={()=>{navigate('/course-list')}}>
                            Lập trình Java
                        </div>
                    </h4>
                    <p>
                        Mô tả Fusce interdum, elit sit amet vehicula malesuada, eros libero
                        elementum orci.
                    </p>
                </div>
                {/* end details */}
                <div className="cate-footer">
                    <div className="pull-left">
                        <div>
                        Số khóa học: <Icon.Server /> 21
                        </div>
                    </div>
                    {/* end left */}
                    <div className="pull-right">
                        {/* <div>
                            <Icon.CashStack /> 200.000đ
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    )
}