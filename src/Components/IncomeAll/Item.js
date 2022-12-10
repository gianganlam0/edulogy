import { Link } from 'react-router-dom';

export default function Item({teacherid,fullname,num_of_course,totalamount}) {
    totalamount = totalamount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "VNĐ";    
    return (
        <tr>
            <td style={{color:'#000'}}>{<Link to={'/edit-profile/'+teacherid}>{fullname}</Link>}</td>
            <td style={{color:'#000'}}>{num_of_course}</td>
            <td style={{color:'#000'}}>{totalamount}</td>        
        </tr>
    )
}