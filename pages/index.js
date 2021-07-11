import axios from "axios"
import {useRouter} from "next/router"
import { useContext, useEffect } from "react"
import { UserContext } from "../components/shared/Context"
import { getBearerToken } from "../components/utils/getToken"

export default function Home() {
    const {addUser} = useContext(UserContext)
    const router = useRouter()

    useEffect(async () => {
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
                router.push('/produk')
            }
        } catch (e) {
            console.log(e)
            router.push('/login')
        }
    })

    return (
        <div className='w-screen h-screen flex items-center justify-center'>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" style={{margin: 'auto', background: 'rgb(255, 255, 255)', display: 'block', shapeRendering: 'auto'}} width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <circle cx={50} cy={50} r={0} fill="none" stroke="#353535" strokeWidth={2}>
            <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="0s" />
            <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="0s" />
            </circle><circle cx={50} cy={50} r={0} fill="none" stroke="#666666" strokeWidth={2}>
            <animate attributeName="r" repeatCount="indefinite" dur="1s" values="0;40" keyTimes="0;1" keySplines="0 0.2 0.8 1" calcMode="spline" begin="-0.5s" />
            <animate attributeName="opacity" repeatCount="indefinite" dur="1s" values="1;0" keyTimes="0;1" keySplines="0.2 0 0.8 1" calcMode="spline" begin="-0.5s" />
            </circle>
            </svg>
        </div>
    )
}