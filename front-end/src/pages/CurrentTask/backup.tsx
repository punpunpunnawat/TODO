import React, { useEffect, useState } from "react";
import { Priority, TaskType } from "../../types/task.types";
import { default as DatePicker } from "react-datepicker";
import Task from "../../components/Task";
import Button from "../../components/Button";
import NavigationBar from "../../components/NavigationBar";
import DropdownInput from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import useTaskContext from '../../hooks/useTask';


const fetchTasksFromDatabase = async (): Promise<TaskType[]> => {
  return new Promise<TaskType[]>((resolve, reject) => {
    fetch("http://localhost:8080/tasks")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return response.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          console.warn("Invalid data format: Expected an array. Returning empty task list.");
          resolve([]); // Return empty array instead of throwing
          return;
        }

        const tasksWithDates: TaskType[] = data
          .filter((task) =>
            task &&
            typeof task.id === "number" &&
            typeof task.label === "string" &&
            typeof task.priority === "string" &&
            typeof task.dueTime === "string" &&
            typeof task.done === "boolean"
          )
          .map((task) => ({
            ...task,
            dueTime: new Date(task.dueTime),
            priority: Priority[task.priority as keyof typeof Priority] ?? Priority.MEDIUM,
          }));

        console.log(tasksWithDates);
        resolve(tasksWithDates);
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
        reject(err);
      });
  });
};





const CurrentTask = () => {

    
  //State
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const activeTasks = tasks.filter(task => !task.done);
  const doneTasks = tasks.filter(task => task.done);

  //Add new task input
  const [priorityInput, setPriorityInput] = useState<Priority>(Priority.MEDIUM);
  const [dueTimeInput, setDueTimeInput] = useState<Date | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>("");
  const [activeSortOption, setActiveSortOption] = useState<string>("TIME LEFT");
  const [doneSortOption, setDoneSortOption] = useState<string>("TIME LEFT");
  const [loading, setLoading] = useState(true);

  // Fetch tasks from the "database" when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tasksFromDB = await fetchTasksFromDatabase();
        setTasks(tasksFromDB);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load tasks:", err);
        setLoading(false); // Set loading to false even if an error occurs
      }
    };
    fetchData();
  }, []);
  

  const handleClickMarkAsDone = (id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleClickDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
  
      // Fetch updated task list after deletion
      const tasksFromDB = await fetchTasksFromDatabase();
      setTasks(tasksFromDB);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };
  
  

  const handleChangeTaskNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskNameInput(event.target.value);
  }

  const handleConfirmToAddTask = async () => {
    if (!taskNameInput || !dueTimeInput ) {
      alert("Please enter a task name and select a due date/time.");
      return;
    }
  
    const now = new Date();
    if (dueTimeInput.getTime() < now.getTime()) {
      alert("The due date/time cannot be in the past.");
      return;
    }
  
    const newTask = {
      label: taskNameInput,
      priority: priorityInput, // this should be "HIGH", "MEDIUM", or "LOW"
      dueTime: dueTimeInput.toISOString(), // backend expects string
      done: false,
    };

    console.log(newTask)
  
    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error("Failed to add task");
      }
  
      // After adding, fetch updated tasks again
      const tasksFromDB = await fetchTasksFromDatabase();
      setTasks(tasksFromDB);
  
      // Reset input fields
      setTaskNameInput("");
      setDueTimeInput(null);
      setPriorityInput(Priority.MEDIUM);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };
  

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
      if (sortBy === "TIME LEFT") {
        const aDate = new Date(`${a.dueTime}`);
        const bDate = new Date(`${b.dueTime}`);
        return aDate.getTime() - bDate.getTime(); // soonest first
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
  const sortedDoneTasks = sortTasks(doneTasks, doneSortOption);
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


        {/*Done Tasks List */}
        <section className="flex flex-col items-center gap-12 light_border bg-light_main px-4 py-12 sm:px-12 brightness-95">
          {/* if loading */}
          {loading ? (
            <div className="flex items-center justify-center py-12 w-full">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
            </div>
          ) :
          // if have no task show icon
          sortedDoneTasks.length === 0 ? (
            <div className="flex justify-center items-center py-12 text-center w-full">
              Hello World
            </div>
          ) :
          // default task list show
          (
            <>
              <header className="flex flex-col gap-4">
                <h2 className="text-2xl text-center">DONE TASK</h2>
                <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
                  <span className="text-sm">SORT BY</span>
                  <DropdownInput
                    className="w-60"
                    label="TIME LEFT"
                    options={["TIME LEFT", "PRIORITY HIGH TO LOW", "PRIORITY LOW TO HIGH"]}
                    onSelect={setDoneSortOption}
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
                {sortedDoneTasks.map(task => (
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
