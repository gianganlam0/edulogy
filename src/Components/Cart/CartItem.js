// import './CatePending.scss';
import {Button} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';

export default function Cart({courseid,fullname,shortname,uploaderId, uploaderName,image,cost,onDelete}) {
    if (cost === '0') cost = 'Miễn phí';
    else cost = cost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");    
    return (
        <tr>
            <td>{
                <Link to={'/course-detail/'+courseid}>{fullname}</Link>}</td>
            <td>{shortname}</td>      
            <td>{
                <Link to={`/edit-profile/${uploaderId}`}>{uploaderName}</Link>
            }</td>  
            <td><img style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }} src={image} alt={fullname}></img></td>
            <td>{cost}</td>
            <td>
                <div style={{display: 'inline-flex'}}>
                <Button variant="danger" onClick={onDelete} className="btn-sm"><I.Trash/></Button>
                </div>
            </td>
        </tr>
    )
}