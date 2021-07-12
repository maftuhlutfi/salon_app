import Image from "next/image";
import { useContext, useEffect, useRef, useState } from "react";
import formatHarga from "../../utils/formatHarga";
import { CartContext } from "../Context";
import AddTransaksiModal from "./AddTransaksiModal";

const Cart = () => {
    const {addItem, removeItem, clearItem, cartItems} = useContext(CartContext)
    const totalItem = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0)

    const node = useRef()

    useEffect(() => {
        document.addEventListener("click", handleClick);

        return () => {
          document.removeEventListener("click", handleClick);
        };
      }, [])

    const [showCartList, setShowCartList] = useState(false)
    const [showTransaksiModal, setShowTransaksiModal] = useState(false)

    const handleClick = e => {
        if (node.current.contains(e.target)) {
          return;
        }
        
        setShowCartList(false)
      }

    const handleRemove = cartItem => {
        removeItem(cartItem)
    }

    const handleAdd = cartItem => {
        addItem(cartItem)
    }

    const handleClear = cartItem => {
        clearItem(cartItem)
    }

    return (
        <>
            <div ref={node} className='relative flex hover:bg-gray-200 rounded-lg cursor-pointer'>
                <i className='icon-cart text-2xl py-2 px-4' onClick={() => setShowCartList(prev => !prev)} />
                <div className={`w-5 h-4 absolute top-1 right-2 flex items-center justify-center text-xs bg-red-500 rounded-full text-white ${totalItem == 0 && 'hidden'}`}>
                    {totalItem < 10 ? totalItem : '9+'}
                </div>
                <div className={`absolute top-full flex flex-col items-center bg-white w-72 py-4 right-0 rounded-2xl shadow-lg z-40 cursor-default ${showCartList ? 'block' : 'hidden'}`}>
                    {cartItems.length ?
                        <>
                            <div className='flex flex-col max-h-64 overflow-y-auto w-full'>
                                {cartItems.map((cartItem, index) => 
                                    <div key={index} className='px-4 py-3 flex items-start'>
                                        <div className='relative group w-1/4 flex-shrink-0 mr-2 h-16'>
                                            <Image src={`/uploads/produk/${cartItem.gambar_produk}`} layout='fill' className='object-contain object-center' />
                                            <i className='icon-trash cursor-pointer hidden group-hover:flex 
                                                bg-black inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 items-center justify-center rounded-md absolute z-10 text-white' 
                                                onClick={() => handleClear(cartItem)}
                                            />
                                        </div>
                                        <div className='overflow-x-hidden flex flex-col gap-2'>
                                            <p className='truncate text-sm'>{cartItem.nama_produk}</p>
                                            <div className='flex mt-1 items-center'>
                                                <p className='px-2 bg-black text-white rounded-l-md cursor-pointer' onClick={() => handleRemove(cartItem)}>-</p>
                                                <p className='px-2 bg-gray-200'>{cartItem.quantity}</p>
                                                <p className='px-2 bg-black text-white rounded-r-md cursor-pointer' onClick={() => handleAdd(cartItem)}>+</p>
                                                <p className='text-sm ml-2 font-medium'>Rp. {formatHarga(cartItem.harga_jual * cartItem.quantity)}</p>
                                            </div>
                                        </div>
                                    </div>    
                                )}
                            </div>
                            <div className='flex justify-between w-full px-8 mt-6 mb-2'>
                                <p>Total:</p>
                                <p className='font-bold'>Rp. {formatHarga(cartItems.reduce((total, cartItem) => total + cartItem.harga_jual * cartItem.quantity, 0))}</p>
                            </div>
                            <button className='mx-auto relative mt-4 py-3 bg-black text-center text-white px-8 rounded-xl' onClick={() => setShowTransaksiModal(true)}>
                                Checkout
                            </button>
                        </>
                        :
                        <p>Tidak ada item.</p>
                    }
                </div>
            </div>
            <AddTransaksiModal 
                show={showTransaksiModal}
                onCancel={() => setShowTransaksiModal(false)}
            />
        </>
    );
}
 
export default Cart;