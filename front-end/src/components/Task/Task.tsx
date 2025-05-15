import Button from "../Button";
import MaskAsDoneIcon from "../../assets/icons/check-box-default.svg?react";
import { Priority, TaskType } from "../../types/task.types";
import { useState, useEffect } from "react";

interface TaskProp extends TaskType {
  onClickMarkAsDone?: () => void;
  onClickButton?: () => void;
}

const Task = ({
  label,
  priority,
  dueDate,
  completedDate,
  deletedDate,
  completed,
  deleted,
  onClickMarkAsDone,
  onClickButton,
}: TaskProp) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const noDueDate =
    dueDate instanceof Date &&
    dueDate.getTime() === new Date("9000-01-01T00:00:00").getTime();

  // Update the timeLeft every minute
  useEffect(() => {
    console.log(dueDate);
    console.log(label);

    // Function to calculate the time left
    const getTimeLeft = (): string => {
      console.log(noDueDate);
      if (!dueDate || noDueDate) return "NONE";
      const now = new Date();
      const diff = dueDate.getTime() - now.getTime();
      if (diff <= 0) return "EXPIRED";

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
  }, [dueDate, completed, completedDate, label]); // Re-run the effect when dueDate changes

  const handleClickMarkAsDone = () => {
    onClickMarkAsDone?.();
  };

  const handleClickButton = () => {
    onClickButton?.();
  };

  // Split date and time
  const dueDate_date = noDueDate
    ? "NONE"
    : dueDate instanceof Date
    ? dueDate.toLocaleDateString()
    : "Invalid Date";
  const dueDate_time = noDueDate
    ? "NONE"
    : dueDate instanceof Date
    ? dueDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Invalid Time";

  const completedDate_date =
    completedDate instanceof Date
      ? completedDate.toLocaleDateString()
      : "Invalid Date";
  const completedDate_time =
    completedDate instanceof Date
      ? completedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Invalid Time";

  const deleteDate_date =
    deletedDate instanceof Date
      ? deletedDate.toLocaleDateString()
      : "Invalid Date";
  const deleteDate_time =
    deletedDate instanceof Date
      ? deletedDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Invalid Time";

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden sm:flex gap-2 p-2 bg-light_main light_border items-center ">
        {!deleted && (
          <MaskAsDoneIcon
            className="w-10 h-10"
            onClick={handleClickMarkAsDone}
          />
        )}

        <div className="hidden md:flex w-50 h-10 items-center justify-center light_border_disable">
          {deleted
            ? deleteDate_date + " " + deleteDate_time
            : completed
            ? completedDate_date + " " + completedDate_time
            : timeLeft}
        </div>
        <div className="flex-1 px-5 truncate overflow-hidden whitespace-nowrap">
          {label}
        </div>

        <div
          className={`hidden lg:flex w-28 h-10 items-center justify-center light_border_disable
            ${
              priority === Priority.HIGH
                ? "bg-priority_high"
                : priority === Priority.MEDIUM
                ? "bg-priority_medium"
                : "bg-priority_low"
            }`}
        >
          {Priority[priority]}
        </div>

        <div className="hidden xl:flex w-40 h-10 items-center justify-center light_border_disable">
          {dueDate_date}
        </div>
        <div className="hidden xl:flex w-24 h-10 items-center justify-center light_border_disable">
          {dueDate_time}
        </div>
        {!deleted ? (
          <Button onClick={handleClickButton}>DELETE</Button>
        ) : (
          <Button onClick={handleClickButton}>RECOVERY</Button>
        )}
      </div>

      {/* Mobile layout */}
      <div className="sm:hidden flex flex-col gap-2 p-4 bg-light_main light_border">
        <div className="flex gap-2">
          <MaskAsDoneIcon onClick={handleClickMarkAsDone} />
          <div className="flex flex-1 h-10 items-center justify-center light_border_disable">
            {label}
          </div>
        </div>
        <div className="flex gap-2">
          <div
            className={`flex w-10 h-10 p-4 items-center justify-center light_border_disable
                ${
                  priority === Priority.HIGH
                    ? "bg-priority_high"
                    : priority === Priority.MEDIUM
                    ? "bg-priority_medium"
                    : "bg-priority_low"
                }`}
          >
            {priority === Priority.HIGH
              ? "H"
              : priority === Priority.MEDIUM
              ? "M"
              : "L"}
          </div>
          <div className="flex flex-1 h-10 items-center justify-center light_border_disable">
            {completedDate_date}
          </div>
          <div className="flex flex-1 h-10 items-center justify-center light_border_disable">
            {completedDate_time}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleClickButton} className="flex-1">
            DELETE
          </Button>
        </div>
      </div>
    </>
  );
};

export default Task;
