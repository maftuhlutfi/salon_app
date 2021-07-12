import { useContext, useState } from "react";
import Cart from "./Cart"
import { UserContext } from "./Context";

const Header = ({title, subTitle}) => {
    const {user} = useContext(UserContext)

    const [drop, setDrop] = useState(false)

    return (
        <div className='w-full flex items-center justify-between'>
            <div>
                <h1 className='text-3xl font-bold mb-2'>{title}</h1>
                <p>{subTitle}</p>
            </div>
            <div className='flex gap-4 items-center'>
                <Cart />
                {user && 
                    <div onClick={() => setDrop(prev => !prev)} className='py-2 px-4 border-2 flex items-center gap-3 relative rounded-lg bg-black text-white cursor-pointer'>
                        {user.nama}
                        <div className={`w-2 h-2 border-white border-b-2 border-r-2 rotate-45 transition-all ease-in ${drop && 'border-b-0 border-t-2 mt-2 -rotate-45'}`} />
                        <div className={`absolute top-full mt-2 right-0 z-50 px-4 py-2 text-black rounded-xl bg-white border-2 border-black ${!drop && 'hidden'}`}>
                            Logout
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}
 
export default Header;