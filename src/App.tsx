import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import data from "./data.json";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Card, { CardType } from "./components/Card";
import ImageModal from "./components/ImageModal";
import moment from "moment";
import { API_URL } from "./constants";
import mocktasks from "./mockData.json";
import AddTaskModal from "./components/AddTaskModal";
const initialData: CardType[] = data;

export interface TaskType {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
}

const initialTaskData: TaskType[] = mocktasks;

function App() {
  const [cards, setCards] = useState<CardType[]>(initialData);

  const [lastSavedTime, setLastSavedTime] = useState("");
  const lastSavedOrder = useRef<number[]>([]);

  const [imageURL, setImageURL] = useState<string | null>(null);

  const [addNewTask, setAddNewTask] = useState(false);
  const [tasks, setTasks] = useState<TaskType[]>(initialTaskData);
  useEffect(() => {
    const fetchOrder = async () => {
      const response = await fetch(API_URL);
      const savedPositions = await response.json();

      if (savedPositions?.length) {
        const reorderedCards = savedPositions.map((position: number) =>
          initialData.find((card) => card.position === position)
        );
        setCards(reorderedCards);
        lastSavedOrder.current = savedPositions;
      }
    };

    fetchOrder();
  }, []);

  const saveOrder = useCallback(async () => {
    const currentPositions = cards.map((card) => card.position);

    if (
      JSON.stringify(lastSavedOrder.current) !==
      JSON.stringify(currentPositions)
    ) {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPositions),
      });

      if (response.ok) {
        lastSavedOrder.current = currentPositions;
        setLastSavedTime(new Date().toISOString());
      }
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

  const onAddNewTask = (
    title: string,
    category: string,
    description: string
  ) => {
    setTasks((prev) => {
      const oldtasks = [...prev];
      oldtasks.push({
        id: oldtasks.length + 1,
        title,
        category,
        description,
        status: "pending",
      });
      return oldtasks;
    });
  };

  const onMarkDone = (id: number) => {
    setTasks((prev) => {
      return prev.map((task) =>
        task.id === id ? { ...task, status: "completed" } : task
      );
    });
  };

  const onDelete = (id: number) => {
    setTasks((prev) => {
      const oldtasks = [...prev];
      return oldtasks.filter((task) => task.id !== id);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-4xl p-2">List DND</h1>
        {lastSavedTime && <p>Last Saved {moment(lastSavedTime).fromNow()}</p>}
        <button onClick={() => setAddNewTask(true)}>Add Task</button>
        <div className="flex-col gap-5 p-4">
          {tasks.map(({ id, title, description, category, status }) => (
            <div className="flex border p-6 m-2 w-full justify-between">
              <div>
                <p>{title}</p>
                <p>{description}</p>
                <p>{category}</p>
                <p>{status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => onMarkDone(id)}>Done</button>
                <button onClick={() => onDelete(id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {addNewTask && (
          <AddTaskModal
            onClickSave={onAddNewTask}
            close={() => setAddNewTask(false)}
          />
        )}
        {/* <DndProvider backend={HTML5Backend}>
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
        </DndProvider> */}

        {imageURL && (
          <ImageModal url={imageURL} close={() => setImageURL(null)} />
        )}
      </header>
    </div>
  );
}

export default App;
