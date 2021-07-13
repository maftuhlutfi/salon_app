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

        if (!user) {
            return (
                <div className='z-50 w-screen h-screen flex items-center justify-center bg-white fixed top-0 left-0'>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ margin: 'auto', background: 'rgb(255, 255, 255)', display: 'block', shapeRendering: 'auto' }} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <circle cx={50} cy={50} r={0} fill="none" stroke="#222222" strokeWidth={2}>
                            <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="0s" />
                            <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="0s" />
                        </circle><circle cx={50} cy={50} r={0} fill="none" stroke="#9a9a9a" strokeWidth={2}>
                            <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.5s" />
                            <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.5s" />
                        </circle>
                    </svg>
                </div>
            )
        }
    
        return (
            <Component {...otherProps} />
        );
    }

    return Protected
}
 
export default ProtectedPage;