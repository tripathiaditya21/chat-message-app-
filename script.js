
const inputField = document.getElementById("message-input");
// Detect "Enter" key press and send message immediately
inputField.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent new line in input
        sendMessage();
    }
});

function sendMessage() {
    let input = document.getElementById("message-input");
    let messageText = input.value.trim();
    if (messageText === "") return;

    let chatBox = document.getElementById("chat-box");

    let messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", "sent");

    let avatar = document.createElement("img");
    avatar.src = "sender.png"; // Replace with sender's avatar path
    avatar.classList.add("avatar");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerText = messageText;

    let timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.innerText = new Date().toLocaleTimeString();
    messageDiv.appendChild(timestamp);

    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageDiv);
    chatBox.appendChild(messageContainer);

    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";

    // Call function to generate response from Gemini API
    generateBotResponse(messageText);
}

// Function to generate bot response using Google Gemini API
async function generateBotResponse(userMessage) {
    let chatBox = document.getElementById("chat-box");

    let messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", "received");

    let avatar = document.createElement("img");
    avatar.src = "user-avatar.png"; // Replace with bot's avatar path
    avatar.classList.add("avatar");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    let timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.innerText = new Date().toLocaleTimeString();

    // API Call to Gemini Model
    let apiKey = "AIzaSyBuP07FdoimytdMg3zMUo_AWnNhs4wuE3s"; // Replace with your actual API key
    let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    let requestData = {
        contents: [
            {
                parts: [
                    {
                        text: userMessage
                    }
                ]
            }
        ]
    };

    try {
        let response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        let data = await response.json();
        console.log("API Response:", data);

        if (data && data.candidates && data.candidates.length > 0) {
            let botReply = data.candidates[0].content.parts[0].text;
            messageDiv.innerText = botReply;
        } else {
            messageDiv.innerText = "I'm not sure how to respond to that.";
        }
    } catch (error) {
        messageDiv.innerText = "Error generating response. Please try again.";
        console.error("API Error:", error);
    }

    messageDiv.appendChild(timestamp);
    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageDiv);
    chatBox.appendChild(messageContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}


// Function to toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save mode preference in localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

// Apply saved theme on page load
window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }
};

// Function for new chat (clear chat history)
function newChat() {
    document.getElementById("chat-box").innerHTML = "";
}

// Function to share chat (copy chat history to clipboard)
function shareChat() {
    let messages = document.querySelectorAll(".message");
    let chatText = Array.from(messages)
        .map(msg => msg.innerText.replace(/\d{1,2}:\d{2}:\d{2} (AM|PM)/, "")) // Remove timestamps
        .join("\n");

    navigator.clipboard.writeText(chatText).then(() => {
        alert("Chat copied to clipboard! ✅");
    });
}
function uploadFile(event) {
    let file = event.target.files[0];
    if (file) {
        displayUploadedFile(file);
    }
}

function uploadImage(event) {
    let image = event.target.files[0];
    if (image) {
        displayUploadedFile(image, true);
    }
}

function displayUploadedFile(file, isImage = false) {
    let chatBox = document.getElementById("chat-box");

    let messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", "sent");

    let avatar = document.createElement("img");
    avatar.src = "user-avatar.png"; // Update with user avatar path
    avatar.classList.add("avatar");

    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message");

    if (isImage) {
        let imgPreview = document.createElement("img");
        imgPreview.src = URL.createObjectURL(file);
        imgPreview.classList.add("uploaded-image");
        messageDiv.appendChild(imgPreview);
    } else {
        let fileLink = document.createElement("a");
        fileLink.href = URL.createObjectURL(file);
        fileLink.textContent = file.name;
        fileLink.setAttribute("download", file.name);
        fileLink.classList.add("uploaded-file");
        messageDiv.appendChild(fileLink);
    }

    let timestamp = document.createElement("div");
    timestamp.classList.add("timestamp");
    timestamp.innerText = new Date().toLocaleTimeString();
    messageDiv.appendChild(timestamp);

    messageContainer.appendChild(avatar);
    messageContainer.appendChild(messageDiv);
    chatBox.appendChild(messageContainer);

    chatBox.scrollTop = chatBox.scrollHeight;
}


