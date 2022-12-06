import React from "react";
import "./ArtistInfo.css";

const ArtistInfo = (props) => {
  return (
    <div className="ArtistInfo">
      <p>{props.name}</p>
      <img src={props.img} />
    </div>
  );
};

export default ArtistInfo;
