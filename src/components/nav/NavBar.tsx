import React from 'react';
import { Row, Col, Image, Modal, Button, Alert, Form, ModalDialog } from 'react-bootstrap'
import './NavBar.css'
import { Link } from 'react-router-dom';
import firebase from '../../firebase/firebase';
import MobileMenu from './MobileMenu';
import _ from 'lodash';
import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import { GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { auth } from 'firebase';
import PaymentPage from '../payPage/PaymentPage';


const apiKey = 'AIzaSyDs3KaoDDiQEKvBtBquB5LFvuEG5JwPjOg';
const primaryColor = '#1a9bd7';
// const rentCode = 'C8JikTqPx1GLtatNtcUf';
// const buyCode = 'MmDU3yErW4KCUFYZQVrP';

interface Props {
    google: any,
    getMonthlyRentFee: any,
    renderMenu: number,
    closeMenu: any,
}
interface State {
    userInfo: any;
    condoRental: boolean;
    houseRental: boolean;
    buyingCondo: boolean;
    buyingHouse: boolean;
    loginModal: boolean;
    emailAddress: string;
    password: string;
    signInOrSignUp: boolean;
    logOutDiv: boolean;
    errorAlert: boolean;
    googleLogin: boolean;
    addingModal: boolean;
    smartModal: boolean;
    address: string;
    houseLocation: any;
    loading: boolean;
    housePrice: string;
    houseType: string;
    houseUnit: string;
    income: number;
    expense: number;
    isPremium: boolean;
    isMobile: boolean;
    menuWidth: number;
    paymentModal: boolean;
}

class NavBar extends React.Component<Props, State> {
    public state: State;
    constructor(props: Props) {
        super(props);
        this.state = {
            userInfo: {},
            condoRental: false,
            houseRental: false,
            buyingCondo: false,
            buyingHouse: false,
            loginModal: false,
            emailAddress: '',
            password: '',
            signInOrSignUp: true,
            logOutDiv: false,
            errorAlert: false,
            googleLogin: false,
            addingModal: false,
            smartModal: false,
            address: '',
            houseLocation: {
                lat: 0,
                lng: 0,
            },
            loading: true,
            housePrice: '',
            houseType: 'rent',
            houseUnit: '',
            income: 0,
            expense: 0,
            isPremium: false,
            isMobile: false,
            menuWidth: 0,
            paymentModal: false,
            // screenHeight
        }
    }

    public componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                console.log(user);
                this.setState({ userInfo: user });
            } else {
                console.log('please login')
            }
        });

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.setState({ menuWidth: this.props.renderMenu });
    }

    private resize() {
        let currentHideNav = (window.innerWidth <= 800);
        // let currentHeight = window.innerHeight;
        if (currentHideNav !== this.state.isMobile) {
            this.setState({ isMobile: currentHideNav });
        }
        // this.setState({ screenHeight: currentHeight });
    }

    private signIn = (email: string, password: string) => {
        this.setState({ errorAlert: false });
        firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
            console.log('Login success');
            this.setState({ emailAddress: '' });
            this.setState({ password: '' });
            this.setState({ loginModal: false });
        }).catch((error: any) => {
            console.log(error);
            // this.setState({ loginModal: false });
            this.setState({ errorAlert: true });
        });
    }
    private signOut = () => {
        firebase.auth().signOut().then((user) => {
            this.setState({ userInfo: {} });
            this.setState({ logOutDiv: false });
        }).catch((error) => {
            console.log(error);
        })
    }
    private signUp = (email: string, password: string) => {
        const currentTime = new Date();
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                if (authUser.user) {
                    firebase.firestore().collection('users').doc(authUser.user.uid)
                        .set(
                            {
                                createdAt: currentTime,
                                userEmail: authUser.user.email,
                                monthlyIncome: 0,
                                monthlyExpense: 0,
                                userType: true,
                            }
                        );
                }
                this.setState({ emailAddress: '' });
                this.setState({ password: '' });
                this.setState({ loginModal: false });
                firebase.auth().signInWithEmailAndPassword(email, password).then((result) => {
                    console.log(result);
                    console.log('sign up success');
                });
            })
            .catch((error) => {
                console.log(error);
            })
    }

    private renderSignUpOrSignIn = () => {
        // if (_.size(this.state.userInfo)! > 0) {
        this.setState({ signInOrSignUp: !this.state.signInOrSignUp });
        // }
    }

    private resetInput = () => {
        this.setState({
            addingModal: false, address: '',
            houseLocation: { lat: 0, lng: 0, }, houseUnit: '', housePrice: ''
        });
    }

    private addHouseInfo = () => {
        if (this.state.houseType === 'rent') {
            firebase.firestore().collection('rent').add({
                houseAddress: this.state.address,
                houseLocation: this.state.houseLocation,
                houseUnit: this.state.houseUnit,
                housePrice: this.state.housePrice,
            })
                .then((result) => {
                    console.log(result);
                    this.resetInput();
                }).catch((e) => {
                    console.log(e)
                })

        } else {
            firebase.firestore().collection('buying').add({
                houseAddress: this.state.address,
                houseLocation: this.state.houseLocation,
                houseUnit: this.state.houseUnit,
                housePrice: this.state.housePrice,
            })
                .then((result) => {
                    console.log(result);
                    this.resetInput();
                }).catch((e) => {
                    console.log(e)
                })
        }
    }

    private renderSubMenu = (type: string, isEnter: boolean) => {
        if (type === 'condoRental') {
            this.setState({ condoRental: isEnter })
        } else if (type === 'houseRental') {
            this.setState({ houseRental: isEnter })

        }
        else if (type === 'buyingCondo') {
            this.setState({ buyingCondo: isEnter })

        }
        else if (type === 'buyingHouse') {
            this.setState({ buyingHouse: isEnter })
        }
        // type === 'rent' ?
        //     isEnter ?
        //         this.setState({ condoRental: isEnter })
        //         :
        //         this.setState({ condoRental: isEnter })
        //     :
        //     isEnter ?
        //         this.setState({ houseRental: isEnter })
        //         :
        //         this.setState({ houseRental: isEnter })
    }

    private renderModal = () => {
        if (_.size(this.state.userInfo) < 1) {
            this.setState({ loginModal: !this.state.loginModal });
        }
    }

    private emailHandleChange(email: string) {
        this.setState({ emailAddress: email });
    }
    private unitHandleChange(unit: string) {
        this.setState({ houseUnit: unit });
    }
    private priceHandleChange(price: string) {
        this.setState({ housePrice: price });
    }
    private typeHandleChange(type: string) {
        this.setState({ houseType: type });
    }
    private premiumHandleChange(type: boolean) {
        this.setState({ isPremium: type });
    }

    private handleChange = (address: any) => {
        this.setState({ address });
    };

    private handleSelect = (address: any) => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng =>
                this.setState({ houseLocation: { lat: latLng.lat, lng: latLng.lng }, loading: false }))
            .catch(error => console.error('Error', error));
    };

    private pwHandleChange(password: string) {
        this.setState({ password: password });
    }

    private renderLogOut = () => {
        if (_.size(this.state.userInfo) > 0) {
            this.state.logOutDiv ?
                this.setState({ logOutDiv: false })
                :
                this.setState({ logOutDiv: true })
        }
    }

    private responseFacebook = (response: any) => {
        auth().signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(({ user }) => {
                console.log(user);
                this.setState({ loginModal: false });
            })
    }

    private responseGoogle = (response: any) => {
        firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .then((result) => {
                console.log(result);
                this.setState({ loginModal: false });
            }).catch((error) => {
                console.log(error);
            })
    }

    private addData = () => {
        if (this.state.userInfo.email === 'master@renie.com') {
            this.setState({ addingModal: true });
        }
    }

    private incomeHandleChange = (income: number) => {
        this.setState({ income: income });
    }

    private expenseHandleChange = (expense: number) => {
        this.setState({ expense: expense });
    }

    private renderSmartMatching = () => {
        this.setState({ smartModal: false });
        const monthlyRentFee = this.state.income - this.state.expense;
        this.props.getMonthlyRentFee(monthlyRentFee);
    }



    private closeMenu = () => {
        this.props.closeMenu();
    }

    render() {
        let userData;
        let condoRental = 'none';
        let houseRental = 'none';
        let logOutDiv = 'none';

        const searchOptions = {
            componentRestrictions: { country: ['ca'] }
        };

        if (this.state.logOutDiv) {
            logOutDiv = 'inline'
        } else {
            logOutDiv = 'none'
        }

        if (_.size(this.state.userInfo) > 0) {
            userData = this.state.userInfo.email;
        } else {
            userData = 'Sign in or join';
        }

        if (this.state.condoRental) {
            condoRental = 'inline';
        } else {
            condoRental = 'none';
        }

        if (this.state.houseRental) {
            houseRental = 'inline';
        } else {
            houseRental = 'none';
        }

        if (this.state.isMobile) {
            return (
                <div className='sidenav' style={{
                    width: this.props.renderMenu, position: 'absolute',
                    visibility: this.props.renderMenu === 0 ? 'hidden' : 'visible',
                    border: '1px solid #d7d7d7',
                    marginLeft: window.innerWidth * 0.15 - window.innerWidth,
                    height: '100%',
                    zIndex: 1,
                    background: 'white'
                }}>
                    <div style={{
                        position: 'absolute', border: '1px solid #d7d7d7', padding: '10px 20px',
                        marginLeft: -53, background: '#ffffff', marginTop: 1
                    }} onClick={() => { this.closeMenu() }}>
                        X
                    </div>
                    <MobileMenu
                        user={this.state.userInfo}
                        logout={() => { this.signOut() }}
                        login={() => { this.setState({ loginModal: true }) }}
                        smart={() => { this.setState({ smartModal: true }) }} />

                    <Modal
                        // size="sm"
                        show={this.state.loginModal}
                        onHide={() => this.renderModal()}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-sm">
                                Welcome to Renie<br></br>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={this.state.emailAddress}
                                    onChange={(e: any) => { this.emailHandleChange(e.target.value) }} />
                                {/* <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text> */}
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={this.state.password}
                                    onChange={(e: any) => { this.pwHandleChange(e.target.value) }} />
                            </Form.Group>
                            {/* <Form.Group controlId="formBasicChecbox">
                                <Form.Check type="checkbox" label="Check me out" />
                            </Form.Group> */}
                            <Modal.Footer>

                                <Button variant="primary" type="submit" style={{ background: primaryColor, border: primaryColor }}
                                    onClick={() => { this.signIn(this.state.emailAddress, this.state.password) }}>
                                    SIGN IN
                            </Button>
                            </Modal.Footer>
                        </Modal.Body>
                    </Modal>

                    <Modal
                        // size="sm"
                        show={this.state.smartModal}
                        onHide={() => this.setState({ smartModal: false })}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-sm">
                                Smart Matching<br></br>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {/* <Form> */}
                            <Form.Group controlId="formGridIncome">
                                <Form.Label>Monthly Income</Form.Label>
                                <Form.Control type='number' placeholder="Enter monthly income" onChange={(e: any) => { this.incomeHandleChange(e.target.value) }} />
                            </Form.Group>

                            <Form.Group controlId="formGridExpense">
                                <Form.Label>Monthly Expense</Form.Label>
                                <Form.Control type='number' placeholder="Enter monthly expense" onChange={(e: any) => { this.expenseHandleChange(e.target.value) }} />
                            </Form.Group>

                            {/* <Form.Group controlId="formGridState">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as="select" onChange={(e: any) => { this.typeHandleChange(e.target.value) }}>
                                        <option>Rent</option>
                                        <option>Sell</option>
                                    </Form.Control>
                                </Form.Group> */}
                            <Modal.Footer>
                                <Button variant="primary" type="submit" style={{ background: primaryColor, border: primaryColor }}
                                    onClick={() => { this.renderSmartMatching() }}>
                                    Submit
                                </Button>
                            </Modal.Footer>
                            {/* </Form> */}
                        </Modal.Body>
                    </Modal>
                </div>
            );
        } else {
            return (
                <Row style={{
                    position: 'relative',
                    padding: '5px 20px 0 10px',
                }}>
                    <Col md='auto'>
                        <Row>
                            <Col md='auto'>
                                <Link to='/' style={{ height: 40 }}>
                                    <Image src='https://firebasestorage.googleapis.com/v0/b/eeum-home.appspot.com/o/renieLogo.png?alt=media&token=123066fd-9887-410d-b4d4-09e87b2f7672'
                                        style={{ height: 40 }} />
                                </Link>
                            </Col>
                            <Col md='auto' style={{ height: '100%', marginLeft: '25px', cursor: 'pointer', textAlign: 'center', }}
                                onMouseEnter={() => this.renderSubMenu('condoRental', true)}
                                onMouseLeave={() => this.renderSubMenu('condoRental', false)}
                                onMouseMove={() => this.renderSubMenu('condoRental', true)}
                            >
                                <Link to='/map/rent/condo' style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    height: 50,
                                    lineHeight: '50px',
                                    color: this.state.condoRental ? primaryColor : 'black',
                                    fontWeight: 600,
                                    fontSize: 15
                                }}>
                                    {/* <a style={{
                            display: 'block',
                            textDecoration: 'none',
                            height: '65px',
                            lineHeight: '65px',
                            color: this.state.condoRental ? 'orange' : 'black',
                        }}>
                        </a> */}
                                    CONDO RENTAL
                    </Link>
                                <div style={{
                                    // display: condoRental,
                                    display: 'none',
                                    position: 'absolute',
                                    border: '1px solid #e1e1e1',
                                    padding: '15px',
                                    marginLeft: '-70px',
                                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0)',
                                    zIndex: 1,
                                    background: '#ffffff',
                                    textAlign: 'left',
                                }}>
                                    <a>Apartments</a><br></br>
                                    <a>Condos</a><br></br>
                                    <a>Houses</a><br></br>
                                    <a>Town Houses</a><br></br>
                                    <a>Duplexes</a><br></br>
                                </div>
                            </Col>
                            <Col md='auto'
                                onMouseEnter={() => this.renderSubMenu('houseRental', true)}
                                onMouseLeave={() => this.renderSubMenu('houseRental', false)}
                                onMouseMove={() => this.renderSubMenu('houseRental', true)}
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                            >
                                <Link to='/map/rent/house' style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    height: 50,
                                    lineHeight: '50px',
                                    color: this.state.houseRental ? primaryColor : 'black',
                                    fontWeight: 600,
                                    fontSize: 15
                                }}>
                                    {/* <a href='/map' style={{
                            display: 'block',
                            textDecoration: 'none',
                            height: '65px',
                            lineHeight: '65px',
                            color: this.state.houseRental ? 'orange' : 'black'
                        }}>
                            Buying</a> */}
                                    HOUSE RENTAL
                    </Link>
                                <div style={{
                                    // display: houseRental,
                                    display: 'none',
                                    position: 'absolute',
                                    border: '1px solid #e1e1e1',
                                    padding: '15px',
                                    marginLeft: '-70px',
                                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0)',
                                    zIndex: 1,
                                    background: '#ffffff',
                                    textAlign: 'left'
                                }}>
                                    <a>Apartments</a><br></br>
                                    <a>Condos</a><br></br>
                                    <a>Houses</a><br></br>
                                    <a>Town Houses</a><br></br>
                                    <a>Duplexes</a><br></br>
                                </div>

                            </Col>
                            <Col md='auto'
                                onMouseEnter={() => this.renderSubMenu('buyingCondo', true)}
                                onMouseLeave={() => this.renderSubMenu('buyingCondo', false)}
                                onMouseMove={() => this.renderSubMenu('buyingCondo', true)}
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                            >
                                <Link to='/map/buy/condo' style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    height: 50,
                                    lineHeight: '50px',
                                    color: this.state.buyingCondo ? primaryColor : 'black',
                                    fontWeight: 600,
                                    fontSize: 15
                                }}>
                                    {/* <a href='/map' style={{
                            display: 'block',
                            textDecoration: 'none',
                            height: '65px',
                            lineHeight: '65px',
                            color: this.state.houseRental ? 'orange' : 'black'
                        }}>
                            Buying</a> */}
                                    BUYING CONDO
                    </Link>
                                <div style={{
                                    // display: houseRental,
                                    display: 'none',
                                    position: 'absolute',
                                    border: '1px solid #e1e1e1',
                                    padding: '15px',
                                    marginLeft: '-70px',
                                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0)',
                                    zIndex: 1,
                                    background: '#ffffff',
                                    textAlign: 'left'
                                }}>
                                    <a>Apartments</a><br></br>
                                    <a>Condos</a><br></br>
                                    <a>Houses</a><br></br>
                                    <a>Town Houses</a><br></br>
                                    <a>Duplexes</a><br></br>
                                </div>

                            </Col>
                            <Col md='auto'
                                onMouseEnter={() => this.renderSubMenu('buyingHouse', true)}
                                onMouseLeave={() => this.renderSubMenu('buyingHouse', false)}
                                onMouseMove={() => this.renderSubMenu('buyingHouse', true)}
                                style={{ cursor: 'pointer', textAlign: 'center' }}
                            >
                                <Link to='/map/buy/house' style={{
                                    display: 'block',
                                    textDecoration: 'none',
                                    height: 50,
                                    lineHeight: '50px',
                                    color: this.state.buyingHouse ? primaryColor : 'black',
                                    fontWeight: 600,
                                    fontSize: 15
                                }}>
                                    {/* <a href='/map' style={{
                            display: 'block',
                            textDecoration: 'none',
                            height: '65px',
                            lineHeight: '65px',
                            color: this.state.houseRental ? 'orange' : 'black'
                        }}>
                            Buying</a> */}
                                    BUYING HOUSE
                    </Link>
                                <div style={{
                                    // display: houseRental,
                                    display: 'none',
                                    position: 'absolute',
                                    border: '1px solid #e1e1e1',
                                    padding: '15px',
                                    marginLeft: '-70px',
                                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0)',
                                    zIndex: 1,
                                    background: '#ffffff',
                                    textAlign: 'left'
                                }}>
                                    <a>Apartments</a><br></br>
                                    <a>Condos</a><br></br>
                                    <a>Houses</a><br></br>
                                    <a>Town Houses</a><br></br>
                                    <a>Duplexes</a><br></br>
                                </div>

                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{ float: 'right' }}>
                            <Col md='auto' style={{ lineHeight: '50px', fontSize: '12px', textAlign: 'right' }}
                            // onMouseEnter={() => { this.renderLogOut() }}
                            // onMouseLeave={() => { this.renderLogOut() }}
                            // onMouseMove={() => { this.renderLogOut() }}
                            >
                                <div id='userInfo' onClick={() => { this.renderModal(); this.setState({ signInOrSignUp: true }) }}
                                    style={{ cursor: 'pointer', fontWeight: 600 }}
                                >{_.size(this.state.userInfo) > 0 ? null : 'LOG IN'}</div>
                            </Col>

                            <Col md='auto' style={{ lineHeight: '50px', fontSize: '12px', textAlign: 'right' }}
                                onMouseEnter={() => { this.renderLogOut() }}
                                onMouseLeave={() => { this.renderLogOut() }}>
                                <div id='userInfo' onClick={() => { this.renderModal(); this.setState({ signInOrSignUp: false }) }}
                                    style={{ cursor: 'pointer', fontWeight: 600 }}
                                >{_.size(this.state.userInfo) > 0 ? userData : 'SIGN UP'}</div>
                                <div style={{
                                    display: logOutDiv,
                                    position: 'absolute',
                                    border: '1px solid #e1e1e1',
                                    padding: '0 10px',
                                    // marginRight: 20,
                                    // marginTop: 65,
                                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0)',
                                    zIndex: 1,
                                    background: '#ffffff',
                                    textAlign: 'center',
                                    right: 0,
                                    width: 120
                                }}>
                                    <div id='smartDiv'
                                        onClick={() => { this.setState({ smartModal: true }) }}

                                    >
                                        {/* <div style={{
                                        display: logOutDiv,
                                        position: 'absolute',
                                        border: '1px solid #e1e1e1',
                                        padding: '0 2px',
                                        // marginRight: 20,
                                        // marginTop: 65,
                                        boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0)',
                                        zIndex: 1,
                                        background: '#ffffff',
                                        textAlign: 'center',
                                        right: 0,
                                        width: 10
                                    }}> */}
                                        Smart matching
                                    </div>
                                    <div id='logoutDiv'
                                        onMouseMove={() => { this.setState({ logOutDiv: true }) }}
                                        onClick={() => { this.signOut() }}
                                    >
                                        Sign out
                            </div>
                                </div>
                            </Col>

                            <Col md='auto'>
                                <div style={{
                                    background: primaryColor,
                                    width: '200px',
                                    height: '40px',
                                    lineHeight: '40px',
                                    // marginTop: '15px',
                                    borderRadius: 15,
                                    textAlign: 'center',
                                    color: '#ffffff',
                                    float: 'right',
                                    marginTop: 2.5
                                }} onClick={() => { this.addData() }}>AGENT SIGN UP</div>
                                {/* }} >AGENT SIGN UP</div> */}
                            </Col>
                        </Row>
                    </Col>
                    {this.state.addingModal ?
                        <Modal
                            // size="sm"
                            show={this.state.addingModal}
                            onHide={() => this.setState({ addingModal: false, isPremium:false })}
                            aria-labelledby="example-modal-sizes-title-sm"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-sm">
                                    Welcome to Renie<br></br>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formGridEmail">
                                        <Form.Label>Address</Form.Label>

                                        <PlacesAutocomplete
                                            value={this.state.address}
                                            onChange={this.handleChange}
                                            onSelect={this.handleSelect}
                                            searchOptions={searchOptions}
                                        >
                                            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                                <div>
                                                    <input
                                                        {...getInputProps({
                                                            placeholder: 'Enter address ...',
                                                            className: 'location-search-input',
                                                        })}
                                                        autoComplete="off"
                                                        style={{
                                                            height: 38,
                                                            padding: '0.375rem 0.75rem',
                                                            fontSize: '1rem',
                                                            fontWeight: 400,
                                                            lineHeight: 1.5,
                                                            color: '#495057',
                                                            border: '1px solid #ced4da',
                                                            // boxSizing: 'border-box',
                                                            width: '100%',
                                                            // outline: 0,
                                                            // fontSize: '16px',
                                                            // color: '#757575',
                                                            borderRadius: '0.25rem',
                                                        }}
                                                    />
                                                    <div className='autocomplete-dropdown-container'>
                                                        {loading && <div>Loading...</div>}
                                                        {suggestions.map(suggestion => {
                                                            const className = suggestion.active
                                                                ? 'suggestion-item--active'
                                                                : 'suggestion-item';
                                                            const style = suggestion.active
                                                                ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                                                : { backgroundColor: '#ffffff', cursor: 'pointer' };
                                                            return (
                                                                <div
                                                                    {...getSuggestionItemProps(suggestion, {
                                                                        className,
                                                                        style,
                                                                    })}>
                                                                    <span>{suggestion.description}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                        </PlacesAutocomplete>
                                    </Form.Group>

                                    <Form.Group controlId="formGridAddress2">
                                        <Form.Label>Unit # (optional)</Form.Label>
                                        <Form.Control placeholder="Enter unit number" onChange={(e: any) => { this.unitHandleChange(e.target.value) }} />
                                    </Form.Group>

                                    <Form.Group controlId="formGridAddress1">
                                        <Form.Label>Price</Form.Label>
                                        <Form.Control placeholder="Enter price" onChange={(e: any) => { this.priceHandleChange(e.target.value) }} />
                                    </Form.Group>

                                    <Form.Group controlId="formGridState">
                                        <Form.Label>Type</Form.Label>
                                        <Form.Control as="select" onChange={(e: any) => { this.typeHandleChange(e.target.value) }}>
                                            <option>Rent</option>
                                            <option>Sell</option>
                                        </Form.Control>
                                    </Form.Group>

                                    {this.state.isPremium ?
                                        <PaymentPage
                                            houseAddress={this.state.address}
                                            houseLocation={this.state.houseLocation}
                                            houseUnit={this.state.houseUnit}
                                            housePrice={this.state.housePrice}
                                            houseType={this.state.houseType}
                                            resetHouse={() => { this.resetInput() }}
                                        />
                                        :
                                        null
                                    }
                                    <Form.Group controlId="formBasicCheckbox">
                                        <Form.Check type="checkbox" label="Premium List"
                                            onChange={(e: any) => { this.premiumHandleChange(e.target.checked) }} />
                                    </Form.Group>
                                    {!this.state.isPremium ?
                                        this.state.housePrice && this.state.houseType && this.state.address ?
                                            <Button variant="primary"
                                                onClick={() => {
                                                    this.addHouseInfo()
                                                }}>
                                                Submit
                                        </Button>
                                            :
                                            <Button variant="primary"
                                                disabled>
                                                Submit
                                        </Button>
                                        : null}
                                </Form>

                            </Modal.Body>
                        </Modal>
                        : null
                    }
                    {this.state.smartModal ?
                        <Modal
                            // size="sm"
                            show={this.state.smartModal}
                            onHide={() => this.setState({ smartModal: false })}
                            aria-labelledby="example-modal-sizes-title-sm"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-sm">
                                    Smart Matching<br></br>
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Group controlId="formGridIncome">
                                        <Form.Label>Monthly Income</Form.Label>
                                        <Form.Control type='number' placeholder="Enter monthly income" onChange={(e: any) => { this.incomeHandleChange(e.target.value) }} />
                                    </Form.Group>

                                    <Form.Group controlId="formGridExpense">
                                        <Form.Label>Monthly Expense</Form.Label>
                                        <Form.Control type='number' placeholder="Enter monthly expense" onChange={(e: any) => { this.expenseHandleChange(e.target.value) }} />
                                    </Form.Group>

                                    {/* <Form.Group controlId="formGridState">
                                    <Form.Label>Type</Form.Label>
                                    <Form.Control as="select" onChange={(e: any) => { this.typeHandleChange(e.target.value) }}>
                                        <option>Rent</option>
                                        <option>Sell</option>
                                    </Form.Control>
                                </Form.Group> */}
                                    <Button variant="primary" onClick={() => { this.renderSmartMatching() }}>
                                        Submit
                                </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>
                        : null}
                    <Modal
                        // size="sm"
                        show={this.state.loginModal}
                        onHide={() => this.renderModal()}
                        aria-labelledby="example-modal-sizes-title-sm"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-sm">
                                Welcome to Renie<br></br>
                            </Modal.Title>
                        </Modal.Header>


                        {this.state.signInOrSignUp ?
                            <Modal.Body>
                                <div style={{}}>
                                    <label id='signInLabel' style={{ fontSize: 17, borderBottom: '2px solid #007bff', marginRight: 10, marginBottom: 20, color: '#007bff' }}
                                        onClick={() => { this.renderSignUpOrSignIn() }}>Sign in</label>
                                    <label id='signUpLabel' style={{ fontSize: 17 }} onClick={() => { this.renderSignUpOrSignIn() }}>New account</label>
                                </div>
                                <input style={{
                                    width: '100%', height: 40, marginBottom: 10, border: this.state.errorAlert ? '1px inset #FF5A50' : '1px solid #e1e1e1',
                                    background: this.state.errorAlert ? '#ffe3e1' : 'white'
                                }}
                                    id="inputEmail"
                                    autoComplete="off"
                                    // onFocus={() => { this.renderErrorMsg() }}
                                    type="email"
                                    value={this.state.emailAddress}
                                    name="email"
                                    placeholder="Enter email"
                                    required
                                    onChange={(e) => { this.emailHandleChange(e.target.value) }}
                                />
                                <Alert style={{ padding: 0, marginBottom: 10, fontSize: 13, color: '#FF5A50' }} show={this.state.errorAlert}>
                                    <div>
                                        Enter a vaild email address
                        {/* <Button variant='success' onClick={() => { this.setState({ errorAlert: false }) }}>close</Button> */}
                                    </div>
                                </Alert>
                                <input style={{ width: '100%', marginBottom: 15, height: 40 }}
                                    id="inputPassword"
                                    autoComplete="off"
                                    // onFocus={() => { this.renderErrorMsg() }}
                                    type="password"
                                    value={this.state.password}
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    onChange={(e) => { this.pwHandleChange(e.target.value) }}
                                />
                                <Alert show={this.state.errorAlert}>
                                    <div>
                                        check email
                        {/* <Button variant='success' onClick={() => { this.setState({ errorAlert: false }) }}>close</Button> */}
                                    </div>
                                </Alert>
                                <Row style={{
                                    margin: 'auto',
                                    borderBottom: '1px solid #e1e1e1',
                                    paddingBottom: 15,
                                    marginBottom: 15
                                }}>
                                    <Button style={{ width: '50%' }}
                                        onClick={() => { this.signIn(this.state.emailAddress, this.state.password) }}>Sign in</Button>
                                    <Link to='' style={{ marginLeft: 20 }}>Forgot your password?</Link>
                                </Row>
                                <Row style={{ margin: 'auto' }}>
                                    <div style={{ margin: 'auto' }}>
                                        <label style={{ marginTop: 5 }}>Or connect with:</label>
                                        <div style={{ float: 'right' }}>
                                            <FacebookLogin
                                                buttonStyle={{
                                                    borderRadius: 20,
                                                    height: 35,
                                                    width: 35,
                                                    paddingLeft: 8,
                                                    paddingTop: 4,
                                                    fontSize: 25,
                                                    marginLeft: 10,
                                                    border: '1px solid #e1e1e1'
                                                }}
                                                appId='694882060963422' //APP ID NOT CREATED YET
                                                fields="name,email"
                                                callback={(response) => this.responseFacebook(response)}
                                                icon='fa-facebook'
                                                textButton=''
                                            />
                                        </div>
                                        {/* <GoogleLogin
                                    // onRequest={() => this.setState({googleLogin:true})}
                                    clientId="155851174099-c94do4j37q47afpav3v2qusnn04m0uvs.apps.googleusercontent.com"
                                    buttonText='Login'
                                    onSuccess={(response)=>this.responseGoogle(response)}
                                    onFailure={(response)=>this.responseGoogle(response)}
                                    cookiePolicy={'single_host_origin'}
                                >
                                </GoogleLogin> */}
                                    </div>
                                </Row>

                            </Modal.Body>
                            :
                            <Modal.Body>
                                <div style={{}}>
                                    <label id='signInLabel' style={{ fontSize: 17, marginRight: 10 }}
                                        onClick={() => { this.renderSignUpOrSignIn() }}>Sign in</label>
                                    <label id='signUpLabel' style={{ fontSize: 17, color: '#007bff', borderBottom: '2px solid #007bff', marginBottom: 20 }}
                                        onClick={() => { this.renderSignUpOrSignIn() }}>New account</label>
                                </div>
                                <input style={{ width: '100%', marginBottom: 15, height: 40 }}
                                    id="inputEmail"
                                    autoComplete="off"
                                    // onFocus={() => { this.renderErrorMsg() }}
                                    type="email"
                                    value={this.state.emailAddress}
                                    name="email"
                                    placeholder="Enter email"
                                    required
                                    onChange={(e) => { this.emailHandleChange(e.target.value) }}
                                />
                                <input style={{ width: '100%', marginBottom: 15, height: 40 }}
                                    id="inputPassword"
                                    autoComplete="off"
                                    // onFocus={() => { this.renderErrorMsg() }}
                                    type="password"
                                    value={this.state.password}
                                    name="password"
                                    placeholder="Enter password"
                                    required
                                    onChange={(e) => { this.pwHandleChange(e.target.value) }}
                                />

                                {this.state.emailAddress && this.state.password ?
                                    <Button style={{ width: '45%' }}
                                        onClick={() => { this.signUp(this.state.emailAddress, this.state.password) }}>Submit</Button>
                                    :
                                    <Button style={{ width: '45%' }} disabled>Submit</Button>
                                }
                            </Modal.Body>
                        }
                        {/* <Alert show={this.state.errorAlert}>
                        <div>
                            check email
                        <Button variant='success' onClick={() => { this.setState({ errorAlert: false }) }}>close</Button>
                        </div>
                    </Alert> */}
                    </Modal>

                </Row >
            )
        }
    }
}

// export default NavBar;
export default GoogleApiWrapper({
    apiKey: apiKey
})(NavBar);