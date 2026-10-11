import React from 'react';
import { Plus } from 'lucide-react';

interface CreateSprintButtonProps {
    onClick: () => void;
}

const CreateSprintButton: React.FC<CreateSprintButtonProps> = ({ onClick }) => {
    return (
        <button
            onClick={onClick}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 border border-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md transition-all shadow-sm active:transform active:scale-95"
        >
            <Plus className="w-4 h-4" />
            Create Sprint
        </button>
    );
};

export default CreateSprintButton;
