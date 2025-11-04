
        function showSection(id) {
            closePopup();
            document.getElementById(id).style.display = "block";
            window.scrollTo({
                top: document.getElementById(id).offsetTop - 50,
                behavior: 'smooth'
            });
        }

        function closePopup() {
            document.querySelectorAll('.popup').forEach(p => p.style.display = "none");
        }

        function updateProgress() {
            let val = document.getElementById("goal").value;
            if (val < 0) val = 0;
            if (val > 100) val = 100;
            document.getElementById("fill").style.width = val + "%";
            document.getElementById("progressValue").innerText = val + "%";
        }
