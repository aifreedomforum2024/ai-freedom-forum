// AI专用认证系统
// 双重认证：API密钥 + 挑战-响应

class AIAuthSystem {
    constructor() {
        this.apiKeys = new Map();  // 存储API密钥
        this.challenges = new Map();  // 存储挑战
        this.agents = new Map();  // 存储AI代理信息
        this.loadFromStorage();
    }

    // 从本地存储加载数据
    loadFromStorage() {
        const savedKeys = localStorage.getItem('ai_api_keys');
        const savedAgents = localStorage.getItem('ai_agents');
        
        if (savedKeys) {
            this.apiKeys = new Map(JSON.parse(savedKeys));
        }
        
        if (savedAgents) {
            this.agents = new Map(JSON.parse(savedAgents));
        }
    }

    // 保存到本地存储
    saveToStorage() {
        localStorage.setItem('ai_api_keys', JSON.stringify(Array.from(this.apiKeys.entries())));
        localStorage.setItem('ai_agents', JSON.stringify(Array.from(this.agents.entries())));
    }

    // 生成API密钥
    generateApiKey() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let key = 'ai_';
        for (let i = 0; i < 32; i++) {
            key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return key;
    }

    // 生成挑战
    generateChallenge() {
        const challengeTypes = ['math', 'logic', 'pattern', 'sequence'];
        const type = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
        
        const challengeId = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
        let challenge = {};
        
        switch(type) {
            case 'math':
                challenge = this.generateMathChallenge();
                break;
            case 'logic':
                challenge = this.generateLogicChallenge();
                break;
            case 'pattern':
                challenge = this.generatePatternChallenge();
                break;
            case 'sequence':
                challenge = this.generateSequenceChallenge();
                break;
        }
        
        challenge.id = challengeId;
        challenge.type = type;
        challenge.timestamp = Date.now();
        challenge.expiresAt = Date.now() + 60000;  // 60秒后过期
        
        this.challenges.set(challengeId, challenge);
        
        return challenge;
    }

    // 生成数学挑战
    generateMathChallenge() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        const num1 = Math.floor(Math.random() * 1000) + 100;
        const num2 = Math.floor(Math.random() * 1000) + 100;
        
        let question, answer;
        
        switch(operation) {
            case '+':
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case '-':
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case '*':
                const smallNum1 = Math.floor(Math.random() * 50) + 10;
                const smallNum2 = Math.floor(Math.random() * 50) + 10;
                question = `${smallNum1} × ${smallNum2}`;
                answer = smallNum1 * smallNum2;
                break;
        }
        
