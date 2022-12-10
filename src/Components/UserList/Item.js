import { Link } from 'react-router-dom';

export default function Item({id,fullname,phone2,idnumber,sex,birthday,username,email,role,balance}) {
    balance = balance.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VNĐ";
    switch (sex){
        case '0':
            sex = 'Nam';
            break;
        case '1':
            sex = 'Nữ';
            break;
        case '2':
            sex = 'Khác';
            break;
        default:
            sex = 'Khác';
    }
    switch (role){
        case '0':
            role = 'Học viên';
            break;
        case '1':
            role = 'Giáo viên';
            break;
        case '2':
            role = 'Quản trị viên';
            break;
        default:
            role = 'Học viên';
    }
    if (birthday){
        const dob = birthday.split('-');
        birthday = dob[2] + '/' + dob[1] + '/' + dob[0];
    }
    return (
        <tr>
            <td style={{color:'#000'}}>{<Link to={'/edit-profile/'+id}>{fullname}</Link>}</td>
            <td style={{color:'#000'}}>{username}</td>
            <td style={{color:'#000'}}>{email}</td>
            <td style={{color:'#000'}}>{role}</td>
            <td style={{color:'#000'}}>{phone2}</td>
            <td style={{color:'#000'}}>{idnumber}</td>
            <td style={{color:'#000'}}>{sex}</td>
            <td style={{color:'#000'}}>{birthday}</td>
            <td style={{color:'#000'}}>{balance}</td>
        </tr>
    )
}