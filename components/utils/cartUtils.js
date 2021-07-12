export const addItemToCart = (cartItems, itemToAdd) => {
    const exist = cartItems.find(item => item.id_produk === itemToAdd.id_produk)

    if (exist) {
        return cartItems.map(cartItem => {
            return cartItem.id_produk === itemToAdd.id_produk ?
                { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        })
    } else {
        return [...cartItems, {...itemToAdd, quantity: 1}]
    }
}

export const removeItemFromCart = (cartItems, itemToRemove) => {
	const exists = cartItems.find(item => item.id_produk === itemToRemove.id_produk);

	if (exists.quantity === 1) {
		return cartItems.filter(cartItem => cartItem.id_produk !== itemToRemove.id_produk)
	}

	return cartItems.map(cartItem => 
		cartItem.id_produk === itemToRemove.id_produk ?
			{ ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
	)
}