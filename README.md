That is awesome! Since you already have the older version of Node.js up and running on that Windows 7 laptop, you've completely skipped the biggest hurdle. Transforming an unused laptop into a dedicated local server is the perfect use case for a project like this.

Since your Node environment is good to go, let’s get the code and setup refined so it runs reliably on that specific machine as a background service.

---

## 💻 1. The Local Server Setup

Since you are running an older Node version, we want to stick to clean, vanilla JavaScript (CommonJS syntax) without any heavy modern dependencies.

Create a folder on your Windows 7 machine (e.g., `C:\tempmail-server`), open your command prompt inside that folder, and run:

```cmd
npm init -y
npm install express

```

Then, create your `server.js` file:

```javascript
const express = require('express');
const app = express();

// Middleware to parse incoming JSON payloads from your email provider
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple in-memory database to store messages for your session
const mailStorage = {};

// 1. Webhook endpoint: Where incoming emails land
app.post('/incoming', (req, res) => {
    const { to, from, subject, html, text } = req.body;
    
    if (!to) return res.status(400).send('Missing recipient');

    // Extract the mailbox username (e.g., "johndoe" from "johndoe@domain.com")
    const mailboxId = to.split('@')[0].toLowerCase().trim();
    
    // Create the mailbox array if it doesn't exist yet
    if (!mailStorage[mailboxId]) {
        mailStorage[mailboxId] = [];
    }

    // Push the email data into memory
    mailStorage[mailboxId].push({
        from: from || 'Unknown Sender',
        subject: subject || '(No Subject)',
        body: html || text || 'Empty message body',
        receivedAt: new Date()
    });

    console.log(`[+] New email received for mailbox: ${mailboxId}`);
    return res.status(200).send('Email stored');
});

// 2. Fetch endpoint: Where your frontend UI reads the emails
app.get('/mailbox/:id', (req, res) => {
    const mailboxId = req.params.id.toLowerCase().trim();
    const emails = mailStorage[mailboxId] || [];
    return res.json(emails);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`=== Temp Mail Server Active ===`);
    console.log(`Listening locally on port ${PORT}`);
});

```

---

## 📡 2. Tunneling from Windows 7

Since you already have Node installed, try testing `localtunnel` first:

```cmd
npm install -g localtunnel
lt --port 3000 --subdomain unbranded-mail-box

```

### 💡 Crucial Windows 7 Tweak (If you get SSL/TLS errors)

Windows 7 doesn't natively support modern TLS 1.2 or TLS 1.3 protocols out of the box unless it was fully updated before Microsoft ended support. If `localtunnel` throws an SSL handshake error or connection timeout, it's usually because the tunnel service rejects the old Windows secure communication protocols.

If that happens, don't waste time fixing Windows updates. Instead, use **Pinggy** as a zero-dependency tunnel. You don't need to install anything. Just open a new command prompt window and run:

```cmd
ssh -p 443 -R0:localhost:3000 qr@free.pinggy.io

```

*(If your Windows 7 doesn't recognize the `ssh` command, you can download a tiny standalone tool like **PuTTY** or Git Bash to run it).* It will give you a public URL instantly.

---

## 🔋 3. Optimizing the Laptop to Run 24/7

Since this is an older laptop acting as a server, you'll want to configure Windows 7 so it doesn't cut your connection or shut down mid-way:

1. **Disable Sleep Mode:** Go to *Control Panel -> Power Options*. Select your plan, click *Change plan settings*, and set **"Put the computer to sleep"** to **Never** on both battery and plugged-in states.
2. **Lid Close Action:** In that same *Power Options* menu, click **"Choose what closing the lid does"** on the left sidebar. Set it to **"Do nothing"** when plugged in. Now you can close the laptop lid and tuck it away in a corner, and the server will stay alive.
3. **Static Local IP (Optional):** Give your laptop a fixed local IP address in your router settings (like `192.168.1.50`) so if you ever need to access the frontend dashboard from your main machine, you can just navigate to that local IP!

What are you planning to use for your front-end dashboard—are you going to build a simple UI web page right into this Node server, or serve it separately?
