import { Redirect } from "react-router"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useState, useEffect } from "react"

/**
 * We create a wrapper component to make sure that 
 * authentication is successful before we even try 
 * to route through the website 
 */

type RefreshTokenResponse = {
    status: number
    data: {
        access: string
    }
}

const ProtectedRoute = ({children}) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
    
    useEffect(() => {
        auth.catch(() => setIsAuthorized(false))
    }, [])
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const res: RefreshTokenResponse = await api.post("/api/token/refresh", {refresh: refreshToken})
            if (res.status === 200){
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
            }
        } catch (error){
            console.log(error)
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp
        const now = Date.now() / 1000

        // lets get another token the current one has expired
        if (tokenExpiration < now){
            await refreshToken()
        } else {
            setIsAuthorized(true)
        }
    } 

    if (isAuthorized === null){
        return <div>Loading...</div>
    }

    // TODO: read about navigation and react routing
    return isAuthorized ? children: <Redirect to="/login"/>
}

export default ProtectedRoute;
