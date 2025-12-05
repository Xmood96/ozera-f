interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export default function LoadingSpinner({ size = 'lg', message }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`loading loading-spinner ${sizeClasses[size]} text-primary`} />
      {message && (
        <p className="text-base-content opacity-75 text-sm">
          {message}
        </p>
      )}
    </div>
  );
}