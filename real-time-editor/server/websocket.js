const WebSocket = require("ws");

function initWebSocket (server) {
    const wss = new WebSocket.Server({ server })
      wss.on("connection", (ws,req) => {

        
        ws.on("message", (message) => {
            let text
            if (Buffer.isBuffer(message)) {
                text = message.toString("utf8")
            } else {
                text = message
            }

            // Broadcast to all other clients
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    // console.log("message is../...", message.toString())
                    console.log("Message is../......",message.toString())
                    client.send(message);
                }
            });
        });

        ws.on("close", () => {
            console.log("Client disconnected");
        });
    });
}

module.exports = initWebSocket