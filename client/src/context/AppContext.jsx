import { createContext } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
// import { set } from "mongoose";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext()


const AppContextProvider = (props) => {
    const [user, setUser] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [token, setToken]=useState(localStorage.getItem('token'))
    const [credit, setCredit] = useState(0)

    const navigate=useNavigate();



    const backendUrl=import.meta.env.VITE_BACKEND_URL

    const loadCreditsData = async () => {

    try {
    
        const { data } = await axios.get(
            backendUrl + '/api/user/credits',
            {
                headers: { token }
            }
        );

        console.log("CREDITS API RESPONSE:", data);
      
        if (data.success) {
            setCredit(data.credits);
            setUser(data.user);
        }

    } catch (error) {

        console.log("LOAD CREDITS ERROR:", error);

    }
}

   const generateImage = async (prompt) => {
    try {
        console.log("PROMPT:", prompt);
        console.log("TOKEN:", token);
        console.log("BACKEND URL:", backendUrl);

        const { data } = await axios.post(
            backendUrl + '/api/image/generate-image',
            { prompt },
            {
                headers: {
                    token: token
                }
            }
        );

        console.log("GENERATE IMAGE RESPONSE:", data);

        if (data.success) {
            await loadCreditsData();
            return data.resultImage;
        } else {
            toast.error(data.message);

            await loadCreditsData();

            if (data.creditBalance === 0) {
                navigate('/buy');
            }
        }

    } catch (error) {
        console.log("GENERATE IMAGE ERROR:", error);
        console.log("SERVER RESPONSE:", error.response?.data);

        toast.error(
            error.response?.data?.message || error.message
        );
    }
};

    const logout=()=>{
        localStorage.removeItem('token');
        setToken('');
        setUser(null)

    }

   
    useEffect(()=>{

        if(token){

            loadCreditsData()
        }

    },[token])

    const value = {
        user, setUser, showLogin, setShowLogin, backendUrl, token, setToken,
        credit, setCredit, loadCreditsData, logout, generateImage
    }

    return (
        <AppContext.Provider value={value}>

            {props.children}

        </AppContext.Provider>
    )
}

export default AppContextProvider;
