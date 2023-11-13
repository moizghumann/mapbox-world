import { useRef, useState } from 'react';
import { Layer, Map, MapLayerMouseEvent, MapRef, Source, ViewStateChangeEvent } from 'react-map-gl';
import calculateRotation from '../functions/calculateRotation'
import { clusterLayer, clusterCountLayer, unclusteredPointLayer } from '../constants/layers';
import mapboxgl from 'mapbox-gl';


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
        map.easeTo({ center: newCenter, duration: 1000, easing: (n) => n });
      }
    }
  }

  // updates the state and calls SpinGlobe function variable based on MapLayerMouseEvent's type
  const handleUserInteraction = (event: MapLayerMouseEvent | ViewStateChangeEvent) => {
    if (event.type === 'mousedown') {
      setUserInteracting(true);
    } else {
      setUserInteracting(false);
      SpinGlobe();
    }
  };

  // Handles the click event on the map. If a cluster is clicked, it retrieves the cluster's ID and
  // triggers the expansion zoom effect, updating the map view to focus on the clicked cluster's center
  // with a smooth easing motion and adjusted zoom level.
  const onClick = (event: MapLayerMouseEvent) => {
    if (event.features) {
      const feature = event.features[0];
      const clusterId = feature.properties?.cluster_id;

      // retrieves the GeoJSON source named 'earthquakes' from the Mapbox map instance, casting it to the GeoJSON source type
      const mapboxSource = mapRef.current?.getSource('earthquakes') as mapboxgl.GeoJSONSource;

      // Retrieves the cluster expansion zoom level for a given cluster ID using the Mapbox GeoJSON source.
      // If successful, it updates the map view to focus on the clicked cluster, easing to the new center and zoom level.
      mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) {
          return;
        }

        if (feature.geometry.type === 'Point') {
          const coordinates00 = feature.geometry.coordinates[0];
          const coordinates01 = feature.geometry.coordinates[1];
          mapRef.current?.easeTo({
            center: [coordinates00, coordinates01],
            zoom,
            duration: 500
          });
        }
      });
    }
  };

  return (
    <div className='h-screen'>
      {/* The Map component represents the core Mapbox GL JS instance. It renders and manages the map view
      and interacts with various Mapbox features, such as layers and sources. */}
      <Map
        initialViewState={{
          latitude: 40.67,
          longitude: -103.59,
          zoom: 2.3
        }}
        mapStyle={'mapbox://styles/mapbox/dark-v11'}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
        ref={mapRef}
        onLoad={() => SpinGlobe()}
        onMouseDown={e => handleUserInteraction(e)}
        onMouseUp={e => handleUserInteraction(e)}
        onMoveEnd={() => SpinGlobe()}
        interactiveLayerIds={['clusters']}
        onClick={e => onClick(e)}

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