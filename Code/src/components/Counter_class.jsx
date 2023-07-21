import React from "react";

class Counter extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            counts: 0
        }
    }

    componentDidMount() {
        document.title = `You clicked ${this.state.counts} times`;
    }

    componentDidUpdate() {
        document.title = `You clicked ${this.state.counts} times`;
    }

    render(){
        return(
            <div>
                <div>Click Times : {this.state.counts}</div>
                <button onClick={() => this.setState({ counts: this.state.counts + 1})}>Plus One</button>
            </div>
        )
    }
}

export default Counter