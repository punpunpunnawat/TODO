import { Route, Routes } from "react-router-dom";
import CurrentTask from "./pages/CurrentTask";
import DeletedTask from "./pages/DeletedTask";

export default function App() {
  return (
    <>
     <Routes>
        <Route path="/" element={<CurrentTask />} />
        <Route path="/deleted-task" element={<DeletedTask />} />
      </Routes>
    </>
  );
};

