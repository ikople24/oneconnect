import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { SketchPicker } from "react-color";

export const ZoneColorSelected = ({ zone, onZoneChange,isEdit = false }) => {
  console.log('zone color',zone)
  const [clonedZone, setClonedZone] = useState(null);
  const [activeColorPicker, setActiveColorPicker] = useState(null);
  const [colors, setColors] = useState({});

  const getRandomHex = () => {
    const hex = Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0");
    return `#${hex}`;
  };

  const hexToRgba = (hex, alpha = 0.5) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };

 useEffect(() => {
   if (zone && !isEdit) {
     const deepClone = JSON.parse(JSON.stringify(zone));
     const initialColors = {};

     deepClone.features.forEach((feature, index) => {
       const hex = getRandomHex();
       const rgba = hexToRgba(hex);
       feature.properties.color = rgba;
       initialColors[index] = rgba;
     });

     setClonedZone(deepClone);
     setColors(initialColors);
     if (onZoneChange) onZoneChange(deepClone); // ← update parent
   }else if(zone && isEdit){
    const deepClone = JSON.parse(JSON.stringify(zone));
    setClonedZone(deepClone);
    const initialColors = {};
    deepClone.features.forEach((feature, index) => {
      const rgba = feature.properties.color;
      initialColors[index] = rgba;
    });
    setColors(initialColors);
    if (onZoneChange) onZoneChange(deepClone);
   }


 }, [zone]);

 const handleColorChange = (index, color) => {
   const rgba = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},0.2)`;
   setColors((prev) => ({ ...prev, [index]: rgba }));

   setClonedZone((prev) => {
     const updated = { ...prev };
     updated.features[index].properties.color = rgba;
     if (onZoneChange) onZoneChange(updated); // ← update parent on change
     return updated;
   });
 };

  if (!clonedZone) return null;

  return (
    <div className="flex gap-5 flex-wrap">
      {clonedZone.features.map((feature, index) => (
        <div key={index} className="relative">
          <Button
            className="px-4 py-2 border rounded-xl relative hover:cursor-pointer"
            onClick={() => setActiveColorPicker(index)}
            style={{ backgroundColor: colors[index] || "#ffffff" }}
          >
            {feature.properties.community || feature.properties.comunity || "N/A"}
          </Button>

          {activeColorPicker === index && (
            <div className="absolute z-10 mt-2">
              <SketchPicker
                color={colors[index] || "#ffffff"}
                onChange={(color) => handleColorChange(index, color)}
                onChangeComplete={() => setActiveColorPicker(null)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
