import React from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { AiFillDelete } from "react-icons/ai";

type EventType = RouterOutputs["event"]["getAll"][0];

type PropType = {
  event: EventType;
  selectedEvent: EventType | null;
};

function Event({ event, selectedEvent }: PropType) {
  const { refetch: refetchEvents } = api.event.getAll.useQuery();
  const deleteEvent = api.event.delete.useMutation({
    onSuccess: () => {
      void refetchEvents();
    },
  });

  return (
    <div className="flex items-center justify-between gap-3">
      <div
        className={` w-full rounded-md p-3 text-white text-opacity-50 duration-100 hover:bg-gray-500 ${
          event.name == selectedEvent?.name && `bg-gray-600 !text-opacity-100`
        }`}
      >
        {event.name}
      </div>
      <div
        className="group  rounded-md px-2 py-4 duration-100 hover:bg-red-700"
        onClick={() => {
          deleteEvent.mutate({ id: event.id });
        }}
      >
        <AiFillDelete className="text-red-500 group-hover:text-white" />
      </div>
    </div>
  );
}

export default Event;
