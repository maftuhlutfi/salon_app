const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const dateNum = date.getDate()

    return `${year}-${month < 10 ? '0' + month : month}-${dateNum < 10 ? '0' + dateNum : dateNum}`
}

export default formatDate