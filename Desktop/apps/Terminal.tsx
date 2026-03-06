import { useState, useRef, useEffect } from 'react';
import { getItemAtPath, getPathDisplayName } from '../fileSystem';

interface TerminalProps {
  onOpenFile: (path: string, content: string, name: string) => void;
}

interface HistoryEntry {
  type: 'input' | 'output' | 'error';
  content: string;
}

const Terminal = ({ onOpenFile }: TerminalProps) => {
  const [currentPath, setCurrentPath] = useState('/home/arsham');
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([
    { type: 'output', content: '\x1b[90mPortfolio OS Terminal v1.0\x1b[0m' },
    { type: 'output', content: '\x1b[90mType "help" for available commands.\x1b[0m\n' },
  ]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history]);

  const addOutput = (content: string, isError: boolean = false) => {
    setHistory(prev => [...prev, { type: isError ? 'error' : 'output', content }]);
  };

  const getPrompt = () => {
    const displayPath = getPathDisplayName(currentPath);
    return `\x1b[36marsham\x1b[0m@\x1b[35mportfolio\x1b[0m:\x1b[33m${displayPath}\x1b[0m$`;
  };

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    setHistory(prev => [...prev, { type: 'input', content: `${getPrompt()} ${trimmedCmd}` }]);
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    const [command, ...args] = trimmedCmd.split(' ');
    const argString = args.join(' ');

    switch (command.toLowerCase()) {
      case 'help':
        addOutput(`
\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
\x1b[1mAvailable Commands\x1b[0m
\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m

 \x1b[33mNavigation\x1b[0m
   ls [dir]       List directory contents
   cd <dir>       Change directory (cd ~, cd ..)
   pwd            Print working directory

 \x1b[33mFiles\x1b[0m
   cat <file>     Display file contents
   open <file>    Open file in viewer

 \x1b[33mSystem\x1b[0m
   clear          Clear terminal screen
   whoami         Display current user
   neofetch       Display system info
   date           Show current date/time

 \x1b[33mMisc\x1b[0m
   echo <text>    Print text to terminal
   help           Show this help message
   exit           Exit message

\x1b[36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m
`);
        break;

      case 'ls':
        const lsPath = argString ? resolvePath(argString) : currentPath;
        const lsFolder = getItemAtPath(lsPath);
        if (lsFolder?.type === 'folder' && lsFolder.children) {
          const folders = lsFolder.children.filter(i => i.type === 'folder');
          const files = lsFolder.children.filter(i => i.type === 'file');
          const output = [
            ...folders.map(item => `\x1b[34m${item.name}/\x1b[0m`),
            ...files.map(item => item.name.startsWith('.') ? `\x1b[90m${item.name}\x1b[0m` : item.name)
          ];
          addOutput(output.join('   '));
        } else {
          addOutput(`ls: cannot access '${argString}': No such file or directory`, true);
        }
        break;

      case 'cd':
        if (!argString || argString === '~') {
          setCurrentPath('/home/arsham');
        } else if (argString === '..') {
          const parts = currentPath.split('/').filter(p => p);
          if (parts.length > 0) {
            parts.pop();
            setCurrentPath('/' + parts.join('/') || '/');
          }
        } else {
          const newPath = resolvePath(argString);
          const folder = getItemAtPath(newPath);
          if (folder?.type === 'folder') {
            setCurrentPath(newPath);
          } else {
            addOutput(`cd: ${argString}: No such directory`, true);
          }
        }
        break;

      case 'cat':
        if (!argString) {
          addOutput('cat: missing file operand', true);
        } else {
          const filePath = resolvePath(argString);
          const file = getItemAtPath(filePath);
          if (file?.type === 'file' && file.content) {
            addOutput(file.content);
          } else if (file?.type === 'folder') {
            addOutput(`cat: ${argString}: Is a directory`, true);
          } else {
            addOutput(`cat: ${argString}: No such file or directory`, true);
          }
        }
        break;

      case 'open':
        if (!argString) {
          addOutput('open: missing file operand', true);
        } else {
          const filePath = resolvePath(argString);
          const file = getItemAtPath(filePath);
          if (file?.type === 'file' && file.content) {
            onOpenFile(filePath, file.content, file.name);
            addOutput(`\x1b[32m✓\x1b[0m Opening ${file.name}...`);
          } else if (file?.type === 'folder') {
            addOutput(`open: ${argString}: Is a directory`, true);
          } else {
            addOutput(`open: ${argString}: No such file`, true);
          }
        }
        break;

      case 'pwd':
        addOutput(currentPath);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'whoami':
        addOutput('arsham');
        break;

      case 'hostname':
        addOutput('portfolio');
        break;

      case 'echo':
        addOutput(argString || '');
        break;

      case 'date':
        addOutput(new Date().toLocaleString());
        break;

      case 'neofetch':
        addOutput(`
\x1b[36m                  .,,,,,.                  \x1b[0m   \x1b[36marsham\x1b[0m@\x1b[35mportfolio\x1b[0m
\x1b[36m              ,#@@@@@@@@@@#,              \x1b[0m   \x1b[90m─────────────────\x1b[0m
\x1b[36m           .@@@@@@@@@@@@@@@@@@.           \x1b[0m   \x1b[33mOS\x1b[0m:      Portfolio OS
\x1b[36m         .@@@@@@@@@@@@@@@@@@@@@@.         \x1b[0m   \x1b[33mHost\x1b[0m:    Web Browser
\x1b[36m        @@@@@@@@@@@@@@@@@@@@@@@@@        \x1b[0m    \x1b[33mKernel\x1b[0m:  React 18.x
\x1b[36m       @@@@@@@@@@@@@@@@@@@@@@@@@@@       \x1b[0m    \x1b[33mShell\x1b[0m:   portfolio-bash
\x1b[36m      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@      \x1b[0m    \x1b[33mTerminal\x1b[0m: Portfolio Term
\x1b[36m      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@      \x1b[0m
\x1b[36m      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@      \x1b[0m    \x1b[33mSkills\x1b[0m:  React, TypeScript
\x1b[36m      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@      \x1b[0m             Node.js, Web3
\x1b[36m       @@@@@@@@@@@@@@@@@@@@@@@@@@@       \x1b[0m             Flutter, Python
\x1b[36m        @@@@@@@@@@@@@@@@@@@@@@@@@        \x1b[0m
\x1b[36m         '@@@@@@@@@@@@@@@@@@@@@@'         \x1b[0m   \x1b[33mStatus\x1b[0m:  \x1b[32m●\x1b[0m Available
\x1b[36m           '@@@@@@@@@@@@@@@@@@'           \x1b[0m
\x1b[36m              '#@@@@@@@@@@#'              \x1b[0m
\x1b[36m                  '''''                   \x1b[0m
`);
        break;

      case 'sudo':
        addOutput(`\x1b[31m✗\x1b[0m Nice try! This is a read-only portfolio. 😉`);
        break;

      case 'rm':
      case 'mv':
      case 'cp':
        addOutput(`\x1b[31m✗\x1b[0m This is a read-only filesystem. No modifications allowed!`);
        break;

      case 'exit':
        addOutput(`\x1b[90mThanks for exploring! Close the window to exit.\x1b[0m`);
        break;

      default:
        addOutput(`\x1b[31m✗\x1b[0m Command not found: ${command}
  Type '\x1b[33mhelp\x1b[0m' for available commands.`, true);
    }
  };

  const resolvePath = (path: string): string => {
    if (path.startsWith('/')) return path;
    if (path.startsWith('~')) return path.replace('~', '/home/arsham');

    const parts = currentPath.split('/').filter(p => p);
    const newParts = path.split('/');

    for (const part of newParts) {
      if (part === '..') parts.pop();
      else if (part !== '.') parts.push(part);
    }

    return '/' + parts.join('/');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        setHistoryIndex(historyIndex - 1);
        setInput(commandHistory[commandHistory.length - historyIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const parts = input.split(' ');
      const lastPart = parts[parts.length - 1];
      if (lastPart) {
        const folder = getItemAtPath(currentPath);
        if (folder?.children) {
          const matches = folder.children.filter(item =>
            item.name.toLowerCase().startsWith(lastPart.toLowerCase())
          );
          if (matches.length === 1) {
            parts[parts.length - 1] = matches[0].name + (matches[0].type === 'folder' ? '/' : '');
            setInput(parts.join(' '));
          }
        }
      }
    } else if (e.ctrlKey && e.key === 'l') {
      e.preventDefault();
      setHistory([]);
    } else if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      setHistory(prev => [...prev, { type: 'input', content: `${getPrompt()} ${input}^C` }]);
      setInput('');
    }
  };

  const formatOutput = (content: string, isError: boolean = false) => {
    let html = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\x1b\[36m/g, '<span class="text-cyan-400">')
      .replace(/\x1b\[35m/g, '<span class="text-purple-400">')
      .replace(/\x1b\[34m/g, '<span class="text-blue-400">')
      .replace(/\x1b\[33m/g, '<span class="text-yellow-400">')
      .replace(/\x1b\[32m/g, '<span class="text-green-400">')
      .replace(/\x1b\[31m/g, '<span class="text-red-400">')
      .replace(/\x1b\[90m/g, '<span class="text-gray-500">')
      .replace(/\x1b\[1m/g, '<span class="font-bold">')
      .replace(/\x1b\[0m/g, '</span>');

    return html;
  };

  return (
    <div
      className="h-full text-white font-mono text-[13px] flex flex-col overflow-hidden cursor-text"
      style={{ backgroundColor: '#0d0d0d' }}
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-3 leading-relaxed"
      >
        {history.map((entry, index) => (
          <div key={index} className="whitespace-pre-wrap">
            <span dangerouslySetInnerHTML={{ __html: formatOutput(entry.content, entry.type === 'error') }} />
          </div>
        ))}

        <div className="flex items-center whitespace-pre">
          <span dangerouslySetInnerHTML={{ __html: formatOutput(getPrompt()) }} />
          <span>&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-white"
            autoFocus
            spellCheck={false}
          />
          <span className="w-2 h-4 bg-white/80 animate-pulse ml-0.5" />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
