import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const NavigationItem = ({href, title, icon, subMenu}) => {
    const router = useRouter()
    const isActive = router.pathname.includes(href)
    const [showDrop, setShowDrop] = useState(false)

    useEffect(() => {
        if (isActive) {
            setShowDrop(true)
        } else {
            setShowDrop(false)
        }
    }, [router])

    const handleClick = () => {
        if (subMenu) {
            setShowDrop(prev => !prev)
            return
        }
        router.push(href)
    }

    return (
        <>
            <div onClick={handleClick} className={`cursor-pointer flex items-center gap-6 text-lg py-3 px-8 w-48 whitespace-nowrap ${isActive ? 'bg-black text-white hover:bg-black hover:text-white' : 'hover:bg-gray-200'}`}>
                <i className={`${icon}`} />
                {title}
            </div>
            {subMenu && showDrop &&
                subMenu.map((menu, index) => 
                    <Link href={menu.href} key={index}>
                        <p className={`text-lg py-2 px-8 pl-20 cursor-pointer ${router.pathname.includes(menu.href) ? 'bg-gray-400' : 'bg-gray-200'}`}>{menu.title}</p>
                    </Link>
                )
            }
        </>
    );
}
 
export default NavigationItem;