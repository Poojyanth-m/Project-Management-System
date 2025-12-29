// 🎨 PROJECT PULSE — OFFICIAL COLOR SYSTEM

// 1️⃣ Core Brand Colors
export const Brand = {
    primary: "#E65F2B",      // Accent / CTA / Active
    primarySoft: "#F7D2C2",  // Subtle backgrounds
    dark: "#060606",         // Sidebar / Text
    light: "#FFFFFF",        // Cards / Inputs
};

// 2️⃣ Background System
export const Backgrounds = {
    app: "#CDB8A5",          // Main app background
    card: "#F2EAE5",         // Glass cards
    cardAlt: "#EFE5DE",      // Secondary cards
    divider: "rgba(0,0,0,0.08)",
};

// 3️⃣ Typography Colors
export const Text = {
    primary: "#060606",      // Main headings
    secondary: "#4B4B4B",    // Sub text
    muted: "#7A7A7A",        // Metadata
    inverse: "#FFFFFF",      // On dark
};

// 4️⃣ Status Colors (CONSISTENT EVERYWHERE)
export const Status = {
    completed: {
        main: "#1A932E",
        soft: "#E6F4EA",
    },
    inProgress: {
        main: "#DFA510",
        soft: "#FBF1D6",
    },
    atRisk: {
        main: "#EE201C",
        soft: "#FDE8E7",
    },
    blocked: {
        main: "#6B7280",
        soft: "#E5E7EB",
    },
};

// 5️⃣ Utility / Info Colors
export const Utility = {
    info: "#6B7280",        // Grey instead of blue
    infoSoft: "#E5E7EB",    // Light grey instead of blue
    success: "#16A34A",
    warning: "#D97706",
    error: "#DC2626",
};

// 🧩 Helper Functions
export const getLoadColor = (load: number): string => {
    if (load >= 80) return Status.atRisk.main;     // Overloaded
    if (load >= 60) return Status.inProgress.main; // High
    return Status.completed.main;                  // Healthy
};

export const getProgressColor = (progress: number): string => {
    if (progress === 100) return Status.completed.main;
    if (progress < 40) return Status.atRisk.main;
    if (progress < 70) return Status.inProgress.main;
    return Brand.primary;
};

export const getStatusColor = (status: string): { main: string; soft: string } => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('complet')) return Status.completed;
    if (statusLower.includes('progress') || statusLower.includes('ongoing') || statusLower.includes('on going')) return Status.inProgress;
    if (statusLower.includes('risk') || statusLower.includes('delay')) return Status.atRisk;
    if (statusLower.includes('block') || statusLower.includes('hold')) return Status.blocked;
    return { main: Text.secondary, soft: Backgrounds.cardAlt };
};
