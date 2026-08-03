import { useState, React , useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CBadge,
} from "@coreui/react";
import socket from '../socket';
import { useRef } from 'react';
import axios from 'axios';
const Supporchat = () => {
    const ROOT_URL = import.meta.env.VITE_LOCALHOST_URL;

const [conversations, setConversations] = useState([]);
const [selectedConversation, setSelectedConversation] = useState(null);
const [messages, setMessages] = useState([]);
const [reply, setReply] = useState("");

const messagesEndRef = useRef(null);
const loadConversations = async () => {
  try {
    const res = await axios.get(
      `${ROOT_URL}/api/chat/conversations`
    );

    setConversations(res.data.data);
  } catch (error) {
    console.log(error);
  }
};
const openConversation = async (conversation) => {
  try {
    setSelectedConversation(conversation);

    const res = await axios.get(
      `${ROOT_URL}/api/chat/messages/${conversation._id}`
    );

    setMessages(res.data.data);

    await axios.put(
      `${ROOT_URL}/api/chat/seen/${conversation._id}`,
      {
        senderType: "admin",
      }
    );

    // badge immediately 0
    setConversations((prev) =>
      prev.map((item) =>
        item._id === conversation._id
          ? { ...item, unreadByAdmin: 0 }
          : item
      )
    );
  } catch (error) {
    console.log(error);
  }
};
const sendReply = async () => {
  if (!reply.trim()) return;

  try {
    await axios.post(`${ROOT_URL}/api/chat/send`, {
      conversationId: selectedConversation._id,
      senderId: "ADMIN",
      senderType: "admin",
      message: reply,
    });

    setReply("");
  } catch (error) {
    console.log(error);
  }
};
useEffect(() => {
  socket.emit("join-admin");

  const handleNewMessage = (newMessage) => {
    if (
      selectedConversation &&
      String(newMessage.conversationId) ===
        String(selectedConversation._id)
    ) {
      setMessages((prev) => {
        const exists = prev.some(
          (msg) => msg._id === newMessage._id
        );

        if (exists) return prev;

        return [...prev, newMessage];
      });
    }

    loadConversations();
  };

  socket.on("newMessage", handleNewMessage);

  return () => {
    socket.off("newMessage", handleNewMessage);
  };
}, [selectedConversation]);
useEffect(() => {
  loadConversations();
}, []);
 return (
  <CRow>
    {/* Left Conversation List */}
    <CCol md={4}>
      <CCard style={{ height: "80vh" }}>
        <CCardBody>
          <h5 className="mb-3">Support Chats</h5>

          {conversations.map((conv) => (
            <div
              key={conv._id}
              onClick={() => openConversation(conv)}
              className="border rounded p-3 mb-2"
              style={{ cursor: "pointer" }}
            >
              <div className="d-flex justify-content-between">
                <strong>
                  {conv.student?.name || "Student"}
                </strong>

                {conv.unreadByAdmin > 0 && (
                  <CBadge color="danger">
                    {conv.unreadByAdmin}
                  </CBadge>
                )}
              </div>

              <small className="text-muted">
                {conv.studentId}
              </small>

              <div className="text-muted mt-1">
                {conv.lastMessage}
              </div>
            </div>
          ))}
        </CCardBody>
      </CCard>
    </CCol>

    {/* Right Chat Window */}
    <CCol md={8}>
      <CCard style={{ height: "80vh" }}>
        <CCardBody className="d-flex flex-column">
          {selectedConversation ? (
            <>
              <div className="border-bottom pb-2 mb-3">
                <h5 className="mb-0 text-primary">
                  {selectedConversation.student?.name ||
                    "Student"}
                </h5>

                <small className="text-muted">
                  {selectedConversation.studentId}
                </small>
              </div>

              <div
                className="flex-grow-1 overflow-auto"
                style={{ maxHeight: "60vh" }}
              >
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`mb-3 d-flex ${
                      msg.senderType === "admin"
                        ? "justify-content-end"
                        : "justify-content-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded ${
                        msg.senderType === "admin"
                          ? "bg-light border"
                          : "bg-light border"
                      }`}
                      style={{ maxWidth: "75%", color: "blue" , fontWeight: "bold"}}
                    >
                      {msg.message}

                      <div className="small mt-1 opacity-75">
                        {new Date(
                          msg.createdAt
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}

                <div ref={messagesEndRef}></div>
              </div>

              <div className="mt-2 d-flex gap-1">
                <CFormInput
                  value={reply}
                  onChange={(e) =>
                    setReply(e.target.value)
                  }
                  placeholder="Type your reply..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      sendReply();
                    }
                  }}
                />

                <CButton
                  color="primary"
                  onClick={sendReply}
                >
                  Send
                </CButton>
              </div>
            </>
          ) : (
            <div className="h-100 d-flex justify-content-center align-items-center text-muted">
              Select a conversation
            </div>
          )}
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
);
}

export default Supporchat