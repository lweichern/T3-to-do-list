import React, { Dispatch, SetStateAction } from "react";
import { type RouterOutputs, api } from "~/utils/api";

type TaskType = RouterOutputs["task"]["getAll"][0];
type EventType = RouterOutputs["event"]["getAll"][0];

type PropType = {
  task: TaskType;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedEvent: EventType | null;
};

function Task({ task, selectedEvent, setIsOpen }: PropType) {
  const { refetch: refetchTasks } = api.task.getAll.useQuery({
    eventId: selectedEvent?.id || "",
  });
  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  return (
    <div
      className={`${
        task.isDone ? "bg-green-600" : "bg-red-500"
      } cursor-pointer rounded-lg p-3`}
      onDoubleClick={() => {
        updateTask.mutate({
          id: task.id,
          name: task.name,
          content: task.content,
          isDone: !task.isDone,
        });
      }}
    >
      <div>
        {task.name} - {task.content}
      </div>
    </div>
  );
}

export default Task;
