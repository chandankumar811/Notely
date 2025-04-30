import { Download, Play, Video } from "lucide-react";
import React, { useEffect, useState } from "react";
import PreviewModal from "react-media-previewer";
import { useTheme } from "../../contexts/ThemeContext";
import { getThemeClasses } from "../../utils/theme";

const MessageBubble = () => {
  const sampleMessages = [
    {
      id: 1,
      senderId: "user123",
      message: "Hello! Check out this link: https://example.com",
      messageType: "text",
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      senderId: "user456",
      message: "See this image!",
      attachment: "https://assets.thehansindia.com/h-upload/2019/11/24/238826-beautiful-scene.webp",
      messageType: "image",
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      senderId: "user123",
      message: "Cool video!",
      attachment: "https://www.w3schools.com/html/mov_bbb.mp4",
      messageType: "video",
      timestamp: new Date().toISOString(),
    },
    {
      id: 4,
      senderId: "user456",
      message: "Download this document",
      attachment:
        "https://file-examples.com/wp-content/uploads/2017/10/file-example_PDF_1MB.pdf",
      messageType: "document",
      timestamp: new Date().toISOString(),
    },
  ];

  const currentUserId = "user123"; // Replace with the actual current user ID

  const [fileDetails, setFileDetails] = useState({});
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const { darkMode } = useTheme();
  const themeClasses = getThemeClasses(darkMode);

  useEffect(() => {
    sampleMessages.forEach((msg) => {
      if (msg.messageType === "document" && msg.attachment) {
        fetch(msg.attachment, { method: "HEAD" })
          .then((res) => {
            const size = res.headers.get("content-length");
            const fileName = decodeURIComponent(
              msg.attachment.split("/").pop()
            );
            setFileDetails((prev) => ({
              ...prev,
              [msg.id]: {
                size: size ? (size / 1048576).toFixed(2) + " MB" : "Unknown",
                name: fileName,
              },
            }));
          })
          .catch((err) => {
            console.error("Error fetching file details:", err);
          });
      }
    });
  }, []);

  const renderMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          {part}
        </a>
      ) : (
        part
      )
    );
  };
  return (
    <div className="">
      {showMediaPreview && <PreviewModal src={message.attachment} />}
      {sampleMessages.map((message, index) => (
        <div
          className={`mb-6 flex ${
            sampleMessages[index].senderId === currentUserId
              ? "justify-end"
              : "justify-start"
          }`}
        >
          <div className={`max-w-xs md:max-w-md`}>
            {message.attachment ? (
              <div
                className={`p-2 pb-1 rounded-lg ${
                  sampleMessages[index].senderId === currentUserId
                    ? themeClasses.selfMessage
                    : themeClasses.otherMessage
                }`}
              >
                <div
                  className={`w-full max-w-[300px] ${themeClasses.imagePlaceholder} rounded-lg flex items-center justify-center text-center`}
                >
                  {message.messageType === "image" && (
                    <img
                      src={message.attachment}
                      alt="Image"
                      className={`w-full h-full rounded-lg`}
                    />
                  )}
                  {message.messageType === "video" && (
                    <div className="relative">
                      <video
                        src={message.attachment}
                        alt="video"
                        className="w-full h-full rounded-lg"
                        controls={false}
                      />
                      <div className="absolute flex items-center justify-center inset-0 rounded-lg bg-transparent text-gray-300 w-full h-full" >
                        <Play size={20} />
                      </div>
                    </div>
                  )}
                  {sampleMessages.messageType === "document" && (
                    <div
                      className={`
                    flex items-center 
                    w-full h-full
                    rounded-lg 
                    p-3 
                    space-x-3 
                    ${
                      itSelf
                        ? darkMode
                          ? "bg-blue-800/50 text-white"
                          : "bg-blue-100 text-blue-900"
                        : darkMode
                        ? "bg-gray-700 text-gray-200 border-1 border-gray-600"
                        : "bg-gray-200 text-gray-800"
                    }
                  `}
                    >
                      <div
                        className={`
                      p-2 
                      rounded-lg 
                      flex 
                      items-center 
                      justify-center
                      ${
                        itSelf
                          ? darkMode
                            ? "bg-white/20 text-blue-400"
                            : "bg-white/60 text-blue-600"
                          : darkMode
                          ? "bg-white/10 text-gray-300"
                          : "bg-white/70 text-gray-600"
                      }
                    `}
                      >
                        <File />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div
                          className="font-medium text-sm truncate"
                          title={fileDetails.fileName}
                        >
                          {fileDetails.fileName}
                        </div>
                        <div
                          className={`
                          text-xs 
                          ${
                            itSelf
                              ? darkMode
                                ? "text-blue-200"
                                : "text-blue-700"
                              : darkMode
                              ? "text-gray-400"
                              : "text-gray-600"
                          }
                        `}
                        >
                          {fileDetails.size}
                        </div>
                      </div>
                      <button
                        className={`
                        p-2 
                        rounded-full 
                        ${
                          itSelf
                            ? darkMode
                              ? "text-white hover:bg-blue-500"
                              : "text-blue-600 hover:bg-blue-300"
                            : darkMode
                            ? "text-gray-300 hover:bg-gray-600/90"
                            : "text-gray-600 hover:bg-gray-100"
                        }
                      `}
                      >
                        <Download />
                      </button>
                    </div>
                  )}
                </div>
                <div
                  className={`flex flex-col py-2 ml-auto w-full max-w-[200px] max-h-[200px]`}
                >
                  <p className="whitespace-pre-line">
                    {renderMessage(message?.message)}
                  </p>
                  <span className="flex text-[10px] items-end text-gray-300 text-nowrap ml-auto">
                    {new Date(message.timestamp).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className={`flex gap-3 px-4 py-2 rounded-lg ${
                  message.senderId === currentUserId
                    ? themeClasses.selfMessage
                    : themeClasses.otherMessage
                }`}
              >
                <p className="whitespace-pre-line">
                  {renderMessage(sampleMessages[index]?.message)}
                </p>
                <span className="flex text-[10px] items-end text-gray-300 text-nowrap">
                  {new Date(sampleMessages[index].timestamp).toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }
                  )}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageBubble;
