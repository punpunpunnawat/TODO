import React, { useEffect, useState } from "react";
import { Priority, TaskType } from "../../types/task.types";
import { default as DatePicker } from "react-datepicker";
import Task from "../../components/Task";
import Button from "../../components/Button";
import NavigationBar from "../../components/NavigationBar";
import DropdownInput from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import useTask from "../../hooks/useTask";
import { v4 as uuidv4 } from 'uuid';
import useGlobal from "../../hooks/useGlobal";
import { useNavigate } from "react-router-dom";

const CurrentTask = () => {

  const {
    tasks,
    loading,
    addTask,
    updateTask,
    fetchTasks
  } = useTask();

  const  {
    userID,
    loggedIn
  } = useGlobal();
  
  const navigate = useNavigate();

  //Define tasks
  const activeTasks = tasks.filter(task => !task.completed && !task.deleted);
  const completeTasks = tasks.filter(task => task.completed && !task.deleted);

  //Add new task input
  const [priorityInput, setPriorityInput] = useState<Priority | null>(null);
  const [dueDateInput, setDueDateInput] = useState<Date | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>("");
  const [activeSortOption, setActiveSortOption] = useState<string>("TIME LEFT");
  const [completeSortOption, setCompleteSortOption] = useState<string>("COMPLETE DATE");
  
  useEffect(() => {
    console.log("login a yang"+loggedIn)
    if (loggedIn === false) {
      navigate("/login");
      console.log("go back!!!!")
      return;
    }
    if (loggedIn === true) {
      fetchTasks();
    }
  }, [loggedIn]);

  const handleClickMarkAsDone = async (id: string) => {
    const task = tasks.find(task => task.id === id);
    if (!task) return;
  
    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedDate: new Date(),
    };
  
    try {
      await updateTask(id, updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
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
      deletedDate: new Date(),
    };

    try {
      await updateTask(id, updatedTask);
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const handleConfirmToAddTask = async () => {
    if (!taskNameInput) {
      alert("Please enter a task name.");
      return;
    }
  
    const now = new Date();
    if (dueDateInput && dueDateInput.getTime() < now.getTime())
    {
      alert("The due date/time cannot be in the past.");
      return;
    }
    
  
    const newTask = {
      id: uuidv4(),
      userID: userID,
      label: taskNameInput,
      priority: priorityInput ?? Priority.MEDIUM,
      dueDate: dueDateInput ?? new Date('9000-01-01T00:00:00'),
      completed: false,
      deleted: false,
      completedDate: new Date('1000-01-01T00:00:00'),
      deletedDate: new Date('1000-01-01T00:00:00'),
      createDate: now
    };
  
    try {
      await addTask(newTask);
    } catch (error) {
      console.error('Failed to update task:', error);
    }

    // Clear input fields
    setTaskNameInput("");
    setDueDateInput(null);
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
        const aDate = new Date(`${a.dueDate}`);
        const bDate = new Date(`${b.dueDate}`);
        return aDate.getTime() - bDate.getTime(); // soonest first
      }

      if (sortBy === "COMPLETE DATE") {
        const aDate = new Date(`${a.completedDate}`);
        const bDate = new Date(`${b.completedDate}`);
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
      <NavigationBar showMenu />

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
                    selected={dueDateInput}
                    onChange={(date: Date | null) => setDueDateInput(date)}
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
                {sortedActiveTasks.map(task => {

                console.log("Rendering Task:", task);
                console.log("Date is:", task.dueDate);

                return (
                  <Task
                    key={task.id}
                    {...task}
                    onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                    onClickDelete={() => handleClickDelete(task.id)}
                  />
                );
              })}

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
