<?php

use App\Models\EngagementEvent;
use Illuminate\Support\Facades\DB;

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

$kernel->bootstrap();

try {
    DB::table('engagement_events')->truncate();
    echo "All engagement events (views & likes) have been reset successfully.\n";
} catch (\Exception $e) {
    echo "Error resetting stats: " . $e->getMessage() . "\n";
}
