const WebSocket = require("ws");

// 創建 WebSocket 伺服器，監聽在 8000 埠
const wss = new WebSocket.Server({ port: 8000 });

let sessionNumber = 123456;

const campaign = {
  url: "http://xxxxxx",
  file: "ec21lskdcowdkmfoweiojrewr",
  brand: "Monitor",
  model: "L1",
  tv: "V2.1",
  campaign_id: "2398423874628739428392",
  download_by_id: "wifi",
  file_size: 117770,
};

wss.on("connection", (ws) => {
  console.log("New client connected");

  // 接收來自客戶端的訊息
  ws.on("message", (message) => {
    const str = message.toString();
    const obj = JSON.parse(str);
    const { session_id, status } = obj;
    const respInfo = {
      response: "Received",
      ...obj,
    };
    if (session_id && (status == "succeed" || status == "failed")) {
      setTimeout(function () {
        ws.send(JSON.stringify(respInfo));
        ws.close();
      }, 2000);
    } else if (session_id) {
      setTimeout(function () {
        ws.send(JSON.stringify(respInfo));
      }, 2000);
    } else {
      const session_id = sessionNumber++;
      const campaignInfo = {
        status: "received",
        session_id,
        ...campaign,
      };
      setTimeout(function () {
        ws.send(JSON.stringify(campaignInfo));
      }, 2000);
    }
  });

  // 當連接關閉時
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is listening on ws://localhost:8000");
