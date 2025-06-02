import React, { useState } from "react";
import { TbEdit } from "react-icons/tb";
import { BsCheck2 } from "react-icons/bs";
function InputEdit({ type, handleChange, input, handleSubmit }) {
  const [editable, setEditable] = useState(false);
  // const [showPicker, setShowPicker] = useState(false)
  const submitButton = () => {
    handleSubmit();
    setEditable(false);
  };

  return (
    <>
      <div className="flex flex-col flex-wrap py-4 bg-[#ffff] shadow-md px-4 gap-y-3">
        {!editable ? (
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-[14.5px] text-[#3b4a54]">{input}</p>

            <button onClick={() => setEditable(!editable)}>
              <TbEdit className="w-[21px] h-[21px]" />
            </button>
          </div>
        ) : type == "profilePic" ? (
          <div className="flex items-center justify-between">
            <div>
              <textarea
                name={type}
                onChange={handleChange}
                className="flex text-[14px] text-[black] h-[10vh]"
                type="text"
                value={input}
              />
            </div>
            <div className="flex items-center gap-x-4">
              <button onClick={submitButton}>
                <BsCheck2 className="w-[21px] h-[21px]" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <input
                name={type}
                onChange={handleChange}
                className="text-[14px] text-[black] outline-0"
                type="text"
                value={input}
              />
            </div>
            <div className="flex items-center gap-x-4">
              <button onClick={submitButton}>
                <BsCheck2 className="w-[21px] h-[21px]" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default InputEdit;
