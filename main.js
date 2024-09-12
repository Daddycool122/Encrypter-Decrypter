function xorCipher(message, key) {
    const messageArray = Array.from(message);
    const keyArray = Array.from(String(key));
    const result = messageArray.map((char, index) => {
        const charCode = char.charCodeAt(0);
        const keyCode = keyArray[index % keyArray.length].charCodeAt(0);
        return String.fromCharCode(charCode ^ keyCode);
    }).join('');
    return result;
}

function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function displayError(element, message) {
    element.innerText = message;
    element.style.display = 'block';
}

function clearError(element) {
    element.innerText = '';
    element.style.display = 'none';
}

function generateQRCode(text) {
    const qrCodeContainer = document.getElementById('qr-code-container');
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(text)}`;
    const qrCodeImg = document.createElement('img');
    qrCodeImg.src = qrCodeUrl;
    qrCodeImg.alt = 'QR Code';
    qrCodeContainer.innerHTML = '';
    qrCodeContainer.appendChild(qrCodeImg);

    const downloadQrBtn = document.getElementById('download-qr-btn');
    downloadQrBtn.style.display = 'inline';
    downloadQrBtn.href = qrCodeUrl;
    downloadQrBtn.download = 'qr_code.png';
    downloadQrBtn.addEventListener('click', () => {
        fetch(qrCodeUrl)
            .then(response => response.blob())
            .then(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'qr_code.png';
                a.click();
                URL.revokeObjectURL(url);
            });
    });
}


document.getElementById('encrypt-btn').addEventListener('click', () => {
    const message = document.getElementById('message').value;
    const keyRange = parseInt(document.getElementById('key').value);
    let encryptedMessage = message;

    if (message.trim() === '' || isNaN(keyRange) || keyRange <= 0) {
        displayError(document.getElementById('error'), 'Please enter a valid message and positive number for the encryption range.');
        return;
    }

    for (let i = 1; i <= keyRange; i++) {
        encryptedMessage = xorCipher(encryptedMessage, i);
    }

    const iframe = document.getElementById('encrypted-message-frame');
    iframe.srcdoc = `<h2>Encrypted Message:</h2><pre class="encrypted">${encryptedMessage}</pre>`;
    document.getElementById('result').innerText = `Encrypted Data: ${encryptedMessage}`;
    document.getElementById('download-btn').style.display = 'inline';
    document.getElementById('download-btn').onclick = () => downloadFile('encrypted_message.txt', encryptedMessage);
    clearError(document.getElementById('error'));
});

document.getElementById('decrypt-btn').addEventListener('click', () => {
    const encryptedMessage = document.getElementById('result').innerText.split(': ')[1];
    const keyRange = parseInt(document.getElementById('key').value);
    let decryptedMessage = encryptedMessage;

    if (isNaN(keyRange) || keyRange <= 0) {
       
        displayError(document.getElementById('error'), 'Please enter a valid positive number for the encryption range.');
        return;
    }

    for (let i = keyRange; i >= 1; i--) {
        decryptedMessage = xorCipher(decryptedMessage, i);
    }

    const iframe = document.getElementById('encrypted-message-frame');
    iframe.srcdoc = `<h2>Decrypted Message:</h2><pre class="decrypted">${decryptedMessage}</pre>`;
    document.getElementById('result').innerText = `Decrypted Data: ${decryptedMessage}`;
    document.getElementById('download-btn').style.display = 'inline';
    document.getElementById('download-btn').onclick = () => downloadFile('decrypted_message.txt', decryptedMessage);
    generateQRCode(decryptedMessage);
    clearError(document.getElementById('error'));
});

document.getElementById('clear-btn').addEventListener('click', () => {
    document.getElementById('message').value = '';
    document.getElementById('key').value = '';
    document.getElementById('result').innerText = '';
    document.getElementById('encrypted-message-frame').srcdoc = '';
    document.getElementById('download-btn').style.display = 'none';
    document.getElementById('qr-code-container').innerHTML = '';
    document.getElementById('download-qr-btn').style.display = 'none';
    clearError(document.getElementById('error'));
});

document.getElementById('file-input').addEventListener('change', function () {
    const file = this.files[0];
    const reader = new FileReader();
    reader.onload = function () {
        document.getElementById('file-result').innerText = `File Content: ${reader.result}`;
    };
    reader.readAsText(file);
});

document.getElementById('file-encrypt-btn').addEventListener('click', () => {
    const fileContent = document.getElementById('file-result').innerText.split(': ')[1];
    const keyRange = parseInt(document.getElementById('file-key').value);
    let encryptedFileContent = fileContent;

    if (!fileContent || isNaN(keyRange) || keyRange <= 0) {
        displayError(document.getElementById('file-error'), 'Please upload a file and enter a valid positive number for the encryption range.');
        return;
    }

    for (let i = 1; i <= keyRange; i++) {
        encryptedFileContent = xorCipher(encryptedFileContent, i);
    }

    const iframe = document.getElementById('file-encrypted-message-frame');
    iframe.srcdoc = `<h2>Encrypted File Content:</h2><pre class="encrypted">${encryptedFileContent}</pre>`;
    document.getElementById('file-result').innerText = `Encrypted File Content: ${encryptedFileContent}`;
    document.getElementById('file-download-btn').style.display = 'inline';
    document.getElementById('file-download-btn').onclick = () => downloadFile('encrypted_file.txt', encryptedFileContent);
    clearError(document.getElementById('file-error'));
});

document.getElementById('file-decrypt-btn').addEventListener('click', () => {
    const encryptedFileContent = document.getElementById('file-result').innerText.split(': ')[1];
    const keyRange = parseInt(document.getElementById('file-key').value);
    let decryptedFileContent = encryptedFileContent;

    if (isNaN(keyRange) || keyRange <= 0) {
        displayError(document.getElementById('file-error'), 'Please enter a valid positive number for the encryption range.');
        return;
    }

    for (let i = keyRange; i >= 1; i--) {
        decryptedFileContent = xorCipher(decryptedFileContent, i);
    }

    const iframe = document.getElementById('file-encrypted-message-frame');
    iframe.srcdoc = `<h2>Decrypted File Content:</h2><pre class="decrypted">${decryptedFileContent}</pre>`;
    document.getElementById('file-result').innerText = `Decrypted File Content: ${decryptedFileContent}`;
    document.getElementById('file-download-btn').style.display = 'inline';
    document.getElementById('file-download-btn').onclick = () => downloadFile('decrypted_file.txt', decryptedFileContent);
    clearError(document.getElementById('file-error'));
});

document.getElementById('file-clear-btn').addEventListener('click', () => {
    document.getElementById('file-input').value = '';
    document.getElementById('file-key').value = '';
    document.getElementById('file-result').innerText = '';
    document.getElementById('file-encrypted-message-frame').srcdoc = '';
    document.getElementById('file-download-btn').style.display = 'none';
    clearError(document.getElementById('file-error'));
});

document.getElementById('switch-to-text-btn').addEventListener('click', () => {
    document.getElementById('text-encryption-section').classList.add('active');
    document.getElementById('file-encryption-section').classList.remove('active');
});

document.getElementById('switch-to-file-btn').addEventListener('click', () => {
    document.getElementById('file-encryption-section').classList.add('active');
    document.getElementById('text-encryption-section').classList.remove('active');
});