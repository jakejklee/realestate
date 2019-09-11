import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

interface Props {
}
interface State {
}

class MobileHome extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const screenHeight = window.innerHeight;
        return (
            <div style={{ height: '100%' }}>
                <div>
                    <h6 style={{ textAlign: 'center', paddingTop: 20 }}>What kind of home are you looking for?</h6>

                </div>
                <div style={{ marginTop: 50 }}>
                    <div style={{
                        border: '1px solid black', width: '80%', height: window.innerHeight / 3,
                        margin: 'auto', textAlign: 'center', borderRadius: 10
                    }}>
                    <Link to='/map/rent/condo' style={{ color:'black' }}>        
                        <label style={{ lineHeight: screenHeight / 160, fontSize: 50 }}>
                            Condos
                        </label>
                            </Link>
                    </div>
                    <div style={{
                        border: '1px solid black', width: '80%', height: window.innerHeight / 3,
                        margin: 'auto', textAlign: 'center', borderRadius: 10, marginTop: 20
                    }}>
                        <Link to='/map/rent/house' style={{ color:'black' }}>        
                        <label style={{ lineHeight: screenHeight / 160, fontSize: 50 }}>
                            Houses
                        </label>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
export default MobileHome;