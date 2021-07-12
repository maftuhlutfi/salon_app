const formatHarga = h => {
    const reverse = h.toString().split('').reverse().join('')
    return reverse.match(/\d{1,3}/g).join('.').split('').reverse().join('')
}

export default formatHarga