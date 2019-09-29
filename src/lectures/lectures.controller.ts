import { Controller, Post, Body } from '@nestjs/common';
import { LecturesService } from './lectures.service';
import { Lectures } from './lecture.model';

@Controller('lectures')
export class LecturesController {
    constructor(private lectureService: LecturesService) {}

    @Post()
    createTracks(@Body() body) {
        return this.lectureService.createTracks(body);
    }
}