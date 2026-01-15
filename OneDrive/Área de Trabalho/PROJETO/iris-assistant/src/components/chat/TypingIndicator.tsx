const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-iris-assistant-bubble border border-border rounded-2xl rounded-bl-md px-4 py-3 iris-shadow-sm">
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-muted-foreground iris-typing" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 rounded-full bg-muted-foreground iris-typing" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 rounded-full bg-muted-foreground iris-typing" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
