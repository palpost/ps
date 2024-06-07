declare module 'twit' {
  interface TwitOptions {
    consumer_key: string;
    consumer_secret: string;
    access_token: string;
    access_token_secret: string;
    timeout_ms?: number;
    strictSSL?: boolean;
  }

  interface Tweet {
    id_str: string;
    text: string;
    user: {
      screen_name: string;
    };
  }

  interface Stream {
    on(event: 'tweet', callback: (tweet: Tweet) => void): void;
  }

  class Twit {
    constructor(options: TwitOptions);
    post(
      path: string,
      params: object,
      callback: (err: Error, data: any, response: any) => void
    ): void;
    stream(path: string, params: object): Stream;
  }

  export = Twit;
}
