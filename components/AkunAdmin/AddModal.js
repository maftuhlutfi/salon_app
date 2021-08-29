import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import TextArea from "../LoginSignup/TextArea"
import TextInput from "../LoginSignup/TextInput"
import Modal from "../shared/Modal"

const AddModal = ({ show, onCancel }) => {
    const router = useRouter()

    const initInput = {
        nama: '',
        email: '',
        password: '',
        confirmPassword: '',
        telepon: '',
        alamat: ''
    }

    const [input, setInput] = useState(initInput)

    const { nama, email, password, confirmPassword, telepon, alamat } = input

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        setInput(initInput)
    }, [show])

    const handleChange = e => {
        const { name, value } = e.target
        setErrorMsg('')

        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleClick = async () => {
        if (!nama && !email && !password && !confirmPassword && !telepon && !alamat) {
            setErrorMsg('Tolong isi semua form.')
            return
        }

        if (password != confirmPassword) {
            setErrorMsg('Password dan konfirmasi password tidak sama.')
            return
        }

        try {
            const res = await axios.post('/api/user/signup', {
                nama,
                email,
                password,
                confirmPassword,
                telepon,
                role: 'admin',
                alamat
            })

            if (res.status == 200) {
                setSuccessMsg('Berhasil menambah admin baru.')
                setTimeout(() => {
                    router.reload()
                }, 2000)
            }
        } catch (e) {
            console.log(e)
            //setErrorMsg(e.response.data)
        }
    }

    return (
        <>
            <Modal show={show}>
                <h1 className='text-2xl font-bold text-center'>Tambah Admin</h1>
                <div className='my-8 flex flex-col gap-4 max-h-80 overflow-y-auto px-1 pb-8'>
                    <TextInput label='Nama' id='nama' name='nama' onChange={handleChange} value={nama} />
                    <TextInput label='Email' id='email' name='email' type='email' onChange={handleChange} value={email} />
                    <TextInput label='Password' id='password' name='password' type='password' onChange={handleChange} value={password} />
                    <TextInput label='Konfirmasi Password' id='confirm-password' name='confirmPassword' type='password' onChange={handleChange} value={confirmPassword} />
                    <TextInput label='Telepon' id='telepon' name='telepon' type='tel' onChange={handleChange} value={telepon} />
                    <TextInput label='Alamat' id='alamat' name='alamat' type='textarea' onChange={handleChange} value={alamat} />
                </div>
                <div className='grid grid-cols-2 gap-4 text-lg'>
                    <button className='border-2 border-black py-2 rounded-xl hover:bg-black hover:text-white' onClick={onCancel}>
                        Batal
                    </button>
                    <button className='bg-black rounded-xl text-white' onClick={handleClick}>
                        Tambah
                    </button>
                </div>
            </Modal>
            {successMsg && 
                <p className='w-full z-50 py-2 bg-green-600 text-white text-center fixed top-0 left-0'>
                    {successMsg}
                </p>
            }
            {errorMsg &&
                <p className='w-full z-50 py-2 bg-red-600 text-white text-center fixed top-0 left-0'>
                    {errorMsg}
                </p>
            }
        </>
    );
}

export default AddModal;