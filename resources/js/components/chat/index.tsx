import issues from '@/routes/issues';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { BotIcon, CircleUserIcon, PlusIcon, SendIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '../ui/drawer';
import { Input } from '../ui/input';

interface Source {
    key: string;
    summary: string;
    score: number;
}

interface Message {
    id: string;
    type: 'user' | 'bot';
    content: string;
    sources?: Source[];
    timestamp: Date;
}

const CHAT_STORAGE_KEY = 'knowledge-hub-chat-messages';

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
        if (savedMessages) {
            try {
                const parsed = JSON.parse(savedMessages);
                // Convert timestamp strings back to Date objects
                const messagesWithDates = parsed.map((msg: any) => ({
                    ...msg,
                    timestamp: new Date(msg.timestamp),
                }));
                setMessages(messagesWithDates);
            } catch (error) {
                console.error('Error loading saved messages:', error);
            }
        }
    }, []);

    // Save messages to localStorage whenever they change
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
            const response = await axios.post(
                `${backendUrl}/api/chat`,
                {
                    query: inputValue,
                    top_k: 3,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: response.data.answer,
                sources:
                    response.data.sources?.filter(
                        (source: Source) => source.score > 0.5,
                    ) || [],
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content:
                    'Maaf, terjadi kesalahan saat mengirim pesan. Silakan coba lagi.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleNewChat = () => {
        if (messages.length > 0) {
            setShowConfirmation(true);
        }
    };

    const confirmNewChat = () => {
        setMessages([]);
        localStorage.removeItem(CHAT_STORAGE_KEY);
        setShowConfirmation(false);
    };

    return (
        <Drawer direction="right" open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className="fixed right-4 bottom-4 z-50 cursor-pointer bg-teal-600 text-white shadow-lg hover:bg-teal-700 hover:text-white hover:shadow-xl"
                >
                    <BotIcon />
                    <span>Open Chat</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="h-screen">
                <DrawerHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div>
                            <DrawerTitle className="flex items-center gap-2">
                                <BotIcon className="h-5 w-5" />
                                {import.meta.env.VITE_APP_NAME || 'Chat'}{' '}
                                Assistant
                            </DrawerTitle>
                            <DrawerDescription>
                                Your AI-powered chat assistant.
                            </DrawerDescription>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNewChat}
                            className="flex cursor-pointer items-center gap-1"
                            disabled={isLoading || messages.length === 0}
                        >
                            <PlusIcon className="h-4 w-4" />
                            New Chat
                        </Button>
                    </div>
                </DrawerHeader>

                <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {messages.length === 0 && (
                        <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
                            <BotIcon className="mb-4 h-12 w-12" />
                            <p>Start a new conversation</p>
                        </div>
                    )}

                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`flex max-w-[80%] gap-2 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                <div
                                    className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                        message.type === 'user'
                                            ? 'bg-teal-600 text-white'
                                            : 'bg-gray-200 text-gray-700'
                                    }`}
                                >
                                    {message.type === 'user' ? (
                                        <CircleUserIcon className="h-5 w-5" />
                                    ) : (
                                        <BotIcon className="h-5 w-5" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Card
                                        className={`p-3 ${
                                            message.type === 'user'
                                                ? 'bg-teal-600 text-white'
                                                : 'bg-gray-100'
                                        }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </Card>
                                    {message.sources &&
                                        message.sources.length > 0 && (
                                            <div className="space-y-1">
                                                <p className="text-xs font-semibold text-muted-foreground">
                                                    References:
                                                </p>
                                                {message.sources.map(
                                                    (source, index) => (
                                                        <Link
                                                            key={`reference-${index}`}
                                                            href={issues.key.url(
                                                                source.key,
                                                            )}
                                                        >
                                                            <Badge
                                                                variant="secondary"
                                                                className="mr-1 flex-shrink-0 text-muted-foreground hover:text-primary"
                                                            >
                                                                {source.key} (
                                                                {(
                                                                    source.score *
                                                                    100
                                                                ).toFixed(0)}
                                                                %)
                                                            </Badge>
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    <span className="text-xs text-muted-foreground">
                                        {message.timestamp.toLocaleTimeString(
                                            'id-ID',
                                            {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            },
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-2">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gray-200 text-gray-700">
                                    <BotIcon className="h-5 w-5" />
                                </div>
                                <Card className="bg-gray-100 p-3">
                                    <div className="flex gap-1">
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0.2s]" />
                                        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 [animation-delay:0.4s]" />
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <DrawerFooter className="border-t">
                    <div className="flex w-full gap-2">
                        <Input
                            placeholder="Type your message..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button
                            onClick={sendMessage}
                            disabled={!inputValue.trim() || isLoading}
                            className="cursor-pointer bg-teal-600 hover:bg-teal-700"
                        >
                            <SendIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </DrawerFooter>
            </DrawerContent>

            <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start New Chat?</DialogTitle>
                        <DialogDescription>
                            This will delete your current conversation history.
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowConfirmation(false)}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmNewChat}
                            className="cursor-pointer"
                        >
                            Delete & Start New
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Drawer>
    );
}
