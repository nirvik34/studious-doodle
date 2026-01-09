"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { getVoiceCommandSystem, getDefaultVoiceCommands } from "@/lib/voice-commands";
import { useRouter } from "next/navigation";

export default function VoiceCommandButton() {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const voiceSystem = getVoiceCommandSystem();
        setIsSupported(voiceSystem.isSupported());

        if (voiceSystem.isSupported()) {
            // Register default commands
            const commands = getDefaultVoiceCommands(router);
            voiceSystem.registerCommands(commands);
        }
    }, [router]);

    const handleToggleVoice = async () => {
        const voiceSystem = getVoiceCommandSystem();

        if (!voiceSystem.isSupported()) {
            toast.error("Voice commands not supported in this browser");
            return;
        }

        if (isListening) {
            voiceSystem.stop();
            setIsListening(false);
            toast.info("Voice commands disabled");
        } else {
            await voiceSystem.start();
            setIsListening(true);
            toast.success("Voice commands enabled! Try saying 'find hospital' or 'emergency'");
            
            // Speak instructions
            voiceSystem.speak("Voice commands activated. Say a command or say help for options.");
        }
    };

    if (!isSupported) {
        return null; // Don't show button if not supported
    }

    return (
        <Button
            variant={isListening ? "default" : "outline"}
            size="icon"
            onClick={handleToggleVoice}
            className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 ${
                isListening ? "bg-red-500 hover:bg-red-600 animate-pulse" : ""
            }`}
            title={isListening ? "Stop Voice Commands" : "Start Voice Commands"}
        >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>
    );
}
