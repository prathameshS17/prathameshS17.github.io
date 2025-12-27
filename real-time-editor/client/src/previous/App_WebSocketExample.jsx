import { useEffect, useRef, useState } from "react";

function App() {
  const socketRef = useRef(null);
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);

  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = new WebSocket("ws://localhost:8080");

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
    };

    socketRef.current.onmessage = async(event) => {
      let text = event.data;

      if (event.data instanceof Blob) {
        text = await event.data.text(); // Convert blob to string
      }

      console.log("📩 Message from server:", text);
      setChatLog((prev) => [...prev, `Server: ${text}`]);
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket disconnected");
    };

    socketRef.current.onerror = (err) => {
      console.error("⚠️ WebSocket error", err);
    };
    console.log("socketRef is../.....",socketRef.current)
    return () => {
      socketRef.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(message);
      setChatLog((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-2">WebSocket React Client</h1>
      <input
        className="border px-2 py-1 mr-2"
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-3 py-1" onClick={sendMessage}>
        Send
      </button>

      <div className="mt-4">
        {chatLog.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default App;

// function App() {
//   const [count, setCount] = useState(4)
//   const [windowidth, setWindowWidth] = useState(window.innerWidth)
//   const handleResize = ()=>{
//     setWindowWidth(window.innerWidth)
//   }
//       window.addEventListener('resize', handleResize)
//   // useEffect(()=>{
//   //   console.log("In useEffect");

//   // },[])

//   return (
//     <div className="flex gap-4">
//       {windowidth}
//     </div>
//   )
// }

// export default App;