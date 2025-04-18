import Button from "../Button";
import MySvg from '../../assets/icons/check-box-default.svg?react';
interface TaskProp {
    id: number;
    label: string;
    priority: number;
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
    <div className="flex gap-2 p-2 bg-light_main light_border items-center ">
      <MySvg className="w-10 h-10" onClick={handleClickMaskAsDone}/>
      <div className="hidden md:flex w-50 h-10 items-center justify-center light_border">24DAYS 2HRS Left</div>
      <div className="flex-grow px-5 truncate overflow-hidden whitespace-nowrap">
        {label}
      </div>
      <div className="hidden lg:flex w-28 h-10 items-center justify-center light_border">{priority}</div>
      <div className="hidden xl:flex w-40 h-10 items-center justify-center light_border">{date}</div>
      <div className="hidden xl:flex w-24 h-10 items-center justify-center light_border">{time}</div>
      <Button onClick={handleClickDelete}>DELETE</Button>
    </div>

  );
};

export default Task;
