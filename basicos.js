// Import built-in Node.js modules (no npm install required!)
const http = require('http');

// Set the port to 3000
const PORT = 3000;

// Embedded HTML, CSS, and JS for MiniOS
const HTML_CONTENT = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiniOS - Feature-Rich Retro OS</title>
    <style>
        :root {
            --desktop-bg: #008080; /* Classic Windows 95 Teal */
            --win-bg: #c0c0c0;
            --win-border-light: #fff;
            --win-border-dark: #808080;
            --text-color: #000;
            --taskbar-bg: #c0c0c0;
            --btn-shadow: inset -1px -1px #0a0a0a, inset 1px 1px #fff, inset -2px -2px #808080, inset 2px 2px #dfdfdf;
            --btn-active-shadow: inset 1px 1px #0a0a0a, inset -1px -1px #fff, inset 2px 2px #808080, inset -2px -2px #dfdfdf;
        }

        /* Matrix / Dark Theme overrides */
        .theme-dark {
            --desktop-bg: #0d0d0d;
            --win-bg: #1a1a1a;
            --win-border-light: #333;
            --win-border-dark: #00ff00;
            --text-color: #00ff00;
            --taskbar-bg: #111;
            --btn-shadow: inset -1px -1px #00ff00, inset 1px 1px #333;
            --btn-active-shadow: inset 1px 1px #00ff00, inset -1px -1px #333;
        }

        * {
            box-sizing: border-box;
            font-family: "Courier New", Courier, monospace;
        }

        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            background-color: var(--desktop-bg);
            color: var(--text-color);
            transition: background-color 0.3s ease;
        }

        /* Desktop Area */
        #desktop {
            position: relative;
            width: 100%;
            height: calc(100% - 40px);
            padding: 20px;
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            gap: 15px;
            align-content: flex-start;
        }

        .desktop-icon {
            background: var(--win-bg);
            border: 2px solid var(--text-color);
            color: var(--text-color);
            padding: 10px;
            cursor: pointer;
            width: 110px;
            text-align: center;
            font-weight: bold;
            box-shadow: 2px 2px 0px #000;
        }

        .desktop-icon:active {
            transform: translate(1px, 1px);
            box-shadow: 1px 1px 0px #000;
        }

        /* Taskbar */
        #taskbar {
            position: fixed;
            bottom: 0;
            width: 100%;
            height: 40px;
            background-color: var(--taskbar-bg);
            border-top: 3px solid var(--win-border-light);
            display: flex;
            align-items: center;
            padding: 0 10px;
            z-index: 1000;
            box-shadow: 0 -2px 0 var(--win-border-dark);
        }

        #start-button {
            font-weight: bold;
            padding: 3px 12px;
            margin-right: 15px;
            background: var(--win-bg);
            color: var(--text-color);
            border: 2px solid;
            border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
            cursor: pointer;
        }

        #clock {
            margin-left: auto;
            background: var(--win-bg);
            padding: 4px 10px;
            border: 2px inset var(--win-border-light);
            font-size: 13px;
            font-weight: bold;
        }

        /* Windows */
        .window {
            position: absolute;
            min-width: 320px;
            background: var(--win-bg);
            border: 3px solid;
            border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
            display: flex;
            flex-direction: column;
            box-shadow: 4px 4px 10px rgba(0,0,0,0.3);
        }

        .window-header {
            background: var(--text-color);
            color: var(--win-bg);
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            font-weight: bold;
        }

        .close-btn {
            background: #ff5555;
            color: white;
            border: 1px solid #000;
            cursor: pointer;
            padding: 0px 6px;
            font-weight: bold;
        }

        .close-btn:hover {
            background: #ff1111;
        }

        .window-content {
            padding: 12px;
            flex-grow: 1;
            overflow: auto;
            color: var(--text-color);
        }

        /* UI elements */
        button.gui-btn {
            background: var(--win-bg);
            color: var(--text-color);
            border: 2px solid;
            border-color: var(--win-border-light) var(--win-border-dark) var(--win-border-dark) var(--win-border-light);
            padding: 5px 10px;
            cursor: pointer;
            font-weight: bold;
        }

        button.gui-btn:active {
            border-color: var(--win-border-dark) var(--win-border-light) var(--win-border-light) var(--win-border-dark);
        }

        input, textarea, select {
            background: #fff;
            color: #000;
            border: 2px inset var(--win-border-light);
            padding: 5px;
            font-family: inherit;
        }

        .theme-dark input, .theme-dark textarea, .theme-dark select {
            background: #000;
            color: #00ff00;
            border: 2px solid #00ff00;
        }

        hr {
            border: none;
            border-top: 2px solid var(--win-border-dark);
            margin: 10px 0;
        }

        .hidden {
            display: none !important;
        }

        /* ================= APPS STYLING ================= */

        /* Calculator App */
        .calc-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-top: 8px;
        }

        .calc-display {
            width: 100%;
            height: 40px;
            text-align: right;
            font-size: 20px;
            margin-bottom: 10px;
            padding: 5px;
            background: #fff;
            border: 2px inset;
        }

        /* Text Editor App */
        .notepad-textarea {
            width: 100%;
            height: 140px;
            resize: none;
            margin-bottom: 8px;
        }

        /* Terminal App */
        .terminal-box {
            background: #000;
            color: #0f0;
            padding: 10px;
            height: 180px;
            overflow-y: auto;
            margin-bottom: 8px;
            font-size: 13px;
            border: 2px inset #555;
        }

        /* Guess the Number App */
        .game-status {
            font-weight: bold;
            margin: 10px 0;
            height: 20px;
        }

        /* File List */
        .file-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .file-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 4px 0;
        }

        /* System Messages / Alerts */
        .sys-dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9999;
            background: var(--win-bg);
            border: 3px solid var(--text-color);
            padding: 20px;
            box-shadow: 10px 10px 0px rgba(0,0,0,0.5);
            text-align: center;
            min-width: 280px;
        }
    </style>
