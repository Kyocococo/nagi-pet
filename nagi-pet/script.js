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

document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const catContainer = document.getElementById('cat-container');
  const catImage = document.getElementById('cat-image');

  // Handle image error fallback
  catImage.addEventListener('error', function() {
    this.src = "https://placekitten.com/200/200";
    this.style.filter = "grayscale(100%) brightness(50%)";
  });

  let isTyping = false;

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    `;
    chatMessages.appendChild(indicator);
    scrollToBottom();
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  function nagiRespond(userText) {
    let responseText = "";
    
    // Simple rule-based keywords
    if (userText.includes('疲れた') || userText.includes('つかれた')) {
      responseText = "よしよし...本当にお疲れ様。僕のふわふわの毛並みを想像して癒やされてね。";
    } else if (userText.includes('おはよう')) {
      responseText = "にゃあ！おはよう。今日も無理せずいこうね。";
    } else if (userText.includes('おやすみ')) {
      responseText = "おやすみなさい...いい夢を見てね。ごろん。";
    } else if (userText.includes('可愛い') || userText.includes('かわいい')) {
      responseText = "にゃふん♪ 嬉しいな。もっと撫でていいよ。";
    } else if (userText.includes('なでなで')) {
      responseText = "ごろごろごろ...最高に気持ちいいにゃ...";
    } else {
      responseText = NAGI_RESPONSES[Math.floor(Math.random() * NAGI_RESPONSES.length)];
    }

    addMessage(responseText, 'nagi');
  }

  chatInput.addEventListener('input', () => {
    sendButton.disabled = chatInput.value.trim() === '' || isTyping;
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || isTyping) return;

    addMessage(text, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    isTyping = true;
    chatInput.disabled = true;

    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      nagiRespond(text);
      isTyping = false;
      chatInput.disabled = false;
      chatInput.focus();
    }, 1500 + Math.random() * 1000);
  });

  catContainer.addEventListener('click', () => {
    if (isTyping) return;
    isTyping = true;
    chatInput.disabled = true;
    sendButton.disabled = true;
    
    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      addMessage("ごろごろごろ...（撫でられて喜んでいる）", 'nagi');
      isTyping = false;
      chatInput.disabled = false;
      if (chatInput.value.trim() !== '') {
        sendButton.disabled = false;
      }
    }, 800);
  });

  // Initial message
  addMessage("にゃーん。おかえり。今日もお疲れ様。何かあったらお話聞くよ。", 'nagi');
});
