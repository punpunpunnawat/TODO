import Button from "../Button";
import MaskAsDoneIcon from '../../assets/icons/check-box-default.svg?react';
import { Priority } from "../../types/task.types";
import { useState, useEffect } from "react";

interface TaskProp {
  id: number;
  label: string;
  priority: Priority;
  dueTime: Date;
  done: boolean;
  onClickMarkAsDone?: () => void;
  onClickDelete?: () => void;
}

const Task = ({ label, priority, dueTime, onClickMarkAsDone, onClickDelete }: TaskProp) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Update the timeLeft every minute
  useEffect(() => {
    // Function to calculate the time left
    const getTimeLeft = (): string => {
      const now = new Date();
      const diff = dueTime.getTime() - now.getTime();

      if (diff <= 0) return "Due now!";

      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      let result = "";
      if (days > 0) result += `${days}d `;
      if (hours > 0) result += `${hours}h `;
      if (minutes > 0) result += `${minutes}m`;

      return result.trim() + " left";
    };

    // Update the timeLeft on an interval every minute
    const intervalId = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 60000); // 60000 ms = 1 minute

    // Set the initial time left immediately
    setTimeLeft(getTimeLeft());

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [dueTime]); // Re-run the effect when dueTime changes

  const handleClickMarkAsDone = () => {
    onClickMarkAsDone?.();
  };

  const handleClickDelete = () => {
    onClickDelete?.();
  };

  // Split date and time
  const date = dueTime.toLocaleDateString(); // Format: "4/25/2025"
  const time = dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format: "12:30 PM"

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden sm:flex gap-2 p-2 bg-light_main light_border items-center ">
        <MaskAsDoneIcon className="w-10 h-10" onClick={handleClickMarkAsDone} />
        <div className="hidden md:flex w-50 h-10 items-center justify-center light_border_disable">
          {timeLeft}
        </div>
        <div className="flex-1 px-5 truncate overflow-hidden whitespace-nowrap">
          {label}
        </div>

        <div
          className={`hidden lg:flex w-28 h-10 items-center justify-center light_border_disable
            ${priority === Priority.HIGH
              ? "bg-priority_high"
              : priority === Priority.MEDIUM
                ? "bg-priority_medium"
                : "bg-priority_low"
            }`}
        >
          {Priority[priority]}
        </div>

        <div className="hidden xl:flex w-40 h-10 items-center justify-center light_border_disable">{date}</div>
        <div className="hidden xl:flex w-24 h-10 items-center justify-center light_border_disable">{time}</div>
        <Button onClick={handleClickDelete}>DELETE</Button>
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden flex flex-col gap-2 p-4 bg-light_main light_border">
        <div></div>
        <div className="flex">
          <div className="flex flex-grow h-10 items-center justify-center light_border_disable">{date}</div>
          <div className="flex flex-grow h-10 items-center justify-center light_border_disable">{time}</div>
        </div>
        <div><Button onClick={handleClickDelete} className="w-full">DELETE</Button></div>
      </div>
    </>
  );
};

export default Task;
