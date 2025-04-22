import React, { useState } from "react";
import { Priority, TaskType } from "./types/task.types";
import { default as DatePicker } from "react-datepicker";
import Task from "./components/Task";
import Button from "./components/Button";
import NavigationBar from "./components/NavigationBar";
import DropdownInput from "./components/Dropdown";
import "react-datepicker/dist/react-datepicker.css";

const initialTasks: TaskType[] = [
  { id: 1, label: "Buy milk", priority: Priority.HIGH, date: "2025-04-18", time: "09:00", done: false },
  { id: 2, label: "Write code", priority: Priority.MEDIUM, date: "2025-04-18", time: "14:00", done: true },
  { id: 3, label: "Walk the dog", priority: Priority.LOW, date: "2025-04-19", time: "07:30", done: false },
];

const App: React.FC = () => {

  //State
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);
  const activeTasks = tasks.filter(task => !task.done);
  const doneTasks = tasks.filter(task => task.done);
  const [priorityInput, setPriorityInput] = useState<Priority>(Priority.MEDIUM);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>("");

  //Handle Function
  const handleClickTest = () => {
    alert("Test");
  };

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
    if (!taskNameInput || !dueDate) {
      alert("Please enter a task name and select a due date/time.");
      return;
    }
  
    const newTask: TaskType = {
      id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
      label: taskNameInput,
      priority: priorityInput,
      date: dueDate.toISOString().split("T")[0], // "YYYY-MM-DD"
      time: dueDate.toTimeString().slice(0, 5),  // "HH:MM"
      done: false,
    };
  
    setTasks(prevTasks => [...prevTasks, newTask]);
  
    // Reset input fields
    setTaskNameInput("");
    setDueDate(null);
    setPriorityInput(Priority.MEDIUM);
  };

  const handlePrioritySelectInput = (selectedPriority: string) => {
    switch (selectedPriority) {
      case "High":
        setPriorityInput(Priority.HIGH)
        break;
      case "Medium":
        setPriorityInput(Priority.MEDIUM)
        break;
      case "Low":
        setPriorityInput(Priority.LOW)
        break;
      default:
        console.log("No priority selected");
    }
  };
  console.log(taskNameInput);
  console.log(priorityInput);
  console.log(dueDate);

  return (
    <div>

      <NavigationBar username={"punpunpunnawat"} />
      
      <div className="flex flex-col p-6 gap-6 sm:px-12">
        <div className="flex p-12 gap-4 light_border items-center bg-light_main">
          ADD NEW TASK
          <div className="flex flex-1 gap-2">
            <DropdownInput label="PRIORITY" options={["High", "Medium", "Low"]} onSelect={handlePrioritySelectInput} className="w-30"/>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              dateFormat="yyyy-MM-dd HH:mm"  // Format to show both date and time
              showTimeSelect  // Enable the time picker
              timeFormat="HH:mm"  // Set time format (24-hour)
              timeIntervals={15}  // Set time intervals (e.g., 15-minute increments)
              placeholderText="SELECT DUE DATE"
              className="w-full h-10 px-4 bg-light_main border-light_main light_border transition-all duration-300"
            />
            <input placeholder="TASK NAME" type="text" value={taskNameInput} className="flex-1 h-10 px-4 light_border" onChange={handleChangeTaskNameInput}/>
            <Button onClick={handleConfirmToAddTask}>CONFIRM</Button>
          </div>
      </div>
        

        <div className="flex flex-col items-center px-4 sm:px-12 py-12 gap-12 bg-light_main light_border">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center text-2xl">
              CURRENT TASK
            </div>
            <div className="flex flex-col sm:flex-row xl justify-center items-center gap-2 sm:gap-4">
              SORT BY
              <DropdownInput 
                className="w-60" 
                label={"TIME LEFT"} 
                options={["TIME LEFT", "PRIORITY HIGH TO LOW", "PRIORITY LOW TO HIGH"]}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            {activeTasks.map((task) => (
              <Task
                key={task.id} 
                {...task} 
                onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                onClickDelete={() => handleClickDelete(task.id)}
              />
            ))}
          </div>
        </div>
        
        <div className="flex flex-col items-center p-12 gap-12 bg-light_main light_border filter brightness-92">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center text-2xl">
              DONE TASK
            </div>
            <div className="flex justify-center items-center gap-4">
              SORT BY
              <DropdownInput 
                className="w-60" 
                label={"TIME LEFT"} 
                options={["TIME LEFT", "PRIORITY HIGH TO LOW", "PRIORITY LOW TO HIGH"]}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-2">
            {doneTasks.map((task) => (
              <Task
                key={task.id} 
                {...task} 
                onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                onClickDelete={() => handleClickDelete(task.id)}
              />
            ))}
          </div>
        </div>
        
      
      </div>
      

      <Button onClick={handleClickTest}>PRIMARY</Button>
    </div>
  );
};

export default App;
