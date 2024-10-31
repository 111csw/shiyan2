class Player {
    constructor() {
        this.health = 100; // 初始血量
        this.treasure = 0; // 初始财富量
    }

    encounterTreasure(amount) {
        this.treasure += amount;
        return `你找到了${amount}个金币！`;
    }

    encounterThief(amount) {
        this.treasure -= amount;
        return `坏人抢走了${amount}个金币！`;
    }

    encounterSnake(damage) {
        this.health -= damage;
        return `被毒蛇咬了，失去${damage}点血！`;
    }

    encounterNPC(type) {
        let message = '';
        if (type === 'friendly') {
            const reward = Math.floor(Math.random() * 21) + 10; // 10-30
            this.health += reward;
            message = `友好的NPC帮助你，恢复了${reward}点血！`;
        } else {
            const penalty = Math.floor(Math.random() * 11) + 5; // 5-15
            this.treasure -= penalty;
            message = `敌对的NPC抢走了${penalty}个金币！`;
        }
        return message;
    }
}

class Game {
    constructor() {
        this.player = new Player();
        this.currentLevel = 1;
        this.maxLevel = 10;
        this.outputElement = document.getElementById('output');
        this.choiceButtons = document.getElementById('choiceButtons');
        this.eventImageElement = document.getElementById('eventImage');

        // 按钮事件绑定
        document.getElementById('leftBtn').addEventListener('click', () => this.makeChoice('左'));
        document.getElementById('rightBtn').addEventListener('click', () => this.makeChoice('右'));
        document.getElementById('straightBtn').addEventListener('click', () => this.makeChoice('直走'));
    }

    async startGame() {
        this.outputElement.innerText = ''; // 清空输出
        this.choiceButtons.classList.remove('hidden'); // 显示选择按钮
        await this.playLevel(this.currentLevel);
    }

    async playLevel(level) {
        this.outputElement.innerText += `第${level}关: 你要选择哪个方向？\n\n`; // 添加了额外的换行
        if (level > this.maxLevel) {
            this.endGame();
            return;
        }
    }

    makeChoice(choice) {
        let result = '';
        const encounterNPC = Math.random() < 0.3; // 30%的几率遇到NPC
        let npcType = '';
        this.eventImageElement.classList.add('hidden'); // 每次选择前隐藏事件图片

        // 根据选择的方向触发不同事件
        switch (choice) {
            case '左':
                result = this.player.encounterTreasure(Math.floor(Math.random() * 41) + 10); // 10-50金币
                this.eventImageElement.innerHTML = '<img src="images/treasure.png" alt="宝藏">';
                break;
            case '右':
                result = this.player.encounterThief(Math.floor(this.player.treasure * 0.2)); // 20%财富
                this.eventImageElement.innerHTML = '<img src="images/badman.png" alt="坏人">';
                break;
            case '直走':
                result = this.player.encounterSnake(Math.floor(Math.random() * 11) + 5); // 5-15点血
                this.eventImageElement.innerHTML = '<img src="images/snake.png" alt="毒蛇">';
                break;
        }

        // NPC 互动
        if (encounterNPC) {
            npcType = Math.random() < 0.5 ? 'friendly' : 'hostile'; // 50%概率友好或敌对
            result += `\n${this.player.encounterNPC(npcType)}`;
        }

        this.outputElement.innerText += `${result}\n当前血量: ${this.player.health}, 当前财富: ${this.player.treasure}\n\n`; // 添加了额外的换行
        this.eventImageElement.classList.remove('hidden'); // 显示事件图片

        if (this.player.health <= 0) {
            this.outputElement.innerText += "游戏结束！你被毒蛇咬死了。\n";
            this.choiceButtons.classList.add('hidden'); // 隐藏选择按钮
            return;
        }

        this.currentLevel++;
        if (this.currentLevel > this.maxLevel) {
            this.endGame();
        } else {
            this.playLevel(this.currentLevel);
        }
    }

    endGame() {
        this.outputElement.innerText += `游戏结束！你到达了第${this.maxLevel}关。\n最终血量: ${this.player.health}, 财富: ${this.player.treasure}\n`;
        this.choiceButtons.classList.add('hidden'); // 隐藏选择按钮
    }
}

// 启动游戏
document.getElementById('startBtn').addEventListener('click', () => {
    const game = new Game(); // 创建新的游戏实例
    game.startGame(); // 开始游戏
    // 仅在开始时显示按钮
    document.getElementById('choiceButtons').classList.remove('hidden');
});
