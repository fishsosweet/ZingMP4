<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserGoiVip extends Model
{
    protected $table = 'user_goi_vip';

    protected $fillable = [
        'id',
        'user_id',
        'goi_vip_id',
        'ngay_dang_ky',
        'ngay_het_han',
        'trangthai',
        'transaction_code',
        'tien',
        'created_at',
        'updated_at',
        ];

}
