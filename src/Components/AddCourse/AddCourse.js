import './AddCourse.scss';
import {Container,Row, Col, Button, Form} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import ScheduleItem from './ScheduleItem';
import $ from 'jquery';
import Swal from 'sweetalert2';
export default function AddCourse() {
    const {string2time,loading} = useContext(Context);
    const {echo} = useContext(Context);
    const [error, setError] = useState('');
    const [isHidden, setIsHidden] = useState(true);
    const [fullName, setFullName] = useState('');
    const [shortName, setShortName] = useState('');
    const [schedule, setSchedule] = useState([]);
    const [cateKeyword, setCateKeyword] = useState('');
    const [cateId, setCateId] = useState('1');
    const [cateList, setCateList] = useState([{id: '1', name: 'Nội dung khác'},]);
    const [startDay, setStartDay] = useState(  
        //set timezone to UTC+7 and set date to next 8 day and hour to 00:00
        new Date(new Date().getTime() + 7*60*60*1000 + 8*24*60*60*1000).toISOString().split('T')[0]
    );
    const [endDay, setEndDay] = useState(
        //today + 7 day + 1 year
        new Date(new Date().getTime() + 7*60*60*1000 + 8*24*60*60*1000 + 365*24*60*60*1000).toISOString().split('T')[0]
    );
    const [idNumber, setIdNumber] = useState('');
    const [desc, setDesc] = useState('');
    const [cost, setCost] = useState(0);
    const [imgFile, setImgFile] = useState(undefined);
    const [image, setImage] = useState('https://i.imgur.com/HcIaAlA.png');
    const imgFileRef = useRef();
    function valiAll(fullName, shortName, schedule, startDay, endDay, idNumber, cost, imgFile) {
        if (valiFullName(fullName).error) {
            setError(valiFullName(fullName).message);   
        }
        else if (valiShortName(shortName).error) {
            setError(valiShortName(shortName).message);
        }
        else if (valiSchedule(schedule).error) {
            setError(valiSchedule(schedule).message);
        }
        else if (valiDay(startDay, endDay).error) {
            setError(valiDay(startDay, endDay).message);
        }
        else if (valiIdNumber(idNumber).error) {
            setError(valiIdNumber(idNumber).message);
        }
        else if (valiCost(cost).error) {
            setError(valiCost(cost).message);
        }
        else if (valiImgFile(imgFile).error) {
            setError(valiImgFile(imgFile).message);
        }
        else {
            setError('');
            setIsHidden(false);
            return true;
        }
        setIsHidden(true);
        return false;
/////////////       VALIDATE
    }
    function valiFullName(fullName){
        if (fullName.length === 0)
            return {
                error: true,
                message: 'Tên khóa học không được trống!'
            }
        if (fullName.length > 254)
            return {
                error: true,
                message: 'Tên khóa học không được quá 254 ký tự!'
            }
        return {
            error: false,
            message: ''
        }
    }
    function valiShortName(shortName){
        if (shortName.length === 0)
            return {
                error: true,
                message: 'Tên rút gọn không được trống!'
            }
        if (shortName.length > 100)
            return {
                error: true,
                message: 'Tên rút gọn không được quá 100 ký tự!'
            }
        return {
            error: false,
            message: ''
        }
    }
    function valiSchedule(schedule) {
        if (schedule.length === 0)
            return {
                error: true,
                message: 'Lịch học không được trống!'
            }
        //now check end time must larger than start time as least 30 minutes
        for (let i = 0; i < schedule.length; i++) {
            if (string2time(schedule[i].end) - string2time(schedule[i].start) < 30)
                return {
                    error: true,
                    message: 'Thời gian học phải lớn hơn 30 phút!'
                }
        }
        // now check schedule must not overlap
        for (let i = 0; i < schedule.length; i++) {
            for (let j = i+1; j < schedule.length; j++) {
                if (schedule[i].day === schedule[j].day) {
                    if (string2time(schedule[i].start) < string2time(schedule[j].end) && string2time(schedule[i].end) > string2time(schedule[j].start))
                        return {
                            error: true,
                            message: 'Lịch học không được trùng lặp!'
                        }
                }
            }
        }
        return {
            error: false,
            message: ''
        }
        
    }
    function valiDay(startDay, endDay) {
        if (new Date(startDay).getTime() < new Date().getTime() + 7*60*60*1000 + 7*24*60*60*1000){
            return {
                error: true,
                message: 'Ngày bắt đầu cách ngày hiện tại trên 1 tuần!'
            }
        }
        //end day must larger than start day at least 21 days
        if (new Date(endDay).getTime() - new Date(startDay).getTime() < 21*24*60*60*1000){
            return {
                error: true,
                message: 'Ngày kết thúc phải cách ngày bắt đầu ít nhất 21 ngày!'
            }
        }
        return {
            error: false,
            message: ''
        }
    }
    function valiIdNumber(idNumber) {
        if (idNumber.length > 100)
            return {
                error: true,
                message: 'Mã khóa học không được quá 100 ký tự!',
            }
        return {
            error: false,
            message: ''
        }
    }
    function valiCost(cost) {
        if (cost.length === 0){
            return {
                error: true,
                message: 'Giá tiền không được trống!',
            }
        }
        //check cost is a integer number
        if (cost*1 !== parseInt(cost))
            return {
                error: true,
                message: 'Giá tiền phải là một số nguyên!',
            }
        if (cost < 0)
            return {
                error: true,
                message: 'Giá tiền không được nhỏ hơn 0!',
            }
        return {
            error: false,
            message: ''
        }
    }
    function valiImgFile(imgFile) {
        const regex = /^image\/(jpg|jpeg|png)$/;
        if (imgFile === undefined) { // khong chon file
            return {
                error: false,
                message: ''
            }
        }
        else {
            if (!regex.test(imgFile.type)) {
                return {
                    error: true,
                    message: 'File ảnh không hợp lệ!'
                }
            }
            if (imgFile.size > 1024*1024*5) {
                return {
                    error: true,
                    message: 'File ảnh không được quá 5MB!'
                }
            }
            //check if broken image file
            if (imgFile.size === 0) {
                return {
                    error: true,
                    message: 'File ảnh không hợp lệ!'
                }
            }
            return {
                error: false,
                message: ''
            }
        }
    }
    //end validate
    function handleFullName(e) {
        setFullName(e.target.value);
        if (valiFullName(e.target.value).error) {
            setError(valiFullName(e.target.value).message);
            setIsHidden(true);
        }
        else
            valiAll(e.target.value, shortName, schedule, startDay, endDay, idNumber, cost, imgFile);
    }
    function handleShortName(e) {
        setShortName(e.target.value);
        if (valiShortName(e.target.value).error) {
            setError(valiShortName(e.target.value).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, e.target.value, schedule, startDay, endDay, idNumber, cost, imgFile);
    }
    //3 function below handle schedule
    function handleAddSchedule(){
        let newSchedule = [...schedule];
        newSchedule.push({day: "2", start: "00:00", end: "00:30"});
        setSchedule(newSchedule);
        if (valiSchedule(newSchedule).error) {
            setError(valiSchedule(newSchedule).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, newSchedule, startDay, endDay, idNumber, cost, imgFile);

    }
    function handleChangeScheduleItem(e, i) {
        let newSchedule = [...schedule];
        newSchedule[i] = e.target.value;
        setSchedule(newSchedule);
        if (valiSchedule(newSchedule).error) { 
            setError(valiSchedule(newSchedule).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, newSchedule, startDay, endDay, idNumber, cost, imgFile);
    }
    function handleDeleteScheduleItem(i){
        let newSchedule = [...schedule];
        newSchedule.splice(i, 1);
        setSchedule(newSchedule);
        if (valiSchedule(newSchedule).error) {
            setError(valiSchedule(newSchedule).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, newSchedule, startDay, endDay, idNumber, cost, imgFile);  
    }
    //end schedule
    function handleCateKeyword(e) {
        const newKeyword = e.target.value;
        setCateKeyword(newKeyword);
        if (newKeyword.length === 0) {
            setCateList([{id: '1', name: 'Nội dung khác'}]);
            setCateId('1');
        }
        else{
            const url = '/edulogy/api/Controller/CateController.php';
            const data = {
                offset: 0,
                itemPerPage: 30,
                keyword: newKeyword,
                sortBy: 'name',
                orderBy: 'asc'
            }
            $.ajax({
                url: url,
                type: 'POST',
                data: {data: JSON.stringify(data),
                    action: 'getCateList'},
                }).done(function(res){
                    try {
                        res = JSON.parse(res);
                    } catch (error) {}
                    if (res.status === 0) {
                        if (res.data.data.length === 0) {
                            setCateList([{id: '1', name: 'Nội dung khác'}]);
                            setCateId('1');
                            return;
                        }
                        setCateList(res.data.data);
                        setCateId(res.data.data[0].id);
                    }
                }).fail(function(err){
                    console.log(err);
                });
        }
    }
    function handleStartDay(e) {
        const newStartDay = e.target.value;
        setStartDay(newStartDay);
        if (valiDay(newStartDay, endDay).error) {
            setError(valiDay(newStartDay, endDay).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, schedule, newStartDay, endDay, idNumber, cost, imgFile);
    }
    function handleEndDay(e) {
        const newEndDay = e.target.value;
        setEndDay(newEndDay);
        if (valiDay(startDay, newEndDay).error) {
            setError(valiDay(startDay, newEndDay).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, schedule, startDay, newEndDay, idNumber, cost, imgFile);
    }
    function handleIdNumber(e) {
        const newIdNumber = e.target.value;
        setIdNumber(newIdNumber);
        if (valiIdNumber(newIdNumber).error) {
            setError(valiIdNumber(newIdNumber).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, schedule, startDay, endDay, newIdNumber, cost, imgFile);
    }
    function handleCost(e){
        const newCost = e.target.value;
        setCost(newCost);
        if (valiCost(newCost).error) {
            setError(valiCost(newCost).message);
            setIsHidden(true);
        }
        else
            valiAll(fullName, shortName, schedule, startDay, endDay, idNumber, newCost, imgFile);
    }
    function handleImgFile(e) {///có set cả avatar để preview
        const newImgFile = e.target.files[0];
        setImgFile(newImgFile);

        if (image.startsWith('blob:')) {
            URL.revokeObjectURL(image); //xóa cái cũ do đổi file
        }
        if (valiImgFile(newImgFile).error) {
            setError(valiImgFile(newImgFile).message);
            setIsHidden(true);
        }
        else {
            const temp = URL.createObjectURL(newImgFile);
            setImage(temp); //for preview
            valiAll(fullName, shortName, schedule, startDay, endDay, idNumber, cost, newImgFile);
        }
    }
    function handleDeleteImg() {
        if (image.startsWith('blob:')) {
            URL.revokeObjectURL(image); //xóa cái cũ
        }
        imgFileRef.current.value = null;
        setImgFile(undefined);
        setImage('https://i.imgur.com/HcIaAlA.png');
        valiAll(fullName, shortName, schedule, startDay, endDay, idNumber, cost, undefined);
    }
    function handleUp(){
        const url = '/edulogy/api/Controller/CourseController.php';
        const data = new FormData();
        if (imgFile !== undefined) {
            data.append('imgFile', imgFile);
        }
        data.append('data', JSON.stringify({
            fullName: fullName,
            shortName: shortName,
            schedule: schedule,
            cateId: cateId,
            startDay: startDay,
            endDay: endDay,
            idNumber: idNumber,
            desc: desc,
            cost: cost,
            }));
        data.append('action', 'addCourse');
        $.ajax({
            url: url,
            type: 'POST',
            data: data,
            processData: false,
            contentType: false,
            beforeSend: function(){
                loading();
            }
        }).done(function(res) {
            Swal.close();
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0){
                Swal.fire(res.message, '', 'success')
            }
            else if (res.status < 0){
                Swal.fire({
                    text: res.message,
                    icon: 'error',
                })
            }
            else if (isNaN(res.status)){//loi k xd
                Swal.fire({
                    text: "Lỗi không xác định",
                    icon: 'error',
                })
            }
            
        }).fail(function(){
            Swal.fire({
                text: "Lỗi kết nối",
                icon: 'error',
            })
        });

    }
    document.title = "Thêm khóa học";
    return (
        <div className='add-course'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">

                        <div className="section-title text-center">
                            <h3>Thêm khóa học</h3>
                        </div>
                        
                        <Row>
                            
                            <Col md={8} className="mx-auto">
                                <div style={{minHeight:'30px', color: 'red'}}>{error}</div>
                                <p>Dấu <span style={{color:'red'}}>*</span> chỉ mục bắt buộc</p>
                                <Form>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên khóa học <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control value={fullName} onChange={handleFullName} type="text" placeholder="Nhập tên khóa học" />
                                    </Form.Group>
                    
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tên rút gọn <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control value={shortName} onChange={handleShortName} type="text" placeholder="Nhập tên rút gọn khóa học" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thời khóa biểu <span style={{color:'red'}}>*</span></Form.Label>
                                        <Button onClick={handleAddSchedule} style={{marginLeft:"10px"}} variant="success">Thêm giờ học</Button>
                                        <Container>
                                        {schedule.map((item, i) => {
                                            return <ScheduleItem key={i} onChange={(e)=>handleChangeScheduleItem(e,i)} value={item} onDelete={()=>handleDeleteScheduleItem(i)}/>
                                        })}
                                        </Container>
                                        
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Thể loại khóa học <span style={{color:'red'}}>*</span></Form.Label>
                                        <Row>
                                        <Col lg={6}>
                                        <Form.Control value={cateKeyword} onChange={handleCateKeyword} type="text" placeholder="Tìm kiếm danh mục" />
                                        </Col>
                                        <Col lg={6}>
                                        <Form.Select value={cateId} onChange={e => setCateId(e.target.value)}>
                                            {cateList.map((item, i) => {
                                                return <option key={i} value={item.id}>{item.name}</option>
                                            }
                                            )}
                                        </Form.Select>
                                        </Col>
                                        </Row>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày bắt đầu khóa học <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control value={startDay} onChange={handleStartDay} type="date" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ngày kết thúc khóa học <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control value={endDay} onChange={handleEndDay} type="date" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>ID khóa học</Form.Label>
                                        <Form.Control value={idNumber} onChange={handleIdNumber} type="text" placeholder="Nhập id khóa học" />
                                    </Form.Group>

                                    {/* description textarea */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Mô tả</Form.Label>
                                        <Form.Control value={desc} onChange={e => setDesc(e.target.value)} as="textarea" rows={3} placeholder="Nhập mô tả" />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Giá tiền <span style={{color:'red'}}>*</span></Form.Label>
                                        <Form.Control value={cost} onChange={handleCost} type="text" placeholder='Nhập giá khóa học (VNĐ)'/>
                                    </Form.Group>
                                    {/* image for category  */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ảnh danh mục</Form.Label>
                                        <Form.Control ref={imgFileRef} onChange={handleImgFile} onClick={e => e.target.value = null} type="file" accept="image/png, image/jpeg" placeholder="Chọn ảnh danh mục" />
                                    </Form.Group>
                                    {/* preview category image */}
                                    <div className="preview-img">
                                        <img src={image} alt="preview" />
                                    </div>
                                </Form>
                                {/* 2 button float start and end */}
                                <Row>
                                    <Col md={4} className="text-center">
                                        <Button onClick={handleUp} disabled={isHidden}>
                                            Thêm khóa học
                                        </Button>
                                    </Col>
                                    <Col md={{span:'4',offset:'4'}} className="text-center">
                                        <Button onClick={handleDeleteImg} variant="danger">
                                            Xóa ảnh
                                        </Button>
                                    </Col>
                                </Row>
                                
                                    
                            </Col>
                        </Row>

                    </div>
                    
                </div>
            </section>
        </div>
    );
}