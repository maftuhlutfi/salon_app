import axios from "axios";
import Head from "next/head"
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/shared/Context";
import Header from "../components/shared/Header";
import MainContainer from "../components/shared/MainContainer";
import Section from "../components/shared/Section";
import BuktiBayarModal from "../components/Transaksi/BuktiBayarModal";
import DeleteModal from "../components/Transaksi/DeleteModal";
import DetailModal from "../components/Transaksi/DetailModal";
import formatDate from "../components/utils/formatDate";
import formatHarga from "../components/utils/formatHarga";
import { getBearerToken } from "../components/utils/getToken";
import isImageExists from "../components/utils/isImageExists";
import ProtectedPage from "../components/utils/ProtectedPage";

const TransaksiPage = () => {
    const router = useRouter()

    const [transaksi, setTransaksi] = useState([])
    const [selecteIdTransaksi, setSelecteIdTransaksi] = useState(null)
    const [showCancelModal, setShowCancelModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [showBuktiBayarModal, setShowBuktiBayarModal] = useState(false)

    const {user} = useContext(UserContext)
    const isAdmin = user.role == 'admin'

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const [buktiBayar, setBuktiBayar] = useState(null)

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

    const handleCancelClick = id => {
        setSelecteIdTransaksi(id)
        setShowCancelModal(true)
    }

    const handleDetailClick = id => {
        setSelecteIdTransaksi(id)
        setShowDetailModal(true)
    }

    const handleLihatBukti = id => {
        setSelecteIdTransaksi(id)
        setShowBuktiBayarModal(true)
    }

    const handleBuktiInputChange = (e, id_transaksi) => {
        setBuktiBayar(e.target.files[0])
        setSelecteIdTransaksi(id_transaksi)
    }

    useEffect(() => {
        if (buktiBayar) {
            handleEditClick(selecteIdTransaksi, 'upload bukti')
        }
    }, [buktiBayar])

    const handleEditClick = async (id, action) => {
        const selectedTransaksi = transaksi.find(t => t.id_transaksi == id)
        const isSelesai = action == 'selesai'

        if (isSelesai && selectedTransaksi.status_pembayaran != 'dibayar') {
            alert('Anda belum membayar atau masih dalam proses verifikasi pembayaran oleh admin.')
            return
        }

        const config = {
            headers: {
                'Authorization': getBearerToken(),
                'Content-Type': 'multipart/form-data'
              }
        }

        var data = new FormData();
        if (buktiBayar) {
            data.append('bukti-transaksi-img', new File([buktiBayar], 'transaksi-' + id + '.jpg', {type: buktiBayar.type}));
        }
        data.append('action', action);
        data.append('tanggal', formatDate(new Date()));

        const res = await axios.put('/api/transaksi/'+id, data, config)

        setSuccessMsg(res.data)
        router.reload()
    }

    const handleDateChange = e => {
        const {value, name} = e.target

        setDateInput(prev => ({
            ...prev,
            [name]: formatDate(setHoursToZero(new Date(value)))
        }))
    }
    
    const handlePrintInvoice = id => {
        const selectedTransaksi = transaksi.find(t => t.id_transaksi == id)
        console.log(selectedTransaksi)

        window.open(`/cetak-invoice?id_transaksi=${id}`, 'Cetak Invoice', 'width=800, height=750, resizeable=no, left=50, top=50')
    }

    const filteredByDateTransaksi = () => {
        const from = setHoursToZero(new Date(dateInput.from))
        const to = setHoursToZero(new Date(dateInput.to))

        return transaksi.filter(t => setHoursToZero(new Date(t.tgl_transaksi)) >= from && setHoursToZero(new Date(t.tgl_transaksi)) <= to) 
    }

    const isTransaksiImageExist = id => {
        return isImageExists(`/uploads/bukti-transaksi/transaksi-${id}.jpg`)
    }

    const statusColor = {
        proses: 'bg-yellow-400',
        selesai: 'bg-green-400',
        batal: 'bg-red-400',
        verifikasi: 'bg-yellow-400',
        dibayar: 'bg-green-400',
        'belum dibayar': 'bg-red-400'
    }

    return (
        <>
            <Head>
                <title>Transaksi</title>
            </Head>
            <MainContainer>
                <Header title='Transaksi' subTitle='Daftar semua transaksi.' />
                <div id='transaksi-print-area'>
                <Section>
                    <div className='flex justify-between items-center'>
                        <div className='flex gap-4 hide-on-print'>
                            <div>
                                <input name='from' className='p-2 border rounded-md' type='date' value={dateInput.from} onChange={handleDateChange} />
                                {'  ─  '}
                                <input name='to' className='p-2 border rounded-md' type='date' value={dateInput.to} onChange={handleDateChange} />
                            </div>
                        </div>
                        <div className='hidden show-on-print'>
                            <h1 className='text-2xl font-bold mb-2'>Data Transaksi</h1>
                            <p>Tanggal {new Date(dateInput.from).toLocaleDateString()} ─ {new Date(dateInput.to).toLocaleDateString()}</p>
                        </div>
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
                                <th className='py-2 border-2 border-white hide-on-print'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredByDateTransaksi().map(({alamat_kirim,total_bayar,id_pelanggan,id_transaksi,nama_pelanggan,status_pembayaran, status_transaksi, tgl_bayar, tgl_transaksi, tipe_bayar}, index) => 
                              <tr key={index} className='bg-white'>
                                  <td className='py-1 px-2 border-2 text-center'>{id_transaksi}</td>
                                  {isAdmin && <td className='py-1 px-2 border-2 text-center'>{id_pelanggan}</td>}
                                  {isAdmin && <td className='py-1 px-2 border-2 '>{nama_pelanggan}</td>}
                                  <td className='py-1 px-2 border-2 text-center'>{new Date(tgl_transaksi).toLocaleDateString()}</td>
                                  <td className={`py-1 px-2 border-2 text-center ${statusColor[status_transaksi]}`}>{status_transaksi}</td>
                                  <td className='py-1 px-2 border-2 text-center'>Rp. {formatHarga(total_bayar)}</td>
                                  <td className='py-1 px-2 border-2 text-center'>{tipe_bayar}</td>
                                  <td className={`py-1 px-2 border-2 text-center ${isTransaksiImageExist(id_transaksi) && status_pembayaran != 'dibayar' ? statusColor['verifikasi'] : statusColor[status_pembayaran]}`}>
                                      {isTransaksiImageExist(id_transaksi) && status_pembayaran != 'dibayar' ? 'verifikasi admin' : status_pembayaran}
                                    </td>
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
                                  <td className='py-1 px-2 border-2 text-center hide-on-print'>
                                        <button className='bg-black text-white px-4 py-1 rounded-xl mr-2' onClick={() => handleDetailClick(id_transaksi)}>
                                            <i className='icon-info' />
                                        </button>
                                        {(status_transaksi != 'selesai' || status_pembayaran != 'dibayar') &&  status_transaksi != 'batal' &&
                                            <>
                                            <button className='bg-black text-white px-4 py-1 rounded-xl mr-2 group relative'>
                                                <i className='icon-edit' />
                                                <div className='absolute top-full mt-1 right-0 z-10 bg-white text-black rounded-lg overflow-hidden hidden group-focus:block border-2 border-black'>
                                                    {isTransaksiImageExist(id_transaksi) ?
                                                        <p className={`whitespace-nowrap px-4 py-2 text-left hover:bg-gray-300 ${status_pembayaran == 'dibayar' && 'hidden'}`} onClick={() => handleLihatBukti(id_transaksi)}>
                                                            Lihat bukti pembayaran
                                                        </p>
                                                        :
                                                        <>
                                                            <input id='bukti-transaksi-img' type='file' className='hidden' onChange={e => handleBuktiInputChange(e, id_transaksi)} />
                                                            <label htmlFor='bukti-transaksi-img'>
                                                                <p className={`whitespace-nowrap px-4 py-2 text-left hover:bg-gray-300 ${status_pembayaran == 'dibayar' && 'hidden'}`}>
                                                                    Konfirmasi pembayaran
                                                                </p>
                                                            </label>
                                                        </>
                                                    }
                                                    {!isAdmin && 
                                                        <p className={`whitespace-nowrap px-4 py-2 text-left hover:bg-gray-300 ${status_transaksi == 'selesai' && 'hidden'}`} onClick={() => handleEditClick(id_transaksi, 'selesai')}>Transaksi selesai</p>
                                                    }
                                                </div>
                                            </button>
                                            </>
                                        }
                                        {!isAdmin && status_transaksi != 'batal' && 
                                            <button className='bg-black text-white px-4 py-1 rounded-xl  mr-2' onClick={() => handleCancelClick(id_transaksi)}>
                                                ✖
                                            </button>
                                        }
                                        <button className='bg-black text-white px-4 py-1 rounded-xl text-center' onClick={() => handlePrintInvoice(id_transaksi)}>
                                            <i className='icon-printer' />
                                        </button>
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
                show={showCancelModal}
                onCancel={() => setShowCancelModal(false)}
                idTransaksi={selecteIdTransaksi}
            />
            <BuktiBayarModal
                show={showBuktiBayarModal}
                onCancel={() => setShowBuktiBayarModal(false)}
                idTransaksi={selecteIdTransaksi}
                onChange={(e, id) => handleBuktiInputChange(e, id)}
                onKonfirmasiBayar={handleEditClick}
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