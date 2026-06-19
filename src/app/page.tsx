"use client";

import { useEffect, useState } from "react";
import { generalCultureData, CountryCulture } from "@/data/generalCulture";
import { speechQuestionsData, Question } from "@/data/questions";
import { Speech } from "@/app/api/speeches/route";
import SettingsModal from "@/components/SettingsModal";
import CountryCard from "@/components/CountryCard";
import SpeechCard from "@/components/SpeechCard";
import EvaluationResult from "@/components/EvaluationResult";
import { renderFormattedText } from "@/utils/formatter";

type AppStep = "country-select" | "general-culture" | "speech-study" | "final-recap" | "finished";

export default function StudyApp() {
  // App navigation and data states
  const [step, setStep] = useState<AppStep>("country-select");
  const [selectedCountryId, setSelectedCountryId] = useState<string | null>(null);
  const [speeches, setSpeeches] = useState<Record<string, Speech[]>>({ albania: [], croatia: [] });
  const [loadingSpeeches, setLoadingSpeeches] = useState(true);
  
  // Settings & API Key
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);

  // Active study states
  const [currentSpeech, setCurrentSpeech] = useState<Speech | null>(null);
  const [speechLanguage, setSpeechLanguage] = useState<"en" | "tr">("en");
  const [translatedSpeeches, setTranslatedSpeeches] = useState<Record<string, string>>({}); // cache key: "country_speechId"
  const [translating, setTranslating] = useState(false);

  // Q&A states
  const [currentSpeechStep, setCurrentSpeechStep] = useState<"read" | "questions">("read");
  const [answers, setAnswers] = useState<Record<number, string>>({ 1: "", 2: "" });
  const [evaluationFeedback, setEvaluationFeedback] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  // Progress tracking
  const [completedSpeeches, setCompletedSpeeches] = useState<Record<string, Record<number, boolean>>>({
    albania: {},
    croatia: {},
  });
  const [speechHistory, setSpeechHistory] = useState<Record<string, Record<number, { question: string; answer: string; feedback: string }[]>>>({
    albania: {},
    croatia: {},
  });

  // Recap states
  const [recapText, setRecapText] = useState<string | null>(null);
  const [recapLoading, setRecapLoading] = useState(false);
  const [userName, setUserName] = useState("");

  // Check API key availability
  useEffect(() => {
    const key = localStorage.getItem("minimax_api_key");
    setHasApiKey(!!key);
  }, [isSettingsOpen]);

  // Load speeches from our local API
  useEffect(() => {
    async function loadSpeeches() {
      try {
        const res = await fetch("/api/speeches");
        const json = await res.json();
        if (json.success) {
          setSpeeches(json.data);
        }
      } catch (err) {
        console.error("Error loading speeches:", err);
      } finally {
        setLoadingSpeeches(false);
      }
    }
    loadSpeeches();

    // Load progress from localStorage
    try {
      const savedProgress = localStorage.getItem("mun_study_progress");
      if (savedProgress) {
        setCompletedSpeeches(JSON.parse(savedProgress));
      }
      const savedHistory = localStorage.getItem("mun_study_history");
      if (savedHistory) {
        setSpeechHistory(JSON.parse(savedHistory));
      }
      const savedName = localStorage.getItem("mun_user_name");
      if (savedName) {
        setUserName(savedName);
      }
    } catch (e) {
      console.error("Error loading progress from localStorage:", e);
    }
  }, []);

  // Save progress changes
  const saveProgress = (newProgress: Record<string, Record<number, boolean>>, newHistory: any) => {
    setCompletedSpeeches(newProgress);
    setSpeechHistory(newHistory);
    localStorage.setItem("mun_study_progress", JSON.stringify(newProgress));
    localStorage.setItem("mun_study_history", JSON.stringify(newHistory));
  };

  const selectedCountry: CountryCulture | undefined = selectedCountryId
    ? generalCultureData[selectedCountryId]
    : undefined;

  const countrySpeeches = selectedCountryId ? speeches[selectedCountryId] || [] : [];
  const completedCount = selectedCountryId
    ? Object.values(completedSpeeches[selectedCountryId] || {}).filter(Boolean).length
    : 0;

  // Handle Translate speech to Turkish
  const handleTranslate = async (speech: Speech) => {
    if (!selectedCountryId) return;
    const cacheKey = `${selectedCountryId}_${speech.id}`;
    
    if (translatedSpeeches[cacheKey]) {
      setSpeechLanguage("tr");
      return;
    }

    setTranslating(true);
    try {
      const minimaxKey = localStorage.getItem("minimax_api_key") || "";
      const response = await fetch("/api/minimax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-minimax-api-key": minimaxKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: "Sen profesyonel bir diplomasi çevirmenisin. Sana verilen resmi İngilizce Model Birleşmiş Milletler (MUN) konuşmasını, diplomatik ciddiyeti, hitap biçimlerini ve terminolojiyi koruyarak resmi bir dille Türkçe'ye çevir.",
            },
            {
              role: "user",
              content: speech.content,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const trText = data.choices[0].message.content;
        setTranslatedSpeeches((prev) => ({ ...prev, [cacheKey]: trText }));
        setSpeechLanguage("tr");
      } else {
        alert(data.error || "Çeviri başarısız oldu. API anahtarınızı kontrol edin.");
      }
    } catch (err) {
      console.error(err);
      alert("Çeviri sırasında bir hata oluştu.");
    } finally {
      setTranslating(false);
    }
  };

  // Submit Q&A answers for AI evaluation
  const handleEvaluateAnswers = async () => {
    if (!selectedCountryId || !currentSpeech) return;
    const qList = speechQuestionsData[selectedCountryId]?.[currentSpeech.id] || [];
    
    if (!answers[1].trim() || !answers[2].trim()) {
      alert("Lütfen her iki sorunun da cevabını yazın.");
      return;
    }

    setEvaluating(true);
    setEvaluationFeedback(null);

    try {
      const minimaxKey = localStorage.getItem("minimax_api_key") || "";
      const response = await fetch("/api/minimax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-minimax-api-key": minimaxKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Sen kıdemli bir Model Birleşmiş Milletler (MUN) jürisi ve diplomatik eğitmensin. Kullanıcının okuduğu konuşmaya ve sorduğumuz İngilizce sorulara verdiği İngilizce cevapları değerlendireceksin. Kullanıcının cevaplarını kesinlikle İngilizce yazmış olması gerekmektedir. Eğer cevaplar Türkçe veya başka bir dilde yazıldıysa puanı düşür ve İngilizce yazılması gerektiğini hatırlat. Cevapları şu kriterlere göre değerlendir:
1. Verilen İngilizce cevapların dil bilgisi kalitesi, diplomasi terminolojisine uygunluğu ve akıcılığı.
2. Temsil edilen ülkenin (${selectedCountry?.name}) resmi dış politikasına uygunluk.
3. Sunulan argümanların gücü, ikna ediciliği ve doğrudan soruya cevap vermesi.

Değerlendirme sonucunu Türkçe olarak ver. Başlık olarak 'Değerlendirme Puanı:' (Harika, Geliştirilebilir veya Eksik değerlerinden biri olmalı) ile başla. Çalışmalarına katma değer sağlayacak şekilde, her bir soru için yapılan dil ve içerik hatalarını, doğruları ve nasıl geliştirilebileceğine dair tavsiyeleri (Tavsiyeler) yapıcı ve profesyonel bir üslupla Türkçe olarak açıkla.`,
            },
            {
              role: "user",
              content: `Konuşma Başlığı: ${currentSpeech.title}
Konuşma Metni:
${currentSpeech.content}

Soru 1: ${qList[0]?.questionText}
Kullanıcı Cevabı 1: ${answers[1]}

Soru 2: ${qList[1]?.questionText}
Kullanıcı Cevabı 2: ${answers[2]}`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        const feedback = data.choices[0].message.content;
        setEvaluationFeedback(feedback);
      } else {
        alert(data.error || "Değerlendirme başarısız oldu. API anahtarınızı kontrol edin.");
      }
    } catch (err) {
      console.error(err);
      alert("Değerlendirme sırasında bağlantı hatası oluştu.");
    } finally {
      setEvaluating(false);
    }
  };

  // Complete a speech study
  const handleCompleteSpeech = () => {
    if (!selectedCountryId || !currentSpeech || !evaluationFeedback) return;

    const qList = speechQuestionsData[selectedCountryId]?.[currentSpeech.id] || [];

    const newProgress = {
      ...completedSpeeches,
      [selectedCountryId]: {
        ...(completedSpeeches[selectedCountryId] || {}),
        [currentSpeech.id]: true,
      },
    };

    const newHistory = {
      ...speechHistory,
      [selectedCountryId]: {
        ...(speechHistory[selectedCountryId] || {}),
        [currentSpeech.id]: [
          {
            question: qList[0]?.questionText || "",
            answer: answers[1],
            feedback: evaluationFeedback,
          },
          {
            question: qList[1]?.questionText || "",
            answer: answers[2],
            feedback: evaluationFeedback,
          },
        ],
      },
    };

    saveProgress(newProgress, newHistory);

    // Reset speech states
    setCurrentSpeech(null);
    setCurrentSpeechStep("read");
    setAnswers({ 1: "", 2: "" });
    setEvaluationFeedback(null);
    setSpeechLanguage("en");
  };

  // Generate Final recap
  const handleGenerateRecap = async () => {
    if (!selectedCountryId) return;
    setStep("final-recap");
    setRecapLoading(true);
    setRecapText(null);

    const history = speechHistory[selectedCountryId] || {};
    let summaryText = "";
    
    Object.keys(history).forEach((speechId) => {
      const qnas = history[parseInt(speechId, 10)] || [];
      summaryText += `Konuşma ${speechId}:\n`;
      qnas.forEach((qna: any, idx: number) => {
        summaryText += `  Soru: ${qna.question}\n  Cevap: ${qna.answer}\n`;
      });
      if (qnas[0]) {
        summaryText += `  Değerlendirme Geri Bildirimi: ${qnas[0].feedback}\n\n`;
      }
    });

    try {
      const minimaxKey = localStorage.getItem("minimax_api_key") || "";
      const response = await fetch("/api/minimax", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-minimax-api-key": minimaxKey,
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Sen uzman bir Model Birleşmiş Milletler (MUN) koçusun. Kullanıcı seçtiği ülkeyle ilgili 9 adet konuşmayı çalıştı ve bu konuşmaların sorularına çeşitli cevaplar verdi. Şimdi, kullanıcının bu süreçteki tüm performansını, yaptığı hataları ve aldığı geri bildirimleri göz önünde bulundurarak onun için Türkçe bir 'Eksik Giderme ve Gelişim Kılavuzu' hazırlayacaksın.
Bu kılavuzda:
1. Kullanıcının genel olarak hangi konularda güçlü olduğunu (savunma, dil kullanımı vb.) belirt.
2. Ülkenin (${selectedCountry?.name}) politik pozisyonlarında neleri eksik veya hatalı savunduğunu analiz et.
3. Gelecekteki MUN simülasyonları için somut öneriler ve delegasyonun savunması gereken temel argümanların özetini sun.

Metin son derece yapıcı, öğretici, net başlıklar içeren ve eksikleri gidermeye yönelik olmalıdır.`,
            },
            {
              role: "user",
              content: `Ülke: ${selectedCountry?.name}
Çalışılan Konuşmalar ve Kullanıcı Cevapları/Geri Bildirimler Özeti:
${summaryText || "Veri bulunamadı."}`,
            },
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices[0]?.message?.content) {
        setRecapText(data.choices[0].message.content);
      } else {
        setRecapText("Rapor oluşturulamadı. Lütfen API anahtarınızı veya internet bağlantınızı kontrol edip tekrar deneyin.");
      }
    } catch (err) {
      console.error(err);
      setRecapText("Rapor oluşturulurken bağlantı hatası oluştu.");
    } finally {
      setRecapLoading(false);
    }
  };

  // Reset progress for selected country
  const handleResetProgress = () => {
    if (!selectedCountryId) return;
    if (confirm("Bu ülkeye ait tüm ilerlemenizi sıfırlamak istediğinize emin misiniz?")) {
      const newProgress = { ...completedSpeeches, [selectedCountryId]: {} };
      const newHistory = { ...speechHistory, [selectedCountryId]: {} };
      saveProgress(newProgress, newHistory);
      setCurrentSpeech(null);
      setCurrentSpeechStep("read");
      setAnswers({ 1: "", 2: "" });
      setEvaluationFeedback(null);
      setStep("general-culture");
    }
  };

  // Save user name and trigger finish
  const handleFinishStudy = () => {
    if (userName.trim()) {
      localStorage.setItem("mun_user_name", userName.trim());
    }
    setStep("finished");
  };

  // Download study guide as file
  const handleDownloadNotes = () => {
    if (!selectedCountryId) return;
    const history = speechHistory[selectedCountryId] || {};
    let fileContent = `=== ${selectedCountry?.name} MUN ÇALIŞMA RAPORU ===\n`;
    fileContent += `Tarih: ${new Date().toLocaleDateString("tr-TR")}\n`;
    if (userName) fileContent += `Delege: ${userName}\n`;
    fileContent += `==========================================\n\n`;

    Object.keys(history).forEach((speechId) => {
      const qnas = history[parseInt(speechId, 10)] || [];
      fileContent += `Konuşma ${speechId}:\n`;
      qnas.forEach((qna: any, idx: number) => {
        fileContent += `Soru ${idx + 1}: ${qna.question}\n`;
        fileContent += `Cevap ${idx + 1}: ${qna.answer}\n`;
      });
      if (qnas[0]) {
        fileContent += `Geri Bildirim:\n${qnas[0].feedback}\n`;
      }
      fileContent += `\n------------------------------------------\n\n`;
    });

    if (recapText) {
      fileContent += `\n=== EKSİK GİDERME VE GELİŞİM RAPORU ===\n\n${recapText}\n`;
    }

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedCountry?.name}_MUN_Calisma_Notlari.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Top Navbar */}
      <header
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "var(--glass-blur)",
          WebkitBackdropFilter: "var(--glass-blur)",
          borderBottom: "1px solid var(--border-light)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "1rem",
        }}
      >
        <div
          className="container"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 0,
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.50rem", cursor: "pointer" }}
            onClick={() => {
              if (confirm("Ana sayfaya dönmek istiyor musunuz? İlerlemeniz kaydedilecektir.")) {
                setStep("country-select");
                setCurrentSpeech(null);
              }
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🌍</span>
            <div>
              <h1 style={{ fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.05em" }}>
                MUN STUDY AI
              </h1>
              <span style={{ fontSize: "0.65rem", opacity: 0.7, textTransform: "uppercase" }}>
                Interactive Coach
              </span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {!hasApiKey && step !== "country-select" && (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "hsl(var(--accent-orange))",
                  background: "rgba(249, 115, 22, 0.1)",
                  padding: "0.25rem 0.5rem",
                  borderRadius: "6px",
                  fontWeight: 600,
                }}
              >
                ⚠️ API Anahtarı Eksik
              </span>
            )}
            <button
              id="settings-trigger-btn"
              className="btn btn-secondary"
              style={{ padding: "0.5rem", borderRadius: "10px" }}
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Ayarları Aç"
            >
              ⚙️
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* API Key Notification Warning */}
        {!hasApiKey && step === "country-select" && (
          <div
            className="container"
            style={{
              paddingTop: "1rem",
              paddingBottom: 0,
            }}
          >
            <div
              className="glass-card"
              style={{
                borderColor: "hsla(var(--accent-orange), 0.3)",
                background: "rgba(249, 115, 22, 0.05)",
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span>⚠️</span>
                <h4 style={{ color: "hsl(var(--accent-orange))" }}>API Anahtarı Ayarlanmadı</h4>
              </div>
              <p style={{ fontSize: "0.85rem" }}>
                Konuşma çevirileri ve yapay zeka cevap kontrollerinin çalışabilmesi için MiniMax M3 API anahtarınızı eklemeniz gerekmektedir. Sağ üstteki çark simgesine tıklayarak anahtarınızı girebilirsiniz.
              </p>
            </div>
          </div>
        )}

        <div className="container" style={{ padding: "2rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
          
          {/* STEP 1: Country Selection */}
          {step === "country-select" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", flex: 1, justifyContent: "center" }}>
              <div style={{ textAlign: "center" }} className="animate-fade-in">
                <h2 style={{ fontSize: "2.2rem", marginBottom: "0.75rem" }}>Temsil Edeceğiniz Ülkeyi Seçin</h2>
                <p style={{ maxWidth: "600px", margin: "0 auto" }}>
                  MUN delegasyon konuşmalarınıza interaktif olarak çalışmak, yapay zekadan anlık tavsiyeler almak ve eksiklerinizi kapatmak için bir ülke seçerek başlayın.
                </p>
              </div>

              {loadingSpeeches ? (
                <div style={{ textAlign: "center", padding: "3rem" }}>
                  <div className="glow-effect" style={{ display: "inline-block", padding: "1rem", borderRadius: "10px" }}>
                    🔄 Konuşma dosyaları yükleniyor...
                  </div>
                </div>
              ) : (
                <div className="grid-2" style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
                  <CountryCard
                    country={generalCultureData.albania}
                    onSelect={(id) => {
                      setSelectedCountryId(id);
                      setStep("general-culture");
                    }}
                  />
                  <CountryCard
                    country={generalCultureData.croatia}
                    onSelect={(id) => {
                      setSelectedCountryId(id);
                      setStep("general-culture");
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {/* STEP 2: General Culture Details */}
          {step === "general-culture" && selectedCountry && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "3rem" }}>{selectedCountry.flagUrl}</span>
                  <div>
                    <h2 style={{ fontSize: "2rem" }}>{selectedCountry.name} Genel Kültür Bilgileri</h2>
                    <p>{selectedCountry.nativeName} hakkında bilmeniz gereken temel başlıklar</p>
                  </div>
                </div>
                <button className="btn btn-secondary" onClick={() => setStep("country-select")}>
                  🎛️ Ülke Değiştir
                </button>
              </div>

              <div className="grid-2">
                {selectedCountry.sections.map((section, idx) => (
                  <div
                    key={idx}
                    className="glass-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ fontSize: "1.3rem" }}>{section.icon}</span>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>{section.title}</h3>
                    </div>
                    <p style={{ fontSize: "0.95rem", lineHeight: "1.6" }}>{section.content}</p>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "1.5rem",
                  padding: "1.5rem",
                  background: "var(--glass-bg)",
                  borderRadius: "15px",
                  border: "1px solid var(--border-light)",
                  flexWrap: "wrap",
                  gap: "1rem",
                }}
              >
                <div>
                  <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem" }}>Hazır mısınız?</h4>
                  <p style={{ fontSize: "0.85rem" }}>Konuşmaları okuyup yapay zekanın açık uçlu sorularına cevap vermeye başlayın.</p>
                </div>
                <button
                  id="go-to-speeches-btn"
                  className="btn btn-primary"
                  onClick={() => setStep("speech-study")}
                >
                  Konuşmalara Geç ➜
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Speeches list and Reader Dashboard */}
          {step === "speech-study" && selectedCountry && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", flex: 1 }}>
              {/* Header inside Dashboard */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid var(--border-light)", paddingBottom: "1rem" }}>
                <div>
                  <h2 style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span>{selectedCountry.flagUrl}</span>
                    <span>{selectedCountry.name} Delegasyon Konuşmaları</span>
                  </h2>
                  <p style={{ fontSize: "0.9rem" }}>
                    Tamamlanan: <strong style={{ color: "hsl(var(--accent-green))" }}>{completedCount}/9</strong> konuşma. Rapor almak için tüm konuşmaları tamamlayın.
                  </p>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn btn-secondary" onClick={() => setStep("general-culture")}>
                    ⬅ Genel Kültür
                  </button>
                  <button className="btn btn-secondary" onClick={handleResetProgress} style={{ color: "hsl(var(--accent-red))" }}>
                    🗑 Sıfırla
                  </button>
                  {completedCount === 9 && (
                    <button
                      id="get-recap-btn"
                      className="btn btn-primary glow-effect"
                      onClick={handleGenerateRecap}
                    >
                      🎓 Raporu ve Sertifikayı Al
                    </button>
                  )}
                </div>
              </div>

              {/* Main Panel grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "350px 1fr",
                  gap: "1.5rem",
                  alignItems: "start",
                  flex: 1,
                }}
                className="speech-grid-layout"
              >
                {/* Left Column: Speeches menu */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    maxHeight: "calc(100vh - 220px)",
                    overflowY: "auto",
                    paddingRight: "0.25rem",
                  }}
                  className="speech-sidebar"
                >
                  {countrySpeeches.map((sp) => (
                    <SpeechCard
                      key={sp.id}
                      speech={sp}
                      isActive={currentSpeech?.id === sp.id}
                      isCompleted={!!(selectedCountryId && completedSpeeches[selectedCountryId]?.[sp.id])}
                      onSelect={(speech) => {
                        setCurrentSpeech(speech);
                        setCurrentSpeechStep("read");
                        setEvaluationFeedback(null);
                        setSpeechLanguage("en");
                        setAnswers({ 1: "", 2: "" });
                      }}
                    />
                  ))}
                </div>

                {/* Right Column: Reader and Q&A */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", minWidth: 0 }}>
                  {!currentSpeech ? (
                    <div
                      className="glass-card"
                      style={{
                        padding: "4rem 2rem",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "1rem",
                        justifyContent: "center",
                      }}
                    >
                      <span style={{ fontSize: "3rem" }}>📖</span>
                      <h3>Çalışmak İçin Bir Konuşma Seçin</h3>
                      <p style={{ maxWidth: "400px" }}>
                        Soldaki listeden çalışmak istediğiniz konuşmanın üzerine tıklayarak içeriğini açabilir, çeviri ve test aşamalarına geçebilirsiniz.
                      </p>
                    </div>
                  ) : (
                    <div className="glass-card animate-fade-in" style={{ padding: "2rem" }}>
                      
                      {/* Speech Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          borderBottom: "1px solid var(--border-light)",
                          paddingBottom: "1rem",
                          marginBottom: "1.5rem",
                          flexWrap: "wrap",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "hsl(var(--accent-purple))", textTransform: "uppercase" }}>
                            Konuşma {currentSpeech.id}
                          </span>
                          <h3 style={{ fontSize: "1.4rem", marginTop: "0.15rem" }}>{currentSpeech.title}</h3>
                        </div>

                        {/* Mode selectors */}
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            className={`btn ${speechLanguage === "en" ? "btn-primary" : "btn-secondary"}`}
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                            onClick={() => setSpeechLanguage("en")}
                          >
                            🇬🇧 English
                          </button>
                          <button
                            className={`btn ${speechLanguage === "tr" ? "btn-primary" : "btn-secondary"}`}
                            style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }}
                            onClick={() => handleTranslate(currentSpeech)}
                            disabled={translating}
                          >
                            {translating ? "⌛ Çevriliyor..." : "🇹🇷 Türkçe"}
                          </button>
                        </div>
                      </div>

                      {/* Content Panel: Reader vs Questions */}
                      {currentSpeechStep === "read" ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                          <div
                            style={{
                              fontSize: "1.1rem",
                              lineHeight: "1.8",
                              color: "white",
                              background: "rgba(255, 255, 255, 0.01)",
                              padding: "1.5rem",
                              borderRadius: "12px",
                              fontFamily: "var(--font-family)",
                            }}
                          >
                            {speechLanguage === "en" ? (
                              renderFormattedText(currentSpeech.content)
                            ) : (
                              translatedSpeeches[`${selectedCountryId}_${currentSpeech.id}`] ? (
                                renderFormattedText(translatedSpeeches[`${selectedCountryId}_${currentSpeech.id}`])
                              ) : (
                                <div style={{ color: "hsl(var(--text-secondary))" }}>
                                  Çeviri yüklenirken lütfen bekleyin...
                                </div>
                              )
                            )}
                          </div>

                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
                            <button
                              id="finish-reading-btn"
                              className="btn btn-primary"
                              onClick={() => setCurrentSpeechStep("questions")}
                            >
                              Konuşmayı Okudum, Sorulara Geç ➔
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <h4 style={{ fontSize: "1.1rem", color: "hsl(var(--accent-purple))" }}>
                              Açık Uçlu Değerlendirme Soruları
                            </h4>
                            <button
                              className="btn btn-secondary"
                              style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                              onClick={() => setCurrentSpeechStep("read")}
                            >
                              ⬅ Konuşmaya Geri Dön
                            </button>
                          </div>

                          {/* Questions loop */}
                          {selectedCountryId ? speechQuestionsData[selectedCountryId]?.[currentSpeech.id]?.map((q: Question, idx: number) => {
                            const qIndex = (idx + 1) as 1 | 2;
                            return (
                              <div
                                key={q.id}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "0.75rem",
                                  background: "rgba(255, 255, 255, 0.01)",
                                  padding: "1.25rem",
                                  borderRadius: "12px",
                                  border: "1px solid var(--border-light)",
                                }}
                              >
                                <span style={{ fontWeight: 700, color: "white" }}>
                                  Soru {qIndex}: {q.questionText}
                                </span>
                                <textarea
                                  id={`answer-textarea-${qIndex}`}
                                  rows={4}
                                  placeholder="Write your answer in English here..."
                                  value={answers[qIndex]}
                                  onChange={(e) => setAnswers({ ...answers, [qIndex]: e.target.value })}
                                  disabled={evaluating || !!evaluationFeedback}
                                />
                                <span style={{ fontSize: "0.8rem", color: "hsl(var(--text-secondary))", fontStyle: "italic" }}>
                                  💡 Hint: {q.hint}
                                </span>
                              </div>
                            );
                          }) : null}

                          {/* Action panel */}
                          {!evaluationFeedback ? (
                            <button
                              id="submit-answers-btn"
                              className="btn btn-primary"
                              style={{ alignSelf: "flex-end" }}
                              onClick={handleEvaluateAnswers}
                              disabled={evaluating}
                            >
                              {evaluating ? "⚡ Cevaplar Kontrol Ediliyor..." : "Cevaplarımı Yapay Zekaya Gönder 🚀"}
                            </button>
                          ) : (
                            <EvaluationResult
                              feedback={evaluationFeedback}
                              onRetry={() => setEvaluationFeedback(null)}
                              onContinue={handleCompleteSpeech}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Final Recap Generator */}
          {step === "final-recap" && selectedCountry && (
            <div className="glass-card animate-fade-in" style={{ maxWidth: "800px", margin: "0 auto", width: "100%", padding: "2.5rem" }}>
              {recapLoading ? (
                <div style={{ textAlign: "center", padding: "4rem 2rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      border: "4px solid hsla(var(--accent-purple), 0.2)",
                      borderTopColor: "hsl(var(--accent-purple))",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                  <style jsx global>{`
                    @keyframes spin {
                      to { transform: rotate(360deg); }
                    }
                  `}</style>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Eksik Giderme Raporu Hazırlanıyor</h3>
                    <p style={{ maxWidth: "450px" }}>
                      Yapay zeka o ana kadar verdiğiniz tüm cevapları ve aldığınız geri bildirimleri analiz ederek delegasyon pozisyonunuzu güçlendirecek özel bir rehber oluşturuyor...
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "2rem" }}>🎓</span>
                    <div>
                      <h2 style={{ fontSize: "1.6rem" }}>{selectedCountry.name} - Eksik Giderme ve Gelişim Raporu</h2>
                      <p>Yapay zeka antrenörünüzün sizin için hazırladığı özel analiz</p>
                    </div>
                  </div>

                  <div
                    style={{
                      lineHeight: "1.8",
                      fontSize: "1rem",
                      background: "rgba(255, 255, 255, 0.02)",
                      padding: "1.5rem",
                      borderRadius: "12px",
                      border: "1px solid var(--border-light)",
                      color: "hsl(var(--text-primary))",
                      maxHeight: "450px",
                      overflowY: "auto",
                    }}
                  >
                    {recapText ? renderFormattedText(recapText) : null}
                  </div>

                  {/* Input for name */}
                  <div
                    style={{
                      background: "rgba(139, 92, 246, 0.05)",
                      border: "1px solid hsla(var(--accent-purple), 0.2)",
                      padding: "1.25rem",
                      borderRadius: "12px",
                      marginTop: "0.5rem",
                    }}
                  >
                    <label htmlFor="user-name-input" style={{ fontWeight: 600, color: "white" }}>
                      Sertifika İçin Adınız Soyadınız:
                    </label>
                    <input
                      id="user-name-input"
                      type="text"
                      placeholder="Ad Soyad giriniz..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      style={{ maxWidth: "350px" }}
                    />
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "1rem" }}>
                    <button className="btn btn-secondary" onClick={handleDownloadNotes}>
                      💾 Notlarımı & Raporu İndir (.txt)
                    </button>
                    <button
                      id="finish-report-btn"
                      className="btn btn-primary"
                      onClick={handleFinishStudy}
                      disabled={!userName.trim()}
                    >
                      Raporu Okudum ve Tamamla 🏁
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Finished & Celebration Certificate */}
          {step === "finished" && selectedCountry && (
            <div
              className="glass-card glow-effect animate-fade-in"
              style={{
                maxWidth: "750px",
                margin: "0 auto",
                width: "100%",
                padding: "3rem 2rem",
                textAlign: "center",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <div>
                <span style={{ fontSize: "4.5rem", display: "block", marginBottom: "0.5rem" }}>🏆</span>
                <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>Tebrikler, Çalışma Tamamlandı!</h2>
                <p style={{ maxWidth: "500px", margin: "0.5rem auto 0 auto" }}>
                  {selectedCountry.name} delegasyonu kapsamındaki tüm konuşma metinlerini başarıyla bitirdiniz ve yapay zeka jüri değerlendirmelerini tamamladınız.
                </p>
              </div>

              {/* Certificate */}
              <div
                style={{
                  background: "radial-gradient(circle, #1e1b4b 0%, #0f172a 100%)",
                  border: "4px double hsla(var(--accent-purple), 0.6)",
                  padding: "3rem 2rem",
                  borderRadius: "15px",
                  width: "100%",
                  maxWidth: "600px",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
                  position: "relative",
                  color: "white",
                }}
                className="certificate-container"
              >
                {/* Border corner decorations */}
                <div style={{ position: "absolute", top: "10px", left: "10px", fontSize: "1.2rem", opacity: 0.5 }}>✦</div>
                <div style={{ position: "absolute", top: "10px", right: "10px", fontSize: "1.2rem", opacity: 0.5 }}>✦</div>
                <div style={{ position: "absolute", bottom: "10px", left: "10px", fontSize: "1.2rem", opacity: 0.5 }}>✦</div>
                <div style={{ position: "absolute", bottom: "10px", right: "10px", fontSize: "1.2rem", opacity: 0.5 }}>✦</div>

                <span style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "hsl(var(--accent-blue))", textTransform: "uppercase", fontWeight: 800 }}>
                  Başarı Sertifikası
                </span>
                
                <h3
                  style={{
                    fontSize: "1.8rem",
                    margin: "1.5rem 0 0.5rem 0",
                    fontFamily: "serif",
                    fontWeight: "normal",
                    color: "white",
                  }}
                >
                  {userName}
                </h3>
                
                <div style={{ width: "80px", height: "1px", background: "hsl(var(--accent-purple))", margin: "1rem auto" }} />
                
                <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)", maxWidth: "450px", margin: "0 auto 1.5rem auto", lineHeight: "1.6" }}>
                  <strong>{selectedCountry.name}</strong> delegasyonu için hazırlanan 9 adet resmi MUN konuşmasını okumuş, açık uçlu soruları yanıtlamış ve yapay zeka antrenörü tarafından denetlenen diplomasi eğitimini başarıyla tamamlamıştır.
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)", padding: "0 1rem" }}>
                  <div style={{ textAlign: "left" }}>
                    <span>Tarih:</span>
                    <br />
                    <strong style={{ color: "white" }}>{new Date().toLocaleDateString("tr-TR")}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: "1.5rem" }}>🛡️</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span>Eğitmen:</span>
                    <br />
                    <strong style={{ color: "white" }}>MUN Study AI Coach</strong>
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={handleDownloadNotes}>
                  💾 Çalışma Raporunu İndir (.txt)
                </button>
                <button
                  id="restart-study-btn"
                  className="btn btn-primary"
                  onClick={() => {
                    setStep("country-select");
                    setSelectedCountryId(null);
                    setRecapText(null);
                  }}
                >
                  Farklı Ülke Çalış 🌍
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Settings Dialog Modal Component */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
