import axios from "axios";
import Head from "next/head"
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../components/shared/Context";
import Header from "../../components/shared/Header";
import MainContainer from "../../components/shared/MainContainer";
import Section from "../../components/shared/Section";
import DeleteModal from "../../components/Transaksi/DeleteModal";
import DetailModal from "../../components/Transaksi/DetailModal";
import formatDate from "../../components/utils/formatDate";
import formatHarga from "../../components/utils/formatHarga";
import { getBearerToken } from "../../components/utils/getToken";
import ProtectedPage from "../../components/utils/ProtectedPage";

const TransaksiPage = () => {
    const router = useRouter()

    const [transaksi, setTransaksi] = useState([])
    const [selecteIdTransaksi, setSelecteIdTransaksi] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)

    const {user} = useContext(UserContext)
    const isAdmin = user.role == 'admin'

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const setHoursToZero = date => {
        date.setHours(0,0,0,0)
        return new Date(date)
    }

    const [dateInput, setDateInput] = useState({
        from: formatDate(new Date(new Date().setMonth(new Date().getMonth() - 1))),
        to: formatDate(new Date())
    })

    const getTransaksi = async () => {
        const config = {
            headers: {
                'Authorization': getBearerToken()
            }
        }
        try {
            const res = await axios.get('/api/transaksi', config)
            const data = await res.data
            setTransaksi(data)
        } catch (e) {
            console.log(e.response)
        }
    }

    useEffect(() => {
        getTransaksi()
        setTimeout(() => {
            setSuccessMsg('')
            setErrorMsg('')
        }, 3000)
    }, [successMsg, errorMsg])

    const handleDeleteClick = id => {
        setSelecteIdTransaksi(id)
        setShowDeleteModal(true)
    }

    const handleDetailClick = id => {
        setSelecteIdTransaksi(id)
        setShowDetailModal(true)
    }

    const handleEditClick = async (id, action) => {
        const selectedTransaksi = transaksi.find(t => t.id_transaksi == id)
        const isBayar = action == 'dibayar'
        const isSelesai = action == 'selesai'

        const config = {
            headers: {
                'Authorization': getBearerToken()
            }
        }

        const res = await axios.put('/api/transaksi/'+id, {
            status_transaksi: isSelesai ? 'selesai' : selectedTransaksi.status_transaksi,
            status_pembayaran: isBayar ? 'dibayar' : selectedTransaksi.status_pembayaran,
            tgl_bayar: isBayar ? formatDate(new Date()) : null
        }, config)
        setSuccessMsg(res.data)
    }

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

    const filteredByDateTransaksi = () => {
        const from = setHoursToZero(new Date(dateInput.from))
        const to = setHoursToZero(new Date(dateInput.to))

        return transaksi.filter(t => setHoursToZero(new Date(t.tgl_transaksi)) >= from && setHoursToZero(new Date(t.tgl_transaksi)) <= to) 
    }

    return (
        <>
            <Head>
                <title>Laporan Transaksi</title>
            </Head>
            <MainContainer>
                <Header title='Laporan Transaksi' subTitle='Daftar semua transaksi.' />
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
                            <h1 className='text-2xl font-bold mb-2'>Data Transaksi</h1>
                            <p>Tanggal {new Date(dateInput.from).toLocaleDateString()} ─ {new Date(dateInput.to).toLocaleDateString()}</p>
                        </div>
                        <table className='text-lg border-2'>
                            <tbody>
                                <tr>
                                    <td className='bg-black text-white border-2 border-black px-2'>Total Transaksi</td>
                                    <td className='text-right font-bold pl-4 pr-2 bg-white border-2 border-black'>{filteredByDateTransaksi().length}</td>
                                </tr>
                                <tr>
                                    <td className='bg-black text-white border-2 border-black px-2'>Transaksi Selesai</td>
                                    <td className='text-right font-bold pl-4 pr-2 bg-white border-2 border-black'>{filteredByDateTransaksi().filter(t => t.status_transaksi == 'selesai').length}</td>
                                </tr>
                                <tr>
                                    <td className='bg-black text-white border-2 border-black px-2'>Total {isAdmin ? 'Penjualan' : 'Pembayaran'}</td>
                                    <td className='text-right font-bold pl-4 pr-2 bg-white border-2 border-black'>Rp. {formatHarga(filteredByDateTransaksi().reduce((total, item) => item.status_pembayaran == 'dibayar' ? total += item.total_bayar : total, 0))}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Section>
                <Section>
                    <table className='border-2 w-full'>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th className='py-2 border-2 border-white'>Id Transaksi</th>
                                {isAdmin && <th className='py-2 border-2 border-white'>Id Pelanggan</th>}
                                {isAdmin && <th className='py-2 border-2 border-white'>Nama Pelanggan</th>}
                                <th className='py-2 border-2 border-white'>Tanggal</th>
                                <th className='py-2 border-2 border-white'>Status</th>
                                <th className='py-2 border-2 border-white'>Total Bayar</th>
                                <th className='py-2 border-2 border-white'>Tipe Bayar</th>
                                <th className='py-2 border-2 border-white'>Status Bayar</th>
                                <th className='py-2 border-2 border-white'>Tanggal Bayar</th>
                                <th className='py-2 border-2 border-white hide-on-print'>Alamat Kirim</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredByDateTransaksi().map(({alamat_kirim,total_bayar,id_pelanggan,id_transaksi,nama_pelanggan,status_pembayaran, status_transaksi, tgl_bayar, tgl_transaksi, tipe_bayar}, index) => 
                              <tr key={index} className='bg-white'>
                                  <td className='py-1 px-2 border-2 text-center'>{id_transaksi}</td>
                                  {isAdmin && <td className='py-1 px-2 border-2 text-center'>{id_pelanggan}</td>}
                                  {isAdmin && <td className='py-1 px-2 border-2 '>{nama_pelanggan}</td>}
                                  <td className='py-1 px-2 border-2 text-center'>{new Date(tgl_transaksi).toLocaleDateString()}</td>
                                  <td className='py-1 px-2 border-2 text-center'>{status_transaksi}</td>
                                  <td className='py-1 px-2 border-2 text-center'>Rp. {formatHarga(total_bayar)}</td>
                                  <td className='py-1 px-2 border-2 text-center'>{tipe_bayar}</td>
                                  <td className='py-1 px-2 border-2 text-center'>{status_pembayaran}</td>
                                  <td className='py-1 px-2 border-2 text-center'>{tgl_bayar ? new Date(tgl_bayar).toLocaleDateString() : '-'}</td>
                                  <td className='py-1 px-2 border-2 text-center hide-on-print'>
                                      {alamat_kirim ?
                                        <button className='bg-black text-white px-4 py-1 rounded-xl relative group'>
                                            Lihat
                                            <div className='absolute hidden group-focus:block top-full bg-white rounded-2xl text-black text-sm z-10 left-0 w-48 p-2 text-left cursor-text shadow-md'>
                                                {alamat_kirim}
                                            </div>
                                        </button>
                                        :
                                        '-'
                                      }
                                  </td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </Section>
                </div>
            </MainContainer>
            <DetailModal 
                show={showDetailModal}
                onCancel={() => setShowDetailModal(false)}
                idTransaksi={selecteIdTransaksi}
            />
            <DeleteModal 
                show={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                idTransaksi={selecteIdTransaksi}
            />
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
 
export default ProtectedPage(TransaksiPage);