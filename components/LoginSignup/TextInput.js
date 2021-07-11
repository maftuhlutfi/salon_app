const TextInput = ({id, label, ...props}) => {
    return (
        <>
            <label htmlFor={id} className='mb-0'>{label}</label>
            <input id={id} type='text' className='px-3 py-1.5 border border-gray-400 rounded-md focus:outline-none focus:ring focus:border-purple-400' {...props} />
        </>
    );
}
 
export default TextInput;