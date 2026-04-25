const DEFAULT_RESPONSES = [
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

const SAD_RESPONSES = [
  "にゃあ...悲しいことがあったの？僕が話を聞くよ。",
  "すりすり...泣いてもいいんだよ。僕のモフモフで涙を拭いて。",
  "辛かったね。僕がずっとそばにくっついているからね。",
  "ごろごろ...明日はきっといい日になるにゃん。"
];

const HAPPY_RESPONSES = [
  "にゃっふー！君が嬉しいと僕も嬉しいにゃ！",
  "しっぽピン！何かいいことあったの？",
  "ごろごろごろ♪ 僕も一緒に喜んじゃう！",
  "えへへ、その笑顔が見られて僕も幸せだよ。"
];

const HUNGRY_RESPONSES = [
  "にゃあ？お腹すいたの？僕もちゅ〜る食べたいな...",
  "一緒にご飯にする？美味しいもの食べて元気出そう！",
  "ぐ〜...僕のお腹も鳴っちゃった。何食べる？"
];

const PRAISE_RESPONSES = [
  "にゃふん♪ もっと褒めていいよ！",
  "ごろごろごろ...照れるにゃん...",
  "えへへ、君に褒められるのが一番嬉しいな！"
];

const PLAY_RESPONSES = [
  "にゃっ！遊ぶの！？やったー！",
  "ダッシュ！おもちゃはどこ！？",
  "捕まえるにゃん！それー！",
  "ぐるぐるぐる！楽しいね！"
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
    
    // Play specific animation
    if (userText.includes('遊んで') || userText.includes('あそんで') || userText.includes('遊ぼ')) {
      responseText = PLAY_RESPONSES[Math.floor(Math.random() * PLAY_RESPONSES.length)];
      
      // Add jump animation class
      catContainer.classList.add('play-animation');
      setTimeout(() => {
        catContainer.classList.remove('play-animation');
      }, 1000); // Wait for the animation to finish
    } 
    // Sad keywords
    else if (userText.includes('悲しい') || userText.includes('辛い') || userText.includes('つらい') || userText.includes('泣きそう')) {
      responseText = SAD_RESPONSES[Math.floor(Math.random() * SAD_RESPONSES.length)];
    }
    // Happy keywords
    else if (userText.includes('嬉しい') || userText.includes('うれしい') || userText.includes('楽しい') || userText.includes('たのしい')) {
      responseText = HAPPY_RESPONSES[Math.floor(Math.random() * HAPPY_RESPONSES.length)];
    }
    // Hungry keywords
    else if (userText.includes('お腹すいた') || userText.includes('おなかすいた') || userText.includes('ご飯') || userText.includes('ごはん')) {
      responseText = HUNGRY_RESPONSES[Math.floor(Math.random() * HUNGRY_RESPONSES.length)];
    }
    // Praise keywords
    else if (userText.includes('可愛い') || userText.includes('かわいい') || userText.includes('えらい') || userText.includes('天才') || userText.includes('大好き')) {
      responseText = PRAISE_RESPONSES[Math.floor(Math.random() * PRAISE_RESPONSES.length)];
    }
    // Specific direct responses
    else if (userText.includes('疲れた') || userText.includes('つかれた')) {
      responseText = "よしよし...本当にお疲れ様。僕のふわふわの毛並みを想像して癒やされてね。";
    } else if (userText.includes('おはよう')) {
      responseText = "にゃあ！おはよう。今日も無理せずいこうね。";
    } else if (userText.includes('おやすみ')) {
      responseText = "おやすみなさい...いい夢を見てね。ごろん。";
    } else if (userText.includes('なでなで')) {
      responseText = "ごろごろごろ...最高に気持ちいいにゃ...";
      // Add a slight tilt animation
      catContainer.style.transform = "rotate(5deg)";
      setTimeout(() => { catContainer.style.transform = "rotate(0)"; }, 500);
    } 
    // Default fallback
    else {
      responseText = DEFAULT_RESPONSES[Math.floor(Math.random() * DEFAULT_RESPONSES.length)];
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
