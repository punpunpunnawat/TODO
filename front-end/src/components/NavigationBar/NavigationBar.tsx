import Button from "../Button";
import Dropdown from "../Dropdown";

interface MyComponentProps {
  username: string;
}

const NavigationBar: React.FC<MyComponentProps> = ({ username }) => {

  return (
    <div className="sticky top-0 z-50 flex justify-between h-[80px] w-full items-center px-[60px] py-[20px]  bg-light_main border-b-[1px] border-border">
      <div className="text-2xl">TODO</div>
      <div className="flex gap-[40px]">
        <div className="flex gap-[20px]">
          <Button className="hidden lg:block" variant="navigate">CURRENT TASK</Button>
          <Button className="hidden lg:block" variant="navigate">DONE TASK</Button>
          <Button variant="navigate">DELETED TASK</Button>
        </div>
        <Dropdown label={username} options={["1","2","3"]}/>
      </div>
    </div>
  );
};

export default NavigationBar;
