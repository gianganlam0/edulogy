import './CourseDetail.scss';
import * as Icon from 'react-bootstrap-icons';
import {Row, Col, Button, Table} from 'react-bootstrap';
import Comment from '../Utils/Comment/Comment';
import TimeTable from '../Utils/TimeTable/TimeTable';
import { useState,useEffect,useContext,useLayoutEffect } from 'react';
import { useParams,Link,useNavigate } from 'react-router-dom';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';
// fullname,shortname,cateId,cateName,schedule,
//     startdate,enddate,image,desc,studentCount,cost,teacherId,teacherName,rate

export default function CourseDetail() {
    const params = useParams();
    const navi = useNavigate();
    const {timestamp2Date,isLogin,moodleHome,cart,setCart} = useContext(Context);
    const [courseid,setCourseid] = useState('');
    const [fullname,setFullname] = useState('');
    const [shortname,setShortname] = useState('');
    const [cateId,setCateId] = useState('');
    const [cateName,setCateName] = useState('');
    const [schedule,setSchedule] = useState([]);
    const [startdate,setStartdate] = useState('');
    const [enddate,setEnddate] = useState('');
    const [idnumber,setIdnumber] = useState('');
    const [image,setImage] = useState('');
    const [desc,setDesc] = useState('');
    const [studentCount,setStudentCount] = useState('');
    const [cost,setCost] = useState('');
    const [numberCost,setNumberCost] = useState(0);
    const [teacherId,setTeacherId] = useState('');
    const [teacherName,setTeacherName] = useState('');
    const [rate,setRate] = useState('');
    const [isMyCourse,setIsMyCourse] = useState(false);
    const [isInCart,setIsInCart] = useState(false);
    const [render, setRender] = useState(false);
    const [thisTotalComment,setThisTotalComment] = useState(0);
    const [globalTotalComment,setGlobalTotalComment] = useState(0);
    const [commentList,setCommentList] = useState([]);
    const [offset,setOffset] = useState(5);
    const [userrate,setUserrate] = useState(5);
    const [usercomment,setUsercomment] = useState('');
    const [canRate,setCanRate] = useState(false);
    useEffect(() => {//take params from url
        // setPage(parseInt(params.get('page'))); // for comment
        setCourseid(parseInt(params.id));
    }, [params]);

    useEffect(() => {//get data from api
        async function fetchData() {
            if (courseid === '') return;
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            courseid: courseid,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getCourse'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                let temp;
                setFullname(res.data.fullname);
                setShortname(res.data.shortname);
                setCateId(res.data.category);
                setCateName(res.data.catename);
                temp = res.data.schedule;
                temp = JSON.parse(temp);
                setSchedule(temp);
                temp = res.data.startdate
                setStartdate(timestamp2Date(temp,true));
                temp = res.data.enddate
                if (temp === '0') setEnddate('Không xác định');
                else setEnddate(timestamp2Date(temp,true));
                setIdnumber(res.data.idnumber);
                setImage(res.data.image);
                temp = res.data.summary;
                if (temp.length === 0) {
                    setDesc('Không có mô tả');
                }
                else setDesc(temp);
                setStudentCount(res.data.totaluser-1);
                temp = res.data.cost;
                setNumberCost(temp);
                if (temp === '0') setCost('Miễn phí');
                else{
                    temp = temp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                    temp += ' VNĐ';
                    setCost(temp);
                }
                setTeacherId(res.data.teacherid);
                setTeacherName(res.data.teachername);
                temp = res.data.rate;
                if (temp === null) setRate('Chưa có đánh giá');
                else{
                    temp = Math.round(temp*100)/100;
                    temp+='/5';
                    setRate(temp);
                }
                setIsMyCourse(res.data.isMyCourse);
                setCanRate(res.data.canRate);
            }
            else{
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: res.message,
                });
                navi('/course-list');
            }
        }).fail(function(err){
            console.log(err);
        });
    }
    fetchData();
    }, [courseid]);

    useEffect(() => {
        //offset + 10 when scroll to bottom
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight)
            return;
            setOffset(offset + 10);
        }
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [offset]);

    useEffect(() => {//get data from api //comment
        if (courseid === '') return;
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            courseid: courseid,
            offset: offset,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getCourseComment'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setCommentList(res.data.data);
                setThisTotalComment(res.data.thisTotal);
                setGlobalTotalComment(res.data.globalTotal);
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [courseid,render,offset]);


    useEffect(() => {//check if course is in cart
        if (courseid === '') return;
        let temp = cart.filter(item => item.courseid === courseid);
        if (temp.length === 0) setIsInCart(false);
        else setIsInCart(true);
    }, [courseid,cart,render]);
    function addToCart(){
        if (!isLogin) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Bạn phải đăng nhập để thực hiện chức năng này',
            });
            return;
        }
        if (isInCart) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Khóa học này đã có trong giỏ hàng',
            });
            return;
        }
        let item ={
            courseid: courseid,
            fullname: fullname,
            shortname: shortname,
            uploaderId: teacherId,
            uploaderName: teacherName,
            image: image,
            cost: numberCost,
        }
        let newCart = cart;
        newCart.push(item);
        setCart(newCart);
        localStorage.setItem('cart',JSON.stringify(newCart));
        Swal.fire({
            icon: 'success',
            title: 'Thành công',
            text: 'Đã thêm vào giỏ hàng',
        });
        setRender(!render);
    }
    
    function handleDelete(id){
        Swal.fire({
            title: 'Xóa bình luận',
            text: "Bạn có muốn xóa nội dung của đánh giá này, điểm đánh giá sẽ không mất?",
            showDenyButton: true,
            confirmButtonText: `Đồng ý`,
            denyButtonText: `Hủy`,
        }).then((result) => {
            if (result.isConfirmed) {
                const url = '/edulogy/api/Controller/CourseController.php';
                const data = {
                    id: id,
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {data: JSON.stringify(data),
                        action: 'deleteComment'},
                    }).done(function(res){
                        try {
                            res = JSON.parse(res);
                        } catch (error) {}
                        if (res.status === 0) {
                            Swal.fire({
                                icon: 'success',
                                title: 'Thành công',
                                text: 'Đã xóa bình luận',
                            });
                            setRender(!render);
                        }
                        else{
                            Swal.fire({
                                icon: 'error',
                                title: 'Lỗi',
                                text: res.message,
                            });
                        }
                    }).fail(function(err){
                        console.log(err);
                    }
                    );
                    } else if (result.isDenied) {
                        return;
                    }
                }
                );
        
    }
    function handleRate(){
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = {
            courseid: courseid,
            userrate: userrate,
            usercomment: usercomment,
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'rateCourse'},
            }).done(function(res){
                try {
                    res = JSON.parse(res);
                } catch (error) {}
                if (res.status === 0) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Thành công',
                        text: 'Đã đánh giá khóa học',
                    });
                    setRender(!render);
                }
                else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Lỗi',
                        text: res.message,
                    });
                }
            }).fail(function(err){
                console.log(err);
            }
            );
    }
    document.title = "Chi tiết khóa học";
    return (
        <div className='course-detail'>
            <div className="overlay" />

            <section className="section-detail">
                <div className="container">
                    <Row>
                        <Col md={6}>
                            <div className="course-image">
                                <img src={image} alt=""/>
                            </div>
                            <div className="text-center" style={{color:'#fff',fontSize:'30px'}}>THỜI KHÓA BIỂU</div>
                            <TimeTable value={schedule}/>
                        </Col>

                        <Col md={6}>
                            <div className="course-desc">
                                <h3>{fullname}</h3>
                                <h5>{shortname}</h5>
                                <Interweave className="desc" content={desc} newWindow
                                matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}/>
                                <Table responsive size="sm" bordered>
                                <thead>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Giáo viên: <Icon.MortarboardFill /></td>
                                        <td><Link to={'/edit-profile/'+teacherId}>{teacherName}</Link></td>
                                    </tr>
                                    <tr>
                                        <td>Số học viên: <Icon.PersonFill /></td>
                                        <td>{studentCount}</td>
                                    </tr>
                                    <tr>
                                        <td>Thời gian bắt đầu: <Icon.Calendar /></td>
                                        <td>{startdate}</td>
                                    </tr>
                                    <tr>
                                        <td>Thời gian kết thúc: <Icon.CalendarFill /></td>
                                        <td>{enddate}</td>
                                    </tr>
                                    <tr>
                                        <td>Đánh giá: <Icon.StarFill /></td>
                                        <td>{rate}</td>
                                    </tr>
                                    <tr>
                                        <td>Mã khóa học: <Icon.Code /></td>
                                        <td>{idnumber}</td>
                                    </tr>
                                    <tr>
                                        <td>Giá tiền: <Icon.CashStack /></td>
                                        <td>{cost}</td>
                                    </tr>
                                </tbody>
                                </Table>    
                                <div className="course-meta row">
                                    <Col md={6} xs={6} className="text-start">
                                    <Button hidden={!isLogin || isMyCourse || isInCart} onClick={addToCart}>Thêm vào giỏ hàng</Button>
                                    <Button variant="info" hidden={!isInCart || !isLogin} disabled>Đã thêm vào giỏ hàng</Button>
                                    <Button variant="success" onClick={()=>navi('/login')} hidden={isLogin}>Đăng nhập để mua khóa học này</Button>
                                    <Button variant="warning" onClick={()=>{window.open(moodleHome+'/course/view.php?id='+courseid)}} hidden={!isMyCourse}>Chuyển đến trang tài liệu</Button>
                                    </Col>
                                    <Col md={6} xs={6} className="text-end">
                                    <Button variant="success" onClick={()=>navi('/member-list?id='+courseid)} hidden={!isMyCourse}>Xem danh sách thành viên</Button>
                                    </Col>
                                    <div className="cate text-end">
                                        Thể loại: <Link to={'/course-list?cateid='+cateId}>{cateName}</Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            <div className="comment-box">
                                <h3 className="small-title">Có {thisTotalComment} lượt đánh giá ở khóa học này</h3>
                                <h3 className="small-title">Có {globalTotalComment} lượt đánh giá ở thể loại này của giáo viên {teacherName}</h3>
                                <p style={{fontStyle:'italic'}}>Lướt đến cuối trang để tải thêm đánh giá</p>
                                <div className="comment-list">
                                    {commentList.map((item,index)=>{
                                        return (
                                            <Comment key={index} {...item} onDelete={()=>handleDelete(item.id)}/>
                                        )
                                    })}
                                </div>
                            </div>

                            <div className="comment-box" hidden={!canRate}>
                                <h3 className="small-title">Để lại đánh giá</h3>
                                
                                <Col md={4}>
                                    <select value={userrate} onChange={(e)=>setUserrate(e.target.value)} className='form-control' placeholder='Đánh giá'>
                                        <option value='5'>5 sao</option>
                                        <option value='4'>4 sao</option>
                                        <option value='3'>3 sao</option>
                                        <option value='2'>2 sao</option>
                                        <option value='1'>1 sao</option> 
                                    </select>
                                </Col>
                                <hr />
                                <Col md={12}>
                                    <textarea onChange={e=>setUsercomment(e.target.value)} value={usercomment} placeholder="Bình luận" className="form-control"></textarea>
                                </Col>
                                <hr />
                                <Button onClick={handleRate}>Gửi</Button>
                            </div>

                        </Col>
                    </Row>
                    
                </div>
            </section>
        </div>
    );
}