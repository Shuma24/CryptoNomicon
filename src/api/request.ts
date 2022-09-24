import { ISocketMessage } from '@/interfaces/response.interface';

const API_KEY = 'eeb320c0f7fdcc075f92213b593a24911d5d7cc83ef90c2394ed025603a9cf45';

const tickersHandlers = new Map();

const socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`);

const AGRIGATE_INDEX = '5';

socket.addEventListener('message', (e) => {
  const messageData = JSON.parse(e.data);
  if (messageData.TYPE !== AGRIGATE_INDEX) {
    return;
  }

  const handlers: [] = tickersHandlers.get(messageData.FROMSYMBOL) ?? [];
  handlers.forEach((fn: (price: number) => void) => fn(messageData.PRICE));
});

const sendToWebSocket = (message: ISocketMessage) => {
  const stringifyMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifyMessage);
    return;
  }

  socket.addEventListener(
    'open',
    () => {
      socket.send(stringifyMessage);
    },
    { once: true },
  );
};

const subscribeToTickerWS = (tickerName: string) => {
  sendToWebSocket({
    action: 'SubAdd',
    subs: [`5~CCCAGG~${tickerName}~USD`],
  });
};

const unsubscribeToTickerWS = (tickerName: string) => {
  sendToWebSocket({
    action: 'SubRemove',
    subs: [`5~CCCAGG~${tickerName}~USD`],
  });
};

export const subscribeToTicker = (ticker: string, cb: (price: string) => void) => {
  const subscribers: [] = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
  subscribeToTickerWS(ticker);
};

export const unSubscribeTicker = (ticker: string) => {
  tickersHandlers.delete(ticker);
  unsubscribeToTickerWS(ticker);
};
