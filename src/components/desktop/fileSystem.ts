// Virtual File System — Mehrab Gholamsamani's Portfolio Desktop

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  icon?: string;
  content?: string;
  children?: FileSystemItem[];
  extension?: string;
}

export const fileSystem: FileSystemItem = {
  name: '/',
  type: 'folder',
  children: [
    {
      name: 'home',
      type: 'folder',
      children: [
        {
          name: 'mehrab',
          type: 'folder',
          children: [
            {
              name: 'about.txt',
              type: 'file',
              extension: 'txt',
              content: `╔══════════════════════════════════════════════════════════════╗
║               ABOUT MEHRAB GHOLAMSAMANI                      ║
╚══════════════════════════════════════════════════════════════╝

Hi! I'm Mehrab Gholamsamani (مهراب غلامسامانی), a Full-Stack
Developer based in Tampere, Finland.

I specialize in building production-ready web applications using
React, TypeScript, and JavaScript — with a focus on component-
based architecture, Node.js/Express REST APIs, and responsive
UI/UX design built with attention to performance optimization.

My journey started with a deep curiosity about how the web works,
and has grown into a career dedicated to shipping real products
that people actually use.

I've worked across the full stack at two companies in Tehran,
leading feature development, architecting APIs, migrating React
SPAs to Next.js with SSR, and consistently improving performance
metrics — 40% faster load times, 44% fewer unnecessary renders.

Currently studying Bachelor of Software Engineering at Tampere
University of Applied Sciences (GPA: 5.0 / 5.0) with an expected
graduation in 2028.

When I'm not coding, I explore new frameworks, contribute to
side projects, and keep pushing for cleaner, faster software.

═══════════════════════════════════════════════════════════════════
              "Ship fast, iterate faster, stay curious."
═══════════════════════════════════════════════════════════════════`
            },
            {
              name: 'skills',
              type: 'folder',
              children: [
                {
                  name: 'frontend.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `┌─────────────────────────────────────┐
│         FRONTEND SKILLS            │
└─────────────────────────────────────┘

► React.js        ████████████████████  95%
► TypeScript      ███████████████████░  92%
► JavaScript ES6+ ████████████████████  95%
► Next.js         ██████████████████░░  88%
► HTML5 / CSS3    ████████████████████  98%
► Tailwind CSS    ███████████████████░  90%
► Bootstrap / Sass ████████████████░░░  80%

Libraries & Concepts:
• Component-based architecture
• React hooks & context
• Responsive & semantic design
• UI/UX principles
• Performance optimization
• Figma / design handoff`
                },
                {
                  name: 'backend.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `┌─────────────────────────────────────┐
│          BACKEND SKILLS            │
└─────────────────────────────────────┘

► Node.js         ███████████████████░  90%
► Express.js      ███████████████████░  90%
► RESTful APIs    ████████████████████  95%
► PostgreSQL       ████████████████░░░  78%
► MongoDB          █████████████████░░  82%
► Supabase         ██████████████████░  85%
► Docker           ████████████░░░░░░░  62%
► Nginx            ████████████░░░░░░░  62%

Technologies:
• JWT / OAuth authentication
• WebSockets (Socket.io)
• Prisma ORM
• API integration (third-party)`
                },
                {
                  name: 'tools.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `┌─────────────────────────────────────┐
│           TOOLS & WORKFLOW         │
└─────────────────────────────────────┘

► Git / GitHub    ████████████████████  95%
► GitLab          ████████████████████  90%
► Vite / npm      ████████████████████  95%
► Agile / Scrum   ██████████████████░░  85%
► Figma           ████████████████░░░░  78%

Practices:
• Code splitting & lazy loading
• CI/CD pipelines
• Semantic HTML & accessibility
• Cross-browser compatibility
• Performance profiling`
                },
              ]
            },
            {
              name: 'projects',
              type: 'folder',
              children: [
                {
                  name: 'Lumiere.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│           PROJECT: LUMIERE               │
│           Full-Stack E-Commerce          │
╰──────────────────────────────────────────╯

Description:
Production-ready full-stack e-commerce app using React +
TypeScript + Supabase with authentication, database
persistence, RLS security, and responsive UI architecture.

Tech Stack:
• Frontend: React, TypeScript, Tailwind CSS
• Backend: Supabase (PostgreSQL + Auth + RLS)
• Hosting: Vercel

Features:
✓ User authentication & profiles
✓ Product catalog with filtering
✓ Shopping cart & checkout flow
✓ Row-Level Security (RLS)
✓ Responsive design

GitHub: github.com/mehrabgholamsamani/Lumiere
Live:   lumiere-one-theta.vercel.app`
                },
                {
                  name: 'CryptoDash.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│          PROJECT: CRYPTODASH             │
│          Analytics Dashboard             │
╰──────────────────────────────────────────╯

Description:
A modern crypto market dashboard with charts, indicators,
watchlists, and theme customization — built with React,
Vite, and Chart.js.

Tech Stack:
• Frontend: React, TypeScript, Vite
• Charts: Chart.js
• Hosting: Vercel

Features:
✓ Real-time price charts
✓ Watchlist management
✓ Theme customization (light/dark)
✓ Market indicators
✓ Responsive UI

GitHub: github.com/mehrabgholamsamani/CryptoDash
Live:   crypto-dash-ten-eta.vercel.app`
                },
                {
                  name: 'Boardly.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│           PROJECT: BOARDLY               │
│           Interactive Whiteboard         │
╰──────────────────────────────────────────╯

Description:
Real-time collaborative whiteboard built with React,
TypeScript, HTML5 Canvas, and WebSockets (Node.js).
Deployed on Vercel + Render with room-based sync and
deterministic canvas rendering.

Tech Stack:
• Frontend: React, TypeScript, HTML5 Canvas
• Backend: Node.js, Socket.io (WebSockets)
• Hosting: Vercel (client) + Render (server)

Features:
✓ Real-time collaboration
✓ Room-based sessions
✓ Deterministic canvas rendering
✓ Multiple drawing tools
✓ Sync across all connected clients

GitHub: github.com/mehrabgholamsamani/Boardly-Fullstack
Live:   boardly-fullstack-client.vercel.app`
                },
                {
                  name: 'Habitly.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│           PROJECT: HABITLY               │
│           Meditation & Focus App         │
╰──────────────────────────────────────────╯

Description:
A production-ready meditation and focus application built
with Expo and React Native, emphasizing calm UX, local-first
data storage, and sustainable habit formation.

Tech Stack:
• Framework: React Native, Expo
• Storage: Local-first (AsyncStorage)
• Hosting: Vercel (web preview)

Features:
✓ Guided meditation sessions
✓ Focus timer (Pomodoro-style)
✓ Habit streak tracking
✓ Local-first data (works offline)
✓ Calm, accessible UX

GitHub: github.com/mehrabgholamsamani/Habitly
Live:   habitly-theta-ruby.vercel.app`
                },
              ]
            },
            {
              name: 'contact.txt',
              type: 'file',
              extension: 'txt',
              content: `╔═══════════════════════════════════════════════════════════╗
║                   CONTACT INFORMATION                      ║
╚═══════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│  📧 Email:     mehrab@mehrabdev.com                        │
│  🔗 LinkedIn:  linkedin.com/in/mehrab-samani-853103393         │
│  🐙 GitHub:    github.com/mehrabgholamsamani               │
│  🌐 Website:   mehrabdev.com                               │
│  📍 Location:  Tampere, Finland                            │
└─────────────────────────────────────────────────────────────┘

Available for:
• Full-time opportunities
• Freelance / contract projects
• Open-source collaborations
• Just a friendly chat!

I typically respond within 24 hours.

═══════════════════════════════════════════════════════════════
           "Let's build something great together!"
═══════════════════════════════════════════════════════════════`
            },
            {
              name: 'resume.txt',
              type: 'file',
              extension: 'txt',
              content: `╔═══════════════════════════════════════════════════════════════╗
║                         R E S U M E                           ║
║                   MEHRAB GHOLAMSAMANI                         ║
║                    Full-Stack Developer                       ║
╚═══════════════════════════════════════════════════════════════╝

┌─ EXPERIENCE ────────────────────────────────────────────────────┐
│                                                                 │
│  Full-Stack Developer                                           │
│  Radin Tavira — Tehran, Iran  |  Jan 2024 – Apr 2025           │
│  • Owned full-stack feature dev with PERN stack; cut page      │
│    load times 40% via code splitting & lazy loading            │
│  • Architected core backend APIs (Node/Express) with REST      │
│    standards and caching for scalable feature development      │
│  • Led React SPA → Next.js SSR migration; improved SEO &      │
│    initial load speed for content-heavy pages                  │
│  • Refactored React architecture & state management;           │
│    reduced re-renders by 44% on high-traffic pages             │
│                                                                 │
│  Full-Stack Developer                                           │
│  Mohebi Modelling — Tehran, Iran  |  Feb 2023 – Oct 2023      │
│  • Architected solo end-to-end portfolio & booking platform;   │
│    delivered 30% faster than estimated timeline                │
│  • Built component-based UI with React, TypeScript, Zustand;  │
│    cut code duplication 35%, future dev time 27%               │
│  • Optimized React with memo/useCallback + Vite; reduced       │
│    avg interaction latency by 120ms                            │
│  • Gathered user feedback & shipped iterative improvements;    │
│    resolved 15 critical bugs, boosted session duration 22%     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─ EDUCATION ─────────────────────────────────────────────────────┐
│                                                                 │
│  Bachelor of Software Engineering                               │
│  Tampere University of Applied Sciences  |  Expected 2028      │
│  GPA: 5.0 / 5.0                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─ CORE SKILLS ───────────────────────────────────────────────────┐
│                                                                 │
│  React · TypeScript · JavaScript (ES6+) · Next.js              │
│  Node.js · Express.js · RESTful APIs · PostgreSQL              │
│  Supabase · Git · Docker · Tailwind CSS · Figma                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`
            },
            {
              name: '.bashrc',
              type: 'file',
              extension: 'bashrc',
              content: `# ~/.bashrc — Mehrab's Shell Configuration

# Welcome message
echo "Welcome to Mehrab's Portfolio Terminal!"
echo "Type 'help' for available commands."
echo ""

# Aliases
alias ll='ls -la'
alias projects='cd ~/projects'
alias skills='cd ~/skills'

# Prompt
PS1='\\[\\033[01;32m\\]mehrab@portfolio\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]$ '

# Environment
export EDITOR=vim
export PATH=$PATH:~/bin`
            },
            {
              name: 'welcome.txt',
              type: 'file',
              extension: 'txt',
              content: `
 ███╗   ███╗███████╗██╗  ██╗██████╗  █████╗ ██████╗
 ████╗ ████║██╔════╝██║  ██║██╔══██╗██╔══██╗██╔══██╗
 ██╔████╔██║█████╗  ███████║██████╔╝███████║██████╔╝
 ██║╚██╔╝██║██╔══╝  ██╔══██║██╔══██╗██╔══██║██╔══██╗
 ██║ ╚═╝ ██║███████╗██║  ██║██║  ██║██║  ██║██████╔╝
 ╚═╝     ╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝

═══════════════════════════════════════════════════════════════════

Welcome to my interactive portfolio desktop!

Explore my work just like browsing a real Linux system.

QUICK START:
────────────
• Double-click folder icons to open them
• Use the File Manager to browse directories
• Open Terminal to use the command-line interface
• Click files to view their contents

DIRECTORY STRUCTURE:
────────────────────
~/about.txt      → About me
~/skills/        → Technical skills breakdown
~/projects/      → My portfolio projects
~/contact.txt    → How to reach me
~/resume.txt     → My experience & education

TERMINAL COMMANDS:
──────────────────
  ls, cd, cat, open, neofetch, whoami, help

Enjoy exploring! 🚀

═══════════════════════════════════════════════════════════════════`
            }
          ]
        }
      ]
    }
  ]
};

// Helper function to get item at path
export const getItemAtPath = (path: string): FileSystemItem | null => {
  const parts = path.split('/').filter(p => p !== '');
  let current: FileSystemItem = fileSystem;

  for (const part of parts) {
    if (current.type !== 'folder' || !current.children) return null;
    const found = current.children.find(child => child.name === part);
    if (!found) return null;
    current = found;
  }

  return current;
};

// Helper to get parent path
export const getParentPath = (path: string): string => {
  const parts = path.split('/').filter(p => p !== '');
  parts.pop();
  return '/' + parts.join('/');
};

// Helper to get path display name
export const getPathDisplayName = (path: string): string => {
  if (path === '/home/mehrab' || path === '/home/mehrab/') return '~';
  return path.replace('/home/mehrab', '~');
};
