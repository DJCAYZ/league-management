import type { Client, ClientEvents } from 'discord.js';

export default abstract class EventHandler<K extends keyof ClientEvents = keyof ClientEvents> {
  public readonly event: K;
  public readonly once: boolean;

  constructor(opts: { event: K; once?: boolean }) {
    this.event = opts.event;
    this.once = opts.once ?? false;
  }

  abstract execute(...args: ClientEvents[K]): Promise<void> | void;

  // Attach the handler to a Client with proper typings so callers don't need `any`
  public attach(client: Client) {
    const register = (this.once ? client.once.bind(client) : client.on.bind(client)) as <
      E extends keyof ClientEvents
    >(
      event: E,
      listener: (...args: ClientEvents[E]) => unknown,
    ) => void;

    register(this.event, (...args: ClientEvents[K]) => {
      // call and ignore returned Promise if any
      void this.execute(...args);
    });
  }
}