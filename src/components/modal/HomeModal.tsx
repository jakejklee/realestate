import React, { Component } from 'react';
import { Container, Row, Col, Modal, Button, Image } from 'react-bootstrap';
import houseImg from '../images/listHouse.jpg';
import './HomeModal.css'

interface Props {
    modalInfo: any;
    houseInfo: any;
}
interface State {
}
const primaryColor = '#1a9bd7';
class HomeModal extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }
    private renderHouseImg = () => {
        const imageArr = []
        for (let i = 0; i < 6; i++) {
            imageArr.push(
                <Row style={{ margin: 0, borderTop: '4px solid white' }}>
                    <Col style={{ padding: 0, borderRight: '4px solid white' }}>
                        <Image src={houseImg} width='100%' height='100%'>
                        </Image>
                    </Col>
                    <Col style={{ padding: 0 }}>
                        <Image src={houseImg} width='100%' height='100%'>

                        </Image>
                    </Col>
                </Row>
            )
        }
        return imageArr;
    }

    render() {
        const modalData = this.props.modalInfo;
        const houseData = this.props.houseInfo;
        const infoHeight = window.innerHeight * 0.95 - 250;
        let infoWidth;
        if (window.innerWidth > 1393) {
            infoWidth = 1386 * 0.34;
        } else if (window.innerWidth >= 1200) {
            infoWidth = window.innerWidth * 0.33;
        } else if (window.innerWidth >= 1054) {
            infoWidth = window.innerWidth * 0.39;

        } else {
            infoWidth = window.innerWidth * 0.38;

        }
        const infoStyle = { height: 20, fontSize: 14, borderRight: '1px solid', marginTop: 15, paddingRight: 7 }
        const selectedNavOptionStyle = {
            color: primaryColor, borderBottom: '3px solid',
            borderColor: primaryColor, padding: '16px 8px'
        }
        const navOptionStyle = {
            borderBottom: '3px solid #e1e1e1', padding: '16px 8px', cursor: 'pointer'
        }
        const infoStyleLast = { height: 20, fontSize: 14, marginTop: 15, paddingRight: 7 }
        const infoRowStyle = { height: '15vh', margin: '0 4%' }
        const infoColStyle = { padding: '15px 35px', margin: 'auto', borderBottom: '1px solid #e1e1e1' }

        return (
            <Modal
                show={modalData.modalOpen}
                onHide={() => modalData.modalHide()}
                // size='90vh'
                style={{ overflow: 'hidden', }}
                dialogClassName='detailModal'
                onClick={() => { console.log('click') }}
            // aria-labelledby='example-custom-modal-styling-title'
            >
                {/* <div> */}
                <Row style={{ margin: 0, overflow: 'hidden', height: '95vh' }}>
                    <Col xs={window.innerWidth < 1200 ? 6 : 7}
                        style={{ width: '100%', padding: 0, margin: 0, height: '95vh', overflowY: 'scroll', overflowX: 'hidden' }}>
                        <Row style={{ width: '100%', margin: 0 }}>
                            <Image src={houseImg} width='100%' height='100%' style={{ margin: 'auto' }}></Image>
                        </Row>
                        {this.renderHouseImg()}
                    </Col>
                    <Col style={{ padding: 0, height: '95vh' }}>
                        <div style={{ position: 'absolute', height: 250, width: '100%', borderBottom: '1px solid #e1e1e1' }}>
                            <Row style={{ borderBottom: '1px solid #e1e1e1', width: '96%', margin: 'auto', }}>
                                <Col md='auto' style={{ padding: 0 }}>
                                    {/* <Image src='https://firebasestorage.googleapis.com/v0/b/eeum-home.appspot.com/o/renieLogo.png?alt=media&token=123066fd-9887-410d-b4d4-09e87b2f7672'
                                        height='50px' style={{ padding: '5px 0', margin: 5 }}>
                                    </Image> */}
                                    <Col md='auto'>
                                        <Row style={{ textAlign: 'center' }}>
                                            <Col>
                                                COMPANY
                                            </Col>
                                        </Row>
                                        <Row style={{ textAlign: 'center' }}>
                                            <Col>
                                                LOGO
                                            </Col>
                                        </Row>
                                    </Col>
                                </Col>
                                <Col>
                                    <Row style={{ float: 'right', lineHeight: '50px', color: primaryColor, fontWeight: 'bold' }}>
                                        <Col md='auto' style={{ cursor: 'pointer' }}>Save</Col>
                                        <Col md='auto' style={{ cursor: 'pointer' }}>Share</Col>
                                        <Col md='auto' style={{ cursor: 'pointer' }}>More</Col>
                                        <Col md='auto' style={{
                                            cursor: 'pointer', border: '1px solid',
                                            height: 40, marginTop: 7, lineHeight: '40px', borderRadius: 5
                                        }}
                                            onClick={() => modalData.modalHide()}>X</Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ padding: 10 }}>
                                <Col md='auto' style={{ fontSize: 30 }}>C${houseData.housePrice}</Col>
                                <Col md='auto' style={infoStyle}>2 bd</Col>
                                <Col md='auto' style={infoStyle}>3 ba</Col>
                                <Col md='auto' style={infoStyleLast}>1,205 sqft</Col>
                            </Row>
                            <Row style={{ paddingLeft: 10 }}>
                                <Col md='auto'>
                                    {houseData.houseUnit ?
                                        <div>{houseData.houseUnit} - {houseData.houseAddress}</div>
                                        :
                                        <div>{houseData.houseAddress}</div>
                                    }
                                </Col>
                            </Row>
                            <Row style={{ paddingLeft: 10 }}>
                                <Col>
                                    For rent
                                </Col>
                            </Row>
                            <Row style={{ paddingTop: 10, margin: 'auto' }}>
                                <Col>
                                    <Button style={{ width: '100%', padding: 10, fontWeight: 'bold', background: primaryColor, border: 0 }}> Contact Agent</Button>
                                </Col>
                            </Row>
                        </div>
                        <div style={{ margin: 0, padding: 0, marginTop: 250, height: infoHeight, overflowY: 'scroll', overflowX: 'hidden', }}>
                            <Row style={{}}>
                                <Col>
                                    <nav className='navClass' style={{
                                        overflowX: 'auto', overflowY: 'hidden', padding: '15px 0', margin: 'auto', width: infoWidth,
                                        borderBottom: '1px solid #e1e1e1'
                                    }}>
                                        <a style={selectedNavOptionStyle}>Overview</a>
                                        <a style={navOptionStyle}>
                                            Features</a>
                                        <a style={navOptionStyle}>
                                            Neighborhood</a>
                                        <a style={navOptionStyle}>
                                            Price&nbsp;History</a>
                                        <a style={navOptionStyle}>
                                            Contact&nbsp;Info</a>
                                    </nav>
                                </Col>
                            </Row>
                            <Row style={infoRowStyle}>
                                <Col style={infoColStyle}>
                                    This is Overview
                                </Col>
                            </Row>
                            <Row style={infoRowStyle}>
                                <Col style={infoColStyle}>
                                    This is Features
                                </Col>
                            </Row>
                            <Row style={infoRowStyle}>
                                <Col style={infoColStyle}>
                                    This is Neighborhood
                                </Col>
                            </Row>
                            <Row style={infoRowStyle}>
                                <Col style={infoColStyle}>
                                    This is Price history
                                </Col>
                            </Row>
                            <Row style={infoRowStyle}>
                                <Col style={infoColStyle}>
                                    This is Contact Info
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                {/* </div> */}

            </Modal>
        );
    }
}
export default HomeModal;