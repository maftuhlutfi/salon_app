const userReducer = (state, action) => {
    switch (action.type) {
        case "ADD_USER":
            return {
                user: action.payload
            }
        case "REMOVE_USER":
            return {
                user: null
            }
        default:
            return state;
    }
}

export default userReducer