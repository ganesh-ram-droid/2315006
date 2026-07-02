

const LOG_URL = "http://4.224.186.213/evaluation-service/logs";

export const SendLog = async (req, res) => {
    const { stack, level, package: packageName, message } = req.body;
    const token = process.env.TOKEN || process.env.ACCESS_TOKEN;

    if (!token) {
        return res.status(500).json({ error: "Missing logging API token" });
    }

    try {
        const response = await fetch(LOG_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                stack,
                level,
                package: packageName,
                message
            })
        });

        const text = await response.text();
        let data = {};

        if (text) {
            try {
                data = JSON.parse(text);
            } catch {
                data = { message: text };
            }
        }
        console.log(data)
        return res.status(response.status).json(data);
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: "Failed to send log" });
    }
};
