/* global google */
import React from 'react';
import { Row, Col, Image, } from 'react-bootstrap'
// import { GoogleMap, withGoogleMap, Marker } from 'react-google-maps';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import NavBar from '../nav/NavBar'
import MapPage from '../mapComponents/MapPage';
// import List from '../listComponents/List';
import PremiumList from '../listComponents/PremiumList';
import NormalList from '../listComponents/NormalList';
import _ from 'lodash';
import PlacesAutocomplete from 'react-places-autocomplete';
import { Link } from 'react-router-dom';
import MbackImg from '../images/MbackImg.png'
import MmenuImg from '../images/MmenuImg.png'
// import MsearchImg from '../images/MsearchImg.png'

interface Props {
    locationInfo: any;
    history: any;
}

interface State {
    monthlyMoney: string;
    houseData: any;
    isMobile: boolean,
    screenHeight: number,
    address: string;
    mapLocation: any;
    loading: boolean;
    menuWidth: number;
    premiumID: any;
}
const primaryColor = '#1a9bd7';
class MainPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            monthlyMoney: '',
            houseData: {},
            isMobile: false,
            screenHeight: window.innerHeight,
            mapLocation:
            {
                lat: 49.246292,
                lng: -123.1207,
            },
            loading: true,
            address: '',
            menuWidth: 0,
            premiumID: ''
        }
    }

    componentDidMount = () => {
        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    private resize() {
        let currentHideNav = (window.innerWidth <= 800);
        let currentHeight = window.innerHeight;
        if (currentHideNav !== this.state.isMobile) {
            this.setState({ isMobile: currentHideNav });
        }
        this.setState({ screenHeight: currentHeight });
    }

    private renderPremiumList = () => {
        const listArr = []
        listArr.push(
            <PremiumList
                data={this.state.houseData}
                premiumID={this.state.premiumID}
            />)
        return listArr;

    }
    private renderNormalList = () => {
        const listArr = []
        listArr.push(
            <NormalList
                data={this.state.houseData}
                premiumID={this.state.premiumID}
            />)
        return listArr;
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
    private renderMenu = () => {
        this.setState({
            menuWidth: window.innerWidth * 0.85
        });
    };

    render() {
        const listHeight = window.innerHeight - 56;
        // let houseData;
        const searchOptions = {
            componentRestrictions: { country: ['ca'] }
        };
        const screenHeight = window.innerHeight;
        let location;
        if (this.props.history.location.locationInfo) {
            location = this.props.history.location.locationInfo;
        } else {
            location = {
                lat: 49.246292,
                lng: -123.1207,
            }
        }
        if (this.state.isMobile) {
            const mapHeight = this.state.screenHeight - (47 * 2);
            return (
                <div style={{ height: '100vh', overflow: 'hidden' }}>
                    <div id='navDiv' style={{ borderBottom: '1px solid #d7d7d7' }}>
                        <Row style={{ margin: 'auto', height: 47 }}>
                            <Col style={{ padding: 5, paddingRight: 0 }}>
                                <Link to='/'>
                                    <Image src={MbackImg} style={{ height: 35, width: screenHeight / 20 }} />
                                </Link>
                            </Col>
                            <Col xs={8} style={{ padding: '2px 0 2px 0 ' }}>
                                <PlacesAutocomplete
                                    value={this.state.address}
                                    onChange={this.handleChange}
                                    onSelect={this.handleSelect}

                                    searchOptions={searchOptions}
                                >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                        <div style={{
                                            // position: 'absolute',
                                            zIndex: 2,
                                            // margin: 10,
                                            // padding: 10,
                                            background: 'white',
                                            // border: '1px solid rgb(217, 217, 217)'
                                        }}>
                                            <input
                                                {...getInputProps({
                                                    placeholder: '  Search address',
                                                    className: 'location-search-input',
                                                })}
                                                style={{ border: '1px solid #d7d7d7', borderRadius: 10, width: '100%', height: 40 }}
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
                                                            })}
                                                        >
                                                            <span>{suggestion.description}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </PlacesAutocomplete>

                            </Col>
                            <Col style={{ padding: 5, paddingRight: 0 }} onClick={() => { this.renderMenu() }}>
                                <Image src={MmenuImg} style={{ height: 35, width: screenHeight / 20, marginLeft: screenHeight / 20 / 2 }} />
                            </Col>
                            <NavBar
                                getMonthlyRentFee={(rentFee: string) => { this.setState({ monthlyMoney: rentFee }) }}
                                renderMenu={this.state.menuWidth}
                                closeMenu={() => { this.setState({ menuWidth: 0 }) }}
                            />
                        </Row>
                    </div>
                    <div id='optionDiv' style={{ borderBottom: '1px solid #d7d7d7' }}>
                        <Row style={{ margin: 'auto' }}>
                            <Col xs={3} style={{ border: '1px solid #d7d7d7', width: '25%', margin: 5, padding: 3, textAlign: 'center' }}> Rent &#8595;</Col>
                            <Col style={{ border: '1px solid #d7d7d7', margin: 5, padding: 5 }}>Filter</Col>
                        </Row>
                    </div>
                    <div style={{ height: mapHeight }}>
                        {/* <div> */}

                        <MapPage
                            google={google.maps}
                            initialMapLocation={location}
                            monthlyRentFee={this.state.monthlyMoney}
                            getHouseData={(data: any) => { this.setState({ houseData: data }) }}
                            getPremiumID={(data: any) => { this.setState({ premiumID: data }) }}>
                        </MapPage>
                    </div>
                    <div style={{ visibility: 'hidden' }}>
                        detail
                    </div>
                </div>
            );
        } else {
            return (
                <div style={{ height: '100%', overflow: 'hidden' }}>
                    <div style={{
                        borderBottom: '1px solid #e1e1e1',
                        background: 'white',
                        position: 'fixed',
                        left: 0,
                        right: 0,
                        top: 0,
                        zIndex: 3,
                        minWidth: '1180px'
                    }}>
                        <NavBar
                            getMonthlyRentFee={(rentFee: string) => { this.setState({ monthlyMoney: rentFee }) }}
                            renderMenu={this.state.menuWidth}
                            closeMenu={() => { this.setState({ menuWidth: 0 }) }} />
                    </div>
                    <Row style={{ minHeight: '100%', paddingTop: '56px', marginRight: 0 }}>
                        <Col style={{ height: listHeight, paddingRight: 0, overflow: 'hidden' }}>
                            <MapPage
                                google={google.maps}
                                initialMapLocation={location}
                                monthlyRentFee={this.state.monthlyMoney}
                                getHouseData={(data: any) => { this.setState({ houseData: data }) }}
                                getPremiumID={(data: any) => { this.setState({ premiumID: data }) }}>
                            </MapPage>
                        </Col>

                        <Col md='auto' style={{
                            width: '400px', height: listHeight, overflowY: 'scroll', overflowX: 'hidden',
                            background: _.size(this.state.houseData) > 0 ? 'white' : '#e2e2e2', boxShadow: '0px 0px 8px'
                        }}>
                            {this.renderPremiumList()}
                            {this.renderNormalList()}
                        </Col>
                    </Row>
                </div>
            )
        }
    }
}

export default MainPage;