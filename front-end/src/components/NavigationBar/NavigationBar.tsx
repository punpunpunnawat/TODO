import Button from "../Button";
import Dropdown from "../Dropdown";
import MenuIcon from '../../assets/icons/menu-burger.svg?react';
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import useGlobal from "../../hooks/useGlobal";

interface NavigationBarProps {
  showMenu?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ showMenu = false }) => {

  const {userEmail, setUserID, setUserEmail,} = useGlobal();
  const navigate = useNavigate();
  

  const handleClickCurrentTask = () => {
    navigate('/current-task');
  }

  const handleClickDeletedTask = () => {
    navigate('/deleted-task');
  }

  const handleLogout = () => {
    // const confirmed = window.confirm("Are you sure you want to log out?");
    // if (!confirmed) return;
    
    localStorage.clear();
    setUserID("");
    setUserEmail("")
    navigate("/login", { replace: true });
  }

  return (
    <div className="sticky top-0 z-50 flex justify-between h-[80px] w-full items-center px-8 sm:px-16 bg-light_main border-b-[1px] border-border">
      <div className="text-2xl">TODO</div>
      <div className="flex gap-[40px]">
        {/* Render buttons only if showButtons is true */}
        {showMenu && (
          <>
            <div className="flex gap-[20px]">
            <Button className="hidden lg:block" variant="navigate" onClick={handleClickCurrentTask}>CURRENT TASK</Button>
            <Button className="hidden sm:block" variant="navigate" onClick={handleClickDeletedTask}>DELETED TASK</Button>
            </div>
          
          <Dropdown
            label={userEmail}
            options={["LOGOUT"]}
            className="hidden sm:block"
            onSelect={handleLogout}
          />

          {/* Mobile Icon */}
          <MenuIcon className="sm:hidden"/>
          </>
          )}
      </div>

    </div>
  );
};

export default NavigationBar;
