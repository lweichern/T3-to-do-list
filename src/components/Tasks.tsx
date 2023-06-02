import React, { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { IoMdAddCircle } from "react-icons/io";
import { AiFillEdit, AiFillDelete } from "react-icons/ai";
import Form from "./Form";
import Task from "./Task";

type EventType = RouterOutputs["event"]["getAll"][0];
type TaskType = RouterOutputs["task"]["getAll"][0] | null;

type PropType = {
  selectedEvent: EventType | null;
};

function Tasks({ selectedEvent }: PropType) {
  const { data: sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [task, setTask] = useState<TaskType>(null);
  const { data: tasks } = api.task.getAll.useQuery(
    {
      eventId: selectedEvent?.id || "",
    },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const { refetch: refetchTasks } = api.task.getAll.useQuery({
    eventId: selectedEvent?.id || "",
  });

  const deleteTask = api.task.delete.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  const setTaskEmpty = () => {
    setTask(null);
  };

  return (
    <div className=" mr-2 mt-4 flex-1 rounded-md bg-gray-600 p-3 text-white shadow-inner">
      <div className="flex items-center">
        <h2 className="flex-1 text-center text-3xl">Tasks</h2>
        <button
          className="mt-2 flex items-center gap-2 rounded-md bg-green-600 p-2 duration-100 hover:bg-green-400"
          onClick={() => {
            setIsOpen(true);
          }}
        >
          Add Task <IoMdAddCircle />
        </button>
      </div>

      <div className="mt-3 grid auto-rows-[1fr] grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {tasks?.map((elem) => (
          <div key={elem.id}>
            <Task
              task={elem}
              selectedEvent={selectedEvent}
              setIsOpen={setIsOpen}
            />

            <div className="flex">
              <AiFillEdit
                className="cursor-pointer text-blue-400"
                onClick={() => {
                  setIsOpen(true);
                  setTask(elem);
                }}
              />

              <AiFillDelete
                className="cursor-pointer text-red-500"
                onClick={() => deleteTask.mutate({ id: elem.id })}
              />
            </div>
          </div>
        ))}
      </div>
      <div></div>

      {task !== null ? (
        <Form
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedEvent={selectedEvent}
          sessionData={sessionData}
          selectedTask={task}
          setTaskEmpty={setTaskEmpty}
        />
      ) : (
        <Form
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          selectedEvent={selectedEvent}
          sessionData={sessionData}
        />
      )}
    </div>
  );
}

export default Tasks;
