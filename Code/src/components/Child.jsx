import React, { useState } from 'react'
const Child = (props) => {
    const {Name} = props
    return(
        <div>Hello {Name}, I'm Child</div>
    )
}
export default Child