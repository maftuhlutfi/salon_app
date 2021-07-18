import axios from "axios";
import { useEffect, useState } from "react";
import { getBearerToken } from "../utils/getToken";
import ProdukItem from "./ProdukItem";

const Produk = ({produk}) => {
    const [allKategori, setAllKategori] = useState([])

    useEffect(() => {
        const getKategori = async () => {
            const config = {
                headers: {
                    'Authorization': getBearerToken()
                }
            }

            const res = await axios.get('/api/kategori', config)
            const kategoriData = await res.data
            setAllKategori(kategoriData)
        }

        getKategori()
    }, [])

    return (
        <div className='flex gap-8 flex-wrap'>
            {produk.map(item => 
                <ProdukItem key={item.id_produk} produk={item} allKategori={allKategori} />
            )}
        </div>
    );
}
 
export default Produk;