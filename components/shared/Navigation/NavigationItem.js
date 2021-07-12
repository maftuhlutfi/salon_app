import Link from "next/link";
import { useRouter } from "next/router";

const NavigationItem = ({href, title, icon}) => {
    const isActive = useRouter().pathname == href

    return (
        <Link href={href}>
            <div className={`cursor-pointer flex items-center gap-6 text-lg py-3 px-8 w-48 whitespace-nowrap ${isActive ? 'bg-black text-white hover:bg-black hover:text-white' : 'hover:bg-gray-200'}`}>
                <i className={`${icon}`} />
                {title}
            </div>
        </Link>
    );
}
 
export default NavigationItem;