import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLongArrowAltRight, FaSearch } from "react-icons/fa";
import { SiMicrosoftexcel, SiMicrosoftword, SiFiles } from "react-icons/si";
import { BsFiletypeExe, BsFileEarmarkImage } from "react-icons/bs";
import axios from "axios";
import LoadingProvider from "../context/LoadingContext";
import Icons from "../assets/icons/Icons";
import Arrow from "../assets/arrow-hand.svg";
import SideBar from "../components/SideBar";

function Home({ addClass }) {
  const { isLogged, setIsLogged } = useContext(LoadingProvider);
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [plannerList, setPlannerList] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [uid, setUid] = useState(null);
  const [email, setEmail] = useState(null);
  const [reload, setReload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      getAccountDetails(JSON.parse(isAuth).id);
      getRecentFiles(JSON.parse(isAuth).email);
      setIsLogged(true);
    } else {
      setIsLogged(false);
    }
  }, []);

  useEffect(() => {
    let isAuth = localStorage.getItem("user");
    if (isAuth && isAuth !== "undefined") {
      if (!reload) {
        getRecentFiles(JSON.parse(isAuth).email);
        getPlannerList(JSON.parse(isAuth).email);
        setReload(!reload);
      }
    }
  }, [reload]);

  const getRecentFiles = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/files/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          console.log(result.data.fileDetails);
          setFiles([...result.data.fileDetails.files]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getPlannerList = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + "/planner/" + user)
        .then((result) => {
          setEmail(result.data.accountDetails.email);
          setUid(result.data.accountDetails.profileDetails[0].uid);
          setPlannerList([...result.data.plannerDetails.plannerList]);
          setTodoList([...result.data.plannerDetails.todoList]);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const getAccountDetails = async (user) => {
    try {
      await axios
        .get(process.env.REACT_APP_API_URI + `/${user}`)
        .then((result) => {
          setName(result.data.name);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <>
      {isLogged ? (
        <div className="2xl:pt-56 md:pt-48 bg-blue-100 w-full h-screen">
          <div className="container flex flex-col mx-auto font-roboto px-20  2xl:-mt-[175px] md:-mt-[140px]">
            <SideBar />
            <div className="relative">
              <input
                type="text"
                id="seacrh"
                placeholder="Search"
                className="bg-white text-gray-900 text-sm rounded-lg block w-6/12 px-10 py-2.5 focus:shadow-md focus:outline-none"
              />
              <FaSearch className="absolute left-3.5 top-3.5 opacity-20" />
            </div>
            <p className="text-2xl font-bold mt-8 mb-3 text-blue-500 text-4xl">{`Hello, ${name}!`}</p>
            <div className="bg-white rounded-lg px-5 pt-5 my-5 shadow-md w-1/2">
              <p className=" border-b-2 pb-5">Recent Files</p>
              <div className="flex justify-center gap-5">
                <ul
                  className={`flex ${
                    files.length < 4 ? "justify-start" : "justify-between"
                  } w-full`}
                >
                  {files
                    .slice(0)
                    .reverse()
                    .map((i, n) => {
                      if (n < 4) {
                        if (i.fileName.split(".").pop() === "xlsx") {
                          return (
                            <li
                              key={n}
                              className="flex flex-col items-center py-8 px-1"
                            >
                              <div className="bg-[#5cb85c] p-2 rounded-lg">
                                <SiMicrosoftexcel
                                  size={20}
                                  className="text-white"
                                />
                              </div>
                              <p className="truncate w-32 mt-3 text-center">
                                {i.fileName}
                              </p>
                            </li>
                          );
                        } else if (
                          i.fileName.split(".").pop() === "docx" ||
                          i.fileName.split(".").pop() === "pdf"
                        ) {
                          return (
                            <li
                              key={n}
                              className="flex flex-col items-center py-8 px-1"
                            >
                              <div className="bg-[#0275d8] p-2 rounded-lg">
                                <SiMicrosoftword
                                  size={20}
                                  className="text-white"
                                />
                              </div>
                              <p className="truncate w-32 mt-3 text-center">
                                {i.fileName}
                              </p>
                            </li>
                          );
                        } else if (i.fileName.split(".").pop() === "exe") {
                          return (
                            <li
                              key={n}
                              className="flex flex-col items-center py-8 px-1"
                            >
                              <div className="bg-[#d9534f] p-2 rounded-lg">
                                <BsFiletypeExe
                                  size={20}
                                  className="text-white"
                                />
                              </div>
                              <p className="truncate w-32 mt-3 text-center">
                                {i.fileName}
                              </p>
                            </li>
                          );
                        } else if (
                          i.fileName.split(".").pop() === "png" ||
                          i.fileName.split(".").pop() === "jpeg" ||
                          i.fileName.split(".").pop() === "jpg"
                        ) {
                          return (
                            <li
                              key={n}
                              className="flex flex-col items-center p-8"
                            >
                              <div className="bg-[#6610f2] p-2 rounded-lg">
                                <BsFileEarmarkImage
                                  size={20}
                                  className="text-white"
                                />
                              </div>
                              <p className="truncate w-32 mt-3 text-center">
                                {i.fileName}
                              </p>
                            </li>
                          );
                        } else {
                          return (
                            <li
                              key={n}
                              className="flex flex-col items-center py-8 px-1"
                            >
                              <div className="bg-[#292b2c] p-2 rounded-lg">
                                <SiFiles size={20} className="text-white" />
                              </div>
                              <p className="truncate w-32 mt-3 text-center">
                                {i.fileName}
                              </p>
                            </li>
                          );
                        }
                      }
                    })}
                </ul>
              </div>
            </div>
            <div className="max-h-[24rem] w-2/3">
              {plannerList.map((i, n) => {
                if (new Date() < new Date(i.taskDuration)) {
                  if (n < 3) {
                    return (
                      <>
                        <div
                          key={n}
                          className="bg-white rounded-lg p-5 gap-5 flex items-center mb-5 shadow-md w-3/3"
                        >
                          <div
                            className="w-[50px] h-[50px] rounded-lg"
                            style={{
                              backgroundImage:
                                "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                            }}
                          ></div>
                          <div className="flex flex-col gap-1 w-3/12">
                            <p className="font-bold">{i.taskName}</p>
                            <p className="text-gray-400 text-sm text-ellipsis truncate">
                              {i.taskDescription}
                            </p>
                          </div>
                          <div className="w-4/12">
                            <p className="text-gray-400">
                              {`Created: ${
                                month[new Date(i.createdAt).getMonth()]
                              }
                      ${new Date(i.createdAt).getDate()}, 
                      ${new Date(i.createdAt).getFullYear()}`}
                            </p>
                            <p className="font-bold">
                              {`Due: ${
                                month[new Date(i.taskDuration).getMonth()]
                              }
                      ${new Date(i.taskDuration).getDate()}, 
                      ${new Date(i.taskDuration).getFullYear()}`}
                            </p>
                          </div>
                          <div className="w-3/12 flex flex-col gap-3 justify-end">
                            <div className="flex justify-between">
                              <p className="text-sm">Remaining</p>
                              <p className="text-sm">
                                {i.taskDurationNum >=
                                new Date(
                                  new Date(i.taskDuration) - new Date()
                                ).getDate() -
                                  1
                                  ? new Date(
                                      new Date(i.taskDuration) - new Date()
                                    ).getDate() - 1
                                  : 0}
                                d
                              </p>
                            </div>
                            <div className="rounded-lg h-2 bg-[#00d2ff]/20">
                              <div
                                className="rounded-lg h-2"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(to left top, #3a7bd5, #00d2ff)",
                                  width: `${
                                    (1 -
                                      (new Date(
                                        new Date(i.taskDuration) - new Date()
                                      ).getDate() -
                                        1) /
                                        i.taskDurationNum) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="2xl:pt-56 md:pt-48">
          <div className="container flex flex-col mx-auto font-roboto px-20">
            <div className="pr-20 flex justify-between flex-wrap">
              <div>
                <p className="font-semibold text-6xl w-[38rem] text-[#102c54]">
                  Work
                  <br />
                  Your Way
                  <br />
                  <p className="relative mt-5">
                    <div className="absolute bg-[#102c54] py-5 w-[620px] h-[88px] -rotate-1 -top-3 -right-1"></div>
                    <p className="text-white absolute">Personal Workspace</p>
                  </p>
                </p>
                <p className="font-base text-gray-600 text-lg mt-32">
                  Organize, Create, and Thrive in Your Haven. Be productive as
                  always!
                </p>
                <button
                  className="text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg 
            text-sm px-5 py-2.5 text-center drop-shadow-xl shadow-blue-300 mr-5 mt-5 flex items-center"
                  onClick={() => {
                    navigate("/signup");
                  }}
                >
                  Get Started
                  <FaLongArrowAltRight className="ml-3"></FaLongArrowAltRight>
                </button>
              </div>
              <div
                className={`relative ${
                  addClass ? addClass : null
                } md:-mr-[70px]`}
              >
                <img
                  src={Arrow}
                  alt=""
                  className="absolute -top-4 -left-64 w-[100px] rotate-12"
                />
                <p className="text-[#102c54] absolute -left-52 -top-1 font-medium text-xl -rotate-2">
                  Features
                </p>
                <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl mr-20 -ml-[50px] shadow-2xl shadow-sky-500/50">
                  <img
                    src={Icons[1]}
                    alt=""
                    className="absolute w-[170px] -top-14 left-20 z-10"
                  />
                  <p className="absolute -top-16 w-full left-14 text-white/10 text-[250px]">
                    2
                  </p>
                  <p className="absolute bottom-5 left-5 w-full text-white text-[16px]">
                    File Upload
                  </p>
                </div>
                <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl -ml-[300px] shadow-2xl shadow-sky-500/50 -mt-[100px]">
                  <img
                    src={Icons[0]}
                    alt=""
                    className="w-[170px] absolute -top-12 -left-10 z-10"
                  />
                  <p className="absolute -top-8 w-full left-20 text-white/10 text-[250px]">
                    1
                  </p>
                  <p className="absolute bottom-5 left-5 w-full text-white text-[16px]">
                    Chat
                  </p>
                </div>
                <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl -ml-[200px] shadow-2xl shadow-sky-500/50 mt-[50px]">
                  <img
                    src={Icons[2]}
                    alt=""
                    className="absolute w-[170px] -bottom-14 right-20 z-10"
                  />
                  <p className="absolute -top-12 w-full left-10 text-white/10 text-[250px]">
                    4
                  </p>
                  <p className="absolute top-5 left-20 w-full text-white text-[16px]">
                    Leaderboards
                  </p>
                </div>
                <div className="relative w-[200px] h-[200px] bg-blue-500 rounded-3xl ml-[50px] shadow-2xl shadow-sky-500/50 -mt-[300px]">
                  <img
                    src={Icons[3]}
                    alt=""
                    className="w-[170px] absolute -bottom-12 -right-10 z-10"
                  />
                  <p className="absolute -top-16 w-full left-3 text-white/10 text-[250px]">
                    3
                  </p>
                  <p className="absolute top-5 left-5 w-full text-white text-[16px]">
                    Planner
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
