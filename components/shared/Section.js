const Section = ({children, ...props}) => {
    return (
        <div className='mt-8' {...props}>
            {children}
        </div>
    );
}
 
export default Section;