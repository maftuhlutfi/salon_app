import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import AddModal from "../components/Pelanggan/AddModal";
import { UserContext } from "../components/shared/Context";
import Header from "../components/shared/Header";
import MainContainer from "../components/shared/MainContainer";
import Section from "../components/shared/Section";
import DeleteModal from "../components/Pelanggan/DeleteModal";
import { getBearerToken } from "../components/utils/getToken";
import ProtectedPage from "../components/utils/ProtectedPage";

const Pelanggan = () => {
    const {user} = useContext(UserContext)
    const isAdmin = user.role == 'admin'

    const [pelanggan, setPelanggan] = useState([])
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(null)

    const router = useRouter()

    useEffect(() => {
        const getPelanggan = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }
            try {
                const res = await axios.get('/api/user/get-pelanggan', config)
                const data = await res.data
                setPelanggan(data)
            } catch (e) {
                console.log(e.response)
            }
        }

        getPelanggan()
    }, [])

    const handleDeleteClick = id => {
        setSelectedUserId(id)
        setShowDeleteModal(true)
    }

    if (!isAdmin) {
        return <MainContainer>
            <p className='text-center'>Kamu bukan admin.</p>
        </MainContainer>
    }

    console.log(pelanggan)

    return (
        <>
            <Head>
                <title>Pelanggan</title>
            </Head>
            <MainContainer>
                <Header title='Daftar Pelanggan' subTitle='Kelola semua pelanggan' />
                <Section>
                    <div className='flex justify-end'>
                        <button className='bg-black text-white px-4 py-2 rounded-xl mr-2 flex gap-2 items-center' style={{width: 'fit-content'}} onClick={() => setShowAddModal(true)}>
                            + Tambah Pelanggan
                        </button>
                    </div>
                </Section>
                <Section>
                    <table className='border-2 w-full'>
                        <thead>
                            <tr className='bg-black text-white'>
                                <th className='py-2 border-2 border-white'>Id</th>
                                <th className='py-2 border-2 border-white'>Nama</th>
                                <th className='py-2 border-2 border-white'>Email</th>
                                <th className='py-2 border-2 border-white'>Telepon</th>
                                <th className='py-2 border-2 border-white'>Alamat</th>
                                <th className='py-2 border-2 border-white'>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pelanggan.map(({id, nama, email, telepon, alamat}) => 
                                <tr key={id} className='bg-white'>
                                    <td className='py-1 px-2 border-2 text-center'>{id}</td>
                                    <td className='py-1 px-2 border-2'>{nama}</td>
                                    <td className='py-1 px-2 border-2'>{email}</td>
                                    <td className='py-1 px-2 border-2 text-center'>{telepon}</td>
                                    <td className='py-1 px-2 border-2'>{alamat}</td>
                                    <td className='py-1 px-2 border-2 text-center'>
                                        <button className='bg-black text-white px-4 py-1 rounded-xl' onClick={() => handleDeleteClick(id)}>
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
            />
            <DeleteModal 
                show={showDeleteModal}
                onCancel={() => setShowDeleteModal(false)}
                idUser={selectedUserId}
            />
        </>
    );
}
 
export default ProtectedPage(Pelanggan);