// Fix: Added full content for the NavBar component.
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, Bell, ChevronsUpDown, ShieldCheck, Shield, MessageCircle, Check } from 'lucide-react';
import NotificationPanel from './NotificationPanel';

const NavItem: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `text-text-primary hover:text-accent transition-colors pb-1 border-b-2 ${isActive ? 'border-accent text-accent' : 'border-transparent'}`
        }
    >
        {children}
    </NavLink>
);

const NavBar: React.FC = () => {
    const { user, logout, isMfaSetup, setupMfa } = useAuthStore();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <header className="relative z-20 bg-secondary/30 backdrop-blur-sm border-b border-border">
            <nav className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center gap-3 text-2xl font-bold hover:opacity-80 transition-opacity">
                        <div className="relative">
                            <MessageCircle className="text-cyan-400" size={32}/>
                            <Check className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white" size={16}/>
                        </div>
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent font-extrabold tracking-tight">VeriChat</span>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <NavItem to="/chat">Chat</NavItem>
                        <NavItem to="/forum">Forum</NavItem>
                        <NavItem to="/qa">Q&A</NavItem>
                        <NavItem to="/docs">Docs</NavItem>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative" ref={notificationRef}>
                        <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="p-2 rounded-full hover:bg-border transition-colors">
                            <Bell className="text-text-secondary" />
                        </button>
                        <NotificationPanel isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
                    </div>
                    <div className="relative" ref={profileRef}>
                        <button onClick={() => setIsProfileOpen(prev => !prev)} className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-border transition-colors">
                            <img src={localStorage.getItem(`avatar_${user?.user.id}`) || `https://ui-avatars.com/api/?name=${encodeURIComponent(localStorage.getItem(`username_${user?.user.id}`) || user?.user.email || user?.user.id)}&size=32&background=6366f1&color=ffffff`} alt="User Avatar" className="w-8 h-8 rounded-full" />
                            <span className="hidden sm:inline text-text-primary font-medium">{localStorage.getItem(`username_${user?.user.id}`) || user?.airId?.name || user?.user.email || user?.user.id}</span>
                            <ChevronsUpDown size={16} className="text-text-secondary" />
                        </button>
                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 top-full mt-2 w-48 bg-secondary rounded-lg shadow-2xl border border-border overflow-hidden"
                                >
                                    <ul className="py-1">
                                        <li>
                                            <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-text-primary hover:bg-border transition-colors">
                                                <User size={16} />
                                                <span>My Profile</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <button onClick={() => { setupMfa(); setIsProfileOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-accent hover:bg-border transition-colors">
                                                <Shield size={16} />
                                                <span>{isMfaSetup ? 'Update MFA' : 'Setup MFA'}</span>
                                            </button>
                                        </li>
                                        <li>
                                            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-red-400 hover:bg-border transition-colors">
                                                <LogOut size={16} />
                                                <span>Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default NavBar;
