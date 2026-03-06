// Virtual File System for the Desktop Environment

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
          name: 'arsham',
          type: 'folder',
          children: [
            {
              name: 'about.txt',
              type: 'file',
              extension: 'txt',
              content: `╔══════════════════════════════════════════════════════════════╗
║                    ABOUT SEYEDARSHAM HOSSEINI                 ║
╚══════════════════════════════════════════════════════════════╝

Hello! I'm Seyedarsham Hosseini, a passionate Full-Stack Developer
based in the digital realm.

I specialize in building high-performance web and mobile applications
using modern technologies like React, TypeScript, and Web3.

My journey in software development started with a curiosity about
how things work, and has evolved into a career dedicated to creating
intuitive, responsive applications with seamless user experiences.

When I'm not coding, you can find me exploring new technologies,
contributing to open-source projects, or learning about the latest
trends in web development.

═══════════════════════════════════════════════════════════════════
                    "Code is poetry in motion"
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
► TypeScript      ███████████████████░  90%
► Next.js         ██████████████████░░  85%
► Tailwind CSS    ████████████████████  95%
► HTML/CSS        ████████████████████  98%
► JavaScript      ███████████████████░  92%

Frameworks & Libraries:
• React Query
• Redux / Zustand
• Framer Motion
• Three.js
• Styled Components`
                },
                {
                  name: 'backend.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `┌─────────────────────────────────────┐
│          BACKEND SKILLS            │
└─────────────────────────────────────┘

► Node.js         ██████████████████░░  85%
► Python          █████████████████░░░  80%
► Express.js      ██████████████████░░  85%
► PostgreSQL      ████████████████░░░░  75%
► MongoDB         █████████████████░░░  80%
► REST APIs       ███████████████████░  90%

Technologies:
• GraphQL
• Firebase
• Prisma ORM
• Docker`
                },
                {
                  name: 'mobile.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `┌─────────────────────────────────────┐
│          MOBILE SKILLS             │
└─────────────────────────────────────┘

► Flutter         ██████████████████░░  85%
► React Native    █████████████████░░░  80%
► Dart            ██████████████████░░  85%

Platforms:
• iOS Development
• Android Development
• Cross-platform Apps`
                },
                {
                  name: 'web3.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `┌─────────────────────────────────────┐
│           WEB3 SKILLS              │
└─────────────────────────────────────┘

► Solidity        ████████████████░░░░  75%
► Ethers.js       █████████████████░░░  80%
► Web3.js         █████████████████░░░  80%
► Smart Contracts ████████████████░░░░  75%

Blockchain:
• Ethereum
• DeFi Protocols
• NFT Development
• Wallet Integration`
                }
              ]
            },
            {
              name: 'projects',
              type: 'folder',
              children: [
                {
                  name: 'project1.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│           PROJECT: E-COMMERCE APP        │
╰──────────────────────────────────────────╯

Description:
A full-featured e-commerce platform built with React and Node.js

Tech Stack:
• Frontend: React, TypeScript, Tailwind CSS
• Backend: Node.js, Express, MongoDB
• Payment: Stripe Integration
• Auth: JWT, OAuth

Features:
✓ User authentication & profiles
✓ Product catalog with search & filters
✓ Shopping cart & wishlist
✓ Secure checkout with Stripe
✓ Order tracking
✓ Admin dashboard

GitHub: github.com/arsham/ecommerce-app`
                },
                {
                  name: 'project2.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│          PROJECT: CRYPTO DASHBOARD       │
╰──────────────────────────────────────────╯

Description:
Real-time cryptocurrency tracking dashboard with Web3 integration

Tech Stack:
• Frontend: Next.js, TypeScript, Chart.js
• Web3: Ethers.js, MetaMask
• APIs: CoinGecko, Alchemy

Features:
✓ Real-time price tracking
✓ Portfolio management
✓ Wallet connection
✓ Transaction history
✓ Price alerts
✓ DeFi analytics

GitHub: github.com/arsham/crypto-dashboard`
                },
                {
                  name: 'project3.txt',
                  type: 'file',
                  extension: 'txt',
                  content: `╭──────────────────────────────────────────╮
│          PROJECT: TASK MANAGER APP       │
╰──────────────────────────────────────────╯

Description:
A collaborative task management application with real-time updates

Tech Stack:
• Frontend: React, Redux, Material-UI
• Backend: Node.js, Socket.io
• Database: PostgreSQL, Redis

Features:
✓ Kanban board view
✓ Real-time collaboration
✓ Team workspaces
✓ File attachments
✓ Due dates & reminders
✓ Activity timeline

GitHub: github.com/arsham/task-manager`
                }
              ]
            },
            {
              name: 'contact.txt',
              type: 'file',
              extension: 'txt',
              content: `╔═══════════════════════════════════════════════════════════╗
║                     CONTACT INFORMATION                    ║
╚═══════════════════════════════════════════════════════════╝

┌─────────────────────────────────────────────────────────────┐
│  📧 Email:     seyedarsham@example.com                     │
│  🔗 LinkedIn:  linkedin.com/in/seyedarsham                 │
│  🐙 GitHub:    github.com/Arsham1ho                        │
│  🐦 Twitter:   @seyedarsham                                │
│  🌐 Website:   seyedarsham.dev                             │
└─────────────────────────────────────────────────────────────┘

Feel free to reach out for:
• Job opportunities
• Freelance projects
• Collaborations
• Just to say hi!

I typically respond within 24-48 hours.

═══════════════════════════════════════════════════════════════
           "Let's build something amazing together!"
═══════════════════════════════════════════════════════════════`
            },
            {
              name: 'resume.txt',
              type: 'file',
              extension: 'txt',
              content: `╔═══════════════════════════════════════════════════════════════╗
║                         R E S U M E                           ║
║                    SEYEDARSHAM HOSSEINI                       ║
║                    Full-Stack Developer                       ║
╚═══════════════════════════════════════════════════════════════╝

┌─ EXPERIENCE ────────────────────────────────────────────────────┐
│                                                                 │
│  Senior Frontend Developer                                      │
│  Tech Company Inc. | 2022 - Present                            │
│  • Led development of customer-facing React applications        │
│  • Improved performance by 40% through optimization             │
│  • Mentored junior developers                                   │
│                                                                 │
│  Full-Stack Developer                                           │
│  Startup XYZ | 2020 - 2022                                     │
│  • Built scalable web applications from scratch                 │
│  • Implemented CI/CD pipelines                                  │
│  • Collaborated with cross-functional teams                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─ EDUCATION ─────────────────────────────────────────────────────┐
│                                                                 │
│  Bachelor of Science in Computer Science                        │
│  University of Technology | 2016 - 2020                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─ CERTIFICATIONS ────────────────────────────────────────────────┐
│                                                                 │
│  • AWS Certified Developer                                      │
│  • Meta Frontend Developer Certificate                          │
│  • Google UX Design Certificate                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘`
            },
            {
              name: '.bashrc',
              type: 'file',
              extension: 'bashrc',
              content: `# ~/.bashrc - Arsham's Shell Configuration

# Welcome message
echo "Welcome to Arsham's Portfolio Terminal!"
echo "Type 'help' for available commands."
echo ""

# Aliases
alias ll='ls -la'
alias projects='cd ~/projects'
alias skills='cd ~/skills'

# Prompt
PS1='\\[\\033[01;32m\\]arsham@portfolio\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]$ '

# Environment
export EDITOR=vim
export PATH=$PATH:~/bin`
            },
            {
              name: 'welcome.txt',
              type: 'file',
              extension: 'txt',
              content: `
 ██╗    ██╗███████╗██╗      ██████╗ ██████╗ ███╗   ███╗███████╗
 ██║    ██║██╔════╝██║     ██╔════╝██╔═══██╗████╗ ████║██╔════╝
 ██║ █╗ ██║█████╗  ██║     ██║     ██║   ██║██╔████╔██║█████╗
 ██║███╗██║██╔══╝  ██║     ██║     ██║   ██║██║╚██╔╝██║██╔══╝
 ╚███╔███╔╝███████╗███████╗╚██████╗╚██████╔╝██║ ╚═╝ ██║███████╗
  ╚══╝╚══╝ ╚══════╝╚══════╝ ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝

═══════════════════════════════════════════════════════════════════

Welcome to my interactive portfolio!

This is a simulated Linux desktop environment where you can explore
my work, skills, and projects just like browsing through files.

QUICK START:
────────────
• Double-click folder icons to open them
• Use the File Manager to browse directories
• Open Terminal to use command-line interface
• Click files to view their contents

DIRECTORY STRUCTURE:
────────────────────
~/about.txt      → Learn about me
~/skills/        → My technical skills
~/projects/      → Portfolio projects
~/contact.txt    → How to reach me
~/resume.txt     → My resume

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
  if (path === '/home/arsham' || path === '/home/arsham/') return '~';
  return path.replace('/home/arsham', '~');
};
