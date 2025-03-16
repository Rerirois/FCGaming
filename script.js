document.addEventListener("DOMContentLoaded", function () {
    let players = [
        { name: "Игрок1", points: 50 },
        { name: "Игрок2", points: 40 },
        { name: "Игрок3", points: 30 }
    ];

    let leaderboard = document.getElementById("leaderboard");

    players.forEach(player => {
        let row = document.createElement("tr");
        row.innerHTML = `<td>${player.name}</td><td>${player.points}</td>`;
        leaderboard.appendChild(row);
    });
});
