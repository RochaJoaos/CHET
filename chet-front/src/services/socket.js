import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

let stompClient = null;


export function connectSocket(onConnected) {

  const token =
      localStorage.getItem("token");

  const socket = new SockJS(
      `http://localhost:8080/ws?token=${token}`
  );

  stompClient = new Client({
    webSocketFactory: () => socket,

    reconnectDelay: 5000,

    onConnect: () => {

      console.log("WebSocket conectado");

      console.log("STOMP conectado:",
        stompClient.connected);

      if (onConnected) {
        onConnected();
      }
    },

    onStompError: (frame) => {
      console.error("Erro STOMP:", frame);
    },

    onWebSocketError: (error) => {
      console.error("Erro WebSocket:", error);
    }
  });

  stompClient.activate();
}

export function subscribeToConversation(
  conversationId,
  onMessageReceived
) {

  if (!stompClient?.connected) {

    console.error("STOMP ainda não conectado");

    return;
  }

  stompClient.subscribe(
    `/topic/conversation/${conversationId}`,
    (message) => {

      const body = JSON.parse(message.body);

      onMessageReceived(body);
    }
  );
}