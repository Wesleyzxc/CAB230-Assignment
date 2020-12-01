
import React from "react";
import { Map, TileLayer } from "react-leaflet";
import HeatmapLayer from 'react-leaflet-heatmap-layer';
import "./mainstyle.css";



/**
 * Creates a heatmap of total offences
 * @param {*} props accepts array of addressPoints and boolean to toggle map
 */
export function Maps(props) {
    let radius = 8;
    let blur = 8;
    let max = 1;
    let minOpacity = 0.05;
    const gradient = {
        0.1: "#89BDE0",
        0.2: "#96E3E6",
        0.4: "#82CEB6",
        0.6: "#FAF3A5",
        0.8: "#F5D98B",
        "1.0": "#DE9A96"
    };

    if (props.showMap === false) {
        return null;
    }

    return (
        <div align="center">
            <Map center={[-10, 0]} zoom={3}>
                {props.addressPoints.length > 1 && (
                    // Heatmap layer which gets the data points, and ability to change look of heatmap
                    <HeatmapLayer
                        fitBoundsOnLoad
                        fitBoundsOnUpdate
                        points={props.addressPoints}
                        longitudeExtractor={m => m[1]}
                        latitudeExtractor={m => m[0]}
                        gradient={gradient}
                        intensityExtractor={m => parseFloat(m[2])}
                        radius={Number(radius)}
                        blur={Number(blur)}
                        max={Number.parseFloat(max)}
                        minOpacity={minOpacity}
                    />
                )}
                {props.addressPoints.length === 1 && (
                    <HeatmapLayer
                        // Heatmap layer which gets the data points when there is only 1 data point, and ability to change look of heatmap
                        fitBoundsOnLoad
                        fitBoundsOnUpdate
                        points={props.addressPoints}
                        longitudeExtractor={m => props.addressPoints[0]}
                        latitudeExtractor={m => props.addressPoints[1]}
                        gradient={gradient}
                        intensityExtractor={m => parseFloat(props.addressPoints[2])}
                        radius={Number(radius)}
                        blur={Number(blur)}
                        max={Number.parseFloat(max)}
                        minOpacity={minOpacity}
                    />
                )}
                <TileLayer
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </Map>
        </div>
    );
}