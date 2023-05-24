import React, { useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import Event from "~/components/Event";

type EventType = RouterOutputs["event"]["getAll"][0];

function Events() {
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const { data: sessionData } = useSession();
  const { data: events, refetch: refetchEvents } = api.event.getAll.useQuery(
    undefined,
    {
      enabled: sessionData?.user !== undefined,
      onSuccess: (data) => {
        setSelectedEvent(selectedEvent ?? data[0] ?? null); // when get, set selected event to selected event, otherwise first data that is returned, otherwise null
      },
    }
  );

  const createEvent = api.event.create.useMutation({
    onSuccess: () => {
      void refetchEvents();
    },
  });

  const deleteEvent = api.event.delete.useMutation({
    onSuccess: () => {
      void refetchEvents();
    },
  });
  return (
    <div className="mx-5 mt-5 grid-cols-4 gap-2 text-lg text-white">
      <div className="px-2">
        <input
          type="text"
          placeholder="Enter New Event..."
          id="eventName"
          className=" focus:shadow-outline appearance-none rounded border bg-gray-700 px-3 py-2 leading-tight shadow focus:outline-none"
          onKeyDown={(e) => {
            if (e.currentTarget.value.trim() == "") {
              return;
            }
            if (e.key === "Enter") {
              createEvent.mutate({
                name: e.currentTarget.value,
              });

              e.currentTarget.value = "";
            }
          }}
        />
        <button
          className="focus:shadow-outline ml-3 rounded bg-gray-500 p-2 font-bold text-white hover:bg-gray-700 focus:outline-none"
          onClick={() => {
            if (
              (document.getElementById("eventName") as HTMLInputElement)
                .value == ""
            ) {
              return;
            }
            createEvent.mutate({
              name: (document.getElementById("eventName") as HTMLInputElement)
                .value,
            });

            if (document.getElementById("eventName")) {
              (document.getElementById("eventName") as HTMLInputElement).value =
                "";
            }
          }}
        >
          Add +
        </button>
        <div className="mt-4 h-1 bg-gray-700"></div>
      </div>
      <div className="col-span-3 mt-3">
        <ul className="flex flex-col gap-2">
          {events?.map((event) => (
            <li
              key={event.id}
              onClick={(evt) => {
                evt.preventDefault();
                setSelectedEvent(event);
              }}
            >
              <a href="#">
                <Event
                  event={event}
                  selectedEvent={selectedEvent}
                  deleteEvent={deleteEvent}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Events;
