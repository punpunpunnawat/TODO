import React, { useEffect } from "react";
import { TaskListCategory,  } from "../../types/task.types";
import NavigationBar from "../../components/NavigationBar";
import "react-datepicker/dist/react-datepicker.css";
import useGlobal from "../../hooks/useGlobal";
import { useNavigate } from "react-router-dom";
import TaskList from "../../components/TaskList";
import AddTaskForm from "../../components/AddTaskForm";
import useTask from "../../hooks/useTask";

const CurrentTask = () => {

  const { fetchTasks } = useTask();
  const { loggedIn } = useGlobal();
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn === false) {
      navigate("/login");
      return;
    }
    fetchTasks();
  }, [fetchTasks, loggedIn, navigate]);

  return (
    <div>
      <NavigationBar showMenu />
      <main className="flex flex-col gap-6 p-6 sm:px-12">
        {/* Add New Task */}
        <AddTaskForm/>
        
        {/*Current Tasks List */}
        <TaskList category={TaskListCategory.CURRENT}/>

        {/*COMPLETE Tasks List */}
        <TaskList category={TaskListCategory.COMPLETED}/>
       
      </main>
    </div>
  );
};

export default CurrentTask;
