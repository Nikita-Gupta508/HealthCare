import React, { useState } from 'react';
import Swal from 'sweetalert2';

const APITest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const GEMINI_API =  import.meta.env.VITE_BACKEND_URL_GEMINI_API;
  const testAPI = async () => {
    setIsTesting(true);
    
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: "Hello, can you respond with 'API test successful'?"
            }]
          }]
        })
      });

      console.log("Test response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("Test API Response:", data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const result = data.candidates[0].content.parts[0].text;
        Swal.fire({
          title: "API Test Successful!",
          icon: "success",
          text: `Response: ${result}`,
        });
      } else {
        throw new Error('Unexpected response structure');
      }
    } catch (error) {
      console.error('API Test Error:', error);
      Swal.fire({
        title: "API Test Failed",
        icon: "error",
        text: `Error: ${error.message}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">API Test</h2>
      <button
        onClick={testAPI}
        disabled={isTesting}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isTesting ? 'Testing...' : 'Test Gemini API'}
      </button>
    </div>
  );
};

export default APITest;
