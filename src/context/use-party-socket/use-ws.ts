import type { Options, ProtocolsProvider, UrlProvider } from 'partysocket/ws';
import type ReconnectingWebSocket from 'partysocket/ws';

type UseWebSocketOptions = Options & {
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onMessage?: (event: WebSocketEventMap['message']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
};
declare function useWebSocket(
  url: UrlProvider,
  protocols?: ProtocolsProvider,
  options?: UseWebSocketOptions
): ReconnectingWebSocket;

export { useWebSocket as default };
