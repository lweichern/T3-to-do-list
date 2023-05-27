import React from "react";
import { type RouterOutputs } from "~/utils/api";

type TaskType = RouterOutputs["task"]["getAll"][0];

function Task({ task }: { task: TaskType }) {
  return (
    <div className={`${task.isDone ? "text-green-500" : "text-red-500"}`}>
      {task.name} - {task.content}
    </div>
  );
}

export default Task;
