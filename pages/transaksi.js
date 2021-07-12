import axios from "axios";
import Head from "next/head"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../components/shared/Context";
import Header from "../components/shared/Header";
import MainContainer from "../components/shared/MainContainer";
import Section from "../components/shared/Section";
import DeleteModal from "../components/Transaksi/DeleteModal";
import DetailModal from "../components/Transaksi/DetailModal";
import formatDate from "../components/utils/formatDate";
import { getBearerToken } from "../components/utils/getToken";
import ProtectedPage from "../components/utils/ProtectedPage";

const TransaksiPage = () => {
    const [transaksi, setTransaksi] = useState([])
    const [selecteIdTransaksi, setSelecteIdTransaksi] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [input, setInput] = useState(null)

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

    const handleEditClick = id => {
        setSelecteIdTransaksi(id)
        const selectedTransaksi = transaksi.find(t => t.id_transaksi == id)
        setInput({
            status_transaksi: selectedTransaksi.status_transaksi,
            status_pembayaran: selectedTransaksi.status_pembayaran
        })
        setIsEdit(true)
    }

    const handleSimpan = async id => {
        setIsEdit(false)
        setSelecteIdTransaksi(null)
        setInput(null)

        const selectedTransaksi = transaksi.find(t => t.id_transaksi == id)

        if (selectedTransaksi.status_pembayaran == input.status_pembayaran && selectedTransaksi.status_transaksi == input.status_transaksi) {
            return
        }

        const config = {
            headers: {
                'Authorization': getBearerToken()
            }
        }

        const res = await axios.put('/api/transaksi/'+id, {
            ...input,
            tgl_bayar: input.status_pembayaran == 'dibayar' && selectedTransaksi.status_pembayaran != 'dibayar' ? formatDate(new Date()) : null
        }, config)
        setSuccessMsg(res.data)
    }

    const handleChange = e => {
        const {value, name} = e.target

        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleDateChange = e => {
        const {value, name} = e.target

        setDateInput(prev => ({
            ...prev,
            [name]: formatDate(setHoursToZero(new Date(value)))
        }))
    }

    const filteredByDateTransaksi = () => {
        const from = setHoursToZero(new Date(dateInput.from))
        const to = setHoursToZero(new Date(dateInput.to))
        console.log(from)

        return transaksi.filter(t => setHoursToZero(new Date(t.tgl_transaksi)) >= from && setHoursToZero(new Date(t.tgl_transaksi)) <= to) 
    }

    console.log(dateInput)

    return (
        <>
            <Head>
                <title>Transaksi</title>
            </Head>
            <MainContainer>
                <Header title='Transaksi' subTitle='Daftar semua transaksi.' />
                <Section>
                    <input name='from' className='p-2 border rounded-md' type='date' value={dateInput.from} onChange={handleDateChange} />
                    {'  ─  '}
                    <input name='to' className='p-2 border rounded-md' type='date' value={dateInput.to} onChange={handleDateChange} />
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
                                <th className='py-2 border-2 border-white'>Tipe Bayar</th>
                                <th className='py-2 border-2 border-white'>Status Bayar</th>
                                <th className='py-2 border-2 border-white'>Tanggal Bayar</th>
                                <th className='py-2 border-2 border-white'>Alamat Kirim</th>
                                <th className='py-2 border-2 border-white'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredByDateTransaksi().map(({alamat_kirim,id_pelanggan,id_transaksi,nama_pelanggan,status_pembayaran, status_transaksi, tgl_bayar, tgl_transaksi, tipe_bayar}, index) => 
                              <tr key={index} className='bg-white'>
                                  <td className='py-1 px-2 border-2 text-center'>{id_transaksi}</td>
                                  {isAdmin && <td className='py-1 px-2 border-2 text-center'>{id_pelanggan}</td>}
                                  {isAdmin && <td className='py-1 px-2 border-2 '>{nama_pelanggan}</td>}
                                  <td className='py-1 px-2 border-2 text-center'>{new Date(tgl_transaksi).toLocaleDateString()}</td>
                                  <td className='py-1 px-2 border-2 text-center'>
                                      {isEdit && selecteIdTransaksi == id_transaksi ?
                                        <select name='status_transaksi' value={input.status_transaksi} onChange={handleChange} className='border rounded-lg border-black outline-none p-2'>
                                            <option value='proses'>proses</option>
                                            <option value='batal'>batal</option>
                                            <option value='selesai'>selesai</option>
                                        </select>
                                        :
                                        status_transaksi
                                      }
                                  </td>
                                  <td className='py-1 px-2 border-2 text-center'>{tipe_bayar}</td>
                                  <td className='py-1 px-2 border-2 text-center'>
                                      {isEdit && selecteIdTransaksi == id_transaksi ?
                                        <select name='status_pembayaran' value={input.status_pembayaran} onChange={handleChange} className='border rounded-lg border-black outline-none p-2'>
                                            <option value='belum dibayar'>belum dibayar</option>
                                            <option value='dibayar'>dibayar</option>
                                        </select>
                                        :
                                        status_pembayaran
                                      }
                                  </td>
                                  <td className='py-1 px-2 border-2 text-center'>{tgl_bayar ? new Date(tgl_bayar).toLocaleDateString() : '-'}</td>
                                  <td className='py-1 px-2 border-2 text-center'>
                                      {alamat_kirim ?
                                        <button className='bg-black text-white px-4 py-1 rounded-xl relative group'>
                                            Lihat
                                            <div className='absolute hidden group-focus:block top-full bg-white rounded-2xl text-black text-xs z-10 left-0 w-48 p-2 text-left cursor-text shadow-md'>
                                                {alamat_kirim}
                                            </div>
                                        </button>
                                        :
                                        '-'
                                      }
                                  </td>
                                  <td className='py-1 px-2 border-2 text-center'>
                                        <button className='bg-black text-white px-4 py-1 rounded-xl mr-2' onClick={() => handleDetailClick(id_transaksi)}>
                                            Detail
                                        </button>
                                        {isAdmin && 
                                            <>
                                            {isEdit && selecteIdTransaksi == id_transaksi ?
                                                <button className='bg-black text-white px-4 py-1 rounded-xl mr-2' onClick={() => handleSimpan(id_transaksi)}>
                                                    Simpan
                                                </button>
                                                :
                                                <button className='bg-black text-white px-4 py-1 rounded-xl mr-2' onClick={() => handleEditClick(id_transaksi)}>
                                                    <i className='icon-edit' />
                                                </button>
                                            }
                                            {isAdmin && <button className='bg-black text-white px-4 py-1 rounded-xl' onClick={() => handleDeleteClick(id_transaksi)}>
                                                <i className='icon-trash' />
                                            </button>}
                                            </>
                                        }
                                  </td>
                              </tr>
                            )}
                        </tbody>
                    </table>
                </Section>
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