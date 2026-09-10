import 'dotenv/config'; // Safely loads your DISCORD_TOKEN from the .env file
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

// ===================================================
// 1. CONFIGURATION
// ===================================================
const BOT_TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = "1547711170771812494"; // Your Miami City System Application ID
const STARTUP_CHANNEL_ID = "YOUR_STARTUP_CHANNEL_ID_HERE"; // Replace with your text channel ID

// Initialize Client with mandatory Presences Intent
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences
  ]
});

// ===================================================
// 2. SLASH COMMAND DEFINITIONS
// ===================================================
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
    .addStringOption(opt => opt.setName("reason").setDescription("Blacklist reason")),

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
    .addSubcommand(sub => sub.setName("issue").setDescription("Issue an infraction"))
    .addSubcommand(sub => sub.setName("edit").setDescription("Edit an infraction"))
    .addSubcommand(sub => sub.setName("logs").setDescription("View infraction logs")),

  new SlashCommandBuilder()
    .setName("promotion")
    .setDescription("Manage staff and department promotions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub => sub.setName("issue").setDescription("Promote staff"))
    .addSubcommand(sub => sub.setName("logs").setDescription("View promotion logs"))
    .addSubcommand(sub => sub.setName("cooldown_check").setDescription("Check promotion cooldown")),

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
    .addSubcommand(sub => sub.setName("add").setDescription("Add points"))
    .addSubcommand(sub => sub.setName("remove").setDescription("Remove points"))
    .addSubcommand(sub => sub.setName("check").setDescription("Check points"))
    .addSubcommand(sub => sub.setName("reset").setDescription("Reset points")),

  // SESSION CONTROLS
  new SlashCommandBuilder()
    .setName("session")
    .setDescription("Miami City RP session controls")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageEvents)
    .addSubcommand(sub => sub.setName("startup").setDescription("Send a session startup announcement"))
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
    .addSubcommand(sub => sub.setName("add").setDescription("Add user"))
    .addSubcommand(sub => sub.setName("remove").setDescription("Remove user"))
    .addSubcommand(sub => sub.setName("rename").setDescription("Rename ticket"))
    .addSubcommand(sub => sub.setName("escalate").setDescription("Escalate ticket"))
    .addSubcommand(sub => sub.setName("close").setDescription("Close ticket"))
    .addSubcommand(sub => sub.setName("closerequest").setDescription("Request close")),

  // TRAINING OPERATIONS
  new SlashCommandBuilder()
    .setName("training")
    .setDescription("Department training commands")
    .addSubcommand(sub => sub.setName("host").setDescription("Host training"))
    .addSubcommand(sub => sub.setName("request").setDescription("Request training"))
    .addSubcommand(sub => sub.setName("log_phase1").setDescription("Log Phase 1"))
    .addSubcommand(sub => sub.setName("log_phase2").setDescription("Log Phase 2")),

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

// ===================================================
// 3. REGISTRATION FUNCTION
// ===================================================
async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(BOT_TOKEN);
  try {
    console.log("⚙️  Registering slash commands...");
    await rest.put(
      Routes.applicationCommands(CLIENT_ID),
      { body: slashCommands.map(cmd => cmd.toJSON()) }
    );
    console.log("✅ Successfully registered all slash commands!");
  } catch (error) {
    console.error("❌ Error registering slash commands:", error);
  }
}

// ===================================================
// 4. CLIENT INITIALIZATION & STARTUP
// ===================================================
client.once("ready", async () => {
  console.log(`🌴 Miami City System is online! Logged in as ${client.user.tag}`);

  // Set green online presence
  client.user.setPresence({
    activities: [{ name: "Miami City System", type: ActivityType.Playing }],
    status: "online"
  });

  // Automatically register commands on startup
  await registerCommands();
});

// Login to Keep Process Active continuously 24/7 on Railway
client.login(BOT_TOKEN);
