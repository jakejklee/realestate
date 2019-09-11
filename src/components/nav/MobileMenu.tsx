import React, { Component } from 'react';
import { Row, Col, Image, } from 'react-bootstrap';
import _ from 'lodash';
import { smart } from '@babel/template';

interface Props {
    user: any,
    logout: any,
    login: any,
    smart: any,
}
interface State {
}
const primaryColor = '#1a9bd7';
class MobileMenu extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <div style={{ height: '10%', background: primaryColor }}>
                <Row style={{ color: 'white', padding: '5%' }}>
                    <Col style={{ fontSize: 20, fontWeight: 'bolder' }}>RENIE</Col>
                    {_.size(this.props.user) > 0 ?
                        <Col style={{ textAlign: 'right' }} onClick={() => { this.props.logout() }}>LOGOUT</Col>
                        :
                        <Col style={{ textAlign: 'right' }} onClick={() => { this.props.login() }}>LOGIN</Col>}

                </Row>
                {_.size(this.props.user) > 0  ?
                    <div style={{ padding: 20, borderBottom: '1px solid #d7d7d7', width: '100%' }}
                        onClick={() => { this.props.smart() }}>
                        SMART MATCHING
                    </div>
                    : null}
            </div>

        );
    }
}
export default MobileMenu;