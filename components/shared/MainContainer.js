const MainContainer = ({children, ...props}) => {
    return (
        <div className='w-full min-h-screen bg-gray-100 pl-60 pr-12 py-12' {...props}>
            {children}
        </div>
    );
}
 
export default MainContainer;