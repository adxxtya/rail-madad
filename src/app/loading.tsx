import React from "react";
import { RiLoader4Fill } from "react-icons/ri";

const loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="animate-spin">
        <RiLoader4Fill size={50} />
      </div>
    </div>
  );
};

export default loading;
