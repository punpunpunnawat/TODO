import { useEffect, useState } from "react";
import { Priority } from "../../types/task.types";
import DropdownInput from "../Dropdown";
import Button from "../Button";
import { default as DatePicker } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import useGlobal from "../../hooks/useGlobal";
import useTask from "../../hooks/useTask";
import { v4 as uuidv4 } from "uuid";

const AddTaskForm: React.FC = () => {
  const { userID } = useGlobal();
  const { addTask } = useTask();
  const [priorityInput, setPriorityInput] = useState<Priority | null>(
    Priority.MEDIUM
  );
  const [dueDateInput, setDueDateInput] = useState<Date | null>(null);
  const [taskNameInput, setTaskNameInput] = useState<string>("");
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  useEffect(() => {
    if (isOverlayOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOverlayOpen]);

  console.log(isOverlayOpen);
  
  const handleConfirmToAddTask = async () => {
    if (!taskNameInput) {
      alert("Please enter a task name.");
      return;
    }

    const now = new Date();
    if (dueDateInput && dueDateInput.getTime() < now.getTime()) {
      alert("The due date/time cannot be in the past.");
      return;
    }

    const newTask = {
      id: uuidv4(),
      userID: userID,
      label: taskNameInput,
      priority: priorityInput ?? Priority.MEDIUM,
      dueDate: dueDateInput ?? new Date("9000-01-01T00:00:00"),
      completed: false,
      deleted: false,
      completedDate: new Date("1000-01-01T00:00:00"),
      deletedDate: new Date("1000-01-01T00:00:00"),
      createdDate: now,
    };

    try {
      await addTask(newTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }

    // Clear input fields
    setTaskNameInput("");
    setDueDateInput(null);
    setPriorityInput(Priority.MEDIUM);
    setIsOverlayOpen(false);
  };
  const handlePrioritySelectInput = (selectedPriority: string) => {
    switch (selectedPriority) {
      case "HIGH":
        setPriorityInput(Priority.HIGH);
        break;
      case "MEDIUM":
        setPriorityInput(Priority.MEDIUM);
        break;
      case "LOW":
        setPriorityInput(Priority.LOW);
        break;
      default:
        console.log("No priority selected");
    }
  };

  return (
    <>
      <section className="hidden md:flex flex-col xl:flex-row items-center gap-4 p-12 light_border bg-light_main">
        <h2 className="text-base">ADD NEW TASK</h2>
        <div className="flex flex-1 w-full items-center gap-4">
          <div className="flex flex-1 flex-col xl:flex-row items-center gap-4 xl:gap-2">
            <div className="flex w-full items-center gap-2">
              <DropdownInput
                label="PRIORITY"
                options={["HIGH", "MEDIUM", "LOW"]}
                onSelect={handlePrioritySelectInput}
                className="w-40"
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
                onChange={(e) => setTaskNameInput(e.target.value)}
                placeholder="TASK NAME"
                className="h-10 flex-1 light_border px-4"
              />
            </div>
            <Button onClick={handleConfirmToAddTask}>CONFIRM</Button>
          </div>
        </div>
      </section>

      {/* Mobile Add Task Button (below md) */}
      <div className="flex md:hidden justify-center">
        <Button className="flex-1" onClick={() => setIsOverlayOpen(true)}>
          ADD NEW TASK
        </Button>
      </div>

      {/* Overlay Modal for mobile */}
      {isOverlayOpen && (
        <div
          className="fixed inset-0 z-50 flex w-full p-6 items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={() => setIsOverlayOpen(false)}
        >
          <div
            className="flex flex-col w-full p-10 gap-10 bg-light_main light_border"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg text-center">ADD NEW TASK</h2>
            <div className="flex flex-col gap-2">
              <DropdownInput
                label="PRIORITY"
                options={["HIGH", "MEDIUM", "LOW"]}
                onSelect={handlePrioritySelectInput}
                className="w-full"
              />
              <DatePicker
                selected={dueDateInput}
                onChange={(date: Date | null) => setDueDateInput(date)}
                dateFormat="yyyy-MM-dd HH:mm"
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                placeholderText="SELECT DUE DATE"
                className="h-10 w-full light_border light_main bg-light_main px-4 focus:outline-none focus:ring-0 focus:border-light_dark transition-all duration-300"
              />
              <input
                type="text"
                value={taskNameInput}
                onChange={(e) => setTaskNameInput(e.target.value)}
                placeholder="TASK NAME"
                className="h-10 w-full light_border px-4"
              />
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  onClick={() => setIsOverlayOpen(false)}
                >
                  CANCEL
                </Button>
                <Button className="flex-1" onClick={handleConfirmToAddTask}>
                  CONFIRM
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskForm;
