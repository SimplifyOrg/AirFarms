import React, {useState, useEffect} from 'react'
import GoogleMapReact from 'google-map-react';
import {useSelector, connect } from 'react-redux'
import MapAutoComplete from './MapAutoComplete'
import {AuthProvider} from '../utils/AuthProvider'
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { userLocationAction} from '../storeActions';
import { IconButton, VStack, HStack } from '@chakra-ui/react'; 
import {PlusSquareIcon, RepeatIcon} from '@chakra-ui/icons'

const AnyReactComponent = ({ text }) => <div>{text}</div>;

function MapContainer(props) {   

    const dispatch = useDispatch()
    const user = useSelector(state => state.getUser)
    const farm = useSelector(state => state.getFarm)
    const history = useHistory()

    const [selectedShape, setSelectedShape] = useState()
    const [mapApiLoaded, setMapApiLoaded] = useState(false)
    const [mapInstance, setMapInstance] = useState()
    const [mapApi, setMapApi] = useState()
    const [geoCoder, setGeoCoder] = useState()
    const [drawManager, setDrawManager] = useState()
    const [feature, setFeature] = useState()

    const apiHasLoaded = (map, maps) => {
        setMapApiLoaded(true)
        setMapInstance(map)
        setMapApi(maps)
        setGeoCoder(new maps.Geocoder())
        map.setZoom(18)
        renderMap(map, maps)
    };

    const addPlace = (place) => {

        let loc = {
            lat : place.geometry.location.lat() ,
            lng : place.geometry.location.lng() 
        }
        // You have obtained longitude coordinate!
        dispatch(userLocationAction(loc));
    };
    
    let userInfo = {
        center: {
            lat: props.userLat,
            lng: props.userLong
        },
        zoom: 18
    };

    function resetPoly(){
        deleteSelectedShape();
    }

    function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
            mapInstance.data.remove(feature);
            // To show:
            drawManager.setOptions({
                drawingControl: true,
                drawingMode: mapApi.drawing.OverlayType.POLYGON
            });
        }
    }

    function clearSelection() {
        if (selectedShape) {
          selectedShape.setEditable(false);
          selectedShape = null;
        }
      }

    function setSelection(shape) {
        clearSelection();
        setSelectedShape(shape);
        shape.setEditable(true);
      }

    const savePolygon = () => {
        mapInstance.data.toGeoJson(function(obj){

            const requestData = {
                farm: farm.id,
                body: JSON.stringify(obj)
            }

            let config = {
                headers: {
                'Content-Type': 'application/json'
                }
            }
            const authProvider = AuthProvider()
            authProvider.authPost(`http://127.0.0.1:8000/farm-maps/mapfarm/handle/`, requestData, config, false)
            .then(res =>{
                console.log(res);
                console.log(res.data);
                history.push('/profile')            
            })
            .catch(error => {
                console.log(error);
                console.log(error.data);
            })
        })
    }

    const renderMap = (map, maps) => {
        
        // Create drawingManager to provision drawing polygons
        const drawingManager = new maps.drawing.DrawingManager({
            drawingMode: maps.drawing.OverlayType.POLYGON,
            drawingControl: true,
            drawingControlOptions: {
              position: maps.ControlPosition.TOP_CENTER,
              drawingModes: [
                maps.drawing.OverlayType.POLYGON,
              ]
            },
            markerOptions: {
              icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
            }
          });
          drawingManager.setMap(map);

          setDrawManager(drawingManager)

          map.data.setStyle({
            fillColor: '#556B2F',
            strokeOpacity: 1.0,
            strokeWeight: 3,
            editable: true,
          });

          maps.event.addListener(drawingManager, 'overlaycomplete', function(event) {
            switch (event.type) {
              case maps.drawing.OverlayType.POLYGON:
                map.data.setStyle({
                                fillColor: '#556B2F',
                                strokeOpacity: 1.0,
                                strokeWeight: 3,
                                editable: true,
                              });
                setFeature( map.data.add(new maps.Data.Feature({
                  geometry: new maps.Data.Polygon([event.overlay.getPath().getArray()])
                }))
                );
                
                // Disable drawing option
                drawingManager.setOptions({
                  drawingControl: false,
                  drawingMode: maps.drawing.OverlayType.MARKER
                });
    
                // Add an event listener that selects the newly-drawn shape when the user
                // mouses down on it.
                var newShape = event.overlay;
                newShape.type = event.type;
                maps.event.addListener(newShape, 'click', function() {
                  setSelection(newShape);
                });
                setSelection(newShape);
                break;
            }
          });
    };

    const mapOptions = {
        mapTypeId: 'satellite'
    }

    return (
        <VStack style={{ height: '100%', width: '100%' }}>
            <HStack>
                {mapApiLoaded ? <MapAutoComplete map={mapInstance} mapApi={mapApi} geoCoder={geoCoder} addPlace={addPlace} /> : <div/>
                }
                <IconButton onClick={savePolygon} icon={<PlusSquareIcon boxSize='70%'/>}/>
                <IconButton onClick={resetPoly} icon={<RepeatIcon boxSize='70%'/>}/>
            </HStack>
            <br/>            
            <GoogleMapReact
            bootstrapURLKeys={{ key: "AIzaSyB2zxSy8K3fKO7b1uM7yE_66NXZIbwhBLM", libraries: ['drawing', 'places', 'geometry', 'geocoder'], }}
            center={userInfo.center}
            defaultZoom={userInfo.zoom}
            options={mapOptions}
            yesIWantToUseGoogleMapApiInternals={true}
            onGoogleApiLoaded={({ map, maps }) => {
                apiHasLoaded(map, maps)
            }}
            >
                {/* <AnyReactComponent
                    lat={props.lat}
                    lng={props.lng}
                    text="My Marker"
                /> */}
            </GoogleMapReact>

        </VStack>
    )
}

const mapStateToProps = (state) => {
    return {
        userLat: state.getLocation.lat,
        userLong: state.getLocation.lng,
    }
}
export default connect(mapStateToProps)(MapContainer);
