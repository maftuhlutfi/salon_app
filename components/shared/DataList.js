const DataList = ({children, label, id, ...props}) => {
    return (
        <>
            <label htmlFor={id} className='mb-0'>{label}</label>
            <input list={id+'s'} id={id} className='px-3 py-1.5 border border-gray-400 rounded-md focus:outline-none focus:ring focus:border-purple-400 disabled:bg-gray-200' {...props} />
            <datalist id={id+'s'}>
                {children}
            </datalist>
        </>
    );
}
 
export default DataList;