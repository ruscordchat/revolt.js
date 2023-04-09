import { API, Channel } from "..";
import { HydratedChannel } from "../hydration";

import { ClassCollection } from ".";

export class ChannelCollection extends ClassCollection<
  Channel,
  HydratedChannel
> {
  /**
   * Delete an object
   * @param id Id
   */
  override delete(id: string): void {
    let channel = this.get(id);
    channel?.server?.channelIds.delete(id);
    super.delete(id);
  }

  /**
   * Fetch channel by ID
   * @param id Id
   * @returns Channel
   */
  async fetch(id: string): Promise<Channel> {
    const channel = this.get(id);
    if (channel) return channel;
    const data = await this.client.api.get(`/channels/${id as ""}`);
    return this.getOrCreate(data._id, data);
  }

  /**
   * Get or create
   * @param id Id
   * @param data Data
   * @param isNew Whether this object is new
   */
  getOrCreate(id: string, data: API.Channel, isNew = false) {
    if (this.has(id)) {
      return this.get(id)!;
    } else {
      const instance = new Channel(this, id);
      this.create(id, "channel", instance, data);
      isNew && this.client.emit("channelCreate", instance);
      return instance;
    }
  }

  /**
   * Get or return partial
   * @param id Id
   */
  getOrPartial(id: string) {
    if (this.has(id)) {
      return this.get(id)!;
    } else if (this.client.options.partials) {
      const instance = new Channel(this, id);
      this.create(id, "channel", instance, {
        id,
        partial: true,
      });
      return instance;
    }
  }
}
