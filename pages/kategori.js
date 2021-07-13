import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AddModal from "../components/Kategori/AddModal";
import { UserContext } from "../components/shared/Context";
import Header from "../components/shared/Header";
import MainContainer from "../components/shared/MainContainer";
import Section from "../components/shared/Section";
import DeleteModal from "../components/Kategori/DeleteModal";
import { getBearerToken } from "../components/utils/getToken";
import ProtectedPage from "../components/utils/ProtectedPage";
import EditModal from "../components/Kategori/EditModal";

const KategoriPage = () => {
    const {user} = useContext(UserContext)
    const isAdmin = user.role == 'admin'

    const [kategori, setKategori] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedKategoriId, setSelectedKategoriId] = useState(null)

    const router = useRouter()

    useEffect(() => {
        const getKategori = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }
            try {
                const res = await axios.get('/api/kategori', config)
                const data = await res.data
                setKategori(data)
            } catch (e) {
                console.log(e.response)
            }
        }

        getKategori()
    }, [])

    const handleDeleteClick = id => {
        setSelectedKategoriId(id)
        setShowDeleteModal(true)
    }

    const handleEditClick = id => {
        setSelectedKategoriId(id)
        setShowEditModal(true)
    }

    if (!isAdmin) {
        return <MainContainer>
            <p className='text-center'>Kamu bukan admin.</p>
        </MainContainer>
    }

    return (
        <>
            <Head>
                <title>Kategori</title>
            </Head>
            <MainContainer>
                <Header title='Daftar Kategori' subTitle='Kelola semua kategori produk' />
                <Section>
                    <div className='flex justify-end'>
                        <button className='bg-black text-white px-4 py-2 rounded-xl mr-2 flex gap-2 items-center' style={{width: 'fit-content'}} onClick={() => setShowAddModal(true)}>
                            + Tambah Kategori
                        </button>
                    </div>
                </Section>
                <Section>
                    <table className='border-2 w-full'>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th className='py-2 border-2 border-white'>Id</th>
                                <th className='py-2 border-2 border-white'>Nama</th>
                                <th className='py-2 border-2 border-white'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kategori.map(({id_kategori, nama_kategori}) => 
                                <tr key={id_kategori} className='bg-white'>
                                    <td className='py-1 px-2 border-2 text-center'>{id_kategori}</td>
                                    <td className='py-1 px-2 border-2'>{nama_kategori}</td>
                                    <td className='py-1 px-2 border-2 text-center w-48'>
                                        <button className='bg-black text-white px-4 py-1 rounded-xl mr-2' onClick={() => handleEditClick(id_kategori)}>
                                            <i className='icon-edit' />
                                        </button>
                                        <button className='bg-black text-white px-4 py-1 rounded-xl' onClick={() => handleDeleteClick(id_kategori)}>
                                            <i className='icon-trash' />
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </Section>
            </MainContainer>
            <AddModal 
                show={showAddModal}
                onCancel={() => setShowAddModal(false)}
                newId={kategori.length ? kategori[kategori.length - 1].id_kategori + 1 : 0}
            />
            <EditModal 
                show={showEditModal}
                onCancel={() => setShowEditModal(false)}
                id={selectedKategoriId}
                nama={kategori.length && selectedKategoriId ? kategori.find(k => k.id_kategori == selectedKategoriId).nama_kategori : ''}
            />
            <DeleteModal 
                show={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                idKategori={selectedKategoriId}
            />
        </>
    );
}
 
export default ProtectedPage(KategoriPage);