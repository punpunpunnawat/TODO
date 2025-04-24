import Button from "../Button";
import Dropdown from "../Dropdown";
import MenuIcon from '../../assets/icons/menu-burger.svg?react';
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

interface MyComponentProps {
  username: string;
}

const NavigationBar: React.FC<MyComponentProps> = ({ username }) => {
  const navigate = useNavigate();
  
  const handleClickCurrentTask = () => {
    navigate('/');
  }

  const handleClickDeletedTask = () => {
    navigate('/deleted-task');
  }

  return (
    <div className="sticky top-0 z-50 flex justify-between h-[80px] w-full items-center px-8 sm:px-16 bg-light_main border-b-[1px] border-border">
      <div className="text-2xl">TODO</div>
      <div className="flex gap-[40px]">
        <div className="flex gap-[20px]">
          <Button className="hidden lg:block" variant="navigate" onClick={handleClickCurrentTask}>CURRENT TASK</Button>
          <Button className="hidden lg:block" variant="navigate">DONE TASK</Button>
          <Button className="hidden sm:block" variant="navigate" onClick={handleClickDeletedTask}>DELETED TASK</Button>
        </div>
        <Dropdown label={username} options={["1","2","3"]} className="hidden sm:block"/>
      </div>
      <MenuIcon className="sm:hidden"/>
    </div>
  );
};

export default NavigationBar;