</head>
<body>

<!-- Desktop Icons -->
<div id="desktop">
    <button class="desktop-icon" onclick="openApp('files')">[FILES]</button>
    <button class="desktop-icon" onclick="openApp('notepad')">[NOTEPAD]</button>
    <button class="desktop-icon" onclick="openApp('calc')">[CALC]</button>
    <button class="desktop-icon" onclick="openApp('guessgame')">[NUMBER_GAME]</button>
    <button class="desktop-icon" onclick="openApp('terminal')">[TERMINAL]</button>
    <button class="desktop-icon" onclick="openApp('settings')">[SETTINGS]</button>
    <button class="desktop-icon" onclick="openApp('about')">[ABOUT]</button>
</div>

<!-- Taskbar -->
<div id="taskbar">
    <button id="start-button" onclick="showSystemDialog('MiniOS v1.1.0\\n\\nUse the Desktop icons to launch applications.')">START</button>
    <div style="font-weight: bold; margin-left: 10px;">MiniOS v1.1</div>
    <div id="clock">00:00:00</div>
</div>

<!-- Custom Alert Box (System Dialog) -->
<div id="sys-dialog" class="sys-dialog hidden">
    <p id="sys-dialog-text"></p>
    <button class="gui-btn" onclick="closeSystemDialog()">OK</button>
</div>

<!-- WINDOWS -->

<!-- 1. File Explorer -->
<div id="window-files" class="window hidden" style="top: 30px; left: 30px; width: 340px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-files')">
        <span>File Explorer</span>
        <button class="close-btn" onclick="closeApp('files')">X</button>
    </div>
    <div class="window-content">
        <strong>Directory: C:\\Documents</strong>
        <hr>
        <ul id="file-list" class="file-list">
            <!-- Files loaded via JavaScript -->
        </ul>
    </div>
</div>

<!-- 2. Text Editor (Notepad) -->
<div id="window-notepad" class="window hidden" style="top: 70px; left: 70px; width: 380px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-notepad')">
        <span>Notepad</span>
        <button class="close-btn" onclick="closeApp('notepad')">X</button>
    </div>
    <div class="window-content">
        <div style="margin-bottom: 8px; display: flex; gap: 5px;">
            <span>File:</span>
            <input type="text" id="notepad-filename" value="untitled.txt" style="flex-grow: 1;">
        </div>
        <textarea id="notepad-text" class="notepad-textarea" placeholder="Start typing..."></textarea>
        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button class="gui-btn" onclick="clearNotepad()">Clear</button>
            <button class="gui-btn" onclick="saveNotepadFile()">Save to Files</button>
        </div>
    </div>
</div>

