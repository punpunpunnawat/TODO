import { useEffect } from "react";
import NavigationBar from "../../components/NavigationBar";
import useTask from "../../hooks/useTask";
import { TaskListCategory } from "../../types/task.types";
import TaskList from "../../components/TaskList";
import { useNavigate } from "react-router-dom";
import useGlobal from "../../hooks/useGlobal";

const DeletedTask = () => {
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
        <TaskList category={TaskListCategory.DELETED} />
      </main>
    </div>
  );
};

export default DeletedTask;
