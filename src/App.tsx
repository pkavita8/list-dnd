import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import data from "./data.json";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card, { CardType } from "./components/Card";
import ImageModal from "./components/ImageModal";
import moment from "moment";

const initialData: CardType[] = data;

function App() {

  const [cards, setCards] = useState<CardType[]>(initialData);
  
  const [lastSavedTime, setLastSavedTime] = useState("");
  const lastSavedOrder = useRef<number[]>([]);

  const [imageURL, setImageURL] = useState<string | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("order");
    if (savedOrder) {
      const savedPositions = JSON.parse(savedOrder);
      const reorderedCards = savedPositions.map((position: number) =>
        initialData.find((card) => card.position === position)
      );
      setCards(reorderedCards);
      lastSavedOrder.current = savedPositions;
    }
  }, []);

  const saveOrder = useCallback(() => {
    const currentPositions = cards.map((card) => card.position);
    if (
      JSON.stringify(lastSavedOrder.current) !==
      JSON.stringify(currentPositions)
    ) {
      localStorage.setItem("order", JSON.stringify(currentPositions));
      lastSavedOrder.current = currentPositions;
      setLastSavedTime(new Date().toISOString());
    }
  }, [cards]);

  useEffect(() => {
    const interval = setInterval(() => {
      saveOrder();
    }, 5000);

    return () => clearInterval(interval);
  }, [saveOrder]);

  const moveCard = (fromIndex: number, toIndex: number) => {
    const updatedCards = [...cards];
    const [movedCard] = updatedCards.splice(fromIndex, 1);
    updatedCards.splice(toIndex, 0, movedCard);
    setCards(updatedCards);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl p-2">List DND</h1>
        {lastSavedTime && (
          <p>Last Saved at {moment(lastSavedTime).format('MMMM Do YYYY, h:mm:ss a')}</p>
        )}
        <DndProvider backend={HTML5Backend}>
          <div className="grid grid-cols-3 gap-5 p-4">
            {cards.map((element, index) => (
              <Card
                key={`${element.position}_${element.title}`}
                id={element.position}
                {...element}
                moveCard={moveCard}
                index={index}
                setImageUrl={(url: string) => setImageURL(url)}
              />
            ))}
          </div>
        </DndProvider>

        {imageURL && (
          <ImageModal url={imageURL} close={() => setImageURL(null)} />
        )}
      </header>
    </div>
  );
}

export default App;
