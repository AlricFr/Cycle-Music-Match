// Define constants and endpoints
const AUTHORIZE = "https://accounts.spotify.com/authorize";
const TOKEN = "https://accounts.spotify.com/api/token";
const REDIRECT_URI = "http://127.0.0.1:5500/SignIn.html";
const CLIENT_ID = localStorage.getItem("client_id");
const CLIENT_SECRET = localStorage.getItem("client_secret");

// Async function for page load
async function onPageLoad() {
    // Check if there is a code in the URL
    if (window.location.search.length > 0) {
        handleRedirect();
    }
}

// Async function to handle redirect
async function handleRedirect() {
    const code = getCode();
    if (code) {
        await fetchAccessToken(code);
    }
    // Update URL
    window.history.pushState("", "", REDIRECT_URI);
}

// Function to generate code_verifier and code_challenge using PKCE
async function generateCodeChallenge() {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const randomValues = crypto.getRandomValues(new Uint8Array(64));
    const randomString = Array.from(randomValues).map((x) => possible[x % possible.length]).join('');

    const code_verifier = randomString;
    localStorage.setItem('code_verifier', code_verifier);

    const encoder = new TextEncoder();
    const data = encoder.encode(code_verifier);
    const hashed = await crypto.subtle.digest('SHA-256', data);
    const code_challenge_base64 = btoa(String.fromCharCode(...new Uint8Array(hashed)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return { code_verifier, code_challenge_base64 };
}

// Async function to fetch access token
async function fetchAccessToken(code) {
    const code_verifier = localStorage.getItem('code_verifier');
    const params = new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: code_verifier,
    });

    try {
        const response = await fetch(TOKEN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params,
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            localStorage.setItem('expires_in', data.expires_in);

            // Calculate and store token expiration time
            const now = Date.now();
            const expires = now + data.expires_in * 1000;
            localStorage.setItem('expires', expires);
        } else {
            throw new Error('Failed to fetch access token');
        }
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}

// Function to get code from URL query string
function getCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get('code');
}

// Function to request authorization
async function requestAuthorization() {
    // Get code challenge and verifier
    const { code_verifier, code_challenge_base64 } = await generateCodeChallenge();

    // Save code_verifier
    localStorage.setItem('code_verifier', code_verifier);

    // Build the authorization URL
    const url = new URL(AUTHORIZE);
    const params = {
        response_type: 'code',
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        scope: 'user-read-email playlist-read-private user-library-modify playlist-modify-private',
        code_challenge: code_challenge_base64,
        code_challenge_method: 'S256',
    };

    url.search = new URLSearchParams(params).toString();

    // Redirect user to the authorization URL
    window.location.href = url.toString();
}

// Initialize page load
onPageLoad();
