import Head from 'next/head'
import TextInput from '../components/LoginSignup/TextInput'
import TextArea from '../components/LoginSignup/TextArea'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'

export default function Home() {
  const router = useRouter()

  const [input, setInput] = useState({
    nama: '',
    email: '',
    password: '',
    confirmPassword: '',
    telepon: '',
    alamat: ''
  })
  const {nama, email, password, confirmPassword, telepon, alamat} = input

  const [errMsg, setErrMsg] = useState('')
  const [success, setSuccess] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = e => {
    const {name, value} = e.target
    setErrMsg('')

    setInput(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleClick = async () => {
    if (!nama && !email && !password && !confirmPassword && !telepon && !alamat) {
      setErrMsg('Tolong isi semua form.')
      return
    }

    if (password != confirmPassword) {
      setErrMsg('Password dan konfirmasi password tidak sama.')
      return
    }

    setIsLoading(true)

    try {
      const res = await axios.post('/api/user/signup', {
        nama,
        email,
        password,
        confirmPassword,
        telepon,
        role: 'pelanggan',
        alamat
      })
      
      if (res.status == 200) {
        setIsLoading(false)
        setSuccess('Berhasil membuat akun baru. Anda akan dialihkan ke halaman login.')
        setTimeout(() => {
          router.push('/login')
        }, 5000)
      }
    } catch (e) {
      setErrMsg(e.response.data)
      setIsLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Daftar</title>
      </Head>
      <div className='w-screen min-h-screen py-8 flex items-center justify-center flex-col bg-gray-200'>
        <div className='relative w-32 h-16 mb-8'>
          <Image src='/logo.png' layout='fill' className='object-fit' />
        </div>
        <div className='w-80 bg-white py-8 px-8 rounded-xl'>
          <h1 className='text-center text-2xl font-bold'>Daftar</h1>
          <div className='my-6 flex flex-col gap-3'>
            <TextInput label='Nama' id='nama' name='nama' onChange={handleChange} value={nama} />
            <TextInput label='Email' id='email' name='email' type='email' onChange={handleChange} value={email} />
            <TextInput label='Password' id='password' name='password' type='password' onChange={handleChange} value={password} />
            <TextInput label='Konfirmasi Password' id='confirm-password' name='confirmPassword' type='password' onChange={handleChange} value={confirmPassword} />
            <TextInput label='Telepon' id='telepon' name='telepon' type='tel' onChange={handleChange} value={telepon} />
            <TextArea label='Alamat' id='alamat' name='alamat' type='textarea' onChange={handleChange} value={alamat} />
          </div>
          {errMsg && <p className='text-red-500 text-sm mb-4 -mt-2'>{errMsg}</p>}
          <button onClick={handleClick} className='w-full bg-black text-center text-white rounded-md py-3 mt-2'>
            {isLoading ? 
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                :
                'Daftar'
              }
          </button>
          <p className='mt-8 text-center'>Sudah punya akun?</p>
          <Link href='/login'>
            <p className='text-center font-bold cursor-pointer'>Login disini</p>
          </Link>
        </div>
      </div>
      {success && 
        <p className='w-full py-2 bg-green-600 text-white text-center fixed top-0'>
          {success}
        </p>
      }
    </>
  )
}
