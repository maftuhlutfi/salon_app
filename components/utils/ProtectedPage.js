import axios from "axios"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { UserContext } from "../shared/Context"
import { getBearerToken } from "./getToken"

const ProtectedPage = (Component) => {
    function Protected({...otherProps}) {
        const {user, addUser} = useContext(UserContext)
        const router = useRouter()
    
        useEffect(async () => {
            if (!user) {
                if (window.localStorage.getItem('authToken')) {
                    const config = {
                    headers: {
                        'Authorization': getBearerToken()
                        }
                    }
            
                    try {
                        const res = await axios.get('/api/user/get-user', config)
                        const userData = await res.data
                        
                        if (userData) {
                            addUser(userData)
                        }
                    } catch (e) {
                        router.push('/login')
                    }
                } else {
                    router.push('/login')
                }
            }
        })
    
        return (
            <Component {...otherProps} />
        );
    }

    return Protected
}
 
export default ProtectedPage;