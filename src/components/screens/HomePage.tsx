import React from 'react';
import RSSParser from 'rss-parser';
import { Row, Col, Button, Image } from 'react-bootstrap'
import NavBar from '../nav/NavBar';
import MobileHome from '../mobile/MobileHome';
import { GoogleApiWrapper } from 'google-maps-react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import mainImg from '../images/mainBackImg.png'
import mainLogo from '../images/mainLogo.png'
import detailImg from '../images/detailImg.jpg'
import './HomePage.css'

const apiKey = 'AIzaSyDs3KaoDDiQEKvBtBquB5LFvuEG5JwPjOg';

interface Props {
    google: any
}
interface State {
    address: any,
    mapLocation: any,
    loading: boolean,
    mobile: boolean,
    mouseOnAnnouncement: boolean,
    mouseOnNews: boolean,
    newsData: any,
}
const primaryColor = '#1a9bd7';
class HomePage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            address: '',
            mapLocation: {
                lat: 0,
                lng: 0,
            },
            loading: true,
            mobile: false,
            mouseOnAnnouncement: false,
            mouseOnNews: false,
            newsData: [],
        }
    }

    componentDidMount = () => {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/"
        let parser = new RSSParser();

        parser.parseURL(CORS_PROXY + 'https://vancouversun.com/category/business/real-estate/feed',
            (err, feed) => {
                let newsArr: any = [];
                for (let i = 0; i < 5; i++) {
                    if (feed.items)
                        newsArr.push({
                            title: feed.items[i].title,
                            link: feed.items[i].link
                        })
                }
                this.setState({ newsData: newsArr })
            });
    }

    private resize() {
        let currentHideNav = (window.innerWidth <= 800);
        if (currentHideNav !== this.state.mobile) {
            this.setState({ mobile: currentHideNav });
        }
    }

    private handleChange = (address: any) => {
        this.setState({ address });
    };

    private handleSelect = (address: any) => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng =>
                this.setState({ mapLocation: { lat: latLng.lat, lng: latLng.lng }, loading: false }))
            .catch(error => console.error('Error', error));
    };
    private renderAnnouncement = () => {
        const announcementArr: any = [];
        for (let i = 0; i < 5; i++) {
            announcementArr.push(
                <Row key={'announcement' + i} style={{ marginBottom: 10, fontSize: '15px', }}
                    onMouseEnter={() => { this.setState({ mouseOnAnnouncement: true }) }}
                    onMouseLeave={() => { this.setState({ mouseOnAnnouncement: false }) }}
                >
                    <Link to='announcement' style={{ color: 'black', width: '100%' }}>Announcement{i}</Link>
                </Row>
            );
        }
        return announcementArr;

    }

    private renderNews = () => {
        const newsArr: any = [];
        for (let i = 0; i < 5; i++) {
            if (_.size(this.state.newsData) > 3) {
                let reducedTitle = this.state.newsData[i].title.slice(0, 28);
                let linkAddress = this.state.newsData[i].link.replace('https://', '//')
                newsArr.push(
                    <Row key={'news' + i} style={{ marginBottom: 10, fontSize: '15px', }}
                        // <Row key={'announcement' + i} style={{ marginBottom: 10, fontSize: '15px', background: this.state.mouseOnAnnouncement ? 'grey' : 'white' }}
                        onMouseEnter={() => { this.setState({ mouseOnNews: true }) }}
                        onMouseLeave={() => { this.setState({ mouseOnNews: false }) }}
                    >
                        <Link to={linkAddress} target='_blank'
                            style={{ color: 'black', width: '100%' }}>
                            {reducedTitle + ' ...'}</Link>
                    </Row>
                );
            }
        }
        return newsArr;
    }

    render() {
        const searchOptions = {
            componentRestrictions: { country: ['ca'] }
        };
        if (this.state.mobile) {
            return (
                <MobileHome />
            );
        } else {

            return (
                <div style={{ width: '100%', minHeight: '100%', minWidth: '1160px', marginTop: '56px' }}>
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

                    <div style={{
                        width: '100%',
                        minHeight: '600px',
                        overflow: 'hidden',
                    }}>
                        <div id='main-container'>
                            <div id='main-visual'
                                style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '466px',
                                    textAlign: 'center',
                                    // overflow:'visible',
                                    background: 'white no-repeat center center',
                                    backgroundSize: '2000px 100%',
                                    backgroundImage: `url(${mainImg})`,
                                }}>

                                {/* <Image src={mainLogo}
                                    style={{ position: 'absolute', top: 92, left: '42%', height: '45%' }} /> */}

                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    backgroundColor: ' rgba(0, 0, 0, 0.6)',
                                    paddingBottom: '20px',
                                }}>
                                    <div style={{ width: '880px', margin: 'auto' }}>
                                        <div id='opitonBox' style={{ textAlign: 'left' }}>
                                            <Button variant='link'
                                                style={{
                                                    color: primaryColor,
                                                    textDecoration: 'none',
                                                    padding: '0 40px 0 20px',
                                                    outline: 'none',
                                                    position: 'relative',
                                                    height: '64px',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '28px',
                                                }}>CONDO RENTAL</Button>

                                            <Button variant='link'
                                                style={{
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    padding: '0 40px 0 0',
                                                    outline: 'none',
                                                    position: 'relative',
                                                    height: '64px',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '28px',
                                                }}>HOUSE RENTAL</Button>
                                            <Button variant='link'
                                                style={{
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    padding: '0 40px 0 0',
                                                    outline: 'none',
                                                    position: 'relative',
                                                    height: '64px',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '28px',
                                                }}>BUYING CONDO</Button>
                                            <Button variant='link'
                                                style={{
                                                    color: 'white',
                                                    textDecoration: 'none',
                                                    padding: '0 40px 0 0',
                                                    outline: 'none',
                                                    position: 'relative',
                                                    height: '64px',
                                                    fontSize: '15px',
                                                    fontWeight: 500,
                                                    lineHeight: '28px',
                                                }}>BUYING HOUSE</Button>

                                        </div>
                                        <div id='searchInput'
                                            style={{
                                                backgroundColor: 'white',
                                                border: 'solid 3px' + primaryColor,
                                                paddingRight: '150px',
                                                position: 'relative',
                                                borderRadius: '10px',
                                            }}>
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
                                                                placeholder: 'Search Places ...',
                                                                className: 'location-search-input',
                                                            })}
                                                            style={{
                                                                borderWidth: 0,
                                                                backgroundColor: 'white',
                                                                padding: '0 53px',
                                                                height: '54px',
                                                                boxSizing: 'border-box',
                                                                width: '100%',
                                                                outline: 0,
                                                                fontSize: '16px',
                                                                color: '#757575',
                                                                borderRadius: '10px',
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
                                            <Link to={{
                                                pathname: '/map/' + this.state.mapLocation.lat + '/' + this.state.mapLocation.lng,
                                                locationInfo: this.state.mapLocation,
                                            }}>
                                                <Button
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        width: '150px',
                                                        backgroundColor: primaryColor,
                                                        border: 'none',
                                                        borderRadius: 0,
                                                        fontSize: '18px',
                                                        fontWeight: 'bold',
                                                        color: 'white',
                                                        textAlign: 'center',
                                                    }}>Search</Button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div id='introDiv'
                                style={{
                                    width: '100%',
                                    padding: '27px 0 97px',
                                    background: 'white',
                                    overflow: 'hidden',
                                }}>
                                <Row style={{
                                    width: 840,
                                    margin: 'auto'
                                }}>
                                    <Col style={{ width: 260 }}>
                                        <Link to='' style={{ color: 'black', textAlign: 'center' }}>
                                            <div style={{ border: '1px solid #1a9bd7', width: 260, height: 200, textDecoration: 'none' }}>
                                                <Image src={detailImg} width={258} height={'100%'} />
                                                <div style={{
                                                    position: 'absolute',
                                                    marginTop: -180, color: '#ffffff', fontSize: '30px', fontWeight: 700, marginLeft: '10px'
                                                }}>Selling a home?</div>
                                            </div>
                                        </Link>
                                    </Col>
                                    <Col style={{ width: 260 }}>
                                        <div style={{ width: 260, height: 200 }}>
                                            <Row style={{ borderBottom: '2px solid #e1e1e1', width: '99%', margin: 'auto', marginBottom: 10 }}>
                                                <Col style={{ paddingLeft: '5px' }}>
                                                    <h6 style={{
                                                        fontSize: '17px',
                                                        color: 'black',
                                                        paddingBottom: '1px',

                                                        marginBottom: 10,
                                                    }}>News</h6>
                                                </Col>
                                                <Col md='auto' style={{ float: 'right' }}>
                                                    <Link to={'//vancouversun.com/category/business/real-estate'}
                                                        target='_blank'
                                                        style={{
                                                            textDecoration: 'none',
                                                            border: '1px solid #e1e1e1',
                                                            color: 'black',
                                                            fontSize: '13px',
                                                            padding: '3px 15px'
                                                        }}>More</Link>
                                                </Col>
                                            </Row>
                                            <div style={{ paddingLeft: 22 }}>
                                                {this.renderNews()}
                                                {/* <Row style={{ marginBottom: 10, fontSize: '15px' }}>
                                                    <Link to='announcement'>Announcement1</Link>
                                                </Row>
                                                <Row style={{ marginBottom: 10, fontSize: '15px', }}>
                                                    Announcement2
                                        </Row>
                                                <Row style={{ marginBottom: 10, fontSize: '15px', }}>
                                                    Announcement3
                                        </Row> */}
                                            </div>
                                        </div>

                                    </Col>
                                    <Col style={{ width: 260 }}>
                                        <div style={{ width: 260, height: 200 }}>
                                            <Row style={{ borderBottom: '2px solid #e1e1e1', width: '99%', margin: 'auto', marginBottom: 10 }}>
                                                <Col style={{ paddingLeft: '5px' }}>
                                                    <h6 style={{
                                                        fontSize: '17px',
                                                        color: 'black',
                                                        paddingBottom: '1px',

                                                        marginBottom: 10,
                                                    }}>Announcement</h6>
                                                </Col>
                                                <Col md='auto' style={{ float: 'right' }}>
                                                    <Link to='announcement'
                                                        style={{
                                                            textDecoration: 'none',
                                                            border: '1px solid #e1e1e1',
                                                            color: 'black',
                                                            fontSize: '13px',
                                                            padding: '3px 15px'
                                                        }}>More</Link>
                                                </Col>
                                            </Row>
                                            <div style={{ paddingLeft: 22 }}>
                                                {this.renderAnnouncement()}
                                                {/* <Row style={{ marginBottom: 10, fontSize: '15px' }}>
                                                    <Link to='announcement'>Announcement1</Link>
                                                </Row>
                                                <Row style={{ marginBottom: 10, fontSize: '15px', }}>
                                                    Announcement2
                                        </Row>
                                                <Row style={{ marginBottom: 10, fontSize: '15px', }}>
                                                    Announcement3
                                        </Row> */}
                                            </div>
                                        </div>

                                    </Col>
                                </Row>
                            </div>
                        </div>
                        <div id='footer' style={{
                            width: '100%',
                            margin: 'auto',
                            borderTop: '1px solid #d8d8d8'
                        }}>
                            <Row id='footerFirRow' style={{ width: 840, margin: 'auto', padding: 40 }}>
                                <Col md='auto'>
                                    <Link to=''>About</Link>
                                </Col>
                                <Col md='auto'>
                                    <Link to=''>Help</Link>
                                </Col>
                                <Col md='auto'>
                                    <Link to=''>Advertise</Link>
                                </Col>
                                <Col md='auto'>
                                    <Link to=''>Terms of use & Privacy</Link>
                                </Col>
                                <Col md='auto'>
                                    <Link to=''>Contact Us</Link>
                                </Col>
                            </Row>
                            <Row style={{ borderTop: '1px solid #d8d8d8' }}>
                                {/* <Link to='/' style={{ margin: 'auto', fontSize: 20 }}>
                                    <Image style={{ height: 50, margin: '20px 0' }}
                                        src='https://firebasestorage.googleapis.com/v0/b/eeum-home.appspot.com/o/renieLogo.png?alt=media&token=123066fd-9887-410d-b4d4-09e87b2f7672' />
                                </Link> */}
                                <Link to='/' style={{ margin: 'auto', fontSize: 20, textDecoration: 'none' }}>
                                    {/* <Image src='https://firebasestorage.googleapis.com/v0/b/eeum-home.appspot.com/o/renieLogo.png?alt=media&token=123066fd-9887-410d-b4d4-09e87b2f7672'
                                        style={{ height: 40 }} /> */}
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
                                </Link>
                            </Row>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default GoogleApiWrapper({
    apiKey: apiKey
})(HomePage);