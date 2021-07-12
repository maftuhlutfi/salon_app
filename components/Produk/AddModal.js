import Modal from "../shared/Modal";
import TextInput from '../LoginSignup/TextInput'
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { getBearerToken } from "../utils/getToken";
import { useRouter } from "next/router";

const AddModal = ({show, onClose, onConfirm, onCancel, idProduk}) => {
    const router = useRouter()
    const initInput = {
        deskripsi: '',
        gambar_produk: null,
        harga_jual: '',
        id_produk: idProduk,
        kategori: 1,
        nama_produk: '',
        qty: ''
    }

    const [input, setInput] = useState(initInput)

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [baseImg, setBaseImg] = useState(null)

    const [allKategori, setAllKategori] = useState([])

    const {deskripsi,gambar_produk,harga_jual,id_produk,kategori,nama_produk,qty} = input

    useEffect(() => {
        setInput(initInput)
        setErrorMsg('')
        setSuccessMsg('')
        setBaseImg(null)
    }, [show])

    useEffect(() => {
        const getKategori = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }

            const res = await axios.get('/api/kategori', config)
            const kategoriData = await res.data
            setAllKategori(kategoriData)
        }

        getKategori()
    }, [])

    const handleChange = e => {
        const {name, value, type, files} = e.target

        if (type == 'file') {
            setInput(prev => ({
                ...prev,
                gambar_produk: files[0]
            }))

            const reader = new FileReader()
            reader.readAsDataURL(files[0])
            reader.onload = () => setBaseImg(reader.result)
        }

        setInput(prev => ({
            ...prev,
            [name]: value
        }))
        setErrorMsg('')
        setSuccessMsg('')
    }

    const handleClick = async () => {
        if (!deskripsi && !gambar_produk && !harga_jual && !id_produk && !kategori && !nama_produk && !qty) {
            setErrorMsg('Semua form harus diisi')
            return
        }

        var data = new FormData();
        data.append('produk-img', gambar_produk);
        data.append('nama', nama_produk);
        data.append('harga', harga_jual);
        data.append('qty', qty);
        data.append('deskripsi', deskripsi);
        data.append('kategori', kategori)
        console.log(data.get('produk-img'), gambar_produk)

        const config = {
            headers: {
              'Authorization': getBearerToken(),
              'Content-Type': 'multipart/form-data'
            }
          }

        const res = await axios.post('/api/produk', data, config)
        const resData = await res.data
        setSuccessMsg(resData)
        router.reload()
    }

    return (
        <>
            <Modal show={show}>
                <h1 className='text-2xl font-bold text-center'>Tambah Produk</h1>
                <div className='my-8 flex flex-col gap-4 max-h-80 overflow-y-auto px-1 pb-8'>
                    <TextInput name='id_produk' label='Id Produk' id='id-produk' value={id_produk} onChange={handleChange} disabled />
                    <TextInput name='nama_produk' label='Nama Produk' id='nama-produk' value={nama_produk} onChange={handleChange} />
                    <label htmlFor='kategori'>Kategori</label>
                    <select id='kategori' name='kategori' className='px-3 py-1.5 border border-gray-400 rounded-md focus:outline-none focus:ring focus:border-purple-400' value={kategori} onChange={handleChange}>
                        {allKategori.map(item => <option key={item.id_kategori} value={item.id_kategori}>{item.nama_kategori}</option>)}
                    </select>
                    <TextInput name='harga_jual' label='Harga Jual' id='harga-jual' type='number' value={harga_jual} onChange={handleChange} />
                    <TextInput name='qty' label='Stok' id='stok' value={qty} onChange={handleChange} />
                    <TextInput name='deskripsi' label='Deskripsi Produk' id='deskripsi-produk' value={deskripsi} onChange={handleChange} />
                    <label htmlFor='gambar-tambah-produk' className='flex flex-col' style={{width: 'fit-content'}}>
                        <p className='mb-2'>Foto produk</p>
                        <Image src={baseImg ? baseImg : '/uploads/produk/'+gambar_produk} width={100} height={100} className='object-contain object-left' />
                        <span className='bg-black text-white px-4 py-2 mt-2 rounded-lg cursor-pointer'>Upload Foto Produk Baru</span>
                    </label>
                    <input className='h-8' type='file' name='gambar-tambah-produk' id='gambar-tambah-produk' accept="image/png, image/jpeg" onChange={handleChange} />
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