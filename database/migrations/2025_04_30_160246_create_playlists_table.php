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
        Schema::create('playlists', function (Blueprint $table) {
            $table->id();
            $table->string('ten_playlist');
            $table->unsignedBigInteger('user_id')->nullable();
            $table->unsignedBigInteger('theloai_id')->nullable();
            $table->boolean('trangthai')->default(true);
            $table->string('anh')->nullable();
            $table->timestamps();

            $table->foreign('theloai_id')->references('id')->on('theloai')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('playlists');
    }
};
