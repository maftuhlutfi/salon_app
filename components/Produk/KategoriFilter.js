import axios from "axios";
import { useEffect, useState } from "react";
import { getBearerToken } from "../utils/getToken";

const KategoriFilter = ({kategoriActive, setKategoriActive}) => {
    const [kategori, setKategori] = useState(null)
    const [show, setShow] = useState(false)

    useEffect(() => {
        const getKategori = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }

            const res = await axios.get('/api/kategori', config)
            const kategoriData = await res.data
            setKategori([{nama_kategori: 'Semua', id_kategori: 0}, ...kategoriData])
        }

        getKategori()
    }, [])

    const handleClick = () => {
        setShow(prev => !prev)
    }

    return (
        <button onClick={handleClick} className='px-4 py-2 relative rounded-lg border-2 border-black hover:bg-gray-400 flex gap-2 items-center'>
            <i className='icon-filter' />
            Filter kategori
            <div className={`absolute top-full bg-white overflow-hidden z-40 right-0 rounded-md shadow-md mt-1 ${show ? 'block' : 'hidden'}`}>
                {kategori && kategori.map(item => 
                    <p 
                        key={item.id_kategori} 
                        onClick={() => setKategoriActive(item.id_kategori)} 
                        className={`px-4 py-2 whitespace-nowrap hover:bg-black hover:text-white ${kategoriActive == item.id_kategori && 'bg-black text-white'}`}
                    >
                        {item.nama_kategori}
                    </p>
                )}
            </div>
        </button>
    );
}
 
export default KategoriFilter;