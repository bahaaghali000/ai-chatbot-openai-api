import { useState, useEffect } from "react";
import aiAvatar from "../../assets/avatar.jpg";
import clientAvatar from "../../assets/comment_avatar01.png";
import Loader from "../Loader/Loader";
import { FaGithub, FaArrowLeft } from "react-icons/fa";
import { MdChatBubbleOutline, MdClose } from "react-icons/md";
import { CgTrashEmpty } from "react-icons/cg";
import { IoMdSend, IoMdMenu } from "react-icons/io";

interface Message {
  title?: string;
  content: string;
  role: string;
}

const Main = () => {
  const [input, setInput] = useState<string>("");
  const [message, setMessage] = useState<Message | null>(null);
  const [previousChats, setPreviousChats] = useState<Message[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showSlideBar, setShowSlideBar] = useState<boolean>(false);

  // Return data from localStorage
  useEffect(() => {
    if (localStorage.getItem("chatbotMsgs")) {
      setPreviousChats(JSON.parse(localStorage.getItem("chatbotMsgs")!));
    } else {
      setPreviousChats([]);
    }

    if (localStorage.getItem("chatbotCurrentChat")) {
      setCurrentTitle(JSON.parse(localStorage.getItem("chatbotCurrentChat")!));
    } else {
      setCurrentTitle(null);
    }
  }, []);

  const createNewChat = () => {
    setInput("");
    setMessage(null);
    setCurrentTitle(null);
    setShowMenu(false);
  };

  // change the chat
  const handleClick = (uniqueTitle: string) => {
    setCurrentTitle(uniqueTitle);
    setShowMenu(false);
    setInput("");
    setMessage(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (input.trim()) {
      setIsLoading(true);
      try {
        const res = await fetch(
          "https://ai-chat-bot-bahaaghali000.onrender.com/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: input,
            }),
          }
        );

        const { data } = await res.json();
        setMessage(data.choices[0].message);
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);
        alert(error.message);
      }
    } else {
      alert("Please, Enter Something");
    }
  };

  // set the current chat in localStorage
  useEffect(() => {
    if (currentTitle) {
      localStorage.setItem("chatbotCurrentChat", JSON.stringify(currentTitle));
    }
  }, [currentTitle]);

  useEffect(() => {
    if (!currentTitle && input && message) {
      // current title is the chat name
      setCurrentTitle(input);
      console.log("condition 1");
    }

    if (currentTitle && input && message) {
      setPreviousChats((prevChats: Message[]) => [
        ...prevChats,
        // user input
        {
          title: currentTitle,
          role: "user",
          content: input,
        },
        // chatGpt response
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
      setInput("");
    }
  }, [message, currentTitle]);

  // update the Chat messages in localStorage
  useEffect(() => {
    if (previousChats.length > 0) {
      localStorage.setItem("chatbotMsgs", JSON.stringify(previousChats));
    }
  }, [message, previousChats]);

  // to get the messages for which chat active
  const currentChat: Message[] = previousChats.filter(
    (prevchat) => prevchat.title === currentTitle
  );

  const uniqueTitles: any = Array.from(
    new Set(previousChats.map((prevChat) => prevChat.title))
  );

  const handleClear = () => {
    setPreviousChats([]);
    localStorage.removeItem("chatbotMsgs");
    localStorage.removeItem("chatbotCurrentChat");
  };

  // for make the app more responsive
  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 992) {
        setShowSlideBar(false);
        setShowMenu(false);
      } else {
        setShowSlideBar(true);
      }
    });
  }, []);

  const handleSlideBar = () => {
    if (window.innerWidth > 640) {
      setShowSlideBar(!showSlideBar);
    } else {
      setShowMenu(!showMenu);
    }
  };

  return (
    <div className=" flex  min-h-screen relative">
      {showSlideBar && (
        <section className="p-4 bg-[#222222] sm:flex hidden w-[308px] min-h-screen  flex-col items-center justify-between border-r border-gray-600 ">
          <div className=" w-full ">
            <button
              onClick={createNewChat}
              className=" rounded-[10px] w-full py-3 px-4 bg-[#019A5A] text-[#E5E5E5] leading-[150%] font-semibold hover:bg-[#2e835f] mb-6"
            >
              + Start a new chat
            </button>

            <ul>
              {uniqueTitles.length > 0 ? (
                uniqueTitles.map((title: string, index: number) => (
                  <li
                    key={index}
                    onClick={() => handleClick(title)}
                    className="py-3 px-4 text-[#E5E5E5] flex items-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <span>
                      <MdChatBubbleOutline />
                    </span>
                    <p>{title}</p>
                  </li>
                ))
              ) : (
                <h3 className=" text-[#E5E5E5] opacity-30 mt-2 text-center text-xl font-medium">
                  No chats yet
                </h3>
              )}
            </ul>
          </div>

          <div className="w-full">
            <ul className=" border-t border-gray-400 ">
              {uniqueTitles.length > 0 && (
                <li
                  onClick={handleClear}
                  className="py-3 px-4 text-[#E5E5E5] flex items-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span>
                    <CgTrashEmpty />
                  </span>
                  <p>Clear all conversations</p>
                </li>
              )}
            </ul>

            <ul className="border-t border-gray-400 ">
              <li className="py-3 px-4 text-[#E5E5E5] flex items-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                <p>
                  Made by{" "}
                  <a
                    className="text-cyan-800 font-semibold "
                    href="https://bahaaghali000.vercel.app/"
                    target="_blank"
                  >
                    Bahaa Ghali
                  </a>
                </p>
              </li>
            </ul>
          </div>
        </section>
      )}

      {showMenu && (
        <>
          <section className="absolute p-4 bg-[#222222] shadow-2xl flex w-[260px] min-h-screen z-20  flex-col items-center justify-between border-r border-gray-600 ">
            <span
              onClick={() => setShowMenu(false)}
              className="text-white absolute top-1/2 -right-12  text-xl  cursor-pointer p-4  hover:text-[#019A5A] "
            >
              <FaArrowLeft />
            </span>

            <div className="w-full">
              <button
                onClick={createNewChat}
                className=" rounded-[10px] w-full py-3 px-4 bg-[#019A5A] text-[#E5E5E5] leading-[150%] font-semibold hover:bg-[#2e835f] mb-6"
              >
                + Start a new chat
              </button>

              <ul>
                {uniqueTitles.length > 0 ? (
                  uniqueTitles.map((title: string, index: number) => (
                    <li
                      key={index}
                      onClick={() => handleClick(title)}
                      className="py-3 px-4 text-[#E5E5E5] flex items-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      <span>
                        <MdChatBubbleOutline />
                      </span>
                      <p>{title}</p>
                    </li>
                  ))
                ) : (
                  <h3 className=" text-[#E5E5E5] opacity-30 mt-2 text-center text-xl font-medium">
                    No chats yet
                  </h3>
                )}
              </ul>
            </div>

            <div className="w-full">
              <ul className=" border-t border-gray-400 ">
                {uniqueTitles.length > 0 && (
                  <li
                    onClick={handleClear}
                    className="py-3 px-4 text-[#E5E5E5] flex items-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    <span>
                      <CgTrashEmpty />
                    </span>
                    <p>Clear all conversations</p>
                  </li>
                )}
              </ul>

              <ul className="border-t border-gray-400 ">
                <li className="py-3 px-4 pb-0 text-[#E5E5E5] flex items-center gap-2 cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap">
                  <p>
                    Made by{" "}
                    <a
                      className=" text-cyan-800 font-semibold "
                      href="https://bahaaghali000.vercel.app/"
                      target="_blank"
                    >
                      Bahaa Ghali
                    </a>
                  </p>
                </li>
              </ul>
            </div>
          </section>

          <div
            onClick={() => setShowMenu(false)}
            className=" w-full h-full bg-black opacity-40 absolute top-0 left-0 z-10 "
          ></div>
        </>
      )}

      <section className=" p-3 bg-black w-full max-h-screen relative">
        <div>
          <a
            title="The App's Code"
            target="_blank"
            href="https://github.com/bahaaghali000/ai-chatbot-openai-api.git" // GitHub Repo
            className="text-white absolute top-[2%] text-3xl right-6 p-4 hover:text-black"
          >
            <FaGithub />
          </a>
        </div>
        <div className=" sm:p-8 p-4 border  border-gray-600 h-full  rounded-2xl  bg-[#222222] flex flex-col justify-between ">
          <div className=" overflow-y-scroll scroll-m-px h-full max-sm:mt-8 mt-4 mb-2 max-sm:text-sm ">
            <ul className=" sm:mt-4  mt-8">
              {currentChat.length > 0 ? (
                currentChat?.map((chat: Message, index: number) => (
                  <li
                    key={index}
                    className={`${
                      chat.role === "assistant" && "bg-[#019A5A] "
                    } rounded-xl sm:p-6 p-3 flex items-center mb-5  gap-1`}
                  >
                    <div>
                      {chat.role === "assistant" ? (
                        <img
                          src={aiAvatar}
                          className="w-10 rounded-full "
                          alt=""
                        />
                      ) : (
                        <img
                          src={clientAvatar}
                          className="w-10 rounded-full "
                          alt=""
                        />
                      )}
                    </div>

                    <p className=" w-full text-gray-100 sm:ml-4 ml-1">
                      {chat.content}
                    </p>
                  </li>
                ))
              ) : (
                <div className=" flex items-center justify-center h-full text-[#019A5A] font-semibold text-3xl mt-32">
                  <h3>No Chat</h3>
                </div>
              )}
            </ul>
          </div>

          <form
            className="rounded-xl border border-gray-600 p-2  flex justify-between"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="message BGChatgpt"
              className=" bg-transparent border-none outline-none w-full text-gray-300 text-lg"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              required
            />

            <button
              type="submit"
              className={`rounded-xl p-3 bg-[#019A5A] border border-[#39b481]  text-white outline-none ${
                isLoading
                  ? "cursor-not-allowed opacity-60"
                  : "hover:bg-[#2c7c5b] cursor-pointer"
              }`}
            >
              {isLoading ? <Loader /> : <IoMdSend />}
            </button>
          </form>
        </div>

        <div
          className="flex justify-between items-center"
          onClick={handleSlideBar}
        >
          <span className="text-white absolute top-[2%] text-3xl left-6 cursor-pointer p-4  hover:text-[#019A5A] ">
            {showSlideBar ? <MdClose /> : <IoMdMenu />}
          </span>
        </div>
      </section>
    </div>
  );
};

export default Main;
