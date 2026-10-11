import { useState, InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FloatingLabelProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
    label: string;
    id: string;
    error?: string;
    containerClassName?: string;
}

export default function FloatingLabel({
    label,
    id,
    error,
    containerClassName = '',
    value,
    onChange,
    type,
    ...inputProps
}: FloatingLabelProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const hasValue = value !== undefined && value !== '';
    const isFloating = isFocused || hasValue;
    const isPassword = type === 'password';

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className={`flex flex-col gap-2 ${containerClassName}`}>
            <div className="relative">
                <input
                    id={id}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className={`
                        w-full px-[16px] py-[10px] h-[48px] 
                        bg-white border rounded-lg 
                        transition-all text-[14px]
                        placeholder:text-transparent
                        focus:outline-hidden focus:ring-2 focus:ring-[#4F46E5]/20
                        disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
                        ${!hasValue && !isFocused && type === 'date' ? 'text-transparent' : 'text-[#374151]'}
                        ${isPassword ? 'pr-10' : ''}
                        ${error
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-[#D1D5DB] focus:border-[#4F46E5]'
                        }
                    `}
                    {...inputProps}
                />
                <label
                    htmlFor={id}
                    className={`
                        absolute left-[12px] px-[4px] bg-white
                        transition-all duration-200 pointer-events-none
                        ${isFloating
                            ? '-top-[9px] text-[11px] font-medium'
                            : 'top-[14px] text-[14px] font-normal'
                        }
                        ${error
                            ? 'text-red-500'
                            : isFocused
                                ? 'text-[#4F46E5]'
                                : 'text-[#9CA3AF]'
                        }
                    `}
                >
                    {label}
                </label>
                
                {isPassword && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                )}
            </div>
            {error && (
                <span className="text-[12px] text-red-500 font-medium ml-[4px]">
                    {error}
                </span>
            )}
        </div>
    );
}
