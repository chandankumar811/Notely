import {
  Heading1,
  Heading2,
  Heading3,
  ListOrdered,
  LucideList,
  Text,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const NoteEditor = () => {
  // const [note, setNote] = useState();
  const [openMenu, setOpenMenu] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState();
  const blockInputRefs = useRef({});

  const [note, setNote] = useState({
    title: "My Technical Note",
    blocks: [
      {
        id: "1",
        type: "heading",
        level: 1,
        content: "Getting Started with React Hooks",
      },
      {
        id: "2",
        type: "text",
        content:
          "React Hooks provide a new way to use state and lifecycle features in functional components.",
      },
      {
        id: "3",
        type: "heading",
        level: 2,
        content: "useState Example",
      },
      {
        id: "4",
        type: "code",
        language: "javascript",
        content:
          "function Counter() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}",
      },
      {
        id: "5",
        type: "bulletList",
        items: [
          "Easy to use",
          "Reduces boilerplate code",
          "Makes components more readable",
        ],
      },
    ],
  });

  useEffect(() => {
    if (note && note.length === 1 && note[0] === "/") {
      setOpenMenu(true);
    } else {
      setOpenMenu(false);
    }
  }, [note]);

  const focusBlock = (id) => {
    if (blockInputRefs.current[id]) {
      setTimeout(() => {
        blockInputRefs.current[id].focus();
      }, 0);
    }
  };
  const addBlock = (type, position = note.blocks.length) => {
    const id = Date.now().toString();
    let newBlock;

    switch (type) {
      case "text":
        newBlock = { id, type: "text", content: "" };
        break;
      case "heading":
        newBlock = { id, type: "heading", level: 2, content: "" };
        break;
      case "code":
        newBlock = {
          id,
          type: "code",
          language: "javascript",
          content: "// Add your code here",
        };
        break;
      case "bulletList":
        newBlock = { id, type: "bulletList", items: [""] };
        break;
      case "numberList":
        newBlock = { id, type: "numberList", items: [""] };
        break;
      default:
        newBlock = { id, type: "text", content: "" };
    }

    const updatedBlocks = [...note.blocks];
    updatedBlocks.splice(position, 0, newBlock);

    setNote({
      ...note,
      blocks: updatedBlocks,
    });
    setSelectedBlockId(id);
    focusBlock(id);
  };

  const renderBlock = (block) => {
    const isSelected = selectedBlockId === block.id;
    switch (block.type) {
      case "text":
        return (
          <input
            ref={(ref) => (blockInputRefs.current[block.id] = ref)}
            value={block.content}
            onChange={(e) =>
              updatedBlocks(block.id, { content: e.target.value })
            }
            type="text"
            className={`w-full px-3 py-2  mt-5 outline-none`}
            placeholder="Type /"
            // onChange={(e) => setNote(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="w-full p-3 pl-16">
      <input
        type="text"
        className={`w-full h-16 text-5xl font-bold p-3 outline-none border-b`}
        placeholder="Note title..."
      />
      <input
        type="text"
        className={`w-full px-3 py-2  mt-5 outline-none`}
        placeholder="Type /"
        onChange={(e) => setNote(e.target.value)}
      />

      <div
        className={`flex border rounded-md w-80 bg-white ${
          openMenu ? "block" : "hidden"
        }`}
      >
        <div className=" w-full">
          <p className="text-sm border-b w-full p-3">Basic</p>
          <button className="flex px-2 py-1 justify-start items-center border-b w-full hover:bg-gray-300 ">
            <Text className="w-8 h-8 rounded-md" size={25} />
            <p className="flex flex-col items-start ml-3">
              <span className="text-sm">Text</span>
              <span className="text-xs">Write plain text</span>
            </p>
          </button>
          <button className="flex px-2 py-1 justify-start items-center border-b w-full hover:bg-gray-300 ">
            <Heading1 className="w-8 h-8 rounded-md" size={25} />
            <p className="flex flex-col items-start ml-3">
              <span className="text-sm">Heading-1</span>
              <span className="text-xs">Big heading</span>
            </p>
          </button>
          <button className="flex px-2 py-1 justify-start items-center border-b w-full hover:bg-gray-300 ">
            <Heading2 className="w-8 h-8 rounded-md" size={25} />
            <p className="flex flex-col items-start ml-3">
              <span className="text-sm">Heading-2</span>
              <span className="text-xs">Medium heading</span>
            </p>
          </button>
          <button className="flex px-2 py-1 justify-start items-center border-b w-full hover:bg-gray-300 ">
            <Heading3 className="w-8 h-8 rounded-md" size={25} />
            <p className="flex flex-col items-start ml-3">
              <span className="text-sm">Heading-3</span>
              <span className="text-xs">Small Heading</span>
            </p>
          </button>
          <button className="flex px-2 py-1 justify-start items-center border-b w-full hover:bg-gray-300 ">
            <LucideList className="w-8 h-8 rounded-md" size={25} />
            <p className="flex flex-col items-start ml-3">
              <span className="text-sm">Bullet Lsit</span>
              <span className="text-xs">Create a simple bullet list</span>
            </p>
          </button>
          <button className="flex px-2 py-1 justify-start items-center border-b w-full hover:bg-gray-300 ">
            <ListOrdered className="w-8 h-8 rounded-md" size={25} />
            <p className="flex flex-col items-start ml-3">
              <span className="text-sm">Number List</span>
              <span className="text-xs">Create a simple number list</span>
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
