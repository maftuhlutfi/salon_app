import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import TextInput from "../LoginSignup/TextInput"
import Modal from "../shared/Modal"
import { getBearerToken } from "../utils/getToken"

const EditModal = ({ show, onCancel, id, nama }) => {
    const router = useRouter()

    const initInput = {
        id_kategori: id,
        nama_kategori: nama
    }

    const [input, setInput] = useState(initInput)

    const { id_kategori, nama_kategori } = input

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
        if (!id_kategori && !nama_kategori) {
            setErrorMsg('Tolong isi semua form.')
            return
        }

        const config = {
            headers: {
              'Authorization': getBearerToken()
            }
          }

        try {
            const res = await axios.put('/api/kategori/'+id, {
                nama: nama_kategori
            }, config)

            if (res.status == 200) {
                setSuccessMsg('Berhasil mengedit kategori.')
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
                <h1 className='text-2xl font-bold text-center'>Tambah Pelanggan</h1>
                <div className='my-8 flex flex-col gap-4 max-h-80 overflow-y-auto px-1 pb-8'>
                    <TextInput label='Id Kategori' id='id_kategori' name='id_kategori' onChange={handleChange} value={id_kategori} disabled />
                    <TextInput label='Nama Kategori' id='nama_kategori' name='nama_kategori' onChange={handleChange} value={nama_kategori} />
                </div>
                <div className='grid grid-cols-2 gap-4 text-lg'>
                    <button className='border-2 border-black py-2 rounded-xl hover:bg-black hover:text-white' onClick={onCancel}>
                        Batal
                    </button>
                    <button className='bg-black rounded-xl text-white' onClick={handleClick}>
                        Simpan
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

export default EditModal;