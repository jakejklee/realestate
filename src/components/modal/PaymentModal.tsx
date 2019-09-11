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
class PaymentModal extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
        }
    }


    render() {
        const currentDay = new Date();
        const modalData = this.props.modalInfo;
        const houseData = this.props.houseInfo;

        return (
            <Modal
                show={modalData.modalOpen}
                onHide={() => modalData.modalHide()}>
                {currentDay}
            </Modal>
        );
    }
}
export default PaymentModal;