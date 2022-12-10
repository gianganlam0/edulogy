import { Link } from 'react-router-dom';
import {useContext } from 'react';
import { Context } from '../Utils/ContextProvider';

export default function Item({studentid,courseid,amount,time,studentname,coursename}) {
    const {isAdmin,timestamp2Date} = useContext(Context);
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "VNĐ";
    time = timestamp2Date(time);         
    return (
        <tr>
            <td style={{color:'#000'}}>{<Link to={'/course-detail/'+courseid}>{coursename}</Link>}</td>
            <td style={{color:'#000'}}>{<Link to={'/edit-profile/'+studentid}>{studentname}</Link>}</td>
            <td style={{color:'#000'}}>{amount}</td>        
            <td style={{color:'#000'}}>{time}</td>
        </tr>
    )
}