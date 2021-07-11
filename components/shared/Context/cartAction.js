export const addItem = item => ({
    type: 'ADD_ITEM_TO_CART',
    payload: item
})

export const removeItem = item => ({
    type: 'REMOVE_ITEM_FROM_CART',
    payload: item
})

export const clearItem = item => ({
    type: 'CLEAR_ITEM_FROM_CART',
    payload: item
})