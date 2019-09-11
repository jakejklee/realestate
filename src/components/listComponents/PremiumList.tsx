import React, { Component } from 'react';
import { Button, Row, Col, Image, Card } from 'react-bootstrap';
import houseImg from '../images/listHouse.jpg';
import HomeModal from '../modal/HomeModal';
import _ from 'lodash';

interface Props {
    data: any;
    premiumID: any;
}
interface State {
    detailModal: boolean;
    houseData: any;
}

class PremiumList extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
            detailModal: false,
            houseData: [],
        }
    }

    private toggleModal = (data: any) => {

        this.setState({ houseData: data });
        this.setState({ detailModal: !this.state.detailModal });
    }

    private renderHouse = () => {
        const houseData = this.props.data;
        const houseArr: any = [];
        for (let i = 0; i < houseData.length; i++) {
            if (houseData[i].houseID === this.props.premiumID) {
                houseArr.push(
                    <div style={{ margin: '10px 0 0 10px', border: '1px solid #000000' }} onClick={() => { this.toggleModal(houseData[i]) }}>
                        <Row style={{
                            margin: '0px',
                        }}>
                            <div style={{ position: 'absolute', opacity: 0.5, background: 'black', color: 'white', padding: '4px 15px' }}>
                                PREMIUM LIST
                    </div>
                            <Image src={houseImg} width='100%' height='150px' >
                            </Image>
                        </Row>
                        <div style={{ padding: 10, borderBottom: '7px solid #000000' }}>
                            <Row>
                                <Col md='auto'>
                                    <h4>${houseData[i].housePrice}</h4>
                                </Col>
                                <Col md='auto' style={{ fontSize: 12, lineHeight: 3 }}>
                                    4bds
                        </Col>
                                <Col md='auto' style={{ fontSize: 12, lineHeight: 3 }}>
                                    2ba
                        </Col>
                                <Col md='auto' style={{ fontSize: 12, lineHeight: 3 }}>
                                    1,333sqft
                        </Col>
                            </Row>
                            <Row style={{}}>
                                <Col>
                                    {houseData[i].houseUnit ?
                                        <h6>{houseData[i].houseUnit} - {houseData[i].houseAddress.replace(', Canada', '')}</h6>
                                        :
                                        <h6>{houseData[i].houseAddress.replace(', Canada', '')}</h6>
                                    }
                                </Col>
                            </Row>
                            <Row style={{}}>
                                <Col>
                                    House for rent
                        </Col>
                            </Row>
                        </div>
                    </div>
                );
            }
        }
        return houseArr;
    }
    render() {
        const modalData = {
            modalHide: () => { this.toggleModal(false) },
            modalOpen: this.state.detailModal,
        }

        if (_.size(this.props.data) > 0) {
            const houseData = this.state.houseData;
            return (
                <div>
                    {this.renderHouse()}
                    <HomeModal
                        modalInfo={modalData}
                        houseInfo={houseData}
                    />
                </div>

            );
        } else {
            return (
                <div style={{ background: '#e2e2e2', textAlign: 'center', marginTop: window.innerHeight / 3 }}>
                    <p style={{ fontSize: 20, fontWeight: 'bolder' }}>Loading...</p>
                    {/* <p>Click a house to get detail data</p> */}
                </div>

            );
        }
        // return (
        // <div style={{ margin: '10px 0 0 10px', border: '1px solid #d8d8d8' }}>
        //     <Row style={{ margin: '0px' }}>
        //         <div style={{ position: 'absolute', opacity: 0.5, background: 'black', color: 'white', padding: '4px 15px' }}>
        //             2 days ago
        //         </div>
        //         <Image src={houseImg} width='100%' height='200px' >
        //         </Image>
        //     </Row>
        //     <div style={{ padding: 10, borderBottom:'7px solid #006AFF' }}>
        //         <Row>
        //             <Col md='auto'>
        //                 <h4>$259,950</h4>
        //             </Col>
        //             <Col md='auto' style={{ fontSize: 12, lineHeight: 3}}>
        //                 4bds
        //             </Col>
        //             <Col md='auto' style={{ fontSize: 12, lineHeight: 3 }}>
        //                 2ba
        //             </Col>
        //             <Col md='auto' style={{ fontSize: 12, lineHeight: 3 }}>
        //                 1,333sqft
        //             </Col>
        //         </Row>
        //         <Row style={{}}>
        //             <Col>
        //                 <h6>1234 Kingsway, Vancouver, BC</h6>
        //             </Col>
        //         </Row>

        //         <Row style={{}}>
        //             <Col>
        //                 House for sale
        //             </Col>
        //         </Row>
        //     </div>
        // </div>
        // );
    }
}
export default PremiumList;