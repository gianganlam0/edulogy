import './CourseSquare.scss';
import * as Icon from 'react-bootstrap-icons';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';
import {Row, Col, Container} from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { Context } from '../ContextProvider';
import { useContext } from 'react';
export default function CourseSquare({id,courseId,fullname,shortname,cateId,cateName,schedule,
    startdate,enddate,image,desc,studentCount,cost,teacherId,teacherName,rate}) {
    const {timestamp2Date} = useContext(Context);
    const navi = useNavigate();

    studentCount = studentCount - 1; // minus 1 because the teacher also count
    startdate = timestamp2Date(startdate, true);
    if (enddate === '0') enddate = "Không giới hạn";
    else enddate = timestamp2Date(enddate, true);
    // [{"day":"3","start":"00:00","end":"00:30"},{"day":"3","start":"00:00","end":"00:30"}]
    schedule = JSON.parse(schedule);
    let scheduleStr = '';
    let scheDay = {
    }
    schedule.forEach((item, index) => {
        scheDay[item.day] = true;
    });
    for (let i = 1; i < 8; i++) {
        if (scheDay[i]) {
            if (i === 1)
                scheduleStr += 'Chủ nhật, ';
            else
                scheduleStr += 'Thứ ' + i + ', ';
        }
    }
    scheduleStr = scheduleStr.slice(0, scheduleStr.length - 2);// remove last ', '
    schedule = scheduleStr;
    //check if all 1 to 7 in scheDay
    let allDay = true;
    for (let i = 1; i < 8; i++) {
        if (!scheDay[i]) {
            allDay = false;
            break;
        }
    }
    if (allDay) schedule = 'Cả tuần';


    if (desc.length > 100) {
        desc = desc.slice(0, 100) + '...';
    }
    if (desc.length === 0) {
        desc = 'Không có mô tả';
    }
    if (cost === '0') {
        cost = 'Miễn phí';
    }
    else {
        cost = cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        cost += ' VNĐ';
    }
    if (rate === null){
        rate = "Chưa có đánh giá";
    }
    else{
        rate = Math.round(rate*100)/100;
        rate+='/5';
    }
    return (
        <div className="course-square">
            <Container className="course-box">
                <Row className="image-wrap">
                    <img src={image} alt={fullname} />
                </Row>
                {/* end image-wrap */}
                <Row className="course-details">
                    <div className="course-fullname" onClick={()=>navi('/course-detail/'+courseId)}>
                        <h4 className="title">
                            {fullname}
                        </h4>
                    </div>
                    <div className="course-shortname">
                        <h6 className="title">
                            {shortname}
                        </h6>
                    </div>
                    Mô tả: 
                    <Interweave className="course-desc" content={desc}
                        matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}
                        newWindow
                    />
                </Row>
                {/* end details */}
                <Row className="course-footer">
                <Col md={12} lg={12}>
                <p style={{fontSize:'20px'}}>Danh mục: <Icon.Book color='#88B04B'/><b>{
                    <Link to={'/course-list?cateid='+cateId}>{cateName}</Link>}</b></p>
                <p>Giáo viên: <Icon.MortarboardFill color='#34568B'/>{
                    <Link to={'/course-list?teacherid='+teacherId}>{teacherName}</Link>
                }</p>
                <p>Lịch học: <Icon.ClockFill color='#00A170'/>{schedule}</p>
                <p>Ngày bắt đầu: <Icon.Calendar />{startdate}</p>
                <p>Ngày kết thúc: <Icon.CalendarFill />{enddate}</p>
                <p>Số học viên đăng ký: <Icon.Server color='#01bacf'/>{studentCount}</p>                                    
                <p>Giá: <Icon.CashStack color='#F5DF4D'/>{cost}</p>                
                <p>Đánh giá: <Icon.StarFill color='#FFA500'/>{rate}</p>
                </Col>
                </Row>
            </Container>
        </div>
    )
}