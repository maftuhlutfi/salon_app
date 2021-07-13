import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Modal from "../shared/Modal";
import { getBearerToken } from "../utils/getToken";

const DeleteModal = ({show, onClose, onConfirm, onCancel, idUser}) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const router = useRouter()

    useEffect(() => {
        setErrorMsg('')
        setSuccessMsg('')
    }, [show])

    const handleClick = async () => {
        const config = {
            headers: {
              'Authorization': getBearerToken()
            }
          }

        const res = await axios.delete('/api/user/'+idUser, config)
        const resData = await res.data
        setSuccessMsg(resData)
        router.reload()
    }
    
    return (
        <>
            <Modal show={show}>
                <h1 className='text-2xl font-bold text-center mb-8'>Apakah anda akan menghapus pelanggan ini?</h1>
                <div className='grid grid-cols-2 gap-4 text-lg'>
                    <button className='border-2 border-black py-2 rounded-xl hover:bg-black hover:text-white' onClick={onCancel}>
                        Batal
                    </button>
                    <button onClick={handleClick} className='bg-black rounded-xl text-white'>
                        Ya
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
 
export default DeleteModal;