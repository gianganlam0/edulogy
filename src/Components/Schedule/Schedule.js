import './Schedule.scss';
import {Row, Col, Button, InputGroup, FormControl} from 'react-bootstrap';
import { useState, useEffect,useContext,useMemo } from 'react';
import { Context } from '../Utils/ContextProvider';
import TimeTable from '../Utils/TimeTable/TimeTable';
import $ from 'jquery';
import Swal from 'sweetalert2';
export default function Schedule() {
    const {API} = useContext(Context);
    //gmt +7
    const [today, setToday] = useState(new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0]);
    const [schedule, setSchedule] = useState([]);
    function changeWeek(day){
        let newDate = new Date(today);
        newDate.setDate(newDate.getDate() + day*7);
        setToday(newDate.toISOString().split('T')[0]);
    }
    function reFormDate(date){
        let temp = date.split('-');
        return temp[2]+'/'+temp[1]+'/'+temp[0];
    }
    function setNow(){
        setToday(new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().split('T')[0]);
    }
    
    //get monday of week of today
    let day = new Date(today).getDay();
    let temp = day-1;
    if (day === 0) temp = 6;

    const {monday,sunday} = useMemo(() => {
        let monday = new Date(today);
        monday.setDate(monday.getDate() - temp);
        let sunday = new Date(monday);
        sunday.setDate(sunday.getDate() + 6);
    
        monday = monday.toISOString().split('T')[0];
        sunday = sunday.toISOString().split('T')[0];
        return {
          monday: monday,
          sunday: sunday,
        }
      }, [temp, today]); 
    useEffect(() => {//get data from api
        const url = `${API}/Controller/CourseController.php`;
        const data = {
            monday: monday,
            sunday: sunday
        }
        $.ajax({
            url: url,
            type: 'POST',
            data: {data: JSON.stringify(data),
                action: 'getSchedule'},
        }).done(function(res){
            try {
                res = JSON.parse(res);
            } catch (error) {}
            if (res.status === 0) {
                setSchedule(res.data);
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                });
            }
        }).fail(function(err){
            console.log(err);
        });
    }, [API, monday, sunday, today]);
    document.title = "Thời khóa biểu";
    return (
        <div className='schedule'>
            <div className="overlay" />

            <section className="section-cate">
                <div className="container">
                    <div className="boxed">               
                        <Row className="section-title text-center mb-3">
                            <h3>Thời khóa biểu của tôi</h3>
                        </Row>
                        <Row>
                            <Col className="text-end" md={4} lg={4} xs={12} sm={12}>
                            <Button variant='danger' onClick={()=>changeWeek(-1)}>Tuần trước</Button>
                            </Col>
                            <Col className="text-center" md={4} lg={4} xs={12} sm={12}>
                                <InputGroup className="mb-3">
                                    <FormControl value={today} onChange={(e)=>setToday(e.target.value)} style={{margin:'0 10px'}} type='date'/>
                                </InputGroup>
                            </Col>
                            <Col className="text-start" md={4} lg={4} xs={12} sm={12}>
                            <Button variant='success' onClick={()=>changeWeek(1)}>Tuần sau</Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center" md={12} lg={12} xs={12} sm={12}>
                                <h4>Từ {reFormDate(monday)} đến {reFormDate(sunday)}</h4>
                            </Col>
                            <Col className="text-center mb-3" md={12} lg={12} xs={12} sm={12}>
                                <Button onClick={setNow}>Quay lại hôm nay</Button>
                            </Col>
                        </Row>
                        <Row>                           
                            <TimeTable value={schedule}/>
                        </Row>
                    </div>                  
                </div>
            </section>
        </div>
    );
}