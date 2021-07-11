export const getBearerToken = () => {
    const authToken = window.localStorage.getItem('authToken')

    if (authToken) {
        return 'Bearer ' + authToken
    } else {
        return null
    }
}

export const getAuthToken = () => {
    return window.localStorage.authToken
}