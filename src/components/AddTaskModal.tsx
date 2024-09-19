import { useState } from "react";

const AddTaskModal = ({
  onClickSave,
  close,
}: {
  onClickSave: (title: string, category: string, description: string) => void;
  close: VoidFunction;
}) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const onSubmit = () => {
    onClickSave(title, category, description);
    close();
  };
  return (
    <div className="fixed w-full h-full flex items-center justify-center bg-black top-0">
      <button
        onClick={() => close()}
        className="text-xxl w-10 h-10 rounded-md absolute right-2 top-2 bg-white text-black"
      >
        X
      </button>
      <div className="flex-col gap-10">
        <div className="mb-1">
          <p> Add a new Task</p>
        </div>
        <div>
          <label>Title : </label>
          <input
            className="text-white bg-transparent ml-4 border-white"
            type="text"
            name="title"
            value={title}
            placeholder="Enter Title"
            onChange={(event) => setTitle(event.target.value)}
          ></input>
        </div>
        <div className="mb-1">
          <label>description : </label>
          <input
            className="text-white bg-transparent ml-4 border-white"
            type="text"
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Enter Description"
          />
        </div>
        <div className="mb-1">
          <label>category : </label>
          <input
            className="text-white bg-transparent ml-4 border-white"
            type="text"
            name="category"
            value={category}
            placeholder="Enter Category"
            onChange={(event) => setCategory(event.target.value)}
          />
        </div>
        <div>
          <button onClick={() => onSubmit()}>Add</button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
