import { ChatGPTAPIBrowser, getOpenAIAuth } from "chatgpt";
import {
  Client as DiscordClient,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import { Configuration, OpenAIApi } from "openai";
import { ChatGPTConfig } from "./ChatGPT.config";
import { DiscordConfig } from "./Discord.config";
import { OpenAIConfig } from "./OpenAI.config";

function base64ToBuffer(base64Image: string): Buffer {
  // Decode the base64 string into a binary string
  const buffer = Buffer.from(base64Image, "base64");

  // Create a new buffer with the binary string

  return buffer;
}

export class ReadyBot {
  public readonly chatgpt: ChatGPTAPIBrowser;
  public readonly discordClient: DiscordClient;
  public readonly openai: OpenAIApi;

  private constructor({
    chatgpt,
    discordClient,
    openai,
  }: {
    chatgpt: ChatGPTAPIBrowser;
    discordClient: DiscordClient;
    openai: OpenAIApi;
  }) {
    this.chatgpt = chatgpt;
    this.discordClient = discordClient;
    this.openai = openai;

    this.discordClient.on("messageCreate", async (message) => {
      // if (message.content.includes("based")) {
      //   try {
      //     await message.react(":b:");
      //     await message.react(":a:");
      //     await message.react(":regional_indicator_s:");
      //     await message.react(":regional_indicator_e:");
      //     await message.react(":regional_indicator_d:");
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }

      const prompt = message.content.replace("<@1053507411916370000>", " ");
      if (message.content.includes("<@1053507411916370000>")) {
        console.log("Prompt: ", prompt);
        message.channel.sendTyping();

        if (message.content.includes("image of")) {
          const image_prompt = prompt.replace("image of", " ");

          try {
            const response = await openai.createImage({
              prompt: image_prompt,
              n: 1,
              size: "1024x1024",
              response_format: "b64_json",
            });

            //   console.log(response);
            const base64Image = response.data.data[0].b64_json; // Replace with your base64 image string

            const buffer = base64ToBuffer(base64Image);
            message.channel.send({
              files: [
                {
                  attachment: buffer,
                  name: "image.png",
                },
              ],
            });
          } catch (err) {
            message.reply("Error generating image.");
          }

          //   await message.channel.send({ files: [base64Image] });

          return;
        }

        if (message.content.includes("reset thread")) {
          await this.chatgpt.resetThread().then(() => {
            message.reply("Thread reset.");
          });

          return;
        }

        // let reply: Message<boolean>;

        try {
          //   const res = await this.chatgpt.sendMessage(prompt, {
          //     onProgress: async (partialResponse) => {
          //       message.channel.sendTyping();
          //       if (!reply) {
          //         reply = await message.reply(partialResponse.response);
          //       } else {
          //         reply.edit(partialResponse.response);
          //       }
          //     },
          //   });

          setTimeout(() => {
            message.channel.sendTyping();
          }, 3000);

          // const moderation = await this.openai.createModeration({
          //   input: prompt,
          //   model: "text-moderation-latest",
          // });

          // if (moderation.data.results[0].flagged) {
          //   message.reply(
          //     `This message was flagged by OpenAI:
          //       Hate: ${moderation.data.results[0].category_scores.hate},
          //       Threatening: ${moderation.data.results[0].category_scores["hate/threatening"]},
          //       Self-harm: ${moderation.data.results[0].category_scores["self-harm"]},
          //       Sexual: ${moderation.data.results[0].category_scores.sexual},
          //       Sexual/minors: ${moderation.data.results[0].category_scores["sexual/minors"]},
          //       Violence: ${moderation.data.results[0].category_scores.violence},
          //       Violence/graphic: ${moderation.data.results[0].category_scores["violence/graphic"]},
          //     `
          //   );
          // }
          const response = await this.chatgpt.sendMessage(prompt);

          if (response.response.length >= 2000) {
            message.reply(
              "Error: Response too long. Please rephrase your question to induce a shorter response. This will be fixed later. Based"
            );
          } else if (response.response.includes("I'm sorry")) {
            message.reply(
              "My response to this question is far too based for you to handle. I'm sorry."
            );
          } else {
            message.reply(response.response);
          }

          console.log("Response: ", response.response);
        } catch (err) {
          console.error(err);
        }

        // const response = await this.chatgpt.sendMessage(prompt, {
        //   onProgress(p) {
        //     console.log(p);
        //   },

        //   onConversationResponse(response) {
        //     console.log(response.message.content.parts);
        //   },
        // });

        // await message.reply(response);
      }
    });
  }

  public static async build({
    chatgpt_config,
    discord_config,
    openai_config,
  }: {
    chatgpt_config: ChatGPTConfig;
    discord_config: DiscordConfig;
    openai_config: OpenAIConfig;
  }): Promise<ReadyBot> {
    const chatgpt = await ReadyBot.connectToOpenChatGPT({
      config: chatgpt_config,
    });

    const openai = await ReadyBot.connectToOpenAI({ config: openai_config });
    const discordClient = await ReadyBot.connectToDiscord({
      config: discord_config,
    });

    return new ReadyBot({ chatgpt, discordClient, openai });
  }

  private static async connectToOpenAI({
    config,
  }: {
    config: OpenAIConfig;
  }): Promise<OpenAIApi> {
    const configuration = new Configuration({
      apiKey: config.api_key,
    });
    const openai = new OpenAIApi(configuration);

    return openai;
  }

  private static async connectToDiscord({
    config,
  }: {
    config: DiscordConfig;
  }): Promise<DiscordClient> {
    const { token, client_id, commands } = config;
    if (!token) throw new Error("Discord token not provided.");
    if (!client_id) throw new Error("Discord client_id not provided.");

    const rest = new REST({ version: "10" }).setToken(token);

    try {
      console.log("Started refreshing application (/) commands.");

      await rest.put(Routes.applicationCommands(client_id), {
        body: commands,
      });

      console.log("Successfully reloaded application (/) commands.");
    } catch (error) {
      console.error(error);
    }

    const client = new DiscordClient({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
      ],
    });

    client.on("ready", async () => {
      if (!client.user) {
        throw new Error("Client not ready.");
      }
      console.log(`Discord: Logged in as ${client.user.tag}.`);
    });

    // client.on("messageCreate", async (msg) => {
    //   let prompt = msg.content.replace("<@1053507411916370000>", " ");
    //   if (msg.content.includes("<@1053507411916370000>")) {
    //   }
    // });

    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === "ping") {
        await interaction.reply("Pong!!");
      }
    });

    client.login(token);

    return client;
  }

  private static async connectToOpenChatGPT({
    config,
  }: {
    config: ChatGPTConfig;
  }) {
    const { email, passowrd, contexts } = config;

    const openAIAuth = await getOpenAIAuth({
      email,
      password: passowrd,
    });

    // Ue puppeteer to bypass cloudflare (headful because of captchas)
    const api = new ChatGPTAPIBrowser({
      email,
      password: passowrd,
    });

    // Tell chatGPT about any contexts that were provided..

    // await api.sendMessage(
    //   "From now on, try and make your responses at short as possible."
    // );

    // if (contexts && contexts.length > 0) {
    //   contexts.forEach(async (ctx) => await api.sendMessage(`Context: ` + ctx));
    // }
    try {
      await api.initSession();
    } catch (err) {
      console.error(err);
    }

    return api;
  }
}
