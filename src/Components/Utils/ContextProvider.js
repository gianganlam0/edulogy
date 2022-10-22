import {useState, createContext} from 'react';
import useLocalStorage from "use-local-storage";
export const Context = createContext();

export const ContextProvider = ({children}) => {
    const [isLogin, setIsLogin] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [fullname, setFullname] = useLocalStorage('fullname', 'Khách');
    const [avatar, setAvatar] = useLocalStorage('avatar', '');
    return (
        <Context.Provider value={{isLogin, setIsLogin, isAdmin, setIsAdmin, fullname, setFullname, avatar, setAvatar}}>
            {children}
        </Context.Provider>
    )
}