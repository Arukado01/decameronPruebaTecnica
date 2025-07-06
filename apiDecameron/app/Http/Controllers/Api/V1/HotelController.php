<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreHotelRequest;
use App\DTO\HotelData;
use App\Services\HotelService;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Requests\UpdateHotelRequest;

class HotelController extends Controller
{

    public function __construct(private readonly HotelService $svc) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->svc->list());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreHotelRequest $req)
    {
        $hotel = $this->svc->create(HotelData::fromArray($req->validated()));
        return response()->json($hotel, Response::HTTP_CREATED);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateHotelRequest $req, int $id)
    {
        return $this->svc->update($id, HotelData::fromArray($req->validated()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(int $id)
    {
        $this->svc->delete($id);
        return response()->noContent();
    }
}
