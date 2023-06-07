import React, { Fragment } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { api, type RouterOutputs } from "~/utils/api";
import { Session } from "next-auth";

type EventType = RouterOutputs["event"]["getAll"][0];
type TaskType = RouterOutputs["task"]["getAll"][0];

type PropType = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedEvent: EventType | null;
  sessionData: Session | null;
  selectedTask?: TaskType | null;
  setTaskEmpty?: () => void;
};

function Form({
  isOpen,
  setIsOpen,
  selectedEvent,
  sessionData,
  selectedTask,
  setTaskEmpty,
}: PropType) {
  const { refetch: refetchTasks } = api.task.getAll.useQuery(
    {
      eventId: selectedEvent?.id || "",
    },
    {
      enabled: sessionData?.user !== undefined,
    }
  );

  const createTask = api.task.create.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  const updateTask = api.task.update.useMutation({
    onSuccess: () => {
      void refetchTasks();
    },
  });

  return (
    <div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10 "
          onClose={() => {
            setIsOpen(false);
            setTaskEmpty?.();
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-5" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-slate-700 p-6 text-left align-middle text-gray-300 shadow-2xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-center text-2xl font-medium leading-6"
                  >
                    {selectedTask ? "Edit Task" : "Add Task"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <form
                      action=""
                      className="flex flex-col gap-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        e.target;
                        const title = (
                          document.getElementById("title") as HTMLInputElement
                        ).value;
                        const content = (
                          document.getElementById(
                            "content"
                          ) as HTMLTextAreaElement
                        ).value;

                        selectedTask
                          ? updateTask.mutate({
                              id: selectedTask.id,
                              name: title,
                              content: content,
                              isDone: selectedTask.isDone,
                            })
                          : createTask.mutate({
                              name: title,
                              content: content,
                              eventId: selectedEvent?.id || "",
                            });

                        (
                          document.getElementById("title") as HTMLInputElement
                        ).value = "";

                        (
                          document.getElementById("content") as HTMLInputElement
                        ).value = "";

                        setIsOpen(false);
                        setTaskEmpty?.();
                      }}
                    >
                      <label className="text-lg">Title:</label>
                      <input
                        type="text"
                        id="title"
                        defaultValue={selectedTask?.name || ""}
                        className="bg-gray-800 p-2 text-white"
                      />

                      <label className="text-lg">Content:</label>
                      <textarea
                        id="content"
                        rows={6}
                        defaultValue={selectedTask?.content || ""}
                        className="bg-gray-800 p-2 text-white"
                      ></textarea>

                      <input
                        type="submit"
                        className="mx-auto my-2 w-full cursor-pointer rounded-md border-2 border-solid border-gray-900 p-2 duration-100 hover:border-slate-600 hover:bg-slate-600"
                        value={selectedTask ? "Update" : "Add"}
                      />
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Form;
