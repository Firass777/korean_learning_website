<?php

namespace App\Http\Controllers;

use App\Models\Paragraph;
use Illuminate\Http\Request;

class ParagraphController extends Controller
{
    public function index()
    {
        try {
            $paragraphs = Paragraph::orderBy('created_at', 'desc')->get();
            return response()->json([
                'success' => true,
                'data' => $paragraphs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch paragraphs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'korean' => 'required|string',
            'english' => 'required|string'
        ]);

        try {
            $paragraph = Paragraph::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Paragraph added successfully',
                'data' => $paragraph
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add paragraph',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}