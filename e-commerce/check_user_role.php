<?php

use App\Models\User;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$email = 'cahyadi.informatics@gmail.com';

echo "Checking for user: $email\n";

$user = User::where('email', $email)->first();

if ($user) {
    echo "ID: {$user->id}\n";
    echo "Name: {$user->name}\n";
    echo "Email: {$user->email}\n";
    echo "Role: {$user->role}\n";
    echo "WorkOS ID: {$user->workos_id}\n";
} else {
    echo "User not found.\n";
}
