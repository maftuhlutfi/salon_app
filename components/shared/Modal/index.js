const Modal = ({children, show, style}) => {
    return (
        <div className={`w-screen h-screen bg-black bg-opacity-70 fixed top-0 left-0 z-40 ${show ? 'block' : 'hidden'}`}>
            <div className={`w-1/3 bg-white rounded-2xl px-12 py-8 absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2  ${style}`} style={{height: 'fit-content'}}>
                {children}
            </div>
        </div>
    );
}
 
export default Modal;