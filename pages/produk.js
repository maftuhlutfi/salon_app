import axios from "axios"
import Head from "next/head"
import { useContext, useEffect, useState } from "react"
import Produk from "../components/Produk"
import AddModal from "../components/Produk/AddModal"
import KategoriFilter from "../components/Produk/KategoriFilter"
import { UserContext } from "../components/shared/Context"
import Header from "../components/shared/Header"
import MainContainer from "../components/shared/MainContainer"
import Section from "../components/shared/Section"
import { getBearerToken } from "../components/utils/getToken"
import ProtectedPage from "../components/utils/ProtectedPage"

function ProdukPage() {
    const {user} = useContext(UserContext)
    const [produk, setProduk] = useState(null)
    const [kategoriActive, setKategoriActive] = useState(0)

    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        const getProduk = async () => {
            const config = {
                headers: {
                'Authorization': getBearerToken()
                }
            }
            try {
                const res = await axios.get('/api/produk', config)
                const data = await res.data
                setProduk(data)
            } catch (e) {
                console.log(e.response)
            }
        }
        getProduk()
    }, [])

    const getFilteredProduk = () => {
        return kategoriActive ? produk.filter(p => p.kategori == kategoriActive) : produk
    }
    
    return (
        <>
            <Head>
                <title>Produk</title>
            </Head>
            <MainContainer>
                <Header title='Produk' subTitle='Pilih produk sesuai keinginan' />
                <Section> 
                    <div className='flex justify-end gap-6'>
                        {user && user.role == 'admin' &&
                            <button onClick={() => setShowAddModal(true)} className='bg-black text-white px-4 py-2 rounded-lg'>
                                + Tambah Produk
                            </button>
                        }
                        <KategoriFilter 
                            kategoriActive={kategoriActive}
                            setKategoriActive={setKategoriActive}
                        />
                    </div>
                </Section>
                <Section>
                    {produk ?
                        <Produk produk={getFilteredProduk()} />
                        :
                        <svg className="animate-spin h-8 w-8 text-white relative m-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx={12} cy={12} r={10} stroke="#555555" strokeWidth={4} />
                            <path className="opacity-75" fill="#000" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                    }
                </Section>
            </MainContainer>
            <AddModal 
                show={showAddModal}
                onCancel={() => setShowAddModal(false)}
                idProduk={produk ? produk[produk.length-1].id_produk + 1 : 0}
            />
        </>
    )
}

export default ProtectedPage(ProdukPage)