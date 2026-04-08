import { useState } from "react";
import { ArrowLeft, Grid3X3, Heart, MessageCircle, Plus, X, MapPin, Upload } from "lucide-react";
import type { FoodPost } from "@/data/mockData";

interface ProfilePageProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: FoodPost[];
  likedIds: Set<string>;
  allPosts: FoodPost[];
  comments: Record<string, { text: string; dish: string }[]>;
}

type Tab = "saved" | "liked" | "comments";

const ProfilePage = ({ isOpen, onClose, savedItems, likedIds, allPosts, comments }: ProfilePageProps) => {
  const [tab, setTab] = useState<Tab>("saved");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ title: "", description: "", price: "", location: "" });
  const [uploadDone, setUploadDone] = useState(false);

  if (!isOpen) return null;

  const likedItems = allPosts.filter((p) => likedIds.has(p.id));
  const allComments = Object.entries(comments).flatMap(([postId, cmts]) =>
    cmts.map((c) => ({ ...c, postId }))
  );

  const handleUploadSubmit = () => {
    setUploadDone(true);
    setTimeout(() => {
      setUploadDone(false);
      setShowUpload(false);
      setUploadForm({ title: "", description: "", price: "", location: "" });
    }, 2000);
  };

  const tabs: { id: Tab; icon: typeof Grid3X3; label: string }[] = [
    { id: "saved", icon: Grid3X3, label: "Gespeichert" },
    { id: "liked", icon: Heart, label: "Gefällt mir" },
    { id: "comments", icon: MessageCircle, label: "Kommentare" },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background animate-slide-up flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center active:scale-90 transition-all">
          <ArrowLeft className="w-5 h-5 text-secondary-foreground" />
        </button>
        <h2 className="text-lg font-bold text-foreground">Mein Profil</h2>
        <button onClick={() => setShowUpload(true)} className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center active:scale-90 transition-all">
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>

      {/* User info */}
      <div className="flex flex-col items-center py-6 gap-2">
        <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center">
          <span className="text-2xl font-bold text-primary-foreground">F</span>
        </div>
        <h3 className="text-lg font-bold text-foreground">Foodio Nutzer</h3>
        <p className="text-sm text-muted-foreground">@foodie_user</p>
        <div className="flex gap-6 mt-2">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{savedItems.length}</p>
            <p className="text-xs text-muted-foreground">Gespeichert</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{likedIds.size}</p>
            <p className="text-xs text-muted-foreground">Gefällt mir</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{allComments.length}</p>
            <p className="text-xs text-muted-foreground">Kommentare</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all ${
              tab === t.id ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            }`}
          >
            <t.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "saved" && (
          <div className="grid grid-cols-3 gap-2">
            {savedItems.length === 0 && (
              <p className="col-span-3 text-center text-muted-foreground py-12 text-sm">Noch keine gespeicherten Gerichte</p>
            )}
            {savedItems.map((item) => (
              <div key={item.id} className="aspect-square rounded-xl overflow-hidden relative animate-scale-in">
                <img src={item.image} alt={item.dish} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/30 flex items-end p-2">
                  <p className="text-xs font-semibold text-primary-foreground line-clamp-2">{item.dish}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "liked" && (
          <div className="grid grid-cols-3 gap-2">
            {likedItems.length === 0 && (
              <p className="col-span-3 text-center text-muted-foreground py-12 text-sm">Noch keine geliketen Gerichte</p>
            )}
            {likedItems.map((item) => (
              <div key={item.id} className="aspect-square rounded-xl overflow-hidden relative animate-scale-in">
                <img src={item.image} alt={item.dish} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/30 flex items-end p-2">
                  <Heart className="w-3 h-3 text-destructive fill-destructive absolute top-2 right-2" />
                  <p className="text-xs font-semibold text-primary-foreground line-clamp-2">{item.dish}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "comments" && (
          <div className="flex flex-col gap-3">
            {allComments.length === 0 && (
              <p className="text-center text-muted-foreground py-12 text-sm">Noch keine Kommentare</p>
            )}
            {allComments.map((c, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary animate-fade-in">
                <p className="text-xs text-muted-foreground mb-1">Zu: {c.dish}</p>
                <p className="text-sm text-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 z-60 flex items-end justify-center">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowUpload(false)} />
          <div className="relative w-full max-w-lg bg-background rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground">Video hochladen</h3>
              <button onClick={() => setShowUpload(false)} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <X className="w-4 h-4 text-secondary-foreground" />
              </button>
            </div>

            {uploadDone ? (
              <div className="flex flex-col items-center py-8 animate-scale-in">
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary-foreground" />
                </div>
                <p className="text-lg font-bold text-foreground">Hochgeladen!</p>
                <p className="text-sm text-muted-foreground">Dein Video wird geprüft</p>
              </div>
            ) : (
              <>
                {/* Upload area */}
                <div className="border-2 border-dashed border-border rounded-2xl p-8 mb-4 flex flex-col items-center gap-2 bg-secondary/30">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Video auswählen</p>
                  <p className="text-xs text-muted-foreground">MP4, MOV bis 100MB</p>
                </div>

                <div className="flex flex-col gap-3">
                  <input
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="Titel des Gerichts"
                    className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Beschreibung"
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <div className="flex gap-3">
                    <input
                      value={uploadForm.price}
                      onChange={(e) => setUploadForm((f) => ({ ...f, price: e.target.value }))}
                      placeholder="Preis (z.B. 12,90)"
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <input
                        value={uploadForm.location}
                        onChange={(e) => setUploadForm((f) => ({ ...f, location: e.target.value }))}
                        placeholder="Standort"
                        className="w-full bg-transparent text-foreground placeholder:text-muted-foreground text-sm outline-none"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleUploadSubmit}
                    className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold transition-all active:scale-[0.97] mt-2"
                  >
                    Hochladen
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
