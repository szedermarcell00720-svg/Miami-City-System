import { 
  Client, 
  GatewayIntentBits, 
  ActivityType, 
  EmbedBuilder, 
  SlashCommandBuilder, 
  PermissionFlagsBits, 
  REST, 
  Routes 
} from "discord.js";

// ==========================================
// 1. CONFIGURATION
// Replace these values with your actual IDs/Tokens
// ==========================================
const BOT_TOKEN = process.env.DISCORD_TOKEN || "YOUR_BOT_TOKEN_HERE";
const CLIENT_ID = "YOUR_CLIENT_ID_HERE"; 
const STARTUP_CHANNEL_ID = "YOUR_STARTUP_CHANNEL_ID_HERE"; 

// Initialize Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ]
});

// ==========================================
// 2. SLASH COMMAND DEFINITIONS
// ==========================================
export const slashCommands = [
  // ACTIVITY CHECKS
  new SlashCommandBuilder()
    .setName("activitycheck")
    .setDescription("Manage staff activity checks for Miami City Roleplay")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub => sub.setName("start").setDescription("Start a staff activity check"))
    .addSubcommand(sub => sub.setName("cancel").setDescription("Cancel current activity check"))
    .addSubcommand(sub => sub.setName("status").setDescription("View activity check status")),

  // MODERATION & PUNISHMENTS
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from Miami City RP")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName("user").setDescription("The user to ban").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the ban")),

  new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Temporarily ban a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName("user").setDescription("The user to ban").setRequired(true))
    .addStringOption(opt => opt.setName("duration").setDescription("Ban length (e.g. 1d, 7d)").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for temporary ban")),

  new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user by ID")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption(opt => opt.setName("user_id").setDescription("Discord User ID").setRequired(true)),

  new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user using Discord timeout")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName("user").setDescription("The user to mute").setRequired(true))
    .addStringOption(opt => opt.setName("duration").setDescription("Duration (e.g. 10m, 1h)").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for timeout")),

  new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName("user").setDescription("The user to warn").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for warning").setRequired(true)),

  new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("Blacklist a user ID from Miami City RP")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt.setName("user_id").setDescription("User ID to blacklist").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Blacklist reason").setRequired(true)),

  new SlashCommandBuilder()
    .setName("unblacklist")
    .setDescription("Remove a user ID from the blacklist")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption(opt => opt.setName("user_id").setDescription("User ID to unblacklist").setRequired(true)),

  // STAFF INFRACTIONS & PROMOTIONS
  new SlashCommandBuilder()
    .setName("infraction")
    .setDescription("Manage staff infractions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub => sub.setName("issue").setDescription("Issue an infraction").addUserOption(o => o.setName("user").setDescription("Staff").setRequired(true)).addStringOption(o => o.setName("reason").setDescription("Reason").setRequired(true)))
    .addSubcommand(sub => sub.setName("edit").setDescription("Edit an infraction").addStringOption(o => o.setName("case_id").setDescription("Case ID").setRequired(true)))
    .addSubcommand(sub => sub.setName("logs").setDescription("View infraction logs").addUserOption(o => o.setName("user").setDescription("Staff").setRequired(true))),

  new SlashCommandBuilder()
    .setName("promotion")
    .setDescription("Manage staff and department promotions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub => sub.setName("issue").setDescription("Promote staff").addUserOption(o => o.setName("user").setDescription("Staff").setRequired(true)).addRoleOption(o => o.setName("new_role").setDescription("Role").setRequired(true)))
    .addSubcommand(sub => sub.setName("logs").setDescription("View promotion logs"))
    .addSubcommand(sub => sub.setName("cooldown_check").setDescription("Check promotion cooldown").addUserOption(o => o.setName("user").setDescription("Staff").setRequired(true))),

  new SlashCommandBuilder()
    .setName("retirement_log")
    .setDescription("Log a staff retirement or resignation")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason")),

  // STAFF POINTS
  new SlashCommandBuilder()
    .setName("points")
    .setDescription("Manage staff moderation points")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub => sub.setName("add").setDescription("Add points").addUserOption(o => o.setName("user").setDescription("Staff").setRequired(true)).addIntegerOption(o => o.setName("amount").setDescription("Points").setRequired(true)))
    .addSubcommand(sub => sub.setName("remove").setDescription("Remove points").addUserOption(o => o.setName("user").setDescription("Staff").setRequired(true)).addIntegerOption(o => o.setName("amount").setDescription("Points").setRequired(true)))
    .addSubcommand(sub => sub.setName("check").setDescription("Check points").addUserOption(o => o.setName("user").setDescription("Staff")))
    .addSubcommand(sub => sub.setName("reset").setDescription("Reset points")),

  // SESSION CONTROLS
  new SlashCommandBuilder()
    .setName("session")
    .setDescription("Miami City RP session controls")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addSubcommand(sub => sub.setName("startup").setDescription("Send a session startup message"))
    .addSubcommand(sub => sub.setName("vote").setDescription("Start a session vote"))
    .addSubcommand(sub => sub.setName("boost").setDescription("Send a session boost message"))
    .addSubcommand(sub => sub.setName("full").setDescription("Send a session full message"))
    .addSubcommand(sub => sub.setName("shutdown").setDescription("Send a session shutdown message")),

  // TICKETING SYSTEM
  new SlashCommandBuilder()
    .setName("setuptickets")
    .setDescription("Send the Miami City RP ticket setup panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Support ticket options")
    .addSubcommand(sub => sub.setName("add").setDescription("Add user").addUserOption(o => o.setName("user").setDescription("User").setRequired(true)))
    .addSubcommand(sub => sub.setName("remove").setDescription("Remove user").addUserOption(o => o.setName("user").setDescription("User").setRequired(true)))
    .addSubcommand(sub => sub.setName("rename").setDescription("Rename ticket").addStringOption(o => o.setName("name").setDescription("Name").setRequired(true)))
    .addSubcommand(sub => sub.setName("escalate").setDescription("Escalate ticket"))
    .addSubcommand(sub => sub.setName("close").setDescription("Close ticket"))
    .addSubcommand(sub => sub.setName("closerequest").setDescription("Request close")),

  // TRAINING OPERATIONS
  new SlashCommandBuilder()
    .setName("training")
    .setDescription("Department training commands")
    .addSubcommand(sub => sub.setName("host").setDescription("Host training").addStringOption(o => o.setName("department").setDescription("MPD, MDSO, MFR").setRequired(true)))
    .addSubcommand(sub => sub.setName("request").setDescription("Request training"))
    .addSubcommand(sub => sub.setName("log_phase1").setDescription("Log Phase 1").addUserOption(o => o.setName("user").setDescription("Recruit").setRequired(true)))
    .addSubcommand(sub => sub.setName("log_phase2").setDescription("Log Phase 2").addUserOption(o => o.setName("user").setDescription("Recruit").setRequired(true))),

  // UTILITIES & LOGS
  new SlashCommandBuilder()
    .setName("say")
    .setDescription("Make the bot say a message")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(opt => opt.setName("message").setDescription("Message content").setRequired(true)),

  new SlashCommandBuilder()
    .setName("staff_feedback")
    .setDescription("Leave feedback for a Miami City RP staff member")
    .addUserOption(opt => opt.setName("staff").setDescription("Staff member").setRequired(true))
    .addStringOption(opt => opt.setName("comments").setDescription("Your feedback").setRequired(true)),

  new SlashCommandBuilder()
    .setName("userlogs")
    .setDescription("View moderation logs for a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(opt => opt.setName("user").setDescription("User to inspect").setRequired(true))
];

// ==========================================
// 3. AUTO-REGISTER COMMANDS FUNCTION
// ==========================================
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  try {
    console.log("⚙️  Registering slash commands with Discord...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: slashCommands }
    );
    console.log("✅ Slash commands successfully registered!");
  } catch (error) {
    console.error("❌ Failed to register slash commands:", error);
  }
}

// ==========================================
// 4. BOT EVENTS & PRESENCE
// ==========================================
client.once("ready", async () => {
  console.log(`🌴 ${client.user.tag} is now online!`);

  // Register commands on startup
  await registerCommands();

  // FORCES THE GREEN ONLINE DOT
  client.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Miami City Roleplay | Code: MIAMI",
        type: ActivityType.Playing
      }
    ]
  });

  // Optional Startup Channel Announcement
  if (STARTUP_CHANNEL_ID && STARTUP_CHANNEL_ID !== "YOUR_STARTUP_CHANNEL_ID_HERE") {
    try {
      const channel = await client.channels.fetch(STARTUP_CHANNEL_ID);
      if (channel && channel.isTextBased()) {
        const onlineEmbed = new EmbedBuilder()
          .setTitle("🌴 MIAMI CITY ROLEPLAY — BOT ONLINE")
          .setDescription("The main system bot is currently **ONLINE** and operational. All slash commands are synchronized.")
          .setColor("#FF1493")
          .addFields(
            { name: "⚡ Status", value: "🟢 Operational", inline: true },
            { name: "🔑 Server Code", value: "`MIAMI`", inline: true }
          )
          .setTimestamp();

        await channel.send({ embeds: [onlineEmbed] });
      }
    } catch (err) {
      console.error("Could not post startup message:", err);
    }
  }
});

// Basic command listener
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  await interaction.reply({ content: `🌴 Executed \`/${interaction.commandName}\` successfully!`, ephemeral: true });
});

// Start the bot
client.login(BOT_TOKEN);
