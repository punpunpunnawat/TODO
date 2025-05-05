import React, { useState } from "react";
import { Priority, TaskType } from "../../types/task.types";
import { default as DatePicker } from "react-datepicker";
import Task from "../../components/Task";
import Button from "../../components/Button";
import NavigationBar from "../../components/NavigationBar";
import DropdownInput from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import useTask from "../../hooks/useTask";
import { v4 as uuidv4 } from 'uuid';

const CurrentTask = () => {

  const {
    tasks,
    loading,
    addTask,
    updateTask,
    setTasks
  } = useTask();

  // State
  const activeTasks = tasks.filter(task => !task.completed && !task.deleted);
  const completeTasks = tasks.filter(task => task.completed && !task.deleted);


  console.log(activeTasks)
  console.log(completeTasks)
  //Add new task input
  const [priorityInput, setPriorityInput] = useState<Priority>(Priority.MEDIUM);
  const [dueTimeInput, setDueTimeInput] = useState<Date | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>("");
  const [activeSortOption, setActiveSortOption] = useState<string>("TIME LEFT");
  const [completeSortOption, setCompleteSortOption] = useState<string>("COMPLETE DATE");
  
  // useEffect(() => {
  //   fetchTasks(); // Refresh tasks every time this page is entered
  // }, []);
  
  const handleClickMarkAsDone = async (id: string) => {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
  
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completeTime: new Date(), // Set to current time when marked as done
    };
  
    // Update the task in the database
    await updateTask(id, updatedTask);
  
    // Update the local state to reflect the completion status without re-fetching
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === id ? updatedTask : task))
    );
  };
  

  

  const handleClickDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    const task = tasks.find(task => task.id === id);
    if (!task) return;

    // Mark the task as deleted in the database
    const updatedTask = {
      ...task,
      deleted: true,
      deleteTime: new Date(), // Set delete time to now
    };

    // Update the task in the database (without re-fetching all tasks)
    await updateTask(id, updatedTask);

    // Remove the task from the local state without re-fetching
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };


  
  const handleConfirmToAddTask = async () => {
    if (!taskNameInput || !dueTimeInput) {
      alert("Please enter a task name and select a due date/time.");
      return;
    }
  
    const now = new Date();
    if (dueTimeInput.getTime() < now.getTime()) {
      alert("The due date/time cannot be in the past.");
      return;
    }
  
    const newTask = {
      id: uuidv4(),
      label: taskNameInput,
      priority: priorityInput,
      dueTime: dueTimeInput,
      completed: false,
      deleted: false,
      completeTime: new Date('1000-01-01T00:00:00'),
      deleteTime: new Date('1000-01-01T00:00:00')
    };
  
    // Add new task to the database
    await addTask(newTask);
  
    // Add the new task directly to local state without re-fetching
    setTasks(prevTasks => [...prevTasks, newTask]);
  
    // Clear input fields
    setTaskNameInput("");
    setDueTimeInput(null);
    setPriorityInput(Priority.MEDIUM);
  };
  
  
  

  const handleChangeTaskNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskNameInput(event.target.value);
  }
  

  const handlePrioritySelectInput = (selectedPriority: string) => {
    switch (selectedPriority) {
      case "HIGH":
        setPriorityInput(Priority.HIGH)
        break;
      case "MEDIUM":
        setPriorityInput(Priority.MEDIUM)
        break;
      case "LOW":
        setPriorityInput(Priority.LOW)
        break;
      default:
        console.log("No priority selected");
    }
  };

  const sortTasks = (tasks: TaskType[], sortBy: string) => {
    return [...tasks].sort((a, b) => {
      console.log(tasks)
      if (sortBy === "TIME LEFT") {
        const aDate = new Date(`${a.dueTime}`);
        const bDate = new Date(`${b.dueTime}`);
        return aDate.getTime() - bDate.getTime(); // soonest first
      }

      if (sortBy === "COMPLETE DATE") {
        const aDate = new Date(`${a.completeTime}`);
        const bDate = new Date(`${b.completeTime}`);
        return bDate.getTime() - aDate.getTime(); // lastest first
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
  const sortedActiveTasks = sortTasks(activeTasks, activeSortOption);
  const sortedcompleteTasks = sortTasks(completeTasks, completeSortOption);
  console.log(tasks)
  return (
    <div>
      <NavigationBar username="punpunpunnawat" loggedIn />

      <main className="flex flex-col gap-6 p-6 sm:px-12">
        
        {/* Add New Task */}
        <section className="hidden md:flex flex-col xl:flex-row items-center gap-4 p-12 light_border bg-light_main">
          <h2 className="text-base">ADD NEW TASK</h2>
            <div className="flex flex-1 w-full items-center gap-4">
              <div className="flex flex-1 flex-col xl:flex-row items-center gap-4 xl:gap-2">
                <div className="flex w-full items-center gap-2">
                  <DropdownInput
                  label="PRIORITY"
                  options={["HIGH", "MEDIUM", "LOW"]}
                  onSelect={handlePrioritySelectInput}
                  className="w-30"
                />
                <div>
                  <DatePicker
                    selected={dueTimeInput}
                    onChange={(date: Date | null) => setDueTimeInput(date)}
                    dateFormat="yyyy-MM-dd HH:mm"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    placeholderText="SELECT DUE DATE"
                    className="h-10 w-45 light_border light_main bg-light_main px-4 focus:outline-none focus:ring-0 focus:border-light_dark transition-all duration-300"
                  />
                </div>
                <input
                  type="text"
                  value={taskNameInput}
                  onChange={handleChangeTaskNameInput}
                  placeholder="TASK NAME"
                  className="h-10 flex-1 light_border px-4"
                />
                </div>
              
            <Button onClick={handleConfirmToAddTask}>CONFIRM</Button>
          </div>
        </div>
          
        </section>

        {/* Add new Task : Mobile */}
        <Button className="md:hidden">
          ADD TASK
        </Button>

        {/*Current Tasks List */}
        <section className="flex flex-col items-center gap-12 light_border bg-light_main px-4 py-12 sm:px-12">
          {/* if Loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12 w-full">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
            </div>
          ) :
          // if have no task show icon
          sortedActiveTasks.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-center w-full">
              Hello World
            </div>
          ) :
          // default task list show
          (
            <>
              <header className="flex flex-col gap-4">
                <h2 className="text-2xl text-center">CURRENT TASK</h2>
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-sm">SORT BY</span>
                  <DropdownInput
                    className="w-60"
                    label="TIME LEFT"
                    options={["TIME LEFT", "PRIORITY HIGH TO LOW", "PRIORITY LOW TO HIGH"]}
                    onSelect={setActiveSortOption}
                  />
                </div>
              </header>

              <div className="flex w-full flex-col gap-2">
                {/* Header Row */}
                <div className="hidden w-full h-fit items-center gap-2 bg-light_main px-2 sm:flex">
                  <div className="invisible h-10 w-10" />
                  <div className="hidden h-fit w-50 items-center justify-center md:flex">TIME LEFT</div>
                  <div className="flex flex-1 items-center justify-center px-5">TASK NAME</div>
                  <div className="hidden h-fit w-28 items-center justify-center lg:flex">PRIORITY</div>
                  <div className="hidden h-fit w-40 items-center justify-center xl:flex">DUE DATE</div>
                  <div className="hidden h-fit w-24 items-center justify-center xl:flex">DUE TIME</div>
                  <Button className="invisible">DELETE</Button>
                </div>

                {/* Tasks */}
                {sortedActiveTasks.map(task => (
                  <Task
                    key={task.id}
                    {...task}
                    onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                    onClickDelete={() => handleClickDelete(task.id)}
                  />
                ))}
              </div>
            </>
          )}
        </section>


        {/*COMPLETE Tasks List */}
        <section className="flex flex-col items-center gap-12 light_border bg-light_main px-4 py-12 sm:px-12 brightness-95">
          {/* if loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12 w-full">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
            </div>
          ) :
          // if have no task show icon
          sortedcompleteTasks.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-center w-full">
              Hello World
            </div>
          ) :
          // default task list show
          (
            <>
              <header className="flex flex-col gap-4">
                <h2 className="text-2xl text-center">COMPLETE TASK</h2>
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-sm">SORT BY</span>
                  <DropdownInput
                    className="w-60"
                    label="COMPLETE DATE"
                    options={["COMPLETE DATE", "PRIORITY HIGH TO LOW", "PRIORITY LOW TO HIGH"]}
                    onSelect={setCompleteSortOption}
                  />
                </div>
              </header>

              <div className="flex w-full flex-col gap-2">
                {/* Header Row */}
                <div className="hidden w-full h-fit items-center gap-2 bg-light_main px-2 sm:flex">
                  <div className="invisible h-10 w-10" />
                  <div className="hidden h-fit w-50 items-center justify-center md:flex">COMPLETE DATE</div>
                  <div className="flex flex-1 items-center justify-center px-5">TASK NAME</div>
                  <div className="hidden h-fit w-28 items-center justify-center lg:flex">PRIORITY</div>
                  <div className="hidden h-fit w-40 items-center justify-center xl:flex">DUE DATE</div>
                  <div className="hidden h-fit w-24 items-center justify-center xl:flex">DUE TIME</div>
                  <Button className="invisible">DELETE</Button>
                </div>

                {/* Tasks */}
                {sortedcompleteTasks.map(task => (
                  <Task
                    key={task.id}
                    {...task}
                    onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                    onClickDelete={() => handleClickDelete(task.id)}
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
