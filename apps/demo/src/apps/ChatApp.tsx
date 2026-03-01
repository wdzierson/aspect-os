import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Mic, Paperclip, Plus, Send, X } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

interface Contact {
  id: string;
  name: string;
  color: string;
  status: string;
  messages: Message[];
}

const CANNED_REPLIES = [
  "That's interesting!",
  'Tell me more!',
  'I was just thinking the same thing',
  'Nice!',
  "Ha, that's great!",
  'Totally agree.',
  "Wow, I didn't know that!",
  'Makes sense to me!',
  'Hmm, let me think about that...',
  "You're so right!",
];

const now = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const initialContacts: Contact[] = [
  {
    id: 'alex',
    name: 'Alex Chen',
    color: '#3b82f6',
    status: 'online',
    messages: [
      { id: 1, text: 'Hey! Did you check out the new AspectOS demo?', sent: false, time: '9:41 AM' },
      { id: 2, text: 'Yes! The glassmorphism looks incredible.', sent: true, time: '9:42 AM' },
      { id: 3, text: 'Right? The window management is so smooth too.', sent: false, time: '9:43 AM' },
    ],
  },
  {
    id: 'sam',
    name: 'Sam Rivera',
    color: '#8b5cf6',
    status: 'online',
    messages: [
      { id: 1, text: 'Are we still on for the code review today?', sent: false, time: '10:15 AM' },
      { id: 2, text: "Absolutely! 3pm works for me.", sent: true, time: '10:20 AM' },
    ],
  },
  {
    id: 'jordan',
    name: 'Jordan Kim',
    color: '#ec4899',
    status: 'away',
    messages: [
      { id: 1, text: 'Just pushed the latest build', sent: false, time: 'Yesterday' },
    ],
  },
  {
    id: 'taylor',
    name: 'Taylor Okafor',
    color: '#f59e0b',
    status: 'offline',
    messages: [
      { id: 1, text: 'Thanks for your help with that bug fix!', sent: true, time: 'Monday' },
      { id: 2, text: 'Anytime! That was a tricky one.', sent: false, time: 'Monday' },
    ],
  },
];

export function ChatApp() {
  const [contacts, setContacts] = useState(initialContacts);
  const [activeContactId, setActiveContactId] = useState('alex');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Array<{ id: string; name: string; size?: number }>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(100);

  const activeContact = contacts.find((c) => c.id === activeContactId)!;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(scrollToBottom, [activeContact.messages, scrollToBottom]);

  const sendMessage = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const msgId = nextId.current++;
    setContacts((prev) =>
      prev.map((c) =>
        c.id === activeContactId
          ? { ...c, messages: [...c.messages, { id: msgId, text, sent: true, time: now() }] }
          : c,
      ),
    );
    setInput('');
    setAttachments([]);

    const replyId = nextId.current++;
    setIsTyping(true);
    setTimeout(() => {
      const reply = CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)];
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContactId
            ? { ...c, messages: [...c.messages, { id: replyId, text: reply, sent: false, time: now() }] }
            : c,
        ),
      );
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  }, [input, activeContactId]);

  const addAttachments = useCallback((files: FileList | null) => {
    if (!files?.length) return;
    const next = Array.from(files).map((file, i) => ({
      id: `${Date.now()}-${i}`,
      name: file.name,
      size: file.size,
    }));
    setAttachments((prev) => [...prev, ...next]);
  }, []);

  const removeAttachment = useCallback((id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const simulateVoice = useCallback(() => {
    setIsTyping(true);
    const replyId = nextId.current++;
    window.setTimeout(() => {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === activeContactId
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  { id: replyId, text: 'Voice message received. Hook this to your bot/voice backend.', sent: false, time: now() },
                ],
              }
            : c,
        ),
      );
      setIsTyping(false);
    }, 1200);
  }, [activeContactId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  const lastMessage = (c: Contact) => {
    const m = c.messages[c.messages.length - 1];
    return m ? (m.sent ? `You: ${m.text}` : m.text) : '';
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 bg-muted/50 border-r border-border/50 flex flex-col">
        <div className="px-3 py-2.5 border-b border-border/50">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Messages
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`w-full text-left px-3 py-2.5 flex items-center gap-2.5 transition-colors ${
                contact.id === activeContactId
                  ? 'bg-primary/10'
                  : 'hover:bg-muted/80'
              }`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                style={{ background: contact.color }}
              >
                {contact.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground font-medium truncate">
                  {contact.name}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {lastMessage(contact)}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-border/50 flex items-center gap-2.5 bg-muted/30">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
            style={{ background: activeContact.color }}
          >
            {activeContact.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="text-sm text-foreground font-medium">{activeContact.name}</div>
            <div className="text-[10px] text-muted-foreground">{activeContact.status}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {activeContact.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-3 py-1.5 rounded-2xl text-sm leading-relaxed ${
                  msg.sent
                    ? 'bg-blue-500 text-white rounded-br-md'
                    : 'bg-muted text-foreground rounded-bl-md'
                }`}
              >
                {msg.text}
                <div
                  className={`text-[9px] mt-0.5 ${
                    msg.sent ? 'text-blue-100/60' : 'text-muted-foreground'
                  }`}
                >
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[70%] px-3 py-2 rounded-2xl rounded-bl-md bg-muted text-foreground">
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground mb-1">
                  <Bot className="w-3 h-3" />
                  <span>{activeContact.name} is typing</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/70 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-3 py-2.5 border-t border-border/50">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {attachments.map((a) => (
                <span
                  key={a.id}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-muted-foreground text-[11px]"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="max-w-[160px] truncate">{a.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(a.id)}
                    className="hover:bg-muted-foreground/20 rounded p-0.5"
                    aria-label="Remove attachment"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={(e) => {
                addAttachments(e.target.files);
                e.currentTarget.value = '';
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              aria-label="Add attachment"
            >
              <Plus className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-muted border border-border text-foreground placeholder-muted-foreground rounded-full px-4 py-1.5 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
          />
            <button
              type="button"
              onClick={simulateVoice}
              className="w-8 h-8 rounded-full border border-border bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              aria-label="Simulate voice message"
            >
              <Mic className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-400 transition-colors disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
          </div>
        </div>
      </div>
    </div>
  );
}
