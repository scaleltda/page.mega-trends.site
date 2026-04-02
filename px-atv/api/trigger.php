<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get POST data
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['pixelId']) || !isset($data['accessToken']) || !isset($data['eventData'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'error' => 'Missing required parameters',
        'received' => $data
    ]);
    exit;
}

$requestData = [
    'event_source' => 'web',
    'event_source_id' => $data['pixelId'],
    'data' => [$data['eventData']]
];

// Initialize cURL session
$ch = curl_init('https://business-api.tiktok.com/open_api/v1.3/event/track/');

// Set cURL options
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Access-Token: ' . $data['accessToken']
    ],
    CURLOPT_POSTFIELDS => json_encode($requestData),
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2
]);

// Execute request
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

// Check for cURL errors
if (curl_errno($ch)) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'cURL Error: ' . curl_error($ch),
        'errno' => curl_errno($ch)
    ]);
    exit;
}

curl_close($ch);

// Forward TikTok's response with the original HTTP code
http_response_code($httpCode);
echo $response;