/* global google */
import React from 'react';
// import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-map-react';
import { GoogleMap, withGoogleMap, Marker, } from 'react-google-maps';
import PlacesAutocomplete from 'react-places-autocomplete';
import {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import firebase from '../../firebase/firebase';
import emptyMarker from '../images/emptyMarker.jpg'
import condoMarker from '../images/condoIcon.png';
import _ from 'lodash';
import { Button, Row, Col } from 'react-bootstrap'
import HomeModal from '../modal/HomeModal';

const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel");
const primaryColor = '#1a9bd7';
// const { compose } = require("recompose");
// const apiKey = 'AIzaSyDs3KaoDDiQEKvBtBquB5LFvuEG5JwPjOg';

interface Props {
    // google: any
    initialMapLocation: any;
    google: any;
    monthlyRentFee: any;
    getHouseData: any;
    getPremiumID: any;

}
interface State {
    address: any,
    mapLocation: any,
    loading: boolean,
    mapZoom: number,
    mapRef: any,
    markers: any,
    searchOption: boolean,
    bedRooms: number,
    detailModal: boolean,
    selectedHouse: any,
    premiumId: any,
}

let userLocation: any;
let premiumId: any;
class MapPage extends React.Component<Props, State> {
    private map: React.RefObject<GoogleMap>
    public state: State;
    constructor(props: Props) {
        super(props);
        this.map = React.createRef();
        this.state = {
            address: '',
            mapLocation:
                this.props.initialMapLocation,
            loading: true,
            mapZoom: 11,
            mapRef: {},
            markers: [],
            searchOption: false,
            bedRooms: 1,
            detailModal: false,
            selectedHouse: [],
            premiumId: ''
        }

        // this.google = React.createRef();
    }

    componentWillMount = () => {
        this.renderRentMarkers();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition);
        } else {
            console.log('no location')
        }
        firebase.firestore().collection('bidding').doc('wacQO4FlxR1KTjD7Bul8').get().then((result) => {
            const data = result.data();
            if (data) {
                this.props.getPremiumID(data.homeID);
            }
        })
    }

    private renderRentMarkers = () => {
        this.setState({ markers: [] })
        const lessMarkerStyle = { background: '#1a9bd7', height: 35, padding: '5px 15px', color: 'white', borderRadius: 15, }
        let monthlyRentFee = this.props.monthlyRentFee;
        firebase.firestore().collection('rent').onSnapshot((results) => {
            const houseInfo: any = [];
            results.forEach((info) => {
                const updateMarkers = this.state.markers;
                const lat = info.data().houseLocation.lat;
                const lng = info.data().houseLocation.lng;
                const fullAddress = info.data().houseAddress.split(',');
                const price = info.data().housePrice;
                const address = fullAddress[0];
                const charAddress = address.split('');
                const centerLabel = charAddress.length / 2 * 5;
                const infoObj = {
                    houseLocation:{'lat':lat, 'lng':lng},
                    housePrice:price,
                    houseAddress:info.data().houseAddress,
                    houseUnit:info.data().houseUnit,
                    houseID:info.id
                }

                if (monthlyRentFee > 0) {
                    if (monthlyRentFee >= price) {
                        updateMarkers.push(
                            <MarkerWithLabel
                                onClick={() => { console.log('marker') }}
                                // onClick={() => { this.props.getHouseData(info.data()) }}

                                style={{ height: 50, width: 100 }}
                                key={info.id}
                                className='rental'
                                position={{
                                    lat: lat,
                                    lng: lng
                                }}
                                labelAnchor={new google.maps.Point(centerLabel, 40)}
                                scaledSize
                                icon={{
                                    url: condoMarker,
                                    // style: {border:'1px solid black'}
                                    anchor: new google.maps.Point(0, 0),
                                    scaledSize: new google.maps.Size(30, 30)
                                }}
                            >
                                <div>
                                    <div style={lessMarkerStyle}>
                                        <div style={{ textAlign: 'center' }}>
                                            {address}
                                        </div>
                                        <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                            ${price}
                                        </div>
                                        {/* <p style={{ fontWeight: 'bold', textAlign: 'center' }}>7129 Arcola St</p>
                                <p style={{ fontWeight: 'bold', textAlign: 'center' }}>500,000</p> */}
                                    </div>
                                    <div style={{ margin: 'auto', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #1a9bd7' }}></div>
                                </div>
                            </MarkerWithLabel>
                        );
                    }
                } else {
                    houseInfo.push(infoObj);
                    // houseInfo.push(this.state.premiumId);
                    updateMarkers.push(
                        <MarkerWithLabel
                            onClick={() => { this.toggleModal(info.data()) }}
                            style={{ height: 50, width: 100 }}
                            key={info.id}
                            className={price}
                            position={{
                                lat: lat,
                                lng: lng
                            }}
                            labelAnchor={new google.maps.Point(centerLabel, 40)}
                            scaledSize
                            icon={{
                                url: condoMarker,
                                // style: {border:'1px solid black'}
                                anchor: new google.maps.Point(0, 0),
                                scaledSize: new google.maps.Size(30, 30)
                            }}
                        >
                            <div>
                                <div style={lessMarkerStyle}>
                                    <div style={{ textAlign: 'center' }}>
                                        {address}
                                    </div>
                                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                        ${price}
                                    </div>
                                    {/* <p style={{ fontWeight: 'bold', textAlign: 'center' }}>7129 Arcola St</p>
                            <p style={{ fontWeight: 'bold', textAlign: 'center' }}>500,000</p> */}
                                </div>
                                <div style={{ margin: 'auto', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid #1a9bd7' }}></div>
                            </div>
                        </MarkerWithLabel>
                    );
                }
                this.setState({ markers: updateMarkers });
            })
            this.props.getHouseData(houseInfo);
        });
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
    private zoomChange = () => {
        if (this.map.current) {
            this.setState({ mapZoom: this.map.current.getZoom() })
        }
        // this.setState({mapZoom:5})
    }
    private changeCenterOnClick = (e: any) => {
        let lat = e.latLng.lat();
        let lng = e.latLng.lng();
        this.setState({ mapLocation: { lat, lng } });
        this.setState({ mapZoom: this.state.mapZoom + 1 });
    }

    private centerChange = () => {
        let lat;
        let lng;
        if (this.map.current) {
            lat = this.map.current.getCenter().lat();
            lng = this.map.current.getCenter().lng();
            this.setState({ mapLocation: { lat, lng } });
        }
        return { lat, lng }
    }

    private renderMarkers = () => {
        const zoomLess11Markers: any = [];
        const lessMarkerStyle = { background: '#1a9bd7', height: 35, padding: '5px 10px', color: 'white', borderRadius: 15, }
        const overMarkerStyle = { background: '#1a9bd7', height: 45, padding: '10px 30px', color: 'white', borderRadius: 25 }
        if (this.props.monthlyRentFee > 1) {
            _.each(this.state.markers, (marker) => {

                if (marker.props.className <= this.props.monthlyRentFee) {
                    zoomLess11Markers.push(marker);
                }
            })
        }
        const zoomOver11Markers = [
            <MarkerWithLabel
                title={'burnaby'}
                style={{ height: 50, width: 100 }}
                key='burnaby'
                position={{
                    lat: 49.2488091,
                    lng: -122.98051040000001
                }}
                labelAnchor={new google.maps.Point(30, 30)}
                scaledSize
                icon={{
                    url: emptyMarker,
                    anchor: new google.maps.Point(30, 15),
                    scaledSize: new google.maps.Size(0, 0)
                }}
            >
                <div style={overMarkerStyle}>Burnaby<br></br>
                    <p style={{ fontWeight: 'bold', textAlign: 'center' }}>500,000</p>
                </div>
            </MarkerWithLabel>,
            < MarkerWithLabel
                title={'vancouver'}
                key='vancouver'
                style={{ overflow: 'none' }
                }
                position={{
                    lat: 49.246292,
                    lng: -123.1207,
                }}
                labelAnchor={new google.maps.Point(0, 0)}
                icon={{
                    url: emptyMarker,
                    anchor: new google.maps.Point(30, 15),
                    scaledSize: new google.maps.Size(0, 0)
                }}
            >
                <div style={overMarkerStyle}>Vancouver<br></br>
                    <p style={{ fontWeight: 'bold', textAlign: 'center' }}>800,000</p>
                </div>
                {/* icon={{
                    url: highPriceImg,
                    anchor: new google.maps.Point(25, 15),
                    scaledSize: new google.maps.Size(98, 53),
                }}
            >
                <div style={{ color: 'white', marginBottom: 50, textAlign: 'center' }}>Vancouver<br></br>
                    <p style={{ fontWeight: 'bold' }}>800,000</p></div> */}
            </MarkerWithLabel >,
            <MarkerWithLabel
                title={'richmond'}
                key='richmond'
                position={{
                    lat: 49.1665898,
                    lng: -123.13356899999997
                }}
                labelAnchor={new google.maps.Point(0, 0)}
                icon={{
                    url: emptyMarker,
                    anchor: new google.maps.Point(30, 15),
                    scaledSize: new google.maps.Size(0, 0)
                }}
            >
                <div style={overMarkerStyle}>Richmond<br></br>
                    <p style={{ fontWeight: 'bold', textAlign: 'center' }}>500,000</p>
                </div>
            </MarkerWithLabel>
        ];

        if (this.state.mapZoom > 11) {
            if (_.size(zoomLess11Markers) >= 1) {
                return zoomLess11Markers;
            } else {

                return this.state.markers;
            }
            // return zoomLess11Markers;
        } else {
            return zoomOver11Markers;
        }
    }
    private toggleSearchOption = () => {
        this.setState({ searchOption: !this.state.searchOption });
    }
    private toggleModal = (houseData: any) => {

        this.setState({ selectedHouse: houseData });
        this.setState({ detailModal: !this.state.detailModal });
    }

    private showPosition = (position: any) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.setState({
            mapLocation: { lat, lng },
        });
        // return position.coords.latitude + '/' + position.coords.longitude;
    }

    render() {
        const modalData = {
            modalHide: () => { this.toggleModal(false) },
            modalOpen: this.state.detailModal,
        }
        const location = {
            lat: 49.246292,
            lng: -123.1207,
        }
        const searchOptions = {
            componentRestrictions: { country: ['ca'] }
        };
        const GoogleMapPage = withGoogleMap((props: any) =>
            <GoogleMap
                ref={this.map}
                defaultCenter={this.props.initialMapLocation}
                center={this.state.mapLocation}
                // onCenterChanged={() => { this.setState({ mapLocation: this.centerChange() }) }}
                zoom={this.state.mapZoom}
                onDragEnd={() => { this.setState({ mapLocation: this.centerChange() }) }}
                // onDblClick={(e) => {this.setState({mapLocation:{e.latLng.lat(), e.latLng.lng()}}) }}
                onDblClick={(e) => { this.changeCenterOnClick(e) }}
                onZoomChanged={() => { this.zoomChange() }}
                options={{
                    maxZoom: 18,
                    minZoom: 5,
                    mapTypeControl: false,
                    gestureHandling: 'greedy',
                    streetViewControl: false,
                }}
            >
                {this.renderMarkers()}
            </GoogleMap>
        );
        const colStyle = {
            border: '1px solid #333333', background: '#333333', color: 'white',
            borderRadius: 5, height: '35px', lineHeight: '35px', cursor: 'pointer', margin: 3
        }
        const colNotStyle = {
            border: '1px solid #e1e1e1',
            borderRadius: 5, height: '35px', lineHeight: '35px', cursor: 'pointer', margin: 3
        }
        return (
            <div style={{ height: '100%' }} id='mapDiv'>
                {window.innerWidth > 800 ?
                    <PlacesAutocomplete
                        value={this.state.address}
                        onChange={this.handleChange}
                        onSelect={this.handleSelect}
                        searchOptions={searchOptions}
                    >
                        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div style={{
                                position: 'absolute',
                                zIndex: 2,
                                margin: 10,
                                padding: 10,
                                background: 'white',
                                border: '1px solid rgb(217, 217, 217)'
                            }}>
                                <input
                                    {...getInputProps({
                                        placeholder: 'Search Places ...',
                                        className: 'location-search-input',
                                    })}
                                    style={{ border: '1px solid rgb(72, 72, 143)', borderRadius: 5, width: 300 }}

                                />
                                <div style={{ borderTop: '1px solid #e1e1e1', marginTop: 10, }}>
                                    <div style={{
                                        border: '1px solid #e1e1e1', marginTop: 10, cursor: 'pointer', textAlign: 'center',
                                        padding: 3
                                    }}
                                        onClick={() => { this.toggleSearchOption() }}>
                                        {/* Search Option */}
                                        Filter
                                        {/* <Row>
                                            <Col>
                                            
                                            </Col>
                                            <Col>
                                                <Row>
                                                <Col>
                                                </Col>
                                                </Row>
                                            </Col>
                                        </Row> */}
                                    </div>
                                    <div style={{
                                        visibility: this.state.searchOption ? 'visible' : 'hidden',
                                        height: this.state.searchOption ? 200 : 0, borderTop: '1px solid #e1e1e1', marginTop: 10
                                    }}>
                                        {/* <Row> */}
                                        <Row style={{ padding: '10px 0', borderBottom: '1px solid #e1e1e1', margin: 'auto' }}>
                                            <Col md="auto" onClick={() => { this.toggleSearchOption() }}
                                                style={{ cursor: 'pointer' }}>X</Col>
                                            <Col>Filter</Col>
                                            <Row>
                                                <Col style={{ float: 'right', marginRight: 10, cursor: 'pointer' }}>Default</Col>
                                            </Row>

                                        </Row>
                                        <div>
                                            <Row style={{ padding: '10px 20px 0 20px' }}>Bed Rooms</Row>
                                            <Row style={{
                                                padding: '0 20px 5px 20px', fontSize: '20px', color: primaryColor,
                                                fontWeight: 'bold'
                                            }}>{this.state.bedRooms === 4 ? '+' + this.state.bedRooms + ' ' : this.state.bedRooms + ' '}
                                                Bed {this.state.bedRooms !== 1 ? 'Rooms' : 'Room'}</Row>

                                            <Row style={{ margin: 'auto', textAlign: 'center' }}>
                                                <Col style={{
                                                    border: '1px solid #cacaca', background: this.state.bedRooms === 1 ? '#333333' : '#ffffff',
                                                    color: this.state.bedRooms === 1 ? 'white' : 'black', borderRadius: 5,
                                                    height: '35px', lineHeight: '35px', cursor: 'pointer', margin: 3
                                                }} onClick={() => { this.setState({ bedRooms: 1 }) }}>1</Col>
                                                <Col style={{
                                                    border: '1px solid #cacaca', background: this.state.bedRooms === 2 ? '#333333' : '#ffffff',
                                                    color: this.state.bedRooms === 2 ? 'white' : 'black', borderRadius: 5,
                                                    height: '35px', lineHeight: '35px', cursor: 'pointer', margin: 3
                                                }} onClick={() => { this.setState({ bedRooms: 2 }) }}>2</Col>
                                                <Col style={{
                                                    border: '1px solid #cacaca', background: this.state.bedRooms === 3 ? '#333333' : '#ffffff',
                                                    color: this.state.bedRooms === 3 ? 'white' : 'black', borderRadius: 5,
                                                    height: '35px', lineHeight: '35px', cursor: 'pointer', margin: 3
                                                }} onClick={() => { this.setState({ bedRooms: 3 }) }}>3</Col>
                                                <Col style={{
                                                    border: '1px solid #cacaca', background: this.state.bedRooms === 4 ? '#333333' : '#ffffff',
                                                    color: this.state.bedRooms === 4 ? 'white' : 'black', borderRadius: 5,
                                                    height: '35px', lineHeight: '35px', cursor: 'pointer', margin: 3
                                                }} onClick={() => { this.setState({ bedRooms: 4 }) }}>4+</Col>
                                            </Row>
                                        </div>
                                        <Row>
                                            <Row></Row>
                                        </Row>

                                        {/* </Row> */}
                                    </div>
                                </div>
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
                    : null}
                <GoogleMapPage
                    containerElement={<div style={{ height: '100%', width: '100%' }} />}
                    mapElement={<div style={{ height: '100%' }} />}
                >
                </GoogleMapPage>
                <HomeModal
                    modalInfo={modalData}
                    houseInfo={this.state.selectedHouse}
                />
            </div >
        );

    }
}
export default MapPage;