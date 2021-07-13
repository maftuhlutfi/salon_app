import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "../shared/Modal";
import formatHarga from "../utils/formatHarga";
import { getBearerToken } from "../utils/getToken";

const DetailModal = ({show, onCancel, idTransaksi}) => {
    const [detail, setDetail] = useState([])

    useEffect(() => {
        const getDetail = async () => {
            const config = {
                headers: {
                  'Authorization': getBearerToken()
                }
              }
    
            const res = await axios.get('/api/detail-transaksi/'+idTransaksi, config)
            const result = await res.data
            setDetail(result)
        }

        if (show) {
            getDetail()
        }

        if (!show) {
            setDetail([])
        }
    }, [show])

    return (
        <Modal show={show} style='w-2/5'>
            <h1 className='text-2xl font-bold text-center mb-8'>Detail Transaksi</h1>
            <table className='my-4 w-full text-sm rounded-lg overflow-hidden'>
                <thead>
                    <tr>
                        <th className='border border-white bg-black text-white text-center py-2 px-1'>Gambar</th>
                        <th className='border border-white bg-black text-white text-center py-2 px-1'>Nama Produk</th>
                        <th className='border border-white bg-black text-white text-center py-2 px-1'>Harga</th>
                        <th className='border border-white bg-black text-white text-center py-2 px-1'>Qty</th>
                        <th className='border border-white bg-black text-white text-center py-2 px-1'>Total Harga</th>
                    </tr>
                </thead>
                <tbody>
                    {detail.map(({id_produk, harga, jumlah, total_harga, nama_produk, gambar_produk}) =>
                        <tr key={id_produk} className='text-center whitespace-nowrap'>
                            <td className='relative h-8 w-10 border'>
                                <Image src={`/uploads/produk/${gambar_produk}`} layout='fill' className='object-contain' />
                            </td>
                            <td className='p-4 text-left border'>{nama_produk.length > 20 ? nama_produk.slice(0,20) + '...' : nama_produk}</td>
                            <td className='p-4 border'>Rp. {formatHarga(harga)}</td>
                            <td className='p-4 border'>x{jumlah}</td>
                            <td className='p-4 border'>Rp. {formatHarga(total_harga)}</td>
                        </tr>
                    )}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan='4' className='text-right p-2 bg-black text-white'>Total</td>
                        <td className='bg-black p-2 text-center font-bold text-white'>Rp. {formatHarga(detail.reduce((total, item) => total += item.total_harga, 0))}</td>
                    </tr>
                </tfoot>
            </table>
            <div className='w-full flex justify-center'>
                <button className='border-2 bg-black py-2 rounded-xl text-white px-8' onClick={onCancel}>
                    Tutup
                </button>
            </div>
        </Modal>
    );
}
 
export default DetailModal;