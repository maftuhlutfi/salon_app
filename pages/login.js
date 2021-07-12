import Head from 'next/head'
import TextInput from '../components/LoginSignup/TextInput'
import Image from 'next/image'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../components/shared/Context'
import { useRouter } from 'next/router'
import axios from 'axios'
import { getAuthToken, getBearerToken } from '../components/utils/getToken'

export default function Login() {
  const {addUser, user} = useContext(UserContext)
  const router = useRouter()

  const [input, setInput] = useState({
    email: '',
    password: ''
  })
  const {email, password} = input

  const [errMsg, setErrMsg] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const authToken = getAuthToken()

    const getUser = async () => {
      const config = {
        headers: {
          'Authorization': getBearerToken()
        }
      }
      
      const res = await axios.get('/api/user/get-user', config)
      const userData = await res.data
      
      if (userData) {
        addUser(userData)
      }
    }  

    if (authToken && !isLoading) {
      getUser()
    }
  }, [isLoading])

  useEffect(() => {
    if (user) {
      router.push('/produk')
    }
  }, [user])

  const handleChange = e => {
    const {name, value} = e.target
    setErrMsg('')

    setInput(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClick = async () => {
    if (!email && !password) {
      setErrMsg('Tolong isi email dan password')
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post('/api/user/login', {
        email,
        password
      })
      const {authToken} = await res.data
      setIsLoading(false)
      window.localStorage.setItem('authToken', authToken)
    } catch (e) {
      setErrMsg(e.response.data)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <div className='w-screen h-screen flex items-center justify-center flex-col bg-gray-200'>
        <div className='relative w-32 h-16 -mt-16 mb-8'>
          <Image src='/logo.png' layout='fill' className='object-fit' />
        </div>
        <div className='w-80 bg-white py-8 px-8 rounded-xl'>
          <h1 className='text-center text-2xl font-bold'>Login</h1>
          <div className='my-6 flex flex-col gap-4'>
            <TextInput label='Email' id='email' name='email' type='email' value={email} onChange={handleChange} />
            <TextInput label='Password' id='password' name='password' type='password' value={password} onChange={handleChange} />
          </div>
          {errMsg && <p className='text-red-500 text-sm mb-4 -mt-2'>{errMsg}</p>}
          <button onClick={handleClick} className='w-full bg-black text-center text-white rounded-md py-3 mt-2 flex items-center justify-center'>
            {isLoading ? 
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              :
              'Daftar'
            }
          </button>
          <p className='mt-8 text-center'>Belum punya akun?</p>
          <Link href='/daftar'>
            <p className='text-center font-bold cursor-pointer'>Daftar disini</p>
          </Link>
        </div>
      </div>
    </>
  )
}
