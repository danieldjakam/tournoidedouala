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
        Schema::create('point_systems', function (Blueprint $table) {
            $table->id();
            $table->integer('points_vote_equipe')->default(10);
            $table->integer('points_homme_match')->default(5);
            $table->integer('points_vainqueur_tournoi')->default(50);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('point_systems');
    }
};
