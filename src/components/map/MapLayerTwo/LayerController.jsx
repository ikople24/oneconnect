import { useMemo } from "react";
import { LayersControl, TileLayer } from "react-leaflet";
import { useMapEvents } from "react-leaflet";
import styles from "@/components/map/tooltip.module.css";

export const LayerControllerHandler = ({layerMap}) => {
  const layers = useMemo(
    () => (
      <LayersControl position="topright">
        <LayersControl.BaseLayer
          name={"แผนที่ภาพถ่ายดาวเทียม"}
          checked={layerMap === "satellite"}
        >
          <TileLayer
            // url="https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            url="https://basemap.sphere.gistda.or.th/tiles/sphere_hybrid/EPSG3857/{z}/{x}/{y}.jpeg?key=85B54E0BD1F24BD5957582838B21094D"
            // attribution="&copy; Google Maps"
            // subdomains={["mt0", "mt1", "mt2", "mt3"]}
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer
          name={"แผนที่ถนน"}
          checked={layerMap === "roadmap"}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            maxZoom={20}
          />
        </LayersControl.BaseLayer>
      </LayersControl>
    ),
    []
  );

  return layers;
};


export const LayerChangeHandler = ({setLayerMap, geoJsonLayerRef}) => {
  useMapEvents({
    baselayerchange: (e) => {
      let layerName = "";
      console.log("e", e);
      if (e.name === "แผนที่ภาพถ่ายดาวเทียม") {
        layerName = "satellite";
        setLayerMap("satellite");
      } else if (e.name === "แผนที่ถนน") {
        layerName = "roadmap";
        setLayerMap("roadmap");
      }
      // if (geoJsonLayerRef.current) {
      //   console.log(layerName);
      //   geoJsonLayerRef.current.eachLayer((layer) => {
      //     const feature = layer.feature;
      //     layer.unbindTooltip();
      //     layer.bindTooltip(
      //       feature.properties.Shot_Name || feature.properties.community,
      //       {
      //         permanent: true,
      //         direction: "center",
      //         className:
      //           layerName !== "satellite"
      //             ? styles.tooltipSatellite
      //             : styles.tooltipRoadmap,
      //       }
      //     );
      //   });
      // }
    },
  });

  return null;
};
