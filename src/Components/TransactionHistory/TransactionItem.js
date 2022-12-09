// import './CatePending.scss';
import {Button} from 'react-bootstrap';
import * as I from 'react-bootstrap-icons'
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef, useContext } from 'react';
import { Context } from '../Utils/ContextProvider';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { Interweave } from 'interweave';
import { UrlMatcher, HashtagMatcher } from 'interweave-autolink';

export default function TransactionItem({type,content,amount,time,status}) {
    const {isAdmin,timestamp2Date} = useContext(Context);
    switch(status){
        case '0':
            status = "Đang xử lý";
            break;
        case '1':
            status = "Thành công";
            break;
        case '2':
            status = "Thất bại";
            break;
        default:
            status = "Đang xử lý";
    }
    switch(type){
        case 'topup':
            type = "Nạp tiền";
            break;
        case 'buy':
            type = "Mua khóa học";
            break;
        case 'sell':
            type = "Bán khóa học";
            break;
        default:
            type = "Nạp tiền";
    }
    //add dot to amount by 1000
    amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "VNĐ";
    time = timestamp2Date(time);         
    return (
        <tr>
            <td style={{color:'#000'}}>{type}</td>
            <td style={{color:'#000'}}>{content}</td>
            <td style={{color:'#000'}}>{amount}</td>        
            <td style={{color:'#000'}}>{time}</td>
            <td style={{color:'#000'}}>{status}</td>
        </tr>
    )
}