import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import PeopleIcon from '@mui/icons-material/People'
import PanToolIcon from '@mui/icons-material/PanTool'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import StopIcon from '@mui/icons-material/Stop'
import LockIcon from '@mui/icons-material/Lock'
import SubtitlesIcon from '@mui/icons-material/Subtitles'
import server from '../environment';
import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import * as tf from '@tensorflow/tfjs';

const server_url = server;
var connections = {};

let peerConfigConnections = {
    "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }]
}

const fetchTurnCredentials = async () => {
    console.log("Fetching TURN credentials from:", `${server}/api/v1/turn-credentials`);
    try {
        const response = await fetch(`${server}/api/v1/turn-credentials`);
        const iceServers = await response.json();
        console.log("TURN credentials response:", iceServers);
        if (Array.isArray(iceServers)) {
            peerConfigConnections = { "iceServers": iceServers };
            console.log("peerConfigConnections updated:", peerConfigConnections);
        } else {
            console.log("TURN response was not an array, keeping STUN only");
        }
    } catch (e) {
        console.log("Failed to fetch TURN credentials, using STUN only:", e);
    }
}
const EMOJIS = ["👍", "❤️", "😂", "😮", "👏", "🔥"]

export default function VideoMeetComponent() {

    var socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoref = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState([]);
    let [audio, setAudio] = useState();
    let [screen, setScreen] = useState();
    let [showModal, setModal] = useState(false);
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(3);
    let [askForUsername, setAskForUsername] = useState(true);
    let [username, setUsername] = useState(localStorage.getItem("meetflow_username") || "");
    const videoRef = useRef([])
    let [videos, setVideos] = useState([])
    let hasConnectedRef = useRef(false);
    let [pinnedVideo, setPinnedVideo] = useState(null); // ✅ kaun sa video bada dikhega
    let [participantCount, setParticipantCount] = useState(1);
    let [connectionQuality, setConnectionQuality] = useState("good");
    let [callDuration, setCallDuration] = useState(0);
    let timerRef = useRef(null);

    let [handRaised, setHandRaised] = useState(false);
    let [raisedHands, setRaisedHands] = useState([]);
    let handTimerRef = useRef(null);

    let [showEmojiPicker, setShowEmojiPicker] = useState(false);
    let [floatingEmojis, setFloatingEmojis] = useState([]);

    let [blurBackground, setBlurBackground] = useState(false);
    let blurCanvasRef = useRef(null);
    let blurIntervalRef = useRef(null);
    let segmenterRef = useRef(null);

    let [isRecording, setIsRecording] = useState(false);
    let [recordingTime, setRecordingTime] = useState(0);
    let mediaRecorderRef = useRef(null);
    let recordedChunksRef = useRef([]);
    let recordingTimerRef = useRef(null);

    let [roomPassword, setRoomPassword] = useState("");
    let [passwordError, setPasswordError] = useState("");
    let [roomIsLocked, setRoomIsLocked] = useState(false);

    let [showSummary, setShowSummary] = useState(false);
    let [summary, setSummary] = useState("");
    let [summaryLoading, setSummaryLoading] = useState(false);

    let [captionsOn, setCaptionsOn] = useState(false);
    let [currentCaption, setCurrentCaption] = useState("");
    let recognitionRef = useRef(null);

    useEffect(() => {
        fetchTurnCredentials();
        getPermissions();
    }, [])

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) { setVideoAvailable(true); } else { setVideoAvailable(false); }
            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) { setAudioAvailable(true); } else { setAudioAvailable(false); }
            if (navigator.mediaDevices.getDisplayMedia) { setScreenAvailable(true); } else { setScreenAvailable(false); }
            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) { localVideoref.current.srcObject = userMediaStream; }
                }
            }
        } catch (error) { console.log(error); }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) { getUserMedia(); }
    }, [video, audio])

 let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    if (!hasConnectedRef.current) {
        hasConnectedRef.current = true;
        connectToSocketServer(roomPassword);
    }
}
    let getUserMediaSuccess = (stream) => {
        try { window.localStream.getTracks().forEach(track => track.stop()) } catch (e) { console.log(e) }
        window.localStream = stream
        localVideoref.current.srcObject = stream

        for (let id in connections) {
            if (id === socketIdRef.current) continue
            window.localStream.getTracks().forEach(track => connections[id].addTrack(track, window.localStream))
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => { socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription })) })
                    .catch(e => console.log(e))
            })
        }

        stream.getTracks().forEach(track => track.onended = () => {
            setVideo(false); setAudio(false);
            try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) { console.log(e) }
            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream
            for (let id in connections) {
                window.localStream.getTracks().forEach(track => connections[id].addTrack(track, window.localStream))
                connections[id].createOffer().then((description) => {
                    connections[id].setLocalDescription(description)
                        .then(() => { socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription })) })
                        .catch(e => console.log(e))
                })
            }
        })
    }

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            navigator.mediaDevices.getUserMedia({ video: video, audio: audio })
                .then(getUserMediaSuccess).then((stream) => { }).catch((e) => console.log(e))
        } else {
            try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) { }
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try { window.localStream.getTracks().forEach(track => track.stop()) } catch (e) { console.log(e) }
        window.localStream = stream
        localVideoref.current.srcObject = stream
        for (let id in connections) {
            if (id === socketIdRef.current) continue
            window.localStream.getTracks().forEach(track => connections[id].addTrack(track, window.localStream))
            connections[id].createOffer().then((description) => {
                connections[id].setLocalDescription(description)
                    .then(() => { socketRef.current.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription })) })
                    .catch(e => console.log(e))
            })
        }
        stream.getTracks().forEach(track => track.onended = () => {
            setScreen(false)
            try { let tracks = localVideoref.current.srcObject.getTracks(); tracks.forEach(track => track.stop()) } catch (e) { console.log(e) }
            let blackSilence = (...args) => new MediaStream([black(...args), silence()])
            window.localStream = blackSilence()
            localVideoref.current.srcObject = window.localStream
            getUserMedia()
        })
    }
    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message)

        // ✅ Connection exist karta hai ya nahi check karo
        if (!connections[fromId]) {
            console.log("Connection not ready yet for:", fromId);
            return;
        }

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }))
                            }).catch(e => console.log(e))
                        }).catch(e => console.log(e))
                    }
                }).catch(e => console.log(e))
            }
            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e))
            }
        }
    }



    let connectToSocketServer = (password = "") => {
        socketRef.current = io.connect(server_url, { secure: false })
        socketRef.current.on('signal', gotMessageFromServer)

        socketRef.current.on('connect', () => {
            socketRef.current.emit('join-call', window.location.href, password, username)
            socketIdRef.current = socketRef.current.id
            socketRef.current.on('chat-message', addMessage)

            socketRef.current.on('wrong-password', () => {
                setPasswordError("❌ Wrong password! Please try again.")
                setAskForUsername(true)
                socketRef.current.disconnect()
            })

            socketRef.current.on('room-has-password', (hasPassword) => {
                setRoomIsLocked(hasPassword)
            })

            socketRef.current.on('user-left', (id) => {
                setVideos((videos) => videos.filter((video) => video.socketId !== id))
                setParticipantCount(prev => Math.max(1, prev - 1))
                setRaisedHands(prev => prev.filter(h => h.socketId !== id))
            })

            socketRef.current.on('user-joined', (id, clients, allUsernames) => {
                setParticipantCount(clients.length)
                clients.forEach((socketListId) => {
                    if (connections[socketListId]) return;
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections)
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }))
                        }
                    }
                    connections[socketListId].ontrack = (event) => {
                        let videoExists = videoRef.current.find(video => video.socketId === socketListId);
                        if (videoExists) {
                            setVideos(videos => {
                                const updatedVideos = videos.map(video =>
                                    video.socketId === socketListId ? { ...video, stream: event.streams[0] } : video
                                );
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        } else {
                            let newVideo = { socketId: socketListId, stream: event.streams[0], autoplay: true, playsinline: true, username: allUsernames ? allUsernames[socketListId] : "Guest" };
                            setVideos(videos => {
                                const updatedVideos = [...videos, newVideo];
                                videoRef.current = updatedVideos;
                                return updatedVideos;
                            });
                        }
                    };
                    if (window.localStream !== undefined && window.localStream !== null) {
                        window.localStream.getTracks().forEach(track => connections[socketListId].addTrack(track, window.localStream))
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()])
                        window.localStream = blackSilence()
                        window.localStream.getTracks().forEach(track => connections[socketListId].addTrack(track, window.localStream))
                    }
                })
                if (id === socketIdRef.current) {
                    for (let id2 in connections) {
                        if (id2 === socketIdRef.current) continue
                        try {
                            window.localStream.getTracks().forEach(track => connections[id2].addTrack(track, window.localStream))
                        } catch (e) { }
                        connections[id2].createOffer().then((description) => {
                            connections[id2].setLocalDescription(description)
                                .then(() => { socketRef.current.emit('signal', id2, JSON.stringify({ 'sdp': connections[id2].localDescription })) })
                                .catch(e => console.log(e))
                        })
                    }
                }
            })

            socketRef.current.on('raise-hand', (senderUsername, socketId) => {
                setRaisedHands(prev => {
                    if (prev.find(h => h.socketId === socketId)) return prev;
                    return [...prev, { username: senderUsername, socketId }]
                })
                setTimeout(() => {
                    setRaisedHands(prev => prev.filter(h => h.socketId !== socketId))
                }, 5000)
            })
            socketRef.current.on('lower-hand', (socketId) => {
                setRaisedHands(prev => prev.filter(h => h.socketId !== socketId))
            })

            socketRef.current.on('emoji-reaction', (emoji, senderUsername, socketId) => {
                const id = Date.now() + Math.random();
                setFloatingEmojis(prev => [...prev, { id, emoji, username: senderUsername }])
                setTimeout(() => {
                    setFloatingEmojis(prev => prev.filter(e => e.id !== id))
                }, 3000)
            })
        })
    }

    let silence = () => {
        let ctx = new AudioContext()
        let oscillator = ctx.createOscillator()
        let dst = oscillator.connect(ctx.createMediaStreamDestination())
        oscillator.start(); ctx.resume()
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false })
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height })
        canvas.getContext('2d').fillRect(0, 0, width, height)
        let stream = canvas.captureStream()
        return Object.assign(stream.getVideoTracks()[0], { enabled: false })
    }

    let handleVideo = () => { setVideo(!video); }
    let handleAudio = () => { setAudio(!audio) }

    useEffect(() => {
        if (screen !== undefined) { getDislayMedia(); }
    }, [screen])

    let handleScreen = () => { setScreen(!screen); }

    let startTimer = () => {
        timerRef.current = setInterval(() => { setCallDuration(prev => prev + 1); }, 1000);
    }
    let stopTimer = () => { clearInterval(timerRef.current); }
    let formatTime = (seconds) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    }
    let checkConnectionQuality = () => {
        if (!navigator.onLine) {
            setConnectionQuality("poor");
            return;
        }
        // Simple check based on navigator connection API
        if (navigator.connection) {
            const effectiveType = navigator.connection.effectiveType;
            if (effectiveType === "4g") setConnectionQuality("good");
            else if (effectiveType === "3g") setConnectionQuality("medium");
            else setConnectionQuality("poor");
        } else {
            setConnectionQuality("good"); // default agar API support nahi
        }
    }

    useEffect(() => {
        checkConnectionQuality();
        const interval = setInterval(checkConnectionQuality, 5000);
        window.addEventListener('online', checkConnectionQuality);
        window.addEventListener('offline', checkConnectionQuality);
        return () => {
            clearInterval(interval);
            window.removeEventListener('online', checkConnectionQuality);
            window.removeEventListener('offline', checkConnectionQuality);
        }
    }, [])

    let handleRaiseHand = () => {
        if (!handRaised) {
            setHandRaised(true)
            socketRef.current.emit('raise-hand', username, socketIdRef.current)
            handTimerRef.current = setTimeout(() => {
                setHandRaised(false)
                socketRef.current.emit('lower-hand', socketIdRef.current)
            }, 5000)
        } else {
            setHandRaised(false)
            clearTimeout(handTimerRef.current)
            socketRef.current.emit('lower-hand', socketIdRef.current)
        }
    }

    let handleEmojiReaction = (emoji) => {
        socketRef.current.emit('emoji-reaction', emoji, username)
        setShowEmojiPicker(false)
    }

    let startBackgroundBlur = async () => {
        try {
            const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
            const segmenterConfig = { runtime: 'tfjs', modelType: 'general' };
            segmenterRef.current = await bodySegmentation.createSegmenter(model, segmenterConfig);
            blurIntervalRef.current = setInterval(async () => {
                if (
                    localVideoref.current &&
                    blurCanvasRef.current &&
                    segmenterRef.current &&
                    localVideoref.current.videoWidth > 0 &&
                    localVideoref.current.videoHeight > 0
                ) {
                    const segmentation = await segmenterRef.current.segmentPeople(localVideoref.current);
                    const canvas = blurCanvasRef.current;
                    canvas.width = localVideoref.current.videoWidth;
                    canvas.height = localVideoref.current.videoHeight;
                    await bodySegmentation.drawBokehEffect(canvas, localVideoref.current, segmentation, 8, 3, false);
                }
            }, 150);
        } catch (e) { console.log("Blur error:", e); setBlurBackground(false); }
    }

    let stopBackgroundBlur = () => {
        clearInterval(blurIntervalRef.current);
        if (blurCanvasRef.current) {
            const ctx = blurCanvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, blurCanvasRef.current.width, blurCanvasRef.current.height);
        }
        if (segmenterRef.current) {
            segmenterRef.current.dispose && segmenterRef.current.dispose();
            segmenterRef.current = null;
        }
    }
    let handleBlurToggle = () => {
        alert("🌫️ Background blur feature is temporarily under maintenance. Coming soon!");
    }


    let startRecording = () => {
        try {
            recordedChunksRef.current = [];
            const stream = localVideoref.current.srcObject;
            if (!stream) { alert("Camera stream nahi mili!"); return; }
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9,opus' });
            mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) recordedChunksRef.current.push(event.data);
            };
            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                const now = new Date();
                a.download = `MeetFlow-Recording-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}.webm`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            };
            mediaRecorder.start(1000);
            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);
            setRecordingTime(0);
            recordingTimerRef.current = setInterval(() => { setRecordingTime(prev => prev + 1); }, 1000);
        } catch (e) { console.log("Recording error:", e); }
    }

    let stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        clearInterval(recordingTimerRef.current);
        setIsRecording(false);
        setRecordingTime(0);
    }

    let handleRecordingToggle = () => {
        if (!isRecording) { startRecording(); } else { stopRecording(); }
    }

    let generateSummary = async () => {
        if (messages.length === 0) {
            setSummary("No chat messages found in this meeting to summarize.");
            setShowSummary(true);
            return;
        }

        setSummaryLoading(true);
        setShowSummary(true);

        try {
            const chatText = messages.map(m => `${m.sender}: ${m.data}`).join("\n");

            const response = await fetch(
                "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ inputs: chatText })
                }
            );

            const data = await response.json();

            if (data.error) {
                setSummary("⏳ Model loading ho raha hai, 20 second baad dobara try karo.");
            } else if (data[0] && data[0].summary_text) {
                setSummary("📋 Meeting Summary\n\n" + data[0].summary_text);
            } else {
                setSummary("❌ Summary generate nahi ho payi. Dobara try karo.");
            }
        } catch (e) {
            setSummary("❌ Summary error. Internet check karo.");
            console.log("Summary error:", e);
        }

        setSummaryLoading(false);
    }

    let startCaptions = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Tera browser Speech Recognition support nahi karta. Chrome use karo!");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-IN";

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = event.resultIndex; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript;
            }
            setCurrentCaption(transcript);

            if (event.results[event.results.length - 1].isFinal) {
                setTimeout(() => setCurrentCaption(""), 3000);
            }
        };

        recognition.onerror = (event) => {
            console.log("Speech recognition error:", event.error);
        };

        recognition.onend = () => {
            if (captionsOn) {
                recognition.start();
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    }

    let stopCaptions = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setCurrentCaption("");
    }

    let handleCaptionsToggle = () => {
        if (!captionsOn) {
            setCaptionsOn(true);
            startCaptions();
        } else {
            setCaptionsOn(false);
            stopCaptions();
        }
    }

    let handleEndCall = () => {
        try {
            let tracks = localVideoref.current.srcObject.getTracks()
            tracks.forEach(track => track.stop())
        } catch (e) { }
        if (isRecording) { stopRecording(); }
        if (captionsOn) { stopCaptions(); }
        stopTimer();
        stopBackgroundBlur();
        window.location.href = "/"
    }

    const addMessage = (data, sender, socketIdSender) => {
        setMessages((prevMessages) => [...prevMessages, { sender: sender, data: data }]);
        if (socketIdSender !== socketIdRef.current) {
            setNewMessages((prevNewMessages) => prevNewMessages + 1);
        }
    };

    let sendMessage = () => {
        socketRef.current.emit('chat-message', message, username)
        setMessage("");
    }

    let connect = () => {
        localStorage.setItem("meetflow_username", username);
        setPasswordError("")
        setAskForUsername(false);
        getMedia();
        startTimer();
    }

    return (
        <div>
            {askForUsername === true ?

                /* ── LOBBY ── */
                <div style={{
                    minHeight: "100vh", background: "#f8f8fc",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: "20px"
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ width: "40px", height: "40px", background: "#534AB7", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                            </svg>
                        </div>
                        <span style={{ fontSize: "22px", fontWeight: "700", color: "#534AB7", letterSpacing: "-0.5px" }}>MeetFlow</span>
                    </div>

                    <h2 style={{ fontSize: "20px", color: "#1a1a2e", fontWeight: "600" }}>Enter your name to join</h2>

                    <div style={{ width: "320px", height: "200px", borderRadius: "12px", overflow: "hidden", border: "2px solid #e0e0ef", background: "#000" }}>
                        <video ref={localVideoref} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }}></video>
                    </div>

                    {passwordError && (
                        <div style={{ background: "#fff0f0", color: "#cc0000", padding: "10px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", border: "1px solid #ffd0d0" }}>
                            {passwordError}
                        </div>
                    )}

                    <TextField
                        id="username-input" label="Your name"
                        value={username} onChange={e => setUsername(e.target.value)}
                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#534AB7" } },
                            "& .MuiInputLabel-root.Mui-focused": { color: "#534AB7" }
                        }}
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "220px" }}>
                        <TextField
                            id="password-input"
                            label="Room Password (optional)"
                            type="password"
                            value={roomPassword}
                            onChange={e => setRoomPassword(e.target.value)}
                            variant="outlined"
                            onKeyDown={(e) => e.key === "Enter" && connect()}
                            sx={{
                                "& .MuiOutlinedInput-root": { "&.Mui-focused fieldset": { borderColor: "#534AB7" } },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#534AB7" }
                            }}
                        />
                        <p
                            style={{
                                fontSize: "12px",
                                color: "#6B7280",
                                marginTop: "8px",
                                textAlign: "center",
                                lineHeight: "1.5",
                            }}
                        >
                            Use a password if your meeting is private or access is restricted.
                        </p>
                    </div>

                    <Button variant="contained" onClick={connect}
                        style={{ background: "#534AB7", padding: "14px 28px", fontWeight: "600" }}>
                        Join Now
                    </Button>
                </div>

                :

                /* ── MEETING ROOM ── */
                <div className={styles.meetVideoContainer}>

                    {/* TOP BAR */}
                    <div style={{
                        position: "fixed", top: 0, left: 0, right: 0,
                        padding: "10px 20px", display: "flex", alignItems: "center",
                        justifyContent: "space-between", background: "rgba(0,0,0,0.5)", zIndex: 999
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "28px", height: "28px", background: "#534AB7", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" />
                                </svg>
                            </div>
                            <span style={{ color: "#fff", fontWeight: "700", fontSize: "16px" }}>MeetFlow</span>
                            {roomIsLocked && (
                                <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(83,74,183,0.6)", padding: "3px 10px", borderRadius: "12px" }}>
                                    <LockIcon style={{ color: "#c7c2f8", fontSize: "14px" }} />
                                    <span style={{ color: "#c7c2f8", fontSize: "12px", fontWeight: "600" }}>Private</span>
                                </div>
                            )}
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            {isRecording && (
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(220,38,38,0.85)", padding: "6px 14px", borderRadius: "20px" }}>
                                    <span style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%", display: "inline-block", animation: "pulse 1s infinite" }}></span>
                                    <span style={{ color: "#fff", fontSize: "13px", fontWeight: "700" }}>REC {formatTime(recordingTime)}</span>
                                </div>
                            )}
                            {/* ✅ Connection Quality */}
                            <div style={{
                                display: "flex", alignItems: "center", gap: "4px",
                                background: "rgba(0,0,0,0.4)", padding: "6px 10px",
                                borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)"
                            }}>
                                <span style={{ fontSize: "14px" }}>
                                    {connectionQuality === "good" ? "🟢" : connectionQuality === "medium" ? "🟡" : "🔴"}
                                </span>
                                <span style={{ color: "#fff", fontSize: "11px", fontWeight: "600" }}>
                                    {connectionQuality === "good" ? "Good" : connectionQuality === "medium" ? "Fair" : "Poor"}
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(83,74,183,0.8)", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.2)" }}>
                                <PeopleIcon style={{ color: "#fff", fontSize: "18px" }} />
                                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600" }}>
                                    {participantCount} {participantCount === 1 ? "participant" : "participants"}
                                </span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(0,0,0,0.4)", padding: "6px 14px", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.15)" }}>
                                <span style={{ width: "8px", height: "8px", background: "#ff4444", borderRadius: "50%", display: "inline-block" }}></span>
                                <span style={{ color: "#fff", fontSize: "14px", fontWeight: "600", fontFamily: "monospace" }}>{formatTime(callDuration)}</span>
                            </div>
                        </div>
                    </div>

                    {/* RAISED HANDS */}
                    {raisedHands.length > 0 && (
                        <div style={{ position: "fixed", top: "60px", left: "20px", zIndex: 998, display: "flex", flexDirection: "column", gap: "8px" }}>
                            {raisedHands.map((hand, index) => (
                                <div key={index} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255,193,7,0.95)", padding: "8px 14px", borderRadius: "12px", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                                    <span style={{ fontSize: "18px" }}>✋</span>
                                    <span style={{ color: "#1a1a2e", fontWeight: "600", fontSize: "14px" }}>{hand.username} raised hand</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* FLOATING EMOJIS */}
                    <div style={{ position: "fixed", bottom: "100px", left: "50%", transform: "translateX(-50%)", zIndex: 998, display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", pointerEvents: "none" }}>
                        {floatingEmojis.map((item) => (
                            <div key={item.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", animation: "floatUp 3s ease-out forwards" }}>
                                <span style={{ fontSize: "36px" }}>{item.emoji}</span>
                                <span style={{ color: "#fff", fontSize: "11px", fontWeight: "600", background: "rgba(0,0,0,0.5)", padding: "2px 8px", borderRadius: "10px" }}>
                                    {item.username}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* EMOJI PICKER */}
                    {showEmojiPicker && (
                        <div style={{
                            position: "fixed", bottom: "90px", left: "50%", transform: "translateX(-50%)",
                            background: "rgba(30,30,50,0.95)", borderRadius: "16px",
                            padding: "12px 16px", display: "flex", gap: "10px",
                            zIndex: 1000, border: "1px solid rgba(255,255,255,0.15)",
                            boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
                        }}>
                            {EMOJIS.map((emoji) => (
                                <button key={emoji} onClick={() => handleEmojiReaction(emoji)}
                                    style={{ fontSize: "28px", background: "none", border: "none", cursor: "pointer", borderRadius: "8px", padding: "4px 8px" }}
                                    onMouseEnter={e => e.target.style.transform = "scale(1.3)"}
                                    onMouseLeave={e => e.target.style.transform = "scale(1)"}
                                >
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* AI SUMMARY MODAL */}
                    {showSummary && (
                        <div style={{
                            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                            background: "rgba(0,0,0,0.7)", zIndex: 2000,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            padding: "1rem"
                        }}>
                            <div style={{
                                background: "#ffffff", borderRadius: "16px",
                                padding: "2rem", maxWidth: "500px", width: "100%",
                                maxHeight: "80vh", overflow: "auto",
                                boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <div style={{ width: "36px", height: "36px", background: "#534AB7", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: "18px" }}>✨</span>
                                        </div>
                                        <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e", margin: 0 }}>
                                            AI Meeting Summary
                                        </h2>
                                    </div>
                                    <button onClick={() => setShowSummary(false)}
                                        style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#888", lineHeight: 1 }}>
                                        ×
                                    </button>
                                </div>

                                {summaryLoading ? (
                                    <div style={{ textAlign: "center", padding: "2rem" }}>
                                        <div style={{ fontSize: "32px", marginBottom: "12px" }}>✨</div>
                                        <p style={{ color: "#6b6b80", fontSize: "15px" }}>Generating summary...</p>
                                    </div>
                                ) : (
                                    <div style={{ lineHeight: "1.7" }}>
                                        {summary.split('\n').map((line, i) => (
                                            <p key={i} style={{
                                                fontSize: "14px",
                                                color: "#1a1a2e",
                                                fontWeight: i === 0 ? "700" : "400",
                                                marginBottom: "8px"
                                            }}>
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {!summaryLoading && (
                                    <div style={{ marginTop: "1.5rem", display: "flex", gap: "10px" }}>
                                        <button
                                            onClick={() => { navigator.clipboard.writeText(summary); }}
                                            style={{ flex: 1, background: "#EEEDFE", color: "#534AB7", border: "none", borderRadius: "8px", padding: "10px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                                            📋 Copy Summary
                                        </button>
                                        <button onClick={() => setShowSummary(false)}
                                            style={{ flex: 1, background: "#534AB7", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                                            Close
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* LIVE CAPTIONS */}
                    {captionsOn && currentCaption && (
                        <div style={{
                            position: "fixed", bottom: "90px", left: "50%", transform: "translateX(-50%)",
                            maxWidth: "80%", background: "rgba(0,0,0,0.8)",
                            color: "#fff", padding: "10px 20px", borderRadius: "10px",
                            fontSize: "16px", textAlign: "center", zIndex: 997,
                            fontWeight: "500"
                        }}>
                            {currentCaption}
                        </div>
                    )}

                    <style>{`
                        @keyframes floatUp {
                            0%   { opacity: 1; transform: translateY(0px) scale(1); }
                            50%  { opacity: 1; transform: translateY(-80px) scale(1.2); }
                            100% { opacity: 0; transform: translateY(-160px) scale(0.8); }
                        }
                        @keyframes pulse {
                            0%, 100% { opacity: 1; }
                            50% { opacity: 0.3; }
                        }
                    `}</style>

                    {/* Chat panel */}
                    {showModal ?
                        <div className={styles.chatRoom}>
                            <div className={styles.chatContainer}>
                                <h1>Chat</h1>
                                <div className={styles.chattingDisplay}>
                                    {messages.length !== 0 ? messages.map((item, index) => (
                                        <div style={{ marginBottom: "20px" }} key={index}>
                                            <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                                            <p>{item.data}</p>
                                        </div>
                                    )) : <p>No Messages Yet</p>}
                                </div>
                                <div className={styles.chattingArea}>
                                    <TextField value={message} onChange={(e) => setMessage(e.target.value)} id="outlined-basic" label="Enter Your chat" variant="outlined" />
                                    <Button variant='contained' onClick={sendMessage}>Send</Button>
                                </div>
                            </div>
                        </div>
                        : <></>}

                    {/* Control buttons */}
                    <div className={styles.buttonContainers}>
                        <IconButton onClick={handleVideo} style={{ color: "white" }}>
                            {(video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
                        </IconButton>
                        <IconButton onClick={handleEndCall} style={{ color: "red" }}>
                            <CallEndIcon />
                        </IconButton>
                        <IconButton onClick={handleAudio} style={{ color: "white" }}>
                            {audio === true ? <MicIcon /> : <MicOffIcon />}
                        </IconButton>
                        {screenAvailable === true ?
                            <IconButton onClick={handleScreen} style={{ color: "white" }}>
                                {screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
                            </IconButton> : <></>}
                        <IconButton onClick={handleRaiseHand}
                            style={{ color: handRaised ? "#ffc107" : "white", background: handRaised ? "rgba(255,193,7,0.2)" : "transparent", borderRadius: "50%" }}>
                            <PanToolIcon />
                        </IconButton>
                        <IconButton onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            style={{ color: showEmojiPicker ? "#ffc107" : "white", background: showEmojiPicker ? "rgba(255,193,7,0.2)" : "transparent", borderRadius: "50%", fontSize: "20px" }}>
                            😊
                        </IconButton>
                        <IconButton onClick={handleBlurToggle}
                            style={{ color: blurBackground ? "#534AB7" : "white", background: blurBackground ? "rgba(83,74,183,0.3)" : "transparent", borderRadius: "50%", fontSize: "18px" }}>
                            🌫️
                        </IconButton>
                        <IconButton onClick={handleRecordingToggle}
                            style={{ color: isRecording ? "#ff4444" : "white", background: isRecording ? "rgba(255,68,68,0.2)" : "transparent", borderRadius: "50%" }}>
                            {isRecording ? <StopIcon /> : <FiberManualRecordIcon />}
                        </IconButton>
                        <IconButton onClick={generateSummary}
                            style={{ color: showSummary ? "#534AB7" : "white", background: showSummary ? "rgba(83,74,183,0.3)" : "transparent", borderRadius: "50%", fontSize: "18px" }}
                            title="AI Meeting Summary">
                            ✨
                        </IconButton>

                        <IconButton onClick={handleCaptionsToggle}
                            style={{ color: captionsOn ? "#534AB7" : "white", background: captionsOn ? "rgba(83,74,183,0.3)" : "transparent", borderRadius: "50%" }}
                            title={captionsOn ? "Turn off captions" : "Turn on live captions"}>
                            <SubtitlesIcon />
                        </IconButton>

                        <Badge badgeContent={newMessages} max={999} color='orange'>
                            <IconButton onClick={() => setModal(!showModal)} style={{ color: "white" }}>
                                <ChatIcon />
                            </IconButton>
                        </Badge>
                    </div>

                    {/* Local video */}
                    <video className={styles.meetUserVideo} ref={localVideoref} autoPlay muted playsInline></video>

                    {/* ✅ Apna naam corner mein */}
                    <div style={{
                        position: "absolute", bottom: "10px", left: "10px",
                        background: "rgba(0,0,0,0.6)", color: "#fff",
                        padding: "4px 10px", borderRadius: "8px",
                        fontSize: "12px", fontWeight: "600", zIndex: 5
                    }}>
                        {username} (You)
                    </div>

                    {/* Blur canvas */}
                    {blurBackground && (
                        <canvas ref={blurCanvasRef}
                            style={{ position: "absolute", bottom: "10px", right: "10px", width: "200px", height: "150px", borderRadius: "10px", zIndex: 10, border: "2px solid #534AB7" }}
                        />
                    )}

                    {/* Remote videos */}
                    <div className={styles.conferenceView}>
                        {videos.map((video) => (
                            <div
                                key={video.socketId}
                                onClick={() => setPinnedVideo(pinnedVideo === video.socketId ? null : video.socketId)}
                                style={{
                                    position: "relative",
                                    cursor: "pointer",
                                    gridColumn: pinnedVideo === video.socketId ? "1 / -1" : "auto",
                                    order: pinnedVideo === video.socketId ? -1 : 0,
                                    width: pinnedVideo === video.socketId ? "min(90vw, 900px)" : undefined,
                                    height: pinnedVideo === video.socketId ? "min(75vh, 600px)" : undefined,
                                    margin: pinnedVideo === video.socketId ? "0 auto" : undefined,
                                    border: pinnedVideo === video.socketId ? "3px solid #534AB7" : "3px solid transparent",
                                    borderRadius: "12px",
                                    boxShadow: pinnedVideo === video.socketId ? "0 8px 30px rgba(83,74,183,0.5)" : "none",
                                    transition: "all 0.25s ease",
                                    overflow: "hidden"
                                }}
                            >
                                <div style={{
                                    position: "absolute", bottom: "8px", left: "8px",
                                    background: "rgba(0,0,0,0.6)", color: "#fff",
                                    padding: "4px 10px", borderRadius: "8px",
                                    fontSize: "12px", fontWeight: "600", zIndex: 5
                                }}>
                                    {video.username || "Guest"} {pinnedVideo === video.socketId ? "📌" : ""}
                                </div>
                                <video data-socket={video.socketId}
                                    ref={ref => {
                                        if (!ref) return;
                                        if (video.stream && ref.srcObject !== video.stream) {
                                            ref.srcObject = video.stream;
                                            const playPromise = ref.play();
                                            if (playPromise !== undefined) {
                                                playPromise.catch(e => {
                                                    if (e.name !== "AbortError") {
                                                        console.log("Remote play error:", e);
                                                    }
                                                });
                                            }
                                        }
                                    }}
                                    autoPlay
                                    playsInline
                                    muted={false}
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }}>
                                </video>
                            </div>
                        ))}
                    </div>

                </div>
            }
        </div>
    )
}
