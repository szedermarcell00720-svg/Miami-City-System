import { logger } from '../utils/logger.js';

export const botConfig = {
  // ==========================================
  // BOT PRESENCE & STATUS
  // ==========================================
  presence: {
    status: "online", // Options: "online" | "idle" | "dnd" | "invisible"
    activities: [
      {
        name: "Miami City Roleplay",
        state: "🌴 Protecting & Serving Miami", // Visible custom status text
        type: 4, // 4 = Custom status in Discord API
      }
    ]
  },

  // ==========================================
  // COMMAND SETTINGS & EXTENDED ER:LC COMMANDS
  // ==========================================
  commands: {
    owners: process.env.OWNER_IDS ? process.env.OWNER_IDS.split(",").map((id) => id.trim()).filter(Boolean) : [],
    defaultCooldown: 3,
    deleteCommands: false,
    testGuildId: process.env.TEST_GUILD_ID,
    maintenanceMode: process.env.MAINTENANCE_MODE === "true",
    prefix: process.env.PREFIX || "!",

    // Extended Custom Utilities & ER:LC Response Commands
    customCommands: [
      {
        name: "servercode",
        description: "Get the main ERLC server join code and connection guide",
        response: "🌴 **MIAMI CITY ROLEPLAY — ERLC JOIN CODE** 🌴\n\n**Server Code:** `MIAMI`\n**Server Status:** 🟢 Online & Public\n**Host:** Management Team\n\n📌 **How to Join:**\n1. Launch *Emergency Response: Liberty County* on Roblox.\n2. Go to **Private Servers** > **Join Private Server**.\n3. Type code `MIAMI` and connect!"
      },
      {
        name: "rules",
        description: "Detailed overview of server rules and roleplay directives",
        response: "📜 **MIAMI CITY ROLEPLAY — CORE RULES** 📜\n\n1. **FailRP / FRP:** Unrealistic actions, leaving mid-RP, or failing to value your life (FearRP) are strictly punishable.\n2. **RDM / VDM:** Random & Vehicle Deathmatch will lead to an immediate kick/ban.\n3. **New Life Rule (NLR):** Upon dying, you forget the prior scenario and cannot return to that area for 15 minutes.\n4. **Priority Cooldowns:** Do not initiate high-tier crimes (bank robberies, server pursuits) during active priority cooldowns.\n\n👉 *Read the complete rulebook in <#RULES_CHANNEL_ID>.*"
      },
      {
        name: "cad",
        description: "Link and registration steps for the CAD/MDT system",
        response: "💻 **MIAMI CITY ROLEPLAY — CAD / MDT SYSTEM** 💻\n\nAll LEO, EMS, Fire, and Civilian members must register on our CAD system to log characters, warrants, and vehicle plates.\n\n🔗 **CAD Access:** https://cad.miamicityrp.com\n🆔 **Community Code:** `MIAMIRP`\n\n*Need CAD assistance? Open a **General Support** ticket!*"
      },
      {
        name: "session",
        description: "Check current roleplay session status and host info",
        response: "🚨 **MIAMI CITY ROLEPLAY — SESSION STATUS** 🚨\n\n**Status:** 🟢 ACTIVE SESSION IN PROGRESS\n**Server Code:** `MIAMI`\n**Active Units:** LSPD, Sheriff, and Miami Fire Rescue currently on patrol.\n\n⚠️ *Make sure you are properly registered in the CAD before spawning in on duty.*"
      },
      {
        name: "departments",
        description: "List of official Miami City RP departments",
        response: "🚓 **MIAMI CITY ROLEPLAY — DEPARTMENTS** 🚓\n\n• **Miami Police Department (MPD):** Primary urban law enforcement.\n• **Miami-Dade Sheriff's Office (MDSO):** Highway patrol and county security.\n• **Miami Fire Rescue (MFR):** Emergency medical services and fire suppression.\n• **Civilian Operations (CIV):** Registered civilian roleplay and official business owners.\n\n📝 *Apply for a department using our application portal!*"
      },
      {
        name: "civilian",
        description: "Civilian guidelines and priority rules",
        response: "🚘 **CIVILIAN ROLEPLAY DIRECTIVE** 🚘\n\n• Ensure all civilian vehicles are registered in the CAD before driving.\n• High-tier crimes require a minimum of **3 LEO on duty**.\n• Keep criminal roleplay realistic and engaging for all parties involved."
      },
      {
        name: "staff",
        description: "In-game and Discord staff assistance guide",
        response: "🛡️ **STAFF ASSISTANCE DIRECTIVE** 🛡️\n\n• **In-Game Help:** Execute `!modcall` inside the ERLC server for on-scene moderation.\n• **Discord Help:** Open a support ticket in our portal.\n• Do not direct message staff members for ticket/report responses."
      },
      {
        name: "socials",
        description: "Official links for Miami City Roleplay",
        response: "🌐 **OFFICIAL MIAMI CITY LINKS** 🌐\n\n• **Roblox Group:** https://www.roblox.com/groups/miamicityrp\n• **TikTok:** https://tiktok.com/@miamicityroleplay\n• **YouTube:** https://youtube.com/@miamicityroleplay\n• **CAD System:** https://cad.miamicityrp.com"
      }
    ]
  },

  // ==========================================
  // APPLICATIONS & RECRUITMENT
  // ==========================================
  applications: {
    defaultQuestions: [
      { question: "What is your Roblox Username & Discord User ID?", required: true },
      { question: "How old are you?", required: true },
      { question: "Which department are you applying for? (Staff / MPD / MDSO / Fire Rescue / Civilian)", required: true },
      { question: "How many hours per week can you dedicate to Miami City RP?", required: true },
      { question: "Why do you want to join our team, and what prior ER:LC experience do you have?", required: true }
    ],
    statusColors: {
      pending: "#FFA500",
      approved: "#00FF00",
      denied: "#FF0000",
    },
    applicationCooldown: 24, // Hours before re-applying
    deleteDeniedAfter: 7,    // Auto-clean denied apps (Days)
    deleteApprovedAfter: 30, // Auto-clean approved apps (Days)
    managerRoles: [],
  },

  // ==========================================
  // SUPPORT TICKETS & CATEGORIES
  // ==========================================
  support: {
    categories: [
      {
        id: "community_support",
        label: "Community Support",
        emoji: "🤝",
        description: "General member assistance, server inquiries, role requests, or general navigation.",
        color: "#3498DB"
      },
      {
        id: "general_support",
        label: "General Support",
        emoji: "🚔",
        description: "In-game ER:LC issues, civilian questions, server code help, or basic RP queries.",
        color: "#00FF00"
      },
      {
        id: "management_support",
        label: "Management Support",
        emoji: "💼",
        description: "Department leadership inquiries, ban appeals, partnerships, or server feedback.",
        color: "#E91E63"
      },
      {
        id: "staff_reports",
        label: "Staff Reports",
        emoji: "🛡️",
        description: "Report a staff member for abuse of power or policy violations. Video evidence required.",
        color: "#FF0000"
      }
    ]
  },

  // ==========================================
  // EMBED BRANDING & MIAMI NEON THEME
  // ==========================================
  embeds: {
    colors: {
      // Miami Vice / Cyberpunk Brand Palette
      primary: "#FF1493",   // Deep Pink
      secondary: "#00F0FF", // Neon Cyan

      // Standard Status Colors
      success: "#57F287",
      error: "#ED4245",
      warning: "#FEE75C",
      info: "#3498DB",

      // Utility Colors
      light: "#FFFFFF",
      dark: "#1A1A24",
      gray: "#99AAB5",

      // Ticket & System Colors
      ticket: {
        open: "#57F287",
        claimed: "#FAA61A",
        closed: "#ED4245",
        pending: "#99AAB5",
      },
      economy: "#F1C40F",
      birthday: "#E91E63",
      moderation: "#FF1493",

      priority: {
        none: "#95A5A6",
        low: "#3498DB",
        medium: "#2ECC71",
        high: "#F1C40F",
        urgent: "#E74C3C",
      },
    },
    footer: {
      text: "Miami City Roleplay • Official Bot",
      icon: null,
    },
    thumbnail: null
  }
};
