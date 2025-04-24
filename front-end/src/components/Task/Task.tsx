import Button from "../Button";
import MaskAsDoneIcon from '../../assets/icons/check-box-default.svg?react';
import { Priority } from "../../types/task.types";
import { useEffect, useState } from "react";
interface TaskProp {
    id: number;
    label: string;
    priority: Priority;
    date: string;
    time: string;
    done: boolean;
    onClickMarkAsDone?: () => void;
    onClickDelete?: () => void;
  }

const Task: React.FC<TaskProp> = ({ label, priority, date, time, onClickMarkAsDone, onClickDelete}) => {

  const [timeLeft, setTimeLeft] = useState<string>("kuy");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const dueDateTime = new Date(`${date}T${time}`);
      const diffMs = dueDateTime.getTime() - now.getTime();
  
      if (diffMs <= 0) {
        setTimeLeft("EXPIRED");
        return;
      }
  
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
  
      setTimeLeft(`${days}D ${hours}H ${minutes}M Left`);
    };

    //make it calculate first time render
    calculateTimeLeft();
  
    //calculate every 1min
    const interval = setInterval(() => {
      calculateTimeLeft();
    }, 1000 * 60);
  
    return () => clearInterval(interval);
  }, [date, time]);
  
  const handleClickMaskAsDone = () => {
    onClickMarkAsDone?.(); 
  };

  const handleClickDelete = () => {
    onClickDelete?.(); 
  };

  return (
    <>
      {/* Desktop layout */}
      <div className="hidden sm:flex gap-2 p-2 bg-light_main light_border items-center ">
        <MaskAsDoneIcon className="w-10 h-10" onClick={handleClickMaskAsDone}/>
        <div className="hidden md:flex w-50 h-10 items-center justify-center light_border_disable">{timeLeft}</div>
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
