#!/bin/bash

# ==========================================
# SSL 证书自动续期脚本 (CentOS/RHEL)
# ==========================================

LOG_FILE="/var/log/certbot-renew.log"

get_time() { date "+%Y-%m-%d %H:%M:%S"; }

echo "==========================================" >> "$LOG_FILE"
echo "[$(get_time)] === 开始执行智能续期检查 ===" >> "$LOG_FILE"

# 标记是否有证书需要续期
NEED_RENEW=0

# 1. 遍历检查所有证书的有效期
echo "[$(get_time)] 正在检查证书有效期..." >> "$LOG_FILE"

# 遍历 /etc/letsencrypt/live/ 下的每一个目录（每个目录代表一个证书）
for cert_dir in /etc/letsencrypt/live/*; do
    if [ -d "$cert_dir" ]; then
        domain=$(basename "$cert_dir")
        cert_file="$cert_dir/cert.pem"
        
        # 跳过非证书目录（如 README）
        if [ ! -f "$cert_file" ]; then continue; fi

        # 使用 openssl 获取到期时间
        end_date_str=$(openssl x509 -in "$cert_file" -noout -enddate | cut -d= -f2)
        # 将时间转换为秒数 (时间戳)
        end_epoch=$(date +%s -d "$end_date_str")
        now_epoch=$(date +%s)
        # 计算剩余天数
        days_left=$(( ($end_epoch - $now_epoch) / 86400 ))

        if [ $days_left -le 30 ]; then
            echo "[$(get_time)] [准备续期] 域名: $domain | 剩余: $days_left 天 (≤30) | 到期: $end_date_str" >> "$LOG_FILE"
            NEED_RENEW=1
        else
            echo "[$(get_time)] [无需续期] 域名: $domain | 剩余: $days_left 天 (>30) | 到期: $end_date_str" >> "$LOG_FILE"
        fi
    fi
done

# 2. 执行 Certbot Renew
echo "[$(get_time)] --------------------------------" >> "$LOG_FILE"
echo "[$(get_time)] 执行 certbot renew 命令..." >> "$LOG_FILE"

# 去掉 --quiet，保留详细日志以便排查问题
/usr/bin/certbot renew >> "$LOG_FILE" 2>&1
RENEW_STATUS=$?

echo "[$(get_time)] --------------------------------" >> "$LOG_FILE"

# 3. 结果判断与汇总
if [ $RENEW_STATUS -eq 0 ]; then
    if [ $NEED_RENEW -eq 1 ]; then
        echo "[$(get_time)] ✅ 续期操作执行完毕，请检查上方日志确认是否成功。" >> "$LOG_FILE"
        
        # 重载 Nginx (无中断) 以应用新证书
        echo "[$(get_time)] 🔄 正在重载 Nginx..." >> "$LOG_FILE"

        /usr/sbin/nginx -s reload
        
        if [ $? -eq 0 ]; then
            echo "[$(get_time)] ✅ Nginx 重载成功" >> "$LOG_FILE"
        else
            echo "[$(get_time)] ❌ Nginx 重载失败" >> "$LOG_FILE"
        fi
    else
        echo "[$(get_time)] ⏭️ 所有证书有效期充足，Certbot 已跳过续期。" >> "$LOG_FILE"
    fi
else
    echo "[$(get_time)] ❌ Certbot 执行出错！请立即检查日志。" >> "$LOG_FILE"
fi

echo "[$(get_time)] === 任务结束 ===" >> "$LOG_FILE"
echo "==========================================" >> "$LOG_FILE"