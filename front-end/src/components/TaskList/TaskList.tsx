import { useEffect, useState } from "react";
import useTask from "../../hooks/useTask";
import { TaskListCategory, TaskType } from "../../types/task.types";
import Task from "../Task";
import Button from "../Button";
import DropdownInput from "../Dropdown";

interface TaskListProp {
  category: TaskListCategory;
}

const TaskList: React.FC<TaskListProp> = ({ category }) => {
  const sortOptions =
    category === TaskListCategory.CURRENT
      ? [
          "TIME LEFT",
          "CREATED DATE",
          "PRIORITY HIGH TO LOW",
          "PRIORITY LOW TO HIGH",
        ]
      : category === TaskListCategory.COMPLETED
      ? [
          "COMPLETE DATE",
          "CREATED DATE",
          "PRIORITY HIGH TO LOW",
          "PRIORITY LOW TO HIGH",
        ]
      : category === TaskListCategory.DELETED
      ? [
          "DELETED DATE",
          "CREATED DATE",
          "PRIORITY HIGH TO LOW",
          "PRIORITY LOW TO HIGH",
        ]
      : [];

  const { tasks, loading, updateTask } = useTask();
  const [filteredTask, setFilteredTask] = useState<TaskType[]>([]);
  const [activeSortOption, setSortOption] = useState<string>(sortOptions[0]);

  console.log(category);
  const backgroundColor =
    category === TaskListCategory.COMPLETED ? "light_disable" : "light_main";

  console.log(backgroundColor);
  useEffect(() => {
    let result = tasks;

    // Filter by category
    switch (category) {
      case TaskListCategory.CURRENT:
        result = result.filter((task) => !task.completed && !task.deleted);
        break;
      case TaskListCategory.COMPLETED:
        result = result.filter((task) => task.completed && !task.deleted);
        break;
      case TaskListCategory.DELETED:
        result = result.filter((task) => task.deleted);
        break;
      default:
        result = [];
    }

    // Sort by selected option
    result = [...result].sort((a, b) => {
      switch (activeSortOption) {
        case "TIME LEFT": {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(); // earliest first
        }

        case "COMPLETE DATE": {
          if (!a.completedDate) return 1;
          if (!b.completedDate) return -1;
          return (
            new Date(b.completedDate).getTime() -
            new Date(a.completedDate).getTime()
          ); // latest first
        }

        case "DELETED DATE": {
          if (!a.deletedDate) return 1;
          if (!b.deletedDate) return -1;
          return (
            new Date(b.deletedDate).getTime() -
            new Date(a.deletedDate).getTime()
          ); // latest first
        }

        case "CREATED DATE": {
          if (!a.createdDate) return 1;
          if (!b.createdDate) return -1;
          return (
            new Date(b.createdDate).getTime() -
            new Date(a.createdDate).getTime()
          ); // newest first
        }

        case "PRIORITY HIGH TO LOW":
          return b.priority - a.priority;

        case "PRIORITY LOW TO HIGH":
          return a.priority - b.priority;

        default:
          return 0;
      }
    });

    setFilteredTask(result);
  }, [category, tasks, activeSortOption]);

  const handleClickMarkAsDone = async (id: string) => {
    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      completed: !task.completed,
      completedDate: new Date(),
    };

    try {
      await updateTask(id, updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleClickDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    // Mark the task as deleted in the database
    const updatedTask = {
      ...task,
      deleted: true,
      deletedDate: new Date(),
    };

    try {
      await updateTask(id, updatedTask);
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleClickRecovery = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to recovery this task?"
    );
    if (!confirmed) return;

    const task = tasks.find((task) => task.id === id);
    if (!task) return;

    const updatedTask = {
      ...task,
      deleted: false,
      deleteTime: new Date("1000-01-01T00:00:00"), // Set delete time to now
    };

    await updateTask(id, updatedTask);
  };

  return (
    <section
      className={`flex flex-col items-center gap-12 light_border bg-${backgroundColor} px-4 py-12 sm:px-12`}
    >
      {/* if Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-12 w-full">
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-light_dark border-opacity-60" />
        </div>
      ) : // if have no task show icon
      filteredTask.length === 0 ? (
        <div className="flex justify-center items-center py-12 text-center w-full">
          Hello World
        </div>
      ) : (
        // default task list show
        <>
          <header className="flex flex-col gap-4">
            <h2 className="text-2xl text-center">{category} TASK</h2>
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <span className="text-sm">SORT BY</span>
              <DropdownInput
                className="w-70"
                label={activeSortOption}
                options={sortOptions}
                onSelect={(selectedOption: string) =>
                  setSortOption(selectedOption)
                }
              />
            </div>
          </header>

          <div className="flex w-full flex-col gap-2">
            {/* Header Row */}
            <div className="hidden w-full h-fit items-center gap-2 px-2 sm:flex">
              {category !== TaskListCategory.DELETED && (
                <div className="invisible h-10 w-10" />
              )}
              <div className="hidden h-fit w-50 items-center justify-center md:flex">
                {category === TaskListCategory.CURRENT && "TIME LEFT"}
                {category === TaskListCategory.COMPLETED && "COMPLETED DATE"}
                {category === TaskListCategory.DELETED && "DELETED DATE"}
              </div>

              <div className="flex flex-1 items-center justify-center px-5">
                TASK NAME
              </div>
              <div className="hidden h-fit w-28 items-center justify-center lg:flex">
                PRIORITY
              </div>
              <div className="hidden h-fit w-40 items-center justify-center xl:flex">
                DUE DATE
              </div>
              <div className="hidden h-fit w-24 items-center justify-center xl:flex">
                DUE TIME
              </div>
              <Button className="invisible">
                {category === TaskListCategory.DELETED ? "RECOVERY" : "DELETE"}
              </Button>
            </div>

            {/* Tasks */}
            {filteredTask.map((task) => (
              <Task
                key={task.id}
                {...task}
                onClickMarkAsDone={() => handleClickMarkAsDone(task.id)}
                onClickButton={
                  category === TaskListCategory.DELETED
                    ? () => handleClickRecovery(task.id)
                    : () => handleClickDelete(task.id)
                }
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default TaskList;
