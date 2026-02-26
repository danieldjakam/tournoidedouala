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
        Schema::create('votes_tournament', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('tournament_id')->nullable()->comment('futur tournoi unique');
            $table->foreignId('team_vote_id')->constrained('teams')->cascadeOnDelete();
            $table->integer('points')->default(0);
            $table->boolean('validated')->default(false);
            $table->timestamps();

            $table->unique(['user_id', 'tournament_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('votes_tournament');
    }
};
