import React, { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import { IoMdAddCircle } from "react-icons/io";
import Form from "./Form";
import Task from "./Task";

type EventType = RouterOutputs["event"]["getAll"][0];

type PropType = {
  selectedEvent: EventType | null;
};

function Tasks({ selectedEvent }: PropType) {
  const { data: sessionData } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { data: tasks } = api.task.getAll.useQuery(
    {
      eventId: selectedEvent?.id || "",
    },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

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
          <Task key={elem.id} task={elem} selectedEvent={selectedEvent} />
        ))}
      </div>
      <div></div>

      <Form
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        selectedEvent={selectedEvent}
        sessionData={sessionData}
      />
    </div>
  );
}

export default Tasks;
