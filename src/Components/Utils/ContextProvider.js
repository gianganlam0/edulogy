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
    function checkPathname(pathname, str){
        const regex = new RegExp('^' + str + '/*$');
        return regex.test(pathname);
    }
    return (
        <Context.Provider value={{BASIC_AVATAR, log,
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