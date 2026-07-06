import React, { useContext, useState } from 'react'
import withAuth from '../utils/withAuth'
import { useNavigate } from 'react-router-dom'
import "../App.css";
import { Button, IconButton, TextField, Snackbar } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { AuthContext } from '../contexts/AuthContext';

function HomeComponent() {

    let navigate = useNavigate();
    const [meetingCode, setMeetingCode] = useState("");
    const [darkMode, setDarkMode] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    const [copySuccess, setCopySuccess] = useState(false);

    const { addToUserHistory } = useContext(AuthContext);

    let handleJoinVideoCall = async () => {
        await addToUserHistory(meetingCode)
        navigate(`/${meetingCode}`)
    }

    let handleStartMeeting = () => {
        const code = Math.random().toString(36).substring(2, 8);
        setGeneratedCode(code);
        navigate(`/${code}`)
    }

    let handleCopyLink = () => {
        const link = `${window.location.origin}/${generatedCode}`;
        navigator.clipboard.writeText(link);
        setCopySuccess(true);
    }

    const theme = {
        bg: darkMode ? "#0f0f1a" : "#ffffff",
        navBg: darkMode ? "#1a1a2e" : "#ffffff",
        navBorder: darkMode ? "#2a2a3e" : "#f0f0f5",
        text: darkMode ? "#ffffff" : "#1a1a2e",
        subText: darkMode ? "#a0a0b8" : "#6b6b80",
        cardBg: darkMode ? "#1a1a2e" : "#f8f8fc",
        cardBorder: darkMode ? "#2a2a3e" : "#e8e8f5",
        inputBorder: darkMode ? "#3a3a5e" : "#e0e0ef",
        inputBg: darkMode ? "#0f0f1a" : "#fafafa",
        inputText: darkMode ? "#ffffff" : "#1a1a2e",
    }

    return (
        <div style={{ background: theme.bg, minHeight: "100vh", transition: "all 0.3s" }}>

            {/* ✅ Mobile responsive CSS */}
            <style>{`
                .meet-navbar { padding: 14px 28px; }
                .meet-main   { padding: 2rem; gap: 3rem; }
                .meet-title  { font-size: 36px; }
                .meet-image  { display: block; }

                @media (max-width: 768px) {
                    .meet-navbar { padding: 12px 16px !important; }
                    .meet-main   { padding: 1.5rem 1rem !important; gap: 1.5rem !important; }
                    .meet-title  { font-size: 28px !important; }
                }

                @media (max-width: 480px) {
                    .meet-navbar { padding: 10px 12px !important; }
                    .meet-main   { padding: 1rem !important; gap: 1rem !important; flex-direction: column !important; align-items: flex-start !important; }
                    .meet-title  { font-size: 24px !important; }
                    .meet-image  { display: none !important; }
                    .meet-hide-mobile { display: none !important; }
                    .meet-btn-row { flex-direction: column !important; }
                    .meet-btn-row button { width: 100% !important; }
                }
            `}</style>

            {/* NAVBAR */}
            <div className="meet-navbar" style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: theme.navBg, borderBottom: `1px solid ${theme.navBorder}`,
                position: "sticky", top: 0, zIndex: 100, transition: "all 0.3s"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "34px", height: "34px", background: "#534AB7", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="23 7 16 12 23 17 23 7"/>
                            <rect x="1" y="5" width="15" height="14" rx="2"/>
                        </svg>
                    </div>
                    <h2 style={{ color: "#534AB7", fontWeight: "700", letterSpacing: "-0.5px", fontSize: "20px" }}>MeetFlow</h2>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <IconButton onClick={() => setDarkMode(!darkMode)}
                        style={{ color: darkMode ? "#f5c542" : "#534AB7", background: darkMode ? "#2a2a3e" : "#EEEDFE", borderRadius: "8px", padding: "8px" }}>
                        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>
                    <IconButton onClick={() => { navigate("/history") }} style={{ color: theme.text }}>
                        <RestoreIcon />
                    </IconButton>
                    <p className="meet-hide-mobile" style={{ color: theme.subText, fontSize: "14px" }}>History</p>
                    <Button onClick={() => { localStorage.removeItem("token"); navigate("/auth") }}
                        style={{ color: "#534AB7", fontWeight: "600", fontSize: "13px" }}>
                        Logout
                    </Button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="meet-main" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                minHeight: "calc(100vh - 65px)", flexWrap: "wrap"
            }}>
                <div style={{ maxWidth: "460px", width: "100%" }}>

                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        background: darkMode ? "#2a2a3e" : "#EEEDFE", color: "#534AB7",
                        padding: "5px 14px", borderRadius: "20px", fontSize: "12px",
                        fontWeight: "600", marginBottom: "1.25rem", letterSpacing: "0.05em"
                    }}>
                        <span style={{ width: "7px", height: "7px", background: "#534AB7", borderRadius: "50%", display: "inline-block" }}></span>
                        WebRTC · Real-time · Secure
                    </div>

                    <h2 className="meet-title" style={{
                        fontWeight: "700", color: theme.text,
                        letterSpacing: "-1px", lineHeight: "1.2", marginBottom: "12px"
                    }}>
                        Connect · Collaborate<br />
                        <span style={{ color: "#534AB7" }}>Communicate</span>
                    </h2>

                    <p style={{ color: theme.subText, marginBottom: "28px", fontSize: "15px", lineHeight: "1.6" }}>
                        Start or join a meeting in seconds. No plugins, no complexity.
                    </p>

                    {/* JOIN MEETING */}
                    <div className="meet-btn-row" style={{ display: 'flex', gap: "10px", marginBottom: "12px" }}>
                        <TextField
                            onChange={e => setMeetingCode(e.target.value)}
                            id="outlined-basic" label="Meeting Code" variant="outlined"
                            fullWidth
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    background: theme.inputBg,
                                    "& fieldset": { borderColor: theme.inputBorder },
                                    "&.Mui-focused fieldset": { borderColor: "#534AB7" },
                                    "& input": { color: theme.inputText }
                                },
                                "& .MuiInputLabel-root": { color: theme.subText },
                                "& .MuiInputLabel-root.Mui-focused": { color: "#534AB7" }
                            }}
                        />
                        <Button onClick={handleJoinVideoCall} variant='contained'
                            style={{ background: "#534AB7", fontWeight: "600", minWidth: "80px" }}>
                            Join
                        </Button>
                    </div>

                    {/* START MEETING */}
                    <Button variant="outlined" fullWidth
                        style={{ borderColor: "#534AB7", color: "#534AB7", fontWeight: "600", padding: "10px 24px" }}
                        onClick={handleStartMeeting}>
                        + Start Meeting
                    </Button>

                    {/* COPY LINK BOX */}
                    {generatedCode && (
                        <div style={{
                            marginTop: "20px",
                            background: darkMode ? "#1a1a2e" : "#f4f3ff",
                            border: "1.5px solid #c7c2f8",
                            borderRadius: "12px",
                            padding: "14px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px"
                        }}>
                            <p style={{ fontSize: "12px", fontWeight: "600", color: "#534AB7", margin: 0 }}>
                                🔗 Share this link with others
                            </p>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <div style={{
                                    flex: 1, minWidth: "160px",
                                    background: darkMode ? "#0f0f1a" : "#fff",
                                    border: "1px solid #e0e0ef", borderRadius: "8px",
                                    padding: "8px 12px", fontSize: "12px",
                                    color: theme.subText, fontFamily: "monospace",
                                    overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"
                                }}>
                                    {window.location.origin}/{generatedCode}
                                </div>
                                <Button
                                    onClick={handleCopyLink}
                                    variant="contained"
                                    startIcon={<ContentCopyIcon />}
                                    style={{ background: "#534AB7", fontWeight: "600", whiteSpace: "nowrap", fontSize: "12px" }}
                                >
                                    Copy
                                </Button>
                            </div>
                            <p style={{ fontSize: "11px", color: theme.subText, margin: 0 }}>
                                Code: <strong style={{ color: theme.text }}>{generatedCode}</strong> — share karo!
                            </p>
                        </div>
                    )}
                </div>

                {/* RIGHT PANEL — mobile pe hide */}
                <div className="meet-image" style={{
                    background: theme.cardBg, border: `1px solid ${theme.cardBorder}`,
                    borderRadius: "16px", padding: "12px", transition: "all 0.3s"
                }}>
                    <img srcSet='/logo3.png' alt="MeetFlow"
                        style={{ borderRadius: "10px", maxWidth: "280px", width: "100%", display: "block" }} />
                </div>
            </div>

            {/* SNACKBAR */}
            <Snackbar
                open={copySuccess}
                autoHideDuration={2500}
                onClose={() => setCopySuccess(false)}
                message="✅ Meeting link copied!"
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </div>
    )
}

export default withAuth(HomeComponent)