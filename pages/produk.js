import Head from "next/head"
import { useContext } from "react"
import { UserContext } from "../components/shared/Context"
import MainContainer from "../components/shared/MainContainer"
import ProtectedPage from "../components/utils/ProtectedPage"

function Produk() {
    const {user} = useContext(UserContext)
    console.log(user)

    return (
        <>
            <Head>
                <title>Produk</title>
            </Head>
            <MainContainer>
                asdas
            </MainContainer>
        </>
    )
}

export default ProtectedPage(Produk)