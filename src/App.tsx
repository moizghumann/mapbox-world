import { useRef, useState } from 'react';
import { Layer, Map, MapLayerMouseEvent, MapRef, Source, ViewStateChangeEvent } from 'react-map-gl';
import calculateRotation from '../functions/calculateRotation'
import onClusterClick from '../functions/onClusterClick'
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from '../constants/layers';


const App = () => {

  const mapRef = useRef<MapRef>(null);
  const [userInteracting, setUserInteracting] = useState<boolean>(false);


  // function variable that animates the rotation of globe
  const SpinGlobe = () => {
    const map = mapRef.current;
    if (map != null) {
      // calculates the new center for globe rotation based on map zoom and interaction state.
      const newCenter = calculateRotation({ map, userInteracting });
      if (newCenter) {
        // initiates a smooth map transition to the new center with a specified duration and easing function.
        map.easeTo({ center: newCenter, duration: 8, easing: (n) => n });
      }
    }
  }

  // updates the state and calls SpinGlobe function variable based on MapLayerMouseEvent's type
  const handleUserInteraction = (event: MapLayerMouseEvent | ViewStateChangeEvent | mapboxgl.MapLayerTouchEvent) => {
    if (event.type === 'mousedown') {
      setUserInteracting(true);
    }
    else {
      setUserInteracting(false);
      SpinGlobe();
    }
  };

  const handleMoveEnd = () => {
    SpinGlobe();
  }

  return (
    <div className='h-screen w-screen'>
      {/* The Map component represents the core Mapbox GL JS instance. It renders and manages the map view
      and interacts with various Mapbox features, such as layers and sources. */}
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 1.5
        }}
        mapStyle={'mapbox://styles/mapbox/dark-v11'}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        onLoad={() => SpinGlobe()}
        onMouseDown={e => handleUserInteraction(e)}
        onMouseUp={e => handleUserInteraction(e)}
        onPitchEnd={e => handleUserInteraction(e)}
        onRotateEnd={e => handleUserInteraction(e)}
        // onZoom={e => handleUserInteraction(e)}
        onMoveEnd={handleMoveEnd}
        interactiveLayerIds={['clusters']}
        onClick={event => onClusterClick({ event, mapRef })}
      >
        {/* The Source component represents a data source for the map. It can load and provide geographic data to be displayed on the map. Here, it loads GeoJSON data for earthquake points and clusters */}
        <Source
          id='earthquakes'
          type='geojson'
          data="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson"
          cluster={true}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          {/* Layer components define the visual representation of data from a Source on the map. They include styling properties to control how the data is displayed. */}
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>
      </Map>
    </div>
  );
};

export default App;