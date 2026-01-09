import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
    level: 'LOW' | 'MEDIUM' | 'HIGH';
    className?: string;
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
    const colors = {
        LOW: "bg-medical-green text-white hover:bg-medical-green/90",
        MEDIUM: "bg-medical-amber text-white hover:bg-medical-amber/90",
        HIGH: "bg-medical-red text-white hover:bg-medical-red/90",
    };

    return (
        <Badge className={cn(colors[level], className)}>
            {level} RISK
        </Badge>
    );
}
