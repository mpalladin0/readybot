export interface DiscordConfig {
  token: string;
  client_id: string;
  commands?: [
    {
      name: string;
      description: string;
    }
  ];
}
