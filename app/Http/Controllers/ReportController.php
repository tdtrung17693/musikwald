<?php

namespace App\Http\Controllers;

use App\Report;
use App\Services\Reports\ReportsRepository;
use App\Track;
use Common\Core\Controller;
use Illuminate\Http\Request;
use Log;

class ReportController extends Controller
{
    private $repository;

    public function __construct(ReportsRepository $reportsRepository)
    {
        $this->repository = $reportsRepository;
    }

    public function index(Request $request)
    {
        return $this->repository->paginate($request->all());
    }

    public function update(Request $request)
    {
        $reportPayload = $request->get('report');
        $report = Report::findOrFail($reportPayload['id']);

        $viewed = $reportPayload['viewed'];

        $report->update(['viewed' => $viewed]);

        return $this->success($report);
    }

    public function destroy(Request $request)
    {
        $this->validate($request, [
            'ids'   => 'required|array',
            'ids.*' => 'required|integer'
        ]);

        return Report::destroy($request->get('ids'));
    }

    public function store(Request $request)
    {
        $report = $request->get('report');
        $type = $report['type'];

        if ($type < 0 || $type > 2) return $this->success();

        $content = $report['additional_info'];

        $report = \App\Report::create(['type' => $type, 'track_id' => $report['trackId'], 'additional_info' => $content]);

        return $this->success($report);
    }
}
