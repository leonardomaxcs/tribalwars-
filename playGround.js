javascript:
//Creators: Leonardo Max

(function () {
    // ====== Config ======
    const troopCarryCapacity = { spear: 25, sword: 15, axe: 10 }; // per unit type
    const troopAvailable = { spear: 300, sword: 100, axe: 150 };  // initial stock
    const farmRange = 10; // max coords difference allowed for farm

    // ====== UI Creation ======
    function createUI() {
        const panel = document.createElement("div");
        panel.id = "tw-helper-panel";
        panel.style.position = "fixed";
        panel.style.top = "50px";
        panel.style.right = "20px";
        panel.style.width = "320px";
        panel.style.height = "500px";
        panel.style.background = "#f4f4f4";
        panel.style.border = "2px solid #333";
        panel.style.zIndex = 99999;
        panel.style.padding = "10px";
        panel.style.overflowY = "auto";
        panel.style.fontFamily = "Arial, sans-serif";
        panel.innerHTML = `
            <h3>TW Helper</h3>
            <button onclick="showTab('account')">Account</button>
            <button onclick="showTab('villages')">Villages</button>
            <button onclick="showTab('reports')">Reports</button>
            <button onclick="showTab('farm')">Auto Farm</button>
            <div id="tab-content" style="margin-top:10px;">Select a tab</div>
        `;
        document.body.appendChild(panel);
    }

    window.showTab = function (tab) {
        const content = document.getElementById("tab-content");
        if (tab === "account") {
            content.innerHTML = `<pre>${JSON.stringify(getAccountInfo(), null, 2)}</pre>`;
        }
        if (tab === "villages") {
            content.innerHTML = `<pre>${JSON.stringify(getVillageList(), null, 2)}</pre>`;
        }
        if (tab === "reports") {
            content.innerHTML = `<pre>${JSON.stringify(getReports(), null, 2)}</pre>`;
        }
        if (tab === "farm") {
            content.innerHTML = `
                <label>Max Wall Level: <input id="maxWallLevel" type="number" value="2"></label><br>
                <label>Farm Interval (min): <input id="farmInterval" type="number" value="30"></label><br>
                <button onclick="startAutoFarm()">Start Auto Farm</button>
                <h4>Planned Attacks:</h4>
                <div id="farmQueue" style="font-size:12px;"></div>
            `;
            updateFarmQueueUI();
        }
    };

    // ====== Simulation Data ======
    function getAccountInfo() {
        return { player: "Player123", points: 15432, rank: 234 };
    }

    function getVillageList() {
        return [
            { id: 1, name: "001 Village", x: 500, y: 500, prod: { wood: 50, clay: 40, iron: 30 }, wall: 1 },
            { id: 2, name: "002 Village", x: 502, y: 499, prod: { wood: 70, clay: 60, iron: 50 }, wall: 3 },
            { id: 3, name: "003 Village", x: 505, y: 498, prod: { wood: 80, clay: 75, iron: 65 }, wall: 0 }
        ];
    }

    function getReports() {
        return [
            { village: "001 Village", result: "Victory", loot: { wood: 100, clay: 80, iron: 70 } },
            { village: "002 Village", result: "Defeat", loot: { wood: 0, clay: 0, iron: 0 } }
        ];
    }

    // ====== Local Storage ======
    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    function loadData(key) {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }

    // ====== Troop Calculation ======
    function calculateTroopsForLoot(totalLoot) {
        let troops = { spear: 0, sword: 0, axe: 0 };
        let lootRemaining = totalLoot;

        const types = Object.keys(troopCarryCapacity);
        for (let type of types) {
            while (lootRemaining > 0 && troops[type] < troopAvailable[type]) {
                troops[type]++;
                lootRemaining -= troopCarryCapacity[type];
            }
        }
        return troops;
    }

    // ====== Auto Farm Logic ======
    window.startAutoFarm = function () {
        const maxWall = parseInt(document.getElementById("maxWallLevel").value);
        const interval = parseInt(document.getElementById("farmInterval").value) * 60 * 1000;

        console.log(`Auto farm started: max wall ${maxWall}, interval ${interval / 60000} min`);

        let villages = getVillageList();
        let farmTargets = villages.filter(v => v.wall <= maxWall);

        let farmQueue = loadData("farmQueue") || [];

        farmTargets.forEach(v => {
            const lootEstimate = v.prod.wood + v.prod.clay + v.prod.iron;
            const troopsNeeded = calculateTroopsForLoot(lootEstimate);
            const nextFarmTime = new Date(Date.now() + interval).toISOString();

            farmQueue.push({
                target: v.name,
                coords: `${v.x}|${v.y}`,
                loot: lootEstimate,
                troops: troopsNeeded,
                time: nextFarmTime
            });
        });

        saveData("farmQueue", farmQueue);
        updateFarmQueueUI();

        setInterval(() => {
            console.log(`[Farm Tick] Sending simulated attacks...`);
            farmQueue.forEach(task => {
                if (new Date(task.time) <= new Date()) {
                    console.log(`Farming ${task.target} with troops:`, task.troops);
                    task.time = new Date(Date.now() + interval).toISOString(); // reset timer
                }
            });
            saveData("farmQueue", farmQueue);
            updateFarmQueueUI();
        }, 5000); // check every 5s in simulation mode
    };

    // ====== UI Farm Queue Update ======
    function updateFarmQueueUI() {
        const queueDiv = document.getElementById("farmQueue");
        if (!queueDiv) return;
        let farmQueue = loadData("farmQueue") || [];
        queueDiv.innerHTML = farmQueue.map(t =>
            `${t.target} (${t.coords}) - Loot: ${t.loot} - Next: ${new Date(t.time).toLocaleTimeString()}`
        ).join("<br>");
    }

    // ====== Init ======
    createUI();
})();

