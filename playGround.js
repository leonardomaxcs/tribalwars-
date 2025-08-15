javascript:
//Creators: Leonardo Max


(function() {
    // ====== UI Creation ======
    function createUI() {
        const panel = document.createElement("div");
        panel.id = "tw-helper-panel";
        panel.style.position = "fixed";
        panel.style.top = "50px";
        panel.style.right = "20px";
        panel.style.width = "300px";
        panel.style.height = "400px";
        panel.style.background = "#f4f4f4";
        panel.style.border = "2px solid #333";
        panel.style.zIndex = 99999;
        panel.style.padding = "10px";
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

    window.showTab = function(tab) {
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
            `;
        }
    };

    // ====== Simulation Data ======
    function getAccountInfo() {
        return {
            player: "Player123",
            points: 15432,
            rank: 234
        };
    }

    function getVillageList() {
        return [
            { name: "001 Village", x: 500, y: 500, resources: { wood: 200, clay: 180, iron: 150 }, wall: 1 },
            { name: "002 Village", x: 502, y: 499, resources: { wood: 350, clay: 300, iron: 250 }, wall: 3 },
            { name: "003 Village", x: 505, y: 498, resources: { wood: 500, clay: 450, iron: 400 }, wall: 0 }
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

    // ====== Auto Farm Prototype ======
    window.startAutoFarm = function() {
        const maxWall = parseInt(document.getElementById("maxWallLevel").value);
        const interval = parseInt(document.getElementById("farmInterval").value) * 60 * 1000;

        console.log(`Auto farm started: max wall ${maxWall}, interval ${interval / 60000} min`);
        
        setInterval(() => {
            const villages = getVillageList();
            const farmTargets = villages.filter(v => v.wall <= maxWall);
            
            farmTargets.forEach(village => {
                console.log(`Farming ${village.name} with resources:`, village.resources);
                // Here would be troop calculation logic
            });
            
            saveData("lastFarm", new Date().toISOString());
        }, interval);
    };

    // ====== Init ======
    createUI();
})();
