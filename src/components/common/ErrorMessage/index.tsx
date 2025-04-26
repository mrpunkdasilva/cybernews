interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex justify-center items-center min-h-[200px]">
      <div className="text-cyber-pink font-share-tech p-4 border border-cyber-pink/50 bg-cyber-black/50">
        {message}
      </div>
    </div>
  );
}