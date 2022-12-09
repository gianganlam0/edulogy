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
    const moodleHome = 'http://localhost/saru';
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
    }, [])

    return (
        <Context.Provider value={{BASIC_AVATAR,moodleHome,log,echo,timestamp2Date,string2time,loading,
        isLogin, setIsLogin,
        isTeacher, setIsTeacher,
        isAdmin, setIsAdmin,
        fullname, setFullname,
        avatar, setAvatar,
        cart, setCart,
        checkPathname}}>
            {children}
        </Context.Provider>
    )
}