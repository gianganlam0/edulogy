// import './CatePending.scss';
import {Button} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';

export default function CateItem({name,description,uploaderId, uploaderName,image, time, pending}){
    var status;
    switch(pending){
        case 0:
            status = "Đang chờ duyệt";
            break;
        case 1:
            status = "Đã duyệt";
            break;
        case -1:
            status = "Đã từ chối";
            break;
        default:
            status = "Đang chờ duyệt";
    }
            
    return (
        <tr style={{width: '100%'}}>
            <td>{name}</td>
            <td>{description}</td>
            <td>{
                <Link to={`/edit-profile/${uploaderId}`} style={{cursor:'pointer'}}>{uploaderName}</Link>
            }</td>
            <td style={{width: '50%'}}><img style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                }} src={image} alt={name}></img></td>         
            <td>{time}</td>
            <td>{status}</td>
            <td>
                <div hidden={pending !== 0} style={{display: 'inline-flex'}}>
                <Button variant="success" className="btn-sm" style={{marginRight:'5px'}}><I.Check/></Button>
                <Button variant="danger" className="btn-sm"><I.X/></Button>
                </div>
            </td>
        </tr>
    )
}