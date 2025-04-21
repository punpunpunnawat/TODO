import React, { useState } from "react";
import Task from "./components/Task"; // Import Task component
import Button from "./components/Button";  // Assuming the Button component is in the components folder
import NavigationBar from "./components/NavigationBar";  // Assuming the NavigationBar component is in the components folder

import { TaskType } from "./types/task.types";  // Import Task type
import DropdownInput from "./components/Dropdown";
import { default as DatePicker } from "react-datepicker"; // ✅ Type-safe


import "react-datepicker/dist/react-datepicker.css";
// Update the tasks array to use TaskType
const initialTasks: TaskType[] = [
  { id: 1, label: "Buy milk", priority: 1, date: "2025-04-18", time: "09:00", done: false },
  { id: 2, label: "Write code", priority: 2, date: "2025-04-18", time: "14:00", done: true },
  { id: 3, label: "Walk the dog", priority: 3, date: "2025-04-19", time: "07:30", done: false },
  { id: 4, label: "Do laundry", priority: 2, date: "2025-04-19", time: "10:00", done: false },
  { id: 5, label: "Buy groceries", priority: 1, date: "2025-04-20", time: "11:00", done: true },
  { id: 6, label: "Attend meeting", priority: 2, date: "2025-04-20", time: "13:00", done: false },
  { id: 7, label: "Finish project report", priority: 3, date: "2025-04-21", time: "15:00", done: true },
  { id: 8, label: "Clean the house", priority: 1, date: "2025-04-21", time: "08:00", done: false },
  { id: 9, label: "Prepare dinner", priority: 2, date: "2025-04-22", time: "17:00", done: true },
  { id: 10, label: "Read book", priority: 1, date: "2025-04-22", time: "19:00", done: false },
  { id: 11, label: "Go to the gym", priority: 3, date: "2025-04-23", time: "06:30", done: true },
  { id: 12, label: "Pay bills", priority: 2, date: "2025-04-23", time: "09:00", done: false },
  { id: 13, label: "Attend webinar", priority: 3, date: "2025-04-24", time: "12:00", done: true },
  { id: 14, label: "Call mom", priority: 1, date: "2025-04-24", time: "10:00", done: false },
  { id: 15, label: "Review pull requests", priority: 2, date: "2025-04-25", time: "16:00", done: true },
  { id: 16, label: "Update resume", priority: 3, date: "2025-04-25", time: "11:00", done: false },
  { id: 17, label: "Plan weekend trip", priority: 1, date: "2025-04-26", time: "08:00", done: false },
  { id: 18, label: "Write blog post", priority: 2, date: "2025-04-26", time: "14:00", done: false },
  { id: 19, label: "Send emails", priority: 1, date: "2025-04-27", time: "09:00", done: true },
  { id: 20, label: "Watch movie", priority: 3, date: "2025-04-27", time: "18:00", done: false },
  { id: 21, label: "Clean car", priority: 2, date: "2025-04-28", time: "13:00", done: true },
  { id: 22, label: "Attend conference", priority: 3, date: "2025-04-28", time: "09:00", done: false },
  { id: 23, label: "Prepare for presentation", priority: 2, date: "2025-04-29", time: "15:00", done: false },
  { id: 24, label: "Buy new shoes", priority: 1, date: "2025-04-29", time: "17:00", done: true },
  { id: 25, label: "Finish coding challenge", priority: 3, date: "2025-04-30", time: "20:00", done: false }
];

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>(initialTasks);

  const activeTasks = tasks.filter(task => !task.done);
  const doneTasks = tasks.filter(task => task.done);
  const [startDate, setStartDate] = useState<Date | null>(null);
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

  return (
    <div>

      <NavigationBar username={"punpunpunnawat"} />
      
      <div className="flex flex-col p-6 gap-6 sm:px-12">
        <div className="flex p-12 gap-4 light_border items-center bg-light_main">
          ADD NEW TASK
          <div className="flex flex-1 gap-2">
            <DropdownInput label="PRIORITY" options={["High", "Medium", "Low"]}/>
            <DatePicker
              selected={startDate}
              onChange={(date: Date | null) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
              placeholderText="SELECT DUE DATE"
              className="w-full h-10 px-4 bg-light_main border-light_main focus:outline-border light_border transition-all duration-300"
            />
            <input placeholder="SELECT DUE TIME" type="time" className="h-10 px-4 light_border"/>
            <input placeholder="TASK NAME" type="text" className="flex-1 h-10 px-4 light_border"/>
            <Button>CONFIRM</Button>
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
