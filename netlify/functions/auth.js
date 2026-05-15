export async function handler(event) {
  let code;

  // 🔥 gérer les 2 cas (GET + POST)
  if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    code = body.code;
  } else {
    code = event.queryStringParameters.code;
  }

  if (!code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No code provided" }),
    };
  }

  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}