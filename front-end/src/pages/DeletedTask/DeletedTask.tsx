import { useEffect } from "react";
import NavigationBar from "../../components/NavigationBar";
import useTask from "../../hooks/useTask";
import { TaskListCategory } from "../../types/task.types";
import TaskList from "../../components/TaskList";

const CurrentTask = () => {
  
  const { fetchTasks } = useTask();

  useEffect(() => {
    fetchTasks(); // Refresh tasks every time this page is entered
  }, []);

  return (
    <div>
      <NavigationBar showMenu />
      <main className="flex flex-col gap-6 p-6 sm:px-12">
        <TaskList category={TaskListCategory.DELETED} />
      </main>
    </div>
  );
};

export default CurrentTask;
