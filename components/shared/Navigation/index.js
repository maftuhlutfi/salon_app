import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "../Context";
import NavigationItem from "./NavigationItem";
import navList from "./navList";

const Navigation = () => {
    const {user} = useContext(UserContext)

    return (
        <div className='h-full fixed flex flex-col items-center bg-white py-8 shadow-xl'>
            <div className='w-20 h-10 relative'>
                <Image src='/logo.png' layout='fill' className='object-contain' />
            </div>
            <div className='flex flex-col mt-12'>
                {user && navList[user.role].map((item,index) => 
                    <NavigationItem key={index} {...item} />
                )}
            </div>
        </div>
    );
}
 
export default Navigation;