import { useEffect, useState } from "react";
import Button from "../../components/Button";
import DropdownInput from "../../components/Dropdown";
import NavigationBar from "../../components/NavigationBar";
import Task from "../../components/Task";
import useTask from "../../hooks/useTask";
import { TaskType } from "../../types/task.types";

const CurrentTask = () => {
  const {
    tasks,
    loading,
    setTasks,
    updateTask,
    fetchTasks
  } = useTask();

  useEffect(() => {
      fetchTasks(); // Refresh tasks every time this page is entered
    }, []);
  const [deletedSortOption, setDeletedSortOption] = useState<string>("DELETE DATE");
  
  const deletedTasks = tasks.filter(task => task.deleted);

  const sortTasks = (tasks: TaskType[], sortBy: string) => {
      return [...tasks].sort((a, b) => {
        console.log(tasks)
  
        if (sortBy === "DELETE DATE") {
          const aDate = new Date(`${a.deletedDate}`);
          const bDate = new Date(`${b.deletedDate}`);
          return bDate.getTime() - aDate.getTime(); // soonest first
        }
    
        if (sortBy === "PRIORITY HIGH TO LOW") {
          return b.priority - a.priority; // higher enum = higher priority
        }
    
        if (sortBy === "PRIORITY LOW TO HIGH") {
          return a.priority - b.priority;
        }
    
        return 0;
      });
    };

    const sortedDeletedTasks = sortTasks(deletedTasks, deletedSortOption);


  const handleClickRecovery = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to recovery this task?");
    if (!confirmed) return;
  
    const task = tasks.find(task => task.id === id);
    if (!task) return;
    
    const updatedTask = {
      ...task,
      deleted: false,
      deleteTime: new Date('1000-01-01T00:00:00'), // Set delete time to now
    };
    
    await updateTask(id, updatedTask);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }

  return (
    <div>
      <NavigationBar showMenu/>
      <main className="flex flex-col gap-6 p-6 sm:px-12">
        {/*Delete Tasks List */}
      <section className="flex flex-col items-center gap-12 light_border bg-light_main px-4 py-12 sm:px-12">
          {/* if loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12 w-full">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
            </div>
          ) :
          // if have no task show icon
          sortedDeletedTasks.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-center w-full">
              Hello World
            </div>
          ) :
          // default task list show
          (
            <>
              <header className="flex flex-col gap-4">
                <h2 className="text-2xl text-center">DELETE TASK</h2>
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-sm">SORT BY</span>
                  <DropdownInput
                    className="w-60"
                    label="DELETE DATE"
                    options={["DELETE DATE", "PRIORITY HIGH TO LOW", "PRIORITY LOW TO HIGH"]}
                    onSelect={setDeletedSortOption}
                  />
                </div>
              </header>

              <div className="flex w-full flex-col gap-2">
                {/* Header Row */}
                <div className="hidden w-full h-fit items-center gap-2 bg-light_main px-2 sm:flex">
                  <div className="hidden h-fit w-50 items-center justify-center md:flex">DELETE DATE</div>
                  <div className="flex flex-1 items-center justify-center px-5">TASK NAME</div>
                  <div className="hidden h-fit w-28 items-center justify-center lg:flex">PRIORITY</div>
                  <div className="hidden h-fit w-40 items-center justify-center xl:flex">DUE DATE</div>
                  <div className="hidden h-fit w-24 items-center justify-center xl:flex">DUE TIME</div>
                  <Button className="invisible">RECOVERY</Button>
                </div>

                {/* Tasks */}
                {sortedDeletedTasks.map(task => (
                  <Task
                    key={task.id}
                    {...task}
                    onClickDelete={() => handleClickRecovery(task.id)}
                  />
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </div>
    
    
      
      
    
  );
};

export default CurrentTask;
