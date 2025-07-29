<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\VocabController;


Route::post('/register', [UsersController::class, 'register']);
Route::post('/login', [UsersController::class, 'login']);


Route::get('/vocab', [VocabController::class, 'index']);
Route::post('/vocab', [VocabController::class, 'store']);

Route::get('/vocab/random/{count}', [VocabController::class, 'getRandomWords']);
Route::get('/vocab/random', [VocabController::class, 'getRandomWord']);
Route::get('/vocab/quiz/{count}', [VocabController::class, 'getWordsForQuiz']);