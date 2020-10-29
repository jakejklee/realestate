import React, { Component } from 'react';
import { Container, Row, Col, Modal, Button, Image, Form } from 'react-bootstrap';
import Cards from 'react-credit-cards';
import 'react-credit-cards/es/styles-compiled.css'
import firebase from '../../firebase/firebase';

interface Props {
    houseAddress: any;
    houseLocation: any;
    houseUnit: any;
    housePrice: any;
    houseType: any;
    resetHouse: any;
}
interface State {
    cardNumber: any;
    cardName: any;
    cardExpireDate: any;
    cardCVC: any;
    bidAmount: any;
    currBid: any;
    focused: any;
}
const primaryColor = '#1a9bd7';
const monthArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
class PaymentPage extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
            cardNumber: '',
            cardName: '',
            cardExpireDate: '',
            cardCVC: '',
            bidAmount: '',
            currBid: '',
            focused: '',
        }
    }

    componentDidMount = () => {
        firebase.firestore().collection('bidding').doc('biddingDetail').get()
            .then((result) => {
                const data = result.data();
                if (data) {
                    this.setState({ currBid: data.bidAmount, bidAmount: parseInt(data.bidAmount) + 50 })
                }
            });

    }

    private renderPeriod = () => {
        const currentDay = new Date();
        const today = new Date();
        // const firstDay = 8 + 7 - 0;
        const firstDay = currentDay.getDate() + 7 - currentDay.getDay();
        const lastDay = firstDay + 6;
        const firstData = new Date(currentDay.setDate(firstDay));
        const lastData = new Date(currentDay.setDate(lastDay));

        if (today.getDay() == 0) {
            firebase.firestore().collection('bidding').doc('biddingDetail').get()
                .then((result) => {
                    const biddingData = result.data();
                    if (biddingData) {
                        if (biddingData.bidAmount > 0 && biddingData.isReset === false) {
                            const bidValue = 0
                            firebase.firestore().collection('bidding').doc('biddingDetail')
                                .update({
                                    bidAmount: bidValue,
                                    isReset: true,
                                })
                            this.setState({ currBid: bidValue });
                        }
                    }
                })
        } else {
            firebase.firestore().collection('bidding').doc('biddingDetail')
                .update({
                    isReset: false,
                })
        }

        return (
            <Form.Label>

                {monthArr[firstData.getMonth()] + ' ' + (firstData.getDate() + 1) + ', ' + firstData.getFullYear() +
                    ' ~ ' + monthArr[lastData.getMonth()] + ' ' + (lastData.getDate() + 1) + ', ' + lastData.getFullYear() +
                    ' Highest bid (' + this.state.currBid + 'CAD)'}
            </Form.Label>
        );
    }
    private numberHandleChange = (value: any) => {
        this.setState({ cardNumber: value });
    }
    private nameHandleChange = (value: any) => {
        this.setState({ cardName: value });
    }
    private dateHandleChange = (value: any) => {
        this.setState({ cardExpireDate: value });
    }
    private cvcHandleChange = (value: any) => {
        this.setState({ cardCVC: value });
    }
    private bidHandleChange = (value: any) => {
        this.setState({ bidAmount: value });
    }
    private handleInputFocus = (target: any) => {
        this.setState({
            focused: target.name,
        });
    };

    private addPremium = () => {
        if (this.props.houseType === 'rent') {
            firebase.firestore().collection('rent').add({
                houseAddress: this.props.houseAddress,
                houseLocation: this.props.houseLocation,
                houseUnit: this.props.houseUnit,
                housePrice: this.props.housePrice,
            })
                .then((result) => {
                    firebase.firestore().collection('bidding').doc('biddingDetail')
                        .update({
                            cardNumber: this.state.cardNumber,
                            cardName: this.state.cardName,
                            cardExpireDate: this.state.cardExpireDate,
                            cardCVC: this.state.cardCVC,
                            bidAmount: this.state.bidAmount,
                            homeID: result.id,
                            // isReset: false
                        })
                    this.setState({ cardNumber: '', cardName: '', cardExpireDate: '', cardCVC: '', });
                    this.props.resetHouse();
                }).catch((e) => {
                    console.log(e)
                })

        } else {
            firebase.firestore().collection('buying').add({
                houseAddress: this.props.houseAddress,
                houseLocation: this.props.houseLocation,
                houseUnit: this.props.houseUnit,
                housePrice: this.props.housePrice,
            })
                .then((result) => {
                    console.log(result);
                }).catch((e) => {
                    console.log(e)
                })
        }
    }

    render() {
        return (
            <div>
                <Form>
                    <Form.Group controlId="periodSelect">
                        <Form.Label>Premium period</Form.Label>
                        {this.renderPeriod()}
                    </Form.Group>
                    <Form.Group controlId="paymentInfo">
                        <Form.Label>Payment information</Form.Label>
                        <Cards
                            number={this.state.cardNumber}
                            name={this.state.cardName}
                            expiry={this.state.cardExpireDate}
                            cvc={this.state.cardCVC}
                            focused={this.state.focused} />
                        <Form.Label style={{ marginTop: 10 }}>Card Number</Form.Label>
                        <Form.Control placeholder="Number" type='number'
                            name='number'
                            onChange={(e: any) => { this.numberHandleChange(e.target.value) }}
                            onFocus={(e: any) => { this.handleInputFocus(e.target) }}>
                        </Form.Control>
                        <Form.Label>Cardholder Name</Form.Label>
                        <Form.Control placeholder="Name"
                            name='name'
                            onChange={(e: any) => { this.nameHandleChange(e.target.value) }}
                            onFocus={(e: any) => { this.handleInputFocus(e.target) }}>
                        </Form.Control>
                        <Form.Label>Expire date</Form.Label>
                        <Form.Control placeholder="MMYY" type='tel' maxLength={4}
                            name='expiry'
                            onChange={(e: any) => { this.dateHandleChange(e.target.value) }}
                            onFocus={(e: any) => { this.handleInputFocus(e.target) }}></Form.Control>
                        <Form.Label>CVC</Form.Label>
                        <Form.Control placeholder="CVC" type='tel'
                            name='cvc'
                            onFocus={(e: any) => { this.handleInputFocus(e.target) }}
                            onChange={(e: any) => { this.cvcHandleChange(e.target.value) }} maxLength={3}></Form.Control>
                        <Form.Label>Amount you want to bid</Form.Label>
                        <Form.Control type='number' value={this.state.bidAmount}
                            onChange={(e: any) => { this.bidHandleChange(e.target.value) }}></Form.Control>
                    </Form.Group>
                    {this.props.houseAddress && this.props.houseLocation &&
                        this.props.housePrice && this.state.cardNumber &&
                        this.state.cardName && this.state.cardExpireDate && this.state.cardCVC &&
                        this.state.bidAmount > this.state.currBid ?
                        <Button variant="primary" onClick={() => { this.addPremium() }}>
                            Submit
                        </Button>
                        :
                        <Button variant="primary" disabled>
                            Submit
                    </Button>

                    }
                </Form>
            </div>
        );
    }
}
export default PaymentPage;