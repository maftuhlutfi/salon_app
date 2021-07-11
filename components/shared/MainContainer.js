const MainContainer = ({children}) => {
    return (
        <div className='w-full min-h-screen bg-gray-100 pl-60 pr-12 py-12'>
            {children}
        </div>
    );
}
 
export default MainContainer;