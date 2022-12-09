import './Comment.scss';
import {Row, Col, Button} from 'react-bootstrap';
import * as Icon from 'react-bootstrap-icons';
import {Link} from 'react-router-dom';
import {useContext} from 'react';
import { Context } from '../ContextProvider';
export default function Comment({userid,comment,point,time,fullname,image,isThisCourse,onDelete}) {
    const {isAdmin} = useContext(Context);
    function time2text(times){
        //get current timestamp in second with gmt +7
        let now = new Date();
        let current = now.getTime() + now.getTimezoneOffset()*60*1000 + 7*60*60*1000;
        let diff = current/1000 - times;
        if (diff < 60) return 'Vừa xong';
        if (diff < 60*60) return Math.floor(diff/60)+' phút trước';
        if (diff < 60*60*24) return Math.floor(diff/60/60)+' giờ trước';
        if (diff < 60*60*24*30) return Math.floor(diff/60/60/24)+' ngày trước';
        if (diff < 60*60*24*30*12) return Math.floor(diff/60/60/24/30)+' tháng trước';
        return Math.floor(diff/60/60/24/30/12)+' năm trước';
    }
    if (comment.length > 100) comment = comment.substring(0,100)+'...';
    let oldComment = comment;
    if (comment === '') comment = 'Không có nội dung';
    return (
        <Row className="comment-item-box">
            <Col sm={12} md={2} className="user-avatar text-center">
                <img src={image} alt
                ={fullname}/>
            </Col>
            <Col sm={12} md={8} className="user-comment">
                <h4 className="user-name"><Link to={'/edit-profile/'+userid}>{fullname}</Link></h4>
                <p hidden={isThisCourse} style={{fontStyle:'italic',fontSize:"15px",color:'red'}}>Người dùng này đến từ một khóa học khác cùng giáo viên và thể loại</p>
                <p style={oldComment===''?{fontStyle:'italic'}:{}}>{comment}</p>
            </Col>
            <Col sm={12} md={2} className="user-time text-center">
                <p className="time"><small>{time2text(time)}</small></p>
                <div className="rating-star">
                Đánh giá: {point}/5 <Icon.StarFill/>
                </div>
                <Button hidden={oldComment==='' || !isAdmin} onClick={onDelete} variant="danger">Xóa nội dung</Button>
            </Col>
        </Row>
    )
}