import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../shared/Context";
import Modal from "../shared/Modal";
import { getBearerToken } from "../utils/getToken";

const BuktiBayarModal = ({show, onClose, onConfirm, onCancel, idTransaksi, onChange, onKonfirmasiBayar}) => {
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [buktiBayar, setBuktiBayar] = useState(null)

    const router = useRouter()

    const {user} = useContext(UserContext)
    const isAdmin = user.role == 'admin'

    useEffect(() => {
        setErrorMsg('')
        setSuccessMsg('')
    }, [show])

    const handleBuktiInputChange = e => {
        onChange(e, idTransaksi)
    }
    
    return (
        <>
            <Modal show={show}>
                <h1 className='text-2xl font-bold text-center mb-6'>Bukti Pembayaran</h1>
                <p className='text-center'>
                    {isAdmin ?
                        'Konfirmasi pembayaran jika bukti yang dikirimkan valid dan uang sudah masuk ke rekening.'
                        :
                        'Silahkan upload lagi jika status bayar berubah menjadi belum dibayar'
                    }
                </p>
                <div className='relative w-full h-80 my-8'>
                    <Image src={`/uploads/bukti-transaksi/transaksi-${idTransaksi}.jpg`} layout='fill' className='object-cover object-center' />
                </div>
                <div className='grid grid-cols-2 gap-4 text-lg'>
                    <button className='border-2 border-black py-2 rounded-xl hover:bg-black hover:text-white' onClick={onCancel}>
                        Batal
                    </button>
                    {isAdmin ? 
                        <button className='bg-black rounded-xl text-white' onClick={() => onKonfirmasiBayar(idTransaksi, 'dibayar')}>
                            Konfirmasi
                        </button>
                        :
                        <>
                            <input id='bukti-transaksi-img' type='file' className='hidden' onChange={handleBuktiInputChange} />
                            <label htmlFor='bukti-transaksi-img' className='bg-black rounded-xl text-white flex justify-center items-center'>
                                <button>
                                    Upload Lagi
                                </button>
                            </label>
                        </>
                    }
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
 
export default BuktiBayarModal;