import React, { useRef, useState } from "react";

const NotesEditor = () => {
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
  const [selectedBlockId, setSelectedBlockId] = useState();
  const blockInputRefs = useRef({});

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

  const updateBlock = (id, updates) => {
    setNote({
      ...note,
      blocks: note.blocks.map((block) => {
        if (block.id === id) {
          return { ...block, ...updates };
        }
        return block;
      }),
    });
  };

  const removeBlock = (id) => {
    const blockIndex = note.blocks.findIndex((block) => block.id === id);
    if (blockIndex !== -1) {
      const updatedBlocks = note.blocks.filter(block.id !== id);
      setNote({
        ...note,
        blocks: updatedBlocks,
      });

      if (updatedBlocks.length > 0) {
        const newIndex = M.min(blockIndex, updatedBlocks.length - 1);
        setSelectedBlockId(updatedBlocks[newIndex].id);
        focusBlock(updateBlocks[newIndex].id);
      }
    }
  };

  const addListItem = (blockId, index) => {
    console.log(blockId)
    const block = note.blocks.find((b) => b.id === blockId);
    if (block && (block.type === "bulletList" || block.type === "numberList")) {
      const newItems = [...block.items];
      newItems.splice(index + 1, 0, "");
      updateBlock(blockId, { items: newItems });
    }
  };

  const removeListItem = (blockId, index) => {
    const block = note.blocks.find((b) => b.id === blockId);
    if (block && (block.type == "bulletList" || block.type == "numberList")) {
      if (block.items.length <= 1) {
        removeBlock(blockId);
      } else {
        const newItems = block.items.filter((_, i) => i !== index);
        updateBlock(blockId, { items: newItems });
      }
    }
  };

  const updateListItem = (blockId, index, value) => {
    const block = note.blocks.find((b) => b.id === blockId);
    if (block && (block.type === "bulletList" || block.type === "numberList")) {
      const newItems = [...block.items];
      newItems[index] = value;
      updateBlock(blockId, { items: newItems });
    }
  };

  const applyFormatting = (type) => {
    if (!selectedBlockId) return;

    const block = note.blocks.find((b) => b.id === selectedBlockId);
    if (!block || block.type !== "text") return;

    const inputElement = blockInputRefs.current[selectedBlockId];
    if (inputElement) return;

    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    const selectedText = block.content.substring(start, end);
    if (start === end) return;

    let formattedText;
    switch (type) {
      case "bold":
        formattedText = `**${selectedText}**`;
        break;
      case "italic":
        formattedText = `*${selectedText}*`;
        break;
      case "link":
        formattedText = `[${selectedText}](url)`;
        break;
      default:
        return;
    }

    const newContent =
      block.content.substring(0, start) +
      formattedText +
      block.content.substring(end);
    updateBlock(selectedBlockId, { content: newContent });

    setTimeout(() => {
      inputElement.focus();
      const newPosition = start + formattedText.length;
      inputElement.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const renderBlock = (block) => {
    const isSelected = selectedBlockId === block.id;

    switch (block.type) {
      case "text":
        return (
          <textarea
            ref={(ref) => (blockInputRefs.current[block.id] = ref)}
            value={block.content}
            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
            className={`w-full min-h-24 p-4 text-xl border rounded-md resize-y ${isSelected ? "border-[#4a90e2] shadow-md" : ""}`}
            placeholder="Write your text here..."
            onClick={() => setSelectedBlockId(block.id)}
          />
        );

      case "heading":
        return (
          <div className="flex items-center gap-2 w-full">
            <select
              value={block.level}
              onChange={(e) =>
                updateBlock(block.id, { level: parseInt(e.target.value) })
              }
              className="p-1 border rounded-md bg-[#f9f9f9]"
            >
              <option value={1}>H1</option>
              <option value={2}>H2</option>
              <option value={3}>H3</option>
              <option value={4}>H4</option>
            </select>
            <input
              ref={(ref) => (blockInputRefs.current[block.id] = ref)}
              type="text"
              value={block.content}
              onChange={(e) =>
                updateBlock(block.id, { content: e.target.value })
              }
              className={`flex-1 px-3 py-2 border rounded-md font-bold ${block.level === 1 && "text-2xl" || block.level === 2 && "text-xl" || block.level === 2 && "text-[18px]" || block.level === 2 && "text-[16px]"} ${
                isSelected ? "border-[#4a90e2] shadow-md" : ""
              }`}
              placeholder={`Heading ${block.level}`}
              onClick={() => setSelectedBlockId(block.id)}
            />
          </div>
        );

      //   case "code":
      //     return (
      //       <div onClick={() => setSelectedBlockId(block.id)}>
      //         <CodeBlock
      //           initialLanguage={block.language}
      //           initialCode={block.content}
      //           onChange={(newCode, newLanguage) =>
      //             updateBlock(block.id, {
      //               content: newCode,
      //               language: newLanguage,
      //             })
      //           }
      //         />
      //       </div>
      //     );

      case "bulletList":
      case "numberList":
        return (
          <div
            className={`overflow-y-auto px-3 py-2 border rounded-md ${
              block.type === "bulletList" ? "bullet" : "number"
            } ${isSelected ? "border-[#4a90e2] shadow-md" : ""}`}
            onClick={() => setSelectedBlockId(block.id)}
          >
            {block.items.map((item, index) => (
              <div key={index} className="flex items-center mb-2 group">
                <span className="w-6 text-center font-bold">
                  {block.type === "bulletList" ? "•" : `${index + 1}.`}
                </span>
                <input
                  ref={
                    index === 0
                      ? (ref) => (blockInputRefs.current[block.id] = ref)
                      : null
                  }
                  type="text"
                  value={item}
                  onChange={(e) =>
                    updateListItem(block.id, index, e.target.value)
                  }
                  className="flex-1 px-2 py-1 border mr-2 rounded-md"
                  placeholder="List item"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addListItem(block.id, index);
                    } else if (e.key === "Backspace" && item === "") {
                      e.preventDefault();
                      removeListItem(block.id, index);
                    }
                  }}
                />
                <button
                  className="bg-none border-none text-[#f44336] cursor-pointer text-xl flex items-center justify-center opacity-0 group-hover:opacity-100"
                  onClick={() => removeListItem(block.id, index)}
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              className="bg-none border-none text-[#4a90e2] cursor-pointer text-sm ml3 px-1"
              onClick={() => addListItem(block.id, block.items.length - 1)}
            >
              + Add item
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full my-0 mx-auto p-4 overflow-y-auto h-96">
      <input
        type="text"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        className="w-full text-2xl px-4 py-2 mb-5 border rounded-md font-bold"
        placeholder="Note title"
      />

      <div className="flex w-80 flex-col gap-3 px-4 py-4 mb-5 bg-[#f9f9f9] border rounded-md">
        <div className="flex flex-col gap-1 pr-3">
          <button
            onClick={() => addBlock("heading")}
            className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500"
            title="Add heading"
          >
            H
          </button>
          <button
            onClick={() => applyFormatting("bold")}
            className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500"
            title="Bold"
          >
            B
          </button>
          <button
            onClick={() => applyFormatting("italic")}
            className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500"
            title="Italic"
          >
            I
          </button>
        </div>

        <div className="flex flex-col gap-1 pr-3 border-r">
          <button className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500" onClick={() => addBlock("bulletList")}>
            {" "}
            • List
          </button>
          <button className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500" onClick={() => addBlock("bulletList")}>
            {" "}
            1. List
          </button>
        </div>
        <div className="flex flex-col gap-1 pr-3 border-r">
          <button
            onClick={() => applyFormatting("link")}
            className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500"
            title="Add link"
          >
            Link
          </button>
          <button
            onClick={() => addBlock("code")}
            className="px-2 py-1 bg-white border rounded-md cursor-pointer text-sm flex items-center justify-center hover:bg-gray-200 hover:text-gray-500"
            title="Add code block"
          >
            Code
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3 mb-5">
        {note.blocks.map((block) => (
          <div key={block.id} className="relative border rounded-md hover:border-gray-500">
            <div className="absolute top-2 right-2 z-10 opacity-0">
              <button
                onClick={() => removeBlock(block.id)}
                className="bg-[#f44336] text-white border-none rounded-full w-6 h-6 text-xl cursor-pointer flex items-center justify-center"
                title="Remove block"
              >
                &times;
              </button>
            </div>
            {renderBlock(block)}
          </div>
        ))}
      </div>
      <div className="flex justify-center mb7">
        <button onClick={() => addBlock("text")} className="px-4 py-2 bg-[#f9f9f9] border cursor-pointer text-sm text-[#666] hover:bg-[#f0f0f0] hover:border-[#bbb]">
          + Add block
        </button>
      </div>
      {/* Preview section */}
      <div className="border-t pt-5 mt-7">
        <h2 className="mb-5 text-[#666] text-xl">Preview</h2>
        <h1 className="text-3xl mb-6 pb-4 border-b">{note.title}</h1>

        {note.blocks.map((block, index) => (
          <div key={index} className="mb-5">
            {block.type === "text" && (
              <div
                className="text-[16px] leading-1.5"
                dangerouslySetInnerHTML={{
                  __html: block.content
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\*(.*?)\*/g, "<em>$1</em>")
                    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
                    .replace(/\n/g, "<br>"),
                }}
              />
            )}

            {block.type === "heading" &&
              React.createElement(
                `h${block.level}`,
                { className: `${block.level === 1 && "text-[28px]" || block.level === 2 && "text-[24px]" || block.level === 3 && "text-[20px]" || block.level === 4 && "text-[18px]"}` },
                block.content
              )}

            {/* {block.type === "code" && (
              <CodeBlock
                initialLanguage={block.language}
                initialCode={block.content}
                readOnly={true}
              />
            )} */}

            {block.type === "bulletList" && (
              <ul className="ml-5 leading-1.5">
                {block.items.map((item, i) => (
                  <li key={i} className="mb-2">{item}</li>
                ))}
              </ul>
            )}

            {block.type === "numberList" && (
              <ol className="ml-5 leading-1.5">
                {block.items.map((item, i) => (
                  <li key={i} className="mb-2">{item}</li>
                ))}
              </ol>
            )}


          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesEditor;
