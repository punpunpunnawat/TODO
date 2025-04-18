import React from "react";
import Task from "./components/Task"; // Import Task component
import Button from "./components/Button";  // Assuming the Button component is in the components folder
import NavigationBar from "./components/NavigationBar";  // Assuming the NavigationBar component is in the components folder

import { TaskType } from "./types/task.types";  // Import Task type

// Update the tasks array to use TaskType
const tasks: TaskType[] = [
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


const activeTasks = tasks.filter(task => !task.done);
const doneTasks = tasks.filter(task => task.done);

const handleClickTest = () => {
  alert("Test");
};

const App: React.FC = () => {
  return (
    <div>
      <NavigationBar username={"punpunpunnawat"} />
      <div>
        {activeTasks.map((task) => (
          <Task
            key={task.id}  // Important to give each item a unique key!
            {...task}  // Spread the task object to pass as props to Task component
          />
        ))}
      </div>

      <div>
        {doneTasks.map((task) => (
          <Task
            key={task.id}  // Important to give each item a unique key!
            {...task}  // Spread the task object to pass as props to Task component
          />
        ))}
      </div>

      <Button onClick={handleClickTest}>PRIMARY</Button>
    </div>
  );
};

export default App;
