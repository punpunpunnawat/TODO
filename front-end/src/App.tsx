import { Route, Routes } from "react-router-dom";
import CurrentTask from "./pages/CurrentTask";
import DeletedTask from "./pages/DeletedTask";
import Login from "./pages/Login";
import Test from "./pages/Test";

export default function App() {
  
  return (
    <>
     <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/current-task" element={<CurrentTask />} />
        <Route path="/deleted-task" element={<DeletedTask />} />
        <Route path="/test" element={<Test />} />
      </Routes>
    </>
  );
};

