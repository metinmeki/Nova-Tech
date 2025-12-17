<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

function clean($data) {
    return htmlspecialchars(strip_tags(trim($data)));
}

$name = clean($_POST['name'] ?? '');
$phone = clean($_POST['phone'] ?? '');
$email = clean($_POST['email'] ?? '');
$message = clean($_POST['message'] ?? '');

$errors = [];

if (strlen($name) < 2) $errors[] = "الاسم قصير جداً";
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = "البريد غير صحيح";
if (strlen($phone) < 10) $errors[] = "رقم الهاتف غير صحيح";
if (strlen($message) < 10) $errors[] = "الرسالة قصيرة جداً";

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

// حفظ في CSV
$csv_file = 'contacts.csv';
if (!file_exists($csv_file)) {
    $fp = fopen($csv_file, 'w');
    fprintf($fp, chr(0xEF).chr(0xBB).chr(0xBF));
    fputcsv($fp, ['التاريخ', 'الاسم', 'الهاتف', 'البريد', 'الرسالة']);
    fclose($fp);
}

$fp = fopen($csv_file, 'a');
fputcsv($fp, [date('Y-m-d H:i:s'), $name, $phone, $email, $message]);
fclose($fp);

// حفظ في JSON
$json_file = 'contacts.json';
$contacts = file_exists($json_file) ? json_decode(file_get_contents($json_file), true) : [];
$contacts[] = [
    'id' => time(),
    'date' => date('Y-m-d H:i:s'),
    'name' => $name,
    'phone' => $phone,
    'email' => $email,
    'message' => $message
];
file_put_contents($json_file, json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// إرسال البريد (اختياري)
$to = "metinmeki99@gmail.com";
$subject = "رسالة جديدة من $name - Nova Tech";
$email_body = "التاريخ: " . date('Y-m-d H:i:s') . "\n\n";
$email_body .= "الاسم: $name\n";
$email_body .= "الهاتف: $phone\n";
$email_body .= "البريد: $email\n\n";
$email_body .= "الرسالة:\n$message";

$headers = "From: Nova Tech <noreply@novatech.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to, $subject, $email_body, $headers);

echo json_encode([
    'success' => true,
    'message' => 'تم إرسال رسالتك بنجاح! 🎉 شكراً لتواصلك مع Nova Tech'
]);
?>