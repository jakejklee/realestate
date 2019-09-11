import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PremiumList from './PremiumList';
import NormalList from './NormalList';

interface Props {
}
interface State {
}

class List extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }
    private renderPremiumList = () => {
        // const listArr = []
        for (let i = 0; i < 2; i++) {
            // listArr.push(<PremiumList
            // data></PremiumList>)
        }
        // return listArr;
    }

    render() {
        return (
            <div id='listContainer' style={{ height: '100%' }}>
                <div id='listTop'>
                    Home List near this area
                </div>
                <div id='listBody' style={{overflowY:'auto'}}>
                    <div id='listPremium' >
                        {this.renderPremiumList()}
                        {/* <PremiumList></PremiumList> */}
                    </div>
                    <div id='listNormal'>
                        {/* <NormalList></NormalList> */}
                    </div>
                </div>

            </div>
        );
    }
}
export default List;