interface TagBadgeProps {
  tag: string;
  onClick?: () => void;
  active?: boolean;
}

export default function TagBadge({ tag, onClick, active }: TagBadgeProps) {
  const base = 'px-2 py-0.5 rounded-full text-xs font-medium transition-colors';
  const style = active
    ? 'bg-indigo-600 text-white'
    : onClick
    ? 'bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 cursor-pointer'
    : 'bg-gray-100 text-gray-600';

  return (
    <span className={`${base} ${style}`} onClick={onClick}>
      {tag}
    </span>
  );
}
