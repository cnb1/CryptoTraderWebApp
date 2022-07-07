import React from "react";

class PriceSub extends React.Component{
    componentDidMount() {
        this.props.subscribeToPrice();
    }
}

export default PriceSub;