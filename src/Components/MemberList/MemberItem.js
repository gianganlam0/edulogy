import { Link } from 'react-router-dom';

export default function MemberItem({fullname,userid,email,phone,classrole}) {
    if (classrole === '1') classrole = 'Giáo viên';
    else classrole = 'Học viên';
    return (
        <tr>   
            <td>{<Link to={`/edit-profile/${userid}`}>{fullname}</Link>}</td>  
            <td>{email}</td>
            <td>{phone}</td>
            <td>{classrole}</td>
        </tr>
    )
}