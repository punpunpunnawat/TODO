import Button from "../Button";
import Dropdown from "../Dropdown";
import MenuIcon from "../../assets/icons/menu-burger.svg?react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import useGlobal from "../../hooks/useGlobal";
import useTask from "../../hooks/useTask";
import { useEffect, useState } from "react";

interface NavigationBarProps {
  showMenu?: boolean;
}

const NavigationBar: React.FC<NavigationBarProps> = ({ showMenu = false }) => {
  const { userEmail, setUserID, setUserEmail } = useGlobal();
  const { setTasks, fetchTasks } = useTask();
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClickCurrentTask = () => {
    navigate("/current-task");
  };

  const handleClickDeletedTask = () => {
    navigate("/deleted-task");
  };

  const handleClickLogout = () => {
    localStorage.clear();
    setUserID("");
    setUserEmail("");
    setTasks([]);
    fetchTasks();
    navigate("/login", { replace: true });
  };

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

  return (
    <>
      {/* Desktop Version */}
      <div className="sticky top-0 z-50 flex justify-between h-[80px] w-full items-center px-8 sm:px-16 bg-light_main border-b-[1px] border-border">
        <div className="text-2xl">TODO</div>
        <div className="flex gap-[40px]">
          {/* Render buttons only if showButtons is true */}
          {showMenu && (
            <>
              <div className="flex gap-[20px]">
                <Button
                  className="hidden lg:block underline"
                  variant="navigate"
                  onClick={handleClickCurrentTask}
                >
                  CURRENT TASK
                </Button>
                <Button
                  className="hidden lg:block underline"
                  variant="navigate"
                  onClick={handleClickDeletedTask}
                >
                  DELETED TASK
                </Button>
              </div>

              <Dropdown
                label={userEmail}
                options={["LOGOUT"]}
                className="hidden lg:block w-60"
                onSelect={handleClickLogout}
                variant="account"
              />

              {/* Mobile Icon */}
              <MenuIcon
                className="lg:hidden cursor-pointer"
                onClick={() => setIsOverlayOpen(!isOverlayOpen)}
              />
            </>
          )}
        </div>
      </div>

      {/* Overlay Modal for mobile */}
      {isOverlayOpen && (
        <div className="fixed inset-0 z-40 flex flex-col w-full mt-[80px] items-center justify-between bg-light_disable">
          <div className="w-full">
            <Button
              variant="navigate"
              onClick={handleClickCurrentTask}
              className="w-full h-16 light_border_bottom"
            >
              CURRENT TASK
            </Button>
            <Button
              variant="navigate"
              onClick={handleClickDeletedTask}
              className="w-full h-16 light_border_bottom"
            >
              DELETED TASK
            </Button>
          </div>
          <div className="w-full justify-center">
            <div className="w-full flex justify-center items-center pb-4 light_border_bottom">
              <span className="text-center">LOG IN AS " {userEmail} "</span>
            </div>
            <Button
              variant="navigate"
              onClick={handleClickLogout}
              className="w-full h-16 light_border_bottom"
            >
              LOGOUT
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;
