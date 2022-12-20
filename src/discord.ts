import { ReadyBot } from "./ReadyBot.js";

// export const TOKEN =
//   "MTA1MzUwNzQxMTkxNjM3MDAwMA.GDC20g.m_J4GerRqmHyL6j6ReOWOjn-7DVsdMR3JFX_X0";
// const CLIENT_ID = "1053507411916370000";

// const commands = [
//   {
//     name: "ping",
//     description: "Replies with Pong!",
//   },
//   {
//     name: "jim",
//     description: "jim",
//   },
// ];

// const rest = new REST({ version: "10" }).setToken(TOKEN);

export async function startBot() {
  const DISCORD_TOKEN =
    "MTA1MzUwNzQxMTkxNjM3MDAwMA.GDC20g.m_J4GerRqmHyL6j6ReOWOjn-7DVsdMR3JFX_X0";
  const DISCORD_CLIENT_ID = "1053507411916370000";

  return await ReadyBot.build({
    discord_config: {
      client_id: DISCORD_CLIENT_ID,
      token: DISCORD_TOKEN,
    },
    chatgpt_config: {
      email: "pall4321@yahoo.com",
      passowrd: "cmp320cmp320",
    },
    openai_config: {
      api_key: "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",
    },
  });
}

//   // // use puppeteer to bypass cloudflare (headful because of captchas)
//   // const openAIAuth = await getOpenAIAuth({
//   //   email: "pall4321@yahoo.com",
//   //   password: "cmp320cmp320",
//   // });

//   // const api = new ChatGPTAPI({ ...openAIAuth });
//   // await api.ensureAuth();

//   // use puppeteer to bypass cloudflare (headful because of captchas)
//   const api = new ChatGPTAPIBrowser({
//     // @ts-ignore
//     email: "pall4321@yahoo.com",
//     password: "cmp320cmp320",
//   });

//   await api.init();

//   return api;
// }

// const CAVE_CONETXT = `The Cave, also known as one of the rooms at Hill Center at Rutgers University, it serves as a hang out spot for many Computer Science majors or Computer Science related majors, thus creating a community around that spectrum. Students usually hang out in this spot, however, as groups form and dissolve, they hang out elsewhere and partake in different activities, sometimes under their permittivity age, sometimes not.
// Acts of perversion also take place but they are rumored about. However, rumors come from tautologies, thus creating indeterminants on whether or not such scene occured.
// This bears the Cave a lore that has no ending `;

// export const runDiscord = async () => {
//   const chatGPT = await runGPT();

//   try {
//     console.log("Started refreshing application (/) commands.");

//     await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

//     console.log("Successfully reloaded application (/) commands.");
//   } catch (error) {
//     console.error(error);
//   }

//   const client = new Client({
//     intents: [
//       GatewayIntentBits.Guilds,
//       GatewayIntentBits.MessageContent,
//       GatewayIntentBits.GuildMessages,
//     ],
//   });

//   client.on("ready", async () => {
//     if (!client.user) {
//       throw new Error("Client not ready.");
//     }
//     console.log(`Logged in as ${client.user.tag}. Loading contexts..`);
//   });

//   let caveAcknlowdged = false;

//   client.on("messageCreate", async (msg) => {
//     const msgArr = msg.content.split(" ");
//     if (msg.content.includes("<@1053507411916370000>")) {
//       msg.channel.sendTyping();
//       let prompt = msg.content.replace("<@1053507411916370000>", " ");

//       if (msg.content.includes("rank the chess players at the cave")) {
//         const response = `As a large language model trained by OpenAI, I do not posses the ability to rank people at the Cave based on their chess skill. My purpose is to assist users with tasks and answer questions to the best of my ability. However, I can confidently Jim is the worst chess player there. ChatGPT 1, Jim 0.`;

//         msg.reply(response);
//         return;
//       }

//       if (msg.content.includes("whos the gayest")) {
//         msg.reply("mike lee");
//       } else if (msg.content.includes("is mike lee gay")) {
//         msg.reply("lmao yeah");
//       } else if (msg.content.includes("mike lee like men")) {
//         msg.reply("gay as fuck bro lmao");
//       } else if (
//         msgArr.includes("jim") ||
//         msgArr.includes("jimothy") ||
//         msgArr.includes("Jim")
//       ) {
//         msg.reply("fuck jim lmao");
//       } else if (msg.content.includes("deep") || msg.content.includes("Deep")) {
//         msg.reply("DEEP GOES DEEP");
//       } else if (msg.content.includes("the cave")) {
//         msg.channel.sendTyping();
//         if (!caveAcknlowdged) {
//           const response = (await chatGPT).sendMessage(
//             CAVE_CONETXT + " " + prompt
//           );
//           msg.reply(await response);
//           caveAcknlowdged = true;
//           return;
//         } else {
//           const response = (await chatGPT).sendMessage(prompt);
//           msg.reply(await response);
//         }
//       } else {
//         msg.channel.sendTyping();

//         const response = (await chatGPT).sendMessage(prompt);
//         msg.channel.sendTyping();

//         console.log(prompt);
//         msg.reply(await response);
//       }
//     }
//   });

//   client.on("interactionCreate", async (interaction) => {
//     if (!interaction.isChatInputCommand()) return;

//     if (interaction.commandName === "ping") {
//       await interaction.reply("Pong!!");
//     }

//     if (interaction.commandName === "jim") {
//       console.log(interaction);
//     }
//   });

//   client.login(TOKEN);
// };
