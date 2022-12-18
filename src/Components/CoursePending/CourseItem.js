import {Button} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import {useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import TimeTable from '../Utils/TimeTable/TimeTable';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';

export default function CourseItem({fullName,shortName,schedule,cateId,cateName,startDay,endDay,idNumber,description,cost,image,uploaderId, uploaderName,pending,time,onAccept, onReject}) {
    const {isAdmin,timestamp2Date} = useContext(Context);
    var status;
    switch(pending){
        case '0':
            status = "Đang chờ duyệt";
            break;
        case '1':
            status = "Đã duyệt";
            break;
        case '2':
            status = "Đã từ chối";
            break;
        case '3':
            status = "Đã xuất csv";
            break;
        case '4':
            status = "Đã upload";
            break;
        default:
            status = "Đang chờ duyệt";
    }

    time = timestamp2Date(time);
    startDay = timestamp2Date(startDay, true);
    if (endDay === '0') endDay = "Không giới hạn";
    else endDay = timestamp2Date(endDay, true);
    schedule = JSON.parse(schedule);
    return (
        <tr>
            <td>{fullName}</td>
            <td>{shortName}</td>
            <td><TimeTable value={schedule}></TimeTable></td>
            <td>{
                <Link to={`/course-list?cateid=${cateId}`} style={{cursor:'pointer'}}>{cateName}</Link>
            }</td>
            <td>{startDay}</td>
            <td>{endDay}</td>
            <td>{idNumber}</td>
            <td><Interweave content={description} newWindow
                matchers={[new UrlMatcher('url'), new HashtagMatcher('hashtag')]}/></td>
            <td>{cost}</td>
            <td><img style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }} src={image} alt={fullName}></img></td>   
            <td>{
                <Link to={`/edit-profile/${uploaderId}`} style={{cursor:'pointer'}}>{uploaderName}</Link>
            }</td>
                  
            <td>{time}</td>
            <td>{status}</td>
            <td>
                <div hidden={pending !== '0' || !isAdmin} style={{display: 'inline-flex'}}>
                <Button variant="success" onClick={onAccept} className="btn-sm" style={{marginRight:'5px'}}><I.Check/></Button>
                <Button variant="danger" onClick={onReject} className="btn-sm"><I.X/></Button>
                </div>
            </td>
        </tr>
    )
}