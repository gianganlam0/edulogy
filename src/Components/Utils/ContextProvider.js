import {useState, createContext} from 'react';
import useLocalStorage from "use-local-storage";
import Swal from 'sweetalert2';
import { useEffect } from 'react';
export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [fullname, setFullname] = useLocalStorage('fullname', 'Khách');
    const [avatar, setAvatar] = useLocalStorage('avatar', '');
    const [cart, setCart] = useLocalStorage('cart', []);
    const BASIC_AVATAR = 'https://i.imgur.com/AxnVk1a.png';
    const BASIC_COURSE = 'https://i.imgur.com/HcIaAlA.png';
    const HOME_BG = "https://i.imgur.com/y6UfhyS.jpg";
    const LOGIN_BG = "https://i.imgur.com/SPbELbr.jpg";
    const LOGIN_LEFT = "https://i.imgur.com/FytAiPZ.png";
    const FORGOT_BG = "https://i.imgur.com/NCRPlNl.jpg";
    const FORGOT_LEFT = "https://i.imgur.com/coQNbJS.jpg";
    const REGISTER_BG="https://i.imgur.com/HoMCxXL.jpg";
    const REGISTER_LEFT="https://i.imgur.com/X4Jojqp.jpg";
    const PATTERN = "https://i.imgur.com/9NgU9mI.png";
    // const API = '/edulogy/api'; // for dev
    const API = 'https://edulogy.tech/edulogy/api'; //for up len host
    const moodleHome = 'https://saru.edulogy.tech';
    function log(text){
        console.log(text);
    }
    function echo(text){
        alert(JSON.stringify(text));
    }
    function string2time(str) { // 00:00
        let [h,m] = str.split(':');
        return h*60 + m*1;
    }
    function timestamp2Date(time, isSkipHour = false) {
        var date = new Date(time*1000);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var hh = String(date.getHours()).padStart(2, '0');
        var min = String(date.getMinutes()).padStart(2, '0');
        var ss = String(date.getSeconds()).padStart(2, '0');
        if(isSkipHour){
            return dd + '/' + mm + '/' + yyyy;
        }
        return dd + '/' + mm + '/' + yyyy + ' - ' + hh + ':' + min + ':' + ss;
    }
    function checkPathname(pathname, str){
        const regex = new RegExp('^' + str + '/*$');
        return regex.test(pathname);
    }
    function loading(){
        Swal.fire({
            title: 'Đang xử lý...',
            html: 'Xin chờ...',
            allowEscapeKey: false,
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            }
        });
    }
    useEffect(() => {
        if (!localStorage.getItem('cart')){
            localStorage.setItem('cart', JSON.stringify([]));
            setCart([]);
            return;
        }
        //check type of localStorage.cart is not json string
        if (localStorage.cart === 'null' || localStorage.cart === 'undefined'){
            localStorage.setItem('cart', JSON.stringify([]));
            setCart([]);
            return;
        }
        if (typeof localStorage.cart === 'string'){
            try {
                JSON.parse(localStorage.cart);
            } catch (error) {
                localStorage.setItem('cart', JSON.stringify([]));
                setCart([]);
                return;
            }
        }
    }, [setCart])

    return (
        <Context.Provider value={{
        BASIC_AVATAR,moodleHome,HOME_BG,PATTERN,LOGIN_BG,LOGIN_LEFT,FORGOT_BG,FORGOT_LEFT,
        REGISTER_BG,REGISTER_LEFT,BASIC_COURSE,API,
        log,echo,timestamp2Date,string2time,loading,checkPathname,
        isLogin, setIsLogin,
        isTeacher, setIsTeacher,
        isAdmin, setIsAdmin,
        fullname, setFullname,
        avatar, setAvatar,
        cart, setCart,
        }}>
            {children}
        </Context.Provider>
    )
}