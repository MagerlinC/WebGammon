import React from "react";
import "./board-half.scss";
import Piece from "../piece/piece";
import { Droppable, Draggable } from "react-virtualized-dnd";

const BoardHalf = ({ pieces, groupName, top, curPlayer, middleIndex }) => {
  return (
    <div key={"board-half" + (top ? " top" : "")} className={"board-half"}>
      {pieces.map((position, index) => (
        <div
          key={
            "board-position-line-wrapper" + (top ? index : index + middleIndex)
          }
          className={"board-position-line-wrapper"}
        >
          <div
            key={"board-position-line-" + (top ? index : index + middleIndex)}
            className={
              "board-position-line" +
              (index % 2 === (top ? 0 : 1) ? " black" : " white")
            }
          >
            <div className={"board-position-triangle"}>
              {top ? index : index + middleIndex}
            </div>
            <Droppable
              placeholderStyle={{ height: "40px", width: "40px" }}
              key={"board-line-" + (top ? index : index + middleIndex)}
              containerHeight={250}
              droppableId={"board-line-" + (top ? index : index + middleIndex)}
              elemHeight={42}
              enforceContainerMinHeight={true}
              dragAndDropGroup={groupName}
            >
              {position.pieces.map((pieceColor, idx) => (
                <Draggable
                  disabled={curPlayer !== pieceColor}
                  dragAndDropGroup={groupName}
                  key={
                    "piece-" + (top ? index : middleIndex + index) + "-" + idx
                  }
                  draggableId={
                    "piece-" + (top ? index : middleIndex + index) + "-" + idx
                  }
                >
                  <Piece
                    key={
                      "pieceelem-" +
                      (top ? index : middleIndex + index) +
                      "-" +
                      idx
                    }
                    groupName={groupName}
                    color={pieceColor}
                  />
                </Draggable>
              ))}
            </Droppable>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BoardHalf;
