import React from "react";

function Event({ name }: { name: string }) {
  return (
    <div className="rounded-md p-3 duration-100 hover:bg-gray-500">{name}</div>
  );
}

export default Event;
