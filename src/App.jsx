import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const NAGI_RESPONSES = [
  "にゃーん...お疲れ様。無理しないでね。",
  "ごろごろ...僕がそばにいるよ。",
  "今日も一日頑張ったね。えらいえらい。",
  "すりすり...少し休んだらどうかな？",
  "ふわぁ...眠くなってきた？一緒に寝ようか。",
  "いつも見守ってるからね。",
  "にゃあ。あったかいお茶でも飲んで、リラックスしてね。",
  "しっぽをゆらゆら...僕を撫でていいよ。",
  "大丈夫、君のペースで進めばいいんだよ。",
  "ごろん...たまには何も考えない時間も大切だよ。"
];

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: "にゃーん。おかえり。今日もお疲れ様。何かあったらお話聞くよ。", sender: 'nagi' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: inputValue.trim(), sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Nagi thinking and responding
    setTimeout(() => {
      let responseText = "";
      const input = userMsg.text;
      
      // Simple rule-based keywords
      if (input.includes('疲れた') || input.includes('つかれた')) {
        responseText = "よしよし...本当にお疲れ様。僕のふわふわの毛並みを想像して癒やされてね。";
      } else if (input.includes('おはよう')) {
        responseText = "にゃあ！おはよう。今日も無理せずいこうね。";
      } else if (input.includes('おやすみ')) {
        responseText = "おやすみなさい...いい夢を見てね。ごろん。";
      } else if (input.includes('可愛い') || input.includes('かわいい')) {
        responseText = "にゃふん♪ 嬉しいな。もっと撫でていいよ。";
      } else if (input.includes('なでなで')) {
        responseText = "ごろごろごろ...最高に気持ちいいにゃ...";
      } else {
        responseText = NAGI_RESPONSES[Math.floor(Math.random() * NAGI_RESPONSES.length)];
      }

      setMessages(prev => [...prev, { id: Date.now(), text: responseText, sender: 'nagi' }]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  // We are referencing the image from the artifact directory temporarily, 
  // but instructing the user to copy it to public/nagi.png
  const imageSrc = "nagi.png";

  return (
    <div className="app-container">
      <div className="moon"></div>
      <div className="stars"></div>
      
      <div className="pet-display">
        <div className="cat-image-container" onClick={() => {
          setIsTyping(true);
          setTimeout(() => {
            setMessages(prev => [...prev, { id: Date.now(), text: "ごろごろごろ...（撫でられて喜んでいる）", sender: 'nagi' }]);
            setIsTyping(false);
          }, 800);
        }}>
          <img 
            src={imageSrc} 
            alt="凪くん" 
            className="cat-image" 
            onError={(e) => {
              // Fallback if image isn't copied yet
              e.target.src = "https://placekitten.com/200/200"; 
              e.target.style.filter = "grayscale(100%) brightness(50%)"; // make it look like a black cat
            }}
          />
          <div className="status-badge">リラックス中</div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {isTyping && (
            <div className="message nagi">
              <div className="typing-indicator">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSend}>
          <input
            type="text"
            className="chat-input"
            placeholder="凪くんに話しかける..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isTyping}
          />
          <button 
            type="submit" 
            className="send-button" 
            disabled={!inputValue.trim() || isTyping}
            aria-label="送信"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
