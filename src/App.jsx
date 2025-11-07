import React, { useState } from 'react';

function App() {
  const [userInput, setUserInput] = useState('');
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = { sender: 'user', text: userInput };
    setChat([...chat, userMessage]);

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput }),
      });

      const data = await response.json();
      const botMessage = { sender: 'bot', text: data.reply };
      setChat(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    setUserInput('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Chat with AI</h1>
      <div style={{ marginBottom: '1rem' }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Type your message..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default App;