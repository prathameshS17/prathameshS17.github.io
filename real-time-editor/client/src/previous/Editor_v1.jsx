// src/CollaborativeEditor.jsx
import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const Editor = () => {
  const socketRef = useRef(null);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello World!</p>",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
    //    console.log("json is../...",json.content[0].content[0].text)
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: "doc-update",
          doc: json.content[0].content[0].text,
        }));
      }
    },
  });

  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:8080");
    socketRef.current.onmessage = async(event) => {
        const { type, doc } = JSON.parse(event.data);

        if (type === "doc-update" && editor) {
            // Avoid infinite loop by not setting if it's same
            editor.commands.setContent(doc, false);
        }
    };
    return () => socketRef.current.close();
  }, [editor]);

  return (
    <div className="p-4 border border-gray-300 rounded-lg mx-4 mt-4">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
