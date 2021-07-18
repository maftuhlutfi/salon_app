import Image from 'next/image'
import { useContext, useState } from 'react';
import { CartContext, UserContext } from '../shared/Context';
import formatHarga from '../utils/formatHarga'
import DeleteModal from './DeleteModal';
import EditModal from './EditModal';

const ProdukItem = ({produk, allKategori}) => { 
    const {user} = useContext(UserContext)
    const {addItem, cartItems} = useContext(CartContext)

    const {nama_produk, gambar_produk, harga_jual, qty, deskripsi, terjual} = produk

    const [showEditModal, setShowEditModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    
    const [showDeskripsi, setShowDeskripsi] = useState(false)

    const handleAddToCart = () => {
        if (qty <= 0) {
            alert('Produk habis.')
        }
        addItem(produk)
    }

    return (
        <div className='w-48 group rounded-2xl bg-white shadow-md overflow-hidden relative' style={{height: 'fit-content'}}>
            <div className='relative w-full h-48'>
                <Image src={`/uploads/produk/${gambar_produk}`} layout='fill' className='object-cover object-center' />
            </div>
            <div className='p-4'>
                <p className='truncate'>{nama_produk}</p>
                <p className='font-bold text-lg mt-1'>Rp. {formatHarga(harga_jual)}</p>
                <p className='mt-1 text-gray-500'>Terjual {terjual ? terjual : 0}</p>
                {user && user.role == 'admin' && <p className='mt-1 text-gray-500'>Stok {qty}</p>}
                <button className='focus:outline-none relative group border-2 border-black text-center py-1.5 mt-4 hover:bg-gray-200 rounded-md w-full'>
                    Deskripsi
                    <p className='text-sm absolute z-10 top-full p-2 rounded-md border hidden border-black mt-2 bg-black text-white group-focus:block'>{deskripsi}</p>
                </button>
                <button onClick={handleAddToCart} className='focus:outline-none bg-black text-white text-center py-2 mt-2 rounded-md w-full'>
                    + Keranjang
                </button>
            </div>
            {user && user.role == 'admin' &&
                <div className='absolute z-10 top-16 left-1/2 transform -translate-x-1/2 text-lg rounded-xl shadow-md bg-white hidden group-hover:flex overflow-hidden'>
                    <button className='pl-4 pr-2 py-2 hover:bg-black hover:text-white' onClick={() => setShowEditModal(true)}>
                        <i className='icon-edit' />
                    </button>
                    <button className='pr-4 pl-2 py-2 hover:bg-black hover:text-white' onClick={() => setShowDeleteModal(true)}>
                        <i className='icon-trash' />
                    </button>
                </div>
            }
            <DeleteModal 
                idProduk={produk ? produk.id_produk : null}
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onCancel={() => setShowDeleteModal(false)} 
            />
            <EditModal 
                produk={produk}
                show={showEditModal}
                allKategori={allKategori}
                onClose={() => setShowEditModal(false)}
                onCancel={() => setShowEditModal(false)}
            />
        </div>
    );
}
 
export default ProdukItem;