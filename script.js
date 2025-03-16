document.addEventListener("DOMContentLoaded", function () {
    let matches = JSON.parse(localStorage.getItem("matches")) || [
        { id: 1, team1: "Atlético Madrid", logo1: "atlético.png", player1: "mega-tax3", 
          team2: "Manchester City", logo2: "man_city.png", player2: "Rerirois", score: "- : -", confirmed: false },
        { id: 2, team1: "Manchester City", logo1: "man_city.png", player1: "Rerirois", 
          team2: "Liverpool", logo2: "liverpool.png", player2: "Edu7sher", score: "- : -", confirmed: false }
    ];

    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

    function updateMatchList() {
        let matchList = document.getElementById("matchList");
        let matchSelect = document.getElementById("matchSelect");
        if (!matchList || !matchSelect) return;

        matchList.innerHTML = "";
        matchSelect.innerHTML = "";

        matches.forEach(match => {
            let li = document.createElement("li");
            li.textContent = `${match.team1} (${match.player1}) vs ${match.team2} (${match.player2}) — ${match.score}`;
            matchList.appendChild(li);

            if (!match.confirmed) {
                let option = document.createElement("option");
                option.value = match.id;
                option.textContent = `${match.team1} vs ${match.team2}`;
                matchSelect.appendChild(option);
            }
        });

        localStorage.setItem("matches", JSON.stringify(matches));
    }

    function updateLatestResults() {
        let resultsList = document.getElementById("resultsList");
        if (!resultsList) return;

        let playedMatches = matches.filter(m => m.confirmed).slice(-5); // Показываем последние 5 матчей
        resultsList.innerHTML = "";

        playedMatches.forEach(match => {
            let li = document.createElement("li");
            li.classList.add("result-item");
            li.innerHTML = `
                <div class="result">
                    <img src="images/${match.logo1}" alt="${match.team1}">
                    <span class="team">${match.team1}</span>
                    <span class="score">${match.score}</span>
                    <span class="team">${match.team2}</span>
                    <img src="images/${match.logo2}" alt="${match.team2}">
                </div>
            `;
            resultsList.appendChild(li);
        });

        localStorage.setItem("matches", JSON.stringify(matches));
    }

    document.getElementById("resultForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let matchId = parseInt(document.getElementById("matchSelect").value);
        let score = document.getElementById("score").value.trim();
        let confirmPlayer = document.getElementById("confirmPlayer").value.trim();

        let match = matches.find(m => m.id === matchId);
        if (!match) return alert("Матч не найден!");
        if (match.confirmed) return alert("Этот матч уже подтверждён!");

        if (confirmPlayer !== match.player1 && confirmPlayer !== match.player2) {
            return alert("Подтверждающий должен быть одним из игроков матча!");
        }

        match.score = score;
        match.confirmed = true;

        let [score1, score2] = score.split("-").map(Number);
        if (isNaN(score1) || isNaN(score2)) return alert("Неправильный формат счёта!");

        let winner = score1 > score2 ? match.player1 : match.player2;
        let loser = score1 > score2 ? match.player2 : match.player1;

        let winnerEntry = leaderboard.find(p => p.name === winner) || { name: winner, points: 0 };
        let loserEntry = leaderboard.find(p => p.name === loser) || { name: loser, points: 0 };

        winnerEntry.points += 3; // Победитель получает 3 очка
        loserEntry.points += 1; // Проигравший получает 1 очко

        if (!leaderboard.some(p => p.name === winner)) leaderboard.push(winnerEntry);
        if (!leaderboard.some(p => p.name === loser)) leaderboard.push(loserEntry);

        leaderboard.sort((a, b) => b.points - a.points);

        updateMatchList();
        updateLatestResults();
        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));

        document.getElementById("resultForm").reset();
    });

    updateMatchList();
    updateLatestResults();
});

});
