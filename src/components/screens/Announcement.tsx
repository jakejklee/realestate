import React, { Component } from 'react';
import { Button, Row, Col } from 'react-bootstrap'
import NavBar from '../nav/NavBar';
import { Link } from 'react-router-dom';

interface Props {
}
interface State {
}

class Announcement extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }

    private renderAnnouncement = () => {
        const announcementArr: any = [];
        for (let i = 0; i < 5; i++) {
            announcementArr.push(
                <Link key={'announcement' + i} to='' style={{ width: '100%', margin: 'auto', color: 'black', textDecoration: 'none', }}>
                    <Row style={{
                        borderBottom: i === 4 ? '0px' : '1px dotted black',
                        width: '100%', margin: 'auto', padding: '13px 0 13px 0px'
                    }}>
                        <Col style={{ fontSize: '13px' }}>
                            Announcement{i}
                        </Col>
                        <Col md='auto' style={{ fontSize: '11px', color: '#777777' }}>
                            July.24.2019
                </Col>
                    </Row>
                </Link>
            );
        }
        return announcementArr;
    }
    render() {
        return (
            <div style={{ width: '100%', minHeight: '100%', minWidth: '1160px', paddingTop: 86, background: '#f6f6f6' }}>
                <div style={{
                    borderBottom: '1px solid #e1e1e1',
                    background: 'white',
                    position: 'fixed',
                    left: 0,
                    right: 15,
                    top: 0,
                    zIndex: 1,
                    minWidth: '1180px'
                }}>
                    <NavBar
                        getMonthlyRentFee
                        renderMenu={0}
                        closeMenu={() => { }} />
                </div>
                <div id='bodyDiv' style={{}}>
                    <div style={{ width: 950, background: 'white', border: '1px solid #e1e1e1', margin: 'auto' }}>
                        <Row style={{
                            borderBottom: '2px solid black', width: '95%', margin: 'auto', padding: '20px 0 5px 0', color: '#666666',
                            fontWeight: 'bold'
                        }}>
                            Announcement
                        </Row>
                        <Row style={{ width: '95%', margin: 'auto' }}>
                            {/* <Link to='' style={{ width: '100%', margin: 'auto', color: 'black', textDecoration: 'none', }}>
                                <Row style={{
                                    width: '100%', margin: 'auto'
                                    , padding: '13px 0 13px 0px'
                                }}>
                                    <Col style={{ fontSize: '13px' }}>
                                        Announcement 0
                                </Col>
                                    <Col md='auto' style={{ fontSize: '11px', color: '#777777' }}>
                                        July.24.2019
                                </Col>
                                </Row>
                            </Link> */}
                            {this.renderAnnouncement()}
                            <Row style={{ borderTop: '1px solid black', height: 50, width: '100%', margin: 'auto' }}>

                            </Row>
                        </Row>
                    </div>
                </div>
            </div>
        );
    }
}
export default Announcement;