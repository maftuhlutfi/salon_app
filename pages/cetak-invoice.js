import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import formatHarga from "../components/utils/formatHarga";
import { getBearerToken } from "../components/utils/getToken";

const CetakInvoicePage = () => {
    const router = useRouter()
    const idTransaksi = router.query.id_transaksi
    const [transaksi, setTransaksi] = useState(null)
    const [detailTransaksi, setDetailTransaksi] = useState([])
    
    console.log(idTransaksi) 

    useEffect(() => {
        const getTransaksi = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }
            try {
                const res = await axios.get('/api/transaksi/'+idTransaksi, config)
                const data = await res.data
                setTransaksi(data)
            } catch (e) {
                console.log(e.response)
            }
        }

        const getDetail = async () => {
            const config = {
                headers: {
                  'Authorization': getBearerToken()
                }
              }
    
            const res = await axios.get('/api/detail-transaksi/'+idTransaksi, config)
            const result = await res.data
            setDetailTransaksi(result)
        }

        getDetail()
        getTransaksi()
    }, [idTransaksi])

    const handleCetak = () => {
        document.getElementById('cetak-btn').style.display = 'none'
        window.print()
        document.getElementById('cetak-btn').style.display = 'block'
    }
    
    if (!transaksi) {
        return <div className='text-center'>Loading...</div>
    }

    const {nama_pelanggan, alamat_kirim, id_transaksi, tgl_transaksi} = transaksi

    return (
        <>
            <div className='m-2 border-2 p-8 max-w-2xl relative mx-auto border-black'>
                <div className='flex justify-between'>
                    <div className='w-32 h-16 relative flex-shrink-0'>
                        <Image src='/logo.png' layout='fill' className='object-contain object-top' />
                    </div>
                    <p className='font-bold'>Tanggal: {new Date().toLocaleDateString()}</p>
                </div>
                <h1 className='text-center text-xl font-bold mb-8'>INVOICE</h1>
                <table>
                    <tbody className='text-sm'>
                        <tr>
                            <td className='font-bold'>Nomor Transaksi</td>
                            <td className='px-2'>:</td>
                            <td>{id_transaksi}</td>
                        </tr>
                        <tr>
                            <td className='font-bold'>Tanggal Transaksi</td>
                            <td className='px-2'>:</td>
                            <td>{new Date(tgl_transaksi).toLocaleDateString()}</td>
                        </tr>
                        <tr>
                            <td className='font-bold'>Nama Pelanggan</td>
                            <td className='px-2'>:</td>
                            <td>{nama_pelanggan}</td>
                        </tr>
                    </tbody>
                </table>
                <table className='mt-6 w-full text-sm'>
                    <thead>
                        <tr>
                            <th className='border border-white bg-black text-white text-center py-2 px-1'>No.</th>
                            <th className='border border-white bg-black text-white text-center py-2 px-1'>Nama Produk</th>
                            <th className='border border-white bg-black text-white text-center py-2 px-1'>Harga</th>
                            <th className='border border-white bg-black text-white text-center py-2 px-1'>Jumlah</th>
                            <th className='border border-white bg-black text-white text-center py-2 px-1'>Total Harga</th>
                        </tr>
                    </thead>
                    <tbody>
                        {detailTransaksi.map(({id_produk, harga, jumlah, total_harga, nama_produk}, index) =>
                            <tr key={id_produk} className='text-center whitespace-nowrap'>
                                <td className='relative h-8 w-10 border'>{index+1}</td>
                                <td className='p-2 pl-4 text-left border'>{nama_produk.length > 20 ? nama_produk.slice(0,20) + '...' : nama_produk}</td>
                                <td className='p-2 border'>Rp. {formatHarga(harga)}</td>
                                <td className='p-2 border'>{jumlah}</td>
                                <td className='p-2 border'>Rp. {formatHarga(total_harga)}</td>
                            </tr>
                        )}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan='4' className='text-right p-2 bg-black text-white'>Total</td>
                            <td className='bg-black p-2 text-center font-bold text-white'>Rp. {formatHarga(detailTransaksi.reduce((total, item) => total += item.total_harga, 0))}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className='text-center' id='cetak-btn'>
                <button className='border-2 bg-black py-2 rounded-xl text-white px-4 relative mt-4 mx-auto' onClick={handleCetak}>
                    <i className='icon-printer mr-2' />
                    Cetak Invoice
                </button>
            </div>
        </>
    );
}
 
export default CetakInvoicePage;