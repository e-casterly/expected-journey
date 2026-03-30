type ErrorListProps = {
  messages?: string[] | string;
  errorId?: string;
};

export function ErrorList({ messages, errorId }: ErrorListProps) {
  if (!messages || !messages.length) return null;
  if (typeof messages === "string") messages = [messages];
  return (
    <div id={errorId}>
      {messages.map((message, i) => (
        <p key={i} className="text-xs text-red-600">
          {message}
        </p>
      ))}
    </div>
  );
}