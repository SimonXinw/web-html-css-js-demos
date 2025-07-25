/**
 * 成语连连看 - 成语数据库
 * 包含中国经典成语和谚语
 */

// 成语数据库 - 按关卡分组
const IDIOM_DATA = {
    // 第1关 - 基础成语
    level1: [
        {
            idiom: "一心一意",
            meaning: "心思、意念专一",
            hint: "专心致志，毫无杂念",
            chars: ["一", "心", "一", "意"]
        },
        {
            idiom: "三心二意",
            meaning: "意志不坚定，犹豫不决",
            hint: "心思不专一，态度不坚定",
            chars: ["三", "心", "二", "意"]
        },
        {
            idiom: "四面八方",
            meaning: "指各个方向",
            hint: "周围各个方向",
            chars: ["四", "面", "八", "方"]
        },
        {
            idiom: "五光十色",
            meaning: "形容色彩鲜艳，花样繁多",
            hint: "色彩繁多，非常美丽",
            chars: ["五", "光", "十", "色"]
        },
        {
            idiom: "六神无主",
            meaning: "形容心慌意乱，拿不定主意",
            hint: "心神不定，不知所措",
            chars: ["六", "神", "无", "主"]
        }
    ],
    
    // 第2关 - 动物成语
    level2: [
        {
            idiom: "龙飞凤舞",
            meaning: "形容书法笔势有力，灵活舒展",
            hint: "书法或舞蹈姿态优美",
            chars: ["龙", "飞", "凤", "舞"]
        },
        {
            idiom: "虎头蛇尾",
            meaning: "头大尾细，比喻做事有始无终",
            hint: "开始时声势很大，后来劲头很小",
            chars: ["虎", "头", "蛇", "尾"]
        },
        {
            idiom: "鸡犬不宁",
            meaning: "形容骚扰得厉害，连鸡狗都不得安宁",
            hint: "形容扰乱得很厉害",
            chars: ["鸡", "犬", "不", "宁"]
        },
        {
            idiom: "马到成功",
            meaning: "形容工作刚开始就取得成功",
            hint: "很快就获得成功",
            chars: ["马", "到", "成", "功"]
        },
        {
            idiom: "羊入虎口",
            meaning: "比喻好人落入坏人的手中",
            hint: "处于极危险的境地",
            chars: ["羊", "入", "虎", "口"]
        }
    ],
    
    // 第3关 - 颜色成语
    level3: [
        {
            idiom: "红红火火",
            meaning: "形容旺盛或经济优裕的生活",
            hint: "生活过得很兴旺",
            chars: ["红", "红", "火", "火"]
        },
        {
            idiom: "青出于蓝",
            meaning: "比喻学生超过老师或后人胜过前人",
            hint: "学生超越了老师",
            chars: ["青", "出", "于", "蓝"]
        },
        {
            idiom: "白手起家",
            meaning: "形容在没有基础和条件很差的情况下自力更生",
            hint: "从零开始创业",
            chars: ["白", "手", "起", "家"]
        },
        {
            idiom: "黑白分明",
            meaning: "比喻是非分得清楚",
            hint: "善恶、是非很清楚",
            chars: ["黑", "白", "分", "明"]
        },
        {
            idiom: "金碧辉煌",
            meaning: "形容建筑物装饰华丽，光彩夺目",
            hint: "装饰得非常华丽",
            chars: ["金", "碧", "辉", "煌"]
        }
    ],
    
    // 第4关 - 自然成语
    level4: [
        {
            idiom: "风和日丽",
            meaning: "和风习习，阳光灿烂",
            hint: "天气晴朗暖和",
            chars: ["风", "和", "日", "丽"]
        },
        {
            idiom: "雷声大雨点小",
            meaning: "比喻做起事来声势造得很大，实际行动却很少",
            hint: "声势大但实际效果小",
            chars: ["雷", "声", "大", "雨"]
        },
        {
            idiom: "山清水秀",
            meaning: "形容风景优美",
            hint: "山山水水都很清幽秀丽",
            chars: ["山", "清", "水", "秀"]
        },
        {
            idiom: "花好月圆",
            meaning: "花儿正盛开，月亮正圆满",
            hint: "比喻美好圆满",
            chars: ["花", "好", "月", "圆"]
        },
        {
            idiom: "春暖花开",
            meaning: "春天气候温暖，百花盛开",
            hint: "春天来了，景色宜人",
            chars: ["春", "暖", "花", "开"]
        }
    ],
    
    // 第5关 - 品德成语
    level5: [
        {
            idiom: "诚心诚意",
            meaning: "形容十分真挚诚恳",
            hint: "真心实意，毫不虚假",
            chars: ["诚", "心", "诚", "意"]
        },
        {
            idiom: "仁义道德",
            meaning: "泛指旧时鼓吹的道德规范",
            hint: "做人的基本品德",
            chars: ["仁", "义", "道", "德"]
        },
        {
            idiom: "礼尚往来",
            meaning: "指礼节上应该有来有往",
            hint: "你对我好，我也对你好",
            chars: ["礼", "尚", "往", "来"]
        },
        {
            idiom: "智勇双全",
            meaning: "又有智谋，又很勇敢",
            hint: "既聪明又勇敢",
            chars: ["智", "勇", "双", "全"]
        },
        {
            idiom: "信守承诺",
            meaning: "严格按照承诺去做",
            hint: "说话算数，言而有信",
            chars: ["信", "守", "承", "诺"]
        }
    ],
    
    // 第6关 - 经典谚语
    level6: [
        {
            idiom: "熟能生巧",
            meaning: "熟练了，就能找到窍门",
            hint: "做得多了自然就会了",
            chars: ["熟", "能", "生", "巧"]
        },
        {
            idiom: "水滴石穿",
            meaning: "水不停地滴，石头也能被滴穿",
            hint: "比喻只要有恒心，不断努力",
            chars: ["水", "滴", "石", "穿"]
        },
        {
            idiom: "团结就是力量",
            meaning: "指团结一致力量就强大",
            hint: "大家齐心协力就有力量",
            chars: ["团", "结", "力", "量"]
        },
        {
            idiom: "知识就是力量",
            meaning: "知识能够增强人的能力",
            hint: "有知识就有能力",
            chars: ["知", "识", "力", "量"]
        },
        {
            idiom: "实践出真知",
            meaning: "通过实践才能获得真正的知识",
            hint: "只有实际去做才能真正了解",
            chars: ["实", "践", "真", "知"]
        }
    ]
};

