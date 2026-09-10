import { Client, GatewayIntentBits, ActivityType, EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

// Initialize Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ==========================================
// BOT ONLINE EVENT & GREEN STATUS BADGE
// ==========================================
client.once("ready", async () => {
  console.log(`🌴 ${client.user.tag} is now online and active for Miami City Roleplay!`);

  // 1. Sets the Green Online Dot status indicator
  client.user.setPresence({
    status: "online", // Shows the green dot badge
    activities: [
      {
        name: "Miami City Roleplay | Code: MIAMI",
        type: ActivityType.Playing
      }
    ]
  });

  // 2. Sends an online message in your designated channel
  const STARTUP_CHANNEL_ID = "YOUR_STARTUP_CHANNEL_ID_HERE";
  
  try {
    const channel = await client.channels.fetch(STARTUP_CHANNEL_ID);
    if (channel && channel.isTextBased()) {
      const onlineEmbed = new EmbedBuilder()
        .setTitle("🌴 MIAMI CITY ROLEPLAY — BOT ONLINE")
        .setDescription("The main system bot is currently **ONLINE** and operational. All slash commands, ticket systems, and session controls are active.")
        .setColor("#FF1493") // Miami Pink
        .addFields(
          { name: "⚡ Status", value: "🟢 Operational", inline: true },
          { name: "🔑 Server Code", value: "`MIAMI`", inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Miami City Roleplay • Systems Active" });

      await channel.send({ embeds: [onlineEmbed] });
    }
  } catch (error) {
    console.error("Could not send online status message:", error);
  }
});

// ==========================================
// SLASH COMMAND DEFINITIONS
// ==========================================
export const slashCommands = [

  // ACTIVITY CHECKS
  new SlashCommandBuilder()
    .setName("activitycheck")
    .setDescription("Manage staff activity checks for Miami City Roleplay")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub => 
      sub.setName("start").setDescription("Start a staff activity check"))
    .addSubcommand(sub => 
      sub.setName("cancel").setDescription("Cancel the current staff activity check"))
    .addSubcommand(sub => 
      sub.setName("status").setDescription("View the current activity check status")),

  // MODERATION & PUNISHMENTS
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from Miami City RP")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName("user").setDescription("The user to ban").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the ban").setRequired(false)),

  new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Temporarily ban a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(opt => opt.setName("user").setDescription("The user to ban").setRequired(true))
    .addStringOption(opt => opt.setName("duration").setDescription("Ban length (e.g. 1d, 7d)").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the temporary ban").setRequired(false)),

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
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for timeout").setRequired(false)),

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
    .addSubcommand(sub =>
      sub.setName("issue").setDescription("Issue a staff infraction")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))
        .addStringOption(opt => opt.setName("reason").setDescription("Reason for strike").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("edit").setDescription("Edit a staff infraction")
        .addStringOption(opt => opt.setName("case_id").setDescription("Infraction Case ID").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("logs").setDescription("View staff infraction logs")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))),

  new SlashCommandBuilder()
    .setName("promotion")
    .setDescription("Manage staff and department promotions")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand(sub =>
      sub.setName("issue").setDescription("Promote a staff member")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))
        .addRoleOption(opt => opt.setName("new_role").setDescription("New position/role").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("logs").setDescription("View staff promotion logs"))
    .addSubcommand(sub =>
      sub.setName("cooldown_check").setDescription("Check a staff member promotion cooldown")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))),

  new SlashCommandBuilder()
    .setName("retirement_log")
    .setDescription("Log a staff retirement or resignation")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addUserOption(opt => opt.setName("user").setDescription("Staff member retiring").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for leaving").setRequired(false)),

  // STAFF POINTS
  new SlashCommandBuilder()
    .setName("points")
    .setDescription("Manage staff moderation points")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addSubcommand(sub =>
      sub.setName("add").setDescription("Add moderation points")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))
        .addIntegerOption(opt => opt.setName("amount").setDescription("Points amount").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("remove").setDescription("Remove moderation points")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(true))
        .addIntegerOption(opt => opt.setName("amount").setDescription("Points amount").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("check").setDescription("Check moderation points")
        .addUserOption(opt => opt.setName("user").setDescription("Staff member").setRequired(false)))
    .addSubcommand(sub =>
      sub.setName("reset").setDescription("Reset moderation points")),

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
    .addSubcommand(sub =>
      sub.setName("add").setDescription("Add a user to this ticket")
        .addUserOption(opt => opt.setName("user").setDescription("User to add").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("remove").setDescription("Remove a user from this ticket")
        .addUserOption(opt => opt.setName("user").setDescription("User to remove").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("rename").setDescription("Rename this ticket")
        .addStringOption(opt => opt.setName("name").setDescription("New channel name").setRequired(true)))
    .addSubcommand(sub => sub.setName("escalate").setDescription("Escalate this ticket to higher management"))
    .addSubcommand(sub => sub.setName("close").setDescription("Close this ticket"))
    .addSubcommand(sub => sub.setName("closerequest").setDescription("Send a close request to the ticket opener")),

  // TRAINING OPERATIONS
  new SlashCommandBuilder()
    .setName("training")
    .setDescription("Department training commands")
    .addSubcommand(sub =>
      sub.setName("host").setDescription("Host a department training session")
        .addStringOption(opt => opt.setName("department").setDescription("MPD, MDSO, or MFR").setRequired(true)))
    .addSubcommand(sub => sub.setName("request").setDescription("Request a training session"))
    .addSubcommand(sub =>
      sub.setName("log_phase1").setDescription("Log Phase 1 training results")
        .addUserOption(opt => opt.setName("user").setDescription("Recruit").setRequired(true)))
    .addSubcommand(sub =>
      sub.setName("log_phase2").setDescription("Log Phase 2 training results")
        .addUserOption(opt => opt.setName("user").setDescription("Recruit").setRequired(true))),

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

client.login(process.env.DISCORD_TOKEN);
