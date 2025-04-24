import Button from "../Button";
import MySvg from '../../assets/icons/check-box-default.svg?react';
import { Priority } from "../../types/task.types";
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
        <MySvg className="w-10 h-10" onClick={handleClickMaskAsDone}/>
        <div className="hidden md:flex w-50 h-10 items-center justify-center light_border_disable">24DAYS 2HRS Left</div>
        <div className="flex-grow px-5 truncate overflow-hidden whitespace-nowrap">
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
