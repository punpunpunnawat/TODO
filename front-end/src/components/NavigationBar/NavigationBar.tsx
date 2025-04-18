import Button from "../Button";
import Dropdown from "../Dropdown";

// Define props type
interface MyComponentProps {
  username: string;
}

const NavigationBar: React.FC<MyComponentProps> = ({ username }) => {

  return (
    <div className="flex justify-between h-[80px] w-full items-center px-[60px] py-[20px]  bg-light_main">
      <div className="text-2xl">TODO</div>
      <div className="flex gap-[40px]">
        <div className="flex gap-[20px]">
          <Button variant="navigate">CURRENT TASK</Button>
          <Button variant="navigate">DONE TASK</Button>
          <Button variant="navigate">DELETED TASK</Button>
        </div>
        <Dropdown label={username} options={["1","2","3"]}/>
      </div>
    </div>
  );
};

export default NavigationBar;
