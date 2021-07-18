import axios from "axios";
import Head from "next/head"
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/shared/Context";
import Header from "../../components/shared/Header";
import MainContainer from "../../components/shared/MainContainer";
import Section from "../../components/shared/Section";
import formatDate from "../../components/utils/formatDate";
import formatHarga from "../../components/utils/formatHarga";
import { getBearerToken } from "../../components/utils/getToken";
import ProtectedPage from "../../components/utils/ProtectedPage";

const Penjualan = () => {
    const router = useRouter()

    const {user} = useContext(UserContext)
    const isAdmin = user.role == 'admin'

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [dataLaporan, setDataLaporan] = useState([])

    const setHoursToZero = date => {
        date.setHours(0,0,0,0)
        return new Date(date)
    }

    const [dateInput, setDateInput] = useState({
        from: formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1))),
        to: formatDate(new Date())
    })

    const getDataLaporan = async () => {
        const config = {
            headers: {
                'Authorization': getBearerToken()
            }
        }
        try {
            const res = await axios.get('/api/penjualan', config)
            const data = await res.data
            setDataLaporan(data)
        } catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        getDataLaporan()
        setTimeout(() => {
            setSuccessMsg('')
            setErrorMsg('')
        }, 3000)
    }, [successMsg, errorMsg])

    const handleDateChange = e => {
        const {value, name} = e.target

        setDateInput(prev => ({
            ...prev,
            [name]: formatDate(setHoursToZero(new Date(value)))
        }))
    }

    const handleCetak = () => {
        var originalContents = document.body.innerHTML

        document.querySelectorAll('.show-on-print').forEach(item => {
            item.style.display = 'block'
        })

        document.querySelectorAll('.hide-on-print').forEach(item => {
            item.style.display = 'none'
        })

        var printContents = document.getElementById('transaksi-print-area').innerHTML

        document.body.innerHTML = printContents

        window.print()

        router.reload()
    }

    const filteredByDateDataPenjualan = () => {
        const from = setHoursToZero(new Date(dateInput.from))
        const to = setHoursToZero(new Date(dateInput.to))

        return dataLaporan
    }

    return (
        <>
            <Head>
                <title>Laporan Penjualan</title>
            </Head>
            <MainContainer>
                <Header title='Laporan Penjualan' subTitle='Daftar penjualan produk.' />
                <div id='transaksi-print-area'>
                <Section>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 hide-on-print'>
                            <div>
                                <input name='from' className='p-2 border rounded-md' type='date' value={dateInput.from} onChange={handleDateChange} />
                                {'  ─  '}
                                <input name='to' className='p-2 border rounded-md' type='date' value={dateInput.to} onChange={handleDateChange} />
                            </div>
                            {isAdmin && <button className='bg-black text-white px-4 py-1.5 rounded-xl mr-2 flex gap-2 items-center' style={{width: 'fit-content'}} onClick={handleCetak}>
                                <i className='icon-printer' />
                                Cetak
                            </button>}
                        </div>
                        <div className='hidden show-on-print'>
                            <h1 className='text-2xl font-bold mb-2'>Laporan Penjualan Produk</h1>
                            <p>Tanggal {new Date(dateInput.from).toLocaleDateString()} ─ {new Date(dateInput.to).toLocaleDateString()}</p>
                        </div>
                        <table className='text-lg border-2'>
                            <tbody>
                                <tr>
                                    <td className='bg-black text-white border-2 border-black px-2'>Total Produk</td>
                                    <td className='text-right w-10 font-bold pl-4 pr-2 bg-white border-2 border-black'>{filteredByDateDataPenjualan().length}</td>
                                </tr>
                                <tr>
                                    <td className='bg-black text-white border-2 border-black px-2'>Produk Terjual</td>
                                    <td className='text-right w-32 font-bold pl-4 pr-2 bg-white border-2 border-black'>{filteredByDateDataPenjualan().reduce((total, item) => total += item.terjual, 0)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Section>
                <Section>
                    <table className='border-2 w-full'>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th className='py-2 border-2 border-white'>Id Produk</th>
                                <th className='py-2 border-2 border-white'>Nama Produk</th>
                                <th className='py-2 border-2 border-white hide-on-print'>Kategori</th>
                                <th className='py-2 border-2 border-white'>Harga</th>
                                <th className='py-2 border-2 border-white'>Stok</th>
                                <th className='py-2 border-2 border-white'>Terjual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataLaporan.map(({id_produk, nama_produk, nama_kategori, deskripsi, qty, terjual, harga_jual}) => 
                                <tr className='bg-white' key={id_produk}>
                                    <td className='py-1 px-2 border-2 text-center'>{id_produk}</td>
                                    <td className='py-1 px-2 border-2'>{nama_produk}</td>
                                    <td className='py-1 px-2 border-2 text-center hide-on-print'>{nama_kategori}</td>
                                    <td className='py-1 px-6 border-2 text-center'>Rp. {formatHarga(harga_jual)}</td>
                                    <td className='py-1 px-8 border-2 text-center'>{qty}</td>
                                    <td className='py-1 px-8 border-2 text-center'>{terjual ? terjual : 0}</td>
                                </tr>    
                            )}
                        </tbody>
                    </table>
                </Section>
                </div>
            </MainContainer>
        </>
    );
}
 
export default ProtectedPage(Penjualan);