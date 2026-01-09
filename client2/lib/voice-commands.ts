// Voice Commands using Web Speech API

export interface VoiceCommand {
    command: string;
    action: () => void;
    description: string;
}

export class VoiceCommandSystem {
    private recognition: any = null;
    private isListening: boolean = false;
    private commands: VoiceCommand[] = [];

    constructor() {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.lang = 'en-US';
                this.setupRecognition();
            }
        }
    }

    private setupRecognition(): void {
        if (!this.recognition) return;

        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript.toLowerCase().trim();
            console.log('Voice command:', transcript);
            this.processCommand(transcript);
        };

        this.recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                this.recognition.start(); // Restart if still listening
            }
        };
    }

    private processCommand(transcript: string): void {
        for (const cmd of this.commands) {
            if (transcript.includes(cmd.command.toLowerCase())) {
                cmd.action();
                this.speak(`${cmd.description}`);
                return;
            }
        }

        // No command matched
        this.speak("Sorry, I didn't understand that command.");
    }

    registerCommand(command: VoiceCommand): void {
        this.commands.push(command);
    }

    registerCommands(commands: VoiceCommand[]): void {
        this.commands.push(...commands);
    }

    start(): void {
        if (!this.recognition) {
            console.error('Speech recognition not supported');
            return;
        }

        if (!this.isListening) {
            this.isListening = true;
            this.recognition.start();
            console.log('Voice commands activated');
        }
    }

    stop(): void {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            this.recognition.stop();
            console.log('Voice commands deactivated');
        }
    }

    isActive(): boolean {
        return this.isListening;
    }

    speak(text: string): void {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;
            window.speechSynthesis.speak(utterance);
        }
    }

    isSupported(): boolean {
        return this.recognition !== null;
    }
}

// Pre-defined commands for the app
export const getDefaultVoiceCommands = (router: any): VoiceCommand[] => [
    {
        command: 'find hospital',
        action: () => router.push('/hospitals'),
        description: 'Opening nearby hospitals',
    },
    {
        command: 'nearest hospital',
        action: () => router.push('/hospitals'),
        description: 'Finding nearest hospital',
    },
    {
        command: 'emergency',
        action: () => {
            if (typeof window !== 'undefined') {
                window.location.href = 'tel:911';
            }
        },
        description: 'Calling emergency services',
    },
    {
        command: 'call ambulance',
        action: () => {
            if (typeof window !== 'undefined') {
                window.location.href = 'tel:911';
            }
        },
        description: 'Calling ambulance',
    },
    {
        command: 'scan face',
        action: () => router.push('/scan'),
        description: 'Opening face scanner',
    },
    {
        command: 'check symptoms',
        action: () => router.push('/emergency'),
        description: 'Opening symptom checker',
    },
    {
        command: 'my profile',
        action: () => router.push('/profile'),
        description: 'Opening your profile',
    },
    {
        command: 'dashboard',
        action: () => router.push('/dashboard'),
        description: 'Opening dashboard',
    },
    {
        command: 'go home',
        action: () => router.push('/'),
        description: 'Going to home page',
    },
];

// Singleton instance
let voiceCommandInstance: VoiceCommandSystem | null = null;

export const getVoiceCommandSystem = (): VoiceCommandSystem => {
    if (!voiceCommandInstance) {
        voiceCommandInstance = new VoiceCommandSystem();
    }
    return voiceCommandInstance;
};
