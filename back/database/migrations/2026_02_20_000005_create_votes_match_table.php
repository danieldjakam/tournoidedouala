<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('votes_match', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('match_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_vote_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('player_vote_id')->nullable()->constrained('players')->cascadeOnDelete();
            $table->integer('points')->default(0);
            $table->boolean('validated')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'match_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes_match');
    }
};
