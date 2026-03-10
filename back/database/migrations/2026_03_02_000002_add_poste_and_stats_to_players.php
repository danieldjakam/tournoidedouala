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
        Schema::table('players', function (Blueprint $table) {
            $table->string('poste')->nullable()->after('numero');
            $table->integer('age')->nullable()->after('poste');
            $table->integer('buts')->default(0)->after('age');
            $table->boolean('est_capitaine')->default(false)->after('buts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('players', function (Blueprint $table) {
            $table->dropColumn(['poste', 'age', 'buts', 'est_capitaine']);
        });
    }
};
