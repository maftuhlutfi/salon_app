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

    const [bankInput, setBankInput] = useState('bri')

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
                router.push('/transaksi')
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

    const rekening = {
        bri: '034 101 000 743 303',
        bni: '023 827 2088',
        mandiri: '0700 000 899 992',
        bca: '731 025 2527'
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
                    {tipe_bayar == 'transfer' && 
                        <>
                            <SelectInput id='rekening' name='rekening' label='Pilih Bank' onChange={e => setBankInput(e.target.value)} value={bankInput}>
                                <option value='bri' defaultChecked>BRI</option>
                                <option value='bca'>BCA</option>
                                <option value='bni'>BNI</option>
                                <option value='mandiri'>Mandiri</option>
                            </SelectInput>
                            <p className='text-sm text-red-600 font-medium'>Nomor rekening: {rekening[bankInput]} (Yongki Salon). Transaksi akan batal otomatis jika tidak melakukan pembayaran dalam 2 hari.</p>
                        </>
                    }
                    {tipe_bayar != 'langsung' && <TextInput id='alamat' name='alamat_kirim' value={alamat_kirim} label='Alamat kirim' onChange={handleChange} />}
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