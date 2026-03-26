interface ProgressBarProps {
  value: number;
  height?: string;
  trackClass?: string;
  barClass?: string;
}

export default function ProgressBar({
  value,
  height = 'h-1.5',
  trackClass = 'bg-surface-container-high',
  barClass = 'bg-primary',
}: ProgressBarProps) {
  return (
    <div className={`w-full ${trackClass} rounded-full overflow-hidden ${height}`}>
      <div
        className={`h-full ${barClass} rounded-full transition-all duration-700`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
