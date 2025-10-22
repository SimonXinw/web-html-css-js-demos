/**
 * ======================================================================
 * 控制台直接执行抽奖请求脚本
 * 功能：动态加载加密库，执行加密抽奖请求
 * 使用方法：在浏览器控制台直接粘贴执行
 * ======================================================================
 */

(async function () {
  "use strict";

  console.log("🎲 开始加载抽奖请求脚本...");

  /**
   * ======================================================================
   * 1. 动态加载CryptoJS库
   * ======================================================================
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // 检查是否已经加载
      if (window.CryptoJS) {
        console.log("✅ CryptoJS已存在，跳过加载");
        resolve();

        return;
      }

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        console.log("✅ CryptoJS加载成功");
        resolve();
      };
      script.onerror = (error) => {
        console.error("❌ CryptoJS加载失败:", error);
        reject(error);
      };
      document.head.appendChild(script);
    });
  }

  /**
   * ======================================================================
   * 2. AES加密函数
   * ======================================================================
   */
  function encryptValue(text, key, iv) {
    try {
      // 模拟原始代码的加密方式：tc().createCipheriv("aes-128-cbc", t, i)
      // 使用CryptoJS模拟Node.js crypto模块的行为

      // 将字符串转换为CryptoJS的WordArray
      const keyWordArray = CryptoJS.enc.Utf8.parse(key);
      const ivWordArray = CryptoJS.enc.Utf8.parse(iv);
      const textWordArray = CryptoJS.enc.Utf8.parse(text);

      // 手动实现与原始代码相同的加密流程
      // 原始: n.update(e, "utf8", "base64") + n.final("base64")
      const encrypted = CryptoJS.AES.encrypt(textWordArray, keyWordArray, {
        iv: ivWordArray,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // 直接返回Base64字符串，与原始代码保持一致
      return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    } catch (error) {
      console.error("❌ 加密失败:", error);
      throw error;
    }
  }

  /**
   * ======================================================================
   * 3. 抽奖请求函数
   * ======================================================================
   */
  async function executeLotteryRequest(email, options = {}) {
    const { activityId = 2, locale = "SITE_GLOBAL" } = options;

    console.log(`🎯 开始为邮箱 ${email} 执行抽奖请求...`);

    try {
      // 加密参数配置
      const encryptionConfig = {
        key: "valerionijklmnop", // 16字节密钥
        iv: "1314567890123456", // 16字节初始化向量
      };

      // 生成加密值
      const encryptedEmail = encryptValue(
        email,
        encryptionConfig.key,
        encryptionConfig.iv
      );
      console.log(`🔐 邮箱加密结果: ${encryptedEmail}`);

      // 构建请求体
      const requestBody = {
        url: "/system/wheelLotteryWinning/prizeDraw",
        method: "POST",
        email: email,
        activityId: activityId,
        locale: locale,
        encryptValue: encryptedEmail,
      };

      console.log("📤 请求体:", requestBody);

      // 执行请求
      const response = await fetch(
        "https://www.valerion.com/api/backEnd/admin",
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh,en;q=0.9,zh-CN;q=0.8",
            "content-type": "application/json",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
          referrer: "https://www.valerion.com/global/visionMaster",
          body: JSON.stringify(requestBody),
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      );

      // 处理响应
      if (!response.ok) {
        throw new Error(`HTTP错误! 状态: ${response.status}`);
      }

      const result = await response.json();
      console.log("📥 服务器响应:", result);

      // 解析响应结果
      if (result.code === 200 && result.data) {
        const lotteryResult = result.data;

        switch (lotteryResult.status) {
          case 0: // SUCCESS
            console.log("🎉 抽奖成功!");
            console.log(`🏆 奖品名称: ${lotteryResult.prizeName}`);
            console.log(`🎫 优惠码: ${lotteryResult.discountCode}`);
            console.log(`📝 用户说明: ${lotteryResult.userNote}`);
            break;

          case 1: // EMAIL_ALREADY_SUBMITTED
            console.log("⚠️ 该邮箱已经参与过抽奖");
            break;

          case 2: // IP_LARGE_THAN_THREE
            console.log("⚠️ 该IP已经参与抽奖3次，请稍后再试");
            break;

          case 3: // ALL_PRIZES_CLAIMED
            console.log("⚠️ 太迟了！所有奖品都已被领取");
            break;

          default:
            console.log("❌ 抽奖失败，未知状态:", lotteryResult.status);
        }

        return lotteryResult;
      } else {
        console.log("❌ 请求失败:", result.message || "未知错误");
        return null;
      }
    } catch (error) {
      console.error("❌ 请求执行失败:", error);
      throw error;
    }
  }

  /**
   * ======================================================================
   * 4. 批量抽奖函数
   * ======================================================================
   */
  async function executeBatchLottery(emails, options = {}) {
    const {
      delay = 1000, // 每次请求间隔(毫秒)
      ...requestOptions
    } = options;

    console.log(`🎯 开始批量抽奖，共 ${emails.length} 个邮箱`);

    const results = [];

    for (let i = 0; i < emails.length; i++) {
      const email = emails[i];
      console.log(`\n📧 处理第 ${i + 1}/${emails.length} 个邮箱: ${email}`);

      try {
        const result = await executeLotteryRequest(email, requestOptions);
        results.push({
          email,
          success: true,
          result,
        });

        // 延迟以避免请求过于频繁
        if (i < emails.length - 1 && delay > 0) {
          console.log(`⏰ 等待 ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      } catch (error) {
        console.error(`❌ 邮箱 ${email} 抽奖失败:`, error.message);
        results.push({
          email,
          success: false,
          error: error.message,
        });
      }
    }

    console.log("\n📊 批量抽奖结果汇总:");
    results.forEach((result, index) => {
      if (result.success) {
        console.log(`✅ ${result.email}: 成功`);
      } else {
        console.log(`❌ ${result.email}: 失败 - ${result.error}`);
      }
    });

    return results;
  }

  /**
   * ======================================================================
   * 5. 邮箱验证函数
   * ======================================================================
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * ======================================================================
   * 6. 动态邮箱生成器
   * ======================================================================
   */
  let emailCounter = 100; // 从100开始

  function generateEmail() {
    const email = `test${emailCounter}@qq.com`;
    emailCounter++;
    return email;
  }

  function generateEmails(count) {
    const emails = [];
    for (let i = 0; i < count; i++) {
      emails.push(generateEmail());
    }
    return emails;
  }

  function resetEmailCounter(startNumber = 100) {
    emailCounter = startNumber;
    console.log(`📧 邮箱计数器重置为: ${startNumber}`);
  }

  function getCurrentEmailNumber() {
    return emailCounter;
  }

  /**
   * ======================================================================
   * 7. 主执行流程
   * ======================================================================
   */
  try {
    // 动态加载CryptoJS
    await loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"
    );

    // 验证CryptoJS是否加载成功
    if (!window.CryptoJS) {
      throw new Error("CryptoJS加载失败");
    }

    console.log("✅ 所有依赖加载完成");

    // 将函数暴露到全局作用域，方便控制台调用
    window.lotteryUtils = {
      // 单次抽奖
      draw: executeLotteryRequest,

      // 批量抽奖
      batchDraw: executeBatchLottery,

      // 邮箱验证
      validateEmail: validateEmail,

      // 加密函数
      encrypt: encryptValue,

      // 邮箱生成器
      generateEmail: generateEmail,
      generateEmails: generateEmails,
      resetEmailCounter: resetEmailCounter,
      getCurrentEmailNumber: getCurrentEmailNumber,

      // 快速测试（使用动态生成的邮箱）
      test: async function () {
        const testEmail = generateEmail();
        console.log(`🧪 使用动态生成的邮箱进行抽奖: ${testEmail}`);
        return await executeLotteryRequest(testEmail);
      },

      // 批量测试（自动生成指定数量的邮箱）
      testBatch: async function (count = 5, options = {}) {
        const emails = generateEmails(count);
        console.log(`🧪 批量测试，生成 ${count} 个邮箱:`, emails);
        return await executeBatchLottery(emails, options);
      },

      // 连续抽奖（指定起始编号和数量）
      autoLottery: async function (
        startNumber = null,
        count = 1,
        options = {}
      ) {
        if (startNumber !== null) {
          resetEmailCounter(startNumber);
        }

        const emails = generateEmails(count);
        console.log(
          `🎯 自动抽奖模式，从 ${emails[0]} 开始，共 ${count} 个邮箱`
        );
        return await executeBatchLottery(emails, options);
      },

      // 测试加密结果（与给定示例对比）
      testEncryption: function (email, _expectedResult) {
        const testEmail = email;
        const expectedResult = _expectedResult;
        const actualResult = encryptValue(
          testEmail,
          "valerionijklmnop",
          "1314567890123456"
        );

        console.log("🔐 加密测试:");
        console.log(`输入邮箱: ${testEmail}`);
        console.log(`期望结果: ${expectedResult}`);
        console.log(`实际结果: ${actualResult}`);
        console.log(
          `结果匹配: ${actualResult === expectedResult ? "✅ 成功" : "❌ 失败"}`
        );

        return {
          input: testEmail,
          expected: expectedResult,
          actual: actualResult,
          match: actualResult === expectedResult,
        };
      },
    };

    console.log("\n🎉 抽奖脚本加载完成！");
    console.log("\n📖 使用方法:");
    console.log('1. 单次抽奖: lotteryUtils.draw("your@email.com")');
    console.log(
      '2. 批量抽奖: lotteryUtils.batchDraw(["email1@qq.com", "email2@qq.com"])'
    );
    console.log('3. 邮箱验证: lotteryUtils.validateEmail("test@qq.com")');
    console.log("4. 快速测试: lotteryUtils.test() // 自动生成test100@qq.com");
    console.log(
      '5. 直接加密: lotteryUtils.encrypt("test@qq.com", "valerionijklmnop", "1314567890123456")'
    );
    console.log("\n📧 邮箱生成器:");
    console.log(
      "6. 生成单个邮箱: lotteryUtils.generateEmail() // test100@qq.com, test101@qq.com..."
    );
    console.log(
      "7. 生成多个邮箱: lotteryUtils.generateEmails(5) // 生成5个连续邮箱"
    );
    console.log(
      "8. 重置计数器: lotteryUtils.resetEmailCounter(200) // 从test200@qq.com开始"
    );
    console.log("9. 查看当前编号: lotteryUtils.getCurrentEmailNumber()");
    console.log(
      "10. 批量测试: lotteryUtils.testBatch(10) // 自动生成10个邮箱并抽奖"
    );
    console.log(
      "11. 自动抽奖: lotteryUtils.autoLottery(500, 20) // 从test500@qq.com开始，连续20个"
    );
    console.log(
      "12. 测试加密: lotteryUtils.testEncryption() // 验证加密算法正确性"
    );

    console.log("\n🎯 示例用法:");
    console.log("// 单次动态抽奖");
    console.log("lotteryUtils.test();");
    console.log("// 批量抽奖10个");
    console.log("lotteryUtils.testBatch(10);");
    console.log("// 从test500@qq.com开始，连续抽奖50个");
    console.log("lotteryUtils.autoLottery(500, 50);");

    // 显示当前邮箱编号
    console.log(
      `\n📧 当前邮箱计数器: ${getCurrentEmailNumber()} (下一个邮箱: test${getCurrentEmailNumber()}@qq.com)`
    );

    // 执行一次测试示例（可选）
    console.log("\n🚀 执行测试抽奖...");
    const testResult = await window.lotteryUtils.test();
  } catch (error) {
    console.error("❌ 脚本初始化失败:", error);
  }
})();

/**
 * ======================================================================
 * 使用示例和说明
 * ======================================================================
 *
 * 1. 直接在控制台粘贴执行此脚本
 * 2. 脚本会自动加载CryptoJS库
 * 3. 使用提供的工具函数进行抽奖
 *
 * 主要功能：
 * - ✅ 自动加载加密依赖
 * - ✅ AES-128-CBC邮箱加密
 * - ✅ 完整的抽奖请求流程
 * - ✅ 错误处理和状态解析
 * - ✅ 批量抽奖支持
 * - ✅ 邮箱格式验证
 *
 * 安全特性：
 * - 🔐 邮箱地址AES加密保护
 * - 🛡️ 完整的请求头模拟
 * - ⚡ 智能延迟避免频率限制
 *
 * ======================================================================
 */
