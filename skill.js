document.addEventListener("DOMContentLoaded", () => {
    const skills = {
        communication: {
            title: "💬 Communication Skills",
            videos: [
                "https://www.youtube.com/embed/HAnw168huqA",
                "https://www.youtube.com/embed/vacGRuHDtO0",
                "https://www.youtube.com/embed/tShavGuo0_E" 
            ]
        },
        programming: {
            title: "💻 Programming Skills",
            videos: [
               "https://www.youtube.com/embed/zOjov-2OZ0E",
                "https://www.youtube.com/embed/kqtD5dpn9C8",
                "https://www.youtube.com/embed/8PopR3x-VMY" 
            ]
        },
        time: {
            title: "🕒 Time Management",
            videos: [
                "https://www.youtube.com/embed/iDbdXTMnOmE",
                "https://www.youtube.com/embed/lHfjvYzr-3g",
                "https://www.youtube.com/embed/UNZR9rlcZdA" 
            ]
        },
        teamwork: {
            title: "🤝 Teamwork",
            videos: [
               "https://www.youtube.com/embed/n_UhsBZNADM",
                "https://www.youtube.com/embed/mCEob8Jyecw",
                "https://www.youtube.com/embed/KT2TQGFWcko"
            ]
        },
        leadership: {
            title: "📊 Leadership Skills",
            videos: [
                "https://www.youtube.com/embed/owU5aTNPJbs",
                "https://www.youtube.com/embed/6HKJZv3YtHk",
                "https://www.youtube.com/embed/eXDNkwIeOqA" 
            ]
        },
        stress: {
            title: "🧘‍♀ Stress Management",
            videos: [
               "https://www.youtube.com/embed/TYWI929nZKg",
                "https://www.youtube.com/embed/ZToicYcHIOU",
                "https://www.youtube.com/embed/wzjWIxXBs_s"             ]
        }
    };

    const modal = document.getElementById("videoModal");
    const modalTitle = document.getElementById("modalTitle");
    const videoContainer = document.getElementById("videoContainer");
    const closeBtn = document.querySelector(".close");

    document.querySelectorAll(".skill-card").forEach(card => {
        card.addEventListener("click", () => {
            const key = card.getAttribute("data-skill");
            const skill = skills[key];

            modalTitle.textContent = skill.title;
            videoContainer.innerHTML = "";

            skill.videos.forEach(url => {
                const iframe = document.createElement("iframe");
                iframe.src = url;
                iframe.allowFullscreen = true;
                videoContainer.appendChild(iframe);
            });

            modal.style.display = "block";
        });
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
        videoContainer.innerHTML = "";
    });

    window.addEventListener("click", e => {
        if (e.target === modal) {
            modal.style.display = "none";
            videoContainer.innerHTML = "";
        }
    });
});

// Smooth scroll to skills
function scrollToSkills() {
    document.getElementById("skills-section").scrollIntoView({
        behavior: "smooth"
    });
}