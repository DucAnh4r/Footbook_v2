import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { getUserIdFromLocalStorage } from "./authUtils";

const WebSocketComponent = ({ userId, onMessageReceived }) => {
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/chat-websocket");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log("Connected to WebSocket");

        // Subscribe kênh thông báo cá nhân
        stompClient.subscribe(`/user/${userId}/notifications`, (message) => {
          const notification = JSON.parse(message.body);
          console.log("Received notification:", notification);
          onMessageReceived(notification); // Gửi thông báo tới component ChatWindow
        });
      },
      onDisconnect: () => {
        console.log("Disconnected from WebSocket");
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [userId, onMessageReceived]);

  return null; // Không hiển thị gì trong UI
};

export default WebSocketComponent;
