import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import TextInput from "../../LoginSignup/TextInput";
import { getBearerToken } from "../../utils/getToken";
import { CartContext, UserContext } from "../Context";
import DataList from "../DataList";
import Modal from "../Modal";
import SelectInput from "../SelectInput";

const AddTransaksiModal = ({show, onCancel}) => {
    const {user} = useContext(UserContext)
    const {cartItems, clearAllItem} = useContext(CartContext)
    const isAdmin = user.role == 'admin'

    const router = useRouter()

    const initInput = {
        id_pelanggan: isAdmin ? '' : user.id,
        tipe_bayar: "langsung",
        alamat_kirim: ""
    }

    const [input, setInput] = useState(initInput)
    const {id_pelanggan, tipe_bayar, alamat_kirim} = input

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [pelanggan, setPelanggan] = useState([])

    useEffect(() => {
        const getPelanggan = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }

            const res = await axios.get('/api/user/get-pelanggan', config)
            const result = await res.data
            setPelanggan(result)
        }

        if (isAdmin) {
            getPelanggan()
        }
    }, [])

    useEffect(() => {
        setErrorMsg('')
        setSuccessMsg('')
    }, [show])

    useEffect(() => {
        if (successMsg) {
            setTimeout(() => {
                router.reload()
                clearAllItem()
            }, 2000)
        }
    }, [successMsg])

    const handleChange = e => {
        const {name, value} = e.target

        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleClick = async () => {
        const config = {
            headers: {
                'Authorization': getBearerToken()
            }
        }

        setErrorMsg('')
        setSuccessMsg('')

        try {
            const res = await axios.post('/api/transaksi', input, config)
            const insertedId = await res.data.insertedId

            const resAll = await axios.all(
                cartItems.map(item => axios.post('/api/detail-transaksi', {
                    id_transaksi: insertedId,
                    id_produk: item.id_produk,
                    jumlah: item.quantity
                }, config))
            )
            setSuccessMsg(res.data.message)
        } catch (e) {
            setErrorMsg(e.message)
        }

    }

    return (
        <>
            <Modal show={show}>
                <h1 className='text-2xl font-bold text-center'>Checkout Keranjang</h1>
                <div className='my-8 flex flex-col gap-4 max-h-80 overflow-y-auto px-1 py-1 pb-8'>
                    {isAdmin &&
                        <DataList name='id_pelanggan' id='pelanggan' label='Id Pelanggan' onChange={handleChange} value={id_pelanggan}>
                            {pelanggan.map(({id, nama}) => 
                                <option key={id} value={id}>{nama}</option>    
                            )}
                        </DataList>
                    }
                    <SelectInput id='tipe-bayar' name='tipe_bayar' label='Tipe Bayar' onChange={handleChange} value={tipe_bayar}>
                        <option value='langsung' defaultChecked>Langsung</option>
                        <option value='cod'>COD</option>
                        <option value='transfer'>Transfer</option>
                    </SelectInput>
                    {tipe_bayar == 'transfer' && <p className='text-sm text-red-600 font-medium'>Pembayaran ke rekening: 888921023122 (Mandiri). Konfirmasi hubungi admin 088292122123.</p>}
                    <TextInput id='alamat' name='alamat_kirim' value={alamat_kirim} label='Alamat kirim' onChange={handleChange} />
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
 
export default AddTransaksiModal;