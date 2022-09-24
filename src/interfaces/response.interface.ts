export interface IResponse {
  Data: { key: { Id: string; ImageUrl: string; Symbol: string; FullName: string } };
  HasWarning: false;
  Message: string;
  Response: string;
  Type: number;
}

export interface IAllCoins {
  Id: string;
  ImageUrl: string;
  Symbol: string;
  FullName: string;
}

export interface ISocketMessage {
  action: string;
  subs: string[];
}
