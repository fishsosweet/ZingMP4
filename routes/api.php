<?php

use App\Http\Controllers\Admin\BaiHat\BaiHatController;
use App\Http\Controllers\Admin\CaSi\CaSiController;
use App\Http\Controllers\Admin\Login\apiLoginAdmin;
use App\Http\Controllers\Admin\Playlist\PlaylistController;
use App\Http\Controllers\Admin\TheLoai\TheLoaiController;
use App\Http\Controllers\User\BaiMoi\BaiMoiController;
use App\Http\Controllers\User\ChuDe\ChuDeController;
use App\Http\Controllers\User\Login\apiLoginUser;
use App\Http\Controllers\User\TrangChu\TrangChuController;
use App\Http\Controllers\User\ZingChart\ZingChartController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\User\ThongTinUser\ThongTinUser;
/*Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');*/


Route::post('auth/login', [apiLoginAdmin::class, 'getapiLoginAdmin']);

Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function () {
    //TheLoai
    Route::post('postTheLoai', [TheLoaiController::class, 'postTheLoai']);
    Route::get('getListTheLoai', [TheLoaiController::class, 'getList']);
    Route::post('postSuaTheLoai/{id}', [TheLoaiController::class, 'postCapNhatTheLoai']);
    Route::get('thongTinTheLoai/{id}', [TheLoaiController::class, 'getTheloai']);
    Route::delete('deleteTheLoai/{id}', [TheLoaiController::class, 'delete']);

    //CaSi
    Route::post('postCaSi', [CaSiController::class, 'postCaSi']);
    Route::get('getListCaSi', [CaSiController::class, 'getList']);
    Route::post('postSuaCaSi/{id}', [CaSiController::class, 'postCapNhatCaSi']);
    Route::get('thongTinCaSi/{id}', [CaSiController::class, 'getCaSi']);
    Route::delete('deleteCaSi/{id}', [CaSiController::class, 'delete']);

    //BaiHat
    Route::get('dsTheLoai', [BaiHatController::class, 'getTheLoai']);
    Route::get('dsCaSi', [BaiHatController::class, 'getCaSi']);
    Route::get('thongTinBaiHat/{id}', [BaiHatController::class, 'getBaiHat']);
    Route::post('postBaiHat', [BaiHatController::class, 'postBaiHat']);
    Route::get('getListBaiHat', [BaiHatController::class, 'getList']);
    Route::post('postSuaBaiHat/{id}', [BaiHatController::class, 'postCapNhatBaiHat']);
    Route::delete('deleteBaiHat/{id}', [BaiHatController::class, 'delete']);
    Route::get('choosePlaylists', [BaiHatController::class, 'getPlaylist']);
    Route::post('addBaiHatList', [BaiHatController::class, 'addBaiHatList']);

    //Playlist
    Route::get('thongTinPlaylist/{id}', [PlaylistController::class, 'getPlaylist']);
    Route::post('postPlaylist', [PlaylistController::class, 'postPlaylist']);
    Route::get('getListPlaylist', [PlaylistController::class, 'getList']);
    Route::get('playlists/{id}', [PlaylistController::class, 'getSong']);
    Route::delete('playlist/{playlist}/songs/{song}', [PlaylistController::class, 'deleteBaiHatOfPlaylist']);
    Route::post('postSuaPlaylist/{id}', [PlaylistController::class, 'postCapNhatPlaylist']);
    Route::delete('deletePlaylist/{id}', [PlaylistController::class, 'delete']);

    //Profile
    Route::get('/getAdminProfile', [apiLoginAdmin::class, 'getAdminProfile']);
});

Route::prefix('user')->group(function () {
    Route::post('login', [apiLoginUser::class, 'getapiLoginUser']);

    Route::middleware(['jwt.auth'])->group(function () {
        Route::get('/getThongTinUser', [apiLoginUser::class, 'getUserProfile']);
        Route::post('/playlist/create', [ThongTinUser::class, 'postPlayList']);
        Route::get('/getplaylist/{user}', [ThongTinUser::class, 'getPlaylist']);
        Route::get('/playlist/{playlistId}/songs', [ThongTinUser::class, 'getSongsInPlaylist']);
        Route::get('/check-like/{user}', [ThongTinUser::class, 'getLikedSongs']);
        Route::delete('/remove-like/{user}/{song}', [ThongTinUser::class, 'deleteLike']);
        Route::post('/add-like', [ThongTinUser::class, 'addLike']);
        Route::post('/getLikeSongsofUser', [ThongTinUser::class, 'getLikedSongsofUser']);
    });

    Route::get('getRandomSongs', [TrangChuController::class, 'getRandomSongs']);
    Route::get('zing-chart', [ZingChartController::class, 'zingChart']);
    Route::get('getPlaylistLofi', [ChuDeController::class, 'getPlaylistLofi']);
    Route::get('getPlaylistTrung', [ChuDeController::class, 'getPlaylistTrung']);
    Route::get('getPlaylistAuMy', [ChuDeController::class, 'getPlaylistAuMy']);
    Route::get('getPlaylistAll', [ChuDeController::class, 'getPlaylistAll']);
    Route::get('search/{query}', [TrangChuController::class, 'search1']);
    Route::get('search', [TrangChuController::class, 'search']);
    Route::get('getThongTinBaiHat/{id}', [TrangChuController::class, 'thongTinBaiHat']);
    Route::get('getThongTinCaSi/{id}', [TrangChuController::class, 'thongTinCaSi']);
    Route::post('nextSongs', [TrangChuController::class, 'getNextSongs']);
    Route::get('getPlaylist', [TrangChuController::class, 'getPlaylist']);
    Route::get('getSonginPlaylist/{id}', [TrangChuController::class, 'getSonginPlaylist']);
    Route::get('getNewSongs', [TrangChuController::class, 'getNewSongs']);
    Route::post('/BaiHat/{id}/tangLuotXem', [TrangChuController::class, 'tangLuotXem']);
    Route::get('/getTopBaiHat', [TrangChuController::class, 'getTopBaiHat']);
    Route::get('/getSong', [TrangChuController::class, 'getSong']);
    Route::get('/getRelatedSongs/{id}', [TrangChuController::class, 'getRelatedSongs']);
    Route::get('/get10NewSongs', [BaiMoiController::class, 'baiMoi']);
    Route::get('/getTop10', [ZingChartController::class, 'zingChart']);
});
