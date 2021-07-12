import { createContext, useEffect, useReducer } from "react"
import userReducer from './userReducer'
import cartReducer from "./cartReducer"
import { addUser, removeUser } from "./userAction"
import { addItem, clearAllItem, clearItem, removeItem } from "./cartAction"

const initUserState = {
    user: null
}

const initCartState = {
    cartItems: []
}

export const UserContext = createContext(initUserState)
export const CartContext = createContext(initCartState)

const AllContextProvider = ({children}) => {
    const [userState, userDispatch] = useReducer(userReducer, initUserState)
    const [cartState, cartDispatch] = useReducer(cartReducer, initCartState)

    useEffect(() => {
        cartState.cartItems = JSON.parse(window.localStorage.getItem('cartItems')) || []
    }, [])

    useEffect(() => {
        window.localStorage.setItem('cartItems', JSON.stringify(cartState.cartItems))
    }, [cartState.cartItems])

    return (
        <UserContext.Provider value={{
            user: userState.user,
            addUser: data => userDispatch(addUser(data)),
            removeUser: () => userDispatch(removeUser())
        }}>
            <CartContext.Provider value={{
                cartItems: cartState.cartItems,
                addItem: data => cartDispatch(addItem(data)),
                removeItem: data => cartDispatch(removeItem(data)),
                clearItem: data => cartDispatch(clearItem(data)),
                clearAllItem: () => cartDispatch(clearAllItem())
            }}>
                {children}
            </CartContext.Provider>
        </UserContext.Provider>
    )
}

export default AllContextProvider