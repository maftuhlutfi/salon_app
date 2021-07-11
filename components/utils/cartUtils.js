export const addItemToCart = (cartItems, itemToAdd) => {
    const exist = cartItems.find(item => item.id === itemToAdd.id)

    if (exist) {
        return cartItems.map(cartItem => {
            return cartItem.id === itemToAdd.id ?
                { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        })
    } else {
        return [...cartItems, {...itemToAdd, quantity: 1}]
    }
}

export const removeItemFromCart = (cartItems, itemToRemove) => {
	const exists = cartItems.find(item => item.id === itemToRemove.id);

	if (exists.quantity === 1) {
		return cartItems.filter(cartItem => cartItem.id !== itemToRemove.id)
	}

	return cartItems.map(cartItem => 
		cartItem.id === itemToRemove.id ?
			{ ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
	)
}