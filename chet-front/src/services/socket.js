import SockJS from "sockjs-client";

import { Client } from "@stomp/stompjs";

let stompClient = null;

export function connectSocket(onConnected) {

  const socket = new SockJS(
    "http://localhost:8080/ws"
  );

  stompClient = new Client({

    webSocketFactory: () => socket,

    reconnectDelay: 5000,

    onConnect: () => {

      console.log(
        "WebSocket conectado"
      );

      if (onConnected) {
        onConnected();
      }
    }
  });

  stompClient.activate();
}

export function subscribeToConversation(

  conversationId,

  onMessageReceived
) {

  if (!stompClient) return;

  stompClient.subscribe(

    `/topic/conversation/${conversationId}`,

    (message) => {

      const body =
        JSON.parse(message.body);

      onMessageReceived(body);
    }
  );
}