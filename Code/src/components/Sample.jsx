import React from 'react'
import Counter from './Counter'
import Timer from './Timer'
import Parent from './Parent'
import FakeCallAPI from './FakeCallAPI'
import Counter_hook from './Counter_hook'
import Counter_class from './Counter_class'

const Sample = (props) => {
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
            <br />
            <Counter_hook></Counter_hook>
            <br />
            <Counter_class></Counter_class>
        </div>
    )
}

export default Sample