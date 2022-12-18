import {Button} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import {useContext } from 'react';
import { Context } from '../Utils/ContextProvider';

export default function CourseCsvItem({shortNameList,confirmerId, confirmerName,pending,time,onConfirm, onDownload}) {
    const {timestamp2Date} = useContext(Context);
    var status;
    switch(pending){
        case '0':
            status = "Đang chờ xác nhận";
            break;
        case '1':
            status = "Đã xác nhận";
            break;
        default:
            status = "Đang chờ xác nhận";
    }

    time = timestamp2Date(time);
    return (
        <tr>
            <td>{shortNameList}</td>
            <td>{
                <Link to={`/edit-profile/${confirmerId}`} style={{cursor:'pointer'}}>{confirmerName}</Link>
            }</td>          
            <td>{time}</td>
            <td>{status}</td>
            <td>
                <div style={{display: 'inline-flex'}}>
                <Button hidden={pending !== '0'} variant="success" onClick={onConfirm} className="btn-sm" style={{marginRight:'5px'}}><I.Check/></Button>
                <Button variant="dark" onClick={onDownload} className="btn-sm"><I.Download/></Button>
                </div>
            </td>
        </tr>
    )
}