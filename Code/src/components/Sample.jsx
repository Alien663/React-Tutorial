import React, { useState } from 'react'
import Counter from './Counter'
import Timer from './Timer'
import Parent from './Parent'
import FakeCallAPI from './FakeCallAPI'

const Sample =  (props) => {
    let testcomp = `<div>I'm Xenomorph</div>`

    return(
        <div>
            <Timer></Timer>
            <Counter></Counter>
            <br />
            <div>{testcomp}</div>
            <br />
            <FakeCallAPI></FakeCallAPI>
            <br />
            <Parent></Parent>
        </div>
    )
}

export default Sample