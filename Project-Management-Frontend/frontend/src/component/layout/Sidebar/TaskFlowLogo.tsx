import { Hexagon } from 'lucide-react';

interface TaskFlowLogoProps {
    className?: string;
}

const TaskFlowLogo = ({ className }: TaskFlowLogoProps) => {
    return (
        <Hexagon
            className={`text-indigo-600 fill-indigo-600 ${className || ''}`}
        />
    );
};

export default TaskFlowLogo;
