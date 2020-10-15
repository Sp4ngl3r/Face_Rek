import React from "react";
import "./FaceRek.css";

const FaceRek = ({ imageUrl, box }) => {
  return (
    <div className="center ma">
      <div className="absolute mt4">
        <img id="urlImage" src={imageUrl} alt="" width="600px" height="auto" />
        <div
          className="bounding-box"
          style={{
            left: box.leftCol,
            top: box.topRow,
            right: box.rightCol,
            bottom: box.bottomRow,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FaceRek;