<!-- 3. Calculator -->
<div id="window-calc" class="window hidden" style="top: 110px; left: 110px; width: 300px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-calc')">
        <span>Calculator</span>
        <button class="close-btn" onclick="closeApp('calc')">X</button>
    </div>
    <div class="window-content">
        <input type="text" id="calc-screen" class="calc-display" readonly value="0">
        <div class="calc-grid">
            <button class="gui-btn" onclick="pressCalc('C')">C</button>
            <button class="gui-btn" onclick="pressCalc('Backspace')">&lt;-</button>
            <button class="gui-btn" onclick="pressCalc('/')">/</button>
            <button class="gui-btn" onclick="pressCalc('*')">*</button>

            <button class="gui-btn" onclick="pressCalc('7')">7</button>
            <button class="gui-btn" onclick="pressCalc('8')">8</button>
            <button class="gui-btn" onclick="pressCalc('9')">9</button>
            <button class="gui-btn" onclick="pressCalc('-')">-</button>

            <button class="gui-btn" onclick="pressCalc('4')">4</button>
            <button class="gui-btn" onclick="pressCalc('5')">5</button>
            <button class="gui-btn" onclick="pressCalc('6')">6</button>
            <button class="gui-btn" onclick="pressCalc('+')">+</button>

            <button class="gui-btn" onclick="pressCalc('1')">1</button>
            <button class="gui-btn" onclick="pressCalc('2')">2</button>
            <button class="gui-btn" onclick="pressCalc('3')">3</button>
            <button class="gui-btn" onclick="pressCalc('=')" style="grid-row: span 2; height: 100%;">=</button>

            <button class="gui-btn" style="grid-column: span 2;" onclick="pressCalc('0')">0</button>
            <button class="gui-btn" onclick="pressCalc('.')">.</button>
        </div>
    </div>
</div>

<!-- 4. Guess the Number Game -->
<div id="window-guessgame" class="window hidden" style="top: 150px; left: 150px; width: 340px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-guessgame')">
        <span>Guess Game</span>
        <button class="close-btn" onclick="closeApp('guessgame')">X</button>
    </div>
    <div class="window-content" style="text-align: center;">
        <p>I am thinking of a number between 1 and 100.</p>
        <div class="game-status" id="game-feedback">Start guessing!</div>
        <input type="number" id="game-input" placeholder="Your guess" style="width: 100px; margin-bottom: 10px; text-align: center;"><br>
        <div style="display:flex; justify-content: center; gap: 8px;">
            <button class="gui-btn" onclick="submitGuess()">Guess</button>
            <button class="gui-btn" onclick="resetGame()">Reset</button>
        </div>
        <p style="font-size: 11px; margin-top: 10px;">Attempts: <span id="game-attempts">0</span></p>
    </div>
</div>

<!-- 5. Terminal -->
<div id="window-terminal" class="window hidden" style="top: 190px; left: 190px; width: 400px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-terminal')">
        <span>Terminal</span>
        <button class="close-btn" onclick="closeApp('terminal')">X</button>
    </div>
    <div class="window-content">
        <div id="terminal-output" class="terminal-box">MiniOS [Version 1.1.0]<br>Type "help" for a list of available commands.</div>
        <input type="text" id="terminal-input" placeholder="Enter command..." onkeydown="handleTerminal(event)" style="width: 100%;">
    </div>
</div>

<!-- 6. Settings -->
<div id="window-settings" class="window hidden" style="top: 220px; left: 220px; width: 320px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-settings')">
        <span>Settings</span>
        <button class="close-btn" onclick="closeApp('settings')">X</button>
    </div>
    <div class="window-content">
        <label><strong>System Theme:</strong></label><br>
        <select id="setting-theme" onchange="changeTheme()" style="width: 100%; margin-top: 5px;">
            <option value="classic">Classic Retro (Gray/Teal)</option>
            <option value="dark">Matrix (Neon Green/Black)</option>
        </select>
        <hr>
        <label><strong>Desktop Background Color:</strong></label><br>
        <select id="setting-bg" onchange="changeBg()" style="width: 100%; margin-top: 5px;">
            <option value="#008080">Classic Teal</option>
            <option value="#004080">Navy Blue</option>
            <option value="#404040">Charcoal Gray</option>
            <option value="#000000">Jet Black</option>
        </select>
        <hr>
        <button class="gui-btn" onclick="resetSettings()" style="width: 100%;">Restore Defaults</button>
    </div>
</div>

<!-- 7. About -->
<div id="window-about" class="window hidden" style="top: 250px; left: 250px; width: 320px;">
    <div class="window-header" onmousedown="dragStart(event, 'window-about')">
        <span>About MiniOS</span>
        <button class="close-btn" onclick="closeApp('about')">X</button>
    </div>
    <div class="window-content" style="text-align: center;">
        <h3>MiniOS</h3>
        <p><strong>Version:</strong> 1.1.0</p>
        <p>A lightweight, customizable web-based operating system design.</p>
        <hr>
        <p>Built with plain HTML, CSS, &amp; JS. Serving directly from raw node server.</p>
        <button class="gui-btn" onclick="closeApp('about')">Awesome</button>
    </div>
