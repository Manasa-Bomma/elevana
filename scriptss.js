
        /* -------------------------
   Theme toggle (persisted)
   ------------------------- */
        const THEME_KEY = 'dreamease_theme_v1';
        const themeBtn = document.getElementById('themeToggle');

        function applyTheme(mode) {
            if (mode === 'dark') {
                document.body.classList.add('dark');
                themeBtn.textContent = '🌙 Dark';
                themeBtn.setAttribute('aria-pressed', 'true');
            } else {
                document.body.classList.remove('dark');
                themeBtn.textContent = '🌞 Light';
                themeBtn.setAttribute('aria-pressed', 'false');
            }
            localStorage.setItem(THEME_KEY, mode);
        }

        // init theme: saved -> system -> light
        (function initTheme() {
            const saved = localStorage.getItem(THEME_KEY);
            if (saved === 'dark' || saved === 'light') {
                applyTheme(saved);
                return;
            }
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        })();
        themeBtn.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark');
            applyTheme(isDark ? 'light' : 'dark');
        });

        /* -------------------------
           Tab navigation
           ------------------------- */
        document.querySelectorAll('.nav button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const id = btn.getAttribute('data-section');
                document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
                document.getElementById(id).classList.add('active');

                // stop sound when leaving sounds tab
                if (id !== 'sounds') stopSound();
            });
        });

        /* -------------------------
           SOUNDS
           ------------------------- */
        const soundSelect = document.getElementById('soundSelect');
        const soundPlayer = document.getElementById('soundPlayer');
        const playSoundBtn = document.getElementById('playSoundBtn');
        const stopSoundBtn = document.getElementById('stopSoundBtn');

        playSoundBtn.addEventListener('click', () => {
            const src = soundSelect.value;
            if (!src) return;
            if (soundPlayer.src !== src) soundPlayer.src = src;
            soundPlayer.play().catch(err => console.warn('Playback prevented:', err));
        });
        stopSoundBtn.addEventListener('click', () => {
            soundPlayer.pause();
            soundPlayer.currentTime = 0;
        });

        /* -------------------------
           JOURNAL (localStorage)
           ------------------------- */
        const JOURNAL_KEY = 'dreamease_journal_v1';
        const journalArea = document.getElementById('journalArea');
        const saveJournalBtn = document.getElementById('saveJournalBtn');
        const loadJournalBtn = document.getElementById('loadJournalBtn');
        const clearJournalBtn = document.getElementById('clearJournalBtn');
        const journalStatus = document.getElementById('journalStatus');

        function saveJournal() {
            const txt = journalArea.value.trim();
            if (!txt) {
                journalStatus.textContent = 'Write something before saving.';
                return;
            }
            localStorage.setItem(JOURNAL_KEY, txt);
            journalStatus.textContent = 'Saved ✨';
            setTimeout(() => journalStatus.textContent = '', 2200);
        }

        function loadJournal() {
            journalArea.value = localStorage.getItem(JOURNAL_KEY) || '';
            journalStatus.textContent = journalArea.value ? 'Loaded last entry.' : 'No saved entry yet.';
            setTimeout(() => journalStatus.textContent = '', 1800);
        }

        function clearJournal() {
            localStorage.removeItem(JOURNAL_KEY);
            journalArea.value = '';
            journalStatus.textContent = 'Cleared.';
            setTimeout(() => journalStatus.textContent = '', 1500);
        }
        saveJournalBtn.addEventListener('click', saveJournal);
        loadJournalBtn.addEventListener('click', loadJournal);
        clearJournalBtn.addEventListener('click', clearJournal);
        loadJournal(); // preload if present

        /* -------------------------
           TRACKER (localStorage array)
           ------------------------- */
        const TRACK_KEY = 'dreamease_tracker_v1';
        const sleepInput = document.getElementById('sleepTime');
        const wakeInput = document.getElementById('wakeTime');
        const saveTrackBtn = document.getElementById('saveTrackBtn');
        const clearTrackBtn = document.getElementById('clearTrackBtn');
        const trackLog = document.getElementById('trackLog');

        function getTracks() {
            try {
                return JSON.parse(localStorage.getItem(TRACK_KEY)) || [];
            } catch {
                localStorage.removeItem(TRACK_KEY);
                return [];
            }
        }

        function saveTracks(arr) {
            localStorage.setItem(TRACK_KEY, JSON.stringify(arr));
        }

        function renderTracks() {
            const logs = getTracks();
            if (!logs.length) {
                trackLog.innerHTML = '<small class="note">No sleep records yet.</small>';
                return;
            }
            trackLog.innerHTML = logs.slice().reverse().map(e => (
                `<div style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.03)">
      <strong>${e.date}</strong> — Slept: ${e.sleep} • Woke: ${e.wake} • ${e.duration} hrs
    </div>`
            )).join('');
        }

        function saveTrack() {
            const sleep = sleepInput.value,
                wake = wakeInput.value;
            if (!sleep || !wake) {
                alert('Please enter both sleep and wake times.');
                return;
            }
            const s = new Date('1970-01-01T${sleep}:00');
            const w = new Date('1970-01-01T${wake}:00');
            let hours = (w - s) / (1000 * 60 * 60);
            if (hours < 0) hours += 24;
            hours = Math.round(hours * 10) / 10;
            const entry = {
                id: Date.now(),
                date: new Date().toLocaleDateString(),
                sleep,
                wake,
                duration: hours
            };
            const logs = getTracks();
            logs.push(entry);
            saveTracks(logs);
            sleepInput.value = '';
            wakeInput.value = '';
            renderTracks();
        }

        function clearTracks() {
            if (!confirm('Clear all sleep logs?')) return;
            localStorage.removeItem(TRACK_KEY);
            renderTracks();
        }
        saveTrackBtn.addEventListener('click', saveTrack);
        clearTrackBtn.addEventListener('click', clearTracks);
        renderTracks();

        /* -------------------------
           REMINDER (popup + countdown)
           ------------------------- */
        const remInput = document.getElementById('reminderTime');
        const setRemBtn = document.getElementById('setRemBtn');
        const cancelRemBtn = document.getElementById('cancelRemBtn');
        const remStatus = document.getElementById('remStatus');
        const remCountdown = document.getElementById('remCountdown');
        const remPopup = document.getElementById('remPopup');
        const remAudio = document.getElementById('remAudio');
        const ackRemBtn = document.getElementById('ackRemBtn');
        const snoozeRemBtn = document.getElementById('snoozeRemBtn');

        let remTime = null,
            remInterval = null;

        setRemBtn.addEventListener('click', () => {
            const val = remInput.value;
            if (!val) {
                alert('Please pick a time for the reminder.');
                return;
            }
            const [h, m] = val.split(':').map(Number);
            const t = new Date();
            t.setHours(h, m, 0, 0);
            if (t <= new Date()) t.setDate(t.getDate() + 1);
            remTime = t;
            remStatus.textContent = `Reminder set for ${t.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
            startReminderCountdown();
        });

        cancelRemBtn.addEventListener('click', () => {
            remTime = null;
            if (remInterval) clearInterval(remInterval);
            remStatus.textContent = 'Reminder canceled.';
            remCountdown.textContent = '';
        });

        function startReminderCountdown() {
            if (remInterval) clearInterval(remInterval);
            remInterval = setInterval(() => {
                if (!remTime) return;
                const diff = remTime - new Date();
                if (diff <= 0) {
                    clearInterval(remInterval);
                    triggerReminder();
                    return;
                }
                const hrs = Math.floor(diff / (1000 * 60 * 60));
                const mins = Math.floor((diff / (1000 * 60)) % 60);
                const secs = Math.floor((diff / 1000) % 60);
                remCountdown.textContent =' Time left: ${hrs}h ${mins}m ${secs}s';
            }, 900);
        }

        function triggerReminder() {
            remPopup.classList.add('show');
            remPopup.setAttribute('aria-hidden', 'false');
            try {
                remAudio.currentTime = 0;
                remAudio.play();
            } catch (e) {
                /* ignore */
            }
        }

        ackRemBtn.addEventListener('click', () => {
            remPopup.classList.remove('show');
            remPopup.setAttribute('aria-hidden', 'true');
            if (!remAudio.paused) {
                remAudio.pause();
                remAudio.currentTime = 0;
            }
            remStatus.textContent = 'Reminder acknowledged — goodnight ✨';
            remCountdown.textContent = '';
            remTime = null;
        });
        snoozeRemBtn.addEventListener('click', () => {
            remPopup.classList.remove('show');
            remPopup.setAttribute('aria-hidden', 'true');
            if (!remAudio.paused) {
                remAudio.pause();
                remAudio.currentTime = 0;
            }
            if (remTime) {
                remTime = new Date(remTime.getTime() + 10 * 60 * 1000);
                remStatus.textContent = `Snoozed 10m — new time ${remTime.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
                startReminderCountdown();
            }
        });

        /* -------------------------
           BREATHING (adaptive theme + controls)
           ------------------------- */
        const ball = document.getElementById('breathingBall');
        const breathText = document.getElementById('breathingText');
        const startBreathBtn = document.getElementById('startBreathBtn');
        const stopBreathBtn = document.getElementById('stopBreathBtn');

        let breathing = false,
            breathPhase = 0,
            breathInterval = null;
        const breathSeq = ["Breathe In", "Hold", "Breathe Out", "Hold"];

        function updateBreathText() {
            breathText.textContent = breathSeq[breathPhase];
            breathPhase = (breathPhase + 1) % breathSeq.length;
        }

        function startBreathing() {
            if (breathing) return;
            breathing = true;
            ball.style.animation = 'breathe 12s ease-in-out infinite';
            ball.style.filter = 'brightness(1.05)';
            breathPhase = 0;
            updateBreathText();
            breathInterval = setInterval(updateBreathText, 3000); // keeps in sync with 12s full cycle (4 phases * 3s each)
        }

        function stopBreathing() {
            breathing = false;
            ball.style.animation = 'none';
            ball.style.filter = '';
            breathText.textContent = 'Press Start to begin';
            clearInterval(breathInterval);
        }

        startBreathBtn.addEventListener('click', startBreathing);
        stopBreathBtn.addEventListener('click', stopBreathing);

        /* -------------------------
           Accessibility helpers / small polish
           ------------------------- */
        // Stop audio when navigating away from sounds panel handled above in tab listener.

        // make theme toggle keyboard accessible
        themeBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                themeBtn.click();
            }
        });

        /* -------------------------
           End of script
           ------------------------- */
   