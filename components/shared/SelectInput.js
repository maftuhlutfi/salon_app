const SelectInput = ({children, id, label, ...props}) => {
    return (
        <>
            <label htmlFor={id} className='mb-0'>{label}</label>
            <select id={id} className='px-3 py-1.5 border border-gray-400 rounded-md focus:outline-none focus:ring focus:border-purple-400 disabled:bg-gray-200' {...props}>
                {children}
            </select>
        </>
    );
}
 
export default SelectInput;