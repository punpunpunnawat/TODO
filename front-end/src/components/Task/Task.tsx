import Button from "../Button";
import { ReactComponent as Icon } from '../../assets/icons/icon.svg';

interface TaskProp {
    id: number;
    label: string;
    priority: number;
    date: string;
    time: string;
    done: boolean;
  }
  
  

const Task: React.FC<TaskProp> = ({ id, label, priority, date, time }) => {

  return (
    <div className="flex gap-2 p-2 bg-light_main light_border items-center">
      <div>{id}</div>
      <div className="flex w-50 h-10 items-center justify-center light_border">24DAYS 2HRS Left</div>
      <div className="flex-grow">{label}</div>
      <div className="flex w-28 h-10 items-center justify-center light_border">{priority}</div>
      <div className="flex w-40 h-10 items-center justify-center light_border">{date}</div>
      <div className="flex w-24 h-10 items-center justify-center light_border">{time}</div>

      <Button>DELETE</Button>
    </div>

  );
};

export default Task;
