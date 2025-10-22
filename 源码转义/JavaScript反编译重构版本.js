/**
 * ======================================================================
 * Webpack打包代码反编译重构版本
 * 原始代码：Vision Master Max 产品页面核心功能
 * 反编译时间：2025年
 * ======================================================================
 */

/**
 * ======================================================================
 * 1. 模块加载器和依赖管理
 * ======================================================================
 */

// Webpack模块加载器
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([[3952], {

/**
 * ======================================================================
 * 2. 箭头图标组件 (模块 21226)
 * ======================================================================
 */
21226: function(exports, module, require) {
    "use strict";
    
    // React导入
    
    const React = require(2602);
    
    // Object.assign兼容性处理
    function assignPolyfill() {
        return (assignPolyfill = Object.assign ? Object.assign.bind() : function(target) {
            for (let i = 1; i < arguments.length; i++) {
                const source = arguments[i];
                for (let key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }
            return target;
        }).apply(null, arguments);
    }
    
    // 箭头图标组件
    const ArrowIcon = (props) => {
        let pathElement = null;
        
        return React.createElement("svg", assignPolyfill({
            viewBox: "0 0 18 18",
            fill: "none"
        }, props), pathElement || (pathElement = React.createElement("path", {
            d: "M.6 7.872h13.344L7.296 1.68 8.808.144 17.4 8.352v1.32l-8.592 8.184-1.512-1.536 6.696-6.24H.6z",
            fill: "currentColor"
        })));
    };
    
    // 导出箭头图标组件
    module.Z = ArrowIcon;
},

/**
 * ======================================================================
 * 3. 模块依赖加载器 (模块 51319)
 * ======================================================================
 */
51319: function(exports, module, require) {
    // 异步加载所有依赖模块
    const dependencies = [
        83155, 74281, 49236, 19714, 99854, 62355, 401, 71707
    ];
    
    dependencies.forEach(moduleId => {
        Promise.resolve().then(require.bind(require, moduleId));
    });
},

/**
 * ======================================================================
 * 4. 视差滚动动画组件 (模块 51953)
 * ======================================================================
 */
51953: function(exports, module, require) {
    "use strict";
    
    // 导入依赖
    const React = require(11178);
    const { useMotionValue } = require(28107);
    const { useViewportScroll } = require(38492);
    const { useSpring } = require(82583);
    const { useTransform } = require(84694);
    const { useAnimationFrame } = require(24244);
    const styled = require(62924);
    
    // 视差滚动Hook
    const useParallaxScroll = (config) => {
        // 动画值初始化
        const transform = useMotionValue(0);
        const { scrollY } = useViewportScroll();
        const smoothScrollY = useSpring(scrollY, {
            damping: 50,
            stiffness: 400
        });
        
        // 速度计算
        const velocity = useTransform(smoothScrollY, [0, 1000], [0, 0], {
            clamp: false
        });
        
        // 状态管理
        const [dimensions, setDimensions] = React.useState([0, 0]);
        const velocityRef = React.useRef(0);
        const directionRef = React.useRef(1);
        
        // X轴变换
        const x = useTransform(transform, (latest) => 
            `${clamp(-dimensions[0], 0, latest - velocityRef.current)}px`
        );
        
        // 动画帧处理
        useAnimationFrame((time, delta) => {
            if (!config.isInView) return;
            
            let moveBy = directionRef.current * config.baseVelocity * (delta / 1000);
            moveBy += moveBy * directionRef.current * velocity.get();
            transform.set(transform.get() + moveBy);
        });
        
        // 容器引用和尺寸监听
        const containerRef = React.useRef(null);
        
        React.useEffect(() => {
            let timeoutId;
            const element = containerRef.current;
            
            if (!element || !config.isInView || config.onlySingle) {
                return () => {
                    velocityRef.current = 0;
                };
            }
            
            // 尺寸观察器
            const resizeObserver = new ResizeObserver(() => {
                if (element) {
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(() => {
                        setDimensions([
                            element.offsetWidth, 
                            element.parentNode?.offsetWidth || 0
                        ]);
                    }, 200);
                }
            });
            
            resizeObserver.observe(element);
            
            return () => {
                resizeObserver.unobserve(element);
                clearTimeout(timeoutId);
            };
        }, [config.isInView, config.onlySingle]);
        
        // 拖拽处理
        const [isDragging, setIsDragging] = React.useState(false);
        
        React.useEffect(() => {
            const containerElement = config.container.current;
            if (!containerElement || !config.isInView) return;
            
            let isDragging = false;
            let dragOffset = 0;
            let lastVelocity = velocityRef.current;
            
            // 鼠标事件处理
            const handleMouseDown = (e) => {
                isDragging = true;
                setIsDragging(true);
                dragOffset = lastVelocity + e.clientX;
            };
            
            const handleMouseUp = () => {
                isDragging = false;
                setIsDragging(false);
            };
            
            const handleMouseMove = (e) => {
                if (isDragging) {
                    const newVelocity = dragOffset - e.clientX;
                    if (newVelocity > velocityRef.current) {
                        directionRef.current = -1;
                    } else if (newVelocity < velocityRef.current) {
                        directionRef.current = 1;
                    }
                    velocityRef.current = newVelocity;
                }
            };
            
            // 触摸事件处理
            const handleTouchStart = (e) => {
                if (e.touches[0]) {
                    handleMouseDown({ clientX: e.touches[0].clientX });
                }
            };
            
            const handleTouchMove = (e) => {
                e.preventDefault();
                if (e.touches[0]) {
                    handleMouseMove({ clientX: e.touches[0].clientX });
                }
            };
            
            // 事件监听器
            containerElement.addEventListener("mousedown", handleMouseDown);
            containerElement.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
            containerElement.addEventListener("mouseleave", handleMouseUp);
            containerElement.addEventListener("touchstart", handleTouchStart);
            containerElement.addEventListener("touchmove", handleTouchMove);
            containerElement.addEventListener("touchend", handleMouseUp);
            
            return () => {
                containerElement.removeEventListener("mousedown", handleMouseDown);
                containerElement.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
                containerElement.removeEventListener("mouseleave", handleMouseUp);
                containerElement.removeEventListener("touchstart", handleTouchStart);
                containerElement.removeEventListener("touchmove", handleTouchMove);
                containerElement.removeEventListener("touchend", handleMouseUp);
            };
        }, [config]);
        
        return {
            x,
            containerRef,
            isDragging,
            setDimensions
        };
    };
    
    // 样式组件
    const CarouselContainer = styled.div`
        display: flex;
        cursor: ${props => props.$isOnlySingle ? "" : props.$isGrabbing ? "grabbing" : "grab"};
    `;
    
    const CarouselContent = styled.div`
        display: flex;
        height: 100%;
        flex-shrink: 0;
        
        > * {
            flex-shrink: 0;
            width: auto;
            height: 100%;
        }
    `;
    
    // 主轮播组件
    const IconsCarousel = (config) => {
        const { medias, spaceBottom, onlySingle } = config;
        const containerRef = React.useRef(null);
        const { ref: inViewRef, inView } = useIntersectionObserver({
            threshold: 0
        });
        
        const {
            x,
            containerRef: scrollRef,
            isDragging,
            setDimensions
        } = useParallaxScroll({
            baseVelocity: 60,
            isInView: inView,
            id: "logo-carousel",
            container: containerRef,
            onlySingle: onlySingle
        });
        
        return (
            <Container 
                className="icons-carousel-inner"
                ref={inViewRef}
                $spaceTop="small"
                $spaceBottom={spaceBottom || "large"}
                $layoutWidth={onlySingle ? "regular" : undefined}
            >
                <CarouselWrapper ref={containerRef}>
                    <CarouselContainer
                        className="icons-carousel-row-content-container"
                        style={{ x }}
                        $isGrabbing={isDragging}
                        $isOnlySingle={onlySingle}
                    >
                        <CarouselContent
                            className="row-content-container-child-container1"
                            ref={scrollRef}
                        >
                            {medias && medias.filter(Boolean).map((media, index) => {
                                const image = media.image;
                                return (
                                    <div
                                        key={String(image?.src || index)}
                                        className="icon-image-container"
                                    >
                                        {image && (
                                            <MediaRender
                                                image={{
                                                    fill: false,
                                                    width: 200,
                                                    height: 200,
                                                    ...image
                                                }}
                                                id={`IconsCarouselRow${index}`}
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </CarouselContent>
                        
                        {!onlySingle && (
                            <>
                                <CarouselContent>
                                    {/* 重复内容用于无限滚动 */}
                                </CarouselContent>
                                {/* 根据容器宽度动态生成更多副本 */}
                            </>
                        )}
                    </CarouselContainer>
                </CarouselWrapper>
            </Container>
        );
    };
    
    // 导出组件
    module.exports = {
        H: IconsCarousel
    };
},

/**
 * ======================================================================
 * 5. 加载动画组件 (模块 76103)
 * ======================================================================
 */
76103: function(exports, module, require) {
    "use strict";
    
    const React = require(11183);
    const styled = require(59173);
    
    // 加载动画关键帧
    const loadingAnimation = styled.keyframes`
        0% { background: currentColor; }
        25% { background: hsl(220, 5%, 80%); }
        50% { background: currentColor; }
        100% { background: currentColor; }
    `;
    
    // 加载组件容器
    const LoadingContainer = styled.span`
        display: flex;
        gap: 3px;
        width: 30px !important;
        height: 8px;
        align-items: center;
        padding: 0;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        
        span {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: white;
            transform: scale(0.8);
        }
        
        > span:nth-of-type(1) {
            animation: 0.6s ${loadingAnimation} linear infinite;
            animation-delay: -0.6s;
        }
        
        > span:nth-of-type(2) {
            animation: 0.6s ${loadingAnimation} linear infinite;
            animation-delay: -0.4s;
        }
        
        > span:nth-of-type(3) {
            animation: 0.6s ${loadingAnimation} linear infinite;
            animation-delay: -0.2s;
        }
    `;
    
    // 加载动画组件
    const LoadingSpinner = () => (
        <LoadingContainer>
            <span />
            <span />
            <span />
        </LoadingContainer>
    );
    
    module.Z = LoadingSpinner;
},

/**
 * ======================================================================
 * 6. 输入框组件 (模块 98417)
 * ======================================================================
 */
98417: function(exports, module, require) {
    "use strict";
    
    const styled = require(59173);
    
    // 基础输入框样式
    const baseInputStyles = styled.css`
        outline: 0;
        font-size: inherit;
        line-height: 24px;
        display: block;
        width: 100%;
        color: inherit;
        background: hsla(0, 0%, 100%, 0.2);
        border-radius: 5em;
        background-clip: padding-box;
        border: none;
        transition: background 0.2s ease, border 0.2s ease;
        padding: 0 1.5em;
        
        &::placeholder {
            color: currentColor;
            opacity: 0.4;
        }
    `;
    
    // 样式化输入框
    const StyledInput = styled.input`
        ${baseInputStyles};
        line-height: 1.33em;
        transition: color 0.2s ease;
        font-size: 16px;
        height: ${props => {
            if (props.$size === 'large') return '54px';
            if (props.$size === 'tiny') return '32px';
            if (props.$size === 'small') return '40px';
            return '46px';
        }};
        padding: ${props => props.$size === 'tiny' ? '0 1.25em' : '0 1.5em'};
        line-height: 1.33em;
        
        ${props => props.$error && styled.css`
            border-color: red;
        `}
    `;
    
    // 文本域组件
    const StyledTextarea = styled.textarea`
        ${baseInputStyles};
        resize: none;
        ${props => props.error && "border-color: red"}
    `;
    
    module.exports = {
        II: StyledInput
    };
},

/**
 * ======================================================================
 * 7. 轮盘抽奖API配置 (模块 32582)
 * ======================================================================
 */
32582: function(exports, module, require) {
    "use strict";
    
    // API端点配置
    const API_ENDPOINTS = {
        // 产品评分列表
        PRODUCT_RATING_LIST: {
            path: "/system/valerionProductRating/list",
            method: "GET"
        },
        
        // 订单号验证
        VALIDATE_ORDER_NUMBER: {
            path: "/system/valerionAccessoriesBack/validateOrderNumber",
            method: "GET"
        },
        
        // 抽奖奖品列表
        LOTTERY_PRIZE_LIST: {
            path: "/system/wheelLotteryPrize/list",
            method: "GET"
        },
        
        // 抽奖接口
        LOTTERY_DRAW: {
            path: "/system/wheelLotteryWinning/prizeDraw",
            method: "POST"
        }
    };
    
    module.exports = {
        Qw: API_ENDPOINTS.PRODUCT_RATING_LIST,
        Jw: API_ENDPOINTS.VALIDATE_ORDER_NUMBER,
        l5: API_ENDPOINTS.LOTTERY_PRIZE_LIST,
        mI: API_ENDPOINTS.LOTTERY_DRAW
    };
},

/**
 * ======================================================================
 * 8. API请求Hook (模块 29651)
 * ======================================================================
 */
29651: function(exports, module, require) {
    "use strict";
    
    const React = require(11178);
    
    // 构建查询字符串
    const buildQueryString = (params) => {
        if (!params) return "";
        
        const entries = Object.entries(params)
            .filter(([key, value]) => value != null)
            .map(([key, value]) => {
                const encodedKey = encodeURIComponent(key);
                const encodedValue = encodeURIComponent(
                    typeof value === "object" ? JSON.stringify(value) : value
                );
                return `${encodedKey}=${encodedValue}`;
            });
        
        return entries.length ? `?${entries.join("&")}` : "";
    };
    
    // API请求Hook
    const useApiRequest = () => {
        const [loading, setLoading] = React.useState(false);
        const [data, setData] = React.useState(null);
        const [error, setError] = React.useState(null);
        
        const fetchData = async (requestConfig) => {
            const { path, query, body = {}, method = "POST" } = requestConfig;
            
            setLoading(true);
            setError(null);
            setData(null);
            
            try {
                const queryString = buildQueryString(query);
                const url = path + queryString;
                
                const response = await fetch("/api/backEnd/admin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        url: url,
                        method: method,
                        ...body
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`Request failed with status: ${response.status}`);
                }
                
                const result = await response.json();
                setData(result);
                return result;
                
            } catch (err) {
                setData(null);
                setError(err instanceof Error ? err.message : "Fetch error");
                return null;
            } finally {
                setLoading(false);
            }
        };
        
        return {
            loading,
            data,
            error,
            fetchData
        };
    };
    
    module.Z = useApiRequest;
},

/**
 * ======================================================================
 * 9. 抽奖功能组件 (模块中的关键部分)
 * ======================================================================
 */

// 抽奖错误消息
const LOTTERY_ERROR_MESSAGES = {
    emailFormatError: "Invalid email format.",
    emailAlreadySubmitted: "This email has already participated in the draw. Please check again.",
    allPrizesClaimed: "Too late! All prizes have been claimed.",
    ipLargeThanThree: "You have already participated in the draw 3 times. Please try again later.",
    otherError: "Draw failed. Please try again later."
};

// 邮箱验证正则
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 抽奖状态枚举
const LOTTERY_STATUS = {
    SUCCESS: 0,
    EMAIL_ALREADY_SUBMITTED: 1,
    IP_LARGE_THAN_THREE: 2,
    ALL_PRIZES_CLAIMED: 3
};

// 轮盘旋转Hook
const useTurnplateRotation = () => {
    const turnplateRef = React.useRef(null);
    const rotationRef = React.useRef(0);
    
    const rotateTurnplate = React.useCallback((prizeIndex, totalPrizes = 6) => {
        return new Promise((resolve, reject) => {
            try {
                if (!turnplateRef.current) {
                    reject(new Error("turnplate element not found"));
                    return;
                }
                
                const anglePerPrize = 360 / totalPrizes;
                const currentRotation = (rotationRef.current % 360 + 360) % 360;
                const targetAngle = rotationRef.current + 
                    (10 + Math.floor(Math.random() * 3)) * 360 + 
                    (360 + anglePerPrize / 2 - 
                     (((prizeIndex - 1) % totalPrizes + totalPrizes) % totalPrizes * anglePerPrize + anglePerPrize / 2) + 
                     0 - currentRotation) % 360;
                
                turnplateRef.current.style.willChange = "transform";
                turnplateRef.current.style.transition = "transform 7.5s cubic-bezier(0.25, 0.1, 0.25, 1)";
                turnplateRef.current.style.transform = `rotate(${targetAngle}deg)`;
                
                const handleTransitionEnd = () => {
                    rotationRef.current = targetAngle;
                    if (turnplateRef.current) {
                        turnplateRef.current.style.transition = "";
                        turnplateRef.current.style.willChange = "";
                        turnplateRef.current.removeEventListener("transitionend", handleTransitionEnd);
                    }
                    resolve();
                };
                
                turnplateRef.current.addEventListener("transitionend", handleTransitionEnd);
            } catch (error) {
                reject(error);
            }
        });
    }, []);
    
    return {
        turnplateRef,
        rotationRef,
        rotateTurnplate
    };
};

/**
 * ======================================================================
 * 10. 时间轴组件功能
 * ======================================================================
 */

// 时间格式化工具
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit'
    });
};

// 时间轴组件
const Timeline = ({ timelineData }) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    
    // 根据当前时间计算活跃的时间轴项
    React.useMemo(() => {
        if (!timelineData?.items || timelineData.items.length === 0) {
            return -1;
        }
        
        const currentTime = new Date();
        return timelineData.items.findIndex(item => {
            if (!item.startDate || !item.endDate) return false;
            
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            endDate.setHours(23, 59, 59, 999); // 设置为当天结束
            
            return currentTime >= startDate && currentTime <= endDate;
        });
    }, [timelineData?.items, timelineData?.timezone]);
    
    if (!timelineData?.visible || !timelineData?.items || timelineData.items.length === 0) {
        return null;
    }
    
    return (
        <TimelineContainer>
            <TimelineContent>
                <TimelineGrid>
                    {timelineData.items.map((item, index) => (
                        <TimelineItem 
                            key={`timeline-item-${index}`}
                            $isActive={index === activeIndex}
                        >
                            <TimelineIcon>
                                {index === 0 && <img src="/timeline-icon-1.webp" alt="timeline-icon-1" />}
                                {index === 1 && <img src="/timeline-icon-2.webp" alt="timeline-icon-2" />}
                                {index === 2 && <img src="/timeline-icon-3.webp" alt="timeline-icon-3" />}
                            </TimelineIcon>
                            <TimelineTitle>
                                {item.phaseTitle} | {formatDate(item.startDate)} – {formatDate(item.endDate)}
                            </TimelineTitle>
                            <TimelineDescription>
                                {item.description}
                            </TimelineDescription>
                        </TimelineItem>
                    ))}
                </TimelineGrid>
            </TimelineContent>
        </TimelineContainer>
    );
};

/**
 * ======================================================================
 * 11. 工具函数集合
 * ======================================================================
 */

// 布尔值优化Hook
const useBooleanMemo = (value) => {
    return React.useMemo(() => {
        return value === undefined || !!value;
    }, [value]);
};

// 数值限制函数
const clamp = (min, max, value) => {
    return Math.min(Math.max(value, min), max);
};

// AES加密函数（用于抽奖）
const encryptValue = (text, key, iv) => {
    // 这里应该是AES-128-CBC加密实现
    // 原代码使用了crypto-js库
    const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
    let encrypted = cipher.update(text, "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
};

// 邮箱验证函数
const validateEmail = (email) => {
    return EMAIL_REGEX.test(email);
};

/**
 * ======================================================================
 * 12. 主要导出
 * ======================================================================
 */

// 模块系统配置
}, function(webpackRequire) {
    // Webpack运行时配置
    webpackRequire.O(0, [
        6894, 1697, 9173, 853, 5298, 1297, 8157, 6072, 9849, 7882, 
        6171, 3014, 7626, 5599, 173, 2924, 1887, 6922, 9635, 3074, 
        2060, 8080, 2002, 8560, 6676, 8942, 6544, 3768, 1744
    ], function() {
        return webpackRequire(webpackRequire.s = 51319);
    });
    
    // 设置全局变量
    window._N_E = webpackRequire.O();
}]);

/**
 * ======================================================================
 * 总结和说明
 * ======================================================================
 * 
 * 这个JavaScript文件包含了以下主要功能：
 * 
 * 1. 🎯 轮盘抽奖系统
 *    - 邮箱验证和抽奖逻辑
 *    - 轮盘旋转动画
 *    - 错误处理和状态管理
 * 
 * 2. 🎨 React组件库
 *    - 箭头图标组件
 *    - 加载动画组件
 *    - 输入框组件
 *    - 时间轴组件
 * 
 * 3. 🎪 视差滚动轮播
 *    - 无限滚动动画
 *    - 拖拽交互支持
 *    - 响应式设计
 * 
 * 4. 🔧 工具函数
 *    - API请求管理
 *    - 邮箱验证
 *    - 时间格式化
 *    - 加密功能
 * 
 * 5. 📱 移动端适配
 *    - 触摸事件处理
 *    - 响应式布局
 *    - 性能优化
 * 
 * 主要技术栈：
 * - React Hooks
 * - Framer Motion动画
 * - Styled Components
 * - Webpack模块化
 * - 现代JavaScript ES6+
 * 
 * 反编译说明：
 * - 变量名已从单字母改为描述性名称
 * - 添加了详细的注释和文档
 * - 重新组织了代码结构
 * - 提取了常量和配置项
 * - 简化了复杂的嵌套逻辑
 * 
 * ======================================================================
 */

