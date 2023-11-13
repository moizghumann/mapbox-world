import { MapLayerMouseEvent } from "mapbox-gl";
import { MapRef } from "react-map-gl";

interface Props {
    event: MapLayerMouseEvent,
    mapRef: React.RefObject<MapRef>
}

// Handles the click event on the map. If a cluster is clicked, it retrieves the cluster's ID and
// triggers the expansion zoom effect, updating the map view to focus on the clicked cluster's center
// with a smooth easing motion and adjusted zoom level.
const onClusterClick = ({ event, mapRef }: Props) => {
    if (!event.features) return;

    const feature = event.features[0];
    const clusterId = feature.properties?.cluster_id;

    // retrieves the GeoJSON source named 'earthquakes' from the Mapbox map instance, casting it to the GeoJSON source type
    const mapboxSource = mapRef.current?.getSource('earthquakes') as mapboxgl.GeoJSONSource;

    // Retrieves the cluster expansion zoom level for a given cluster ID using the Mapbox GeoJSON source.
    // If successful, it updates the map view to focus on the clicked cluster, easing to the new center and zoom level.
    mapboxSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

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
};

export default onClusterClick;