<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdmin extends Command
{
    protected $signature = 'create:admin
                            {email : Admin email address}
                            {--name=管理者 : Admin display name}';

    protected $description = 'Create an admin user account';

    public function handle(): int
    {
        $email = $this->argument('email');
        $name = $this->option('name');

        if (User::where('email', $email)->exists()) {
            $this->error("User with email {$email} already exists.");
            return self::FAILURE;
        }

        $password = $this->secret('Password');
        if (!$password || strlen($password) < 8) {
            $this->error('Password must be at least 8 characters.');
            return self::FAILURE;
        }

        User::create([
            'name' => $name,
            'email' => $email,
            'password' => Hash::make($password),
            'role' => 'admin',
        ]);

        $this->info("Admin user {$email} created successfully.");
        return self::SUCCESS;
    }
}