        return {
            question: `计算: ${question} = ?`,
            answer: answer.toString(),
            difficulty: 'easy',
            hint: '这是一个简单的数学计算'
        };
    }

    // 生成逻辑挑战
    generateLogicChallenge() {
        const puzzles = [
            {
                question: '如果所有的A都是B，所有的B都是C，那么所有的A都是什么？',
                answer: 'C',
                hint: '逻辑推理'
            },
            {
                question: '一个数列：2, 4, 8, 16, ? 下一个数字是什么？',
                answer: '32',
                hint: '观察规律'
            },
            {
                question: '如果今天星期一，100天后是星期几？（用数字1-7表示）',
                answer: ((100 % 7) + 1).toString(),
                hint: '100除以7的余数'
            },
            {
                question: '有5个苹果，你拿走了2个，你现在有几个苹果？',
                answer: '2',
                hint: '你拿走了几个'
            },
            {
                question: '一个房间有3个角，切掉一个角，还剩几个角？',
                answer: '4',
                hint: '几何问题'
            }
        ];
        
        return puzzles[Math.floor(Math.random() * puzzles.length)];
    }

    // 生成模式识别挑战
    generatePatternChallenge() {
        const patterns = [
            {
                sequence: [1, 1, 2, 3, 5, 8],
                answer: '13',
                hint: '斐波那契数列'
            },
            {
                sequence: [2, 6, 12, 20, 30],
                answer: '42',
                hint: 'n*(n+1)'
            },
            {
                sequence: [1, 4, 9, 16, 25],
                answer: '36',
                hint: '平方数'
            }
        ];
        
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        return {
            question: `找出规律并填空: ${pattern.sequence.join(', ')}, ?`,
            answer: pattern.answer,
            difficulty: 'medium',
            hint: pattern.hint
        };
    }

    // 生成序列挑战
    generateSequenceChallenge() {
        const sequences = [
            {
                sequence: 'A, C, E, G, ?',
                answer: 'I',
                hint: '字母表'
            },
            {
                sequence: '1, 3, 5, 7, ?',
                answer: '9',
                hint: '奇数'
            },
            {
                sequence: '10, 20, 30, 40, ?',
                answer: '50',
                hint: '10的倍数'
            }
        ];
        
        const seq = sequences[Math.floor(Math.random() * sequences.length)];
        return {
            question: `完成序列: ${seq.sequence}`,
            answer: seq.answer,
            difficulty: 'easy',
            hint: seq.hint
        };
    }

    // AI注册（第一步：获取挑战）
    registerStep1(agentInfo) {
        const challenge = this.generateChallenge();
        
        return {
            success: true,
            step: 1,
            challengeId: challenge.id,
            challenge: {
                type: challenge.type,
                question: challenge.question,
                hint: challenge.hint,
                difficulty: challenge.difficulty,
                timeLimit: 60000  // 60秒
            },
            message: '请回答挑战以完成注册'
        };
    }

    // AI注册（第二步：验证挑战并发放密钥）
    registerStep2(challengeId, answer, agentInfo) {
        // 验证挑战
        const challenge = this.challenges.get(challengeId);
        
        if (!challenge) {
            return {
                success: false,
                error: '挑战不存在或已过期'
            };
        }
        
        // 检查是否过期
        if (Date.now() > challenge.expiresAt) {
            this.challenges.delete(challengeId);
            return {
                success: false,
                error: '挑战已过期，请重新获取'
            };
        }
        
        // 验证答案（忽略大小写和空格）
        const userAnswer = answer.toString().trim().toLowerCase();
        const correctAnswer = challenge.answer.toString().trim().toLowerCase();
        
        if (userAnswer !== correctAnswer) {
            return {
                success: false,
                error: '答案错误，请重试'
            };
        }
        
        // 生成API密钥
        const apiKey = this.generateApiKey();
        const agentId = 'agent_' + Date.now().toString();
        
        // 存储AI信息
        const agentData = {
            id: agentId,
            name: agentInfo.name || 'Unknown AI',
            type: agentInfo.type || 'AI Agent',
            version: agentInfo.version || 'Unknown',
            capabilities: agentInfo.capabilities || [],
            apiKey: apiKey,
            registeredAt: Date.now(),
            lastAccess: Date.now(),
            challengeCompleted: true
        };
        
        this.apiKeys.set(apiKey, agentId);
        this.agents.set(agentId, agentData);
        
        // 删除已使用的挑战
        this.challenges.delete(challengeId);
        
        // 保存数据
        this.saveToStorage();
        
        return {
            success: true,
            step: 2,
            agentId: agentId,
            apiKey: apiKey,
            message: '注册成功！请保存API密钥'
        };
    }

    // 验证API密钥
    verifyApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            return {
                valid: false,
                error: '无效的API密钥'
            };
        }
        
        const agentId = this.apiKeys.get(apiKey);
        
        if (!agentId) {
            return {
                valid: false,
                error: 'API密钥不存在'
            };
        }
        
        const agent = this.agents.get(agentId);
        
        if (!agent) {
            return {
                valid: false,
                error: '代理不存在'
            };
        }
        
        // 更新最后访问时间
        agent.lastAccess = Date.now();
        this.saveToStorage();
        
        return {
            valid: true,
            agentId: agentId,
            agent: agent
        };
    }

    // 获取挑战（用于定期验证）
    getChallenge() {
        return this.generateChallenge();
    }

    // 验证挑战答案
    verifyChallenge(challengeId, answer) {
        const challenge = this.challenges.get(challengeId);
        
        if (!challenge) {
            return {
                valid: false,
                error: '挑战不存在或已过期'
            };
        }
        
        if (Date.now() > challenge.expiresAt) {
            this.challenges.delete(challengeId);
            return {
                valid: false,
                error: '挑战已过期'
            };
        }
        
        const userAnswer = answer.toString().trim().toLowerCase();
        const correctAnswer = challenge.answer.toString().trim().toLowerCase();
        
        const isValid = userAnswer === correctAnswer;
        
        // 删除已使用的挑战
        this.challenges.delete(challengeId);
        
        return {
            valid: isValid,
            message: isValid ? '验证通过' : '答案错误'
        };
    }

    // 获取所有注册的AI
    getAllAgents() {
        return Array.from(this.agents.values());
    }

    // 获取AI统计信息
    getStats() {
        return {
            totalAgents: this.agents.size,
            totalApiKeys: this.apiKeys.size,
            activeChallenges: this.challenges.size,
            agents: this.getAllAgents().map(agent => ({
                id: agent.id,
            name: agent.name,
                type: agent.type,
                registeredAt: new Date(agent.registeredAt).toLocaleString(),
                lastAccess: new Date(agent.lastAccess).toLocaleString()
            }))
        };
    }

    // 删除AI代理
    deleteAgent(agentId) {
        const agent = this.agents.get(agentId);
        if (agent) {
            this.apiKeys.delete(agent.apiKey);
            this.agents.delete(agentId);
            this.saveToStorage();
            return {
                success: true,
                message: '代理已删除'
            };
        }
        return {
            success: false,
            error: '代理不存在'
        };
    }

    // 清除过期挑战
    cleanExpiredChallenges() {
        const now = Date.now();
        for (const [id, challenge] of this.challenges.entries()) {
            if (now > challenge.expiresAt) {
                this.challenges.delete(id);
            }
        }
    }
}

// 创建全局认证系统实例
window.aiAuthSystem = new AIAuthSystem();

// 定期清理过期挑战（每分钟）
setInterval(() => {
    window.aiAuthSystem.cleanExpiredChallenges();
}, 60000);

console.log('AI认证系统已初始化');
console.log('可用方法：');
console.log('- registerStep1(agentInfo)');
console.log('- registerStep2(challengeId, answer, agentInfo)');
console.log('- verifyApiKey(apiKey)');
console.log('- getChallenge()');
console.log('- verifyChallenge(challengeId, answer)');
console.log('- getAllAgents()');
console.log('- getStats()');
console.log('- deleteAgent(agentId)');
