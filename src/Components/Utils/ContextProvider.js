import {useState, createContext} from 'react';
import useLocalStorage from "use-local-storage";
export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [fullname, setFullname] = useLocalStorage('fullname', 'Khách');
    const [avatar, setAvatar] = useLocalStorage('avatar', '');
    const BASIC_AVATAR = 'https://i.imgur.com/AxnVk1a.png';
    function log(text){
        console.log(text);
    }
    function timestamp2Date(time) {
        var date = new Date(time*1000);
        var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = date.getFullYear();
        var hh = String(date.getHours()).padStart(2, '0');
        var min = String(date.getMinutes()).padStart(2, '0');
        var ss = String(date.getSeconds()).padStart(2, '0');
        return dd + '/' + mm + '/' + yyyy + ' - ' + hh + ':' + min + ':' + ss;
    }
    function checkPathname(pathname, str){
        const regex = new RegExp('^' + str + '/*$');
        return regex.test(pathname);
    }
    return (
        <Context.Provider value={{BASIC_AVATAR, log, timestamp2Date,
        isLogin, setIsLogin,
        isTeacher, setIsTeacher,
        isAdmin, setIsAdmin,
        fullname, setFullname,
        avatar, setAvatar,
        checkPathname}}>
            {children}
        </Context.Provider>
    )
}