</div>

<script>
    // System Virtual Storage (Mock Filesystem)
    let virtualFS = [
        { name: "notes.txt", content: "Buy milk, eggs, and bread. Code MiniOS features." },
        { name: "todo.txt", content: "1. Build simple OS\\n2. Test Localhost\\n3. Run Calculator\\n4. Win guess game" },
        { name: "kernel.sys", content: "[SYSTEM BINARY DATA] MiniOS Kernel Active." }
    ];

    // System Clock Update
    function updateClock() {
        const now = new Date();
        document.getElementById('clock').innerText = now.toLocaleTimeString();
    }
    setInterval(updateClock, 1000);
    updateClock();

    // App Loading and Window Ordering (Z-Index)
    function openApp(appId) {
        const win = document.getElementById(\`window-\${appId}\`);
        win.classList.remove('hidden');
        win.style.zIndex = getTopZIndex() + 1;
        if (appId === 'files') renderFiles();
        if (appId === 'guessgame' && targetNum === 0) resetGame();
    }

    function closeApp(appId) {
        document.getElementById(\`window-\${appId}\`).classList.add('hidden');
    }

    function getTopZIndex() {
        const windows = document.querySelectorAll('.window');
        let max = 1;
        windows.forEach(w => {
            const z = parseInt(w.style.zIndex) || 0;
            if (z > max) max = z;
        });
        return max;
    }

    // Custom non-blocking System Dialog (No alerts used!)
    function showSystemDialog(text) {
        const modal = document.getElementById('sys-dialog');
        const modalText = document.getElementById('sys-dialog-text');
        modalText.innerHTML = text.replace(/\\n/g, '<br>');
        modal.classList.remove('hidden');
    }

    function closeSystemDialog() {
        document.getElementById('sys-dialog').classList.add('hidden');
    }

    // --- File Explorer Features ---
    function renderFiles() {
        const list = document.getElementById('file-list');
        list.innerHTML = '';
        virtualFS.forEach((file, index) => {
            const li = document.createElement('li');
            li.className = 'file-item';
            li.innerHTML = \`
                <span>\${file.name}</span>
                <div style="display: flex; gap: 5px;">
                    <button class="gui-btn" style="padding: 2px 6px;" onclick="viewFile(\${index})">View</button>
                    <button class="gui-btn" style="padding: 2px 6px;" onclick="deleteFile(\${index})">Delete</button>
                </div>
            \`;
            list.appendChild(li);
        });
    }

    function viewFile(index) {
        const file = virtualFS[index];
        openApp('notepad');
        document.getElementById('notepad-filename').value = file.name;
        document.getElementById('notepad-text').value = file.content;
    }

    function deleteFile(index) {
        const file = virtualFS[index];
        if (file.name === 'kernel.sys') {
            showSystemDialog("Error: cannot delete system protected files.");
            return;
        }
        virtualFS.splice(index, 1);
        renderFiles();
    }

    // --- Notepad (Text Editor) Features ---
    function clearNotepad() {
        document.getElementById('notepad-text').value = '';
        document.getElementById('notepad-filename').value = 'untitled.txt';
    }

    function saveNotepadFile() {
        const filename = document.getElementById('notepad-filename').value.trim() || "untitled.txt";
        const content = document.getElementById('notepad-text').value;

        // Check if file exists, overwrite if yes
        const existingIdx = virtualFS.findIndex(f => f.name === filename);
        if (existingIdx !== -1) {
            virtualFS[existingIdx].content = content;
            showSystemDialog(\`Overwrote file "\${filename}" in Files directory.\`);
        } else {
            virtualFS.push({ name: filename, content: content });
            showSystemDialog(\`Saved file "\${filename}" to C:\\\\Documents.\`);
        }
        renderFiles();
    }

    // --- Calculator App ---
    let calcVal = "0";
    function pressCalc(char) {
        const screen = document.getElementById('calc-screen');
        if (char === 'C') {
            calcVal = "0";
        } else if (char === 'Backspace') {
            calcVal = calcVal.slice(0, -1) || "0";
        } else if (char === '=') {
            try {
                // Safely evaluate simple math using Function constructor
                calcVal = String(new Function(\`return \${calcVal}\`)());
            } catch (err) {
                calcVal = "Error";
            }
        } else {
            if (calcVal === "0" && char !== '.') {
                calcVal = char;
            } else {
                calcVal += char;
            }
        }
        screen.value = calcVal;
    }

    // --- Guess the Number Game ---
    let targetNum = 0;
    let attemptsCount = 0;

    function resetGame() {
        targetNum = Math.floor(Math.random() * 100) + 1;
        attemptsCount = 0;
        document.getElementById('game-feedback').innerText = "I have a new number!";
        document.getElementById('game-attempts').innerText = attemptsCount;
        document.getElementById('game-input').value = '';
    }

    function submitGuess() {
        const userGuess = parseInt(document.getElementById('game-input').value);
        if (isNaN(userGuess)) {
            document.getElementById('game-feedback').innerText = "Enter a valid number!";
            return;
        }
        attemptsCount++;
        document.getElementById('game-attempts').innerText = attemptsCount;

        if (userGuess === targetNum) {
            document.getElementById('game-feedback').innerText = \`CORRECT! It was \${targetNum}!\`;
            showSystemDialog(\`🎉 You won!\\nAttempts: \${attemptsCount}\\nPress Reset to play again!\`);
        } else if (userGuess < targetNum) {
            document.getElementById('game-feedback').innerText = "Too Low! Try higher.";
        } else {
            document.getElementById('game-feedback').innerText = "Too High! Try lower.";
        }
    }

    // --- Terminal Commands ---
    function handleTerminal(e) {
        if (e.key === 'Enter') {
            const input = e.target.value.trim();
            if (!input) return;

            const tokens = input.split(' ');
            const cmd = tokens[0].toLowerCase();
            const arg = tokens.slice(1).join(' ');
            const output = document.getElementById('terminal-output');
            let response = \`\\n$ \${input}\\n\`;

            switch(cmd) {
                case 'help':
                    response += "Available commands:\\n- help : Show commands\\n- clear : Clear terminal screen\\n- date : Current date & time\\n- whoami : Check user profile\\n- echo [text] : Print text on screen\\n- files : List virtual storage files\\n- format : WARNING! Format system";
                    break;
                case 'clear':
                    output.innerHTML = "";
                    e.target.value = "";
                    return;
                case 'date':
                    response += new Date().toString();
                    break;
                case 'whoami':
                    response += "User: Guest_Operating_User\\nStatus: Administrator";
                    break;
                case 'files':
                    response += "Directory files:\\n";
                    virtualFS.forEach(f => {
                        response += \`- \${f.name} (\${f.content.length} chars)\\n\`;
                    });
                    break;
                case 'echo':
                    response += arg;
                    break;
                case 'format':
                    response += "FORMAT COMPLETED successfully. File system reset.";
                    virtualFS = [{ name: "kernel.sys", content: "Critical kernel patch restored." }];
                    break;
                default:
                    response += \`Command not found: "\${cmd}". Type "help"\`;
            }

            output.innerHTML += response;
            output.scrollTop = output.scrollHeight;
            e.target.value = "";
        }
    }

    // --- Settings / Theme Control ---
    function changeTheme() {
        const theme = document.getElementById('setting-theme').value;
        if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else {
            document.body.classList.remove('theme-dark');
        }
    }

    function changeBg() {
        const bgColor = document.getElementById('setting-bg').value;
        document.documentElement.style.setProperty('--desktop-bg', bgColor);
    }

    function resetSettings() {
        document.getElementById('setting-theme').value = 'classic';
        document.getElementById('setting-bg').value = '#008080';
        document.body.classList.remove('theme-dark');
        document.documentElement.style.setProperty('--desktop-bg', '#008080');
    }

    // --- Mouse Draggable Control Logic ---
    let activeWin = null;
    let offset = { x: 0, y: 0 };

    function dragStart(e, id) {
        activeWin = document.getElementById(id);
        activeWin.style.zIndex = getTopZIndex() + 1;
        offset.x = e.clientX - activeWin.offsetLeft;
        offset.y = e.clientY - activeWin.offsetTop;
        
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);
    }

    function dragMove(e) {
        if (!activeWin) return;
        activeWin.style.left = (e.clientX - offset.x) + 'px';
        activeWin.style.top = (e.clientY - offset.y) + 'px';
    }

    function dragEnd() {
        activeWin = null;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
    }
</script>

</body>
</html>
`;

// Create the local HTTP server
const server = http.createServer((req, res) => {
    // Serve our single-page OS under all root paths
    if (req.url === '/' || req.url === '/index.html' || req.url === '/minios.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(HTML_CONTENT);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

// Start listening on port 3000
server.listen(PORT, () => {
    console.log('==================================================');
    console.log(`  MiniOS is running!`);
    console.log(`  Access your OS here: http://localhost:${PORT}`);
    console.log('  Press Ctrl+C to stop the server.');
    console.log('==================================================');
});
