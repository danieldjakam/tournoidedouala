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
        Schema::create('matches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_1_id')->constrained('teams')->cascadeOnDelete();
            $table->foreignId('team_2_id')->constrained('teams')->cascadeOnDelete();
            $table->dateTime('date_match');
            $table->string('lieu')->nullable();
            $table->enum('statut', ['planifie', 'en_cours', 'termine'])->default('planifie');
            $table->integer('score_team_1')->nullable();
            $table->integer('score_team_2')->nullable();
            $table->string('homme_du_match_id')->nullable();
            $table->boolean('compo_publique')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('matches');
    }
};
