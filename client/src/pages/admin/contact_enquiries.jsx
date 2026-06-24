import { useEffect, useState } from "react";
import {
    Mail,
    Building2,
    Briefcase,
    MessageSquare,
    RefreshCw,
    Trash2,
    Download,
    Search,
    ChevronDown,
    Send,
    X,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useAuth } from "../../context/AuthContext";
import { getApiUrl } from "../../config/api";

export default function ContactEnquiries() {
    const { authFetch } = useAuth();
    const [enquiries, setEnquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [expanded, setExpanded] = useState(null);

    // Email modal state
    const [emailModal, setEmailModal] = useState(null); // { to, name }
    const [emailSubject, setEmailSubject] = useState("");
    const [emailMessage, setEmailMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sendStatus, setSendStatus] = useState(null); // "success" | "error"

    const fetchEnquiries = async () => {
        try {
            setLoading(true);

            const response = await fetch(getApiUrl("/api/contact-enquiries"), {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            console.log("CONTACT API DATA:", data);

            setEnquiries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
            setEnquiries([]);
        } finally {
            setLoading(false);
        }
    };

    const deleteEnquiry = async (id) => {
        if (!window.confirm("Delete this enquiry?")) return;
        try {
            const response = await authFetch(`/api/admin/contact-enquiries/${id}`, {
                method: "DELETE",
            });
            if (response?.error) throw new Error(response.error);
            setEnquiries((prev) => prev.filter((item) => (item._id || item.id) !== id));
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const openEmailModal = (item) => {
        setEmailModal({ to: item.email, name: item.name });
        setEmailSubject(`Re: Your enquiry with Adway`);
        setEmailMessage(
            `Hi ${item.name},\n\nThank you for reaching out to Adway. We've reviewed your enquiry and would love to connect.\n\n`
        );
        setSendStatus(null);
    };

    const closeEmailModal = () => {
        setEmailModal(null);
        setEmailSubject("");
        setEmailMessage("");
        setSendStatus(null);
    };

    const sendEmail = async () => {
        if (!emailSubject.trim() || !emailMessage.trim()) return;
        setSending(true);
        setSendStatus(null);
        try {
            const result = await authFetch("/api/admin/send-email", {
                method: "POST",
                body: JSON.stringify({
                    to: emailModal.to,
                    subject: emailSubject,
                    message: emailMessage,
                }),
            });
            if (result?.error) throw new Error(result.error);
            setSendStatus("success");
            setTimeout(() => closeEmailModal(), 1800);
        } catch (err) {
            console.error(err);
            setSendStatus("error");
        } finally {
            setSending(false);
        }
    };

    const exportToExcel = () => {
        if (enquiries.length === 0) return;
        const rows = enquiries.map((item) => ({
            Name: item.name,
            Email: item.email,
            Company: item.company || "",
            Service: item.service || "",
            Budget: item.budget || "",
            Message: item.message,
            Date: item.createdAt || item.created_at,
        }));
        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Contact Enquiries");
        XLSX.writeFile(workbook, `contact-enquiries-${Date.now()}.xlsx`);
    };

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const filtered = enquiries.filter((item) => {
        const query = search.toLowerCase();
        return (
            item.name?.toLowerCase().includes(query) ||
            item.email?.toLowerCase().includes(query) ||
            item.company?.toLowerCase().includes(query) ||
            item.service?.toLowerCase().includes(query)
        );
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-6 h-6 border-2 border-white/20 border-t-violet-500 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">

            {/* Email Compose Modal */}
            {emailModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="w-full max-w-lg bg-neutral-900 border border-white/[0.08] rounded-2xl shadow-2xl flex flex-col">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">New Message</p>
                                    <p className="text-xs text-white/30">To: {emailModal.name} · {emailModal.to}</p>
                                </div>
                            </div>
                            <button
                                onClick={closeEmailModal}
                                className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 space-y-3 flex-1">
                            {/* To field (readonly) */}
                            <div>
                                <label className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1.5 block">To</label>
                                <div className="px-3 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-sm text-white/50">
                                    {emailModal.to}
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1.5 block">Subject</label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 transition-all"
                                    placeholder="Email subject..."
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className="text-[11px] uppercase tracking-[0.2em] text-white/30 mb-1.5 block">Message</label>
                                <textarea
                                    value={emailMessage}
                                    onChange={(e) => setEmailMessage(e.target.value)}
                                    rows={8}
                                    className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/40 transition-all resize-none leading-relaxed"
                                    placeholder="Write your message..."
                                />
                            </div>

                            {/* Status */}
                            {sendStatus === "success" && (
                                <p className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2">
                                    ✓ Email sent successfully
                                </p>
                            )}
                            {sendStatus === "error" && (
                                <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2">
                                    ✗ Failed to send. Check your SMTP config.
                                </p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                            <p className="text-[11px] text-white/20">Sent via Adway Admin SMTP</p>
                            <div className="flex gap-2">
                                <button
                                    onClick={closeEmailModal}
                                    className="px-4 py-2 rounded-xl text-sm text-white/40 hover:text-white border border-white/[0.06] hover:bg-white/[0.04] transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendEmail}
                                    disabled={sending || !emailSubject.trim() || !emailMessage.trim()}
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-violet-600 hover:bg-violet-500 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {sending ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {sending ? "Sending..." : "Send Email"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Contact Enquiries</h1>
                    <p className="text-white/40 text-sm mt-1">{enquiries.length} submissions loaded</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={exportToExcel}
                        disabled={enquiries.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] text-white/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        <Download size={15} />
                        Export Excel
                    </button>
                    <button
                        onClick={fetchEnquiries}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-white/[0.04] border border-white/[0.08] text-white hover:bg-white/[0.08] transition-all"
                    >
                        <RefreshCw size={15} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search submissions by name, email, or company..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder:text-white/20 outline-none focus:border-violet-500/30 transition-all"
                />
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 border border-white/[0.04] rounded-2xl bg-white/[0.01]">
                        <Briefcase className="w-10 h-10 text-white/10 mx-auto mb-3" />
                        <p className="text-white/20">No matching submissions found</p>
                    </div>
                ) : (
                    filtered.map((item) => {
                        const itemId = item._id || item.id;
                        const isExpanded = expanded === itemId;

                        return (
                            <div
                                key={itemId}
                                className="bg-white/[0.02] border border-white/[0.04] rounded-2xl overflow-hidden transition-all hover:border-white/[0.08]"
                            >
                                <div className="p-5">
                                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                                        {/* Avatar + Info */}
                                        <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-violet-500/10 border border-violet-500/20">
                                                <span className="text-sm font-bold text-violet-400">
                                                    {item.name ? item.name[0].toUpperCase() : "?"}
                                                </span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-white">{item.name}</p>
                                                <p className="text-xs text-white/40 truncate">{item.email}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                            <span className="text-[11px] text-white/20 mr-2">
                                                {new Date(item.createdAt || item.created_at).toLocaleDateString()}
                                            </span>

                                            {/* Email compose button */}
                                            <button
                                                onClick={() => openEmailModal(item)}
                                                className="p-2 rounded-lg text-white/40 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                                                title="Send Email"
                                            >
                                                <Mail className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => setExpanded(isExpanded ? null : itemId)}
                                                className="p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.03] transition-all"
                                                title="View Details"
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                            </button>

                                            <button
                                                onClick={() => deleteEnquiry(itemId)}
                                                className="p-2 rounded-lg text-white/20 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                                                title="Delete Enquiry"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Meta */}
                                    <div className="grid gap-3 mt-5 pt-4 border-t border-white/[0.03] text-sm text-white/60">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Company</p>
                                                <p className="text-white text-xs truncate flex items-center gap-1.5">
                                                    <Building2 size={13} className="text-white/20" />
                                                    {item.company || "Personal / N/A"}
                                                </p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Requested Service</p>
                                                <p className="text-white text-xs truncate flex items-center gap-1.5">
                                                    <Briefcase size={13} className="text-white/20" />
                                                    {item.service || "General Inquiry"}
                                                </p>
                                            </div>
                                            {item.budget && (
                                                <div className="space-y-1">
                                                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">Estimated Budget</p>
                                                    <p className="text-violet-400 text-xs font-medium">{item.budget}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded message */}
                                {isExpanded && (
                                    <div className="px-5 pb-5 pt-0 border-t border-white/[0.04]">
                                        <div className="bg-white/[0.01] border border-white/[0.04] rounded-2xl p-4 mt-2">
                                            <div className="flex items-center gap-2 mb-3">
                                                <MessageSquare size={14} className="text-white/30" />
                                                <p className="text-xs text-white/30 uppercase tracking-[0.2em]">Project Details & Requirements</p>
                                            </div>
                                            <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
                                                {item.message || "No project text provided."}
                                            </p>
                                            <div className="mt-4 pt-3 border-t border-white/[0.03] flex justify-end gap-2">
                                                <button
                                                    onClick={() => navigator.clipboard.writeText(item.email)}
                                                    className="px-3 py-1.5 rounded-lg border border-white/[0.06] bg-white/[0.02] text-xs text-white/60 hover:text-white hover:bg-white/[0.04] transition-all"
                                                >
                                                    Copy Email Address
                                                </button>
                                                <button
                                                    onClick={() => openEmailModal(item)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 border border-violet-500/20 text-xs text-violet-400 hover:bg-violet-600/30 transition-all"
                                                >
                                                    <Mail className="w-3 h-3" />
                                                    Reply via Email
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}