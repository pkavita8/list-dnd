import React from "react";
import { useDrag, useDrop } from "react-dnd";

export interface CardType {
  title: string;
  type: string;
  position: number;
}

interface CardProps extends CardType {
  id: number;
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
  setImageUrl: (url: string) => void;
}

const Card = ({
  id,
  title,
  type,
  position,
  index,
  moveCard,
  setImageUrl,
}: CardProps) => {
  const [{ isDragging }, drag] = useDrag({
    type: "CardType",
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "CardType",
    hover(item: CardProps) {
      if (item.index !== index) {
        moveCard(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        padding: "10px",
        margin: "10px",
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
      }}
    >
      <div className="col-span-1 text-sm mb-5 border p-2 rounded-md">
        <p>{title}</p>
        <p>{type}</p>
        <p>{position}</p>
        <img
          alt={title}
          src={`https://placehold.co/600x40${position}`}
          onClick={() => setImageUrl(`https://placehold.co/600x40${position}`)}
        ></img>
      </div>
    </div>
  );
};
export default Card;
