"use client";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Send, 
  Paperclip, 
  FileText, 
  Image, 
  File,
  Download,
  Trash2,
  MessageCircle,
  Bot,
  User
} from "lucide-react";

// Dummy chat messages
const initialMessages = [
  {
    id: 1,
    type: "bot",
    content: "Hello! I'm here to help you with document analysis and questions. You can upload documents and ask me anything about them.",
    timestamp: "10:30 AM",
    files: []
  },
  {
    id: 2,
    type: "user",
    content: "Hi! I need help analyzing this medical report.",
    timestamp: "10:32 AM",
    files: [
      { name: "medical_report_jan2024.pdf", size: "2.4 MB", type: "pdf" }
    ]
  },
  {
    id: 3,
    type: "bot",
    content: "I've analyzed the medical report you uploaded. The document contains patient vital signs, diagnostic results, and treatment recommendations. What specific aspect would you like me to focus on?",
    timestamp: "10:33 AM",
    files: []
  },
  {
    id: 4,
    type: "user",
    content: "Can you summarize the key findings and recommendations?",
    timestamp: "10:35 AM",
    files: []
  },
  {
    id: 5,
    type: "bot",
    content: "Based on the medical report, here are the key findings:\n\n• Patient shows elevated blood pressure (140/90 mmHg)\n• Blood glucose levels are within normal range\n• Recommended follow-up in 2 weeks\n• Prescribed medication: Lisinopril 10mg daily\n\nThe overall prognosis is positive with proper medication adherence.",
    timestamp: "10:36 AM",
    files: []
  }
];

// Dummy uploaded files
const uploadedFiles = [
  { id: 1, name: "medical_report_jan2024.pdf", size: "2.4 MB", type: "pdf", uploadedAt: "2024-02-08 10:32:00" },
  { id: 2, name: "lab_results.xlsx", size: "1.2 MB", type: "excel", uploadedAt: "2024-02-07 15:20:00" },
  { id: 3, name: "patient_chart.docx", size: "890 KB", type: "word", uploadedAt: "2024-02-06 09:15:00" }
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'pdf': return <FileText className="h-4 w-4 text-red-500" />;
    case 'excel': return <File className="h-4 w-4 text-green-500" />;
    case 'word': return <FileText className="h-4 w-4 text-blue-500" />;
    case 'image': return <Image className="h-4 w-4 text-purple-500" />;
    default: return <File className="h-4 w-4 text-gray-500" />;
  }
};

export default function ChatPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [files, setFiles] = useState(uploadedFiles);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: []
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage("");

    // Simulate bot response
    setTimeout(() => {
      const botMessage = {
        id: messages.length + 2,
        type: "bot" as const,
        content: "I understand your question. Let me analyze the information and provide you with a detailed response based on the uploaded documents.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        files: []
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      const newFile = {
        id: files.length + Math.random(),
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type.includes('pdf') ? 'pdf' : 
              file.type.includes('sheet') ? 'excel' :
              file.type.includes('document') ? 'word' :
              file.type.includes('image') ? 'image' : 'file',
        uploadedAt: new Date().toLocaleString()
      };
      setFiles(prev => [...prev, newFile]);
    });

    // Add message about file upload
    const fileMessage = {
      id: messages.length + 1,
      type: "user" as const,
      content: `Uploaded ${uploadedFiles.length} file(s)`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: Array.from(uploadedFiles).map(file => ({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        type: file.type.includes('pdf') ? 'pdf' : 'file'
      }))
    };
    setMessages(prev => [...prev, fileMessage]);
  };

  return (
    <DashboardLayout>
      <div className="p-6 h-[calc(100vh-4rem)] max-h-screen overflow-hidden">
        <div className="flex h-full gap-6 max-w-full overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Chat Assistant</h1>
                <p className="text-muted-foreground">
                  Upload documents and chat with AI for analysis and insights
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                accept=".pdf,.doc,.docx,.xlsx,.xls,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                aria-label="Upload files"
              />
            </div>

            {/* Messages */}
            <Card className="flex-1 flex flex-col min-h-0">
              <CardHeader className="pb-4 flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Conversation
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'bot' && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              <Bot className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`max-w-[70%] space-y-2 ${
                          message.type === 'user' ? 'items-end' : 'items-start'
                        }`}>
                          <div className={`rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground ml-auto' 
                              : 'bg-muted'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          
                          {message.files.length > 0 && (
                            <div className="space-y-1">
                              {message.files.map((file, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <div className="flex-shrink-0">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <span className="truncate" title={file.name}>{file.name}</span>
                                  <Badge variant="outline" className="text-xs flex-shrink-0">
                                    {file.size}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground">{message.timestamp}</p>
                        </div>

                        {message.type === 'user' && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarFallback>
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {/* Scroll anchor */}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <Separator />
                
                {/* Message Input */}
                <div className="p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1"
                    />
                    <Button onClick={sendMessage} size="icon" className="flex-shrink-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* File Management Sidebar */}
          <div className="w-80 flex-shrink-0 overflow-hidden">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Uploaded Files
                </CardTitle>
                <CardDescription>
                  Manage your uploaded documents
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden p-4">
                <ScrollArea className="h-full">
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div key={file.id} className="flex items-start gap-2 p-3 border rounded-lg">
                        <div className="flex-shrink-0 mt-0.5">
                          {getFileIcon(file.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-sm font-medium truncate cursor-help max-w-[180px]" 
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                          <p 
                            className="text-xs text-muted-foreground truncate cursor-help max-w-[180px]" 
                            title={file.uploadedAt}
                          >
                            {file.uploadedAt}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0 w-6">
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" title="Download">
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 p-0" title="Delete">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
