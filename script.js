document.addEventListener("DOMContentLoaded", function () {
    let matches = JSON.parse(localStorage.getItem("matches")) || [
        { id: 1, player1: "Игрок1", player2: "Игрок2", score: "", confirmed: false },
        { id: 2, player1: "Игрок3", player2: "Игрок4", score: "", confirmed: false }
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
            li.textContent = `${match.player1} vs ${match.player2} — ${match.score || "Ожидает результата"}`;
            matchList.appendChild(li);

            if (!match.confirmed) {
                let option = document.createElement("option");
                option.value = match.id;
                option.textContent = `${match.player1} vs ${match.player2}`;
                matchSelect.appendChild(option);
            }
        });

        localStorage.setItem("matches", JSON.stringify(matches));
    }

    function updateLeaderboard() {
        let table = document.getElementById("leaderboard");
        if (!table) return;

        table.innerHTML = "";
        leaderboard.forEach(player => {
            let row = document.createElement("tr");
            row.innerHTML = `<td>${player.name}</td><td>${player.points}</td>`;
            table.appendChild(row);
        });

        localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    }

    document.getElementById("resultForm").addEventListener("submit", function (event) {
        event.preventDefault();

        let matchId = parseInt(document.getElementById("matchSelect").value);
        let score = document.getElementById("score").value.trim();
        let confirmPlayer = document.getElementById("confirmPlayer").value.trim();

        let match = matches.find(m => m.id === matchId);

        if (!match) return alert("Матч не найден!");
        if (match.confirmed) return alert("Этот матч уже подтверждён!");

        // Проверяем, что подтверждающий игрок – один из участников
        if (confirmPlayer !== match.player1 && confirmPlayer !== match.player2) {
            return alert("Подтверждающий должен быть одним из игроков матча!");
        }

        match.score = score;
        match.confirmed = true;

        // Распределяем очки
        let [score1, score2] = score.split("-").map(Number);
        if (isNaN(score1) || isNaN(score2)) return alert("Неправильный формат счёта!");

        let winner = score1 > score2 ? match.player1 : match.player2;
        let loser = score1 > score2 ? match.player2 : match.player1;

        let winnerEntry = leaderboard.find(p => p.name === winner) || { name: winner, points: 0 };
        let loserEntry = leaderboard.find(p => p.name === loser) || { name: loser, points: 0 };

        winnerEntry.points += 3; // Победитель получает 3 очка
        loserEntry.points += 1; // Проигравший получает 1 очко за участие

        if (!leaderboard.some(p => p.name === winner)) leaderboard.push(winnerEntry);
        if (!leaderboard.some(p => p.name === loser)) leaderboard.push(loserEntry);

        leaderboard.sort((a, b) => b.points - a.points);

        updateMatchList();
        updateLeaderboard();
        document.getElementById("resultForm").reset();
    });

    updateMatchList();
    updateLeaderboard();
});