// 干扰字符库 - 用于生成麻将牌
const DISTRACTION_CHARS = [
    // 常用汉字
    "人", "大", "小", "中", "天", "地", "上", "下", "左", "右",
    "东", "西", "南", "北", "前", "后", "里", "外", "高", "低",
    "长", "短", "宽", "窄", "厚", "薄", "新", "旧", "好", "坏",
    "多", "少", "快", "慢", "早", "晚", "远", "近", "深", "浅",
    
    // 数字汉字
    "零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖",
    "拾", "佰", "仟", "万", "亿", "兆", "京", "垓", "秭", "穰",
    
    // 颜色字
    "紫", "橙", "粉", "灰", "棕", "银", "铜", "彩", "淡", "浓",
    
    // 动作字
    "走", "跑", "跳", "飞", "游", "爬", "坐", "站", "躺", "睡",
    "吃", "喝", "看", "听", "说", "笑", "哭", "唱", "跳", "玩",
    
    // 形容词
    "美", "丑", "香", "臭", "甜", "苦", "酸", "辣", "咸", "鲜",
    "热", "冷", "温", "凉", "干", "湿", "硬", "软", "粗", "细"
];

// 随机打乱数组（Fisher-Yates洗牌算法）
function shuffleArray(array) {
    const shuffled = [...array]; // 创建副本避免修改原数组
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // 交换元素
    }
    return shuffled;
}

// 获取指定关卡的成语数据
function getLevelIdioms(level) {
    const levelKey = `level${level}`;
    return IDIOM_DATA[levelKey] || IDIOM_DATA.level1;
}

// 获取总关卡数
function getTotalLevels() {
    return Object.keys(IDIOM_DATA).length;
}

// 生成麻将牌字符（包含成语字符和干扰字符）
function generateMahjongChars(idioms, gridSize = 48) {
    const chars = [];
    
    // 添加成语中的所有字符
    idioms.forEach(idiom => {
        idiom.chars.forEach(char => {
            chars.push(char);
        });
    });
    
    // 计算需要的干扰字符数量
    const neededChars = gridSize - chars.length;
    
    // 随机选择干扰字符（使用Fisher-Yates洗牌算法）
    const shuffledDistractions = shuffleArray([...DISTRACTION_CHARS]);
    
    for (let i = 0; i < neededChars && i < shuffledDistractions.length; i++) {
        chars.push(shuffledDistractions[i]);
    }
    
    // 如果还不够，重复添加一些随机字符
    while (chars.length < gridSize) {
        const randomChar = DISTRACTION_CHARS[Math.floor(Math.random() * DISTRACTION_CHARS.length)];
        chars.push(randomChar);
    }
    
    // 使用Fisher-Yates算法真正随机打乱字符顺序
    return shuffleArray(chars);
}

// 检查字符是否属于指定成语
function isCharInIdiom(char, idiom) {
    return idiom.chars.includes(char);
}

// 获取成语的下一个需要的字符
function getNextRequiredChar(idiom, selectedChars) {
    for (let i = 0; i < idiom.chars.length; i++) {
        if (!selectedChars[i]) {
            return { char: idiom.chars[i], position: i };
        }
    }
    return null;
}