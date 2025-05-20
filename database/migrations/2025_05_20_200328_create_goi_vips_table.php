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
        Schema::create('goi_vips', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('gia');
            $table->unsignedTinyInteger('thoi_han');
            $table->Integer('trangthai')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('goi_vips');
    }
};
