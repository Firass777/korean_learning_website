<?php

namespace App\Http\Controllers;

use App\Models\Vocab;
use Illuminate\Http\Request;

class VocabController extends Controller
{
    public function index()
    {
        try {
            $vocabs = Vocab::all();
            return response()->json([
                'success' => true,
                'data' => $vocabs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch vocabulary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            if ($request->has('words')) {
                $request->validate([
                    'words' => 'required|array',
                    'words.*.korean' => 'required|string|max:255',
                    'words.*.english' => 'required|string|max:255'
                ]);

                $createdVocabs = [];
                foreach ($request->words as $word) {
                    $vocab = Vocab::create($word);
                    $createdVocabs[] = $vocab;
                }

                return response()->json([
                    'success' => true,
                    'data' => $createdVocabs,
                    'message' => count($createdVocabs) . ' words created successfully'
                ], 201);
            } else {
                $request->validate([
                    'korean' => 'required|string|max:255',
                    'english' => 'required|string|max:255'
                ]);

                $vocab = Vocab::create($request->all());
                
                return response()->json([
                    'success' => true,
                    'data' => $vocab
                ], 201);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create vocabulary',
                'error' => $e->getMessage()
            ], 500);
        }
    }

      public function getRandomWords($count)
    {
        try {
            $words = Vocab::inRandomOrder()->limit($count)->get();
            return response()->json([
                'success' => true,
                'data' => $words
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch random words',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRandomWord()
    {
        try {
            $word = Vocab::inRandomOrder()->first();
            return response()->json([
                'success' => true,
                'data' => $word
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch random word',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getWordsForQuiz($count)
    {
        try {
            $correctWords = Vocab::inRandomOrder()->limit($count)->get();
            $incorrectWords = Vocab::whereNotIn('id', $correctWords->pluck('id'))
                                ->inRandomOrder()
                                ->limit($count * 3)
                                ->get();

            $quizWords = $correctWords->map(function ($word) use ($incorrectWords) {
                $options = $incorrectWords->where('id', '!=', $word->id)
                                        ->random(3)
                                        ->pluck('english')
                                        ->push($word->english)
                                        ->shuffle();

                return [
                    'id' => $word->id,
                    'korean' => $word->korean,
                    'correct_answer' => $word->english,
                    'options' => $options
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $quizWords
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate quiz',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}