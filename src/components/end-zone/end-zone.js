import React from "react";
import "./end-zone.scss";
import { Droppable } from "react-virtualized-dnd";

const EndZone = ({ color, dragAndDropGroup, pieces }) => {
  return (
    <div className={"end-zone-wrapper " + color}>
      <div className={"player-indicator"}>{color + " " + pieces.length}</div>
      <Droppable
        placeholderStyle={{ display: "none" }}
        key={"end-zone-" + color}
        containerHeight={"100%"}
        droppableId={"end-zone-" + color}
        elemHeight={42}
        enforceContainerMinHeight={true}
        dragAndDropGroup={dragAndDropGroup}
      >
        <div className={"empty-contents-placeholder"}></div>
      </Droppable>
    </div>
  );
};

export default EndZone;
