import React, { useEffect, useState } from "react";
import { Priority, TaskType } from "../../types/task.types";
import { default as DatePicker } from "react-datepicker";
import Task from "../../components/Task";
import Button from "../../components/Button";
import NavigationBar from "../../components/NavigationBar";
import DropdownInput from "../../components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment-timezone';

// Set the global timezone to GMT+0700 (Indochina Time)
moment.tz.setDefault("Asia/Bangkok");  // Asia/Bangkok is GMT+0700

// Simulate an async fetch from a database
const fetchTasksFromDatabase = async (): Promise<TaskType[]> => {
  const mockData = [
    { id: 1, label: "Buy milk", priority: Priority.HIGH, dueTime: "2025-04-25T03:00:00+07:00", done: false },
    { id: 2, label: "Write code", priority: Priority.MEDIUM, dueTime: "2025-04-28T14:00:00+07:00", done: true },
    { id: 3, label: "Walk the dog", priority: Priority.LOW, dueTime: "2025-04-29T07:30:00+07:00", done: false },
    { id: 4, label: "Attend meeting", priority: Priority.HIGH, dueTime: "2025-04-28T10:30:00+07:00", done: false },
    { id: 5, label: "Call plumber", priority: Priority.MEDIUM, dueTime: "2025-04-30T16:00:00+07:00", done: false },
    { id: 6, label: "Read a book", priority: Priority.LOW, dueTime: "2025-05-01T20:00:00+07:00", done: true },
    { id: 7, label: "Submit report", priority: Priority.HIGH, dueTime: "2025-04-28T12:00:00+07:00", done: true },
    { id: 8, label: "Grocery shopping", priority: Priority.MEDIUM, dueTime: "2025-05-02T18:00:00+07:00", done: false },
    { id: 9, label: "Gym workout", priority: Priority.LOW, dueTime: "2025-05-01T06:30:00+07:00", done: true },
    { id: 10, label: "Prepare dinner", priority: Priority.MEDIUM, dueTime: "2025-04-28T19:00:00+07:00", done: false },
    { id: 11, label: "Dentist appointment", priority: Priority.HIGH, dueTime: "2025-04-29T11:00:00+07:00", done: false },
    { id: 12, label: "Email client", priority: Priority.MEDIUM, dueTime: "2025-04-30T09:45:00+07:00", done: true },
  ];

  // Simulate a delay as if fetching from a database
  return new Promise(resolve => {
    setTimeout(() => {
      // Convert the date strings to Date objects
      const tasksWithDates = mockData.map(task => ({
        ...task,
        dueTime: new Date(task.dueTime), // Convert date string to Date object
      }));
      resolve(tasksWithDates);
    }, 1000); // Simulate a 1-second delay
  });
};

const CurrentTask: React.FC = () => {

  //State
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const activeTasks = tasks.filter(task => !task.done);
  const doneTasks = tasks.filter(task => task.done);
  const [priorityInput, setPriorityInput] = useState<Priority>(Priority.MEDIUM);
  const [dueTimeInput, setDueTimeInput] = useState<Date | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>("");
  const [activeSortOption, setActiveSortOption] = useState<string>("TIME LEFT");
  const [doneSortOption, setDoneSortOption] = useState<string>("TIME LEFT");
  const [loading, setLoading] = useState(true);

  // Fetch tasks from the "database" when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const tasksFromDB = await fetchTasksFromDatabase();
      setTasks(tasksFromDB);
      setLoading(false)
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

  const handleClickDelete = (id: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  const handleChangeTaskNameInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTaskNameInput(event.target.value);
  }

  const handleConfirmToAddTask = () => {
    console.log(dueTimeInput);  // Log the original selected due date
  
    if (!taskNameInput || !dueTimeInput) {
      alert("Please enter a task name and select a due date/time.");
      return;
    }
  
    const now = new Date();
    if (dueTimeInput.getTime() < now.getTime()) {
      alert("The due date/time cannot be in the past.");
      return;
    }
  
    // Use moment to first convert the dueDate to UTC and then to the Asia/Bangkok timezone
    const adjustedDate = moment(dueTimeInput).utc().tz("Asia/Bangkok", true).toDate();
  
    // Create the new task with the adjusted time
    const newTask: TaskType = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      label: taskNameInput,
      priority: priorityInput,
      dueTime: dueTimeInput, // "YYYY-MM-DD"
      done: false,
    };
  
    console.log(adjustedDate.toISOString().split("T")[0]);  // Log date
    console.log(adjustedDate.toTimeString().slice(0, 5));  // Log time
    
    // Add the new task
    setTasks(prevTasks => [...prevTasks, newTask]);
  
    // Reset input fields
    setTaskNameInput("");
    setDueTimeInput(null);
    setPriorityInput(Priority.MEDIUM);
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
  
  return (
    <div>
    <NavigationBar username="punpunpunnawat" />

    <main className="flex flex-col gap-6 p-6 sm:px-12">
      
      {/* Add New Task */}
      <section className="hidden md:flex flex-col xl:flex-row items-center gap-4 p-12 light_border bg-light_main">
        <h2 className="text-lg">ADD NEW TASK</h2>
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


      {/* Current Tasks */}
      {sortedActiveTasks.length > 0 && 
      <section className="flex flex-col items-center gap-12 light_border bg-light_main px-4 py-12 sm:px-12">
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

        

        {/* Tasks List */}
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
            </div>
          ) : (
            sortedActiveTasks.map(task => (
              <Task
                key={task.id}
                {...task}
                onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                onClickDelete={() => handleClickDelete(task.id)}
              />
            ))
          )}
        </div>
      </section>}

      {/* Done Tasks */}
      {sortedDoneTasks.length > 0 && 
      <section className="flex flex-col items-center gap-12 light_border bg-light_main p-12 filter brightness-92">
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

        

        {/* Done Tasks List */}

        <div className="flex w-full flex-col gap-2">
          {/* Header Row */}
          <div className="hidden w-full h-fit items-center gap-2 bg-light_main px-2 sm:flex">
            <div className="invisible h-fit w-10" />
            <div className="hidden h-fit w-50 items-center justify-center md:flex">TIME LEFT</div>
            <div className="flex flex-1 items-center justify-center px-5">TASK NAME</div>
            <div className="hidden h-fit w-28 items-center justify-center lg:flex">PRIORITY</div>
            <div className="hidden h-fit w-40 items-center justify-center xl:flex">DUE DATE</div>
            <div className="hidden h-fit w-24 items-center justify-center xl:flex">DUE TIME</div>
            <Button className="invisible h-fit">DELETE</Button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
            </div>
          ) : (
            sortedDoneTasks.map(task => (
              <Task
                key={task.id}
                {...task}
                onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                onClickDelete={() => handleClickDelete(task.id)}
              />
            ))
          )}
        </div>
      </section>}
    </main>
  </div>
  );
};

export default CurrentTask;
