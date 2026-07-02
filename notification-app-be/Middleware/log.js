export const Log = async (stack, level, packageName, message) => {
  try {
    const payload = {
      stack,
      level,
      package: packageName,
      message,
    };

    console.log("Sending Log ");
    console.log(payload);

    const response = await fetch("http://localhost:3001/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Status:", response.status);

    const text = await response.text();
    let data = {};

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    console.log("Response:", data);

    
  } catch (error) {
    console.error("Failed to send log:", error.message);
  }
};
