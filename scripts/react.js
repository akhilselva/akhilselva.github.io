// function tick() {
//     const element = (
//         <div id="time">
//             {new Date().toLocaleTimeString()}
//         </div>
//     );
//     ReactDOM.render(element, document.getElementById('react-root'));
// }

// setInterval(tick, 1000);



class Counter extends React.Component {

    add(currentCount) {
        this.setState({
            count: currentCount + 1,
            text:"0<"
        })
    }
    subtract(currentCount) {
        this.setState({
            count: currentCount - 1,
        })
    }

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
        }
    }
    render() {
        const count = this.state.count;
        const text=this.state.text

        return (
            <div>
                <h1>{count}</h1>
                <button onClick={() => this.subtract(count)}>-</button>
                <button onClick={() => this.add(count)}>+</button>
            </div>
        )
    }
}



ReactDOM.render(<Counter />, document.getElementById('react-root'))