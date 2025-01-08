import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useAppContext} from "../components/AppContext/AppContext.jsx";

export function AuthCallback(){
    const location = useLocation();
    const navigate = useNavigate();
    const {setUsername,setIsAuthenticated} = useAppContext()
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        localStorage.setItem("token",token)
        setIsAuthenticated(true)
        setUsername(username)
        navigate("/")
    }, []);
}