(function () {
  // Suppression des constantes API exposées
  // const API_KEY = '...'; // Supprimé
  // const API_URL = '...';  // Supprimé

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }

  function initChatbot() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        overflow-wrap: break-word;
        word-wrap: break-word;
        word-break: break-word;
      }
      .title {
        margin: auto;
        font-size: x-large;
        font-family: Raleway, sans-serif;
        color: #ee3b45;
      }
      @media (min-width: 450px) {
        .main-card {
          width: 96%;
          max-width: 400px;
          height: calc(100% - 32px) !important;
          border-radius: 20px !important;
          max-height: 600px;
          margin: 16px !important;
        }
      }
      .collapsed {
        width: 70px !important;
        height: 70px !important;
        border-radius: 24px !important;
        margin: 16px !important;
      }
      .main-card {
        background: white;
        color: white;
        margin: auto;
        width: 95%;
        height: 95%;
        margin: 10px;
        display: flex;
        border-radius: 25px;
        flex-direction: column;
        overflow: hidden;
        right: 0;
        bottom: 0;
        position: fixed;
        transition: all 0.5s;
        box-shadow: 0 10px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
      }
      #chatbot_toggle {
        position: absolute;
        right: 0;
        border: none;
        height: 70px;
        width: 70px;
        background: #ee3b45;
        padding: 14px;
        color: white;
      }
      #chatbot_toggle:hover {
        height: 69.99px;
        background: ${getDarkerColor('#ee3b45')};
      }
      .line {
        height: 1px;
        background-color: #ee3b45;
        width: 100%;
        opacity: 0.2;
      }
      .main-title {
        background-color: #ee3b45;
        font-size: 16px;
        font-weight: 600;
        display: flex;
        height: 70px;
        align-items: center;
      }
      .main-title > div {
        height: 70px;
        width: 70px;
        display: flex;
        margin-left: 8px;
      }
      .main-title img {
        height: 24px;
        margin: auto;
        border-radius: 50%;
      }
      .main-title > span {
        color:#fff;
        margin: auto auto auto 1px;
      }
      .chat-area {
        flex-grow: 1;
        overflow: auto;
        border-radius: 8px;
        padding: 16px;
        display: flex;
        flex-direction: column;
      }
      .file-tag {
        display: inline-block;
        background: #e0e0e0;
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 0.9em;
        font-family: monospace;
        margin: 2px 0;
      }
      .file-preview {
        background: #f0f0f0;
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 13px;
        color: #555;
        margin: 0 10px 8px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        max-width: calc(100% - 20px);
        word-break: break-word;
      }
      .file-preview .remove {
        cursor: pointer;
        font-weight: bold;
        color: #888;
        margin-left: 6px;
      }
      .file-preview .remove:hover {
        color: #d00;
      }
      .input-div {
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        padding: 8px 10px;
        background: #f5f5f5;
        border-radius: 30px;
        margin: 0 10px 10px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        position: relative;
      }
      .input-message {
        flex-grow: 1;
        min-width: 60px;
        padding: 10px 14px;
        border-radius: 30px;
        border: 1px solid #ddd;
        font-size: 14px;
        word-break: break-word;
      }
      .input-send {
        width: 40px;
        height: 40px;
        margin-left: 8px;
        border-radius: 50%;
        border: none;
        background-color: #ee3b45;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      .input-send svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      @media (max-width: 450px) {
        .input-message {
          font-size: 14px;
          padding: 8px 12px;
        }
        .input-send {
          width: 36px;
          height: 36px;
        }
        .file-attach {
          width: 36px;
          height: 36px;
          font-size: 18px;
        }
        .overall {
          width: 100%;
          min-height: 100vh;
          padding: 16px;
          box-sizing: border-box;
          background-color: #000000b8;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
        }
      }
      .input-message:focus {
        outline: none;
        border-color: #ee3b45;
        box-shadow: 0 0 5px rgba(238,59,69,0.3);
      }
      .input-send:hover {
        background-color: ${getLighterColor('#ee3b45')};
        transform: scale(1.1);
      }
      .chat-message-div {
        display: flex;
        align-items: flex-start;
        margin-bottom: 8px;
      }
      .chat-message-sent {
        background-color: #d3d3d3;
        margin: 8px 16px 8px 64px;
        padding: 12px 16px;
        animation: fadeIn 100ms ease-in;
        color: black;
        border-radius: 8px 8px 2px 8px;
        max-width: 80%;
        word-break: break-word;
        overflow-wrap: break-word;
      }
      .chat-message-received {
        background-color: #F0F0F0;
        margin: 8px 16px 8px 16px;
        padding: 12px 16px;
        animation: fadeIn 100ms ease-in;
        color: black;
        border-radius: 8px 8px 8px 2px;
        display: flex;
        align-items: flex-start;
        gap: 12px;
        max-width: 80%;
      }
      .chat-message-received img {
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin-top: 2px;
        border-radius: 50%;
      }
      .chat-message-content {
        flex: 1;
        line-height: 1.4;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }
      .file-attach {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #eaeaea;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
        font-size: 20px;
        cursor: pointer;
        transition: background 0.2s;
        position: relative;
      }
      .file-attach:hover {
        background: #ddd;
      }
      .file-tooltip {
        position: absolute;
        bottom: 100%;
        left: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        padding: 8px;
        z-index: 1000;
        display: none;
        flex-direction: column;
        width: 180px;
        margin-bottom: 8px;
      }
      .file-tooltip.show {
        display: flex;
      }
      .file-tooltip button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border: none;
        background: none;
        text-align: left;
        width: 100%;
        border-radius: 8px;
        font-size: 14px;
        color: #333;
        margin: 0;
      }
      .file-tooltip button:hover {
        background: #f0f0f0;
      }
      .file-tooltip button svg {
        width: 18px;
        height: 18px;
        fill: #666;
      }
      .camera-preview {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 1001;
        display: none;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .camera-preview video {
        max-width: 90%;
        max-height: 70%;
        border-radius: 8px;
      }
      .camera-controls {
        display: flex;
        gap: 12px;
        margin-top: 20px;
      }
      .camera-controls button {
        padding: 10px 20px;
        border-radius: 20px;
        border: none;
        font-weight: bold;
        cursor: pointer;
      }
      .capture-btn {
        background: #ee3b45;
        color: white;
      }
      .cancel-btn {
        background: #666;
        color: white;
      }
      .sent-image {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        margin-top: 8px;
      }
      .sent-file {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #e9e9e9;
        padding: 6px 10px;
        border-radius: 16px;
        margin-top: 8px;
      }
      .condition-buttons {
        display: flex;
        gap: 10px;
        margin: 0 10px 10px;
      }
      .condition-btn {
        flex: 1;
        padding: 12px 16px;
        border-radius: 20px;
        border: 2px solid #ee3b45;
        background: white;
        color: #ee3b45;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s;
      }
      .condition-btn:hover {
        background: #ee3b45;
        color: white;
      }
      .cancel-condition-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #666;
        background: white;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-left: 8px;
      }
      .cancel-condition-btn:hover {
        background: #666;
        color: white;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes blink {
        0%, 100% { opacity: 0.2; }
        50% { opacity: 1; }
      }
      .thinking-dots span {
        animation: blink 1.4s infinite;
        display: inline-block;
        width: 8px;
        height: 8px;
        background: #888;
        border-radius: 50%;
        margin: 0 2px;
      }
      .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
      .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
      ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
    `;
    document.head.appendChild(style);

    function getDarkerColor(hex) {
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      r = Math.max(0, r - 40);
      g = Math.max(0, g - 40);
      b = Math.max(0, b - 40);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    function getLighterColor(hex) {
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      r = Math.min(255, r + 30);
      g = Math.min(255, g + 30);
      b = Math.min(255, b + 30);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    const chatbot = document.createElement('div');
    chatbot.id = 'chatbot';
    chatbot.className = 'main-card collapsed';

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'chatbot_toggle';
    toggleBtn.innerHTML = `
      <img src="img/chatbot.png" alt="Chatbot" style="width:40px;height:40px;border-radius:50%">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style="display:none; height:20px">
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
      </svg>
    `;

    const titleDiv = document.createElement('div');
    titleDiv.className = 'main-title';
    titleDiv.innerHTML = `
      <div>
        <img src="img/logo-chat.png" alt="EQDOM Logo" style="width:32px;height:32px;border-radius:50%;border: 5px solid #fff">
      </div>
      <span>EQDOM</span>
    `;

    const chatArea = document.createElement('div');
    chatArea.id = 'message-box';
    chatArea.className = 'chat-area';

    const filePreview = document.createElement('div');
    filePreview.id = 'file-preview';
    filePreview.className = 'file-preview';
    filePreview.style.display = 'none';

    const conditionButtons = document.createElement('div');
    conditionButtons.id = 'condition-buttons';
    conditionButtons.className = 'condition-buttons';
    conditionButtons.style.display = 'none';
    conditionButtons.innerHTML = `
      <button class="condition-btn" data-condition="neuf">Neuf</button>
      <button class="condition-btn" data-condition="occasion">Occasion</button>
      <button class="cancel-condition-btn" id="cancel-condition-btn">×</button>
    `;

    const inputDiv = document.createElement('div');
inputDiv.className = 'input-div';
inputDiv.innerHTML = `
  <div class="file-attach" title="Joindre une image">
  <svg style="width:20px; color:#666" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
    <div class="file-tooltip">
      <button id="attach-image-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
        Joindre une image
      </button>
      <button id="take-photo-btn">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6-1.8C18 6.57 15.35 4 12 4s-6 2.57-6 6.2c0 2.34 1.95 5.44 6 9.14 4.05-3.7 6-6.8 6-9.14zM12 2c4.2 0 8 3.22 8 8.2 0 3.32-2.67 7.25-8 11.8-5.33-4.55-8-8.48-8-11.8C4 5.22 7.8 2 12 2z"/>
        </svg>
        Prendre une photo
      </button>
    </div>
  </div>
  <input id="file-upload" type="file" style="display: none;" />
  <input id="image-upload" type="file" accept="image/*" style="display: none;" />
  <input class="input-message" name="message" type="text" id="message" placeholder="Tapez votre message ..." />
  <button class="input-send">
    <svg style="width:24px;height:24px"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" /></svg>
  </button>
  <div class="camera-preview" id="camera-preview">
    <video id="camera-video" autoplay playsinline></video>
    <canvas id="camera-canvas" style="display:none"></canvas>
    <div class="camera-controls">
      <button class="rotate-btn" id="rotate-camera-btn">🔄</button>
      <button class="capture-btn" id="capture-btn">Prendre la photo</button>
      <button class="cancel-btn" id="cancel-camera-btn">Annuler</button>
    </div>
  </div>
`;

    chatbot.appendChild(toggleBtn);
    chatbot.appendChild(titleDiv);
    chatbot.appendChild(chatArea);
    chatbot.appendChild(filePreview);
    chatbot.appendChild(conditionButtons);
    chatbot.appendChild(inputDiv);
    document.body.appendChild(chatbot);

    let running = false;
    let firstOpen = true;
    const messagesHistory = [];
    let thinkingElement = null;
    let currentFile = null;
    let isImageSelected = false;

    const fileInput = document.getElementById('file-upload');
    const imageInput = document.getElementById('image-upload');
    const previewEl = document.getElementById('file-preview');
    const fileAttachBtn = document.querySelector('.file-attach');
    const fileTooltip = document.querySelector('.file-tooltip');
    const attachFileBtn = document.getElementById('attach-file-btn');
    const attachImageBtn = document.getElementById('attach-image-btn');
    const takePhotoBtn = document.getElementById('take-photo-btn');
    const cameraPreview = document.getElementById('camera-preview');
    const cameraVideo = document.getElementById('camera-video');
    const cameraCanvas = document.getElementById('camera-canvas');
    const captureBtn = document.getElementById('capture-btn');
    const cancelCameraBtn = document.getElementById('cancel-camera-btn');
    const conditionButtonsEl = document.getElementById('condition-buttons');
    const messageInput = document.getElementById('message');
    const inputDivEl = document.querySelector('.input-div');

    function showConditionButtons() {
      inputDivEl.style.display = 'none';
      conditionButtonsEl.style.display = 'flex';
      isImageSelected = true;
    }

    function hideConditionButtons() {
      inputDivEl.style.display = 'flex';
      conditionButtonsEl.style.display = 'none';
      isImageSelected = false;
      removeFile();
    }

    fileAttachBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      fileTooltip.classList.toggle('show');
    });

    document.addEventListener('click', function() {
      fileTooltip.classList.remove('show');
    });

    // attachFileBtn.addEventListener('click', function() {
    //   fileInput.click();
    //   fileTooltip.classList.remove('show');
    // });

    attachImageBtn.addEventListener('click', function() {
      imageInput.click();
      fileTooltip.classList.remove('show');
    });

    takePhotoBtn.addEventListener('click', function() {
      startCamera();
      fileTooltip.classList.remove('show');
    });

    fileInput.addEventListener('change', function(e) {
  if (e.target.files.length > 0) {
    currentFile = e.target.files[0];
    // Traiter les fichiers comme des images
    previewEl.innerHTML = ` Image jointe : <strong>${currentFile.name}</strong> <span class="remove" onclick="removeFile()">×</span>`;
    previewEl.style.display = 'inline-flex';
    showConditionButtons();
  }
});

    imageInput.addEventListener('change', function(e) {
      if (e.target.files.length > 0) {
        currentFile = e.target.files[0];
        previewEl.innerHTML = `🖼️ Image jointe : <strong>${currentFile.name}</strong> <span class="remove" onclick="removeFile()">×</span>`;
        previewEl.style.display = 'inline-flex';
        showConditionButtons();
      }
    });

    document.querySelectorAll('.condition-btn').forEach(button => {
      button.addEventListener('click', function() {
        const condition = this.getAttribute('data-condition');
        let conditionText = '';
        
        if (condition === 'neuf') {
          conditionText = "Je voudrais connaître le PRIX de cette VOITURE si elle est NEUVE :";
        } else if (condition === 'occasion') {
          conditionText = "Je voudrais connaître le PRIX de cette VOITURE si elle est D'OCCASION :";
        }
        
        // Envoyer le message avec la condition sélectionnée
        sendWithCondition(conditionText);
      });
    });

    document.getElementById('cancel-condition-btn').addEventListener('click', function() {
      hideConditionButtons();
    });

    let currentStream = null;
    let facingMode = 'user';

    function startCamera() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints = { video: { facingMode: facingMode } };
        navigator.mediaDevices.getUserMedia(constraints)
          .then(function(stream) {
            currentStream = stream;
            cameraVideo.srcObject = stream;
            cameraPreview.style.display = 'flex';
          })
          .catch(function(error) {
            console.error("Erreur d'accès à la caméra:", error);
            alert("Impossible d'accéder à la caméra. Vérifiez les permissions.");
          });
      } else {
        alert("Votre navigateur ne supporte pas l'accès à la caméra.");
      }
    }

    document.getElementById('rotate-camera-btn').addEventListener('click', function() {
      if (currentStream) {
        const tracks = currentStream.getTracks();
        tracks.forEach(track => track.stop());
      }
      facingMode = facingMode === 'user' ? 'environment' : 'user';
      startCamera();
    });

    captureBtn.addEventListener('click', function() {
      const context = cameraCanvas.getContext('2d');
      cameraCanvas.width = cameraVideo.videoWidth;
      cameraCanvas.height = cameraVideo.videoHeight;
      context.drawImage(cameraVideo, 0, 0, cameraCanvas.width, cameraCanvas.height);
      cameraCanvas.toBlob(function(blob) {
        currentFile = new File([blob], "photo.jpg", { type: "image/jpeg" });
        previewEl.innerHTML = `📸 Photo prise : <strong>photo.jpg</strong> <span class="remove" onclick="removeFile()">×</span>`;
        previewEl.style.display = 'inline-flex';
        showConditionButtons();
        const stream = cameraVideo.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
        cameraPreview.style.display = 'none';
      }, 'image/jpeg', 0.9);
    });

    cancelCameraBtn.addEventListener('click', function() {
      const stream = cameraVideo.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
      cameraPreview.style.display = 'none';
    });

    window.removeFile = function() {
      currentFile = null;
      fileInput.value = '';
      imageInput.value = '';
      previewEl.style.display = 'none';
      if (isImageSelected) {
        hideConditionButtons();
      }
    };

    function showThinking() {
      thinkingElement = document.createElement('div');
      thinkingElement.className = 'chat-message-div';
      thinkingElement.innerHTML = `
        <div class="chat-message-received">
          <img src="img/logo-chat.png" alt="EQDOM">
          <div class="chat-message-content">
            <div class="thinking-dots"><span></span><span></span><span></span></div>
          </div>
        </div>
      `;
      chatArea.appendChild(thinkingElement);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    function hideThinking() {
      if (thinkingElement) {
        thinkingElement.remove();
        thinkingElement = null;
      }
    }

    function fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    }

    // Fonction générique pour appeler le backend
   async function callBackendAPI(prompt, base64Image = null) {
  try {
    let endpoint, payload, headers = {};

    if (base64Image) {
      // Appel à /api/analyze-car avec image + condition via FormData
      const condition = prompt.includes("NEUVE") ? "new" : "used";
      endpoint = 'https://chatbot-back-production-a419.up.railway.app/api/analyze-car';

      // On construit un FormData pour envoyer l'image comme fichier
      const formData = new FormData();
      formData.append('condition', condition);

      // On reconstruit le fichier à partir du base64
      const byteCharacters = atob(base64Image.split(',')[1]);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: 'image/jpeg' });
      formData.append('files', blob, 'image.jpg');

      payload = formData;
      // Ne pas définir 'Content-Type' ici, le navigateur le fait automatiquement avec multipart/form-data
    } else {
      // Appel à /api/chat pour message texte seul
      endpoint = 'https://chatbot-back-production-a419.up.railway.app/api/chat';
      payload = JSON.stringify({ prompt });
      headers = { 'Content-Type': 'application/json' };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: payload
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur serveur :", errorText);
      throw new Error(`Erreur ${response.status}`);
    }

    const data = await response.json();
    console.log("Réponse brute du serveur:", data); // 🔥 Toujours utile

    // ✅ Générer un message formaté à partir de la réponse du serveur
    if (data.price_estimate) {
      const { min, max, currency } = data.price_estimate;
      const detected = data.detected;
      const make = detected?.make || "inconnue";
      const model = detected?.model || "inconnue";
      const conditionText = data.condition === "new" ? "NEUVE" : "D'OCCASION";
      const basis = data.price_estimate.basis || "sur la base des tendances actuelles";
      const confidence = Math.round(data.price_estimate.confidence * 100);

      return `Voici l'estimation du prix pour une voiture ${conditionText} :<br>
      <strong>Marque</strong> : ${make}<br>
      <strong>Modèle</strong> : ${model}<br>
      <strong>Prix estimé</strong> : ${min} - ${max} ${currency}<br>
      <strong>Base de l'estimation</strong> : ${basis}<br>
      <strong>Confiance</strong> : ${confidence}%<br>`;
    }

    // Si ce n’est pas une estimation de prix, on tente d'autres champs
    const reply = data.reply || data.message || data.response || data.text || data.content || "Pas de réponse";

    return reply;
  } catch (error) {
    console.error("Erreur backend :", error);
    return "Erreur de communication avec l'assistant.";
  }
}

    function escapeHtml(text) {
      const map = { '&': '&amp;', '<': '<', '>': '>', '"': '&quot;', "'": '&#039;' };
      return text.replace(/[&<>"']/g, m => map[m]);
    }

    function formatAIResponse(text) {
      if (typeof text !== 'string') return '';
      
      let safeText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      safeText = safeText.replace(/\n/g, '<br>');
      safeText = safeText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      safeText = safeText.replace(/\*(?!\*)(.*?)\*/g, '<em>$1</em>');
      safeText = safeText.replace(/^\- (.*?)$/gm, '<li>$1</li>');
      
      if (safeText.includes('<li>')) {
        safeText = safeText.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
      }

      safeText = safeText.replace(/^### (.*?)$/gm, '<h3 style="margin: 16px 0 8px 0; font-size: 1.2em; color: #333;">$1</h3>');

      const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
      safeText = safeText.replace(urlRegex, match => {
        const href = match.replace(/"/g, '%22');
        return `<a href="${href}" target="_blank" rel="noopener noreferrer" style="color: #ee3b45; text-decoration: underline;">${match}</a>`;
      });

      return safeText;
    }

    function addMsg(msg, isUser = true, fileData = null) {
  const div = document.createElement('div');
  div.className = 'chat-message-div';
  if (isUser) {
    let html = '';
    
    // Afficher le texte seulement s'il n'est pas vide
    if (msg && msg.trim() !== '') {
      html = escapeHtml(msg);
    }
    
    if (fileData) {
      // Ajouter un saut de ligne seulement s'il y a du texte avant
      if (html !== '') {
        html += '<br>';
      }
      
      if (fileData.type.startsWith('image/')) {
        html += `<img src="${fileData.url}" class="sent-image" alt="Image jointe">`;
      } else {
        html += `<div class="sent-file">📄 ${escapeHtml(fileData.name)}</div>`;
      }
    }
    
    // Si ni texte ni fichier, afficher un message par défaut
    if (html === '' && !fileData) {
      html = 'Message vide';
    }
    
    div.innerHTML = `<span style='flex-grow:1'></span><div class='chat-message-sent'>${html}</div>`;
  } else {
    const formattedMsg = formatAIResponse(msg);
    div.innerHTML = `
      <div class="chat-message-received">
        <img src="img/logo-chat.png" alt="EQDOM">
        <div class="chat-message-content">${formattedMsg}</div>
      </div>
    `;
  }
  chatArea.appendChild(div);
  chatArea.scrollTop = chatArea.scrollHeight;
}

    async function sendWithCondition(conditionText) {
      if (running) return;
      
      running = true;

      let fileData = null;
      let base64Image = null;
      if (currentFile) {
        try {
          base64Image = await fileToBase64(currentFile);
          fileData = {
            name: currentFile.name,
            type: currentFile.type,
            url: base64Image
          };
        } catch (err) {
          console.error("Erreur lecture fichier", err);
        }
      }

      // addMsg(conditionText, true, fileData);
      if (fileData) {
    addMsg("", true, fileData);
  }

      // Réinitialiser l'interface
      hideConditionButtons();
      previewEl.style.display = 'none';
      currentFile = null;
      fileInput.value = '';
      imageInput.value = '';

      try {
        const apiPrompt = conditionText; // On envoie le texte de condition
        messagesHistory.push({ role: 'user', content: apiPrompt });
        showThinking();
        const responseText = await callBackendAPI(apiPrompt, base64Image);
        hideThinking();
        addMsg(responseText, false);
        messagesHistory.push({ role: 'assistant', content: responseText });
      } catch (error) {
        hideThinking();
        addMsg("Erreur de connexion à l'assistant. Veuillez réessayer.", false);
        console.error(error);
      } finally {
        running = false;
      }
    }

    async function send() {
      if (running) return;
      const textMsg = messageInput.value.trim();
      const hasFile = currentFile !== null;
      if (!textMsg && !hasFile) return;

      running = true;

      let fileData = null;
      let base64Image = null;
      if (hasFile) {
        try {
          base64Image = await fileToBase64(currentFile);
          fileData = {
            name: currentFile.name,
            type: currentFile.type,
            url: base64Image
          };
        } catch (err) {
          console.error("Erreur lecture fichier", err);
        }
      }

      addMsg(textMsg || "Fichier joint", true, fileData);
      messageInput.value = '';
      
      if (currentFile) {
        previewEl.style.display = 'none';
        currentFile = null;
        fileInput.value = '';
        imageInput.value = '';
      }

      try {
        const apiPrompt = textMsg || "Analyse le fichier joint.";
        messagesHistory.push({ role: 'user', content: apiPrompt });
        showThinking();
        const responseText = await callBackendAPI(apiPrompt, base64Image);
        hideThinking();
        addMsg(responseText, false);
        messagesHistory.push({ role: 'assistant', content: responseText });
      } catch (error) {
        hideThinking();
        addMsg("Erreur de connexion à l'assistant. Veuillez réessayer.", false);
        console.error(error);
      } finally {
        running = false;
      }
    }

    function addWelcomeMessage() {
      addMsg("Bonjour ! Je suis votre assistant Eqdom. Comment puis-je vous aider aujourd'hui ?", false);
    }

    messageInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        send();
      }
    });

    document.querySelector('.input-send').addEventListener('click', send);

    toggleBtn.addEventListener('click', () => {
      const isCollapsed = chatbot.classList.contains('collapsed');
      if (isCollapsed) {
        chatbot.classList.remove('collapsed');
        toggleBtn.children[0].style.display = 'none';
        toggleBtn.children[1].style.display = '';
        if (firstOpen) {
          setTimeout(addWelcomeMessage, 300);
          firstOpen = false;
        }
      } else {
        chatbot.classList.add('collapsed');
        toggleBtn.children[0].style.display = '';
        toggleBtn.children[1].style.display = 'none';
      }
    });
  }

})();
