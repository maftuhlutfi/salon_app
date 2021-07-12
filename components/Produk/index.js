import ProdukItem from "./ProdukItem";

const Produk = ({produk}) => {
    return (
        <div className='flex gap-8 flex-wrap'>
            {produk.map(item => 
                <ProdukItem key={item.id_produk} produk={item} />
            )}
        </div>
    );
}
 
export default Produk;