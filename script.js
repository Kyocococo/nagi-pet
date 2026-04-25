document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const catContainer = document.getElementById('cat-container');
  const catImage = document.getElementById('cat-image');
  const statusBadge = document.querySelector('.status-badge');

  // Handle image error fallback
  catImage.addEventListener('error', function() {
    this.src = "https://placekitten.com/200/200";
    this.style.filter = "grayscale(100%) brightness(50%)";
  });

  let isTyping = false;
  // 会話履歴を保持する配列（Gemini APIに文脈を渡すため）
  let chatHistory = [];

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
    
    // 履歴に追加（直近10往復程度を保持）
    chatHistory.push({ role: sender === 'nagi' ? 'model' : 'user', text: text });
    if (chatHistory.length > 20) {
      chatHistory.shift();
    }
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

  function triggerAnim(animName, statusText) {
    catContainer.classList.add(animName);
    if (statusText) {
      statusBadge.textContent = statusText;
    }
    
    setTimeout(() => {
      catContainer.classList.remove(animName);
      if (statusText) {
        statusBadge.textContent = "リラックス中";
      }
    }, 2000);
  }

  // 感情に応じたアニメーションとステータスをマッピング
  function handleEmotion(emotion) {
    switch(emotion) {
      case 'happy':
        triggerAnim('anim-jump', "ご機嫌♪");
        break;
      case 'sad':
        triggerAnim('anim-stretch', "寄り添い中");
        break;
      case 'hungry':
        triggerAnim('anim-swing', "はらぺこ");
        break;
      case 'praise':
        triggerAnim('anim-swing', "照れ照れ");
        break;
      case 'play':
        triggerAnim('anim-jump', "ワクワク！");
        break;
      case 'sleepy':
        triggerAnim('anim-stretch', "うとうと...");
        break;
      default:
        // normal または不明な場合は何もしないか軽くランダム
        if (Math.random() > 0.7) triggerAnim('anim-swing', "リラックス中");
        break;
    }
  }

  async function nagiRespond(userText) {
    try {
      // Vercel Serverless Function を呼び出す
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userText,
          // 現在のメッセージより前の履歴を送信（直前のユーザー入力は除く）
          history: chatHistory.slice(0, -1) 
        })
      });

      if (!response.ok) {
        let errorReply = null;
        let errorEmotion = 'sad';
        try {
          const errorData = await response.json();
          if (errorData.reply) {
            errorReply = errorData.reply;
            if (errorData.emotion) errorEmotion = errorData.emotion;
          }
        } catch (e) {}
        
        if (errorReply) {
          removeTypingIndicator();
          addMessage(errorReply, 'nagi');
          handleEmotion(errorEmotion);
          return;
        }
        throw new Error('API request failed with status ' + response.status);
      }

      const data = await response.json();
      
      removeTypingIndicator();
      addMessage(data.reply, 'nagi');
      handleEmotion(data.emotion);

    } catch (error) {
      console.error('Error fetching Nagi response:', error);
      removeTypingIndicator();
      addMessage("にゃあ...ごめんね、今はうまくお話しできないみたい。", 'nagi');
      triggerAnim('anim-stretch', "考え中...");
    }
  }

  chatInput.addEventListener('input', () => {
    sendButton.disabled = chatInput.value.trim() === '' || isTyping;
  });

  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text || isTyping) return;

    addMessage(text, 'user');
    chatInput.value = '';
    sendButton.disabled = true;
    isTyping = true;
    chatInput.disabled = true;

    showTypingIndicator();

    // AIの返答を待つ
    await nagiRespond(text);

    isTyping = false;
    chatInput.disabled = false;
    chatInput.focus();
  });

  catContainer.addEventListener('click', () => {
    if (isTyping) return;
    isTyping = true;
    chatInput.disabled = true;
    sendButton.disabled = true;
    
    triggerAnim('anim-swing', "喜んでる");
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

  function setTimeBasedTheme() {
    const hour = new Date().getHours();
    let theme = 'night'; // default

    if (hour >= 6 && hour < 16) {
      theme = 'morning';
    } else if (hour >= 16 && hour < 19) {
      theme = 'afternoon';
    }

    document.body.setAttribute('data-theme', theme);
  }

  // Set theme on load
  setTimeBasedTheme();

  // Initial message
  addMessage("にゃーん。おかえり。今日もお疲れ様。何かあったらお話聞くよ。", 'nagi');
});
