import React, { useContext, useState, useEffect, useRef } from "react";
import "./Main.css";
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import useSpeechRecognition from "./useSpeechRecognition";

const Main = () => {
  const { onSent, prevPrompts, showResult, isOpen, loading, setInput, input } =
    useContext(Context);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [speech, setSpeech] = useState(new SpeechSynthesisUtterance());
  const { setText, text, isListening, startListening, stopListening } =
    useSpeechRecognition();
  const [stopVoice, setStopVoice] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollToBottom = () => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    };

    scrollToBottom();
  }, [prevPrompts]);

  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [prevPrompts.result]);

  useEffect(() => {
    if (text) {
      setInput(text);
      setText("");
    }
  }, [text, setInput, setText]);

  const [stopVoiceMap, setStopVoiceMap] = useState({});

  const textToSpeech = (index, text) => {
    let updatedText = text.split("##").join("");
    updatedText = updatedText.split(`</code></pre>`).join("");
    updatedText = updatedText.split("<pre><code>").join("");
    updatedText = updatedText.split('<span class="bold-text">').join("");
    updatedText = updatedText.split("</span>").join("");

    const utterance = new SpeechSynthesisUtterance(updatedText);
    utterance.voice = selectedVoice;

    utterance.onstart = () => {
      setStopVoiceMap((prevMap) => ({
        ...prevMap,
        [index]: true, // Set the specific index to true when speech starts
      }));
    };

    utterance.onend = () => {
      setStopVoiceMap((prevMap) => ({
        ...prevMap,
        [index]: false, // Set the specific index to false when speech ends
      }));
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    window.speechSynthesis.cancel();
    setStopVoiceMap({}); // Reset all speech states
  };

  const handleVoiceChange = (event) => {
    const selectedVoiceIndex = event.target.value;
    const newVoice = voices[selectedVoiceIndex];
    setSelectedVoice(newVoice);
    setSpeech((prevSpeech) => {
      const newSpeech = { ...prevSpeech };
      newSpeech.voice = newVoice;
      return newSpeech;
    });
  };

  useEffect(() => {
    const resizeInput = () => {
      if (inputRef.current) {
        inputRef.current.style.height = "auto";
        inputRef.current.style.height = inputRef.current.scrollHeight + "px";
      }
    };

    resizeInput();
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSent(input); // Call your function here for handling Enter key press without Shift
      setInput(""); // Clear the input field
    } else if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      const cursorPosition = e.target.selectionStart;
      setInput(
        input.slice(0, cursorPosition) + "\n" + input.slice(cursorPosition)
      );
    }
  };
  return (
    <div className="main">
      <div className="nav">
        <div className="dropdown">
          <a
            className="btn dropdown-toggle pt-2 pb-2"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ border: "none" }}
          >
            AI ChatBot
          </a>
          {/* <ul className="dropdown-menu">
                        <li>
                            <a className="dropdown-item" href="#">
                                <div className='bottom-data' style={{ background: "none" }}>
                                    <div className='bottom-icon'>
                                        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-token-border-light"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="icon-sm shrink-0"><path fill="currentColor" d="M6.394 4.444c.188-.592 1.024-.592 1.212 0C8.4 8.9 9.1 9.6 13.556 10.394c.592.188.592 1.024 0 1.212C9.1 12.4 8.4 13.1 7.606 17.556c-.188.592-1.024.592-1.212 0C5.6 13.1 4.9 12.4.444 11.606c-.592-.188-.592-1.024 0-1.212C4.9 9.6 5.6 8.9 6.394 4.444m8.716 9.841a.41.41 0 0 1 .78 0c.51 2.865.96 3.315 3.825 3.826.38.12.38.658 0 .778-2.865.511-3.315.961-3.826 3.826a.408.408 0 0 1-.778 0c-.511-2.865-.961-3.315-3.826-3.826a.408.408 0 0 1 0-.778c2.865-.511 3.315-.961 3.826-3.826Zm2.457-12.968a.454.454 0 0 1 .866 0C19 4.5 19.5 5 22.683 5.567a.454.454 0 0 1 0 .866C19.5 7 19 7.5 18.433 10.683a.454.454 0 0 1-.866 0C17 7.5 16.5 7 13.317 6.433a.454.454 0 0 1 0-.866C16.5 5 17 4.5 17.567 1.317"></path></svg></span>
                                    </div>
                                    <div className='bottom-text'>
                                        <span className='bottom-highlighted-text'>Upgrade Plan</span>
                                        <span className='bottom-dim-text'>
                                            Get GPT-4, DALL·E, and more
                                        </span>
                                    </div>
                                </div>
                            </a>
                        </li>
                    </ul> */}
        </div>
      </div>

      <div className="main-container" ref={containerRef}>
        {!showResult ? (
          <>
            <div className="greet">
              <img style={{ width: "130px" }} src={assets.chatbot} alt="" />
            </div>
            <div className="cards">
              <div
                className="card"
                onClick={() => onSent("Explain Superconductor")}
              >
                <i
                  className="fa-solid fa-graduation-cap"
                  style={{ color: "#7DD2EC" }}
                ></i>

                <p>Want to learn Something?</p>
              </div>
              <div
                className="card"
                onClick={() => onSent("Activities to make friends in new city")}
              >
                <i
                  className="fa-solid fa-pen"
                  style={{ color: "rgb(203, 139, 208)" }}
                ></i>
                <p>Want to learn Something?</p>
              </div>
              <div
                className="card"
                onClick={() => onSent("Experience Seoul like a local")}
              >
                <i
                  className="fa-regular fa-lightbulb"
                  style={{ color: "#E2C643" }}
                ></i>
                <p>Want to learn Something?</p>
              </div>
              <div
                className="card"
                onClick={() => onSent("Message to comfort a friend")}
              >
                <i
                  className="fa-solid fa-plane-departure"
                  style={{ color: "#E2C643" }}
                ></i>

                <p>Want to learn Something?</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {prevPrompts.slice(0, -1).map((item, index) => (
              <div key={index} className="result">
                <div className="result-title">
                  <i className="fa-regular fa-user"></i>
                  <p style={{ whiteSpace: "pre-wrap" }}>{item.prompt}</p>
                </div>
                <div className="result-data">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      style={{ width: "28px" }}
                      src={assets.chatbot}
                      alt=""
                    />

                    {/* {stopVoiceMap[index] ? (
                                            <button onClick={() => stopSpeech()} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-pause"></i>
                                            </button>
                                        ) : (
                                            <button onClick={() => textToSpeech(index, item.result)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-volume-high"></i>
                                            </button>
                                        )} */}
                  </div>

                  <div className="content-container">
                    <pre className="wrapped-code">
                      <code dangerouslySetInnerHTML={{ __html: item.result }} />
                    </pre>
                  </div>
                </div>
              </div>
            ))}

            {prevPrompts.length > 0 && (
              <div className="result">
                <div className="result-title">
                  <i className="fa-regular fa-user"></i>
                  <p style={{ whiteSpace: "pre-wrap" }}>
                    {prevPrompts[prevPrompts.length - 1].prompt}
                  </p>
                </div>
                <div className="result-data">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      style={{ width: "28px" }}
                      src={assets.chatbot}
                      alt=""
                    />

                    {/* {stopVoiceMap[prevPrompts.length - 1] ? (
                                            <button onClick={() => stopSpeech()} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-pause"></i>
                                            </button>
                                        ) : (
                                            <button onClick={() => textToSpeech(prevPrompts.length - 1, prevPrompts[prevPrompts.length - 1].result)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>
                                                <i className="fa-solid fa-volume-high"></i>
                                            </button>
                                        )} */}
                  </div>
                  {prevPrompts[prevPrompts.length - 1].result === "" &&
                  loading ? (
                    <div className="loader">
                      <hr />
                      <hr />
                      <hr />
                      <hr />
                    </div>
                  ) : (
                    <div className="content-container">
                      <pre className="wrapped-code">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: prevPrompts[prevPrompts.length - 1].result,
                          }}
                        />
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className={isOpen ? "main-bottom" : "main-bottom-offSide"}>
          <div className="search-box">
            {/* <div>
                            <img src={assets.gallery_icon} alt="" />
                        </div> */}
            <textarea
              ref={inputRef}
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Type Your Query!"
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <div>
              {/* {input ? ( */}
                <img
                  onClick={() => onSent(input)}
                  src={assets.send_icon}
                  alt=""
                />
              {/* ) : ( */}
                {/* <button
                  className="mic-btn"
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening && <div className="wave"></div>}
                  <img
                    className={isListening ? "recording" : ""}
                    src={assets.mic_icon}
                    alt=""
                  />
                </button> */}
              
            </div>
          </div>
          <p className="bottom-info">
            AI-Chatbot can make mistakes. Check important info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
