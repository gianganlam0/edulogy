// import './CatePending.scss';
import {Button} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';

export default function CateItem({name,description,uploaderId, uploaderName,image, time, pending, onAccept, onReject}) {
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
        default:
            status = "Đang chờ duyệt";
    }

    time = timestamp2Date(time);
            
    return (
        <tr>
            <td>{name}</td>
            <td>{description}</td>
            <td>{
                <Link to={`/edit-profile/${uploaderId}`} style={{cursor:'pointer'}}>{uploaderName}</Link>
            }</td>
            <td><img style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }} src={image} alt={name}></img></td>         
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