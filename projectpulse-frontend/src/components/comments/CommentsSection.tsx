import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Avatar, TextField, Paper, List, ListItem, ListItemAvatar, ListItemText, IconButton, ListItemButton } from "@mui/material";
import { Send } from "@mui/icons-material";

import { collaborationService } from "../../services/collaborationService";
import type { Comment, User, EntityType } from "../../types/collaboration";
import { Brand } from "../../theme/colors";

// Simple relative time formatter
const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

interface CommentsSectionProps {
    entityType: EntityType;
    entityId: string;
}

const CommentsSection = ({ entityType, entityId }: CommentsSectionProps) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Mention State
    const [mentionOpen, setMentionOpen] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [cursorPos, setCursorPos] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadComments();
        loadUsers();
    }, [entityId]);

    const loadComments = async () => {
        const data = await collaborationService.getComments(entityType, entityId);
        setComments(data);
    };

    const loadUsers = async () => {
        const u = await collaborationService.getUsers();
        setUsers(u);
    };

    const handleSend = async () => {
        if (!newMessage.trim()) return;
        setLoading(true);
        try {
            await collaborationService.postComment(entityType, entityId, newMessage);
            setNewMessage("");
            loadComments();
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewMessage(val);

        // Simple mention trigger check: last char is @
        // For better UX, we'd check word boundaries, but keeping it simple as per "UI Only" reqs
        const cursor = e.target.selectionStart || 0;
        setCursorPos(cursor);

        const lastChar = val.slice(cursor - 1, cursor);
        if (lastChar === "@") {
            setMentionOpen(true);
        } else if (mentionOpen && lastChar === " ") {
            setMentionOpen(false);
        }
    };

    const insertMention = (userName: string) => {
        const before = newMessage.slice(0, cursorPos);
        const after = newMessage.slice(cursorPos);
        // We triggered on @, so we likely have @ at the end of 'before'
        // But if user typed "@Ali", we need to handle replacing. 
        // Logic: Replace the last word starting with @ with @Name 

        // Simplified: Just append at cursor if we assume immediate select
        setNewMessage(before + userName + " " + after);
        setMentionOpen(false);
        inputRef.current?.focus();
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <Box sx={{ flex: 1, overflowY: "auto", mb: 2, display: "flex", flexDirection: "column", gap: 2, px: 1 }}>
                {comments.length === 0 ? <Typography variant="caption" color="text.secondary" textAlign="center" py={2}>No comments yet.</Typography> :
                    comments.map(c => (
                        <Box key={c.id} sx={{ display: "flex", gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, fontSize: "14px", bgcolor: Brand.primary }}>{c.user.name.charAt(0)}</Avatar>
                            <Box sx={{ bgcolor: "white", p: 1.5, borderRadius: "0 12px 12px 12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", maxWidth: "85%" }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
                                    <Typography variant="subtitle2" fontWeight={700} fontSize="13px" mr={1}>{c.user.name}</Typography>
                                    <Typography variant="caption" color="text.secondary" fontSize="11px">{timeAgo(c.createdAt)}</Typography>
                                </Box>
                                <Typography variant="body2" fontSize="13px" color="#333" sx={{ whiteSpace: "pre-wrap" }}>
                                    {c.message.split(/(@\w+(?: \w+)?)/g).map((part, i) =>
                                        part.startsWith("@") ? <Box component="span" key={i} sx={{ color: Brand.primary, fontWeight: 600 }}>{part}</Box> : part
                                    )}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
            </Box>

            <Box sx={{ position: "relative" }}>
                {mentionOpen && (
                    <Paper sx={{ position: "absolute", bottom: "100%", left: 0, mb: 1, width: 200, maxHeight: 150, overflow: "auto", zIndex: 10 }}>
                        <List dense>
                            {users.map(u => (
                                <ListItem key={u.id} disablePadding>
                                    <ListItemButton onClick={() => insertMention(u.name)}>
                                        <ListItemAvatar><Avatar sx={{ width: 24, height: 24, fontSize: "12px" }}>{u.name.charAt(0)}</Avatar></ListItemAvatar>
                                        <ListItemText primary={u.name} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a comment... (@ to mention)"
                        value={newMessage}
                        onChange={handleInputChange}
                        inputRef={inputRef}
                        multiline
                        maxRows={3}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: "20px", bgcolor: "white" } }}
                    />
                    <IconButton color="primary" onClick={handleSend} disabled={loading || !newMessage.trim()} sx={{ color: Brand.primary }}>
                        <Send />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
};

export default CommentsSection;
