import { forwardRef } from 'react'

const Editor = forwardRef(({ handleChange }, ref) => {
    return (
        <div ref={ref} className="" onKeyUp={handleChange}/>
    )
})

export default Editor