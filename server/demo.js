const debugFetchShopifyCustomer = async () => {
  const url =
    "https://admin-qa.awolvision.com/prod-api/email/getShopifyCustomerAwolEu";

  const requestBody = {
    email: "test1739@gmail.com",
    tags: ["ces_2026"],
  };

  const headers = {
    accept: "*/*",
    "accept-language": "zh-CN,zh;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/json",
    pragma: "no-cache",
    "sec-ch-ua":
      '"Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
  };

  try {
    console.log("Starting fetch request to Shopify customer API...");
    const response = await fetch(url, {
      headers,
      referrer: "https://awolvision.de/",
      body: JSON.stringify(requestBody),
      method: "POST",
      mode: "cors",
      credentials: "omit",
    });

    console.log("Response status:", response.status);

    const contentType = response.headers.get("content-type");
    let responseData;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    console.log("Response data:", responseData);

    return responseData;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

// 调用调试方法
debugFetchShopifyCustomer();
