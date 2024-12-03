type MessageInputProps = {
  messageBody: string;
  setMessageBody: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

const MessageInput = ({ messageBody, setMessageBody, onSubmit }: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-2 md:p-4 border-t border-dark-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          placeholder="Message..."
          value={messageBody}
          onChange={(e) => setMessageBody(e.target.value)}
          className="flex-1 p-2 rounded-full bg-dark-4 text-light-1 text-sm md:text-base placeholder:text-light-4 focus:outline-none focus:ring-2 focus:ring-primary-500 pl-4 md:pl-6"
        />
        <button
          type="submit"
          className="p-2 text-primary-500 font-semibold hover:text-primary-600 transition-all text-sm md:text-base"
          disabled={!messageBody.trim()}
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
