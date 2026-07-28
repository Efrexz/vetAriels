interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
};

function getInitials(name: string): string {
  if (!name || !name.trim()) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name);

  return (
    <div
      className={`rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 font-display font-semibold text-primary ${sizeClasses[size]} ${className}`}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export { Avatar };
