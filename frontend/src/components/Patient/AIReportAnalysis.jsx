import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaRobot, FaUser, FaTrash, FaDownload } from 'react-icons/fa';
import Swal from 'sweetalert2';
import APITest from './APITest';
import Navbar from '../Shared/Navbar';
import Footer from '../Shared/Footer';

const AIReportAnalysis = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const [isReportCard, setIsReportCard] = useState(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  const GEMINI_API =  import.meta.env.VITE_BACKEND_URL_GEMINI_API;
  
  // Validate API key format
  const validateApiKey = (key) => {
    return key && key.startsWith('AIza') && key.length > 30;
  };

  // Format analysis text for better display
  const formatAnalysisText = (text) => {
    if (!text) return null;
    
    // Split text into lines and process each line
    const lines = text.split('\n');
    const formattedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Skip empty lines
      if (!trimmedLine) return null;
      
      // Check for main headings (numbered sections)
      if (/^\d+\.\s+/.test(trimmedLine)) {
        return (
          <h3 key={index} className="text-lg font-bold text-blue-800 mt-4 mb-2 first:mt-0">
            {trimmedLine}
          </h3>
        );
      }
      
      // Check for subheadings
      if (/^[A-Z][^.!?]*:$/.test(trimmedLine)) {
        return (
          <h4 key={index} className="text-md font-semibold text-gray-700 mt-3 mb-2">
            {trimmedLine}
          </h4>
        );
      }
      
      // Check for bold text (text between asterisks)
      if (trimmedLine.includes('*')) {
        const parts = trimmedLine.split(/(\*[^*]+\*)/);
        return (
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <strong key={partIndex} className="font-bold text-gray-900">
                    {part.slice(1, -1)}
                  </strong>
                );
              }
              return part;
            })}
          </p>
        );
      }
      
      // Check for bullet points
      if (/^[-•*]\s+/.test(trimmedLine)) {
        const content = trimmedLine.replace(/^[-•*]\s+/, '');
        const parts = content.split(/(\*[^*]+\*)/);
        
        return (
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-blue-600 mr-2 mt-1">•</span>
            <span className="text-gray-700">
              {parts.map((part, partIndex) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return (
                    <strong key={partIndex} className="font-bold text-gray-900">
                      {part.slice(1, -1)}
                    </strong>
                  );
                }
                return part;
              })}
            </span>
          </div>
        );
      }
      
      // Check for numbered lists
      if (/^\d+\)\s+/.test(trimmedLine)) {
        const content = trimmedLine.replace(/^\d+\)\s+/, '');
        const parts = content.split(/(\*[^*]+\*)/);
        
        return (
          <div key={index} className="ml-4 mb-1 flex items-start">
            <span className="text-blue-600 mr-2 mt-1 font-semibold">
              {trimmedLine.match(/^\d+\)/)[0]}
            </span>
            <span className="text-gray-700">
              {parts.map((part, partIndex) => {
                if (part.startsWith('*') && part.endsWith('*')) {
                  return (
                    <strong key={partIndex} className="font-bold text-gray-900">
                      {part.slice(1, -1)}
                    </strong>
                  );
                }
                return part;
              })}
            </span>
          </div>
        );
      }
      
      // Regular paragraphs
      const parts = trimmedLine.split(/(\*[^*]+\*)/);
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed">
          {parts.map((part, partIndex) => {
            if (part.startsWith('*') && part.endsWith('*')) {
              return (
                <strong key={partIndex} className="font-bold text-gray-900">
                  {part.slice(1, -1)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    }).filter(Boolean);
    
    return <div className="space-y-1">{formattedLines}</div>;
  };
  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedAnalysis = localStorage.getItem('aiReportAnalysis');
    const savedChat = localStorage.getItem('aiReportChat');
    
    if (savedAnalysis) {
      const parsed = JSON.parse(savedAnalysis);
      setAnalysisResult(parsed.analysis);
      setIsReportCard(parsed.isReportCard);
      setImagePreview(parsed.imagePreview);
    }
    
    if (savedChat) {
      setChatMessages(JSON.parse(savedChat));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (analysisResult !== null) {
      localStorage.setItem('aiReportAnalysis', JSON.stringify({
        analysis: analysisResult,
        isReportCard: isReportCard,
        imagePreview: imagePreview
      }));
    }
  }, [analysisResult, isReportCard, imagePreview]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      localStorage.setItem('aiReportChat', JSON.stringify(chatMessages));
    }
  }, [chatMessages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setUploadedImage(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        Swal.fire({
          title: "Invalid File",
          icon: "error",
          text: "Please upload an image file.",
        });
      }
    }
  };

  const analyzeReport = async () => {
    if (!uploadedImage) {
      Swal.fire({
        title: "No Image",
        icon: "warning",
        text: "Please upload an image first.",
      });
      return;
    }

    // Validate API key
    if (!validateApiKey(GEMINI_API)) {
      Swal.fire({
        title: "Invalid API Key",
        icon: "error",
        text: "Please check your Gemini API key configuration.",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Convert image to base64
      const base64Image = await convertToBase64(uploadedImage);
      console.log("e",base64Image)
       // Call Gemini API for analysis (try 2.0 first, fallback to 1.5)
       const model = 'gemini-1.5-flash'; // Using 1.5-flash as it's more stable
       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API}`, {
         method: 'POST',   
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           contents: [{
             parts: [
               {
                 text: `Analyze this medical report image. First, determine if this is actually a medical report card or lab report. If it is a medical report, provide a detailed analysis including:
1. Patient information
2. Test results and values
3. Normal ranges
4. Abnormal findings
5. Overall health assessment
6. Recommendations

If this is NOT a medical report card, respond with: "This is not a medical report card. Please upload a proper medical report or lab test results for analysis."

Format your response clearly with headings and bullet points.`
               },
               {
                 inline_data: {
                   mime_type: uploadedImage.type,
                   data: base64Image.split(',')[1]
                 }
               }
             ]
           }]
         })
       });
      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const analysis = data.candidates[0].content.parts[0].text;
        console.log("Analysis result:", analysis);
        
        // Check if it's a report card
        const isReport = !analysis.includes("This is not a medical report card");
        setIsReportCard(isReport);
        
        if (isReport) {
          setAnalysisResult(analysis);
          // Add initial analysis to chat
          setChatMessages([{
            id: Date.now(),
            type: 'ai',
            message: analysis,
            timestamp: new Date().toLocaleTimeString()
          }]);
          
          // Show success message
          Swal.fire({
            title: "Analysis Complete!",
            icon: "success",
            text: "Your medical report has been successfully analyzed. You can now ask questions about the results.",
            timer: 3000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            title: "Invalid Document",
            icon: "warning",
            text: "This doesn't appear to be a medical report card. Please upload a proper medical report or lab test results.",
          });
        }
      } else {
        console.error("Unexpected API response structure:", data);
        throw new Error('Failed to get analysis from AI - unexpected response structure');
      }
    } catch (error) {
      console.error('Error analyzing report:', error);
      Swal.fire({
        title: "Analysis Failed",
        icon: "error",
        text: `Failed to analyze the report: ${error.message}. Please check your API key and try again.`,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const sendMessage = async () => {
    if (!userMessage.trim() || !analysisResult) return;

    const newMessage = {
      id: Date.now(),
      type: 'user',
      message: userMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setUserMessage('');
    setIsChatting(true);

    try {
       const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Based on the previous medical report analysis, answer this question: ${userMessage}. Provide helpful medical insights and explanations.`
            }]
          }]
        })
      });

      const data = await response.json();
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        const aiResponse = data.candidates[0].content.parts[0].text;
        
        setTimeout(() => {
          setChatMessages(prev => [...prev, {
            id: Date.now() + 1,
            type: 'ai',
            message: aiResponse,
            timestamp: new Date().toLocaleTimeString()
          }]);
          setIsChatting(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsChatting(false);
    }
  };

  const clearData = () => {
    setUploadedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    setChatMessages([]);
    setIsReportCard(null);
    localStorage.removeItem('aiReportAnalysis');
    localStorage.removeItem('aiReportChat');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadAnalysis = () => {
    if (!analysisResult) return;
    
    const element = document.createElement('a');
    const file = new Blob([analysisResult], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'medical_report_analysis.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
            <FaRobot className="text-3xl text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AI Medical Report Analysis
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload your medical report and get AI-powered analysis with detailed insights, 
            recommendations, and interactive chat support
          </p>
          
          {/* Temporary API Test - Remove in production */}
          {/* <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <APITest />
          </div> */}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Upload and Analysis Section */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaUpload className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Upload Report</h2>
            </div>
            
            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 group"
              >
                <FaUpload className="mx-auto text-5xl text-gray-400 mb-4 group-hover:text-blue-500 transition-colors" />
                <p className="text-gray-600 text-lg font-medium group-hover:text-blue-600 transition-colors">
                  Click to upload medical report
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Supports JPG, PNG, PDF • Max 10MB
                </p>
              </button>
            </div>

            {imagePreview && (
              <div className="mb-6">
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Uploaded report"
                    className="w-full h-64 object-contain border-2 border-gray-200 rounded-xl shadow-sm group-hover:shadow-md transition-shadow"
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                    Preview
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={analyzeReport}
                disabled={!uploadedImage || isAnalyzing}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <FaRobot className="text-lg" />
                    Analyze Report
                  </>
                )}
              </button>
              
              <button
                onClick={clearData}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white py-4 px-6 rounded-xl hover:from-red-600 hover:to-red-700 flex items-center gap-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <FaTrash className="text-lg" />
                Clear
              </button>
            </div>

             {analysisResult && (
               <div className="mt-6">
                 <div className="flex justify-between items-center mb-4">
                   <h3 className="text-xl font-semibold text-gray-800">Analysis Result</h3>
                   <button
                     onClick={downloadAnalysis}
                     className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
                   >
                     <FaDownload />
                     Download
                   </button>
                 </div>
                 <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 max-h-96 overflow-y-auto shadow-inner">
                   <div className="prose prose-sm max-w-none">
                     {formatAnalysisText(analysisResult)}
                   </div>
                 </div>
               </div>
             )}
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaUser className="text-green-600 text-xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Ask Questions</h2>
            </div>
            
            {!analysisResult ? (
              <div className="text-center text-gray-500 py-16">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full mb-6">
                  <FaRobot className="text-4xl text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Ready to Help!</h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  Upload and analyze a medical report first, then I'll be here to answer any questions you have about the results.
                </p>
              </div>
            ) : (
              <>
                 <div className="h-96 overflow-y-auto mb-4 border rounded-lg p-4 bg-gradient-to-br from-gray-50 to-blue-50">
                   {chatMessages.map((msg) => (
                     <div
                       key={msg.id}
                       className={`mb-4 flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                     >
                       <div
                         className={`max-w-xs lg:max-w-lg px-4 py-3 rounded-lg shadow-sm ${
                           msg.type === 'user'
                             ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                             : 'bg-white border border-gray-200'
                         }`}
                       >
                         <div className="flex items-center gap-2 mb-2">
                           <div className={`p-1 rounded-full ${msg.type === 'user' ? 'bg-blue-500' : 'bg-gray-200'}`}>
                             {msg.type === 'user' ? <FaUser className="text-xs" /> : <FaRobot className="text-xs" />}
                           </div>
                           <span className={`text-xs ${msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                             {msg.timestamp}
                           </span>
                         </div>
                         <div className={`text-sm leading-relaxed ${
                           msg.type === 'user' ? 'text-white' : 'text-gray-700'
                         }`}>
                           {msg.type === 'ai' ? formatAnalysisText(msg.message) : msg.message}
                         </div>
                       </div>
                     </div>
                   ))}
                  {isChatting && (
                    <div className="flex justify-start">
                      <div className="bg-white border shadow-sm px-4 py-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FaRobot />
                          <span className="text-sm">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                 <div className="flex gap-3">
                   <input
                     type="text"
                     value={userMessage}
                     onChange={(e) => setUserMessage(e.target.value)}
                     onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                     placeholder="Ask about your report... (e.g., 'What do these results mean?')"
                     className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                   />
                   <button
                     onClick={sendMessage}
                     disabled={!userMessage.trim() || isChatting}
                     className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                   >
                     {isChatting ? 'Sending...' : 'Send'}
                   </button>
                 </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AIReportAnalysis;
